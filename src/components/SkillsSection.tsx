"use client";

import { type RefObject } from "react";
import { skills } from "../content/site";
import { SKILLS_META } from "../data";
import { splitGraphemes } from "../lib/splitGraphemes";
import { SkillModelViewer } from "./SkillModelViewer";

type Props = { skillsRef: RefObject<HTMLElement | null> };

export function SkillsSection({ skillsRef }: Props) {
  const line1 = splitGraphemes(skills.headingLine1);
  const lineAccent = splitGraphemes(skills.headingAccent);
  const line2 = splitGraphemes(skills.headingLine2);

  return (
    <section id="skills" ref={skillsRef} style={{ position: "relative", height: "100vh", overflow: "hidden", zIndex: 1 }}>
      <div className="h-section-label">
        <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
        <span className="font-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--sphere)", textTransform: "uppercase" }}>
          {skills.label}
        </span>
      </div>

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

      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "var(--pad-x)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--muted)",
        }}
      >
        <span className="font-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }}>
          {skills.scrollHint}
        </span>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <path d="M0 6h20M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
}
