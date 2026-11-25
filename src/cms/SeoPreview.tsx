import { publicPath, type CmsEntryInput } from "./types";

export function SeoPreview({ entry }: { entry: CmsEntryInput }) {
  const baseUrl = (import.meta.env.VITE_BASE_URL || "https://turbo-ai.ca").replace(/\/$/, "");
  const url = entry.canonical_url || `${baseUrl}${publicPath(entry)}`;
  const title = entry.seo_title || entry.title || "Your page title";
  const description = entry.seo_description || entry.summary || "Add a clear description that helps people understand what this page offers.";
  const image = entry.og_image || entry.hero_image;
  return <div className="admin-previews">
    <div>
      <p className="admin-eyebrow">Search preview</p>
      <div className="admin-search-preview">
        <p className="admin-search-site">Turbo AI</p>
        <p className="admin-search-url">{url}</p>
        <p className="admin-search-title">{title}</p>
        <p className="admin-search-description">{description}</p>
      </div>
      <p className="admin-preview-note">Illustrative preview. Search engines may choose different text or formatting.</p>
    </div>
    <details className="admin-social-preview">
      <summary>Preview social sharing</summary>
      {image && /^(https?:\/\/|\/(?!\/))/.test(image) && <img src={image} alt="Social sharing preview" loading="lazy" />}
      <div><p className="admin-eyebrow">Turbo AI</p><h3>{entry.og_title || title}</h3><p>{entry.og_description || description}</p></div>
    </details>
  </div>;
}
