import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { launchProducts } from "../content/launchProducts";
import { SectionLink } from "./SectionLink";
import { LaunchProductVisual } from "./LaunchProductVisual";
import "./launch-products.css";
import { usePublishedEntries } from "../cms/hooks";
import { cmsEnabledFor, mongodbEnabled } from "../cms/client";

export function MotionToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  const Icon = paused ? PlayIcon : PauseIcon;
  return <button type="button" className="lp-motion-toggle" aria-pressed={paused} onClick={onToggle}><Icon aria-hidden="true" />{paused ? "Resume animations" : "Pause animations"}</button>;
}

export function LaunchProductCards() {
  const cmsPublicEnabled = cmsEnabledFor("product");
  const { entries } = usePublishedEntries("product");
  const visible = launchProducts.filter((product) => !cmsPublicEnabled || !mongodbEnabled || entries.some((entry) => entry.slug === product.slug));
  return <div className="lp-card-grid">{visible.map((base) => {
    const entry = entries.find((item) => item.slug === base.slug);
    const product = { ...base, name: entry?.title || base.name, category: entry?.category || base.category, summary: entry?.summary || base.summary, tagline: entry?.hero_title || base.tagline };
    return (
    <article key={product.slug} className={`lp-card lp-theme-${product.theme}`}>
      <div className="lp-card-art"><span className="lp-card-number">{product.shortLabel}</span><LaunchProductVisual theme={product.theme} compact image={entry?.hero_image} /></div>
      <div className="lp-card-body">
        <p className="lp-category">{product.category}</p>
        <h3><SectionLink href={`/products/${product.slug}`}>{product.name}</SectionLink></h3>
        <p className="lp-card-tagline">{product.tagline}</p>
        <p className="lp-card-summary">{product.summary}</p>
        <SectionLink href={`/products/${product.slug}`} className="lp-text-link">Explore {product.name}</SectionLink>
      </div>
    </article>
  ); })}</div>;
}
