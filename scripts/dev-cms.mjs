import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { connectDatabase } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';
import { resolveCmsBuildConfig } from './cms-build-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const modeIndex = args.indexOf('--mode');
const mode = modeIndex >= 0 ? args[modeIndex + 1] || 'development' : 'development';
const env = { ...loadEnv(mode, root, ''), ...process.env };
const apiPort = Number(env.CMS_PORT || 4100);
let apiServer;
let dbClient;
let vite;
let stopping = false;

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  // Only stop processes and connections this launcher created.
  if (vite?.pid && vite.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(vite.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' });
    else vite.kill('SIGTERM');
  }
  if (apiServer) { apiServer.closeAllConnections(); await new Promise(resolve => apiServer.close(resolve)); }
  await dbClient?.close();
  process.exit(code);
}
process.on('SIGINT', () => { void stop(); });
process.on('SIGTERM', () => { void stop(); });

if (resolveCmsBuildConfig(env).provider === 'mongodb') {
  const apiUrl = `http://127.0.0.1:${apiPort}`;
  let existing = false;
  try {
    const response = await fetch(`${apiUrl}/api/cms/health`, { signal: AbortSignal.timeout(1200) });
    const health = await response.json();
    existing = response.ok && health.ok && health.database === 'mongodb' && health.scope === 'blog';
  } catch { /* No compatible server is running; try starting our own. */ }
  if (existing) console.log(`Using the running blog CMS API at ${apiUrl}.`);
  else {
    try {
      const connection = await connectDatabase(env.MONGODB_URI, env.MONGODB_DB);
      dbClient = connection.client;
      const origins = (env.CMS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173').split(',').map(value => value.trim());
      const app = await createApp({ db: connection.db, origins, secure: false, allowLocalBuild: env.CMS_ALLOW_LOCAL_BUILD === 'true' });
      await new Promise((resolve, reject) => {
        const server = app.listen(apiPort, '127.0.0.1');
        server.once('error', reject);
        server.once('listening', () => { apiServer = server; resolve(); });
      });
      console.log(`Blog CMS API ready at ${apiUrl}/api/cms/health`);
    } catch {
      await dbClient?.close(); dbClient = undefined;
      console.warn('Blog CMS could not start. The website will still run. Check the MongoDB configuration or an existing API using this port; no credentials were logged.');
    }
  }
  env.CMS_API_TARGET = apiUrl;
}

// Keep the configured origin stable: silently moving ports would break CMS writes.
// Run Vite directly to preserve CLI arguments without a shell or recursive npm dev.
vite = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--strictPort', ...args], {
  cwd: root, env, stdio: 'inherit', windowsHide: true, shell: false,
});
vite.once('error', () => { console.error('The website development server could not start.'); void stop(1); });
vite.once('exit', code => { void stop(code || 0); });
