"use client";

import { useState, type ReactNode } from "react";
import { PortfolioCarousel, PortfolioProjectTicket } from "@/components/portfolio-carousel";

export function PortfolioWorkStage({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <>
      <div className="hero-scroll-stage">
        <section className="work-section" aria-labelledby="work-title">
          <div className="page-wrap work-section-content">
            <div className="section-heading work-heading">
              <div>
                <h2 id="work-title">Pick a <em>project.</em></h2>
              </div>
              <p className="section-intro">A few stops across product design: from retail tools and fitness to social experiences and travel platforms.</p>
            </div>
            <div className="work-carousel-entry">
              <PortfolioCarousel onActiveChange={setActiveProject} />
            </div>
          </div>
        </section>
        <div className="hero-slide-layer">
          {children}
          <div className="scallop" aria-hidden="true" />
        </div>
        <span className="hero-scroll-distance-probe" aria-hidden="true" />
        <span className="work-scroll-anchor" id="work" aria-hidden="true" />
      </div>

      <section className="project-detail-section" aria-label="Selected project details">
        <div className="page-wrap">
          <PortfolioProjectTicket projectIndex={activeProject} />
        </div>
      </section>
    </>
  );
}
