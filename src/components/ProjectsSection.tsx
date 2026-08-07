"use client";

import { type CSSProperties, type RefObject } from "react";
import { projects as projectsContent } from "../content/site";
import { PROJECTS_META } from "../data";

/*
 * The curve the headline is written along: four waves, then a flat run-out.
 * Total arc length ~4015 units — worth re-measuring if you reshape it, since the
 * camera travels `textSpan / pathLength` of the curve (textPathRatio in
 * usePortfolioGsap), so the length is what times how much of the sentence is on
 * screen at once. The other half of that ratio is the headline's font-size, set
 * on .projects-path-text in globalCssString.ts — change either and check both.
 *
 * Each segment's first control point sits at the START anchor's y and the second
 * at the END anchor's y. That is what keeps the tangent horizontal on both sides
 * of every junction, so consecutive waves meet without a visible kink — preserve
 * it when reshaping.
 */
const PATH_D =
  "M 99 200 " +
  "C 560 200, 451 800, 890 800 " +
  "C 1342 800, 1436 169, 1846 169 " +
  "C 2086 169, 2082 476, 2405 476 " +
  "C 2705 476, 2716 183, 3016 183 " +
  "C 3216 183, 3350 183, 3600 183";
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
              viewBox="0 0 3600 1000"
              width={3400}
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
                  {/*
                    Deliberately NOT autoPlay: usePortfolioGsap drives playback off
                    the swap timeline so only the panel on screen (and the one
                    sliding away beside it) is ever decoding. Four 1080p clips
                    looping at once would compete with the Three.js scene and the
                    scrubbed ScrollTriggers for frame budget.

                    muted + playsInline are what make that programmatic play()
                    allowed at all — without them mobile Safari and Chrome refuse
                    it outside a user gesture. preload="metadata" keeps the 43MB
                    off the initial load; the clip streams in when its turn comes.

                    No poster: the accent-tinted parent shows through, so a panel
                    whose clip is missing or still buffering reads as a coloured
                    card rather than a broken element.
                  */}
                  <video
                    className="project-panel-video"
                    src={p.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
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
