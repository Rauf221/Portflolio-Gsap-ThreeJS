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
              <text className="projects-path-text projects-path-text-measure" fill="#25212C">
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

        {/* The scroll wrapper supplies the distance; the stage inside it is
            CSS-sticky. Deliberately NOT a GSAP pin — .projects-after-path
            carries margin-top:-100vh and already sits under the path pin, and
            adding a second pin-spacer into that context makes ScrollTrigger's
            start/end measurements unstable. */}
        <div
          className="projects-stage-scroll"
          style={{ "--swaps": PROJECTS_META.length - 1 } as CSSProperties}
        >
        <div className="projects-sticky-list">
        {PROJECTS_META.map((p, i) => {
          const item = projectsContent.items[p.key];
          const tags = item.tags.split(",").map((s) => s.trim()).filter(Boolean);

          return (
            <article
              key={p.id}
              className="project-panel"
              style={{ zIndex: i + 1, "--panel-accent": p.color } as CSSProperties}
            >
              <div className="project-panel-inner">
                <div className="project-panel-media">
                  {/* Plain <img>: the accent-tinted parent shows through, so a project
                      whose image file isn't in place yet reads as a coloured panel
                      instead of a broken-image icon. */}
                  <img
                    className="project-panel-img"
                    src={p.image}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="project-panel-year font-mono">{p.year}</span>
                </div>

                <div className="project-panel-info">
                  <h3 className="project-panel-title font-display">{item.title}</h3>
                  <p className="project-panel-desc">{item.desc}</p>

                  <ul className="project-panel-rows">
                    {tags.map((tag) => (
                      <li key={tag} className="project-panel-row">
                        <span className="project-panel-row-label">{tag}</span>
                        <span className="project-panel-row-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />
                          </svg>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="project-panel-footer font-mono">
                    <span className="project-panel-footer-label">{projectsContent.label}</span>
                    <span className="project-panel-footer-count">
                      {String(p.id).padStart(2, "0")}
                      <span>/{String(PROJECTS_META.length).padStart(2, "0")}</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        </div>
        </div>
      </div>
    </section>
  );
}
