import { Link } from "react-router-dom";
import { Container, Section } from "./Container";
import { SectionLink } from "./SectionLink";
import { SEO } from "./SEO";

interface ProductDetailProps {
  seoKey: string;
  name: string;
  eyebrow: string;
  lead: string;
  description: string;
  image: string;
  imageAlt: string;
  accent: "cyan" | "lime" | "coral" | "blue";
  points?: string[];
  diagramTitle?: string;
  diagramSteps?: string[];
  externalHref?: string;
}

const accentStyles = {
  cyan: { text: "text-cyan-300", border: "border-cyan-300/40", surface: "bg-cyan-300/10" },
  lime: { text: "text-lime-300", border: "border-lime-300/40", surface: "bg-lime-300/10" },
  coral: { text: "text-orange-300", border: "border-orange-300/40", surface: "bg-orange-300/10" },
  blue: { text: "text-blue-300", border: "border-blue-300/40", surface: "bg-blue-300/10" },
};

export function ProductDetail({
  seoKey,
  name,
  eyebrow,
  lead,
  description,
  image,
  imageAlt,
  accent,
  points,
  diagramTitle,
  diagramSteps,
  externalHref,
}: ProductDetailProps) {
  const accentClass = accentStyles[accent];

  return (
    <main className="bg-[#07111b] text-white" role="main">
      <SEO pageKey={seoKey} />
      <section className="relative flex min-h-[570px] items-end overflow-hidden pt-28">
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-55" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111b] via-[#07111b]/65 to-[#07111b]/30" />
        <Container className="relative z-10 w-full pb-16 md:pb-24">
          <Link to="/products" className="mb-10 inline-flex text-sm font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline">
            Products / {name}
          </Link>
          <p className="mb-3 text-sm font-bold uppercase text-white/75">{eyebrow}</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-white md:text-7xl">{name}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-snug text-white md:text-3xl">{lead}</p>
        </Container>
      </section>

      <Section className="border-b border-white/10 bg-[#07111b]">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className={`inline-flex border-b pb-2 text-sm font-bold uppercase ${accentClass.text} ${accentClass.border}`}>Product overview</p>
            <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">{name}</h2>
          </div>
          <div>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">{description}</p>
            {points && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {points.map((point) => (
                  <li key={point} className={`border-l-2 px-4 py-2 text-base text-slate-100 ${accentClass.border}`}>
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              {externalHref && (
                <a href={externalHref} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 items-center border px-5 py-3 font-bold transition hover:bg-white/10 ${accentClass.text} ${accentClass.border} ${accentClass.surface}`}>
                  Visit Seismic AI site
                </a>
              )}
              <SectionLink href="/#connect" className="inline-flex min-h-12 items-center border border-white/30 px-5 py-3 font-bold text-white transition hover:border-white">
                Contact Turbo AI
              </SectionLink>
            </div>
          </div>
        </Container>
      </Section>

      {diagramSteps && diagramTitle && (
        <Section className="bg-[#0b1924]">
          <Container>
            <p className="text-sm font-bold uppercase text-slate-300">Conceptual view</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{diagramTitle}</h2>
            <ol className="mt-9 grid gap-3 md:grid-cols-5">
              {diagramSteps.map((step, index) => (
                <li key={step} className={`min-h-24 border p-5 ${accentClass.text} ${accentClass.border} ${accentClass.surface}`}>
                  <span className="block text-xs font-bold text-white/55">0{index + 1}</span>
                  <span className="mt-3 block text-lg font-semibold text-white">{step}</span>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      <Section className="border-t border-white/10 bg-[#07111b]">
        <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Explore Turbo AI products</h2>
          <Link to="/products" className="inline-flex min-h-12 items-center border border-white/30 px-5 py-3 font-bold text-white transition hover:border-white">
            All products
          </Link>
        </Container>
      </Section>
    </main>
  );
}
