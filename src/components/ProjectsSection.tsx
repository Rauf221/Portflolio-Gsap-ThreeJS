"use client";

import { type RefObject } from "react";
import { projects as projectsContent } from "../content/site";
import { PROJECTS_META } from "../data";

type Props = {
  projectsRef: RefObject<HTMLElement | null>;
  projectsTrackRef: RefObject<HTMLDivElement | null>;
};

export function ProjectsSection({ projectsRef, projectsTrackRef }: Props) {
  const n = PROJECTS_META.length;

  return (
    <section id="projects" ref={projectsRef} style={{ position: "relative", height: "100vh", overflow: "hidden", zIndex: 1 }}>
      <div className="h-section-label">
        <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
        <span className="font-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--sphere)", textTransform: "uppercase" }}>
          {projectsContent.label}
        </span>
      </div>
      <div style={{ position: "absolute", top: "4rem", right: "var(--pad-x)", zIndex: 10 }}>
        <span className="font-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--muted)" }}>
          {projectsContent.countLabel(n)}
        </span>
      </div>

      <div
        ref={projectsTrackRef}
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          alignItems: "center",
          gap: "2.5rem",
          willChange: "transform",
          width: "max-content",
          paddingLeft: "var(--pad-x)",
          paddingRight: "3rem",
        }}
      >
        <div style={{ minWidth: "clamp(360px, 40vw, 560px)", flexShrink: 0, padding: "2rem 1rem" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
            <span style={{ display: "block" }}>{projectsContent.headingLine1}</span>
            <span className="grad-indigo" style={{ display: "block" }}>
              {projectsContent.headingAccent}
            </span>
            <span style={{ display: "block" }}>{projectsContent.headingLine2}</span>
          </h2>
          <div style={{ marginTop: "2rem", height: 1, width: 60, background: "var(--sphere)" }} />
        </div>
        {PROJECTS_META.map((p, i) => {
          const item = projectsContent.items[p.key];
          const tags = item.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          return (
            <div
              key={p.id}
              className="project-card"
              style={{
                minWidth: 380,
                flexShrink: 0,
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                height: "65vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${p.color}18 0%, rgba(8,8,16,0.8) 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      background: `${p.color}22`,
                      border: `1px solid ${p.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: "1.5rem", color: p.color }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
                    {projectsContent.screenshotLabel}
                  </span>
                </div>
                <div
                  className="project-img-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.8) 100%)",
                    transition: "opacity 0.4s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    background: "rgba(8,8,16,0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 100,
                    padding: "0.3rem 0.75rem",
                  }}
                >
                  <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                    {p.year}
                  </span>
                </div>
              </div>
              <div style={{ padding: "1.75rem", background: "rgba(8,8,16,0.6)", backdropFilter: "blur(20px)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: p.color, fontFamily: "'Exo 2', sans-serif" }}>
                      {item.subtitle}
                    </p>
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: `1px solid ${p.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: p.color,
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: `${p.color}14`,
                        border: `1px solid ${p.color}30`,
                        color: p.color,
                        fontSize: "0.7rem",
                        fontFamily: "'Exo 2', sans-serif",
                        padding: "0.25rem 0.7rem",
                        borderRadius: 100,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ minWidth: "3rem", flexShrink: 0 }} />
      </div>
    </section>
  );
}
