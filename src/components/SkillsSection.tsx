"use client";

import { type RefObject } from "react";
import dynamic from "next/dynamic";
import { skills } from "../content/site";
import { SKILLS_META } from "../data/portfolioMeta";
import { splitGraphemes } from "../lib/splitGraphemes";

// three + GLTFLoader are heavy; keep them out of the initial bundle. The host
// tile keeps its fixed CSS size, so layout/ScrollTrigger measurements are
// unchanged whether the canvas has mounted yet or not.
const SkillModelViewer = dynamic(
  () => import("./SkillModelViewer").then((m) => m.SkillModelViewer),
  { ssr: false },
);

type Props = { skillsRef: RefObject<HTMLElement | null> };

export function SkillsSection({ skillsRef }: Props) {
  const line1 = splitGraphemes(skills.headingLine1);
  const lineAccent = splitGraphemes(skills.headingAccent);
  const line2 = splitGraphemes(skills.headingLine2);

  return (
    // svh so the pinned stage matches what is actually visible on mobile
    // rather than reaching under the URL bar.
    <section id="skills" ref={skillsRef} style={{ position: "relative", height: "100svh", overflow: "hidden", zIndex: 1 }}>
      <div
        className="skills-track"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          alignItems: "center",
          gap: 0,
          willChange: "transform",
          width: "max-content",
        }}
      >
        <div className="skills-headline-stage">
          <h2 className="skills-headline font-display">
            {line1.map((c, i) => (
              <span key={`h1-${i}`} className="skills-headline-char-wrap">
                <span className="skills-headline-char">{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
            <span className="skills-headline-char-wrap">
              <span className="skills-headline-char">&nbsp;</span>
            </span>
            {lineAccent.map((c, i) => (
              <span key={`ha-${i}`} className="skills-headline-char-wrap">
                <span className="skills-headline-char grad-indigo">{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
            {line2.map((c, i) => (
              <span key={`h2-${i}`} className="skills-headline-char-wrap">
                <span className="skills-headline-char">{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="skills-carousel-stage" aria-hidden="true">
        <div className="skills-carousel-name-list">
          {SKILLS_META.map((skill) => (
            <div key={skill.key} className="skills-carousel-name-row">
              {skills.items[skill.key].name}
            </div>
          ))}
        </div>
        <div className="skills-icon-track">
          {SKILLS_META.map((skill) => (
            <div key={skill.key} className="skills-icon-item">
              <div className="skills-icon-tile">
                <SkillModelViewer
                  modelPath={skill.modelPath}
                  modelTune={"modelTune" in skill ? skill.modelTune : undefined}
                  className="skills-icon-model-host"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
