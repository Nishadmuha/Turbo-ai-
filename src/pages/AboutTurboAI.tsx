import { Container, Section } from "../components/Container";
import { Connect } from "../components/Connect";
import { LatestPerspectives } from "../components/EnterprisePage";
import { SectionLink } from "../components/SectionLink";
import { SEO } from "../components/SEO";
import { aboutTurboAI } from "../content/enterprisePages";
import { useReveal } from "../hooks/useReveal";

export function AboutTurboAI() {
  const { addElement } = useReveal(40);

  return (
    <main className="bg-[#020617] text-white" role="main">
      <SEO pageKey={aboutTurboAI.seoKey} />

      <section className="relative min-h-[680px] overflow-hidden pt-28">
        <img
          src={aboutTurboAI.image}
          alt={aboutTurboAI.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-[#020617]/45" />
        <Container className="relative z-10 flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p ref={addElement} className="kicker text-blue-200">
              {aboutTurboAI.eyebrow}
            </p>
            <h1 ref={addElement} className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
              {aboutTurboAI.title}
            </h1>
            <p ref={addElement} className="mt-5 max-w-3xl text-2xl font-semibold leading-snug text-blue-200 md:text-3xl">
              {aboutTurboAI.subtitle}
            </p>
          </div>
        </Container>
      </section>

      <Section className="bg-[#050B16]">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { label: "Mission", body: aboutTurboAI.mission },
              { label: "Vision", body: aboutTurboAI.vision },
              { label: "Approach", body: aboutTurboAI.approach },
            ].map((item) => (
              <article key={item.label} ref={addElement} className="rounded-lg border border-white/10 bg-[#07111F] p-6 shadow-xl">
                <p className="kicker text-cyan-200">{item.label}</p>
                <h2 className="text-2xl font-bold text-white">{item.body}</h2>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#020617] border-y border-white/5">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="kicker text-blue-300">Principles</p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">How Turbo AI approaches enterprise technology</h2>
            <p className="mt-4 text-slate-300">
              Turbo AI is positioned around practical intelligence: strategy connected to delivery, data connected to decisions, and systems built with governance from the beginning.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aboutTurboAI.principles.map((principle) => (
              <div
                key={principle}
                ref={addElement}
                className="flex min-h-28 items-center rounded-lg border border-white/10 bg-white/[0.04] p-5 text-xl font-bold text-white"
              >
                {principle}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-gradient-to-r from-blue-950 via-[#051225] to-cyan-950">
        <Container>
          <div className="max-w-4xl">
            <p className="kicker text-blue-200">Final CTA</p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">The Intelligent Enterprise Is Being Built Now</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-200">
              Turbo AI helps organisations move from ambition to engineered capability across AI, data, software, security, cloud, and proprietary platforms.
            </p>
            <SectionLink
              href="/#connect"
              className="mt-8 inline-flex min-h-12 items-center rounded-md bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-blue-100"
            >
              Schedule a Consultation
            </SectionLink>
          </div>
        </Container>
      </Section>

      <LatestPerspectives />
      <Connect />
    </main>
  );
}
