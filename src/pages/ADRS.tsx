import { ArrowLongRightIcon, BellAlertIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, ShieldCheckIcon, SignalIcon } from "@heroicons/react/24/outline";
import { Container } from "../components/Container";
import { LatestPerspectives } from "../components/EnterprisePage";
import { ProductFAQ, ProductRelatedLinks, ProductSEO } from "../components/ProductSEOSections";
import { SectionLink } from "../components/SectionLink";
import "./products.css";
import "./products-theme.css";

const workflow = [
  { name: "Detection", icon: SignalIcon },
  { name: "Analysis", icon: MagnifyingGlassIcon },
  { name: "Risk identification", icon: ExclamationTriangleIcon },
  { name: "Alert", icon: BellAlertIcon },
  { name: "Response", icon: ShieldCheckIcon },
];
const relatedLinks = [
  { href: "/ai-governance-cybersecurity", title: "AI Governance & Cybersecurity", description: "Explore the security and governance practices around enterprise AI." },
  { href: "/products/dci-360", title: "DCI 360", description: "See infrastructure monitoring and operational visibility in context." },
  { href: "/enterprise-ai-solutions", title: "Enterprise AI Solutions", description: "Connect intelligent workflows with wider enterprise needs." },
];
const faqs = [
  { question: "What does ADRS stand for?", answer: "ADRS stands for Autonomous Detection & Response System, a product focused on the path from detection to response." },
  { question: "What stages are shown in the ADRS workflow?", answer: "The conceptual workflow moves through detection, analysis, risk identification, alert and response." },
  { question: "How does ADRS present the operating view?", answer: "It brings the detection-to-response sequence into one clear conceptual view so teams can follow a signal through each stage." },
];

export function ADRS() {
  return (
    <main className="product-page adrs-page">
      <ProductSEO pageKey="adrs" />
      <section className="product-hero adrs-hero">
        <Container className="adrs-hero-layout">
          <div className="adrs-hero-copy">
            <p className="product-eyebrow">DETECTION TO RESPONSE</p>
            <h1>ADRS</h1>
            <p className="product-hero-subtitle">Autonomous Detection<br />&amp; Response System</p>
            <p className="product-hero-intro">Follow detection, analysis and response in one clear security-operations workflow.</p>
            <a className="product-button adrs-button" href="#adrs-workflow">Explore ADRS <ArrowLongRightIcon aria-hidden="true" /></a>
          </div>
          <div className="adrs-hero-visual" role="img" aria-label="Conceptual detection-to-response signal visualization">
            <div className="adrs-radar"><span className="adrs-radar-ring" /><span className="adrs-radar-ring" /><span className="adrs-radar-ring" /><ShieldCheckIcon aria-hidden="true" /><i className="adrs-radar-node node-one" /><i className="adrs-radar-node node-two" /><i className="adrs-radar-node node-three" /></div>
            <div className="adrs-radar-caption">DETECT <span /> ASSESS <span /> RESPOND</div>
          </div>
        </Container>
      </section>
      <section id="adrs-workflow" className="product-section adrs-workflow"><Container><div className="product-section-heading"><div><p className="product-eyebrow">01 / THE WORKFLOW</p><h2>From detection<br />to response.</h2></div><p>A clear sequence for identifying and addressing risk.</p></div><ol className="adrs-flow">{workflow.map(({ name, icon: Icon }, index) => <li key={name}><div className="adrs-flow-top"><span>0{index + 1}</span><Icon aria-hidden="true" /></div><h3>{name}</h3>{index < workflow.length - 1 && <ArrowLongRightIcon className="adrs-flow-arrow" aria-hidden="true" />}</li>)}</ol></Container></section>
      <section className="product-section adrs-visual-section"><Container className="adrs-visual-layout"><div><p className="product-eyebrow">02 / OPERATING VIEW</p><h2>Follow the signal.</h2><p>Detection, analysis and response in one conceptual view of the workflow.</p><span className="product-concept-label">CONCEPTUAL WORKFLOW VISUAL</span></div><div className="adrs-console" role="img" aria-label="Conceptual workflow visual, not an ADRS product screenshot"><div className="adrs-console-header"><strong>ADRS</strong><span>DETECTION / RESPONSE</span><i /></div><div className="adrs-console-track">{workflow.map(({ name }, index) => <div key={name}><span>0{index + 1}</span><strong>{name}</strong><i /></div>)}</div><div className="adrs-console-footer"><span>WORKFLOW VIEW</span><span>CONCEPTUAL</span></div></div></Container></section>
      <ProductRelatedLinks links={relatedLinks} />
      <ProductFAQ title="ADRS questions" intro="A concise view of the detection-to-response workflow." items={faqs} />
      <section className="product-cta adrs-cta"><Container><p className="product-eyebrow">ADRS</p><h2>Explore a clearer path from detection to response.</h2><SectionLink href="/#connect" className="product-button adrs-button">Start a conversation <ArrowLongRightIcon aria-hidden="true" /></SectionLink></Container></section>
      <LatestPerspectives />
    </main>
  );
}
