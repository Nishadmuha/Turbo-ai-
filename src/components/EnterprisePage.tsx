import { Link } from "react-router-dom";
import { Container, Section } from "./Container";
import { SectionLink } from "./SectionLink";
import { SEO } from "./SEO";
import { Connect } from "./Connect";
import { useReveal } from "../hooks/useReveal";
import { blogPosts } from "../content/blog";
import type { Diagram, EnterprisePageContent } from "../content/enterprisePages";

interface EnterprisePageProps {
  content: EnterprisePageContent;
}

function DiagramCard({ diagram }: { diagram: Diagram }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#07111F] p-5 shadow-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white">{diagram.title}</h3>
        {diagram.subtitle && <p className="mt-1 text-sm text-slate-400">{diagram.subtitle}</p>}
      </div>
      <div className="flex flex-col gap-3">
        {diagram.steps.map((step, index) => (
          <div key={`${diagram.title}-${step}`} className="flex items-center gap-3">
            <div className="flex min-h-11 flex-1 items-center rounded-md border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-white">
              {step}
            </div>
            {index < diagram.steps.length - 1 && (
              <div className="hidden h-px w-8 bg-gradient-to-r from-blue-400 to-cyan-300 sm:block" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestPerspectives() {
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Section className="bg-[#07111F] border-y border-white/5">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker text-blue-300">Latest Perspectives</p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">Insights for enterprise AI leaders</h2>
          </div>
          <Link to="/blog" className="cta-link justify-start sm:justify-center">
            View all insights
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-lg border border-white/10 bg-black/25 p-5 transition hover:-translate-y-1 hover:border-blue-400/40"
            >
              <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                {new Date(post.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <h3 className="mt-3 text-xl font-bold text-white transition group-hover:text-blue-300">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function EnterprisePage({ content }: EnterprisePageProps) {
  const { addElement } = useReveal(40);

  return (
    <main className="bg-[#020617] text-white" role="main">
      <SEO pageKey={content.seoKey} />

      <section className="relative min-h-[720px] overflow-hidden pt-28">
        <img
          src={content.heroImage}
          alt={content.heroAlt}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/88 to-[#020617]/45" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.20),transparent_36%,rgba(45,212,191,0.10))]" />

        <Container className="relative z-10 flex min-h-[600px] items-center">
          <div className="max-w-4xl">
            <p ref={addElement} className="kicker text-blue-200">
              {content.eyebrow}
            </p>
            <h1
              ref={addElement}
              className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl"
            >
              {content.title}
            </h1>
            <p ref={addElement} className="mt-5 max-w-3xl text-2xl font-semibold leading-snug text-blue-200 md:text-3xl">
              {content.subtitle}
            </p>
            <p ref={addElement} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-xl">
              {content.intro}
            </p>
            <div ref={addElement} className="mt-10 flex flex-wrap gap-4">
              <SectionLink
                href="/#connect"
                className="inline-flex min-h-12 items-center rounded-md bg-blue-500 px-6 py-3 font-bold text-white shadow-[0_0_28px_rgba(59,130,246,0.35)] transition hover:bg-blue-400"
              >
                Schedule a Consultation
              </SectionLink>
              <SectionLink
                href="/products"
                className="inline-flex min-h-12 items-center rounded-md border border-white/20 px-6 py-3 font-bold text-white transition hover:border-blue-300 hover:text-blue-200"
              >
                View Platforms
              </SectionLink>
            </div>
          </div>
        </Container>
      </section>

      {content.diagrams && (
        <Section className="bg-[#020617] border-y border-white/5">
          <Container>
            <div className="mb-10 max-w-3xl">
              <p className="kicker text-blue-300">Architecture</p>
              <h2 className="text-3xl font-bold text-white md:text-5xl">Original Turbo AI operating diagrams</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {content.diagrams.map((diagram) => (
                <DiagramCard key={diagram.title} diagram={diagram} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-[#050B16]">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {content.blocks.map((block) => (
              <article
                key={block.title}
                ref={addElement}
                className="rounded-lg border border-white/10 bg-[#07111F] p-6 shadow-xl transition hover:border-blue-400/35 md:p-8"
              >
                {block.eyebrow && <p className="kicker text-cyan-200">{block.eyebrow}</p>}
                <h2 className="text-2xl font-bold text-white md:text-3xl">{block.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">{block.body}</p>
                {block.items && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {block.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {content.technologies && (
        <Section className="bg-[#020617] border-t border-white/5">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="kicker text-blue-300">Technology Ecosystem</p>
                <h2 className="text-3xl font-bold text-white md:text-5xl">Selective, practical technology alignment</h2>
                <p className="mt-4 text-slate-300">
                  These names identify relevant technologies and frameworks. They do not imply formal partnerships or certifications.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {content.technologies.map((technology) => (
                  <div
                    key={technology}
                    className="flex min-h-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-center font-bold text-white"
                  >
                    {technology}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <LatestPerspectives />

      <Section className="bg-gradient-to-r from-blue-950 via-[#051225] to-cyan-950">
        <Container>
          <div className="max-w-4xl">
            <p className="kicker text-blue-200">Next Step</p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">{content.ctaTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-200">{content.ctaBody}</p>
            <SectionLink
              href="/#connect"
              className="mt-8 inline-flex min-h-12 items-center rounded-md bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-blue-100"
            >
              Schedule a Consultation
            </SectionLink>
          </div>
        </Container>
      </Section>

      <Connect />
    </main>
  );
}

export { DiagramCard, LatestPerspectives };
