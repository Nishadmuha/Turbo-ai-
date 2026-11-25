import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { connectDatabase } from './db.mjs';
import { passwordHash } from './security.mjs';
import { createServerlessHandler, productionOrigins } from './serverless.mjs';

async function listen(handler) {
  const server = createServer(handler).listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

test('serverless API requires configuration, sanitizes failures, and retries a failed cold start', async () => {
  let attempts = 0;
  const env = {};
  const server = await listen(createServerlessHandler({ env, connect: async () => {
    attempts += 1;
    throw new Error('mongodb://private-user:private-password@private-host');
  } }));
  try {
    const missing = await fetch(`${server.base}/api/cms?__cms_path=health`);
    assert.equal(missing.status, 503);
    assert.equal((await missing.json()).code, 'CMS_NOT_CONFIGURED');
    assert.equal(attempts, 0, 'missing configuration must never try localhost');
    env.MONGODB_URI = 'mongodb://not-used.invalid';
    for (let i = 0; i < 2; i += 1) {
      const failed = await fetch(`${server.base}/api/cms/health`);
      assert.equal(failed.status, 503);
      assert.equal(failed.headers.get('cache-control'), 'no-store');
      assert.deepEqual(await failed.json(), { error: 'The CMS cannot connect to its database. Please try again shortly.', code: 'CMS_UNAVAILABLE' });
    }
    assert.equal(attempts, 2, 'a failed initialization must not poison later invocations');
  } finally { await server.close(); }
});

test('deployment origins are exact HTTPS hosts, not arbitrary request Host headers', () => {
  const origins = productionOrigins({ VERCEL_URL: 'turbo-unique-team.vercel.app', VERCEL_PROJECT_PRODUCTION_URL: 'turbo-ai.vercel.app', CMS_ORIGINS: 'https://editor.example.test' });
  assert.deepEqual(origins, ['https://turbo-ai.ca', 'https://www.turbo-ai.ca', 'https://editor.example.test', 'https://turbo-unique-team.vercel.app', 'https://turbo-ai.vercel.app']);
  assert.throws(() => productionOrigins({ CMS_ORIGINS: 'http://localhost:5173' }));
  assert.throws(() => productionOrigins({ CMS_ORIGINS: 'https://editor.example.test/path' }));
  assert.throws(() => productionOrigins({ VERCEL_URL: 'evil.test/path' }));
});

test('parallel requests reuse one initialization and rewritten paths retain ordinary query parameters', async () => {
  let connections = 0;
  let applications = 0;
  let options;
  const handler = createServerlessHandler({ env: { MONGODB_URI: 'mongodb://unused' }, connect: async () => {
    connections += 1;
    await new Promise(resolve => setTimeout(resolve, 15));
    return { db: {}, client: { close() {} } };
  }, makeApp: async received => {
    applications += 1;
    options = received;
    return (req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ path: req.url })); };
  } });
  const server = await listen(handler);
  try {
    const responses = await Promise.all(Array.from({ length: 4 }, () => fetch(`${server.base}/api/cms?__cms_path=entries&kind=blog&limit=20`).then(response => response.json())));
    assert.deepEqual(responses, Array.from({ length: 4 }, () => ({ path: '/api/cms/entries?kind=blog&limit=20' })));
    assert.equal(connections, 1);
    assert.equal(applications, 1);
    assert.equal(options.uploadDir, null);
    assert.equal(options.allowLocalBuild, false);
    assert.equal(options.secure, true);
    assert.equal(options.trustProxy, 1);
    const invalid = await fetch(`${server.base}/api/cms?__cms_path=../admin/team`);
    assert.equal(invalid.status, 400);
  } finally { await server.close(); }
});

async function startWorker(dbName) {
  const moduleUrl = new URL('../api/cms.mjs', import.meta.url).href;
  const source = `
    import handler from ${JSON.stringify(moduleUrl)};
    import { createServer } from 'node:http';
    const server = createServer(handler).listen(0, '127.0.0.1', () => process.send({ port: server.address().port }));
    process.on('message', () => server.close(() => process.exit(0)));
  `;
  const child = spawn(process.execPath, ['--input-type=module', '--eval', source], {
    env: { ...process.env, MONGODB_URI: 'mongodb://127.0.0.1:27017', MONGODB_DB: dbName, CMS_ORIGINS: '', NODE_ENV: 'production', CMS_ALLOW_LOCAL_BUILD: 'true', VERCEL_URL: 'turbo-fixture.vercel.app', VERCEL_PROJECT_PRODUCTION_URL: '' },
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'], windowsHide: true,
  });
  let errorOutput = '';
  child.stderr.on('data', chunk => { errorOutput += chunk; });
  const timer = setTimeout(() => child.kill(), 15000);
  const [message] = await Promise.race([
    once(child, 'message'),
    once(child, 'exit').then(() => { throw new Error(`Test API worker exited early: ${errorOutput}`); }),
  ]).finally(() => clearTimeout(timer));
  return { base: `http://127.0.0.1:${message.port}`, close: async () => {
    const exited = once(child, 'exit');
    child.send('stop');
    await exited;
    assert.equal(errorOutput, '', 'API should not emit runtime or proxy warnings');
  } };
}

test('deployed API keeps login, blog edits, uploads, and login limits across fresh processes', async () => {
  const dbName = `turbo_ai_cms_test_serverless_${randomUUID().replaceAll('-', '')}`;
  // Always local and disposable, even if the command loads a real Atlas environment.
  const { db, client } = await connectDatabase('mongodb://127.0.0.1:27017', dbName);
  let worker;
  const password = `${randomUUID()}-secure-test-password`;
  let cookie = '';
  const imageBytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4X8AAAAASUVORK5CYII=', 'base64');
  async function request(route, { method = 'GET', body, origin = 'https://turbo-ai.ca' } = {}) {
    const [pathname, query] = route.split('?');
    const response = await fetch(`${worker.base}/api/cms?__cms_path=${encodeURIComponent(pathname)}${query ? `&${query}` : ''}`, { method, headers: { Origin: origin, 'X-CMS-Request': '1', ...(cookie ? { Cookie: cookie } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
    return { response, data: await response.json() };
  }
  try {
    await db.collection('cms_users').insertOne({ id: randomUUID(), email: 'admin@example.test', role: 'admin', disabled: false, passwordHash: await passwordHash(password) });
    worker = await startWorker(dbName);
    assert.equal((await request('health')).data.ok, true);
    assert.equal((await request('auth/login', { method: 'POST', body: { email: 'admin@example.test', password }, origin: 'https://evil.test' })).response.status, 403);
    const login = await request('auth/login', { method: 'POST', body: { email: 'admin@example.test', password } });
    assert.equal(login.response.status, 200);
    assert.match(login.response.headers.get('set-cookie'), /; Secure/);
    assert.match(login.response.headers.get('set-cookie'), /; HttpOnly/);
    cookie = login.response.headers.get('set-cookie').split(';')[0];
    assert.equal((await request('admin/rebuild')).data.enabled, false, 'serverless cannot launch a local subprocess build');
    const post = { kind: 'blog', slug: 'deployed-article', title: 'Deployed article', body: 'Durable content', status: 'published' };
    assert.equal((await request('admin/entries', { method: 'POST', body: post })).response.status, 201);
    assert.equal((await request('admin/entries', { method: 'POST', body: { ...post, slug: 'private-draft', status: 'draft' } })).response.status, 201);
    const form = new FormData();
    form.append('file', new Blob([imageBytes], { type: 'image/png' }), 'image.png');
    form.append('alt', 'Persistent image');
    const uploaded = await request('admin/media', { method: 'POST', body: form });
    assert.equal(uploaded.response.status, 201);
    assert.equal('data' in uploaded.data, false, 'binary content must not be returned as JSON');
    const stored = await db.collection('cms_media').findOne({ id: uploaded.data.id });
    assert.deepEqual(Buffer.from(stored.data.buffer), imageBytes);
    const tooLarge = new FormData();
    tooLarge.append('file', new Blob([imageBytes, Buffer.alloc(4 * 1024 * 1024)], { type: 'image/png' }), 'large.png');
    tooLarge.append('alt', 'Too large');
    assert.equal((await request('admin/media', { method: 'POST', body: tooLarge })).response.status, 400);
    await worker.close(); worker = undefined;
    worker = await startWorker(dbName);
    assert.equal((await request('auth/me')).data.email, 'admin@example.test', 'sessions survive a fresh process');
    assert.deepEqual((await request('entries?kind=blog')).data.map(row => row.slug), ['deployed-article']);
    assert.equal((await request('entries/blog/private-draft')).data, null);
    const media = await request('admin/media');
    assert.equal(media.data.length, 1);
    assert.equal('data' in media.data[0], false);
    const downloaded = await fetch(`${worker.base}${uploaded.data.path}`);
    assert.equal(downloaded.status, 200);
    assert.equal(downloaded.headers.get('content-type'), 'image/png');
    assert.equal(downloaded.headers.get('x-content-type-options'), 'nosniff');
    assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), imageBytes, 'image bytes survive without local storage');
    for (let i = 0; i < 14; i += 1) assert.equal((await request('auth/login', { method: 'POST', body: { email: 'admin@example.test', password: 'incorrect' } })).response.status, 401);
    assert.equal((await request('auth/login', { method: 'POST', body: { email: 'admin@example.test', password } })).response.status, 429, 'the first process login still counts');
    await db.collection('cms_rate_limits').updateMany({}, { $set: { resetTime: new Date(0) } });
    assert.equal((await request('auth/login', { method: 'POST', body: { email: 'admin@example.test', password } })).response.status, 200, 'expired rate-limit windows reset atomically');
    assert.equal((await request(`admin/media/${uploaded.data.id}`, { method: 'DELETE' })).response.status, 200);
    assert.equal((await fetch(`${worker.base}${uploaded.data.path}`)).status, 404);
  } finally {
    await worker?.close();
    assert.ok(db.databaseName.startsWith('turbo_ai_cms_test_serverless_'), 'Refusing to drop a non-test database.');
    await db.dropDatabase();
    await client.close();
  }
});
