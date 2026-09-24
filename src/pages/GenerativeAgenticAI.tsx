import { useLayoutEffect } from "react";
import { EnterprisePage } from "../components/EnterprisePage";
import { enterprisePages } from "../content/enterprisePages";
import openaiLogo from "../assets/technology/openai-symbol.svg";
import nvidiaLogo from "../assets/technology/nvidia.svg";

const technologyLogoSpecs = [
  { name: "OpenAI", image: openaiLogo, imageClassName: "brightness-0 invert" },
  { name: "Anthropic", wordmark: "Anthropic", wordmarkClassName: "text-amber-200" },
  { name: "Microsoft", microsoft: true },
  { name: "Google", google: true },
  { name: "NVIDIA", image: nvidiaLogo },
];

function createTechnologyLogo(spec: (typeof technologyLogoSpecs)[number]) {
  const wrapper = document.createElement("span");
  wrapper.className = "mb-3 flex h-10 items-center justify-center";
  wrapper.dataset.technologyLogo = spec.name;
  wrapper.setAttribute("aria-hidden", "true");

  if (spec.image) {
    const image = document.createElement("img");
    image.src = spec.image;
    image.alt = "";
    image.className = `h-9 w-auto max-w-[7rem] object-contain ${spec.imageClassName || ""}`;
    wrapper.appendChild(image);
    return wrapper;
  }

  if (spec.microsoft) {
    const mark = document.createElement("span");
    mark.className = "grid grid-cols-2 gap-0.5";
    for (const color of ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-400"]) {
      const square = document.createElement("span");
      square.className = `h-3 w-3 ${color}`;
      mark.appendChild(square);
    }
    wrapper.appendChild(mark);
    return wrapper;
  }

  const wordmark = document.createElement("span");
  wordmark.className = `text-xl font-semibold tracking-tight ${spec.wordmarkClassName || "text-white"}`;
  wordmark.textContent = spec.wordmark || spec.name;

  if (spec.google) {
    wordmark.className = "bg-gradient-to-r from-blue-400 via-red-400 to-green-400 bg-clip-text text-xl font-semibold tracking-tight text-transparent";
  }

  wrapper.appendChild(wordmark);
  return wrapper;
}

export function GenerativeAgenticAI() {
  useLayoutEffect(() => {
    const ecosystemLabel = [...document.querySelectorAll("main p")].find(
      (element) => element.textContent?.trim() === "Technology Ecosystem",
    );
    const section = ecosystemLabel?.closest("section");
    const cards = section?.querySelectorAll("div.flex.min-h-20");

    if (!cards) return;

    technologyLogoSpecs.forEach((spec, index) => {
      const card = cards[index];
      if (!card || card.querySelector("[data-technology-logo]")) return;
      card.insertBefore(createTechnologyLogo(spec), card.firstChild);
    });

    return () => {
      section?.querySelectorAll("[data-technology-logo]").forEach((logo) => logo.remove());
    };
  }, []);

  return <EnterprisePage content={enterprisePages.generativeAgenticAI} />;
}
