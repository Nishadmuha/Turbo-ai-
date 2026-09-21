import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { AITransformation } from "./pages/AITransformation";
import { StrategicIntelligence } from "./pages/StrategicIntelligence";
import { RemoteInfrastructureManagement } from "./pages/RemoteInfrastructureManagement";
import { DigitalArchitecture } from "./pages/DigitalArchitecture";
import { CyberSecuritySolutions } from "./pages/CyberSecuritySolutions";
import { AIDataInsights } from "./pages/AIDataInsights";
import { CloudSolutions } from "./pages/CloudSolutions";
import { QualityEngineering } from "./pages/QualityEngineering";
import { Industries } from "./pages/Industries";
import { GenerativeAgenticAI } from "./pages/GenerativeAgenticAI";
import { DataEngineeringAIFoundations } from "./pages/DataEngineeringAIFoundations";
import { AIEngineeringSoftwareDevelopment } from "./pages/AIEngineeringSoftwareDevelopment";
import { AIGovernanceCybersecurity } from "./pages/AIGovernanceCybersecurity";
import { CloudInfrastructureAICompute } from "./pages/CloudInfrastructureAICompute";
import { IndustriesWeServe } from "./pages/IndustriesWeServe";
import { IndustryDetail } from "./pages/IndustryDetail";
import { EnterpriseAISolutions } from "./pages/EnterpriseAISolutions";
import { ProductsIndex } from "./pages/ProductsIndex";
import { DCI360 } from "./pages/DCI360";
import { ILakehouse } from "./pages/ILakehouse";
import { ADRS } from "./pages/ADRS";
import { AboutTurboAI } from "./pages/AboutTurboAI";
import { BlogList } from "./pages/BlogList";
import { BlogPost } from "./pages/BlogPost";
import { tokens } from "./content/turboai";

function App() {
  const { pathname, hash } = useLocation();

  // Handle scroll to hash on route change
  useEffect(() => {
    // If there is a hash, scroll to it
    if (hash) {
      const sectionId = hash.replace("#", "");
      const scrollToSection = () => {
        if (sectionId === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = tokens.layout.headerH;
          const targetY = element.offsetTop - headerHeight;
          window.scrollTo({
            top: targetY,
            behavior: "smooth",
          });
        }
      };

      // Slight delay to ensure content is rendered
      const timer1 = setTimeout(scrollToSection, 100);
      const timer2 = setTimeout(scrollToSection, 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // If no hash and path changed, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-transformation" element={<AITransformation />} />
        <Route path="/strategic-intelligence" element={<StrategicIntelligence />} />
        <Route path="/digital-architecture" element={<DigitalArchitecture />} />
        <Route path="/remote-infrastructure-management" element={<RemoteInfrastructureManagement />} />
        <Route path="/cyber-security-solutions" element={<CyberSecuritySolutions />} />
        <Route path="/ai-data-insights" element={<AIDataInsights />} />
        <Route path="/cloud-solutions" element={<CloudSolutions />} />
        <Route path="/quality-engineering" element={<QualityEngineering />} />
        <Route path="/generative-ai-agentic-ai" element={<GenerativeAgenticAI />} />
        <Route path="/data-engineering-ai-foundations" element={<DataEngineeringAIFoundations />} />
        <Route path="/ai-engineering-software-development" element={<AIEngineeringSoftwareDevelopment />} />
        <Route path="/ai-governance-cybersecurity" element={<AIGovernanceCybersecurity />} />
        <Route path="/cloud-infrastructure-ai-compute" element={<CloudInfrastructureAICompute />} />
        <Route path="/industries-we-serve" element={<IndustriesWeServe />} />
        <Route path="/enterprise-ai-solutions" element={<EnterpriseAISolutions />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/dci-360" element={<DCI360 />} />
        <Route path="/products/i-lakehouse" element={<ILakehouse />} />
        <Route path="/products/adrs" element={<ADRS />} />
        <Route path="/about" element={<AboutTurboAI />} />
        <Route path="/industries" element={<Navigate to="/industries/energy" replace />} />
        <Route path="/industries/energy" element={<Industries />} />
        <Route path="/industries/:slug" element={<IndustryDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
