"use client";

import { type CSSProperties, type RefObject } from "react";
import { projects as projectsContent } from "../content/site";
import { PROJECTS_META } from "../data";

const PATH_D =
  "M 200 200 " +
  "C 500 200, 600 520, 900 520 " +
  "C 1200 520, 1300 160, 1600 160 " +
  "C 1900 160, 2000 540, 2300 540 " +
  "C 2600 540, 2700 180, 3000 180 " +
  "C 3200 180, 3350 200, 3400 200";
type Props = {
  projectsRef: RefObject<HTMLElement | null>;
};

export function ProjectsSection({ projectsRef }: Props) {
  return (
    <section id="projects" ref={projectsRef} className="projects-section">
      <div className="projects-path-scroll">
        <div className="projects-path-stage">
          <div className="projects-path-label">
            <div className="projects-intro-line" />
            <span className="font-mono">{projectsContent.label}</span>
          </div>

          <h2 className="projects-path-fallback font-display">{projectsContent.pathHeadline}</h2>

          <div className="projects-path-camera">
            <svg
              className="projects-path-svg"
              viewBox="0 0 3200 1000"
              width={3200}
              height={900}
              aria-hidden="true"
            >
              <path
                id="projects-headline-path"
                className="projects-path-curve"
                d={PATH_D}
                fill="none"
                stroke="none"
              />
              <text className="projects-path-text projects-path-text-measure" fill="#f0ede8">
                <textPath
                  className="projects-path-textpath"
                  href="#projects-headline-path"
                  startOffset="0"
                  textAnchor="start"
                >
                  {projectsContent.pathHeadline}
                </textPath>
              </text>
              <g className="projects-path-chars" aria-hidden="true" />
            </svg>
          </div>
        </div>
      </div>

      <div className="projects-after-path">
        <p className="projects-intro-count font-mono">{projectsContent.countLabel(PROJECTS_META.length)}</p>

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
      </div>
    </section>
  );
}
