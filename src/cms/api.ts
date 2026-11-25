import { cmsClient, cmsEnabledFor, mediaBucket, mongodbEnabled, cmsRequest } from "./client";
import type { CmsUser } from "./auth";
import type { CmsEntry, CmsEntryInput, CmsEntrySummary, CmsMedia, ContentKind, ContentStatus } from "./types";
import { isRetiredProduct, sanitizePublishedEntry } from "../content/retiredProducts.mjs";

const listCache = new Map<string, { expires: number; promise: Promise<CmsEntrySummary[]> }>();
const entryCache = new Map<string, { expires: number; promise: Promise<CmsEntry | null> }>();
const cacheMs = 30_000;
function clearPublicCache() { listCache.clear(); entryCache.clear(); }

function requireClient() {
  if (!cmsClient) throw new Error("CMS is not configured. Set the Supabase URL and publishable key.");
  return cmsClient;
}

export async function getPublishedEntries(kind: ContentKind, limit = 100): Promise<CmsEntrySummary[]> {
  if (!cmsEnabledFor(kind)) return [];
  const cacheKey = `${kind}:${limit}`;
  const cached = listCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.promise;
  const promise = (async () => {
    if (mongodbEnabled) return (await cmsRequest<CmsEntrySummary[]>(`/entries?kind=${kind}&limit=${limit}`)).filter((entry) => !isRetiredProduct(entry.kind, entry.slug)).map(sanitizePublishedEntry);
    const { data, error } = await requireClient().from("cms_entries")
    .select("id,kind,slug,title,status,summary,hero_title,hero_description,hero_image,sections,features,benefits,related_products,related_industries,cta_text,cta_url,seo_title,seo_description,seo_keywords,canonical_url,og_title,og_description,og_image,robots,author,category,tags,reading_time,published_at,created_at,updated_at")
    .eq("kind", kind).eq("status", "published")
    .order("published_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return ((data ?? []) as CmsEntrySummary[])
      .filter((entry) => !isRetiredProduct(entry.kind, entry.slug)).map(sanitizePublishedEntry);
  })();
  listCache.set(cacheKey, { expires: Date.now() + cacheMs, promise });
  promise.catch(() => listCache.delete(cacheKey));
  return promise;
}

export async function getPublishedEntry(kind: ContentKind, slug: string): Promise<CmsEntry | null> {
  if (!cmsEnabledFor(kind) || isRetiredProduct(kind, slug)) return null;
  const cacheKey = `${kind}:${slug}`;
  const cached = entryCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.promise;
  const promise = (async () => {
    if (mongodbEnabled) {
      const entry = await cmsRequest<CmsEntry | null>(`/entries/${kind}/${encodeURIComponent(slug)}`);
      return entry ? sanitizePublishedEntry(entry) : null;
    }
    const { data, error } = await requireClient().from("cms_entries")
    .select("*").eq("kind", kind).eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return data ? sanitizePublishedEntry(data as CmsEntry) : null;
  })();
  entryCache.set(cacheKey, { expires: Date.now() + cacheMs, promise });
  promise.catch(() => entryCache.delete(cacheKey));
  return promise;
}

export async function getAdminEntries(kind: ContentKind, search = "", status: ContentStatus | "all" = "all", page = 0) {
  if (kind !== "blog") throw new Error("The CMS manages blog posts only.");
  if (mongodbEnabled) return cmsRequest<{ entries: CmsEntry[]; count: number }>(`/admin/entries?${new URLSearchParams({ kind, search, status, page: String(page) })}`);
  let query = requireClient().from("cms_entries").select("*", { count: "exact" })
    .eq("kind", kind).order("updated_at", { ascending: false }).range(page * 20, page * 20 + 19);
  if (status !== "all") query = query.eq("status", status);
  if (search.trim()) query = query.ilike("title", `%${search.trim().replace(/[%_]/g, "")}%`);
  const { data, error, count } = await query;
  if (error) throw error;
  return { entries: (data ?? []) as CmsEntry[], count: count ?? 0 };
}

export async function getAdminEntry(id: string): Promise<CmsEntry> {
  if (mongodbEnabled) return cmsRequest<CmsEntry>(`/admin/entries/${encodeURIComponent(id)}`);
  const { data, error } = await requireClient().from("cms_entries").select("*").eq("id", id).eq("kind", "blog").single();
  if (error) throw error;
  return data as CmsEntry;
}

export async function saveEntry(input: CmsEntryInput, id?: string): Promise<CmsEntry> {
  if (input.kind !== "blog") throw new Error("The CMS manages blog posts only.");
  if (mongodbEnabled) {
    const saved = await cmsRequest<CmsEntry>(`/admin/entries${id ? `/${encodeURIComponent(id)}` : ""}`, { method: id ? "PUT" : "POST", body: JSON.stringify(input) });
    clearPublicCache();
    return saved;
  }
  const safeUrl = (value: string) => !value || /^(https?:\/\/|\/|#)/i.test(value);
  for (const field of ["cta_url", "canonical_url", "hero_image", "og_image"] as const) {
    if (!safeUrl(input[field])) throw new Error(`${field.replace("_", " ")} must be an HTTP(S), site-relative, or anchor URL.`);
  }
  if (input.sections.some((section) => !safeUrl(section.image || ""))) throw new Error("Section images must use HTTP(S) or site-relative URLs.");
  const payload = {
    ...input,
    slug: input.slug.trim().toLowerCase(),
    title: input.title.trim(),
    published_at: input.status === "published" ? input.published_at || new Date().toISOString() : input.published_at,
  };
  const query = id
    ? requireClient().from("cms_entries").update(payload).eq("id", id).eq("kind", "blog")
    : requireClient().from("cms_entries").insert(payload);
  const { data, error } = await query.select("*").single();
  if (error) throw error;
  clearPublicCache();
  return data as CmsEntry;
}

export async function deleteEntry(id: string) {
  if (mongodbEnabled) { await cmsRequest(`/admin/entries/${encodeURIComponent(id)}`, { method: "DELETE" }); clearPublicCache(); return; }
  const { error } = await requireClient().from("cms_entries").delete().eq("id", id).eq("kind", "blog");
  if (error) throw error;
  clearPublicCache();
}

export async function getMedia(): Promise<CmsMedia[]> {
  if (mongodbEnabled) return cmsRequest<CmsMedia[]>("/admin/media");
  const { data, error } = await requireClient().from("cms_media").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CmsMedia[];
}

export function mediaUrl(path: string) {
  if (mongodbEnabled) return path;
  return requireClient().storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadMedia(file: File, alt: string, category: string): Promise<CmsMedia> {
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'].includes(file.type)) throw new Error("Choose a PNG, JPEG, WebP, AVIF, or GIF image.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Images must be 4 MB or smaller.");
  if (mongodbEnabled) {
    const body = new FormData(); body.append("file", file); body.append("alt", alt); body.append("category", category);
    return cmsRequest<CmsMedia>("/admin/media", { method: "POST", body });
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "img";
  const path = `${crypto.randomUUID()}.${ext}`;
  const client = requireClient();
  const uploaded = await client.storage.from(mediaBucket).upload(path, file, { contentType: file.type, upsert: false });
  if (uploaded.error) throw uploaded.error;
  const { data, error } = await client.from("cms_media").insert({ name: file.name, path, alt, category }).select("*").single();
  if (error) {
    await client.storage.from(mediaBucket).remove([path]);
    throw error;
  }
  return data as CmsMedia;
}

export async function deleteMedia(media: CmsMedia) {
  if (mongodbEnabled) { await cmsRequest(`/admin/media/${encodeURIComponent(media.id)}`, { method: "DELETE" }); return; }
  const client = requireClient();
  const { error } = await client.storage.from(mediaBucket).remove([media.path]);
  if (error) throw error;
  const deleted = await client.from("cms_media").delete().eq("id", media.id);
  if (deleted.error) throw deleted.error;
}

export async function getDashboardStats(): Promise<{ kind: ContentKind; total: number; published: number; draft: number }[]> {
  if (mongodbEnabled) return cmsRequest("/admin/stats");
  return Promise.all((["blog"] as ContentKind[]).map(async (kind) => {
    const [published, draft] = await Promise.all(["published", "draft"].map(async (status) => {
      const { count, error } = await requireClient().from("cms_entries").select("id", { count: "exact", head: true }).eq("kind", kind).eq("status", status);
      if (error) throw error; return count || 0;
    }));
    return { kind, total: published + draft, published, draft };
  }));
}
export async function getTeam(): Promise<CmsUser[]> {
  if (!mongodbEnabled) throw new Error("Manage Supabase users in your Supabase dashboard.");
  return cmsRequest("/admin/team");
}
export async function createTeamUser(input: { email: string; password: string; role: CmsUser["role"] }): Promise<CmsUser> {
  if (!mongodbEnabled) throw new Error("Manage Supabase users in your Supabase dashboard.");
  return cmsRequest("/admin/team", { method: "POST", body: JSON.stringify(input) });
}
export async function updateTeamUser(id: string, input: { role?: CmsUser["role"]; password?: string; disabled?: boolean }): Promise<CmsUser> {
  if (!mongodbEnabled) throw new Error("Manage Supabase users in your Supabase dashboard.");
  return cmsRequest(`/admin/team/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
}

export interface CmsBuildStatus {
  enabled: boolean;
  state: "idle" | "running" | "succeeded" | "failed";
  started_at: string | null;
  finished_at: string | null;
  message: string;
}
export async function getBuildStatus(): Promise<CmsBuildStatus> {
  if (!mongodbEnabled) throw new Error("Local site refresh requires the MongoDB CMS server.");
  return cmsRequest("/admin/rebuild");
}
export async function startBuild(): Promise<CmsBuildStatus> {
  if (!mongodbEnabled) throw new Error("Local site refresh requires the MongoDB CMS server.");
  return cmsRequest("/admin/rebuild", { method: "POST", body: "{}" });
}
