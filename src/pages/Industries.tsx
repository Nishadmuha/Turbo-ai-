import { useState } from "react";
import { Container, Section } from "../components/Container";
import { useReveal } from "../hooks/useReveal";
import { SectionLink } from "../components/SectionLink";
import { SEO } from "../components/SEO";
import { Connect } from "../components/Connect";

import energyHeroImg from "../assets/energy-hero-platform.jpg";
import refineryPipesImg from "../assets/smarter-operations-pipes.jpg";
import calgaryImg from "../assets/locations-calgary.jpg";
import edmontonImg from "../assets/locations-edmonton.jpg";
import fortMcMurrayImg from "../assets/locations-fort-mcmurray.jpg";
import blogGridImg from "../assets/blog-grid-analytics.jpg";
import blogMaintImg from "../assets/blog-predictive-maintenance.jpg";
import blogHydrogenImg from "../assets/blog-hydrogen-facility.jpg";

export function Industries() {
  const { addElement } = useReveal(40);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default
  const [activeBlogIndex, setActiveBlogIndex] = useState(0);

  const faqs = [
    {
      q: "How can AI improve oil and gas operations?",
      a: "AI improves operations by optimizing extraction processes, predicting equipment failures, and enhancing safety monitoring through real-time telemetry analysis.",
    },
    {
      q: "What is the typical ROI of AI projects?",
      a: "Most enterprise energy operators achieve positive, measurable ROI within 90 to 120 days through reduced downtime, fewer false alarms, and optimized asset performance.",
    },
    {
      q: "How long does it take to see results?",
      a: "Initial pilot deployments on critical assets typically go live within 4 to 6 weeks, with full multi-site rollouts taking 8 to 14 weeks depending on asset count and data maturity.",
    },
    {
      q: "Do you work with legacy systems?",
      a: "Yes. Our platform connects directly via industry-standard protocols including OPC-UA, MQTT, Modbus, and REST APIs, operating alongside existing SCADA and DCS architectures without hardware replacement.",
    },
    {
      q: "What types of data do you work with?",
      a: "We ingest high-frequency time-series telemetry (vibration, temperature, pressure, flow rate), acoustic signatures, thermal imaging feeds, seismic surveys, operational logs, and geospatial GIS data.",
    },
    {
      q: "How do you ensure data security and compliance?",
      a: "We enforce end-to-end encryption (TLS 1.3, AES-256), strict role-based access control (RBAC), and full compliance with Canadian PIPEDA, AER standards, SOC 2 Type II, and critical infrastructure frameworks.",
    },
  ];

  const blogPosts = [
    {
      title: "Optimizing Grid Performance with Real-Time AI Analytics",
      category: "CASE STUDY",
      date: "Oct 11, 2023",
      excerpt:
        "Discover how modern machine learning models are reshaping the way we manage electrical grid stability and distribution.",
      image: blogGridImg,
      link: "/blog/global-state-ai-2025-enterprise-transformation",
    },
    {
      title: "Predictive Maintenance in Harsh Remote Environments",
      category: "WHITE PAPER",
      date: "Oct 12, 2023",
      excerpt:
        "Discover how modern machine learning models are reshaping the way we manage electrical grid stability and distribution.",
      image: blogMaintImg,
      link: "/blog/bridging-ai-infrastructure-gap-strategic-investment",
    },
    {
      title: "The Future of Hydrogen: AI-Driven Energy Transitions",
      category: "INSIGHT",
      date: "Oct 13, 2023",
      excerpt:
        "Discover how modern machine learning models are reshaping the way we manage electrical grid stability and distribution.",
      image: blogHydrogenImg,
      link: "/blog/2025-ai-business-forecast-pwc-vision",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleNextBlog = () => {
    setActiveBlogIndex((prev) => (prev + 1) % blogPosts.length);
  };

  const handlePrevBlog = () => {
    setActiveBlogIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  return (
    <main className="bg-charcoal text-white selection:bg-emeraldNeon selection:text-white" role="main">
      <SEO pageKey="industries" />

      {/* =========================================================================
          SECTION 1: HERO SECTION
      ========================================================================== */}
      <section className="relative min-h-[780px] w-full flex items-center justify-center pt-[72px] pb-12 sm:pt-24 sm:pb-16 overflow-hidden bg-[#020617] border-b border-white/5">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.12),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(30,64,175,0.10),transparent_55%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            {/* Left Hero Content (7 Cols) */}
            <div className="lg:col-span-7 text-left">
              {/* Badge */}
              <div
                ref={addElement}
                className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-[#0B1528] text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6"
              >
                ENERGY & OIL & GAS
              </div>

              {/* Main Headline */}
              <h1
                ref={addElement}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.08] mb-6"
              >
                AI Solutions for
                <span className="text-emeraldNeon block mt-1">
                  Energy
                </span>
                <span className="text-emeraldNeon block mt-1">
                  Intelligence
                </span>
              </h1>

              {/* Subheading */}
              <p
                ref={addElement}
                className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 sm:mb-10"
              >
                Turbo AI helps energy organisations apply artificial intelligence, predictive analytics and data engineering to improve asset performance and operational efficiency.
              </p>

              {/* CTAs & Slogan */}
              <div ref={addElement} className="flex flex-wrap items-center gap-6">
                <SectionLink
                  href="#connect"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] hover:scale-105 flex items-center gap-2.5"
                >
                  <span>Explore Our Solutions</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </SectionLink>

                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <span>Made in Canada</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card (5 Cols) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end" ref={addElement}>
              <div className="relative w-full max-w-[524px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-charcoalDeep">
                {/* Image */}
                <div className="relative w-full aspect-[524/464] sm:h-[464px] overflow-hidden">
                  <img
                    src={energyHeroImg}
                    alt="Offshore energy drilling platform at sea"
                    className="w-full h-full object-cover object-center brightness-95"
                    loading="eager"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-[#020617]/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Real-time Efficiency Widget Overlay */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-[#0D1527]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:px-5 sm:py-4 shadow-2xl flex items-center gap-3.5 z-20">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base leading-tight">
                    Real-time Efficiency
                  </div>
                  <div className="text-emerald-400 font-semibold text-xs sm:text-sm mt-0.5">
                    +14.2% Optimization
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SMARTER ENERGY OPERATIONS POWERED BY INTELLIGENCE
      ========================================================================== */}
      <Section className="bg-[#020617] py-16 sm:py-24 border-b border-white/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Image Column (5 Cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1" ref={addElement}>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-charcoalDeep group">
                <img
                  src={refineryPipesImg}
                  alt="Industrial precision energy valves and pipeline infrastructure"
                  className="w-full h-auto object-cover aspect-[4/3.3] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Text & Stats Column (7 Cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div
                ref={addElement}
                className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-wider mb-4 font-bold"
              >
                ABOUT THE INDUSTRY
              </div>
              <h2
                ref={addElement}
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-[1.12] tracking-tight"
              >
                <span className="block">Smarter Energy</span>
                <span className="block">Operations</span>
                <span className="block">Powered by Intelligence</span>
              </h2>
              <div className="space-y-3 mb-8" ref={addElement}>
                <p className="text-sm sm:text-[15px] lg:text-base text-slate-300 leading-relaxed">
                  AI does not create value in isolation. Turbo AI applies artificial intelligence, predictive analytics and data engineering to complex energy environments.
                </p>
                <p className="text-sm sm:text-[15px] lg:text-base text-slate-300 leading-relaxed">
                  Helping organisations improve asset intelligence, operational visibility, maintenance planning and decision-making for a sustainable future.
                </p>
              </div>

              {/* 2 Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" ref={addElement}>
                <div className="bg-[#060B15] border-2 border-blue-500 rounded-2xl px-6 py-5 sm:py-6 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] shadow-[0_0_15px_rgba(59,130,246,0.12)]">
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">
                    99.8%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase font-mono">
                    UPTIME RELIABILITY
                  </div>
                </div>

                <div className="bg-[#060B15] border-2 border-blue-500 rounded-2xl px-6 py-5 sm:py-6 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] shadow-[0_0_15px_rgba(59,130,246,0.12)]">
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">
                    30%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase font-mono">
                    COST REDUCTION
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 3: AI SOLUTIONS FOR ENERGY (4 CORE CARDS GRID)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          {/* Header - Left-aligned */}
          <div className="max-w-4xl text-left mb-14 sm:mb-16">
            <div
              ref={addElement}
              className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-wider mb-3 font-bold"
            >
              OUR SOLUTIONS
            </div>
            <h2
              ref={addElement}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-5 tracking-tight"
            >
              AI Solutions for Energy
            </h2>
            <p
              ref={addElement}
              className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl leading-relaxed"
            >
              Purpose-built AI capabilities that deliver measurable impact across exploration, production and operations.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Amber / Gold */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-amber-500/30 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#22180B] border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3l6.5 3.5-6.5 3.5-6.5-3.5L12 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 10.5l6.5 3.5 6.5-3.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 15l6.5 3.5 6.5-3.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  Predictive Maintenance
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  AI models predict equipment failures before they occur, reducing downtime.
                </p>
              </div>
              <SectionLink
                href="#connect"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span>Learn more</span>
                <span>→</span>
              </SectionLink>
            </div>

            {/* Card 2 - Blue */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-blue-500/30 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#0B172E] border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <ellipse cx="12" cy="6.5" rx="6.5" ry="3" strokeWidth={1.75} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 6.5v6c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 12.5v5c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Asset Intelligence
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Real-time monitoring and AI-driven insights to improve asset health.
                </p>
              </div>
              <SectionLink
                href="#connect"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span>Learn more</span>
                <span>→</span>
              </SectionLink>
            </div>

            {/* Card 3 - Cyan */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#082226] border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v16h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16v-10" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Operational Analytics
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Analyze operational data to improve efficiency and detect anomalies.
                </p>
              </div>
              <SectionLink
                href="#connect"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span>Learn more</span>
                <span>→</span>
              </SectionLink>
            </div>

            {/* Card 4 - Purple */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-purple-500/30 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#1C1236] border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v16h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 14l3.5-4 3.5 3 4-6" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  Production Optimization
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  AI-powered models help optimize production and enhance recovery.
                </p>
              </div>
              <SectionLink
                href="#connect"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span>Learn more</span>
                <span>→</span>
              </SectionLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 4: FROM DATA TO BETTER DECISIONS (WORKFLOW BANNER)
      ========================================================================== */}
      <section id="workflow" className="relative py-24 sm:py-32 bg-[#020617] overflow-hidden border-b border-white/5">
        {/* Background Vertical Light Beams & Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:10%_100%] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
            <div
              ref={addElement}
              className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-widest mb-3 font-bold"
            >
              INDUSTRY USE CASES
            </div>
            <h2
              ref={addElement}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-5 tracking-tight"
            >
              From Data to Better Decisions
            </h2>
            <p
              ref={addElement}
              className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Turning energy data into actionable intelligence for safer, more efficient and more sustainable operations.
            </p>
          </div>

          {/* 4 Steps Horizontal Workflow with Connecting Line */}
          <div className="relative">
            {/* Horizontal Line behind badges (Desktop) */}
            <div className="hidden lg:block absolute top-[32px] left-[12%] right-[12%] h-[1px] bg-blue-900/40 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
              {/* Step 1: Energy Data */}
              <div ref={addElement} className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-lg relative z-10 group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <ellipse cx="12" cy="6.5" rx="6.5" ry="3" strokeWidth={1.75} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 6.5v6c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.5 12.5v5c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-5" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2">
                  Energy Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] leading-relaxed">
                  Collect and integrate operational data.
                </p>
              </div>

              {/* Step 2: AI & Analytics */}
              <div ref={addElement} className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-lg relative z-10 group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={1.75} />
                    <rect x="9" y="9" width="6" height="6" strokeWidth={1.75} />
                    <path strokeLinecap="round" strokeWidth={1.75} d="M9 2v3m6-3v3m-6 14v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2">
                  AI & Analytics
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] leading-relaxed">
                  Apply advanced analytics to risks.
                </p>
              </div>

              {/* Step 3: Intelligent Decisions */}
              <div ref={addElement} className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-lg relative z-10 group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.5 4a3.5 3.5 0 00-3.5 3.5c0 .36.06.7.16 1.02A3.5 3.5 0 004 12c0 1.25.66 2.35 1.64 2.95A3.5 3.5 0 009.5 20h.5a3.5 3.5 0 003.5-3.5V7.5A3.5 3.5 0 009.5 4zm5 0a3.5 3.5 0 013.5 3.5c0 .36-.06.7-.16 1.02A3.5 3.5 0 0120 12c0 1.25-.66 2.35-1.64 2.95A3.5 3.5 0 0114.5 20h-.5a3.5 3.5 0 01-3.5-3.5V7.5A3.5 3.5 0 0114.5 4z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2">
                  Intelligent Decisions
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] leading-relaxed">
                  Enable faster data-driven choices.
                </p>
              </div>

              {/* Step 4: Business Outcomes */}
              <div ref={addElement} className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-lg relative z-10 group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="3" strokeWidth={1.75} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2">
                  Business Outcomes
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] leading-relaxed">
                  Higher efficiency and lower costs.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 5: WHY ENERGY LEADERS CHOOSE TURBO AI (SPLIT 2-COL)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Header Column (5 Cols) */}
            <div className="lg:col-span-5" ref={addElement}>
              <div className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-wider mb-4 font-bold">
                WHY TURBO AI
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-tight tracking-tight">
                Why Energy Leaders <span className="block">Choose Turbo AI</span>
              </h2>
              <div className="w-14 h-1 bg-blue-600 rounded-full" />
            </div>

            {/* Right 2x2 Feature Grid (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 lg:gap-x-12 lg:gap-y-12">
              {/* Feature 1: AI & Data Engineering */}
              <div ref={addElement} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-md group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                    AI & Data Engineering
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Build robust data pipelines, real-time analytics and scalable platforms.
                  </p>
                </div>
              </div>

              {/* Feature 2: Enterprise Software */}
              <div ref={addElement} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-md group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                    Enterprise Software
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Custom applications and APIs for complex energy operations.
                  </p>
                </div>
              </div>

              {/* Feature 3: Intelligent Automation */}
              <div ref={addElement} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-md group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={1.75} />
                    <rect x="9" y="9" width="6" height="6" strokeWidth={1.75} />
                    <path strokeLinecap="round" strokeWidth={1.75} d="M9 2v3m6-3v3m-6 14v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                    Intelligent Automation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Automate workflows, reduce manual effort and improve productivity.
                  </p>
                </div>
              </div>

              {/* Feature 4: Security & Governance */}
              <div ref={addElement} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#0C152B] border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-md group-hover:scale-105 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                    Security & Governance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Ensure data security, compliance and responsible AI adoption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 6: SERVING ORGANISATIONS ACROSS CANADA (LOCATIONS GRID)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-16">
            <div ref={addElement}>
              <div className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-wider mb-3 font-bold">
                LOCATIONS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight tracking-tight">
                Serving Organisations <span className="block">Across Canada</span>
              </h2>
            </div>
            <div ref={addElement} className="md:text-right flex flex-col md:items-end">
              <p className="text-sm sm:text-base text-slate-300 max-w-sm mb-4 leading-relaxed md:text-right">
                We work closely with energy companies across key regions, providing local presence and global delivery capabilities.
              </p>
              <SectionLink
                href="#connect"
                className="px-5 py-2.5 rounded-xl bg-[#0B1324] border border-blue-500/20 hover:border-blue-500/50 text-white font-semibold text-sm transition-all duration-200 shadow-md inline-flex items-center gap-2"
              >
                <span>View All Locations</span>
                <span>→</span>
              </SectionLink>
            </div>
          </div>

          {/* 4 Location Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* City 1: Calgary */}
            <div
              ref={addElement}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-300 aspect-[4/4.2] flex flex-col justify-end p-6 shadow-xl"
            >
              <img
                src={calgaryImg}
                alt="Calgary Skyline"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
              <div className="relative z-10">
                <div className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider mb-1">
                  ALBERTA
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Calgary
                </h3>
              </div>
            </div>

            {/* City 2: Edmonton */}
            <div
              ref={addElement}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-300 aspect-[4/4.2] flex flex-col justify-end p-6 shadow-xl"
            >
              <img
                src={edmontonImg}
                alt="Edmonton Skyline"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
              <div className="relative z-10">
                <div className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider mb-1">
                  ALBERTA
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Edmonton
                </h3>
              </div>
            </div>

            {/* City 3: Fort McMurray */}
            <div
              ref={addElement}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-300 aspect-[4/4.2] flex flex-col justify-end p-6 shadow-xl"
            >
              <img
                src={fortMcMurrayImg}
                alt="Fort McMurray Infrastructure"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
              <div className="relative z-10">
                <div className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider mb-1">
                  ALBERTA
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Fort McMurray
                </h3>
              </div>
            </div>

            {/* City 4: Across Canada */}
            <div
              ref={addElement}
              className="group relative rounded-2xl overflow-hidden border border-dashed border-blue-500/30 bg-[#0B1324] hover:border-blue-500/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 aspect-[4/4.2] flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white mb-1">
                Across Canada
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                And Beyond
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 7: COMMON QUESTIONS (FAQ ACCORDION)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Header Column (5 Cols) */}
            <div className="lg:col-span-5" ref={addElement}>
              <div className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-wider mb-4 font-bold">
                FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
                Common <span className="block">Questions</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed">
                Everything you need to know about our AI implementation process and how it delivers value to your operations.
              </p>
            </div>

            {/* Right Accordion Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-3.5" ref={addElement}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-[#0B1324] border-blue-500/20 shadow-lg"
                        : "bg-[#0B1324] border-white/5 hover:border-blue-500/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className={isOpen ? "text-blue-500" : "text-white group-hover:text-blue-400"}>
                        {faq.q}
                      </span>
                      <span className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "text-blue-500" : "text-slate-400"}`}>
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                        <div className="border-t border-white/5 pt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 8: OPTIMIZING ENERGY OPERATIONS (3 ADVANCED MODULE CARDS)
      ========================================================================== */}
      {/* =========================================================================
          SECTION 8: OPTIMIZING ENERGY OPERATIONS (3 ADVANCED MODULE CARDS)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-16">
            <div
              ref={addElement}
              className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-widest mb-3 font-bold"
            >
              INDUSTRY DETAILS
            </div>
            <h2
              ref={addElement}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight"
            >
              Optimizing Energy Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Module 1: Resource Management */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-yellow-500/30 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)] shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#241B08] border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-105 group-hover:border-yellow-500/40 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  Resource Management
                </h3>
                <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed mb-8">
                  Dynamic allocation of assets across exploration and production sites to maximize yield.
                </p>
              </div>
              <div className="border-t border-white/5 pt-5">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider">
                  MISSION CRITICAL
                </span>
              </div>
            </div>

            {/* Module 2: Safety & Compliance */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#082226] border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Safety & Compliance
                </h3>
                <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed mb-8">
                  Real-time hazard detection and automated reporting protocols ensuring 100% compliance.
                </p>
              </div>
              <div className="border-t border-white/5 pt-5">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider">
                  MISSION CRITICAL
                </span>
              </div>
            </div>

            {/* Module 3: Predictive Lifecycle */}
            <div
              ref={addElement}
              className="group bg-[#0B1324] border border-white/5 hover:border-purple-500/30 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1C1236] border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 group-hover:border-purple-500/40 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  Predictive Lifecycle
                </h3>
                <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed mb-8">
                  Extend operational lifespan of heavy machinery through AI-driven maintenance scheduling.
                </p>
              </div>
              <div className="border-t border-white/5 pt-5">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider">
                  MISSION CRITICAL
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 9: FROM OUR BLOG (CAROUSEL & CARDS)
      ========================================================================== */}
      <Section className="bg-[#020617] py-20 sm:py-28 border-b border-white/5">
        <Container>
          {/* Header Row with Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div ref={addElement}>
              <div className="inline-block text-xs sm:text-sm font-mono text-blue-500 uppercase tracking-widest mb-3 font-bold">
                LATEST INSIGHTS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4 tracking-tight">
                From Our Blog
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Stay updated with the latest trends and breakthroughs in energy intelligence and industrial AI.
              </p>
            </div>

            {/* Carousel Controls */}
            <div ref={addElement} className="flex items-center gap-3">
              <button
                onClick={handlePrevBlog}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-blue-500 text-white flex items-center justify-center transition-all bg-transparent hover:text-blue-400"
                aria-label="Previous blog post"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextBlog}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                aria-label="Next blog post"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 3 Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((_, i) => {
              const post = blogPosts[(i + activeBlogIndex) % blogPosts.length];
              return (
                <SectionLink
                  key={post.title}
                  href={post.link}
                  className="group block transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-xl bg-charcoalDeep">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Meta: Category Badge & Date */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-md bg-[#0C152B] border border-blue-500/30 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{post.date}</span>
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    <span>Read More</span>
                    <span>→</span>
                  </div>
                </SectionLink>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 10: CONNECT / CONTACT SECTION
      ========================================================================== */}
      <Connect />
    </main>
  );
}
