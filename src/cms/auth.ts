import { cmsClient, cmsRequest, mongodbEnabled } from "./client";

export interface CmsUser { id: string; email: string; role: "admin" | "editor"; disabled?: boolean; }
export async function getCurrentUser(): Promise<CmsUser | null> {
  if (mongodbEnabled) return cmsRequest<CmsUser | null>("/auth/me");
  if (!cmsClient) return null;
  const { data, error } = await cmsClient.auth.getUser();
  if (error || !data.user) return null;
  const membership = await cmsClient.from("cms_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (membership.error) throw membership.error;
  if (!membership.data) throw new Error("This account does not have CMS access.");
  return { id: data.user.id, email: data.user.email || "", role: "admin" };
}
export async function signIn(email: string, password: string): Promise<CmsUser> {
  if (mongodbEnabled) return cmsRequest<CmsUser>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  if (!cmsClient) throw new Error("CMS is not configured.");
  const { error } = await cmsClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const user = await getCurrentUser();
  if (!user) throw new Error("This account does not have CMS access.");
  return user;
}
export async function signOut(): Promise<void> {
  if (mongodbEnabled) { await cmsRequest("/auth/logout", { method: "POST" }); return; }
  await cmsClient?.auth.signOut();
}
export function subscribeAuth(callback: () => void): () => void {
  const subscription = cmsClient?.auth.onAuthStateChange(() => { window.setTimeout(callback, 0); });
  return () => subscription?.data.subscription.unsubscribe();
}
