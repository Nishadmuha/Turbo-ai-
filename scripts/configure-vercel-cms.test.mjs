import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configureCms, createVercelClient } from './configure-vercel-cms.mjs';

const env = { CMS_SETUP_MODE: 'apply', VERCEL_PROJECT_ID: 'prj_test', GITHUB_REPOSITORY: 'owner/repo', GITHUB_REPOSITORY_ID: '123', GITHUB_SHA: 'a'.repeat(40), GITHUB_REF: 'refs/heads/main', MONGODB_URI: 'mongodb://secret:password@database.invalid' };
function fixture({ domains = [{ name: 'turbo-ai.ca', verified: true }], entries = [], link = { type: 'github', org: 'owner', repo: 'repo' }, projects = [] } = {}) {
  const calls = [];
  const api = async (method, route, body, query) => {
    calls.push({ method, route, body, query });
    if (method !== 'GET') return route === '/v13/deployments' ? { id: 'dpl_test', readyState: 'QUEUED', url: 'turbo-test.vercel.app' } : { created: {} };
    if (route.endsWith('/domains')) return { domains };
    if (route.endsWith('/env')) return { envs: entries };
    if (route === '/v10/projects') return { projects };
    return { id: 'prj_test', name: 'turbo-test', link };
  };
  return { calls, api };
}

test('inspection has no side effects or secret output', async () => {
  const mock = fixture({ entries: [{ key: 'MONGODB_URI', value: 'secret', target: ['production'] }] });
  const lines = [];
  await configureCms({ env: { ...env, CMS_SETUP_MODE: 'inspect' }, api: mock.api, report: line => lines.push(line) });
  assert.ok(mock.calls.every(call => call.method === 'GET'));
  assert.ok(!lines.join('').includes('secret'));
  assert.equal(mock.calls.find(call => call.route.endsWith('/env')).query.decrypt, 'false');
});
test('wrong domain or repository prevents every mutation', async () => {
  for (const options of [{ domains: [{ name: 'other.example', verified: true }] }, { domains: [{ name: 'turbo-ai.ca', verified: false }] }, { link: { type: 'github', org: 'wrong', repo: 'repo' } }]) {
    const mock = fixture(options);
    await assert.rejects(configureCms({ env, api: mock.api, report() {} }));
    assert.ok(mock.calls.every(call => call.method === 'GET'));
  }
});
test('existing database credentials stay untouched and preview values are preserved', async () => {
  const mock = fixture({ entries: [
    { id: 'db', key: 'MONGODB_URI', target: ['production'], type: 'sensitive' },
    { id: 'dbname', key: 'MONGODB_DB', target: ['production'] },
    { id: 'mode', key: 'VITE_CMS_ENABLED', target: ['production', 'preview'], value: 'opaque' },
  ] });
  await configureCms({ env: { ...env, MONGODB_URI: '' }, api: mock.api, report() {} });
  const writes = mock.calls.filter(call => call.method !== 'GET');
  assert.ok(!writes.some(call => call.body?.key?.startsWith('MONGODB_') || /\/env\/db/.test(call.route)));
  assert.deepEqual(writes.find(call => call.route.endsWith('/env/mode')).body, { target: ['preview'] });
  assert.deepEqual(writes.find(call => call.body?.key === 'VITE_CMS_ENABLED').body.target, ['production']);
  const deployment = writes.at(-1);
  assert.equal(deployment.route, '/v13/deployments');
  assert.equal(deployment.body.gitSource.sha, env.GITHUB_SHA);
  assert.equal(deployment.body.project, 'prj_test');
});
test('new database credentials are sent only as a production sensitive variable', async () => {
  const mock = fixture(); const lines = [];
  await configureCms({ env, api: mock.api, report: line => lines.push(line) });
  const databaseWrite = mock.calls.find(call => call.body?.key === 'MONGODB_URI');
  assert.equal(databaseWrite.body.type, 'sensitive');
  assert.deepEqual(databaseWrite.body.target, ['production']);
  assert.ok(!lines.join('').includes(env.MONGODB_URI));
});
test('missing secret and non-main apply stop before mutations', async () => {
  for (const change of [{ MONGODB_URI: '' }, { GITHUB_REF: 'refs/heads/other' }]) {
    const mock = fixture();
    await assert.rejects(configureCms({ env: { ...env, ...change }, api: mock.api, report() {} }));
    assert.ok(mock.calls.every(call => call.method === 'GET'));
  }
});
test('API failures never expose tokens, response bodies, or raw exceptions', async () => {
  const client = createVercelClient({ VERCEL_TOKEN: 'private-token' }, async () => ({ ok: false, status: 403, json: async () => ({ error: 'private-value' }) }));
  await assert.rejects(client('GET', '/v9/projects/test'), error => !/private/.test(error.message) && /HTTP 403/.test(error.message));
  const unreachable = createVercelClient({ VERCEL_TOKEN: 'private-token' }, async () => { throw new Error('private-token'); });
  await assert.rejects(unreachable('GET', '/v9/projects/test'), error => !/private-token/.test(error.message));
});
