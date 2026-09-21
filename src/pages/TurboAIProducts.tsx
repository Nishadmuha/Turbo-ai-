import { Container, Section } from "../components/Container";
import { Connect } from "../components/Connect";
import { DiagramCard, LatestPerspectives } from "../components/EnterprisePage";
import { SectionLink } from "../components/SectionLink";
import { SEO } from "../components/SEO";
import { productCards, productsHero } from "../content/enterprisePages";
import { useReveal } from "../hooks/useReveal";

export function TurboAIProducts() {
  const { addElement } = useReveal(35);

  return (
    <main className="bg-[#020617] text-white" role="main">
      <SEO pageKey="turboAIProducts" />

      <section className="relative min-h-[700px] overflow-hidden pt-28">
        <img
          src={productsHero.image}
          alt={productsHero.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/88 to-[#020617]/40" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.20),transparent_38%,rgba(20,184,166,0.14))]" />

        <Container className="relative z-10 flex min-h-[580px] items-center">
          <div className="max-w-4xl">
            <p ref={addElement} className="kicker text-blue-200">
              Turbo AI Platforms / Proprietary Technology
            </p>
            <h1 ref={addElement} className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
              Turbo AI Products / Platforms
            </h1>
            <p ref={addElement} className="mt-5 max-w-3xl text-2xl font-semibold leading-snug text-blue-200 md:text-3xl">
              Proprietary technology capabilities for enterprise intelligence
            </p>
            <p ref={addElement} className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-200">
              Turbo AI platforms connect enterprise data and operational signals to practical intelligence, with governance built into the workflow.
            </p>
          </div>
        </Container>
      </section>

      <Section className="bg-[#050B16]">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="kicker text-cyan-200">Products and Platforms</p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">Specialized Turbo AI capabilities</h2>
            <p className="mt-4 text-slate-300">
              Product descriptions are intentionally conservative and should be expanded only with client-approved material or verified product evidence.
            </p>
          </div>

          <div className="space-y-8">
            {productCards.map((product) => (
              <article
                key={product.name}
                ref={addElement}
                className="grid gap-6 rounded-lg border border-white/10 bg-[#07111F] p-6 shadow-xl lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
              >
                <div>
                  <h3 className="text-3xl font-bold text-white">{product.name}</h3>
                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Purpose</p>
                      <p className="mt-2 text-slate-300">{product.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Problem Addressed</p>
                      <p className="mt-2 text-slate-300">{product.problem}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Key Capabilities</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.capabilities.map((capability) => (
                          <span
                            key={capability}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                    <SectionLink
                      href={product.ctaHref}
                      className="inline-flex min-h-12 items-center rounded-md border border-blue-300/40 px-5 py-3 font-bold text-blue-200 transition hover:border-blue-200 hover:text-white"
                    >
                      {product.ctaHref.startsWith("http") ? "Learn More" : "Contact Turbo AI"}
                    </SectionLink>
                  </div>
                </div>
                <DiagramCard diagram={product.diagram} />
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#020617] border-y border-white/5">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="kicker text-blue-300">Future Products</p>
              <h2 className="text-3xl font-bold text-white md:text-5xl">Specialised technology capabilities continue to evolve</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-300">
              Turbo AI continues to develop specialised technology capabilities for enterprise AI, data foundations, detection and response workflows, and domain-specific intelligence. Future product announcements should be added only when supported by verified client material.
            </p>
          </div>
        </Container>
      </Section>

      <LatestPerspectives />
      <Connect />
    </main>
  );
}
