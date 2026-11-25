// Server/build configuration only. Never send this environment object to Vite's
// browser bundle: only the provider and enabled flag are public configuration.
export function resolveCmsBuildConfig(env) {
  const provider = env.VITE_CMS_PROVIDER === 'supabase' ? 'supabase' : 'mongodb';
  const configured = provider === 'mongodb'
    ? Boolean(env.MONGODB_URI || env.CMS_PRERENDER_API_URL)
    : Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const enabled = env.VITE_CMS_ENABLED === 'true' || (env.VITE_CMS_ENABLED !== 'false' && configured);
  return { provider, enabled };
}
