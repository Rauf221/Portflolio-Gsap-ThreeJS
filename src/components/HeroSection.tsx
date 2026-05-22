"use client";

import { type RefObject } from "react";
import { hero } from "../content/site";
import { scrollToSection } from "../lib/scroll";

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  heroTextRef: RefObject<HTMLDivElement | null>;
};

export function HeroSection({ heroRef, heroTextRef }: Props) {
  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(155,148,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(155,148,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          zIndex: 0,
        }}
      />

      <div
        className="hero-badge"
        style={{ position: "absolute", top: "12%", left: "clamp(2rem, 5vw, 5rem)", zIndex: 3 }}
      >
        <div
          className="glass font-mono"
          style={{
            padding: "0.4rem 1.2rem",
            borderRadius: 100,
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            color: "var(--sphere)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--sphere)",
              display: "inline-block",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          {hero.badge}
        </div>
      </div>

      <div className="hero-grid">
        <div ref={heroTextRef} className="hero-inner">
        <div className="perspective" style={{ overflow: "hidden", marginBottom: "1rem" }}>
          <div className="hero-word overflow-clip">
            {hero.line1.split("").map((c, i) => (
              <span
                key={`l1-${i}`}
                className="font-display"
                style={{
                  display: "inline-block",
                  fontSize: "clamp(4rem, 10vw, 9rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(240,237,232,0.3)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="perspective" style={{ overflow: "hidden", marginBottom: "2rem" }}>
          <div className="hero-word overflow-clip">
            {hero.line2.split("").map((c, i) => (
              <span
                key={`l2-${i}`}
                className="font-display grad-indigo"
                style={{
                  display: "inline-block",
                  fontSize: "clamp(4rem, 10vw, 9rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <p
          className="hero-sub"
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
            color: "var(--muted)",
            maxWidth: 560,
            margin: "0 0 2.5rem",
            lineHeight: 1.7,
          }}
        >
          {hero.subBefore}
          <strong style={{ color: "var(--text)" }}>{hero.subStrong}</strong>
          {hero.subAfter}
        </p>

        <div
          className="hero-cta"
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap" }}
        >
          <a
            href="#projects"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("projects");
            }}
          >
            {hero.ctaWork}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            {hero.ctaTalk}
          </a>
        </div>

        </div>
        <div className="hero-visual" aria-hidden="true" />
      </div>

      <div className="hero-scroll-hint">
        <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.2em" }}>
          {hero.scroll}
        </span>
        <div
          style={{
            width: 1,
            height: 60,
            background: "linear-gradient(to bottom, var(--sphere), transparent)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
