"use client";

import { useEffect, useRef, type RefObject } from "react";
import { hero } from "../content/site";
import { UnicornHeroBackground } from "./UnicornHeroBackground";

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  heroTextRef: RefObject<HTMLDivElement | null>;
};

export function HeroSection({ heroRef, heroTextRef }: Props) {
  const glowRef = useRef<HTMLDivElement>(null);

  // Lightweight, self-contained mouse parallax (independent of GSAP load order).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      glow.style.transform = `translate3d(${curX * 40}px, ${curY * 40}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

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
      <UnicornHeroBackground />

      <div className="hero-parallax-glow" aria-hidden="true">
        <div ref={glowRef} className="hero-parallax-glow-inner" />
      </div>
      <div className="hero-fade-bottom" aria-hidden="true" />

      <div ref={heroTextRef} className="hero-minimal">
        <div className="hero-badge">
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
