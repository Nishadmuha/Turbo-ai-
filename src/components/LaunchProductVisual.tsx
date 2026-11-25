import { launchProducts, type LaunchProductData } from "../content/launchProducts";

export function LaunchProductVisual({ theme, compact = false, image, alt }: { theme: LaunchProductData["theme"]; compact?: boolean; image?: string; alt?: string }) {
  const product = launchProducts.find((item) => item.theme === theme)!;
  return <div className={`lp-visual lp-theme-${theme} ${compact ? "lp-visual-compact" : ""}`}><img src={image || product.image} alt={alt || product.imageAlt} loading="lazy" width="1200" height="800" /><div className="lp-card-photo-shade" aria-hidden="true" /></div>;
}
