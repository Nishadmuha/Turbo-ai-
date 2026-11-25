import { connectDatabase } from './db.mjs';
import { createApp } from './app.mjs';

export function productionOrigins(env = process.env) {
  const origins = new Set(['https://turbo-ai.ca', 'https://www.turbo-ai.ca']);
  for (const value of (env.CMS_ORIGINS || '').split(',')) {
    if (!value.trim()) continue;
    const origin = new URL(value.trim());
    if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('CMS_ORIGINS must contain exact HTTPS origins.');
    origins.add(origin.origin);
  }
  for (const host of [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (!host) continue;
    if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) throw new Error('Invalid deployment hostname.');
    origins.add(`https://${host}`);
  }
  return [...origins];
}

function normalizeRoute(req) {
  const url = new URL(req.url, 'https://cms.invalid');
  // Vercel forwards this parameter from /api/cms/:path* to the single API function.
  const forwardedPath = url.searchParams.get('__cms_path');
  url.searchParams.delete('__cms_path');
  if (url.pathname === '/api/cms' && forwardedPath) {
    if (!/^[a-zA-Z0-9/_-]+(?:\.[a-zA-Z0-9]+)?$/.test(forwardedPath) || forwardedPath.includes('..')) throw new Error('Invalid API path.');
    url.pathname = `/api/cms/${forwardedPath.replace(/^\/+/, '')}`;
  }
  req.url = `${url.pathname}${url.search}`;
}

export function createServerlessHandler({ env = process.env, connect = connectDatabase, makeApp = createApp } = {}) {
  let application;
  async function getApplication() {
    if (!application) {
      application = (async () => {
        if (!env.MONGODB_URI?.trim()) throw Object.assign(new Error('Database configuration missing.'), { code: 'CMS_NOT_CONFIGURED' });
        const origins = productionOrigins(env);
        const { db, client } = await connect(env.MONGODB_URI, env.MONGODB_DB || 'turbo_ai_cms');
        try {
          return await makeApp({ db, uploadDir: null, origins, secure: true, allowLocalBuild: false, trustProxy: 1 });
        } catch (error) { await client.close(); throw error; }
      })().catch(error => { application = undefined; throw error; });
    }
    return application;
  }
  return async function cmsHandler(req, res) {
    try { normalizeRoute(req); }
    catch {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: 'Invalid CMS route.' }));
      return;
    }
    let app;
    try { app = await getApplication(); }
    catch (error) {
      // Never send connection strings, database errors, or platform environment values to visitors.
      res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': '30' });
      res.end(JSON.stringify({ error: error.code === 'CMS_NOT_CONFIGURED' ? 'The CMS database is not configured on this deployment. Ask the site administrator to configure MONGODB_URI in the hosting settings and redeploy.' : 'The CMS cannot connect to its database. Please try again shortly.', code: error.code === 'CMS_NOT_CONFIGURED' ? 'CMS_NOT_CONFIGURED' : 'CMS_UNAVAILABLE' }));
      return;
    }
    return app(req, res);
  };
}
