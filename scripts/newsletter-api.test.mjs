import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import subscribe from '../api/subscribe.mjs';

test('subscription HTTP endpoint validates requests, protects credentials and handles Kit outcomes', async () => {
  const realFetch = globalThis.fetch;
  const previousKey = process.env.KIT_API_KEY;
  let upstreamStatus = 200;
  let subscriberState = 'active';
  const forwarded = [];
  process.env.KIT_API_KEY = 'server-only-test-key';
  globalThis.fetch = async (url, options) => {
    if (url === 'https://api.kit.com/v4/subscribers') {
      forwarded.push(options);
      return new Response(JSON.stringify({ subscriber: { state: subscriberState } }), { status: upstreamStatus });
    }
    return realFetch(url, options);
  };
  const server = createServer(subscribe);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/subscribe`;
  const post = (body, headers = {}) => realFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  try {
    assert.equal((await realFetch(url)).status, 405);
    assert.equal((await post({ email: 'invalid' })).status, 400);
    assert.equal((await post({ email: 'reader@example.com' }, { Origin: 'https://other.example' })).status, 403);
    assert.equal((await post({ email: 'reader@example.com', website: 'bot' })).status, 200);
    assert.equal((await post({ email: 'reader@example.com', website: 'é'.repeat(1024) })).status, 413);
    assert.equal(forwarded.length, 0);
    const success = await post({ email: ' reader@example.com ' });
    assert.deepEqual(await success.json(), { success: true });
    assert.deepEqual(JSON.parse(forwarded[0].body), { email_address: 'reader@example.com', state: 'active' });
    assert.equal(forwarded[0].headers['X-Kit-Api-Key'], 'server-only-test-key');
    subscriberState = 'cancelled';
    const cancelled = await post({ email: 'reader@example.com' });
    assert.equal(cancelled.status, 409);
    assert.ok(!(await cancelled.json()).success);
    subscriberState = 'active';
    upstreamStatus = 429;
    const limited = await post({ email: 'reader@example.com' });
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('Retry-After'), '60');
    upstreamStatus = 401;
    const failure = await post({ email: 'reader@example.com' });
    assert.equal(failure.status, 502);
    assert.ok(!(await failure.text()).includes('server-only-test-key'));
    delete process.env.KIT_API_KEY;
    assert.equal((await post({ email: 'reader@example.com' })).status, 503);
  } finally {
    globalThis.fetch = realFetch;
    if (previousKey === undefined) delete process.env.KIT_API_KEY;
    else process.env.KIT_API_KEY = previousKey;
    await new Promise(resolve => server.close(resolve));
  }
});
