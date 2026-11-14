"use client";

import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/projects";

export function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[activeIndex];

  return (
    <div className="selected-work">
      <div className="project-grid" role="group" aria-label="Choose a case study">
        {projects.map((item, index) => (
          <button
            className="project-card"
            key={item.name}
            type="button"
            aria-pressed={activeIndex === index}
            aria-label={"Show details for " + item.name}
            onClick={() => setActiveIndex(index)}
          >
            <span className="project-card-image" style={{ backgroundColor: item.color }}>
              <Image
                src={item.image}
                alt={item.alt}
                width={item.imageWidth}
                height={item.imageHeight}
                sizes="(max-width: 470px) 100vw, (max-width: 900px) 50vw, 560px"
              />
            </span>
            <span className="project-card-copy">
              <span className="project-card-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.category}</span>
              </span>
              <span className="project-card-title">
                {item.name}
                <span aria-hidden="true">↗</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <article className="project-detail" aria-live="polite" aria-labelledby="active-project-title">
        <div className="project-detail-main">
          <p className="project-detail-meta">
            Case study {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            <span>·</span>
            {project.category}
          </p>
          <h3 id="active-project-title">{project.name}</h3>
          <p className="project-detail-summary">{project.summary}</p>
          <ul className="project-highlights">
            {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
          <a className="project-link" href="#contact">
            Discuss this project <span aria-hidden="true">↗</span>
          </a>
        </div>

        <aside className="project-facts" aria-label={project.name + " project details"}>
          <dl>
            <div>
              <dt>Role</dt>
              <dd>UI/UX Designer</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{project.focus}</dd>
            </div>
            <div>
              <dt>Tools and methods</dt>
              <dd>
                <ul className="project-tools">
                  {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
      </article>
    </div>
  );
}
