import { MongoClient } from 'mongodb';

// Take one consistent published-content snapshot before rendering. This also
// works in a cloud build where the deployed API does not exist yet.
export async function loadMongoBlogSnapshot(env) {
  if (env.MONGODB_URI) {
    const name = env.MONGODB_DB || 'turbo_ai_cms';
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new Error('Invalid MongoDB database name.');
    let client;
    try {
      client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      await client.connect();
      return await client.db(name).collection('cms_entries').find(
        { kind: 'blog', status: 'published' }, { projection: { _id: 0 } },
      ).sort({ published_at: -1 }).toArray();
    } catch {
      throw new Error('Cannot build published blog pages: MongoDB is unavailable. Check the hosting MONGODB_URI, database permissions, and Atlas network access. Connection details have been omitted.');
    } finally {
      await client?.close();
    }
  }
  const api = env.CMS_PRERENDER_API_URL?.replace(/\/$/, '');
  if (!api) throw new Error('Blog CMS is enabled, but the build has no MONGODB_URI or CMS_PRERENDER_API_URL. Configure the server-side database variable in hosting settings before redeploying.');
  async function request(path) {
    try {
      const response = await fetch(`${api}${path}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error();
      return await response.json();
    } catch {
      throw new Error('Cannot build published blog pages: the configured CMS build API is unavailable.');
    }
  }
  const summaries = await request('/entries?kind=blog&limit=500');
  if (!Array.isArray(summaries)) throw new Error('The CMS build API returned an invalid blog list.');
  const entries = [];
  for (const summary of summaries) {
    if (summary.kind !== 'blog' || summary.status !== 'published') continue;
    const entry = await request(`/entries/blog/${encodeURIComponent(summary.slug)}`);
    if (!entry || entry.kind !== 'blog' || entry.status !== 'published') throw new Error('Published blog content changed during the build. Please run the build again.');
    entries.push(entry);
  }
  return entries;
}

// Only public blog endpoints are available to the renderer. An API failure is
// never replaced with authored articles that an editor may have unpublished.
export function snapshotResponse(entries, pathname, searchParams, apiPath = '/api/cms') {
  if (pathname === `${apiPath}/entries`) {
    if (searchParams.get('kind') !== 'blog') return { status: 400, body: { error: 'This CMS manages blog posts only.' } };
    const limit = Math.min(500, Math.max(1, Math.floor(Number(searchParams.get('limit')) || 100)));
    return { status: 200, body: entries.slice(0, limit).map(({ body: _body, ...entry }) => entry) };
  }
  if (pathname.startsWith(`${apiPath}/entries/blog/`)) {
    const slug = decodeURIComponent(pathname.slice(`${apiPath}/entries/blog/`.length));
    return { status: 200, body: entries.find(entry => entry.slug === slug) || null };
  }
  return { status: 404, body: { error: 'CMS endpoint was not found.' } };
}
