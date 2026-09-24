import { useLayoutEffect } from "react";
import { EnterprisePage } from "../components/EnterprisePage";
import { enterprisePages } from "../content/enterprisePages";
import nvidiaLogo from "../assets/technology/nvidia.svg";

const technologyLogoSpecs = [
  { name: "Apache Iceberg", wordmark: "Apache Iceberg", wordmarkClassName: "text-sky-200" },
  { name: "Databricks", wordmark: "Databricks", wordmarkClassName: "text-orange-300" },
  { name: "Snowflake", wordmark: "Snowflake", wordmarkClassName: "text-cyan-200" },
  { name: "Apache Spark", wordmark: "Apache Spark", wordmarkClassName: "text-orange-200" },
  { name: "NVIDIA", image: nvidiaLogo },
];

function createTechnologyLogo(spec: (typeof technologyLogoSpecs)[number]) {
  const wrapper = document.createElement("span");
  wrapper.className = "flex h-10 items-center justify-center gap-2";
  wrapper.dataset.technologyLogo = spec.name;

  if (spec.image) {
    const image = document.createElement("img");
    image.src = spec.image;
    image.alt = `${spec.name} logo`;
    image.className = "h-8 w-8 object-contain";
    wrapper.appendChild(image);
    const label = document.createElement("span");
    label.className = "text-sm font-semibold text-slate-100";
    label.textContent = spec.name;
    wrapper.appendChild(label);
    return wrapper;
  }

  const wordmark = document.createElement("span");
  wordmark.className = `whitespace-nowrap text-lg font-semibold tracking-tight ${spec.wordmarkClassName}`;
  wordmark.textContent = spec.wordmark || spec.name;
  wrapper.appendChild(wordmark);
  return wrapper;
}

export function DataEngineeringAIFoundations() {
  useLayoutEffect(() => {
    const ecosystemLabel = [...document.querySelectorAll("main p")].find(
      (element) => element.textContent?.trim() === "Technology Ecosystem",
    );
    const section = ecosystemLabel?.closest("section");
    const cards = section?.querySelectorAll("div.flex.min-h-20");
    const logoGrid = cards?.[0]?.parentElement;
    const originalCardTextNodes = new Map<Element, Text[]>();

    if (!cards) return;

    logoGrid?.classList.add("lg:grid-cols-5");
    technologyLogoSpecs.forEach((spec, index) => {
      const card = cards[index];
      if (!card || card.querySelector("[data-technology-logo]")) return;
      const textNodes = [...card.childNodes].filter(
        (node): node is Text => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
      );
      originalCardTextNodes.set(card, textNodes);
      textNodes.forEach((node) => node.remove());
      card.classList.add("flex-col", "gap-2");
      card.insertBefore(createTechnologyLogo(spec), card.firstChild);
    });

    return () => {
      logoGrid?.classList.remove("lg:grid-cols-5");
      originalCardTextNodes.forEach((textNodes, card) => {
        card.classList.remove("flex-col", "gap-2");
        textNodes.forEach((node) => card.appendChild(node));
      });
      section?.querySelectorAll("[data-technology-logo]").forEach((logo) => logo.remove());
    };
  }, []);

  return <EnterprisePage content={enterprisePages.dataFoundations} />;
}
