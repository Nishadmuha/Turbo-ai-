import { createContext, useContext, useEffect, useState } from "react";
import { getPublishedEntries, getPublishedEntry } from "./api";
import { cmsEnabledFor } from "./client";
import type { CmsEntry, CmsEntrySummary, ContentKind } from "./types";

export function usePublishedEntry(kind: ContentKind, slug?: string) {
  const cmsPublicEnabled = cmsEnabledFor(kind);
  const [entry, setEntry] = useState<CmsEntry | null>(null);
  const [loading, setLoading] = useState(cmsPublicEnabled);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!cmsPublicEnabled || !slug) { setEntry(null); setLoading(false); return; }
    let active = true;
    setEntry(null); setLoading(true); setFailed(false);
    getPublishedEntry(kind, slug).then((result) => { if (active) setEntry(result); })
      .catch(() => { if (active) { setEntry(null); setFailed(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, slug, cmsPublicEnabled, attempt]);
  return { entry: entry?.kind === kind && entry.slug === slug ? entry : null, loading, failed, retry: () => setAttempt((value) => value + 1) };
}

export function usePublishedEntries(kind: ContentKind, limit = 100) {
  const cmsPublicEnabled = cmsEnabledFor(kind);
  const [entries, setEntries] = useState<CmsEntrySummary[]>([]);
  const [loading, setLoading] = useState(cmsPublicEnabled);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!cmsPublicEnabled) { setEntries([]); setLoading(false); return; }
    let active = true;
    setLoading(true); setFailed(false);
    getPublishedEntries(kind, limit).then((result) => { if (active) setEntries(result); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, limit, cmsPublicEnabled, attempt]);
  return { entries, loading, failed, retry: () => setAttempt((value) => value + 1) };
}

export const CmsProductContext = createContext<CmsEntry | null>(null);
export function useCmsProduct() { return useContext(CmsProductContext); }
export const CmsPageContext = createContext<CmsEntry | null>(null);
export function useCmsPage() { return useContext(CmsPageContext); }
