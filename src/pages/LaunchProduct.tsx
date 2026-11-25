import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { Container } from "../components/Container";
import { Connect } from "../components/Connect";
import { SectionLink } from "../components/SectionLink";
import { SEO } from "../components/SEO";
import { launchProducts, solutionScopeNote } from "../content/launchProducts";
import { CmsNotFound, CmsUnavailable } from "../cms/CmsContentPage";
import { usePublishedEntry } from "../cms/hooks";
import { cmsEnabledFor, mongodbEnabled } from "../cms/client";
import { CmsSEO } from "../cms/CmsSEO";
import "../components/launch-products.css";
import "../components/product-hero.css";

const seoKeys = { "interstellar-one": "interstellarOne", "spectra-plus": "spectraPlus", "quantum-apex": "quantumApex", "orbit-core": "orbitCore" } as const;

function HeroMotion({ theme }: { theme: string }) {
  if (theme === "data") return <svg className="lp-hero-effect lp-data-flow" viewBox="0 0 640 640" fill="none" aria-hidden="true">
    <g className="lp-data-grid"><path d="M60 160H580M60 320H580M60 480H580M160 60V580M320 60V580M480 60V580" /></g>
    <path className="lp-data-route" d="M20 460C180 460 110 200 300 200S430 380 620 120" />
    <path className="lp-data-route" d="M20 520C180 520 180 340 320 340S420 200 620 200" />
    <path className="lp-data-route" d="M20 380C180 380 200 460 340 460S460 280 620 280" />
    <g className="lp-data-points"><circle cx="300" cy="200" r="7" /><circle cx="320" cy="340" r="7" /><circle cx="340" cy="460" r="7" /></g>
  </svg>;
  if (theme === "security") return <div className="lp-hero-effect lp-security-field" aria-hidden="true"><div className="lp-security-radar"><span className="lp-radar-sweep" /><i /><i /><i /><span className="lp-radar-signal" /><span className="lp-radar-signal" /></div><span className="lp-security-corner" /><span className="lp-security-corner" /></div>;
  if (theme === "automation") return <svg className="lp-hero-effect lp-workflow-flow" viewBox="0 0 640 640" fill="none" aria-hidden="true">
    <path className="lp-workflow-route" d="M60 480H190V320H360V160H570" />
    <path className="lp-workflow-route lp-workflow-route-secondary" d="M190 320V160H360M360 320H510V480H600" />
    <g className="lp-workflow-node"><rect x="155" y="445" width="70" height="70" rx="18" /><circle cx="190" cy="480" r="7" /></g>
    <g className="lp-workflow-node"><rect x="155" y="285" width="70" height="70" rx="18" /><circle cx="190" cy="320" r="7" /></g>
    <g className="lp-workflow-node"><rect x="325" y="285" width="70" height="70" rx="18" /><circle cx="360" cy="320" r="7" /></g>
    <g className="lp-workflow-node"><rect x="325" y="125" width="70" height="70" rx="18" /><circle cx="360" cy="160" r="7" /></g>
  </svg>;
  return <div className="lp-hero-effect lp-cloud-orbits" aria-hidden="true"><div className="lp-orbit"><span /></div><div className="lp-orbit"><span /></div><div className="lp-orbit"><span /></div><div className="lp-orbit-core" /></div>;
}

export function LaunchProduct({ slug }: { slug: string }) {
  const cmsPublicEnabled = cmsEnabledFor("product");
  const [activeStep, setActiveStep] = useState(0);
  const { entry, loading, failed } = usePublishedEntry("product", slug);
  const product = launchProducts.find((item) => item.slug === slug);
  if (!product) return <CmsNotFound />;
  if (cmsPublicEnabled && loading) return <main data-cms-loading className="min-h-screen bg-[#050c18] pt-40 text-center text-white">Loading product…</main>;
  if (cmsPublicEnabled && failed) return <CmsUnavailable />;
  if (cmsPublicEnabled && mongodbEnabled && !entry) return <CmsNotFound />;
  const workflow = entry?.features.length ? entry.features.slice(0, 4) : product.workflow;
  const name = entry?.title || product.name;
  const image = entry?.hero_image || product.image;
  const capabilities = entry ? entry.sections : product.capabilities.map(({ title, description }) => ({ title, body: description, image: "" }));
  const siteUrl = (import.meta.env.VITE_BASE_URL || "https://turbo-ai.ca").replace(/\/$/, "");
  const canonical = entry?.canonical_url || `${siteUrl}/products/${product.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name, item: canonical },
  ] };
  return <main id="main" data-cms-ready="true" className={`lp-surface lp-detail lp-theme-${product.theme}`}>
    {entry ? <CmsSEO entry={entry} /> : <SEO pageKey={seoKeys[product.slug as keyof typeof seoKeys]} url={canonical} image={product.image} />}
    <Helmet defer={false}><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>
    <section className="lp-photo-hero" aria-labelledby="product-title">
      <div className="lp-hero-backdrop"><img className="lp-hero-photo" src={image} alt={product.imageAlt} fetchPriority="high" width="1200" height="900" /></div>
      <div className="lp-hero-shade" aria-hidden="true" />
      <HeroMotion theme={product.theme} />
      <Container className="lp-hero-content">
        <div className="lp-hero-copy"><p className="lp-category">{entry?.category || product.category}</p><h1 id="product-title">{name}</h1><p className="lp-photo-tagline">{entry?.hero_title || product.tagline}</p><p className="lp-photo-summary">{entry?.hero_description || product.summary}</p><div className="lp-actions"><SectionLink href={entry?.cta_url || "#connect"} className="lp-button">{entry?.cta_text || product.cta}</SectionLink><SectionLink href="#capabilities" className="lp-text-link">Explore capabilities</SectionLink></div></div>
        <div className="lp-hero-foot"><div className="lp-hero-signature"><span className="lp-signature-line" aria-hidden="true" /><p>{product.shortLabel}<span>Designed around your enterprise.</span></p></div></div>
      </Container>
    </section>
    <Container>
      <section className="lp-story"><div><p className="lp-eyebrow">The opportunity</p><h2>{product.headline}</h2></div><div className="lp-story-copy">{entry?.body ? <ReactMarkdown>{entry.body}</ReactMarkdown> : product.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
      <section className="lp-workflow" aria-labelledby="workflow-title"><div className="lp-section-heading"><div><p className="lp-eyebrow">From ambition to action</p><h2 id="workflow-title">How it comes together.</h2></div><p>Explore the stages of a practical implementation.</p></div><div className="lp-workflow-track" role="tablist" aria-label={`${name} implementation stages`}>{workflow.map((step, index) => <button key={step} id={`step-${index}`} role="tab" aria-selected={activeStep === index} aria-controls="workflow-panel" tabIndex={activeStep === index ? 0 : -1} onClick={() => setActiveStep(index)} onKeyDown={(event) => { const next = event.key === "ArrowRight" ? (index + 1) % workflow.length : event.key === "ArrowLeft" ? (index + workflow.length - 1) % workflow.length : event.key === "Home" ? 0 : event.key === "End" ? workflow.length - 1 : null; if (next !== null) { event.preventDefault(); setActiveStep(next); document.getElementById(`step-${next}`)?.focus(); } }}><span className="lp-step-marker" aria-hidden="true" /><span>{step}</span></button>)}</div><div id="workflow-panel" className="lp-workflow-panel" role="tabpanel" aria-labelledby={`step-${activeStep}`}><strong>{workflow[activeStep]}</strong><p>{[
        `Start with your goals, existing systems and the challenges ${name} should address. Agree the requirements and the measures that matter to your team.`,
        `Bring the right sources, applications and stakeholders together. Define access, integration boundaries and the information needed for ${product.shortLabel.toLowerCase()}.`,
        `Configure the capabilities around your operating environment. Validate the results with your team before extending the scope.`,
        `Keep approvals, accountability and ongoing review in the process. Evolve the solution as your enterprise requirements change.`,
      ][activeStep]}</p></div></section>
      <section className="lp-detail-content" id="capabilities" aria-labelledby="capabilities-heading"><div className="lp-detail-intro"><p className="lp-eyebrow">Built for the work ahead</p><h2 id="capabilities-heading">Your next capability.<br />Connected to your business.</h2><div className="lp-outcome"><h3>What this makes possible</h3>{entry ? <ul>{entry.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul> : <p>{product.outcome}</p>}</div><p className="lp-eyebrow">Designed for</p><ul className="lp-industries">{(entry?.tags.length ? entry.tags : product.industries).map((industry) => <li key={industry}>{industry}</li>)}</ul></div><ol className="lp-capabilities">{capabilities.map((capability) => <li key={capability.title}><details open><summary>{capability.title}</summary><div className="lp-capability-body"><ReactMarkdown>{capability.body}</ReactMarkdown>{capability.image && <img src={capability.image} alt={capability.title} loading="lazy" />}</div></details></li>)}</ol></section>
      <p className="lp-scope-note">{solutionScopeNote}</p>
      <section className="lp-related"><p className="lp-eyebrow">More ways to move forward</p><h2>Explore the product family.</h2><nav className="lp-related-links" aria-label="Other enterprise products">{launchProducts.filter((item) => item.slug !== product.slug).map((item) => <SectionLink key={item.slug} href={`/products/${item.slug}`} className={`lp-related-card lp-theme-${item.theme}`}><span>{item.shortLabel}</span><strong>{item.name}</strong></SectionLink>)}</nav></section>
    </Container><Connect />
  </main>;
}
