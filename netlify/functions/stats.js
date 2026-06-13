import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';
  const expected = process.env.STATS_TOKEN ?? '';

  const tokBuf = Buffer.from(token.padEnd(expected.length));
  const expBuf = Buffer.from(expected.padEnd(token.length));
  const valid = token.length === expected.length &&
    timingSafeEqual(tokBuf, expBuf);

  if (!valid) {
    return new Response(null, { status: 401 });
  }

  const days = Math.min(parseInt(url.searchParams.get('days') ?? '7', 10), 90);
  const store = getStore('events');
  const counts = {};

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    const blob = await store.get(key);
    if (!blob) continue;

    for (const line of blob.split('\n').filter(Boolean)) {
      try {
        const { e } = JSON.parse(line);
        counts[e] = (counts[e] ?? 0) + 1;
      } catch {
        // skip malformed lines
      }
    }
  }

  return new Response(JSON.stringify(counts, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/stats' };
