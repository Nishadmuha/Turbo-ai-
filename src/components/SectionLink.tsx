import { type ReactNode, type MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../content/turboai";

interface SectionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-current"?: "page" | "true" | undefined;
}

export function SectionLink({
  href,
  children,
  className = "",
  onClick,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: SectionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Check if it's an external link
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      onClick?.();
      return;
    }

    // A local hash stays on the current page when that section exists.
    if (href.startsWith("#")) {
      const sectionId = href.slice(1);
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        const headerHeight = tokens.layout.headerH;
        window.scrollTo({ top: targetElement.offsetTop - headerHeight, behavior: "smooth" });
        setTimeout(() => history.pushState(null, "", `${location.pathname}#${sectionId}`), 100);
      } else if (location.pathname !== "/") {
        navigate(`/#${sectionId}`);
      }
      onClick?.();
      return;
    }

    // A root hash explicitly links to a section on the homepage.
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "").replace("#", "");

      // If we are on the home page, scroll to section
      if (location.pathname === "/") {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          const headerHeight = tokens.layout.headerH;
          const targetY = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetY,
            behavior: "smooth",
          });

          // Update URL hash without triggering scroll
          setTimeout(() => {
            history.pushState(null, "", `#${sectionId}`);
          }, 100);
        } else if (sectionId === "hero") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setTimeout(() => {
            history.pushState(null, "", window.location.pathname);
          }, 100);
        }
      } else {
        // If not on home page, navigate to home with hash
        navigate(`/#${sectionId}`);
      }
      onClick?.();
      return;
    } else {
      // It's an internal route (e.g., /industries, /blog)
      navigate(href);
      window.scrollTo(0, 0);
    }

    // Call optional onClick handler
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  );
}
