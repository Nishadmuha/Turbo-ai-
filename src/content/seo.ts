import dciImage from "../assets/dci-data-center.webp";
import lakehouseImage from "../assets/i-lakehouse-infrastructure.webp";
import adrsImage from "../assets/adrs-security-operations-center.webp";
import energyImage from "../assets/energy-hero-platform.jpg";
import strategyImage from "../assets/Hero Background.jpg";
import digitalImage from "../assets/digital-architecture-hero.png";
import cyberImage from "../assets/cyber-security-hero.png";
import cloudImage from "../assets/cloud-solutions-hero.png";
import dataImage from "../assets/ai-data-insights-hero.png";
import remoteImage from "../assets/remote-infrastructure-hero.png";
import qualityImage from "../assets/quality-engineering-hero.png";

export interface PageSEO {
    title: string;
    description: string;
    image?: string;
    url?: string;
    keywords?: string;
}

const baseUrl = import.meta.env.VITE_BASE_URL || "https://turbo-ai.ca";

export const seoConfig: Record<string, PageSEO> = {
    home: {
        title: "AI Consulting Services in Calgary, Canada | Expert AI Consultants",
        description: "Looking for AI consulting companies in Calgary, Canada? Our expert AI consultants deliver custom AI strategies and enterprise-ready solutions.",
        image: `${baseUrl}/home-og.png`,
        url: baseUrl,
        keywords: "AI transformation, artificial intelligence consulting, machine learning, enterprise AI, digital transformation, strategic intelligence, AI architecture, cyber security, cloud solutions, data analytics, AI consulting UK, AI consulting Canada, enterprise intelligence, technology consulting, AI implementation, AI strategy",
    },
    aiTransformation: {
        title: "AI Strategy & Enterprise Transformation | Turbo AI",
        description: "Move from AI ambition to enterprise capability with readiness assessment, opportunity prioritization, architecture, implementation, and continuous improvement.",
        image: `${baseUrl}/enterprise/strategy-meeting.jpg`,
        url: `${baseUrl}/ai-transformation`,
        keywords: "AI transformation, AI strategy, enterprise AI, machine learning operationalization, AI consulting Canada",
    },
    strategicIntelligence: {
        title: "Strategic Intelligence Services in Canada",
        description: "Strategic intelligence services in Canada combining technology research, data modeling, and market insights for enterprise decision-making.",
        image: new URL(strategyImage, baseUrl).href,
        url: `${baseUrl}/strategic-intelligence`,
        keywords: "strategic intelligence, due diligence, market research, data modelling, technology forecasting, competitive intelligence",
    },
    digitalArchitecture: {
        title: "Digital Architecture & Modernization Canada",
        description: "Scalable digital architecture solutions in Canada focused on platform modernization, risk reduction, and faster delivery.",
        image: new URL(digitalImage, baseUrl).href,
        url: `${baseUrl}/digital-architecture`,
        keywords: "digital architecture Canada, modern software engineering, platform engineering, legacy modernization, cloud architecture, scalable systems, technical debt reduction",
    },
    cyberSecuritySolutions: {
        title: "Cyber Security Solutions in Canada",
        description: "Enterprise-grade cybersecurity solutions in Canada covering security architecture, threat detection, and compliance frameworks.",
        image: new URL(cyberImage, baseUrl).href,
        url: `${baseUrl}/cyber-security-solutions`,
        keywords: "cyber security Canada, AI security, threat detection, security architecture, compliance, enterprise security",
    },
    cloudSolutions: {
        title: "Cloud Solutions & Multi-Cloud Services in Canada",
        description: "Secure cloud solutions in Canada with multi-cloud architecture, migration, and optimization for performance, compliance, and cost efficiency.",
        image: new URL(cloudImage, baseUrl).href,
        url: `${baseUrl}/cloud-solutions`,
        keywords: "cloud solutions Canada, multi-cloud architecture, cloud migration, cloud optimization, secure cloud infrastructure",
    },
    aiDataInsights: {
        title: "AI & Data Insights Services Canada",
        description: "AI and data insights services in Canada using advanced analytics, machine learning, and data science for strategic growth.",
        image: new URL(dataImage, baseUrl).href,
        url: `${baseUrl}/ai-data-insights`,
        keywords: "AI data insights, advanced analytics, machine learning Canada, data science services, business intelligence",
    },
    remoteInfrastructureManagement: {
        title: "Remote Infrastructure Management Services in Canada",
        description: "Remote infrastructure management in Canada with 24/7 monitoring, proactive optimization, and maintenance of distributed IT systems to ensure performance, reliability, and rapid issue resolution.",
        image: new URL(remoteImage, baseUrl).href,
        url: `${baseUrl}/remote-infrastructure-management`,
        keywords: "remote infrastructure management, RIM Canada, IT infrastructure monitoring, 24/7 IT support, distributed systems management, managed IT services Canada",
    },
    qualityEngineering: {
        title: "Quality Engineering & Testing Services in Canada",
        description: "Quality engineering services in Canada ensuring software reliability through automation, performance testing, and continuous quality assurance frameworks.",
        image: new URL(qualityImage, baseUrl).href,
        url: `${baseUrl}/quality-engineering`,
        keywords: "quality engineering Canada, software testing, test automation, performance testing, QA services, continuous quality",
    },
    blog: {
        title: "Insights & Perspectives — Turbo AI",
        description: "Explore our latest thinking on artificial intelligence, strategic transformation, and digital architecture.",
        image: new URL(digitalImage, baseUrl).href,
        url: `${baseUrl}/blog`,
        keywords: "AI insights, artificial intelligence blog, digital transformation trends, strategic intelligence articles, Turbo AI blog",
    },
    energy: {
        title: "AI for Energy and Oil & Gas Operations | Turbo AI",
        description: "Explore AI for energy operations, from asset intelligence and predictive maintenance to governed analytics across complex oil and gas infrastructure.",
        image: new URL(energyImage, baseUrl).href,
        url: `${baseUrl}/industries/energy`,
        keywords: "energy AI, AI solutions for energy, predictive maintenance energy, asset intelligence, energy operational analytics, Calgary energy AI, oil and gas AI Canada",
    },
    generativeAgenticAI: {
        title: "Generative & Agentic AI Services | Turbo AI",
        description: "Enterprise generative AI, copilots, knowledge assistants, RAG, AI agents, orchestration, evaluation, and human-in-the-loop workflows.",
        image: `${baseUrl}/enterprise/ai-team.jpg`,
        url: `${baseUrl}/generative-ai-agentic-ai`,
        keywords: "generative AI, agentic AI, enterprise AI assistants, AI copilots, RAG, AI agents, MCP integrations",
    },
    dataFoundations: {
        title: "Data Engineering & AI Foundations | Turbo AI",
        description: "Data engineering, lakehouse, governance, metadata, quality, lineage, streaming, MLOps, i-Lakehouse, and ADRS foundations for enterprise AI.",
        image: `${baseUrl}/enterprise/data-centre-operations.jpg`,
        url: `${baseUrl}/data-engineering-ai-foundations`,
        keywords: "data engineering, AI foundations, data lakehouse, data governance, MLOps, i-Lakehouse, ADRS",
    },
    aiEngineering: {
        title: "AI Engineering & Software Development | Turbo AI",
        description: "Engineering enterprise AI applications, SaaS platforms, AI copilots, RAG applications, intelligent automation, and modern software systems.",
        image: `${baseUrl}/enterprise/software-engineering.jpg`,
        url: `${baseUrl}/ai-engineering-software-development`,
        keywords: "AI engineering, software development, enterprise AI applications, SaaS platforms, RAG applications, intelligent automation",
    },
    governanceCybersecurity: {
        title: "AI Governance & Cybersecurity | Turbo AI",
        description: "AI governance, responsible AI, model lifecycle controls, LLM security, application security, API security, and cybersecurity assessment.",
        image: `${baseUrl}/enterprise/security-operations.jpg`,
        url: `${baseUrl}/ai-governance-cybersecurity`,
        keywords: "AI governance, AI cybersecurity, LLM security, responsible AI, model governance, prompt injection assessment",
    },
    cloudCompute: {
        title: "Cloud, Infrastructure & AI Compute | Turbo AI",
        description: "Cloud architecture, hybrid cloud, multi-cloud, Kubernetes, infrastructure automation, observability, optimization, and AI compute architecture.",
        image: `${baseUrl}/enterprise/data-centre.jpg`,
        url: `${baseUrl}/cloud-infrastructure-ai-compute`,
        keywords: "cloud architecture, AI compute, infrastructure automation, Kubernetes, platform engineering, observability",
    },
    industriesWeServe: {
        title: "Industries We Serve | Enterprise AI for the Real Economy | Turbo AI",
        description: "Explore how Turbo AI applies AI, data, software, cloud, and governance capabilities across energy, finance, healthcare, manufacturing, government, and more.",
        image: `${baseUrl}/enterprise/manufacturing.png`,
        url: `${baseUrl}/industries-we-serve`,
        keywords: "AI industries, enterprise AI by industry, energy AI, finance AI, manufacturing AI, healthcare AI, government AI",
    },
    enterpriseSolutions: {
        title: "Enterprise AI Solutions | Turbo AI",
        description: "AI solutions organized by business problem, including customer intelligence, document processing, predictive maintenance, automation, fraud detection, and supply-chain intelligence.",
        image: `${baseUrl}/enterprise/manufacturing.png`,
        url: `${baseUrl}/enterprise-ai-solutions`,
        keywords: "enterprise AI solutions, customer intelligence, document processing, predictive maintenance, intelligent automation, anomaly detection",
    },
    turboAIProducts: {
        title: "Turbo AI Platforms | i-Lakehouse and ADRS",
        description: "Explore Turbo AI platforms: i-Lakehouse for governed enterprise data and AI, and ADRS for detection-to-response workflows. View architecture, capabilities, and use cases.",
        image: `${baseUrl}/home-og.png`,
        url: `${baseUrl}/products`,
        keywords: "Turbo AI products, Seismic AI, DCI 360, i-Lakehouse, ADRS, proprietary AI platforms",
    },
    dci360: {
        title: "DCI 360 | Intelligent Data Center Infrastructure Management | Turbo AI",
        description: "DCI 360 brings data center monitoring, assets, power, cooling and capacity planning into one operational view for infrastructure teams.",
        image: new URL(dciImage, baseUrl).href,
        url: `${baseUrl}/products/dci-360`,
        keywords: "DCI 360, DCIM, data center infrastructure management, data center monitoring, capacity planning, power and cooling",
    },
    iLakehouse: {
        title: "i-Lakehouse | Hybrid-Native Intelligent Data Platform | Turbo AI",
        description: "i-Lakehouse unifies DataOps, AI/ML and governed data across cloud, hybrid, on-premise and edge environments with open data standards.",
        image: new URL(lakehouseImage, baseUrl).href,
        url: `${baseUrl}/products/i-lakehouse`,
        keywords: "i-Lakehouse, hybrid-native data platform, data lakehouse, DataOps, AI ML, open data formats, data governance",
    },
    adrs: {
        title: "ADRS | Autonomous Detection & Response System | Turbo AI",
        description: "ADRS connects detection, analysis, risk identification, alerts and response in a clear security-operations workflow.",
        image: new URL(adrsImage, baseUrl).href,
        url: `${baseUrl}/products/adrs`,
        keywords: "ADRS, autonomous detection and response system, security operations, risk identification, security alerts",
    },
    aboutTurboAI: {
        title: "About Turbo AI | Building the Intelligent Enterprise",
        description: "Learn about Turbo AI's mission, vision, approach, and principles for building credible enterprise AI, data, software, security, and cloud capabilities.",
        image: `${baseUrl}/enterprise/ai-team.jpg`,
        url: `${baseUrl}/about`,
        keywords: "About Turbo AI, enterprise AI company, AI strategy, intelligent enterprise, technology partner",
    },
};
