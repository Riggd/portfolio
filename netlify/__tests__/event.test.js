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

const { default: handler } = await import('../functions/event.js');

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
