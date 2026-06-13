import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';
  const expected = process.env.STATS_TOKEN ?? '';

  // Fail closed if STATS_TOKEN is not configured
  if (!expected) {
    return new Response(null, { status: 503 });
  }

  const valid = token.length === expected.length &&
    timingSafeEqual(Buffer.from(token), Buffer.from(expected));

  if (!valid) {
    return new Response(null, { status: 401 });
  }

  const days = Math.min(parseInt(url.searchParams.get('days') ?? '7', 10) || 7, 90);
  const store = getStore('events');

  const dateKeys = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    return date.toISOString().slice(0, 10);
  });

  // List all date prefixes in parallel
  const listings = await Promise.all(
    dateKeys.map(date => store.list({ prefix: `${date}/` }))
  );

  // Fetch all individual event blobs in parallel
  const allKeys = listings.flatMap(({ blobs }) => blobs.map(b => b.key));
  const eventNames = await Promise.all(allKeys.map(key => store.get(key)));

  const counts = {};
  for (const name of eventNames) {
    if (name) counts[name] = (counts[name] ?? 0) + 1;
  }

  return new Response(JSON.stringify(counts, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/stats' };
