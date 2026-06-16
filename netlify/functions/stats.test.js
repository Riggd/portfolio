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

  it('returns 401 for same-length wrong password', async () => {
    process.env.STATS_TOKEN = TOKEN;
    const wrong = `Basic ${Buffer.from(':xest-secret').toString('base64')}`;
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
