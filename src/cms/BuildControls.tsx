import { useEffect, useState } from "react";
import { getBuildStatus, startBuild, type CmsBuildStatus } from "./api";

export function BuildControls() {
  const [status, setStatus] = useState<CmsBuildStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getBuildStatus().then((result) => { if (active) setStatus(result); }).catch((failure: Error) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (status?.state !== "running") return;
    let active = true;
    const timer = window.setInterval(() => {
      getBuildStatus().then((result) => { if (active) { setStatus(result); setError(""); } }).catch((failure: Error) => { if (active) setError(failure.message); });
    }, 2500);
    return () => { active = false; window.clearInterval(timer); };
  }, [status?.state]);
  async function refresh() {
    setBusy(true); setError("");
    try { setStatus(await startBuild()); }
    catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  const running = status?.state === "running";
  return <section className="mt-8 max-w-xl space-y-4 rounded-xl border border-blue-300/20 bg-[#0b192a] p-5">
    <p className="admin-eyebrow">Blog search publishing</p>
    <h2 className="text-xl font-bold">Refresh blog search pages</h2>
    <p className="text-sm leading-relaxed text-slate-300">After publishing blog posts or their SEO changes, refresh the build so static blog pages and the sitemap include your updates.</p>
    <p className="text-sm leading-relaxed text-slate-400">This prepares the site locally. It does not push code or deploy the website.</p>
    {status && <p role="status" className={`text-sm ${status.state === "failed" ? "text-rose-300" : status.state === "succeeded" ? "text-emerald-300" : "text-blue-200"}`}>{running ? "Refreshing blog pages and sitemap. This may take a few minutes…" : status.message || (status.enabled ? "Ready to refresh." : "Local refresh is not enabled on this CMS server.")}</p>}
    {status?.finished_at && <p className="text-xs text-slate-400">Last completed: {new Date(status.finished_at).toLocaleString()}</p>}
    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
    <button type="button" disabled={!status?.enabled || running || busy} onClick={refresh} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{running || busy ? "Refreshing…" : "Refresh blog search pages"}</button>
  </section>;
}
