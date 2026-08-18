"use client";

import dynamic from "next/dynamic";
import { type RefObject } from "react";
import { metadata as siteMetadata } from "../content/site";
import { DESKTOP_REFERENCE_HEIGHT } from "../lib/viewport";
import { HeroOverlay } from "./HeroOverlay";

/* The UnicornStudio SDK bundled into unicornstudio-react is ~1.4 MB — imported
 * statically it was the bulk of the page's hydration-blocking JS. Loaded
 * lazily it arrives while the preloader still covers the screen, so the scene
 * is in place before the reveal; ssr:false because the SDK reads the DOM and
 * devicePixelRatio at construction time (same treatment as SkillModelViewer
 * and the hall atmosphere). */
const UnicornHeroBackground = dynamic(
  () => import("./UnicornHeroBackground").then((m) => m.UnicornHeroBackground),
  { ssr: false },
);

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  heroUiRef: RefObject<HTMLDivElement | null>;
  activeSection: string;
};

export function HeroSection({ heroRef, heroUiRef, activeSection }: Props) {
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
        // Solid backdrop behind the scene. The hero is the one dark section on
        // the page (the overlay layer below is white-on-dark), so this is the
        // hero-scoped dark token, not the cream page --bg.
        background: "var(--hero-bg)",
      }}
    >
      {/* The page's only h1 — visually the hero speaks through the overlay
          statement, so the document heading is screen-reader-only. Every
          section heading below is an h2, so the hierarchy starts here. */}
      <h1 className="sr-only">{siteMetadata.title}</h1>

      <div className="hero-parallax" style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        <UnicornHeroBackground />
      </div>

      {/* Darkens + grains the Unicorn scene so the white overlay text reads
          against it at every point of the image. */}
      <div className="hero-scrim" aria-hidden="true" />

      <HeroOverlay heroUiRef={heroUiRef} activeSection={activeSection} />
    </section>
  );
}
