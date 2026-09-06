# Stats Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add HTTP Basic Auth, an HTML visualization dashboard, and per-event timestamps to the portfolio's self-hosted stats system.

**Architecture:** All changes are confined to two Netlify Functions (`event.js`, `stats.js`). Auth switches from a query-param token to HTTP Basic Auth header. The stats function gains content negotiation — HTML dashboard for browsers, JSON for programmatic access. Events gain a timestamp stored as JSON alongside the event name, with a fallback for existing plain-string blobs.

**Tech Stack:** Netlify Functions (ESM), `@netlify/blobs`, Node 24 `node:test` for tests, Chart.js 4 via CDN for the dashboard.

---

## File Map

| File | Change |
|------|--------|
| `netlify/functions/stats.js` | Replace token auth → Basic Auth; add content negotiation; parse JSON blob values |
| `netlify/functions/event.js` | Store `{ e, t }` JSON instead of plain string |
| `netlify/functions/stats.test.js` | **Create** — tests for auth and content negotiation |
| `netlify/functions/event.test.js` | **Create** — tests for event storage format |
| `package.json` | Add `"test"` script |

---

### Task 1: HTTP Basic Auth + test infrastructure

**Files:**
- Modify: `package.json`
- Modify: `netlify/functions/stats.js`
- Create: `netlify/functions/stats.test.js`

- [ ] **Step 1: Add test script to package.json**

Change the `"test"` value in the `"scripts"` block:

```json
"test": "node --test netlify/functions/*.test.js"
```

- [ ] **Step 2: Write failing tests for Basic Auth**

Create `netlify/functions/stats.test.js`:

```js
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

await mock.module('@netlify/blobs', {
  namedExports: {
    getStore: () => ({
      list: async () => ({ blobs: [] }),
      get: async () => null,
    }),
  },
});

const { default: handler } = await import('./stats.js');

const TOKEN = 'test-secret';
const validHeader = `Basic ${Buffer.from(`:${TOKEN}`).toString('base64')}`;

describe('auth', () => {
  it('returns 503 when STATS_TOKEN is not configured', async () => {
    delete process.env.STATS_TOKEN;
    const res = await handler(new Request('http://localhost/api/stats'));
    assert.equal(res.status, 503);
  });

  it('returns 401 with WWW-Authenticate when no Authorization header', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const res = await handler(new Request('http://localhost/api/stats'));
    assert.equal(res.status, 401);
    assert.equal(res.headers.get('WWW-Authenticate'), 'Basic realm="Stats"');
  });

  it('returns 401 for wrong password', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const wrong = `Basic ${Buffer.from(':wrong').toString('base64')}`;
    const res = await handler(new Request('http://localhost/api/stats', {
      headers: { Authorization: wrong },
    }));
    assert.equal(res.status, 401);
  });

  it('returns 200 for correct password', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const res = await handler(new Request('http://localhost/api/stats', {
      headers: { Authorization: validHeader },
    }));
    assert.equal(res.status, 200);
  });
});
```

- [ ] **Step 3: Run tests — expect failures**

```bash
npm test
```

Expected: 4 tests, all fail (the current `?token=` auth doesn't match Basic Auth expectations).

- [ ] **Step 4: Implement Basic Auth in stats.js**

Replace the full contents of `netlify/functions/stats.js`:

```js
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
```

- [ ] **Step 5: Run tests — expect all pass**

```bash
npm test
```

Expected: 4 tests, all pass.

- [ ] **Step 6: Commit**

```bash
git add netlify/functions/stats.js netlify/functions/stats.test.js package.json
git commit -m "feat: replace query-param token auth with HTTP Basic Auth on /api/stats"
```

---

### Task 2: HTML visualization dashboard

**Files:**
- Modify: `netlify/functions/stats.js`
- Modify: `netlify/functions/stats.test.js`

- [ ] **Step 1: Write failing tests for content negotiation**

Append to `netlify/functions/stats.test.js` (below the existing `describe('auth', ...)` block):

```js
describe('content negotiation', () => {
  it('returns JSON by default', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const res = await handler(new Request('http://localhost/api/stats', {
      headers: { Authorization: validHeader },
    }));
    assert.equal(res.headers.get('Content-Type'), 'application/json');
    const body = await res.json();
    assert.ok(typeof body.totals === 'object');
  });

  it('returns HTML when Accept includes text/html', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const res = await handler(new Request('http://localhost/api/stats', {
      headers: {
        Authorization: validHeader,
        Accept: 'text/html,application/xhtml+xml',
      },
    }));
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('Content-Type')?.includes('text/html'));
    const body = await res.text();
    assert.ok(body.includes('<!DOCTYPE html>'));
    assert.ok(body.includes('chart.js'));
  });
});
```

- [ ] **Step 2: Run tests — expect 2 new failures**

```bash
npm test
```

Expected: 6 tests total — 4 auth pass, 2 content-negotiation fail.

- [ ] **Step 3: Add buildHtml and content negotiation to stats.js**

Add the `buildHtml` function after the `fetchCounts` function, and update the export default handler to check the `Accept` header. Full updated file:

```js
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
    .map(([event, count]) => `<tr><td>${event}</td><td>${count}</td></tr>`)
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
          y: { ticks: { color: '#666', precision: 0 }, grid: { color: '#1a1a1a' }, beginAtZero: true }
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
```

- [ ] **Step 4: Run tests — expect all 6 pass**

```bash
npm test
```

Expected: 6 tests, all pass.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/stats.js netlify/functions/stats.test.js
git commit -m "feat: add HTML visualization dashboard to /api/stats"
```

---

### Task 3: Store timestamps in event.js

**Files:**
- Create: `netlify/functions/event.test.js`
- Modify: `netlify/functions/event.js`

- [ ] **Step 1: Write failing tests**

Create `netlify/functions/event.test.js`:

```js
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

let lastSetValue;

await mock.module('@netlify/blobs', {
  namedExports: {
    getStore: () => ({
      set: async (_key, value) => { lastSetValue = value; },
    }),
  },
});

const { default: handler } = await import('./event.js');

function post(body) {
  return new Request('http://localhost/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('event handler', () => {
  it('returns 405 for non-POST', async () => {
    const res = await handler(new Request('http://localhost/api/event'));
    assert.equal(res.status, 405);
  });

  it('returns 400 for unknown event', async () => {
    const res = await handler(post({ e: 'unknown_event' }));
    assert.equal(res.status, 400);
  });

  it('returns 204 for valid event', async () => {
    const res = await handler(post({ e: 'page_view:/' }));
    assert.equal(res.status, 204);
  });

  it('stores event as JSON with e and t fields', async () => {
    const before = Date.now();
    await handler(post({ e: 'page_view:/' }));
    const after = Date.now();
    const stored = JSON.parse(lastSetValue);
    assert.equal(stored.e, 'page_view:/');
    assert.ok(typeof stored.t === 'number', 'timestamp should be a number');
    assert.ok(stored.t >= before && stored.t <= after, 'timestamp should fall within test window');
  });
});
```

- [ ] **Step 2: Run tests — expect last test to fail**

```bash
npm test
```

Expected: 10 tests total — 9 pass, 1 fails ("stores event as JSON with e and t fields").

- [ ] **Step 3: Update event.js to store JSON**

In `netlify/functions/event.js`, change line 45:

Old:
```js
await store.set(`${date}/${Date.now()}-${randomUUID()}`, body.e);
```

New:
```js
await store.set(`${date}/${Date.now()}-${randomUUID()}`, JSON.stringify({ e: body.e, t: Date.now() }));
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test
```

Expected: 10 tests, all pass.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/event.js netlify/functions/event.test.js
git commit -m "feat: store event timestamp alongside event name in blob storage"
```

---

## Notes

**JSON response format change:** The JSON response now returns `{ totals, by_day }` instead of a flat counts object. This is an intentional breaking change — `/api/stats` is a private endpoint only accessed by the portfolio owner.

**Backward compatibility:** Existing blobs stored as plain strings (pre-Task 3) are handled by the `try/catch` in `fetchCounts` — `JSON.parse` fails gracefully and falls back to treating the raw value as the event name.
