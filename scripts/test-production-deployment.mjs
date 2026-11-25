import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

// Read-only checks against a deployed site. No login credentials or database writes.
const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/test-production-deployment.mjs https://your-deployment.example');
const base = new URL(target);
assert.ok(['http:', 'https:'].includes(base.protocol), 'Use an HTTP(S) deployment URL.');
assert.equal(base.username + base.password, '', 'Do not include credentials in the deployment URL.');
assert.equal(base.search + base.hash, '', 'Use the deployment origin without a query or fragment.');
assert.ok(base.pathname === '/', 'Use the deployment origin without a path.');

let checks = 0;
async function get(route, expectedStatus, type) {
  const response = await fetch(new URL(route, base), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, expectedStatus, `${route}: expected HTTP ${expectedStatus}, received ${response.status}. Check deployment routes, server variables, and MongoDB connectivity.`);
  assert.ok(response.headers.get('content-type')?.includes(type), `${route}: expected ${type}; the API may be falling through to a static HTML page.`);
  checks += 1;
  return response;
}
async function json(route, status = 200) {
  const response = await get(route, status, 'application/json');
  assert.match(response.headers.get('cache-control') || '', /\bno-store\b/, `${route}: CMS responses must not be cached by the CDN.`);
  return response.json();
}
async function html(route) {
  const response = await get(route, 200, 'text/html');
  const body = await response.text();
  assert.match(body, /<script[^>]+type=["']module["']/i, `${route}: frontend module entry is missing.`);
  return body;
}

const home = await html('/');
await html('/admin');
await html('/admin/login');
await html('/admin/blog/new');
const entryAsset = home.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/i)?.[1];
assert.ok(entryAsset, 'The homepage must reference a JavaScript entry asset.');
const entryUrl = new URL(entryAsset, base);
assert.equal(entryUrl.origin, base.origin, 'The entry asset should be served by this deployment.');
const asset = await get(entryUrl.pathname, 200, 'javascript');
assert.ok(Number(asset.headers.get('content-length') || 1) > 0, 'The frontend entry asset is empty.');

const health = await json('/api/cms/health');
assert.deepEqual(health, { ok: true, database: 'mongodb', scope: 'blog' });
assert.equal(await json('/api/cms/auth/me'), null, 'Anonymous users must not inherit a CMS session.');
assert.equal(typeof (await json('/api/cms/admin/stats', 401)).error, 'string', 'Admin endpoints must reject unauthenticated requests.');
assert.equal(typeof (await json('/api/cms/entries?kind=product', 400)).error, 'string', 'The public CMS must remain blog-only.');
const entries = await json('/api/cms/entries?kind=blog&limit=1');
assert.ok(Array.isArray(entries) && entries.length <= 1, 'Published blog listing must respect the requested limit.');
for (const entry of entries) {
  assert.equal(entry.kind, 'blog');
  assert.equal(entry.status, 'published');
  assert.ok(!('body' in entry) && !('_id' in entry), 'List responses must use the public summary projection.');
  const post = await json(`/api/cms/entries/blog/${encodeURIComponent(entry.slug)}`);
  assert.equal(post.id, entry.id, 'Public article lookup and listing must agree.');
  await html(`/blog/${encodeURIComponent(entry.slug)}`);
}
const absentSlug = `deployment-route-check-${randomUUID()}`;
assert.equal(await json(`/api/cms/entries/blog/${absentSlug}`), null, 'Missing articles must not fall back to authored content.');
// A new article will not have a prerendered file until the next build. Its URL
// still needs to boot the app; React then resolves published/missing content.
await html(`/blog/${absentSlug}`);
assert.equal(typeof (await json('/api/cms/unknown-deployment-check', 404)).error, 'string');
assert.equal(typeof (await json('/api/cms/media/files/00000000-0000-0000-0000-000000000000.png', 404)).error, 'string');
console.log(`Deployment smoke passed: ${checks} read-only checks for frontend routes/assets, CMS health, protected admin access, published blog data, and API errors.`);
