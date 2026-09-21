import { Helmet } from "react-helmet-async";
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
