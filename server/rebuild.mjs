import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

// No command, path, environment, or arguments are accepted from an HTTP request.
export function runLocalBuild() {
  const npmCli = process.env.npm_execpath?.endsWith('npm-cli.js')
    ? process.env.npm_execpath
    : path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  return new Promise((resolve, reject) => {
    if (!existsSync(npmCli)) { reject(new Error('Build runner unavailable.')); return; }
    const child = spawn(process.execPath, [npmCli, 'run', 'build'], {
      cwd: projectRoot,
      env: { ...process.env },
      shell: false,
      windowsHide: true,
      stdio: 'ignore',
    });
    child.once('error', () => reject(new Error('Build could not start.')));
    child.once('exit', code => code === 0 ? resolve() : reject(new Error('Build failed.')));
  });
}

export function createBuildController({ enabled = false, run = runLocalBuild } = {}) {
  let status = { enabled, state: 'idle', started_at: null, finished_at: null, message: enabled ? 'Ready to refresh local site files.' : 'Local site refresh is not enabled on this server.' };
  return {
    getStatus: () => ({ ...status }),
    start() {
      if (!enabled) throw Object.assign(new Error('Local site refresh is not enabled on this server.'), { status: 403 });
      if (status.state === 'running') throw Object.assign(new Error('A site refresh is already running.'), { status: 409 });
      status = { enabled, state: 'running', started_at: new Date().toISOString(), finished_at: null, message: 'Refreshing local pages, SEO metadata, and sitemap.' };
      Promise.resolve().then(run).then(() => {
        status = { ...status, state: 'succeeded', finished_at: new Date().toISOString(), message: 'Local site files refreshed. No deployment or Git push was performed.' };
      }).catch(() => {
        // Raw build output and errors may include environment details. Never expose them.
        status = { ...status, state: 'failed', finished_at: new Date().toISOString(), message: 'Local refresh failed. Ask your technical administrator to run npm run build and check the result.' };
      });
      return { ...status };
    },
  };
}
