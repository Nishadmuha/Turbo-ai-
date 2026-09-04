import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { AITransformation } from "./pages/AITransformation";
import { StrategicIntelligence } from "./pages/StrategicIntelligence";
import { RemoteInfrastructureManagement } from "./pages/RemoteInfrastructureManagement";
import { DigitalArchitecture } from "./pages/DigitalArchitecture";
import { CyberSecuritySolutions } from "./pages/CyberSecuritySolutions";
import { AIDataInsights } from "./pages/AIDataInsights";
import { OffshoreDevelopment } from "./pages/OffshoreDevelopment";
import { CloudSolutions } from "./pages/CloudSolutions";
import { QualityEngineering } from "./pages/QualityEngineering";
import { Industries } from "./pages/Industries";
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
        <Route path="/offshore-development" element={<OffshoreDevelopment />} />
        <Route path="/cloud-solutions" element={<CloudSolutions />} />
        <Route path="/quality-engineering" element={<QualityEngineering />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/industries/energy" element={<Industries />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
