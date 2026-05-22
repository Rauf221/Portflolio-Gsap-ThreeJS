"use client";

import { type RefObject } from "react";
import { experience } from "../content/site";
import { EXPERIENCE_META } from "../data";

type Props = { experienceRef: RefObject<HTMLElement | null> };

export function ExperienceSection({ experienceRef }: Props) {
  const experiences = EXPERIENCE_META;
  const denom = Math.max(1, experiences.length - 1);

  return (
    <section id="experience" ref={experienceRef} style={{ position: "relative", overflow: "hidden", zIndex: 1 }} className="section-padded">
      <div
        className="section-bg"
        style={{
          position: "absolute",
          inset: "-20%",
          background: "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(155,148,255,0.05) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "5rem" }}>
          <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
          <span className="font-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--sphere)", textTransform: "uppercase" }}>
            {experience.label}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 3rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem", paddingTop: "2rem" }}>
            {experiences
              .filter((_, i) => i % 2 === 0)
              .map((exp) => (
                <div key={exp.key} className="exp-item glass" style={{ padding: "2rem", borderRadius: 20 }}>
                  <div className="font-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--sphere)", marginBottom: "0.75rem" }}>
                    {experience.items[exp.key].period}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    {experience.items[exp.key].role}
                  </h3>
                  <div style={{ fontSize: "0.9rem", color: "var(--indigo)", marginBottom: "1rem", fontFamily: "'Exo 2', sans-serif" }}>
                    {experience.items[exp.key].company}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{experience.items[exp.key].desc}</p>
                </div>
              ))}
          </div>
          <div style={{ position: "relative", alignSelf: "stretch" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(155,148,255,0.1)" }} />
            <div
              className="exp-line-fill"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom, var(--indigo), var(--sphere))",
                transformOrigin: "top center",
              }}
            />
            {experiences.map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${(i / denom) * 85 + 5}%`,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="exp-dot" />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem", paddingTop: "10rem" }}>
            {experiences
              .filter((_, i) => i % 2 !== 0)
              .map((exp) => (
                <div key={exp.key} className="exp-item glass" style={{ padding: "2rem", borderRadius: 20 }}>
                  <div className="font-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--sphere)", marginBottom: "0.75rem" }}>
                    {experience.items[exp.key].period}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    {experience.items[exp.key].role}
                  </h3>
                  <div style={{ fontSize: "0.9rem", color: "var(--indigo)", marginBottom: "1rem", fontFamily: "'Exo 2', sans-serif" }}>
                    {experience.items[exp.key].company}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{experience.items[exp.key].desc}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
