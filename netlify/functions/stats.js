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
      totals[name] = (totals[name] ?? 0) + 1;
      byDay[date][name] = (byDay[date][name] ?? 0) + 1;
    }
  }

  return { totals, byDay };
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

  return new Response(JSON.stringify({ totals, by_day: byDay }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/stats' };
