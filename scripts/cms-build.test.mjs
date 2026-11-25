import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { resolveCmsBuildConfig } from './cms-build-config.mjs';
import { loadMongoBlogSnapshot, snapshotResponse } from './cms-build-snapshot.mjs';

test('deployment selects MongoDB without ignored local frontend flags', () => {
  assert.deepEqual(resolveCmsBuildConfig({}), { provider: 'mongodb', enabled: false });
  assert.deepEqual(resolveCmsBuildConfig({ MONGODB_URI: 'server-only-value' }), { provider: 'mongodb', enabled: true });
  assert.deepEqual(resolveCmsBuildConfig({ MONGODB_URI: 'server-only-value', VITE_CMS_ENABLED: 'false' }), { provider: 'mongodb', enabled: false });
  assert.deepEqual(resolveCmsBuildConfig({ VITE_CMS_PROVIDER: 'supabase', VITE_SUPABASE_URL: 'https://example.invalid', VITE_SUPABASE_PUBLISHABLE_KEY: 'public' }), { provider: 'supabase', enabled: true });
  assert.deepEqual(resolveCmsBuildConfig({ CMS_PRERENDER_API_URL: 'https://example.invalid/api/cms' }), { provider: 'mongodb', enabled: true });
});

test('enabled MongoDB build without a connection fails rather than publishing authored fallback', async () => {
  await assert.rejects(loadMongoBlogSnapshot({}), /no MONGODB_URI or CMS_PRERENDER_API_URL/);
});

test('cloud-build snapshot contains only published blogs and supports list and article rendering', async () => {
  // Deliberately use a disposable localhost database, never the configured Atlas URI.
  const uri = 'mongodb://127.0.0.1:27017';
  const name = `turbo_build_test_${randomUUID().replaceAll('-', '')}`;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
  try {
    await client.connect();
    await client.db(name).collection('cms_entries').insertMany([
      { kind: 'blog', slug: 'published-blog', status: 'published', title: 'Published article', body: 'Article body', published_at: '2026-01-01' },
      { kind: 'blog', slug: 'private-draft', status: 'draft', title: 'Private draft', body: 'Never render this' },
      { kind: 'product', slug: 'old-product', status: 'published', title: 'Authored product', body: 'Not managed by blog CMS' },
    ]);
    const entries = await loadMongoBlogSnapshot({ MONGODB_URI: uri, MONGODB_DB: name });
    assert.equal(entries.length, 1);
    assert.equal(entries[0].body, 'Article body');
    assert.equal(entries[0]._id, undefined);
    const list = snapshotResponse(entries, '/api/cms/entries', new URLSearchParams('kind=blog&limit=500'));
    assert.equal(list.status, 200);
    assert.equal(list.body[0].slug, 'published-blog');
    assert.equal(list.body[0].body, undefined);
    const article = snapshotResponse(entries, '/api/cms/entries/blog/published-blog', new URLSearchParams());
    assert.equal(article.body.body, 'Article body');
    assert.equal(snapshotResponse(entries, '/api/cms/entries/blog/private-draft', new URLSearchParams()).body, null);
    assert.equal(snapshotResponse(entries, '/api/cms/entries', new URLSearchParams('kind=product')).status, 400);
    assert.equal(snapshotResponse(entries, '/api/cms/admin/entries', new URLSearchParams()).status, 404);
  } finally {
    await client.db(name).dropDatabase().catch(() => {});
    await client.close();
  }
});
