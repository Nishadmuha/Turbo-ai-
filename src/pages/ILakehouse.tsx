import { ArrowLongRightIcon, CloudIcon, CircleStackIcon, CpuChipIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Container } from "../components/Container";
import { LatestPerspectives } from "../components/EnterprisePage";
import { ProductFAQ, ProductRelatedLinks, ProductSEO } from "../components/ProductSEOSections";
import { SectionLink } from "../components/SectionLink";
import "./products.css";
import "./products-theme.css";

const environments = ["Cloud", "Hybrid", "On-premise", "Edge"];
const standards = ["Apache Iceberg", "Delta Lake", "Hudi"];
const foundations = [
  { icon: CircleStackIcon, name: "DataOps", detail: "Bring data operations together." },
  { icon: CpuChipIcon, name: "AI / ML", detail: "Connect data to intelligent workloads." },
  { icon: ShieldCheckIcon, name: "Governance", detail: "Keep control close to the data." },
];
const relatedLinks = [
  { href: "/data-engineering-ai-foundations", title: "Data Engineering & AI Foundations", description: "Build the data pipelines and foundations behind intelligent workloads." },
  { href: "/cloud-infrastructure-ai-compute", title: "Cloud Infrastructure & AI Compute", description: "Connect data platforms to flexible enterprise infrastructure." },
  { href: "/products/dci-360", title: "DCI 360", description: "See how infrastructure teams monitor data center operations." },
];
const faqs = [
  { question: "What is i-Lakehouse?", answer: "i-Lakehouse is a hybrid-native data platform that brings DataOps, AI/ML and cloud workloads into one connected foundation." },
  { question: "Where can i-Lakehouse operate?", answer: "i-Lakehouse supports cloud, hybrid, on-premise and edge environments." },
  { question: "Which open data formats are included?", answer: "Its open data foundation highlights Apache Iceberg, Delta Lake and Hudi, alongside security, lineage and compliance controls." },
];

export function ILakehouse() {
  return (
    <main className="product-page lake-page">
      <ProductSEO pageKey="iLakehouse" />
      <section className="product-hero lake-hero"><Container className="lake-hero-layout"><div className="lake-hero-copy"><p className="product-eyebrow">HYBRID-NATIVE DATA PLATFORM</p><h1>i-Lakehouse</h1><p className="product-hero-subtitle">The Hybrid-Native<br />Intelligent Data Platform</p><p className="product-hero-intro">Connect DataOps, AI/ML and governed data across cloud, on-premise and edge.</p><a className="product-button lake-button" href="#lake-intelligence">Explore the platform <ArrowLongRightIcon aria-hidden="true" /></a></div><div className="lake-hero-visual" role="img" aria-label="Conceptual data flow connecting Data, AI and Cloud with cloud, on-premise and edge environments"><div className="lake-visual-kicker">ONE CONNECTED FOUNDATION</div><div className="lake-hero-nodes"><div><CircleStackIcon aria-hidden="true" /><strong>DATA</strong></div><span className="lake-connector" /><div><CpuChipIcon aria-hidden="true" /><strong>AI</strong></div><span className="lake-connector" /><div><CloudIcon aria-hidden="true" /><strong>CLOUD</strong></div></div><div className="lake-hero-orbit"><span>ON-PREMISE</span><i /><span>HYBRID</span><i /><span>EDGE</span></div></div></Container><div className="lake-hero-rule" /></section>
      <section id="lake-intelligence" className="product-section lake-intelligence"><Container><div className="product-section-intro"><p className="product-eyebrow">01 / UNIFIED INTELLIGENCE</p><h2>Data, AI and cloud.<br /><span>Working as one.</span></h2></div><div className="lake-equation"><span>DATA</span><b>+</b><span>AI / ML</span><b>+</b><span>CLOUD</span><ArrowLongRightIcon aria-hidden="true" /><strong>INTELLIGENCE</strong></div></Container></section>
      <section className="product-section lake-deploy"><Container><div className="product-section-heading"><div><p className="product-eyebrow">02 / DEPLOY ANYWHERE</p><h2>Built for your environment.</h2></div><p>Cloud, hybrid, on-premise and edge.</p></div><div className="lake-deploy-map"><div className="lake-platform">i-Lakehouse <span>ONE PLATFORM</span></div><div className="lake-deploy-lines" aria-hidden="true" /><div className="lake-environments">{environments.map((environment, index) => <div key={environment}><span>0{index + 1}</span><strong>{environment}</strong></div>)}</div></div></Container></section>
      <section className="product-section lake-open"><Container className="lake-open-layout"><div><p className="product-eyebrow">03 / OPEN DATA FOUNDATION</p><h2>Choice stays open.</h2><p>Open standards support a flexible data foundation and reduce vendor lock-in.</p></div><div className="lake-standard-list">{standards.map((standard, index) => <div key={standard}><span>0{index + 1}</span><strong>{standard}</strong><ArrowLongRightIcon aria-hidden="true" /></div>)}</div></Container></section>
      <section className="product-section lake-realtime"><Container><div className="product-section-heading"><div><p className="product-eyebrow">04 / REAL-TIME INTELLIGENCE</p><h2>From streams to insight.</h2></div><p>Streaming and analytics technologies in one ecosystem.</p></div><div className="lake-stream" aria-label="Conceptual technology flow: Kafka, streaming, Spark/Flink/Trino, analytics and AI"><span>Kafka</span><ArrowLongRightIcon aria-hidden="true" /><span>Streaming</span><ArrowLongRightIcon aria-hidden="true" /><span>Spark / Flink / Trino</span><ArrowLongRightIcon aria-hidden="true" /><strong>Analytics / AI</strong></div><p className="product-concept-label">CONCEPTUAL TECHNOLOGY FLOW</p></Container></section>
      <section className="product-section lake-foundations"><Container><p className="product-eyebrow">05 / THE OPERATING FOUNDATION</p><h2>Built for enterprise data work.</h2><div className="lake-foundation-grid">{foundations.map(({ icon: Icon, name, detail }) => <article key={name}><Icon aria-hidden="true" /><h3>{name}</h3><p>{detail}</p></article>)}</div></Container></section>
      <section className="product-section lake-trust"><Container className="lake-trust-layout"><div><p className="product-eyebrow">06 / TRUST BY DESIGN</p><h2>Know where data goes.<br /><span>Keep it governed.</span></h2></div><div className="lake-trust-visual"><div>SECURITY</div><span /><div>LINEAGE</div><span /><div>COMPLIANCE</div></div></Container></section>
      <ProductRelatedLinks links={relatedLinks} />
      <ProductFAQ title="i-Lakehouse questions" intro="The essentials of its hybrid-native, open data approach." items={faqs} />
      <section className="product-cta lake-cta"><Container><p className="product-eyebrow">i-LAKEHOUSE</p><h2>Bring your data and AI together.</h2><SectionLink href="/#connect" className="product-button lake-button">Start a conversation <ArrowLongRightIcon aria-hidden="true" /></SectionLink></Container></section>
      <LatestPerspectives />
    </main>
  );
}
