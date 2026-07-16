"use client";

import { type RefObject } from "react";
import { hero } from "../content/site";
import { HERO_VISIBLE_HEIGHT } from "../lib/viewport";
import { UnicornHeroBackground } from "./UnicornHeroBackground";

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
        // The Unicorn scene sits absolutely inside this section and stands
        // HERO_VISIBLE_HEIGHT tall once its dead top margin is cropped, so the
        // section must be at least that tall or `overflow: hidden` clips the
        // scene's bottom edge away entirely on shorter viewports. With the
        // floor, the overflow instead falls below the fold and scrolls into
        // view. Taller viewports keep their existing 100vh behaviour.
        minHeight: `max(100vh, ${HERO_VISIBLE_HEIGHT}px)`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <UnicornHeroBackground />

      <div className="hero-fade-bottom" aria-hidden="true" />

      <div ref={heroTextRef} className="hero-minimal" />

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
