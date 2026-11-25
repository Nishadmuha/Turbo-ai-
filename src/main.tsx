import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

// This app mounts with createRoot rather than hydrating its static snapshots.
// Remove only page-owned head tags before React 19 takes ownership; otherwise a
// saved homepage fallback can leave stale titles/canonicals beside the new route.
document.head.querySelectorAll(
  'title, meta[name="description"], meta[name="robots"], meta[name="googlebot"], meta[name="keywords"], meta[property^="og:"], meta[property^="twitter:"], meta[property^="article:"], link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]'
).forEach((element) => element.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
import { unregisterSW } from "./unregisterSW";

unregisterSW();
