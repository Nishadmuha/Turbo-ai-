import { Container, Section } from "../components/Container";
import { SectionLink } from "../components/SectionLink";
import { SEO } from "../components/SEO";
import seismicImage from "../assets/energy-hero-platform.jpg";
import dciImage from "../assets/locations-calgary.jpg";
import lakehouseImage from "../assets/ai-data-insights-hero.png";
import adrsImage from "../assets/cyber-security-hero.png";

const products = [
  {
    name: "Seismic AI",
    description: "Explore the existing Seismic AI product experience.",
    href: "https://seismicai.ca",
    image: seismicImage,
    alt: "Industrial energy infrastructure",
  },
  {
    name: "DCI 360",
    description: "Request current DCI 360 product information from Turbo AI.",
    href: "/products/dci-360",
    image: dciImage,
    alt: "Calgary skyline by the Bow River",
  },
  {
    name: "i-Lakehouse",
    description: "A modern data and AI foundation capability.",
    href: "/products/i-lakehouse",
    image: lakehouseImage,
    alt: "Data architecture visualization",
  },
  {
    name: "ADRS",
    description: "The Autonomous Detection & Response System.",
    href: "/products/adrs",
    image: adrsImage,
    alt: "Security operations environment",
  },
];

export function ProductsIndex() {
  return (
    <main className="bg-[#07111b] text-white" role="main">
      <SEO pageKey="turboAIProducts" />
      <section className="border-b border-white/10 bg-[#0b1924] pb-16 pt-36 md:pb-20">
        <Container>
          <p className="text-sm font-bold uppercase text-cyan-300">Turbo AI technology</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">Products</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">
            Explore Turbo AI's product areas. Seismic AI opens its existing website, while the other products have dedicated pages here.
          </p>
        </Container>
      </section>

      <Section className="bg-[#07111b]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <SectionLink
                key={product.href}
                href={product.href}
                className="group relative flex min-h-72 flex-col justify-end overflow-hidden border border-white/10 transition hover:border-cyan-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                <img src={product.image} alt={product.alt} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111b] via-[#07111b]/60 to-transparent" />
                <div className="relative p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">{product.name}</h2>
                  <p className="mt-2 max-w-md text-slate-100">{product.description}</p>
                  <span className="mt-5 inline-block border-b border-cyan-300 pb-1 text-sm font-bold text-cyan-200">Explore product</span>
                </div>
              </SectionLink>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
