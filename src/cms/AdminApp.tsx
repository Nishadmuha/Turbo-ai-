import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { cmsConfigured, cmsProvider } from "./client";
import { getCurrentUser, signIn, signOut, subscribeAuth, type CmsUser } from "./auth";
import { createTeamUser, deleteEntry, deleteMedia, getAdminEntries, getAdminEntry, getDashboardStats, getMedia, getTeam, mediaUrl, saveEntry, updateTeamUser, uploadMedia } from "./api";
import { emptyEntry, kindLabels, kindPaths, publicPath, type CmsEntry, type CmsEntryInput, type CmsMedia, type ContentKind, type ContentStatus } from "./types";
import { SeoPreview } from "./SeoPreview";
import { BuildControls } from "./BuildControls";
import "./admin.css";

function toInput(entry: CmsEntry): CmsEntryInput {
  const { id: _id, created_at: _created, updated_at: _updated, ...input } = entry;
  void _id; void _created; void _updated;
  return input;
}

function adminKind(segment: string): "blog" | null {
  return segment === kindPaths.blog ? "blog" : null;
}

function Field({ label, value, onChange, multiline = false, required = false, hint }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; required?: boolean; hint?: string;
}) {
  const props = { value, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), required,
    className: "mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2.5 text-white outline-none focus:border-blue-400" };
  return <label className="block text-sm font-medium text-slate-200">{label}
    {multiline ? <textarea {...props} rows={5} /> : <input {...props} />}
    {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
  </label>;
}

function AdminLogin({ onLogin }: { onLogin: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await signIn(email, password); await onLogin(); }
    catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b192a] p-8 shadow-2xl">
      <Link to="/" className="text-sm text-blue-300">← Turbo AI website</Link>
      <p className="admin-eyebrow mt-8">Blog & search</p>
      <h1 className="mt-2 text-3xl font-bold">Your publishing workspace</h1>
      <p className="mt-3 text-sm text-slate-300">Sign in to manage blog posts, images, and search previews.</p>
      <div className="mt-8 space-y-5">
        <label className="block text-sm">Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#07111f] px-3 py-3" /></label>
        <label className="block text-sm">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#07111f] px-3 py-3" /></label>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      <button disabled={busy} className="mt-7 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold hover:bg-blue-500 disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  </main>;
}

function AdminShell({ children, user, logout }: { children: ReactNode; user: CmsUser; logout: () => Promise<void> }) {
  const location = useLocation();
  const links = [{ name: "Dashboard", href: "/admin/dashboard" }, { name: "Blog Posts", href: "/admin/blog" },
    { name: "Media", href: "/admin/media" }, ...(user.role === "admin" ? [{ name: "Settings", href: "/admin/settings" }, ...(cmsProvider === "mongodb" ? [{ name: "Team", href: "/admin/team" }] : [])] : [])];
  return <div className="admin-workspace min-h-screen bg-[#020617] text-white lg:flex">
    <aside className="border-b border-white/10 bg-[#07111f] p-5 lg:min-h-screen lg:w-64 lg:flex-none lg:border-b-0 lg:border-r">
      <Link to="/admin/dashboard" className="text-xl font-extrabold tracking-wide">TURBO AI <span className="text-blue-400">CMS</span></Link>
      <p className="mt-2 text-sm text-slate-400">Blog & SEO workspace</p>
      <nav aria-label="Admin" className="mt-7 flex gap-2 overflow-x-auto lg:flex-col">
        {links.map((link) => <Link key={link.href} to={link.href} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${location.pathname === link.href || location.pathname.startsWith(`${link.href}/`) ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>{link.name}</Link>)}
      </nav>
      <div className="mt-8 border-t border-white/10 pt-5 text-xs text-slate-400">
        <p className="truncate">{user.email}</p>
        <p className="mt-2 capitalize">{user.role} · {cmsProvider === "mongodb" ? "MongoDB" : "Supabase"}</p>
        <button onClick={logout} className="mt-3 text-blue-300 hover:text-white">Log out</button>
        <Link to="/" className="ml-5 text-blue-300 hover:text-white">View site</Link>
      </div>
    </aside>
    <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
  </div>;
}

function Dashboard() {
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [stats, setStats] = useState<{ kind: ContentKind; total: number; published: number; draft: number }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    Promise.all([getDashboardStats(), getAdminEntries("blog")])
      .then(([counts, recent]) => { if (active) { setStats(counts.filter((item) => item.kind === "blog")); setEntries(recent.entries.filter((entry) => entry.kind === "blog").sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 8)); } })
      .catch((failure: Error) => { if (active) setError(failure.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const cards = [
    ["Blog posts", stats.reduce((sum, item) => sum + item.total, 0)],
    ["Published", stats.reduce((sum, item) => sum + item.published, 0)],
    ["Drafts", stats.reduce((sum, item) => sum + item.draft, 0)],
  ] as const;
  return <><p className="admin-eyebrow">Blog publishing</p><h1 className="mt-2 text-3xl font-bold">Your next perspective starts here.</h1><p className="mt-3 max-w-2xl text-slate-300">Write blog posts, fine-tune search previews, and publish when everything is ready.</p>
    {error && <p role="alert" className="mt-5 text-rose-300">{error}</p>}
    <div className="mt-8 grid gap-4 sm:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#0b192a] p-5"><p className="text-sm text-slate-300">{label}</p><p className="mt-3 text-3xl font-bold text-blue-300">{loading || error ? "—" : value}</p></div>)}</div>
    <div className="admin-workflow mt-8"><div><h2>Ready for your next update?</h2><p>Write your post, check its search preview, then choose Draft or Published before saving.</p></div><Link to="/admin/blog/new" className="admin-primary">Write an article</Link><Link to="/admin/blog" className="admin-secondary">Manage blog posts</Link></div>
    <h2 className="mt-12 text-xl font-bold">Recent updates</h2><div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0b192a]">
      {entries.map((entry) => <Link key={entry.id} to={`/admin/${kindPaths[entry.kind]}/${entry.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-white/5"><span>{entry.title} <span className="ml-2 text-xs text-slate-400">{kindLabels[entry.kind]}</span></span><span className="text-xs text-slate-400">{new Date(entry.updated_at).toLocaleString()}</span></Link>)}
      {entries.length === 0 && <p className="p-5 text-slate-400">{loading ? "Loading posts…" : error ? "Posts could not be loaded." : "No posts yet. Write your first article to get started."}</p>}
    </div>
  </>;
}

function ContentList({ kind }: { kind: "blog" }) {
  const [items, setItems] = useState<CmsEntry[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const refresh = useCallback(() => {
    const currentRequest = ++requestId.current;
    getAdminEntries(kind, search, status, page).then(({ entries, count: total }) => { if (currentRequest === requestId.current) { setItems(entries); setCount(total); setError(""); } }).catch((failure: Error) => { if (currentRequest === requestId.current) setError(failure.message); });
  }, [kind, search, status, page]);
  useEffect(refresh, [refresh]);
  async function remove(entry: CmsEntry) {
    if (!window.confirm(`Delete “${entry.title}”? This cannot be undone.`)) return;
    try { await deleteEntry(entry.id); refresh(); } catch (failure) { setError((failure as Error).message); }
  }
  async function toggle(entry: CmsEntry) {
    try { await saveEntry({ ...toInput(entry), status: entry.status === "published" ? "draft" : "published" }, entry.id); refresh(); }
    catch (failure) { setError((failure as Error).message); }
  }
  return <><div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Blog Posts</h1><p className="mt-2 text-sm text-slate-300">Create, edit, preview, and publish blog posts.</p></div><Link to={`/admin/${kindPaths[kind]}/new`} className="rounded-lg bg-blue-600 px-4 py-3 font-bold hover:bg-blue-500">New post</Link></div>
    <div className="mt-8 flex flex-wrap gap-3"><input aria-label="Search by title" placeholder="Search by title" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} className="min-w-56 flex-1 rounded-lg border border-slate-600 bg-[#0b192a] px-3 py-2" /><select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value as ContentStatus | "all"); setPage(0); }} className="rounded-lg border border-slate-600 bg-[#0b192a] px-3 py-2"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
    {error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}
    <div className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0b192a]"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-white/5 text-slate-300"><tr><th className="p-4">Title</th><th className="p-4">Slug</th><th className="p-4">Status</th><th className="p-4">Updated</th><th className="p-4">Actions</th></tr></thead><tbody>{items.map((entry) => <tr key={entry.id} className="border-t border-white/10"><td className="p-4 font-semibold"><Link className="hover:text-blue-300" to={`/admin/${kindPaths[kind]}/${entry.id}`}>{entry.title}</Link></td><td className="p-4 text-slate-300">{entry.slug}</td><td className="p-4">{entry.status}</td><td className="p-4 text-slate-400">{new Date(entry.updated_at).toLocaleDateString()}</td><td className="space-x-3 whitespace-nowrap p-4"><Link to={`/admin/${kindPaths[kind]}/${entry.id}`} className="text-blue-300">Edit</Link><button onClick={() => toggle(entry)} className="text-blue-300">{entry.status === "published" ? "Unpublish" : "Publish"}</button><button onClick={() => remove(entry)} className="text-rose-300">Delete</button></td></tr>)}</tbody></table>{items.length === 0 && <p className="p-5 text-slate-400">No entries found.</p>}</div>
    <div className="mt-5 flex items-center gap-4 text-sm"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Previous</button><span>Page {page + 1} · {count} entries</span><button disabled={(page + 1) * 20 >= count} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button></div>
  </>;
}

function Editor({ kind, id }: { kind: "blog"; id?: string }) {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<CmsEntryInput>(emptyEntry(kind));
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(emptyEntry(kind)));
  const [loading, setLoading] = useState(Boolean(id));
  const [loadFailed, setLoadFailed] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const dirty = JSON.stringify(entry) !== baseline;
  useEffect(() => {
    let active = true;
    const initial = emptyEntry(kind);
    setEntry(initial); setBaseline(JSON.stringify(initial)); setError(""); setLoadFailed(false); setLoading(Boolean(id));
    if (id) getAdminEntry(id).then((record) => { if (record.kind !== "blog") throw new Error("Only blog posts can be edited in this workspace."); if (active) { const input = toInput(record); setEntry(input); setBaseline(JSON.stringify(input)); } })
      .catch((failure: Error) => { if (active) { setError(failure.message); setLoadFailed(true); } })
      .finally(() => { if (active) setLoading(false); });
    getMedia().then((items) => { if (active) setMedia(items); }).catch(() => {});
    return () => { active = false; };
  }, [kind, id]);
  useEffect(() => {
    if (!dirty || busy) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const beforeLink = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.target === "_blank" || link.href === window.location.href || link.getAttribute("href")?.startsWith("#")) return;
      if (!window.confirm("You have unsaved changes. Leave without saving?")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", beforeLink, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", beforeLink, true); };
  }, [dirty, busy]);
  function update<K extends keyof CmsEntryInput>(field: K, value: CmsEntryInput[K]) { setEntry((current) => ({ ...current, [field]: value })); }
  function listField(field: "tags", value: string) { update(field, value.split("\n").map((part) => part.trim()).filter(Boolean)); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setSavedMessage("");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) { setError("Slug must use lowercase letters, numbers, and hyphens."); return; }
    setBusy(true);
    try { const saved = await saveEntry(entry, id); const input = toInput(saved); setEntry(input); setBaseline(JSON.stringify(input)); setSavedMessage(saved.status === "published" ? "Published changes saved." : "Draft saved. It is not visible on the website."); navigate(`/admin/${kindPaths[kind]}/${saved.id}`, { replace: true }); }
    catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  const mediaPicker = (field: "hero_image" | "og_image") => <select aria-label={`Choose ${field.replace("_", " ")}`} value="" onChange={(event) => update(field, event.target.value)} className="mt-2 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2 text-sm"><option value="">Choose uploaded image…</option>{media.map((item) => <option key={item.id} value={mediaUrl(item.path)}>{item.name}</option>)}</select>;
  if (loading) return <p role="status">Loading content…</p>;
  if (loadFailed) return <div role="alert"><h1 className="text-2xl font-bold">This entry could not be loaded</h1><p className="mt-3 text-rose-300">{error}</p><Link to={`/admin/${kindPaths[kind]}`} className="mt-5 inline-block text-blue-300">Return to {kindLabels[kind].toLowerCase()}</Link></div>;
  return <><div className="flex flex-wrap items-center justify-between gap-3"><div><Link to={`/admin/${kindPaths[kind]}`} className="text-sm text-blue-300">{kindLabels[kind]}</Link><h1 className="mt-2 text-3xl font-bold">{id ? `Edit ${kind}` : `New ${kind}`}</h1></div>{id && entry.status === "published" && <Link to={publicPath(entry)} target="_blank" className="text-blue-300">View published page</Link>}</div>
    <form onSubmit={submit} className="mt-8 grid max-w-5xl gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
      <div className="space-y-8">
        <section className="space-y-5 rounded-xl border border-white/10 bg-[#0b192a] p-5"><h2 className="text-xl font-bold">Content</h2>
          <Field label="Title" value={entry.title} onChange={(value) => update("title", value)} required />
          <Field label="Slug" value={entry.slug} onChange={(value) => update("slug", value.toLowerCase().replace(/\s+/g, "-"))} required hint={`Public URL: ${publicPath(entry)}`} />
          <Field label="Excerpt" value={entry.summary} onChange={(value) => update("summary", value)} multiline />
          <div><Field label="Featured image URL" value={entry.hero_image} onChange={(value) => update("hero_image", value)} />{mediaPicker("hero_image")}{entry.hero_image && /^(https?:\/\/|\/(?!\/))/.test(entry.hero_image) && <img src={entry.hero_image} alt="Selected featured image preview" className="mt-4 max-h-52 w-full rounded-lg object-cover" />}</div>
          <Field label="Article (Markdown)" value={entry.body} onChange={(value) => update("body", value)} multiline hint="Use Markdown for headings, lists, links, and emphasis. Raw HTML is not rendered." />
          <button type="button" onClick={() => setPreview(!preview)} className="text-sm text-blue-300">{preview ? "Hide" : "Show"} content preview</button>
          {preview && <div className="prose prose-invert max-w-none rounded-lg border border-white/10 bg-[#07111f] p-5"><ReactMarkdown>{entry.body}</ReactMarkdown></div>}
        </section>
        <section className="space-y-5 rounded-xl border border-white/10 bg-[#0b192a] p-5"><h2 className="text-xl font-bold">Article details</h2><Field label="Author" value={entry.author} onChange={(value) => update("author", value)} /><Field label="Category" value={entry.category} onChange={(value) => update("category", value)} /><Field label="Tags (one per line)" value={entry.tags.join("\n")} onChange={(value) => listField("tags", value)} multiline /><Field label="Reading time (minutes)" value={String(entry.reading_time)} onChange={(value) => update("reading_time", Math.max(0, Number(value) || 0))} /><Field label="Published date (ISO 8601)" value={entry.published_at ?? ""} onChange={(value) => update("published_at", value || null)} hint="Leave empty to use the publish time." /></section>
        <section className="space-y-5 rounded-xl border border-white/10 bg-[#0b192a] p-5"><h2 className="text-xl font-bold">Search & social</h2><SeoPreview entry={entry} /><Field label="SEO title" value={entry.seo_title} onChange={(value) => update("seo_title", value)} hint={`${entry.seo_title.length} characters · Leave blank to use the post title.`} /><Field label="SEO description" value={entry.seo_description} onChange={(value) => update("seo_description", value)} multiline hint={`${entry.seo_description.length} characters · Leave blank to use the excerpt.`} /><Field label="Keywords" value={entry.seo_keywords} onChange={(value) => update("seo_keywords", value)} /><Field label="Canonical URL" value={entry.canonical_url} onChange={(value) => update("canonical_url", value)} hint="Leave blank to use this page’s public URL. Only set another URL when it is the preferred version of the same content." /><Field label="Open Graph title" value={entry.og_title} onChange={(value) => update("og_title", value)} /><Field label="Open Graph description" value={entry.og_description} onChange={(value) => update("og_description", value)} multiline /><div><Field label="Open Graph image URL" value={entry.og_image} onChange={(value) => update("og_image", value)} />{mediaPicker("og_image")}</div><label className="block text-sm">Search visibility<select value={entry.robots} onChange={(event) => update("robots", event.target.value as CmsEntryInput["robots"])} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2"><option value="index,follow">Allow search indexing</option><option value="noindex,nofollow">Ask search engines not to index</option></select></label><p className="text-sm text-slate-400">Search visibility does not make a published page private. Use Draft to keep content off the public website.</p></section>
      </div>
      <aside className="h-fit space-y-4 rounded-xl border border-white/10 bg-[#0b192a] p-5 xl:sticky xl:top-6"><h2 className="text-xl font-bold">Publishing</h2><p role="status" className={`text-sm ${dirty ? "text-amber-200" : "text-slate-400"}`}>{dirty ? "Unsaved changes" : id ? "All changes saved" : "New draft"}</p><label className="block text-sm">Status<select value={entry.status} onChange={(event) => update("status", event.target.value as ContentStatus)} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2"><option value="draft">Draft</option><option value="published">Published</option></select></label><p className="text-sm text-slate-400">{entry.status === "published" ? "Saving makes this content available on the website. Search engines may take time to pick up changes." : "Drafts are available only to your content team."}</p><p className="text-sm text-slate-400">After publishing, use Settings to refresh static blog pages and the sitemap.</p>{error && <p role="alert" className="text-sm text-rose-300">{error}</p>}{savedMessage && !dirty && <p role="status" className="text-sm text-emerald-300">{savedMessage}</p>}<button disabled={busy} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold hover:bg-blue-500 disabled:opacity-50">{busy ? "Saving…" : entry.status === "published" ? "Save & publish" : "Save draft"}</button></aside>
    </form></>;
}

function MediaManager() {
  const [items, setItems] = useState<CmsMedia[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("Blog");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = () => getMedia().then(setItems).catch((failure: Error) => setError(failure.message));
  useEffect(() => { void refresh(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); if (!file) return; setBusy(true); setError(""); try { await uploadMedia(file, alt, category); setFile(null); setAlt(""); refresh(); } catch (failure) { setError((failure as Error).message); } finally { setBusy(false); } }
  async function remove(item: CmsMedia) { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteMedia(item); refresh(); } catch (failure) { setError((failure as Error).message); } }
  return <><h1 className="text-3xl font-bold">Media</h1><p className="mt-2 text-slate-300">Upload and manage images for blog posts and social previews.</p><form onSubmit={submit} className="mt-8 grid gap-4 rounded-xl border border-white/10 bg-[#0b192a] p-5 sm:grid-cols-2"><label className="text-sm">Image<input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm" /></label><Field label="Alt text" value={alt} onChange={setAlt} required /><label className="text-sm">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2"><option>Blog</option><option>Open Graph</option></select></label><button disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 font-bold disabled:opacity-50">{busy ? "Uploading…" : "Upload image"}</button></form>{error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((item) => <div key={item.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#0b192a]"><img src={mediaUrl(item.path)} alt={item.alt} loading="lazy" className="aspect-video w-full object-cover" /><div className="space-y-2 p-4"><p className="truncate font-semibold">{item.name}</p><p className="text-xs text-slate-400">{item.category}</p><div className="flex gap-3 text-sm"><button onClick={() => navigator.clipboard.writeText(mediaUrl(item.path))} className="text-blue-300">Copy URL</button><button onClick={() => remove(item)} className="text-rose-300">Delete</button></div></div></div>)}</div></>;
}

function Settings() {
  return <><p className="admin-eyebrow">Blog publishing</p><h1 className="mt-2 text-3xl font-bold">Settings</h1><p className="mt-3 max-w-2xl text-slate-300">Manage search publishing for your blog. Titles, descriptions, and social previews are edited within each post.</p>{cmsProvider === "mongodb" ? <BuildControls /> : <p className="mt-8 text-sm text-slate-300">After publishing blog updates, run the website build to refresh static blog pages and the sitemap.</p>}</>;
}

function Team({ currentUser }: { currentUser: CmsUser }) {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const refresh = useCallback(() => getTeam().then(setUsers).catch((failure: Error) => setError(failure.message)), []);
  useEffect(() => { void refresh(); }, [refresh]);
  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await createTeamUser({ email, password, role }); setEmail(""); setPassword(""); setMessage("Team account created. Share the credentials securely with your colleague."); await refresh(); }
    catch (failure) { setError((failure as Error).message); } finally { setBusy(false); }
  }
  async function change(user: CmsUser, changes: { role?: "admin" | "editor"; disabled?: boolean }) {
    if (changes.disabled && !window.confirm(`Disable access for ${user.email}?`)) return;
    setBusy(true); setError(""); setMessage("");
    try { await updateTeamUser(user.id, changes); await refresh(); setMessage("Team access updated."); }
    catch (failure) { setError((failure as Error).message); } finally { setBusy(false); }
  }
  return <><p className="admin-eyebrow">Access management</p><h1 className="mt-2 text-3xl font-bold">Your publishing team</h1><p className="mt-3 max-w-3xl text-slate-300">Editors manage blog posts, blog SEO, and images. Administrators also manage team access and publishing settings.</p>
    <form onSubmit={create} className="mt-8 grid max-w-4xl gap-5 rounded-xl border border-white/10 bg-[#0b192a] p-5 sm:grid-cols-2"><h2 className="text-xl font-bold sm:col-span-2">Add a team member</h2><label className="block text-sm">Email<input type="email" autoComplete="off" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2.5" /></label><label className="block text-sm">Password<input type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2.5" /><span className="mt-1 block text-xs text-slate-400">At least 12 characters.</span></label><label className="block text-sm">Role<select value={role} onChange={(event) => setRole(event.target.value as "admin" | "editor")} className="mt-1 w-full rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2.5"><option value="editor">Editor</option><option value="admin">Administrator</option></select></label><button disabled={busy} className="self-start rounded-lg bg-blue-600 px-4 py-3 font-bold disabled:opacity-50">{busy ? "Working…" : "Create account"}</button></form>
    {error && <p role="alert" className="mt-5 text-rose-300">{error}</p>}{message && <p role="status" className="mt-5 text-emerald-300">{message}</p>}
    <div className="mt-8 max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#0b192a]">{users.map((user) => <div key={user.id} className="admin-team-card"><div><p className="font-semibold">{user.email}{user.id === currentUser.id ? " (you)" : ""}</p><p className="mt-1 text-sm text-slate-400">{user.disabled ? "Access disabled" : "Active account"}</p></div><select aria-label={`Role for ${user.email}`} value={user.role} disabled={busy || user.id === currentUser.id} onChange={(event) => change(user, { role: event.target.value as "admin" | "editor" })} className="rounded-lg border border-slate-600 bg-[#0c1729] px-3 py-2 text-sm disabled:opacity-50"><option value="editor">Editor</option><option value="admin">Administrator</option></select>{user.id !== currentUser.id && <button disabled={busy} onClick={() => change(user, { disabled: !user.disabled })} className={`text-sm ${user.disabled ? "text-blue-300" : "text-rose-300"}`}>{user.disabled ? "Restore access" : "Disable access"}</button>}</div>)}</div>
  </>;
}

export function AdminApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<CmsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const check = useCallback(async () => {
    if (!cmsConfigured) { setChecking(false); return; }
    try { setUser(await getCurrentUser()); setError(""); }
    catch (failure) { setError((failure as Error).message); }
    finally { setChecking(false); }
  }, []);
  useEffect(() => {
    void check();
    const unsubscribe = subscribeAuth(() => { window.setTimeout(() => { void check(); }, 0); });
    return unsubscribe;
  }, [check]);
  async function logout() { try { await signOut(); setUser(null); navigate("/admin/login"); } catch (failure) { setError((failure as Error).message); } }
  if (!cmsConfigured) return <main className="min-h-screen bg-[#020617] p-10 text-white"><h1 className="text-3xl font-bold">CMS setup required</h1><p className="mt-4">Connect the CMS API to activate your publishing workspace. Follow the local CMS setup guide to connect MongoDB and create the first administrator.</p><Link to="/" className="mt-6 inline-block text-blue-300">Return to website</Link></main>;
  if (checking) return <main className="min-h-screen bg-[#020617] p-10 text-white">Checking admin access…</main>;
  if (error) return <main className="min-h-screen bg-[#020617] p-10 text-white"><h1 className="text-3xl font-bold">Unable to connect to the CMS</h1><p role="alert" className="mt-4 text-rose-300">{error}</p><button onClick={check} className="mt-6 rounded-lg bg-blue-600 px-5 py-3">Try again</button></main>;
  if (!user) return pathname === "/admin/login" ? <AdminLogin onLogin={check} /> : <Navigate to="/admin/login" replace />;
  if (pathname === "/admin" || pathname === "/admin/login") return <Navigate to="/admin/dashboard" replace />;
  const [, , section, action] = pathname.split("/");
  const kind = adminKind(section ?? "");
  let content: ReactNode;
  if (section === "dashboard") content = <Dashboard />;
  else if (section === "media") content = <MediaManager />;
  else if (section === "settings" && user.role === "admin") content = <Settings />;
  else if (section === "team" && user.role === "admin" && cmsProvider === "mongodb") content = <Team currentUser={user} />;
  else if (kind && action === "new") content = <Editor key={`${kind}-new`} kind={kind} />;
  else if (kind && action) content = <Editor key={`${kind}-${action}`} kind={kind} id={action} />;
  else if (kind) content = <ContentList key={kind} kind={kind} />;
  else if (["pages", "products", "industries", "solutions"].includes(section)) content = <><h1 className="text-3xl font-bold">This workspace manages blog posts only</h1><p className="mt-3 text-slate-300">Website pages and products are maintained in the website project.</p><Link to="/admin/blog" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold">Go to Blog Posts</Link></>;
  else content = <h1 className="text-3xl font-bold">Admin page not found</h1>;
  return <AdminShell user={user} logout={logout}>{content}</AdminShell>;
}
