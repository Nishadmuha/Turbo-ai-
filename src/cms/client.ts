import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const cmsProvider = import.meta.env.VITE_CMS_PROVIDER === "supabase" ? "supabase" : "mongodb";
export const mongodbEnabled = cmsProvider === "mongodb";
export const cmsApiBase = (import.meta.env.VITE_CMS_API_URL || "/api/cms").replace(/\/$/, "");
export const cmsConfigured = mongodbEnabled || Boolean(url && key);
export const cmsPublicEnabled = cmsConfigured && import.meta.env.VITE_CMS_ENABLED === "true";
// The CMS owns blog articles only. Authored website pages must never depend on it.
export const cmsEnabledFor = (kind: string) => cmsPublicEnabled && kind === "blog";

export const cmsClient: SupabaseClient | null = !mongodbEnabled && Boolean(url && key)
  ? createClient(url!, key!, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : null;

export const mediaBucket = "cms-media";

export async function cmsRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (options.method && options.method !== "GET") headers.set("X-CMS-Request", "1");
  let response: Response;
  try {
    response = await fetch(`${cmsApiBase}${path}`, { ...options, headers, credentials: "same-origin", signal: options.signal || AbortSignal.timeout(15000) });
  } catch {
    throw new Error("The CMS server could not be reached. Check your connection and try again.");
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(response.status === 413 ? "Images must be 4 MB or smaller." : "The CMS API is not available on this deployment. Ask the website administrator to check the hosting configuration.");
  }
  const payload = await response.json().catch(() => { throw new Error("The CMS server returned an invalid response. Please try again."); });
  if (!response.ok) throw new Error(payload?.error || `CMS request failed (${response.status}).`);
  return payload as T;
}
