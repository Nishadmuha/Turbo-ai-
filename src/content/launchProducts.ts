export interface LaunchProductData {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  paragraphs: string[];
  capabilities: { title: string; description: string }[];
  industries: string[];
  outcome: string;
  cta: string;
  theme: "data" | "security" | "automation" | "cloud";
  shortLabel: string;
  image: string;
  imageAlt: string;
  headline: string;
  workflow: string[];
}

export const launchProducts: LaunchProductData[] = [
  {
    slug: "interstellar-one",
    name: "INTERSTELLAR ONE",
    category: "Enterprise Data Intelligence & AI Analytics",
    image: "/products/interstellar-one.jpg",
    imageAlt: "Laptop displaying analytics charts and business data on a glass table",
    headline: "See the bigger picture. Make the next move.",
    workflow: ["Connect your sources", "Build a trusted data foundation", "Explore with intelligence", "Put insight into action"],
    tagline: "From Data to Decisions.",
    summary: "Connect enterprise data, explore information with AI, and build a stronger foundation for informed decisions.",
    paragraphs: [
      "Your business generates information across multiple systems. INTERSTELLAR ONE is designed to help connect that information and make it more useful for reporting, analysis, forecasting, and decision-making.",
      "From enterprise data integration to AI-assisted analytics, INTERSTELLAR ONE provides a flexible solution approach for organizations seeking greater visibility into their operations and a stronger foundation for data-driven decisions.",
    ],
    capabilities: [
      { title: "Enterprise Data Integration", description: "Connect and organize information from databases, enterprise applications, cloud systems, and other business data sources." },
      { title: "Business Intelligence & Visualization", description: "Develop dashboards, operational reports, and analytical views that make complex information easier to understand." },
      { title: "AI-Assisted Data Exploration", description: "Enable more intuitive ways to search, explore, and interpret enterprise information." },
      { title: "Predictive Analytics & Forecasting", description: "Apply statistical and machine learning techniques to suitable historical data for forecasting, trend analysis, and operational planning." },
      { title: "Data Modernization & Governance", description: "Support data transformation, improved accessibility, quality controls, and more consistent information management." },
    ],
    industries: ["Financial Services", "Manufacturing", "Healthcare", "Retail", "Energy", "Logistics", "Government"],
    outcome: "Bring scattered information into a more connected environment, reduce manual reporting, identify operational trends, and support more informed business decisions.",
    cta: "Discuss Your Data Challenges",
    theme: "data",
    shortLabel: "Data intelligence",
  },
  {
    slug: "spectra-plus",
    name: "SPECTRA PLUS",
    category: "Cybersecurity, Threat Detection & Risk Management",
    image: "/products/spectra-plus.jpg",
    imageAlt: "Technology professional reviewing code across multiple computer screens",
    headline: "A clearer view of risk. A more coordinated response.",
    workflow: ["Surface security signals", "Understand the exposure", "Prioritize the response", "Review and strengthen"],
    tagline: "Visibility. Intelligence. Control.",
    summary: "Bring security findings, risk assessment, and incident coordination into a clearer operational view.",
    paragraphs: [
      "Security teams need a clear understanding of potential risks across their increasingly complex technology environments.",
      "SPECTRA PLUS is Turbo AI's configurable cybersecurity solution offering, focused on improving security visibility, risk assessment, and incident coordination.",
      "It brings together relevant security information, monitoring integrations, and structured response workflows to help organizations evaluate exposures, prioritize findings, and manage security operations more effectively.",
    ],
    capabilities: [
      { title: "Security Posture Assessment", description: "Evaluate security configurations, potential vulnerabilities, and areas requiring attention." },
      { title: "Cloud Security Visibility", description: "Bring relevant cloud security findings and operational information into a more consistent view." },
      { title: "Security Monitoring Integrations", description: "Connect with suitable security tools and data sources to support alert visibility and investigation workflows." },
      { title: "Incident Management", description: "Support structured incident tracking, escalation, investigation, and response coordination." },
      { title: "Security Governance & Reporting", description: "Develop reporting and review workflows aligned with organizational policies and applicable compliance requirements." },
    ],
    industries: ["Financial Services", "Healthcare", "Technology", "Professional Services", "Retail", "Government"],
    outcome: "Improve visibility into security risks, organize security findings, support incident response coordination, and make security operations easier to manage.",
    cta: "Discuss Your Security Requirements",
    theme: "security",
    shortLabel: "Cybersecurity",
  },
  {
    slug: "quantum-apex",
    name: "QUANTUM APEX",
    category: "Agentic AI & Intelligent Workflow Automation",
    image: "/products/quantum-apex.jpg",
    imageAlt: "Yellow industrial robot coordinating work on a manufacturing production line",
    headline: "Give your people more room to move forward.",
    workflow: ["Map the work", "Connect applications", "Orchestrate with AI", "Keep people in control"],
    tagline: "Automate Work. Accelerate Progress.",
    summary: "Connect processes, applications, and information through AI-assisted workflows with human oversight.",
    paragraphs: [
      "Repetitive tasks, disconnected applications, and manual approvals can slow down otherwise efficient teams.",
      "QUANTUM APEX is a configurable intelligent automation offering designed to connect business processes, applications, and information using AI-assisted workflows and agent-based technologies.",
      "It helps organizations explore practical automation opportunities while maintaining appropriate visibility, controls, and human oversight.",
    ],
    capabilities: [
      { title: "AI-Assisted Workflows", description: "Apply AI-enabled processing to suitable repetitive and information-intensive tasks." },
      { title: "Enterprise Process Automation", description: "Connect business applications and structure workflows across departments." },
      { title: "Document Intelligence", description: "Support extraction, classification, review, and routing of business documents." },
      { title: "Intelligent Task Orchestration", description: "Coordinate defined activities across systems using rules, integrations, and AI agents where appropriate." },
      { title: "Human-in-the-Loop Controls", description: "Incorporate approval checkpoints, exception handling, and operational oversight." },
    ],
    industries: ["Banking", "Insurance", "Healthcare", "Logistics", "Professional Services", "Manufacturing", "Retail"],
    outcome: "Reduce repetitive work, improve information flow between teams, streamline approvals, and create more consistent business processes.",
    cta: "Discuss Your Automation Opportunities",
    theme: "automation",
    shortLabel: "Intelligent automation",
  },
  {
    slug: "orbit-core",
    name: "ORBIT CORE",
    category: "Cloud Infrastructure Management & Cost Optimization",
    image: "/products/orbit-core.jpg",
    imageAlt: "Network cables and illuminated equipment inside data centre server racks",
    headline: "Bring clarity to your cloud. Make every resource count.",
    workflow: ["Discover your environment", "Understand consumption", "Identify opportunities", "Optimize with oversight"],
    tagline: "Smarter Cloud. Greater Control.",
    summary: "Understand cloud usage and spending, strengthen governance, and coordinate controlled operational workflows.",
    paragraphs: [
      "Cloud infrastructure gives businesses flexibility, but managing resources, usage, spending, and operational requirements can become increasingly complex.",
      "ORBIT CORE is designed to help organizations improve cloud visibility, understand infrastructure consumption, and introduce more consistent cloud management and governance practices.",
      "Its configurable approach supports cloud operational intelligence, resource oversight, cost analysis, and approved automation workflows.",
    ],
    capabilities: [
      { title: "Multi-Cloud Visibility", description: "Support consolidated operational views across compatible cloud environments." },
      { title: "Cloud Cost Intelligence", description: "Analyze cloud spending, resource consumption, and potential optimization opportunities." },
      { title: "Infrastructure Monitoring", description: "Bring together relevant operational metrics, alerts, and resource information." },
      { title: "Cloud Governance", description: "Support policies, access reviews, resource accountability, and operational reporting." },
      { title: "Operational Workflow Automation", description: "Introduce controlled automation for suitable maintenance, resource management, and cloud operational processes." },
    ],
    industries: ["Technology", "Financial Services", "Healthcare", "Retail", "Manufacturing", "Enterprise IT"],
    outcome: "Improve understanding of cloud usage, identify areas for operational improvement, support cost management, and establish more consistent infrastructure oversight.",
    cta: "Discuss Your Cloud Environment",
    theme: "cloud",
    shortLabel: "Cloud operations",
  },
];

export const enterpriseApproach = [
  { title: "Understand", description: "Identify the business challenge, existing systems, available data, and desired outcomes." },
  { title: "Design", description: "Define an appropriate solution architecture, integration requirements, and implementation scope." },
  { title: "Configure & Implement", description: "Adapt suitable technology components and develop the integrations or workflows required for the agreed solution." },
  { title: "Support & Evolve", description: "Plan ongoing operational support, performance evaluation, and future enhancements based on the agreed engagement." },
];

export const solutionScopeNote = "Solution features, integration compatibility, deployment models, licensing, and implementation scope are determined through technical assessment and project agreement.";
