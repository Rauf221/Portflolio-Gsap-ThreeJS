"use client";

import { type RefObject } from "react";
import { about } from "../content/site";

type Props = { aboutRef: RefObject<HTMLElement | null> };

export function AboutSection({ aboutRef }: Props) {
  const headlineWords = about.headline.split("|");
  const stats = [
    { num: about.stats.projects.num, label: about.stats.projects.label },
    { num: about.stats.stack.num, label: about.stats.stack.label },
    { num: about.stats.langs.num, label: about.stats.langs.label },
  ] as const;

  return (
    <section id="about" ref={aboutRef} style={{ position: "relative", overflow: "hidden", zIndex: 1 }} className="section-padded">
      <div
        className="section-bg"
        style={{
          position: "absolute",
          inset: "-20%",
          background: "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(155,148,255,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <div
              className="about-label font-mono"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: "var(--sphere)",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                clipPath: "inset(0 0 0 0)",
              }}
            >
              <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
              {about.label}
            </div>
            <div className="perspective" style={{ marginBottom: "2rem" }}>
              {headlineWords.map((w, i) => (
                <span key={i} className="about-headline overflow-clip" style={{ display: "inline-block", marginRight: "0.3em" }}>
                  <span
                    className={`font-display ${i >= 3 ? "grad-indigo" : ""}`}
                    style={{
                      display: "inline-block",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.2,
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </div>
            <div className="about-body">
              <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.25rem", fontSize: "1.05rem" }}>
                {about.body1}
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>{about.body2}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "3rem" }}>
              {stats.map(({ num, label }) => (
                <div key={label} className="about-stat glass" style={{ padding: "1.5rem", borderRadius: 16, textAlign: "center" }}>
                  <div className="font-display grad-indigo" style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginTop: "0.4rem",
                      fontFamily: "'Exo 2', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div className="about-img" style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4/5" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, rgba(155,148,255,0.2) 0%, rgba(108,99,255,0.1) 50%, rgba(255,107,107,0.1) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(155,148,255,0.2)",
                }}
              >
                <svg width="220" height="280" viewBox="0 0 220 280" style={{ opacity: 0.6 }}>
                  <circle cx="110" cy="90" r="55" fill="none" stroke="#9b94ff" strokeWidth="1" />
                  <circle cx="110" cy="90" r="40" fill="rgba(155,148,255,0.15)" />
                  <path d="M30 260 Q110 160 190 260" fill="rgba(155,148,255,0.1)" stroke="#9b94ff" strokeWidth="1" />
                  <circle cx="110" cy="85" r="18" fill="rgba(155,148,255,0.2)" />
                </svg>
                <span className="font-mono" style={{ color: "var(--muted)", fontSize: "0.7rem", marginTop: "1rem", letterSpacing: "0.1em" }}>
                  {about.photoLabel}
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(8,8,16,0.6) 0%, transparent 50%)",
                }}
              />
            </div>
            <div
              className="about-badge glass glow-sphere"
              style={{ position: "absolute", bottom: "2rem", left: "-2rem", padding: "1rem 1.5rem", borderRadius: 16 }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  fontFamily: "'Exo 2', sans-serif",
                  marginBottom: "0.25rem",
                }}
              >
                {about.currentLabel}
              </div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: "1rem" }}>
                {about.currentCompany}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
