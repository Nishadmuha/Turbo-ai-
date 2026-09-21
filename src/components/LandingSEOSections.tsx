import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeftIcon, ArrowRightIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Container, Section } from "./Container";
import { SectionLink } from "./SectionLink";
import { blogPosts } from "../content/blog";

export interface LandingFAQItem {
  question: string;
  answer: string;
}

export function LandingFAQ({ title, intro, items }: { title: string; intro: string; items: LandingFAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Section className="border-t border-white/10 bg-[#050b16]">
      <Helmet><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="kicker text-cyan-200">Frequently Asked Questions</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-300">{intro}</p>
          </div>
          <div className="divide-y divide-white/15 border-y border-white/15">
            {items.map((item, index) => (
              <details key={item.question} open={index === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-lg font-bold text-white">
                  <span>{item.question}</span><span className="text-blue-300 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function RelatedInsights({ slugs, title = "Insights for the next decision", intro = "Explore practical guidance connected to this topic." }: { slugs: string[]; title?: string; intro?: string }) {
  const posts = slugs.map((slug) => blogPosts.find((post) => post.slug === slug)).filter((post): post is NonNullable<typeof post> => Boolean(post));
  if (!posts.length) return null;

  return (
    <Section className="border-y border-white/10 bg-[#07111f]">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="kicker text-blue-300">Related Insights</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">{title}</h2>
          <p className="mt-4 leading-relaxed text-slate-300">{intro}</p>
        </div>
        <div className={`grid gap-6 ${posts.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {posts.map((post) => (
            <SectionLink key={post.slug} href={`/blog/${post.slug}`} className="group border-t border-blue-400/50 bg-black/15 p-5 transition hover:bg-white/[0.04]">
              <time dateTime={post.date} className="text-xs font-bold uppercase text-blue-300">{new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</time>
              <h3 className="mt-3 text-xl font-bold text-white transition group-hover:text-blue-200">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>
              <span className="mt-5 inline-block font-semibold text-cyan-200">Read insight <span aria-hidden="true">→</span></span>
            </SectionLink>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function EnergyStyleInsights({ slugs, title, intro }: { slugs: string[]; title: string; intro: string }) {
  const posts = slugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));
  const [activeIndex, setActiveIndex] = useState(0);

  if (!posts.length) return null;

  const showPrevious = () => setActiveIndex((current) => (current - 1 + posts.length) % posts.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % posts.length);

  return (
    <Section id="service-insights" className="border-b border-white/5 bg-[#020617] py-20 sm:py-28">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-blue-500 sm:text-sm">Latest Insights</p>
            <h2 id="service-insights-heading" className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">{intro}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-transparent text-white transition hover:border-blue-500 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous insight"
              disabled={posts.length < 2}
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next insight"
              disabled={posts.length < 2}
            >
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((_, index) => {
            const post = posts[(index + activeIndex) % posts.length];
            const category = post.tags?.[0] || "Insight";
            return (
              <article key={post.slug}>
                <SectionLink href={`/blog/${post.slug}`} className="group block transition duration-300 hover:-translate-y-1">
                  <div className="mb-6 aspect-[16/10] overflow-hidden rounded-3xl bg-[#050B16] shadow-xl">
                    <img
                      src={post.image || "/enterprise/ai-team.jpg"}
                      alt={post.imageAlt || `${post.title} insight`}
                      width={640}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-md border border-blue-500/30 bg-[#0C152B] px-3 py-1 font-mono text-xs font-bold uppercase text-blue-400">
                      {category}
                    </span>
                    <time dateTime={post.date} className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
                      {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                  </div>
                  <h3 className="mb-3 text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-blue-400 sm:text-2xl">{post.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-white transition-colors group-hover:text-blue-400">
                    Read More <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </SectionLink>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
