import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Helmet } from "react-helmet-async";
import { seoConfig } from "../content/seo";
import { Container } from "./Container";
import { SectionLink } from "./SectionLink";

type ProductPageKey = "dci360" | "iLakehouse" | "adrs";

export function ProductSEO({ pageKey }: { pageKey: ProductPageKey }) {
  const meta = seoConfig[pageKey];
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: meta.url,
    image: meta.image,
    isPartOf: { "@type": "WebSite", name: "Turbo AI", url: new URL(meta.url || "https://turbo-ai.ca").origin },
  };

  return (
    <>
      <Helmet><title>{meta.title}</title></Helmet>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <link rel="canonical" href={meta.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Turbo AI" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  );
}

interface RelatedLink {
  href: string;
  title: string;
  description: string;
}

interface ProductQuestion {
  question: string;
  answer: string;
}

export function ProductRelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <section className="product-section product-related">
      <Container>
        <p className="product-eyebrow">EXPLORE MORE</p>
        <h2>Related capabilities</h2>
        <nav className="product-related-grid" aria-label="Related Turbo AI pages">
          {links.map((link) => (
            <SectionLink href={link.href} className="product-related-link" key={link.href}>
              <div>
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
              <ArrowLongRightIcon aria-hidden="true" />
            </SectionLink>
          ))}
        </nav>
      </Container>
    </section>
  );
}

export function ProductFAQ({ title, intro, items }: { title: string; intro: string; items: ProductQuestion[] }) {
  return (
    <section className="product-section product-faq">
      <Container className="product-faq-layout">
        <div>
          <p className="product-eyebrow">FREQUENTLY ASKED QUESTIONS</p>
          <h2>{title}</h2>
          <p className="product-faq-intro">{intro}</p>
        </div>
        <div className="product-faq-list">
          {items.map((item, index) => (
            <details key={item.question} name="product-faq" open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <ChevronDownIcon aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
