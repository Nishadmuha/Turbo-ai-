import { useLayoutEffect } from "react";
import { EnterprisePage } from "../components/EnterprisePage";
import { enterprisePages } from "../content/enterprisePages";

const technologyLogoSpecs = [
  { name: "NIST", wordmark: "NIST", wordmarkClassName: "border-cyan-300/40 bg-cyan-300/10 text-cyan-100" },
  { name: "ISO 27001", wordmark: "ISO 27001", wordmarkClassName: "border-blue-300/40 bg-blue-300/10 text-blue-100" },
  { name: "ISO 42001", wordmark: "ISO 42001", wordmarkClassName: "border-violet-300/40 bg-violet-300/10 text-violet-100" },
  { name: "SOC 2", wordmark: "SOC 2", wordmarkClassName: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100" },
];

function createTechnologyLogo(spec: (typeof technologyLogoSpecs)[number]) {
  const wrapper = document.createElement("span");
  wrapper.className = "flex h-10 items-center justify-center gap-2";
  wrapper.dataset.technologyLogo = spec.name;

  const badge = document.createElement("span");
  badge.className = `rounded-full border px-3 py-2 text-xs font-bold tracking-[0.12em] ${spec.wordmarkClassName}`;
  badge.textContent = spec.wordmark;
  wrapper.appendChild(badge);
  return wrapper;
}

export function AIGovernanceCybersecurity() {
  useLayoutEffect(() => {
    const ecosystemLabel = [...document.querySelectorAll("main p")].find(
      (element) => element.textContent?.trim() === "Technology Ecosystem",
    );
    const section = ecosystemLabel?.closest("section");
    const cards = section?.querySelectorAll("div.flex.min-h-20");
    const logoGrid = cards?.[0]?.parentElement;
    const originalCardTextNodes = new Map<Element, Text[]>();

    if (!cards) return;

    logoGrid?.classList.add("lg:grid-cols-4");
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
      logoGrid?.classList.remove("lg:grid-cols-4");
      originalCardTextNodes.forEach((textNodes, card) => {
        card.classList.remove("flex-col", "gap-2");
        textNodes.forEach((node) => card.appendChild(node));
      });
      section?.querySelectorAll("[data-technology-logo]").forEach((logo) => logo.remove());
    };
  }, []);

  return <EnterprisePage content={enterprisePages.governanceCybersecurity} />;
}
