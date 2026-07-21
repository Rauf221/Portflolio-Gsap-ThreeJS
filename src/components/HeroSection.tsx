"use client";

import { type RefObject } from "react";
import { hero } from "../content/site";
import { splitGraphemes } from "../lib/splitGraphemes";
import { DESKTOP_REFERENCE_HEIGHT } from "../lib/viewport";
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
        // The Unicorn scene box is a fixed DESKTOP_REFERENCE_HEIGHT tall and
        // bottom-anchored inside this section. Sizing the section to
        // min(100vh, DESKTOP_REFERENCE_HEIGHT) means: on short viewports it
        // equals 100vh and `overflow: hidden` crops the scene's dead top space
        // so the viewport fills with no scroll; on tall viewports it stops at
        // the scene's bottom so the next section starts immediately with no
        // empty backdrop below. All hero children are absolutely positioned, so
        // the section's actual height equals this minHeight.
        //
        // The cap is multiplied by --hero-zoom-scale (published by
        // UnicornHeroBackground, the same factor its scale() uses) so the top
        // crop stays put under zoom-out instead of jumping. Fallback 1 = plain
        // min(100vh, 900px) before the variable is set (SSR / first paint).
        minHeight: `min(100vh, calc(${DESKTOP_REFERENCE_HEIGHT}px * var(--hero-zoom-scale, 1)))`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 0,
        // Solid page background behind the scene: when the parallax lifts the
        // image, the gap it leaves matches About's background seamlessly.
        background: "var(--bg)",
      }}
    >
      <div className="hero-parallax" style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        <UnicornHeroBackground />
      </div>

      <div className="hero-fade-bottom" aria-hidden="true" />

      <div ref={heroTextRef} className="hero-minimal">
        <div className="hero-word hero-word--code font-display overflow-clip">
          <span>{hero.wordLeft}</span>
        </div>
        <div className="hero-word hero-word--has font-display overflow-clip">
          <span>{hero.wordRight}</span>
        </div>
        <div className="hero-word hero-word--iden-left font-display overflow-clip">
          {splitGraphemes(hero.wordIdenLeft).map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>
        <div className="hero-word hero-word--iden-right font-display overflow-clip">
          {splitGraphemes(hero.wordIdenRight).map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
