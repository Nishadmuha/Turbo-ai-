import { Container, Section } from "./Container";
import { useReveal } from "../hooks/useReveal";
import openaiLogo from "../assets/technology/openai-symbol.svg";
import microsoftAzureLogo from "../assets/technology/microsoft-azure.svg";
import googleCloudLogo from "../assets/technology/google-cloud.svg";
import nvidiaLogo from "../assets/technology/nvidia.svg";
import kubernetesLogo from "../assets/technology/kubernetes.svg";
import pythonLogo from "../assets/technology/python.svg";

interface Technology {
  name: string;
  descriptor: string;
  logo: string;
  logoClassName?: string;
}

const technologies: Technology[] = [
  {
    name: "OpenAI",
    descriptor: "AI models",
    logo: openaiLogo,
    logoClassName: "brightness-0 invert",
  },
  {
    name: "Microsoft Azure",
    descriptor: "Cloud platform",
    logo: microsoftAzureLogo,
  },
  {
    name: "Google Cloud",
    descriptor: "Cloud platform",
    logo: googleCloudLogo,
  },
  {
    name: "NVIDIA",
    descriptor: "AI compute",
    logo: nvidiaLogo,
  },
  {
    name: "Kubernetes",
    descriptor: "Infrastructure",
    logo: kubernetesLogo,
  },
  {
    name: "Python",
    descriptor: "Data & engineering",
    logo: pythonLogo,
  },
];

export function TechnologyEcosystem() {
  const { addElement } = useReveal(60);

  return (
    <Section
      id="technology-ecosystem"
      className="border-y border-white/5 bg-charcoalDeep/40"
      aria-labelledby="technology-ecosystem-heading"
    >
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="technology-ecosystem-heading"
            ref={addElement}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Technology Ecosystem
          </h2>
          <p
            ref={addElement}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Built across a modern ecosystem of AI, cloud, data and infrastructure technologies.
          </p>
        </div>

        <div
          ref={addElement}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
        >
          {technologies.map(({ name, descriptor, logo, logoClassName }) => (
            <div
              key={name}
              className="group flex min-h-36 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-3 py-5 text-center transition duration-300 hover:-translate-y-1 hover:border-emeraldTint/60 hover:bg-white/[0.06]"
            >
              <span className="flex h-12 w-full items-center justify-center transition duration-300 group-hover:scale-105">
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className={`max-h-11 w-auto max-w-[8rem] object-contain ${logoClassName ?? ""}`}
                  loading="lazy"
                />
              </span>
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">
                {name}
              </span>
              <span className="mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-white/45">
                {descriptor}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
