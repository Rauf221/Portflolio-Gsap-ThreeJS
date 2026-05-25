"use client";

import { type CSSProperties, type RefObject } from "react";
import { projects as projectsContent } from "../content/site";
import { PROJECTS_META } from "../data";

type Props = {
  projectsRef: RefObject<HTMLElement | null>;
};

export function ProjectsSection({ projectsRef }: Props) {
  return (
    <section id="projects" ref={projectsRef} className="projects-section">
      <div className="projects-intro">
        <div className="projects-intro-label">
          <div className="projects-intro-line" />
          <span className="font-mono">{projectsContent.label}</span>
        </div>
        <h2 className="projects-intro-headline font-display">
          <span>{projectsContent.headingLine1}</span>
          <span className="grad-indigo">{projectsContent.headingAccent}</span>
          <span>{projectsContent.headingLine2}</span>
        </h2>
        <p className="projects-intro-count font-mono">{projectsContent.countLabel(PROJECTS_META.length)}</p>
      </div>

      <div className="projects-sticky-list">
        {PROJECTS_META.map((p, i) => {
          const item = projectsContent.items[p.key];
          const tags = item.tags.split(",").map((s) => s.trim()).filter(Boolean);
          const reversed = i % 2 !== 0;

          return (
            <article
              key={p.id}
              className="project-panel"
              style={{ zIndex: i + 1, "--panel-accent": p.color } as CSSProperties}
            >
              <div className="project-panel-inner">
                <div
                  className="project-panel-body"
                  style={{ flexDirection: reversed ? "row-reverse" : "row" }}
                >
                  <div className="project-panel-visual">
                    <div className="project-panel-screen">
                      <div className="project-panel-screen-bar">
                        {["#993C1D", "#854F0B", "#3B6D11"].map((c) => (
                          <div key={c} className="project-panel-screen-dot" style={{ background: c }} />
                        ))}
                      </div>
                      <div className="project-panel-screen-body">
                        <div className="project-panel-block project-panel-block-wide" />
                        <div className="project-panel-block" />
                        <div className="project-panel-block" />
                        <div className="project-panel-block project-panel-block-wide project-panel-block-sm" />
                        <div className="project-panel-block project-panel-block-xs" />
                        <div className="project-panel-block project-panel-block-xs project-panel-block-fade" />
                      </div>
                    </div>
                    <span className="project-panel-index font-mono">{String(p.id).padStart(2, "0")}</span>
                  </div>

                  <div className="project-panel-info">
                    <div className="project-panel-meta">
                      <span className="font-mono">{String(p.id).padStart(2, "0")}</span>
                      <div className="project-panel-meta-line" />
                      <span className="project-panel-year font-mono">{p.year}</span>
                    </div>

                    <h3 className="project-panel-title font-display">{item.title}</h3>
                    <p className="project-panel-subtitle">{item.subtitle}</p>
                    <p className="project-panel-desc">{item.desc}</p>

                    <div className="project-panel-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="project-panel-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="project-panel-link">
                      {projectsContent.viewLabel}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
