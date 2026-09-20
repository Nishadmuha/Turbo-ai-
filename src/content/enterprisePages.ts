import aiStrategyImage from "../assets/ai-trans-hero.png";
import agenticImage from "../assets/ai-trans-networkinglines.jpg";
import dataImage from "../assets/ai-data-insights-hero.png";
import engineeringImage from "../assets/digital-architecture-hero.png";
import governanceImage from "../assets/cyber-security-hero.png";
import cloudImage from "../assets/cloud-solutions-hero.png";
import industriesImage from "../assets/Hero Background.jpg";
import solutionsImage from "../assets/Insight Visualization.jpg";
import productsImage from "../assets/energy-hero-platform.jpg";
import aboutImage from "../assets/Canadian Context Map.jpg";
import energyImage from "../assets/smarter-operations-pipes.jpg";
import financeImage from "../assets/blog-grid-analytics.jpg";
import maintenanceImage from "../assets/blog-predictive-maintenance.jpg";
import hydrogenImage from "../assets/blog-hydrogen-facility.jpg";
import remoteImage from "../assets/remote-infrastructure-hero.png";
import qualityImage from "../assets/quality-engineering-hero.png";
import cloudHeroImage from "../assets/cloud-solutions-hero.png";

export interface Diagram {
  title: string;
  subtitle?: string;
  steps: string[];
}

export interface ContentBlock {
  eyebrow?: string;
  title: string;
  body: string;
  items?: string[];
}

export interface EnterprisePageContent {
  seoKey: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  diagrams?: Diagram[];
  blocks: ContentBlock[];
  technologies?: string[];
  ctaTitle: string;
  ctaBody: string;
}

export interface IndustryCard {
  name: string;
  description: string;
  image: string;
  alt: string;
  applications: string[];
  href: string;
}

export interface ProductCard {
  name: string;
  purpose: string;
  problem: string;
  capabilities: string[];
  diagram: Diagram;
  ctaHref: string;
}

export const enterprisePages: Record<string, EnterprisePageContent> = {
  generativeAgenticAI: {
    seoKey: "generativeAgenticAI",
    eyebrow: "Enterprise AI Systems",
    title: "Generative & Agentic AI",
    subtitle: "From AI That Answers to AI That Acts",
    intro:
      "Turbo AI helps organizations move from isolated generative AI experiments to secure, integrated systems that support knowledge work, automate workflows, and stay accountable to human oversight.",
    heroImage: agenticImage,
    heroAlt: "Professional team reviewing enterprise technology architecture screens",
    diagrams: [
      {
        title: "Traditional Software",
        subtitle: "Deterministic logic",
        steps: ["Input", "Rules", "Output"],
      },
      {
        title: "Generative AI",
        subtitle: "Knowledge and content assistance",
        steps: ["Question", "Model", "Response"],
      },
      {
        title: "Agentic AI",
        subtitle: "Goal-directed enterprise workflow",
        steps: ["Objective", "Reasoning", "Information", "Tools", "Action", "Verification"],
      },
    ],
    blocks: [
      {
        eyebrow: "Generative AI",
        title: "Enterprise Generative AI",
        body:
          "We design generative AI capabilities around real operating context: trusted content, secure access, measurable usefulness, and workflows employees can rely on.",
        items: [
          "Enterprise AI Assistants",
          "AI Copilots",
          "Knowledge Assistants",
          "Enterprise Search",
          "RAG",
          "Document Intelligence",
          "Natural Language Interfaces",
          "Research Assistants",
          "Internal Knowledge Systems",
        ],
      },
      {
        eyebrow: "Agentic AI",
        title: "AI Agents With Control, Context, and Evaluation",
        body:
          "Agentic systems need more than prompts. They require defined tools, permission boundaries, observability, evaluation, and human-in-the-loop controls before they can be trusted inside enterprise workflows.",
        items: [
          "AI Agents",
          "Multi-Agent Systems",
          "Agent Orchestration",
          "Tool Integration",
          "Workflow Automation",
          "Human-in-the-Loop",
          "Agent Evaluation",
          "Agent Observability",
          "MCP Integrations",
        ],
      },
    ],
    technologies: ["OpenAI", "Anthropic", "Microsoft", "Google", "NVIDIA"],
    ctaTitle: "Design AI that can be trusted in the workflow.",
    ctaBody: "Start with a bounded use case, a clear control model, and a path to production.",
  },
  dataFoundations: {
    seoKey: "dataFoundations",
    eyebrow: "Data and AI Foundations",
    title: "Data Engineering & AI Foundations",
    subtitle: "Building the Data Foundation for Intelligence",
    intro:
      "Enterprise AI depends on reliable data movement, governed data products, and operational pipelines that can support analytics, automation, and machine learning in production.",
    heroImage: dataImage,
    heroAlt: "Enterprise data and analytics platform visualization",
    diagrams: [
      {
        title: "Enterprise Data Architecture",
        steps: [
          "Enterprise Sources",
          "Data Integration",
          "Lakehouse",
          "Governance",
          "Analytics / AI",
          "Enterprise Applications",
        ],
      },
      {
        title: "ADRS Workflow",
        subtitle: "Conservative detection and response model",
        steps: ["Detection", "Analysis", "Risk Identification", "Alert", "Response"],
      },
    ],
    blocks: [
      {
        title: "Data Engineering for AI-Ready Operations",
        body:
          "We build the pipelines, lakehouse patterns, metadata practices, and quality controls that give AI systems dependable data to work from.",
        items: [
          "Data Engineering",
          "Data Integration",
          "Data Migration",
          "Data Lakehouse",
          "Data Governance",
          "Metadata",
          "Data Quality",
          "Data Lineage",
          "Batch Processing",
          "Streaming",
          "Real-Time Analytics",
          "AI/ML Pipelines",
          "MLOps",
        ],
      },
      {
        eyebrow: "Proprietary Capability",
        title: "i-Lakehouse",
        body:
          "i-Lakehouse is presented as Turbo AI's modern data and AI foundation capability, helping organizations organize governed enterprise data for analytics, AI, and application use cases.",
      },
      {
        eyebrow: "Detection and Response",
        title: "Autonomous Detection & Response System",
        body:
          "ADRS is communicated through a careful workflow model: detection, analysis, risk identification, alerting, and response. The page avoids claiming fully autonomous operation beyond the evidence available in the supplied requirements.",
      },
    ],
    technologies: ["Apache Iceberg", "Databricks", "Snowflake", "Apache Spark", "NVIDIA"],
    ctaTitle: "Make enterprise data usable by intelligent systems.",
    ctaBody: "We can help assess the data foundation required for your AI roadmap.",
  },
  aiEngineering: {
    seoKey: "aiEngineering",
    eyebrow: "Engineering and Delivery",
    title: "AI Engineering & Software Development",
    subtitle: "Engineering Intelligence Into Enterprise Applications",
    intro:
      "Turbo AI combines product thinking, software engineering, and applied AI delivery to build applications that move from prototype to production with discipline.",
    heroImage: engineeringImage,
    heroAlt: "Software engineering architecture displayed across technical workstations",
    diagrams: [
      {
        title: "AI Engineering Lifecycle",
        steps: [
          "Business Requirement",
          "Architecture",
          "Prototype",
          "Validation",
          "Engineering",
          "Production",
          "Continuous Improvement",
        ],
      },
    ],
    blocks: [
      {
        title: "Production AI Software",
        body:
          "We engineer AI into applications, platforms, and workflows with attention to usability, integrations, reliability, security, and maintainability.",
        items: [
          "Enterprise AI applications",
          "SaaS platforms",
          "AI copilots",
          "RAG applications",
          "Intelligent automation",
          "Application modernisation",
        ],
      },
      {
        title: "Built With Engineering Discipline",
        body:
          "AI delivery succeeds when the software around the model is strong: architecture, testing, deployment, monitoring, and continuous improvement are treated as part of the product.",
      },
    ],
    technologies: ["Python", "GitHub", "Docker", "Kubernetes", "Terraform"],
    ctaTitle: "Turn AI prototypes into usable enterprise software.",
    ctaBody: "Bring us a workflow, application idea, or stalled pilot and we will help shape the delivery path.",
  },
  governanceCybersecurity: {
    seoKey: "governanceCybersecurity",
    eyebrow: "Trust, Risk, and Security",
    title: "AI Governance & Cybersecurity",
    subtitle: "Innovation Requires Trust",
    intro:
      "Turbo AI helps organizations establish the policies, controls, security practices, and oversight needed to adopt AI responsibly in complex enterprise environments.",
    heroImage: governanceImage,
    heroAlt: "Security operations center with analysts monitoring enterprise systems",
    blocks: [
      {
        eyebrow: "AI Governance",
        title: "Responsible AI Operating Models",
        body:
          "Governance turns AI from an experiment into an accountable enterprise capability. We help define the controls needed across data, models, applications, and users.",
        items: [
          "AI governance frameworks",
          "AI policies",
          "AI risk assessment",
          "Model governance",
          "AI lifecycle controls",
          "Human oversight",
          "Responsible AI",
          "AI observability",
          "Data governance",
          "Auditability",
        ],
      },
      {
        eyebrow: "Security",
        title: "Cybersecurity for AI-Enabled Enterprises",
        body:
          "AI introduces new threat surfaces across prompts, data access, APIs, applications, identities, and model behavior. We assess and strengthen these systems before they scale.",
        items: [
          "AI/LLM security assessment",
          "Application security",
          "API security",
          "Prompt-injection assessment",
          "Data leakage assessment",
          "Identity and access management",
          "Threat modelling",
          "Vulnerability assessment",
          "Penetration testing",
        ],
      },
    ],
    technologies: ["NIST", "ISO 27001", "ISO 42001", "SOC 2"],
    ctaTitle: "Build confidence before AI scales.",
    ctaBody: "We can help review governance, security, and operational risk for your AI initiatives.",
  },
  cloudCompute: {
    seoKey: "cloudCompute",
    eyebrow: "Cloud and Compute",
    title: "Cloud, Infrastructure & AI Compute",
    subtitle: "Infrastructure for the Intelligent Enterprise",
    intro:
      "AI workloads need cloud architecture, data platforms, compute planning, observability, and automation that can support both experimentation and production demand.",
    heroImage: cloudImage,
    heroAlt: "Enterprise data centre and cloud infrastructure environment",
    diagrams: [
      {
        title: "AI Infrastructure Architecture",
        steps: ["Data", "Compute", "Models", "AI Services", "Enterprise Applications"],
      },
    ],
    blocks: [
      {
        title: "Infrastructure for AI-Driven Operations",
        body:
          "We design cloud and platform foundations for enterprise AI: resilient, observable, automated, and aligned to the workloads they need to run.",
        items: [
          "Cloud architecture",
          "Hybrid cloud",
          "Multi-cloud",
          "Cloud migration",
          "Cloud optimisation",
          "Infrastructure automation",
          "Kubernetes",
          "Infrastructure as Code",
          "Platform engineering",
          "Observability",
          "Performance optimisation",
          "AI compute architecture",
        ],
      },
    ],
    technologies: ["AWS", "Microsoft Azure", "Google Cloud", "NVIDIA", "Kubernetes"],
    ctaTitle: "Prepare your infrastructure for enterprise AI.",
    ctaBody: "We can help map workloads, risks, and platform requirements before major investment.",
  },
  enterpriseSolutions: {
    seoKey: "enterpriseSolutions",
    eyebrow: "Enterprise AI Solutions",
    title: "Enterprise AI Solutions",
    subtitle: "Turning Business Problems Into Intelligent Systems",
    intro:
      "Turbo AI frames AI around business problems first, then designs the data, models, integrations, and governance needed to turn them into reliable enterprise systems.",
    heroImage: solutionsImage,
    heroAlt: "Enterprise insight visualization used for business decision support",
    blocks: [
      {
        title: "Customer Intelligence",
        body: "Business problem: fragmented customer signals. AI approach: unify behavioral, transactional, and service data. Enterprise application: next-best-action, segmentation, and service prioritization. Expected value: clearer decisions and more relevant customer experiences.",
      },
      {
        title: "Intelligent Document Processing",
        body: "Business problem: high-volume manual document handling. AI approach: extraction, classification, validation, and human review. Enterprise application: claims, contracts, invoices, onboarding, and compliance workflows. Expected value: faster throughput and fewer manual bottlenecks.",
      },
      {
        title: "Knowledge Intelligence",
        body: "Business problem: expertise trapped across documents and teams. AI approach: governed retrieval, semantic search, and knowledge assistants. Enterprise application: internal support, research, policy lookup, and decision preparation. Expected value: faster access to trusted information.",
      },
      {
        title: "Predictive Maintenance",
        body: "Business problem: unplanned downtime and limited asset visibility. AI approach: telemetry analysis, anomaly detection, and maintenance prioritization. Enterprise application: industrial asset monitoring and work-order intelligence. Expected value: better planning and reduced operational disruption.",
      },
      {
        title: "Decision Intelligence",
        body: "Business problem: slow decisions across complex operating data. AI approach: signal aggregation, scenario analysis, and decision support. Enterprise application: executive dashboards, operational command centers, and planning workflows. Expected value: decisions with more context and traceability.",
      },
      {
        title: "Intelligent Automation",
        body: "Business problem: repetitive processes that strain teams. AI approach: workflow automation with validation and exception handling. Enterprise application: service operations, finance workflows, and back-office processes. Expected value: more consistent execution and better use of skilled staff time.",
      },
      {
        title: "Fraud & Anomaly Detection",
        body: "Business problem: risks hidden in high-volume transaction patterns. AI approach: anomaly detection, behavioral modeling, and alert triage. Enterprise application: payment monitoring, claims review, and security operations. Expected value: earlier detection and more focused investigation.",
      },
      {
        title: "Supply-Chain Intelligence",
        body: "Business problem: limited visibility across demand, inventory, and logistics. AI approach: forecasting, event detection, and decision support. Enterprise application: logistics planning, inventory risk review, and supplier monitoring. Expected value: better resilience and coordination.",
      },
    ],
    ctaTitle: "Start with the problem worth solving.",
    ctaBody: "We can help translate a business workflow into an AI solution architecture.",
  },
};

export const industriesWeServe: IndustryCard[] = [
  {
    name: "Energy & Oil and Gas",
    description:
      "Energy operators work across capital-intensive assets, remote environments, and safety-critical workflows. Turbo AI applies data engineering and AI to improve asset intelligence, operational visibility, and decision support.",
    image: energyImage,
    alt: "Industrial energy pipeline infrastructure",
    applications: ["Asset intelligence", "Predictive maintenance", "Operational analytics"],
    href: "/industries/energy",
  },
  {
    name: "Financial Services",
    description:
      "Financial institutions need secure, explainable intelligence across risk, operations, customers, and compliance. AI can support better prioritization, document workflows, fraud detection, and decision intelligence.",
    image: financeImage,
    alt: "Financial operations analytics screen",
    applications: ["Fraud detection", "Document intelligence", "Customer analytics"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Insurance",
    description:
      "Insurance teams manage high document volume, risk assessment, claims complexity, and regulatory expectations. AI can help accelerate review while keeping human oversight in the loop.",
    image: solutionsImage,
    alt: "Insurance and enterprise analytics visualization",
    applications: ["Claims triage", "Policy intelligence", "Anomaly detection"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Healthcare",
    description:
      "Healthcare organizations require careful, privacy-aware technology that supports clinicians, administrators, and patients. AI can improve knowledge access, operations, and document-heavy workflows when governed properly.",
    image: qualityImage,
    alt: "Healthcare technology and quality engineering environment",
    applications: ["Knowledge assistants", "Operations analytics", "Document processing"],
    href: "/ai-governance-cybersecurity",
  },
  {
    name: "Manufacturing",
    description:
      "Manufacturers depend on equipment uptime, quality, supply continuity, and production visibility. AI can connect operational data to practical decision support across plants and teams.",
    image: maintenanceImage,
    alt: "Industrial equipment used for maintenance operations",
    applications: ["Predictive maintenance", "Quality intelligence", "Production analytics"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Construction",
    description:
      "Construction programs involve moving schedules, site conditions, documents, suppliers, and equipment. AI can support planning visibility, risk identification, and project knowledge management.",
    image: remoteImage,
    alt: "Remote infrastructure and field operations technology",
    applications: ["Project intelligence", "Safety analytics", "Equipment monitoring"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Automotive & Mobility",
    description:
      "Mobility businesses manage connected operations across manufacturing, service, logistics, and customer experience. AI can support quality, forecasting, service intelligence, and operational automation.",
    image: engineeringImage,
    alt: "Engineering architecture for mobility systems",
    applications: ["Quality analytics", "Service copilots", "Supply forecasting"],
    href: "/ai-engineering-software-development",
  },
  {
    name: "Retail",
    description:
      "Retail teams work across demand, inventory, pricing, service, and digital commerce. AI can strengthen customer intelligence and automate knowledge-heavy operational workflows.",
    image: hydrogenImage,
    alt: "Modern commercial and operations environment",
    applications: ["Customer intelligence", "Demand signals", "Service automation"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Supply Chain & Logistics",
    description:
      "Supply-chain networks require better visibility across inventory, transportation, facilities, and disruption signals. AI can improve forecasting, exception handling, and decision support.",
    image: cloudHeroImage,
    alt: "Enterprise infrastructure supporting supply-chain systems",
    applications: ["Logistics intelligence", "Inventory risk", "Route and demand analysis"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Telecommunications",
    description:
      "Telecommunications providers operate distributed networks, service workflows, customer data, and infrastructure programs. AI can support network operations, customer service, and field intelligence.",
    image: agenticImage,
    alt: "Network technology visualization for enterprise operations",
    applications: ["Network operations", "Customer assistants", "Incident triage"],
    href: "/cloud-infrastructure-ai-compute",
  },
  {
    name: "Utilities",
    description:
      "Utilities balance asset reliability, regulatory duties, demand shifts, and field operations. AI can support grid analytics, outage intelligence, and maintenance planning.",
    image: financeImage,
    alt: "Grid analytics and operational data screen",
    applications: ["Grid intelligence", "Asset analytics", "Outage support"],
    href: "/enterprise-ai-solutions",
  },
  {
    name: "Government",
    description:
      "Public-sector organizations need secure, accessible, and accountable technology. AI can improve citizen service, knowledge access, records workflows, and program operations when deployed with governance.",
    image: aboutImage,
    alt: "Canadian context map for public-sector technology work",
    applications: ["Knowledge systems", "Document intelligence", "Service operations"],
    href: "/ai-governance-cybersecurity",
  },
  {
    name: "Defence & Intelligence",
    description:
      "Defence and intelligence environments require careful controls, secure architectures, and human oversight. AI can help structure information, detect signals, and support analysis workflows.",
    image: governanceImage,
    alt: "Secure operations center for mission-critical environments",
    applications: ["Signal triage", "Knowledge intelligence", "Secure workflow automation"],
    href: "/ai-governance-cybersecurity",
  },
  {
    name: "Semiconductors",
    description:
      "Semiconductor operations involve complex engineering, supply chains, quality demands, and specialized data. AI can support process insight, engineering knowledge, and operational decision support.",
    image: aiStrategyImage,
    alt: "Advanced technology architecture for semiconductor operations",
    applications: ["Engineering intelligence", "Quality analytics", "Supply risk"],
    href: "/data-engineering-ai-foundations",
  },
  {
    name: "Technology & SaaS",
    description:
      "Technology companies need to ship reliable products while integrating AI into user workflows. Turbo AI supports product architecture, AI engineering, observability, and secure delivery.",
    image: engineeringImage,
    alt: "Software engineering and SaaS product architecture",
    applications: ["AI copilots", "SaaS engineering", "Product analytics"],
    href: "/ai-engineering-software-development",
  },
  {
    name: "Data Centres",
    description:
      "Data centres sit at the foundation of modern AI and cloud operations. AI can support infrastructure monitoring, energy optimization, capacity planning, and incident response.",
    image: cloudImage,
    alt: "Data centre infrastructure for AI compute",
    applications: ["Infrastructure monitoring", "Capacity planning", "Energy analytics"],
    href: "/cloud-infrastructure-ai-compute",
  },
];

export const productCards: ProductCard[] = [
  {
    name: "Seismic AI",
    purpose:
      "A Turbo AI product presence focused on applying intelligence to seismic and energy-domain data workflows.",
    problem:
      "Energy teams need better ways to interpret complex technical signals and support decisions across exploration and operations.",
    capabilities: [
      "Energy-domain AI positioning",
      "Signal and data interpretation workflows",
      "Decision-support context for technical teams",
    ],
    diagram: {
      title: "Seismic AI Conceptual Architecture",
      steps: ["Domain Data", "Signal Processing", "AI Analysis", "Expert Review", "Decision Support"],
    },
    ctaHref: "https://seismicai.ca",
  },
  {
    name: "DCI 360",
    purpose:
      "A proprietary Turbo AI capability presented for 360-degree enterprise intelligence and decision context.",
    problem:
      "Leaders often lack one governed view across operational signals, risks, controls, and decision workflows.",
    capabilities: [
      "Enterprise visibility model",
      "Decision context organization",
      "Workflow and control alignment",
    ],
    diagram: {
      title: "DCI 360 Conceptual View",
      steps: ["Signals", "Context", "Controls", "Insights", "Decisions"],
    },
    ctaHref: "/#connect",
  },
  {
    name: "i-Lakehouse",
    purpose:
      "Turbo AI's modern data and AI foundation capability for organizing governed enterprise data for analytics and AI.",
    problem:
      "AI initiatives stall when data is fragmented, poorly governed, or disconnected from business applications.",
    capabilities: [
      "Lakehouse foundation planning",
      "Governance and metadata orientation",
      "Analytics and AI data readiness",
    ],
    diagram: {
      title: "i-Lakehouse Architecture",
      steps: ["Sources", "Integration", "Lakehouse", "Governance", "Analytics", "AI Apps"],
    },
    ctaHref: "/#connect",
  },
  {
    name: "ADRS",
    purpose:
      "Autonomous Detection & Response System, presented conservatively as a detection-to-response workflow capability.",
    problem:
      "Enterprise teams need earlier identification of operational, security, or data risks and a clearer response path.",
    capabilities: [
      "Detection workflow",
      "Analysis and risk identification",
      "Alerting and response coordination",
    ],
    diagram: {
      title: "ADRS Workflow",
      steps: ["Detection", "Analysis", "Risk Identification", "Alert", "Response"],
    },
    ctaHref: "/#connect",
  },
];

export const productsHero = {
  image: productsImage,
  alt: "Offshore energy technology platform used as a professional product architecture backdrop",
};

export const aboutTurboAI = {
  seoKey: "aboutTurboAI",
  eyebrow: "About Turbo AI",
  title: "About Turbo AI",
  subtitle: "Building the Intelligent Enterprise",
  image: aboutImage,
  alt: "Canadian enterprise technology context map",
  mission: "To help organisations transform intelligence into measurable enterprise capability.",
  vision:
    "To become a trusted technology partner for organisations building the intelligent enterprise.",
  approach: "Strategy With the Capacity to Become Reality",
  principles: [
    "Purpose Before Technology",
    "Data as the Foundation",
    "Security by Design",
    "Human + Machine Intelligence",
    "Engineering Over Hype",
    "Outcomes Over Novelty",
  ],
};

export const industriesHero = {
  seoKey: "industriesWeServe",
  eyebrow: "Industries We Serve",
  title: "Industries We Serve",
  subtitle: "AI Applied to the Real Economy",
  image: industriesImage,
  alt: "Enterprise technology environment representing applied AI across industries",
};
