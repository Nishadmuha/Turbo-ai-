export function resolveCmsBuildConfig(env: Record<string, string | undefined>): {
  provider: "mongodb" | "supabase";
  enabled: boolean;
};
