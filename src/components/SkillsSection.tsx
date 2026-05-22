"use client";

import { type RefObject } from "react";
import { skills } from "../content/site";
import { SKILLS_META } from "../data";
import { splitGraphemes } from "../lib/splitGraphemes";

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
          gap: "3rem",
          willChange: "transform",
          width: "max-content",
          paddingRight: "3rem",
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
        {SKILLS_META.map((skill) => (
          <div
            key={skill.key}
            className="skill-card glass"
            style={{ minWidth: 320, flexShrink: 0, padding: "2rem", borderRadius: 20, position: "relative", overflow: "hidden" }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(155,148,255,0.15) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div
              className="font-mono"
              style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--sphere)", textTransform: "uppercase", marginBottom: "1rem" }}
            >
              {skills.categories[skill.categoryKey]}
            </div>
            <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.2 }}>
              {skills.items[skill.key].name}
            </h3>
            <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{skills.proficiency}</span>
              <span className="font-mono skill-pct" data-val={skill.level} style={{ fontSize: "0.9rem", color: "var(--sphere)" }}>
                0%
              </span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div
                className="skill-bar-fill"
                style={{
                  height: "100%",
                  width: `${skill.level}%`,
                  background: "linear-gradient(90deg, var(--indigo), var(--sphere))",
                  borderRadius: 4,
                  boxShadow: "0 0 10px rgba(155,148,255,0.5)",
                }}
              />
            </div>
          </div>
        ))}
        <div style={{ minWidth: "3rem", flexShrink: 0 }} />
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
