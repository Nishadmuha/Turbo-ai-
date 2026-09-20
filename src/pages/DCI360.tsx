import { ArrowLongRightIcon, BoltIcon, ChartBarSquareIcon, CircleStackIcon, CpuChipIcon, LockClosedIcon, ServerStackIcon } from "@heroicons/react/24/outline";
import { Container } from "../components/Container";
import { LatestPerspectives } from "../components/EnterprisePage";
import { ProductFAQ, ProductRelatedLinks, ProductSEO } from "../components/ProductSEOSections";
import { SectionLink } from "../components/SectionLink";
import dataCenterImage from "../assets/dci-data-center.webp";
import "./products.css";
import "./products-theme.css";

const capabilities = [
  { icon: ChartBarSquareIcon, title: "Real-time monitoring", detail: "See infrastructure signals and alerts as they happen." },
  { icon: BoltIcon, title: "Power & cooling", detail: "Bring environmental and energy controls into view." },
  { icon: ServerStackIcon, title: "Assets & racks", detail: "Keep equipment and rack resources organized." },
  { icon: CircleStackIcon, title: "Capacity planning", detail: "Plan and optimize available infrastructure." },
  { icon: CpuChipIcon, title: "Automation", detail: "Turn operational insight into efficient action." },
  { icon: LockClosedIcon, title: "Security & compliance", detail: "Build controls into everyday operations." },
];

const domains = ["IT", "Facility", "Power", "Cooling", "Environment"];
const stages = ["Monitor", "Analyze", "Optimize", "Automate"];
const relatedLinks = [
  { href: "/cloud-infrastructure-ai-compute", title: "Cloud Infrastructure & AI Compute", description: "Explore resilient infrastructure for enterprise AI workloads." },
  { href: "/ai-governance-cybersecurity", title: "AI Governance & Cybersecurity", description: "Connect infrastructure operations with security and governance." },
  { href: "/products/i-lakehouse", title: "i-Lakehouse", description: "Bring operational data into a hybrid-native data platform." },
];
const faqs = [
  { question: "What does DCI 360 bring into one view?", answer: "DCI 360 connects IT, facility, power, cooling and environmental signals in one data center infrastructure view." },
  { question: "How does DCI 360 support capacity planning?", answer: "Its asset and capacity views help teams plan infrastructure use alongside live monitoring and operational analytics." },
  { question: "Which capabilities does DCI 360 bring together?", answer: "It brings together real-time monitoring, power and cooling visibility, rack and asset tracking, capacity planning, automation, and security controls." },
];

function ConceptDashboard() {
  return (
    <div className="product-dashboard" role="img" aria-label="Conceptual dashboard showing infrastructure domains, capacity bars, and an operations timeline; not a product screenshot">
      <div className="product-dashboard-top"><span className="product-dashboard-brand">DCI <b>360</b></span><span>INFRASTRUCTURE OVERVIEW</span><span className="product-live"><i /> CONCEPTUAL VIEW</span></div>
      <div className="product-dashboard-body">
        <div className="product-dashboard-sidebar"><span className="selected">Overview</span><span>Infrastructure</span><span>Capacity</span><span>Operations</span></div>
        <div className="product-dashboard-main">
          <div className="product-dashboard-heading"><strong>One view of your infrastructure</strong><span>IT / FACILITY / POWER</span></div>
          <div className="product-dashboard-metrics">
            {[["Power", "#fbbf24", "72%"], ["Cooling", "#5dc7ff", "59%"], ["Capacity", "#768dff", "81%"]].map(([name, color, width]) => <div key={name}><span>{name}</span><div className="product-meter"><i style={{ width, backgroundColor: color }} /></div></div>)}
          </div>
          <div className="product-dashboard-chart" aria-hidden="true">{[43, 55, 38, 62, 50, 72, 60, 78, 67, 84, 73, 90].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
          <div className="product-dashboard-footer"><span><i /> Assets</span><span><i /> Environmental</span><span><i /> Alerts</span></div>
        </div>
      </div>
    </div>
  );
}

export function DCI360() {
  return (
    <main className="product-page dci-page">
      <ProductSEO pageKey="dci360" />
      <section className="product-hero dci-hero">
        <img className="dci-hero-image" src={dataCenterImage} alt="Modern data center corridor with server racks" loading="eager" />
        <div className="dci-hero-shade" />
        <Container className="product-hero-inner">
          <p className="product-eyebrow">DATA CENTER INFRASTRUCTURE MANAGEMENT</p>
          <h1>DCI <span>360</span></h1>
          <p className="product-hero-subtitle">Intelligent Data Center<br />Infrastructure Management</p>
          <p className="product-hero-intro">Bring live monitoring, asset intelligence and capacity planning together for data center operations.</p>
          <a className="product-button dci-button" href="#dci-core">Explore DCI 360 <ArrowLongRightIcon aria-hidden="true" /></a>
        </Container>
        <div className="dci-hero-bottom"><Container><span>UNIFIED VISIBILITY</span><span>PROACTIVE OPERATIONS</span><span>INTELLIGENT CONTROLS</span></Container></div>
      </section>
      <section id="dci-core" className="product-section dci-core">
        <Container>
          <div className="product-section-intro"><p className="product-eyebrow">01 / THE CORE IDEA</p><h2>One operational view.<br /><span>Every critical layer.</span></h2><p>Connect IT, facility and power resources in one infrastructure picture.</p></div>
          <div className="dci-domain-flow" aria-label="IT, Facility, Power, Cooling and Environment in one operational view">{domains.map((domain, index) => <div className="dci-domain" key={domain}><span className="dci-domain-index">0{index + 1}</span><span className="dci-domain-dot" /><strong>{domain}</strong></div>)}</div>
        </Container>
      </section>
      <section className="product-section dci-capabilities"><Container><div className="product-section-heading"><div><p className="product-eyebrow">02 / CAPABILITIES</p><h2>Clarity at every level.</h2></div><p>From live signals to long-range planning.</p></div><div className="dci-cap-grid">{capabilities.map(({ icon: Icon, title, detail }, index) => <article className="dci-cap" key={title}><span className="dci-cap-number">0{index + 1}</span><Icon className="dci-cap-icon" aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></article>)}</div></Container></section>
      <section className="product-section dci-operations"><Container><p className="product-eyebrow">03 / INTELLIGENT OPERATIONS</p><h2>From signal to action.</h2><ol className="dci-steps">{stages.map((stage, index) => <li key={stage}><span>0{index + 1}</span><h3>{stage}</h3>{index < stages.length - 1 && <ArrowLongRightIcon aria-hidden="true" />}</li>)}</ol><div className="dci-values"><span>Unified visibility</span><span>Proactive management</span><span>Operational efficiency</span><span>Reliability</span></div></Container></section>
      <section className="product-section dci-visual"><Container className="dci-visual-layout"><div className="dci-visual-copy"><p className="product-eyebrow">04 / DASHBOARDS & REPORTING</p><h2>See the whole operation.</h2><p>Customizable dashboards and reporting bring infrastructure signals into focus.</p><span className="product-concept-label">CONCEPTUAL PRODUCT VISUAL</span></div><ConceptDashboard /></Container></section>
      <ProductRelatedLinks links={relatedLinks} />
      <ProductFAQ title="DCI 360 questions" intro="A quick look at how DCI 360 supports data center infrastructure management." items={faqs} />
      <section className="product-cta dci-cta"><Container><p className="product-eyebrow">DCI 360</p><h2>Build smarter infrastructure operations.</h2><SectionLink href="/#connect" className="product-button dci-button">Start a conversation <ArrowLongRightIcon aria-hidden="true" /></SectionLink></Container></section>
      <LatestPerspectives />
    </main>
  );
}
