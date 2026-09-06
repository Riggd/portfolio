import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

function checkAuth(req) {
  const expected = process.env.STATS_TOKEN ?? '';
  if (!expected) return 503;

  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Basic ')) return 401;

  const decoded = atob(auth.slice(6));
  const password = decoded.slice(decoded.indexOf(':') + 1);

  if (
    password.length !== expected.length ||
    !timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  ) return 401;

  return 200;
}

async function fetchCounts(store, dateKeys) {
  const listings = await Promise.all(
    dateKeys.map(date => store.list({ prefix: `${date}/` }))
  );

  let allKeys = [];
  const keyRanges = [];
  for (let i = 0; i < dateKeys.length; i++) {
    const dayKeys = listings[i].blobs.map(b => b.key);
    keyRanges.push({ start: allKeys.length, length: dayKeys.length, date: dateKeys[i] });
    allKeys = allKeys.concat(dayKeys);
  }

  const rawValues = await Promise.all(allKeys.map(key => store.get(key)));

  const totals = {};
  const byDay = {};
  for (const { start, length, date } of keyRanges) {
    byDay[date] = {};
    for (const raw of rawValues.slice(start, start + length)) {
      if (!raw) continue;
      let name;
      try { name = JSON.parse(raw).e; } catch { name = raw; }
      if (!name) continue;
      totals[name] = (totals[name] ?? 0) + 1;
      byDay[date][name] = (byDay[date][name] ?? 0) + 1;
    }
  }

  return { totals, byDay };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(days, dateKeys, byDay, totals) {
  const labels = [...dateKeys].reverse();
  const pageViewsPerDay = labels.map(d => {
    const day = byDay[d] ?? {};
    return Object.entries(day)
      .filter(([k]) => k.startsWith('page_view:'))
      .reduce((sum, [, v]) => sum + v, 0);
  });

  const tableRows = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([event, count]) => `<tr><td>${escapeHtml(event)}</td><td>${escapeHtml(count)}</td></tr>`)
    .join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stats — last ${days} days</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f0f0f; color: #e5e5e5; padding: 2rem; }
    h1 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #fff; }
    h2 { font-size: .875rem; color: #888; font-weight: 500; margin-bottom: .75rem; text-transform: uppercase; letter-spacing: .05em; }
    .chart-wrap { max-width: 900px; margin-bottom: 2.5rem; }
    table { border-collapse: collapse; max-width: 640px; width: 100%; }
    th, td { text-align: left; padding: .4rem .75rem; border-bottom: 1px solid #1e1e1e; font-size: .875rem; }
    th { color: #666; font-weight: 500; }
    td:last-child { text-align: right; font-variant-numeric: tabular-nums; color: #aaa; }
  </style>
</head>
<body>
  <h1>Stats — last ${days} days</h1>
  <div class="chart-wrap">
    <h2>Page views / day</h2>
    <canvas id="chart"></canvas>
  </div>
  <h2>All events</h2>
  <table>
    <thead><tr><th>Event</th><th>Count</th></tr></thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  <script>
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{ label: 'Page views', data: ${JSON.stringify(pageViewsPerDay)}, backgroundColor: '#6366f1', borderRadius: 3 }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#666' }, grid: { color: '#1a1a1a' } },
          y: { ticks: { color: '#666', stepSize: 1 }, grid: { color: '#1a1a1a' }, beginAtZero: true }
        }
      }
    });
  </script>
</body>
</html>`;
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const authStatus = checkAuth(req);
  if (authStatus === 503) return new Response(null, { status: 503 });
  if (authStatus === 401) {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Stats"' },
    });
  }

  const url = new URL(req.url);
  const days = Math.min(parseInt(url.searchParams.get('days') ?? '7', 10) || 7, 90);

  const dateKeys = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    return date.toISOString().slice(0, 10);
  });

  const store = getStore('events');
  const { totals, byDay } = await fetchCounts(store, dateKeys);

  const accept = req.headers.get('accept') ?? '';
  if (accept.includes('text/html')) {
    return new Response(buildHtml(days, dateKeys, byDay, totals), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify({ totals, by_day: byDay }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/stats' };
