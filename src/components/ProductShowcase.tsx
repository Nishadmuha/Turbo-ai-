import {
  CircleStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CloudIcon,
  SignalIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Container, Section } from "./Container";
import { SectionLink } from "./SectionLink";

const products = [
  { name: "INTERSTELLAR ONE", descriptor: "Data intelligence & AI", href: "/products/interstellar-one", Icon: CircleStackIcon, color: "text-sky-300" },
  { name: "SPECTRA PLUS", descriptor: "Cybersecurity & risk", href: "/products/spectra-plus", Icon: ShieldCheckIcon, color: "text-emerald-300" },
  { name: "QUANTUM APEX", descriptor: "Agentic AI & automation", href: "/products/quantum-apex", Icon: SparklesIcon, color: "text-violet-300" },
  { name: "ORBIT CORE", descriptor: "Cloud & cost optimization", href: "/products/orbit-core", Icon: CloudIcon, color: "text-cyan-300" },
  { name: "ADRS", descriptor: "Detection & response", href: "/products/adrs", Icon: BoltIcon, color: "text-blue-300" },
  { name: "SEISMIC AI", descriptor: "Visit SEISMIC AI", href: "https://seismicai.ca", Icon: SignalIcon, color: "text-amber-300" },
];

export function ProductShowcase() {
  return (
    <Section id="our-products" className="border-b border-white/5 bg-charcoalDeep/40" aria-labelledby="our-products-heading">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="our-products-heading" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Our Products
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Explore the Turbo AI product family, from enterprise intelligence to automation and infrastructure.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {products.map(({ name, descriptor, href, Icon, color }) => (
            <SectionLink key={href} href={href} aria-label={href.startsWith("https:") ? `${name} (opens in a new tab)` : `Explore ${name}`} className="product-ecosystem-card group flex min-h-44 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-3 py-5 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 motion-reduce:transform-none motion-reduce:transition-none">
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-current/20 bg-white/[0.025] transition duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none ${color}`}>
                <Icon aria-hidden="true" className="h-7 w-7" />
              </span>
              <span className="product-ecosystem-name flex min-h-10 items-center justify-center text-sm font-semibold leading-tight text-white sm:text-base">{name}</span>
              <span className="mt-2 flex min-h-10 items-center justify-center text-sm leading-snug text-white/55">{descriptor}</span>
            </SectionLink>
          ))}
        </div>
      </Container>
    </Section>
  );
}
