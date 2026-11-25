import { pathToFileURL } from 'node:url';

const domain = 'turbo-ai.ca';
const production = item => (Array.isArray(item.target) ? item.target : [item.target]).includes('production');
const variables = {
  VITE_CMS_PROVIDER: 'mongodb',
  VITE_CMS_ENABLED: 'true',
  NODEJS_HELPERS: '0',
  CMS_ORIGINS: 'https://turbo-ai.ca,https://www.turbo-ai.ca',
};
export class SetupError extends Error {
  constructor(message, details = {}) { super(message); this.status = details.status; this.code = details.code; }
}

export function createVercelClient(env, fetcher = fetch) {
  if (!env.VERCEL_TOKEN) throw new SetupError('The VERCEL_TOKEN repository secret is missing.');
  return async function api(method, pathname, body, query = {}) {
    const url = new URL(pathname, 'https://api.vercel.com');
    if (url.origin !== 'https://api.vercel.com') throw new SetupError('Unexpected API destination.');
    if (env.VERCEL_ORG_ID?.startsWith('team_')) url.searchParams.set('teamId', env.VERCEL_ORG_ID);
    for (const [key, value] of Object.entries(query)) {
      if (value === null) url.searchParams.delete(key);
      else if (value !== undefined) url.searchParams.set(key, String(value));
    }
    let response;
    try {
      response = await fetcher(url, { method, headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}`, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: 'error', signal: AbortSignal.timeout(60000) });
    } catch { throw new SetupError('The Vercel API could not be reached. No request details were logged.'); }
    if (!response.ok) {
      // Only known API codes are safe diagnostic output; messages and arbitrary
      // response bodies can contain environment values and are never logged.
      const payload = await response.json().catch(() => null);
      const code = ['forbidden', 'not_found', 'unauthorized', 'invalid_token', 'missing_scope', 'project_not_found', 'team_not_found'].includes(payload?.error?.code) ? payload.error.code : 'unclassified';
      throw new SetupError(`Vercel API request failed (HTTP ${response.status}, ${code}). Check the token permissions and project configuration.`, { status: response.status, code });
    }
    try { return await response.json(); }
    catch { throw new SetupError('Vercel returned an invalid response.'); }
  };
}

function linkedRepository(project) {
  if (project.link?.type !== 'github' || !project.link.org || !project.link.repo) return '';
  return `${project.link.org}/${project.link.repo}`.toLowerCase();
}
async function domainsFor(api, projectId) {
  const domains = [];
  let until;
  do {
    const page = await api('GET', `/v9/projects/${encodeURIComponent(projectId)}/domains`, undefined, { limit: 100, until });
    domains.push(...(page.domains || []));
    until = page.pagination?.next || undefined;
  } while (until);
  return domains;
}
function hasProductionDomain(domains) {
  return domains.some(item => item.name === domain && item.verified === true && !item.gitBranch && !item.customEnvironmentId);
}

export async function selectProject(api, env, report = () => {}) {
  if (!env.VERCEL_PROJECT_ID || !env.GITHUB_REPOSITORY) throw new SetupError('Project and repository identifiers are required.');
  const expectedRepository = env.GITHUB_REPOSITORY.toLowerCase();
  const diagnose = (stage, error) => report(JSON.stringify({ diagnostic: stage, status: error.status || 'unavailable', code: error.code || 'unclassified' }));
  async function findInContext(client, context) {
    let configured;
    try {
      configured = await client('GET', `/v9/projects/${encodeURIComponent(env.VERCEL_PROJECT_ID)}`);
      if (hasProductionDomain(await domainsFor(client, configured.id))) return configured;
    } catch (error) {
      diagnose(`${context}-configured-project`, error);
      if (![403, 404].includes(error.status)) throw error;
    }
    // Historical IDs can be stale. Listing accessible projects is read-only;
    // candidates must still match this repository and the verified live domain.
    const candidates = [];
    let until;
    do {
      const page = await client('GET', '/v10/projects', undefined, { limit: 100, until });
      for (const project of page.projects || []) {
        if (project.id === configured?.id || linkedRepository(project) !== expectedRepository) continue;
        if (hasProductionDomain(await domainsFor(client, project.id))) candidates.push(project);
      }
      until = page.pagination?.next || undefined;
    } while (until);
    return candidates.length === 1 ? candidates[0] : null;
  }
  try {
    const project = await findInContext(api, 'configured-context');
    if (project) return { project, api };
  } catch (error) {
    diagnose('configured-context-project-list', error);
    if (![401, 403, 404].includes(error.status)) throw error;
  }
  // Verify the existing token without the potentially stale team ID. Never
  // print user information, create credentials, or request broader permissions.
  const defaultApi = (method, pathname, body, query = {}) => api(method, pathname, body, { ...query, teamId: null });
  try {
    await defaultApi('GET', '/v2/user');
    report(JSON.stringify({ diagnostic: 'token-authentication', authenticated: true }));
  } catch (error) {
    diagnose('token-authentication', error);
    throw new SetupError('The existing Vercel token could not authenticate in its default context. No changes were made.');
  }
  if (env.VERCEL_ORG_ID?.startsWith('team_')) {
    try {
      const project = await findInContext(defaultApi, 'default-context');
      if (project) return { project, api: defaultApi };
    } catch (error) { diagnose('default-context-project-list', error); }
  }
  throw new SetupError('No unique accessible project linked to this repository has the verified turbo-ai.ca production domain. No changes were made.');
}

async function createVariable(api, projectId, key, value, type = 'plain') {
  const result = await api('POST', `/v10/projects/${encodeURIComponent(projectId)}/env`, { key, value, type, target: ['production'] });
  if (result.failed?.length) throw new SetupError(`Vercel did not save the ${key} production variable.`);
}
async function setProductionVariable(api, projectId, entries, key, value) {
  const existing = entries.filter(item => item.key === key && production(item));
  if (existing.length > 1) throw new SetupError(`Multiple production ${key} variables need review. No deployment was started.`);
  const item = existing[0];
  if (!item) return createVariable(api, projectId, key, value);
  const otherTargets = (Array.isArray(item.target) ? item.target : [item.target]).filter(target => target !== 'production');
  if (otherTargets.length || item.customEnvironmentIds?.length) {
    // Keep the original record/value for preview, development and custom targets.
    // Never decrypt it or silently replace those environments' configuration.
    await api('PATCH', `/v9/projects/${encodeURIComponent(projectId)}/env/${encodeURIComponent(item.id)}`, { target: otherTargets });
    return createVariable(api, projectId, key, value);
  }
  await api('PATCH', `/v9/projects/${encodeURIComponent(projectId)}/env/${encodeURIComponent(item.id)}`, { value, type: 'plain' });
}

export async function configureCms({ env = process.env, api = createVercelClient(env), report = console.log } = {}) {
  const mode = env.CMS_SETUP_MODE || 'inspect';
  if (!['inspect', 'apply'].includes(mode)) throw new SetupError('Choose inspect or apply mode.');
  const selection = await selectProject(api, env, report);
  const project = selection.project;
  api = selection.api;
  const response = await api('GET', `/v10/projects/${encodeURIComponent(project.id)}/env`, undefined, { decrypt: 'false' });
  const entries = response.envs || [];
  const keys = [...new Set(entries.filter(production).map(item => item.key))].sort();
  report(JSON.stringify({ mode, project: project.name, domain, repository: linkedRepository(project), productionVariableKeys: keys }));
  if (mode === 'inspect') return { project: project.name, domain, keys };

  // Complete all identity/configuration checks before the first environment write.
  if (linkedRepository(project) !== env.GITHUB_REPOSITORY.toLowerCase()) throw new SetupError('The verified domain project is linked to a different GitHub repository. No changes were made.');
  if (env.GITHUB_REF !== 'refs/heads/main' || !/^[a-f0-9]{40}$/i.test(env.GITHUB_SHA || '') || !/^\d+$/.test(env.GITHUB_REPOSITORY_ID || '')) throw new SetupError('Apply mode requires the main branch and a valid GitHub commit and repository ID.');
  if (!keys.includes('MONGODB_URI') && !/^mongodb(?:\+srv)?:\/\/\S+$/.test(env.MONGODB_URI || '')) throw new SetupError('A valid MONGODB_URI repository secret is required. No changes were made.');
  for (const key of Object.keys(variables)) {
    if (entries.filter(item => item.key === key && production(item)).length > 1) throw new SetupError(`Multiple production ${key} variables need review. No changes were made.`);
  }
  // Recheck ownership immediately before mutation rather than trusting stale state.
  if (!hasProductionDomain(await domainsFor(api, project.id))) throw new SetupError('Production domain ownership changed. No changes were made.');
  if (!keys.includes('MONGODB_URI')) await createVariable(api, project.id, 'MONGODB_URI', env.MONGODB_URI, 'sensitive');
  if (!keys.includes('MONGODB_DB')) await createVariable(api, project.id, 'MONGODB_DB', 'turbo_ai_cms');
  for (const [key, value] of Object.entries(variables)) await setProductionVariable(api, project.id, entries, key, value);
  report('Production CMS variables configured. Existing database credentials and non-production settings were preserved.');
  const deployment = await api('POST', '/v13/deployments', {
    name: project.name,
    project: project.id,
    target: 'production',
    gitSource: { type: 'github', repoId: env.GITHUB_REPOSITORY_ID, ref: 'main', sha: env.GITHUB_SHA },
  }, { forceNew: '1' });
  report(JSON.stringify({ deployment: deployment.id, state: deployment.readyState || deployment.status || 'QUEUED', url: deployment.url }));
  return { project: project.name, deploymentId: deployment.id };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  configureCms().catch(error => {
    console.error(error instanceof SetupError ? error.message : 'CMS hosting setup failed. Internal details were omitted to protect credentials.');
    process.exitCode = 1;
  });
}
