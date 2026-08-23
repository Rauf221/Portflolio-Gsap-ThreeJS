import { MOBILE_MAX_WIDTH } from "../lib/viewport";
import { WORKS_BASE_CSS, WORKS_CURSOR_CSS } from "./worksTokens";

/*
 * Styles for the /works archive, injected by WorksPage the same way
 * PortfolioStyles injects the home page's sheet. The tokens, page ground and
 * reveal hooks come from worksTokens, which the detail pages share.
 *
 * This file is a JS template literal: no backticks anywhere inside it.
 */
export const WORKS_PAGE_CSS = (WORKS_BASE_CSS + `
.works-root {
  position: relative;
  z-index: 2;
  width: 100%;
  overflow-x: hidden;
}

/* ── top bar ─────────────────────────────────────────────────────────── */
.works-topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1.25rem, 3vh, 2rem) var(--pad-x);
}
.works-back {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--text);
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: none;
}
.works-back-arrow {
  display: inline-block;
  transition: transform 0.45s var(--ease-out);
}
.works-back:hover .works-back-arrow { transform: translateX(-5px); }
.works-back::after {
  content: '';
  position: absolute;
  left: 0; bottom: -6px;
  width: 100%; height: 1px;
  background: var(--indigo);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform 0.5s var(--ease-out);
}
.works-back:hover::after { transform: scaleX(1); transform-origin: 0 50%; }
.works-topbar-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255,248,231,0.55);
  backdrop-filter: blur(8px);
}
.works-topbar-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--indigo);
  animation: works-pulse 2.4s ease-in-out infinite;
}
@keyframes works-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }

/* ── hero: the spiral scene, and nothing else ────────────────────────── */
.works-hero {
  position: relative;
  height: 100svh;
  overflow: hidden;
  /* The column's own light: the scene draws on transparent, so this is what
     gives the panels something to hang in. */
  background:
    radial-gradient(ellipse 60% 55% at 50% 45%, rgba(107,91,203,0.16) 0%, transparent 70%),
    var(--bg);
}
/* The canvas fills the stage. It starts invisible and is faded in by the
   .is-ready class the scene sets on its first painted frame — never by GSAP,
   which would then own the same opacity the fade needs. */
.works-spiral {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.1s var(--ease-out);
}
.works-hero.is-ready .works-spiral { opacity: 1; }
.works-spiral canvas { display: block; width: 100%; height: 100%; }

/*
 * What stands in for the scene: the same posters, fanned across the middle of
 * the stage. It is what a reader without WebGL keeps, and what everyone sees
 * for the moment before the first frame lands.
 */
.works-hero-flat {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1.2vw, 1rem);
  padding: 0 var(--pad-x);
  opacity: 1;
  transition: opacity 0.8s var(--ease-out);
}
.works-hero.is-ready .works-hero-flat { opacity: 0; }
.works-hero-flat-tile {
  position: relative;
  flex: 0 1 clamp(120px, 15vw, 240px);
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 12px;
  background: color-mix(in srgb, var(--flat-accent) 20%, var(--bg2));
}
/* The fan: the middle tile sits upright and its neighbours lean away, which is
   the flat read of the column's curve. */
.works-hero-flat-tile:nth-child(1) { transform: rotate(-7deg) translateY(1.4rem); }
.works-hero-flat-tile:nth-child(2) { transform: rotate(-3deg) translateY(0.5rem); }
.works-hero-flat-tile:nth-child(4) { transform: rotate(3deg) translateY(0.5rem); }
.works-hero-flat-tile:nth-child(5) { transform: rotate(7deg) translateY(1.4rem); }
.works-hero-flat-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── index: sticky rail + grid ───────────────────────────────────────── */
.works-index {
  position: relative;
  display: grid;
  grid-template-columns: minmax(200px, 240px) 1fr;
  gap: clamp(2rem, 4vw, 4rem);
  padding: clamp(3.5rem, 10vh, 7rem) var(--pad-x) clamp(4rem, 12vh, 8rem);
  align-items: start;
}
.works-rail {
  position: sticky;
  top: clamp(2rem, 12vh, 7rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.works-rail-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--line);
}
.works-rail-count {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--indigo);
}
.works-filters {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  list-style: none;
}
.works-filter {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: left;
  cursor: none;
  overflow: hidden;
}
/* Same trick as .project-panel-row-fill: a scaleX wipe rather than a
   background-color transition, so hovering never costs a paint. */
.works-filter-fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: color-mix(in srgb, var(--indigo) 14%, var(--bg));
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.45s var(--ease-out);
}
.works-filter:hover .works-filter-fill { transform: scaleX(1); }
.works-filter.is-active .works-filter-fill {
  transform: scaleX(1);
  background: var(--indigo);
}
.works-filter.is-active { color: #FFF8E7; }
.works-filter-count {
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0.65;
}
.works-rail-note {
  font-size: 0.72rem;
  line-height: 1.6;
  color: var(--muted);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.75rem);
}
.works-empty {
  grid-column: 1 / -1;
  padding: 4rem 0;
  color: var(--muted);
}

/* ── card ────────────────────────────────────────────────────────────── */
.work-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.work-card.is-hidden { display: none; }
/* Bottom-left origin, matching the home panels: the media unfolds out of that
   corner. The frame inside carries the exact reciprocal scale (see
   WORK_MEDIA_PARKED_SCALE in animations/worksArchive.ts) so the footage holds
   its true size while the window opens — change one and change the other. */
.work-card-media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 16px;
  background: color-mix(in srgb, var(--work-accent) 16%, var(--bg2));
  transform-origin: 0% 100%;
  will-change: transform;
  cursor: none;
  text-decoration: none;
  color: inherit;
}
.work-card-frame {
  position: absolute;
  inset: 0;
  transform-origin: 0% 100%;
  will-change: transform;
}
.work-card-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: scale 0.7s var(--ease-out);
}
.work-card-media:hover .work-card-video { scale: 1.04; }
/* A work with no clip yet: the accent-tinted card plus its monogram — a
   composed state rather than a hole where a video should be. */
.work-card-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: color-mix(in srgb, var(--work-accent) 55%, transparent);
}
.work-card-year {
  position: absolute;
  bottom: 14px;
  left: 16px;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 4px 11px;
  border-radius: 20px;
  color: #fff;
  background: rgba(0,0,0,0.42);
  backdrop-filter: blur(6px);
  transition: transform 0.45s var(--ease-out);
}
.work-card-media:hover .work-card-year { transform: translateY(-4px); }
/* The eight-pointed asterisk turns 45deg onto its own alternate points — the
   same glyph and the same turn as the home panels' row icon. */
.work-card-arrow {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--work-accent);
  color: #fff;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.4s var(--ease-out), transform 0.5s var(--ease-out);
}
.work-card-media:hover .work-card-arrow { opacity: 1; transform: scale(1); }
.work-card-media:hover .work-card-arrow svg { transform: rotate(45deg); }
.work-card-arrow svg { transition: transform 0.55s var(--ease-out); }

.work-card-index {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.work-card-num {
  font-size: 1rem;
  font-weight: 700;
  color: var(--work-accent);
}
.work-card-cat {
  position: relative;
  padding-left: 2.4rem;
  color: var(--muted);
}
.work-card-cat::before {
  content: '';
  position: absolute;
  left: 0.6rem; top: 50%;
  width: 1.4rem; height: 1px;
  background: var(--work-accent);
  opacity: 0.55;
}
.work-card-title {
  font-size: clamp(1.35rem, 2vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
/* The title is the card's second route to the same page — a keyboard user
   should not have to tab through an image link to reach a named one. */
.work-card-title-link {
  color: inherit;
  text-decoration: none;
  cursor: none;
  background-image: linear-gradient(var(--work-accent), var(--work-accent));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  transition: background-size 0.5s var(--ease-out);
}
.work-card:hover .work-card-title-link,
.work-card-title-link:focus-visible { background-size: 100% 1px; }
.work-card-subtitle {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--work-accent);
}
.work-card-rule {
  display: block;
  width: 100%;
  height: 1px;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--work-accent), transparent);
}
.work-card-desc {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--muted);
  max-width: 34rem;
}
.work-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
}
.work-tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.42rem 0.7rem;
  border-radius: 8px;
  background: color-mix(in srgb, var(--work-accent) 11%, var(--bg));
  transition: background 0.35s var(--ease-out);
}
.work-card:hover .work-tag { background: color-mix(in srgb, var(--work-accent) 18%, var(--bg)); }

/* ── closing CTA ─────────────────────────────────────────────────────── */
.works-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.5rem, 4vh, 2.5rem);
  padding: clamp(4rem, 12vh, 8rem) var(--pad-x) clamp(5rem, 14vh, 9rem);
  border-top: 1px solid var(--line);
}
.works-cta-title {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.works-btn {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.05rem 1.9rem;
  border-radius: 999px;
  border: 1px solid var(--text);
  color: var(--text);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  overflow: hidden;
  cursor: none;
  transition: color 0.4s var(--ease-out);
}
.works-btn-fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--text);
  transform: scaleY(0);
  transform-origin: 50% 100%;
  transition: transform 0.5s var(--ease-out);
}
.works-btn:hover { color: var(--bg); }
.works-btn:hover .works-btn-fill { transform: scaleY(1); }
.works-btn svg { transition: transform 0.5s var(--ease-out); }
.works-btn:hover svg { transform: translateX(4px); }

/* ── responsive ──────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .works-index { grid-template-columns: 1fr; }
  /* The rail turns into a horizontal chip strip stuck to the top of the
     viewport — the only shape that survives twenty entries on a narrow screen
     without eating half the page. */
  .works-rail {
    top: 0;
    z-index: 4;
    gap: 0.9rem;
    padding: 0.9rem 0;
    background: var(--bg);
  }
  .works-filters {
    flex-direction: row;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 0.25rem;
  }
  .works-filters::-webkit-scrollbar { display: none; }
  .works-filter { width: auto; flex: 0 0 auto; border-radius: 999px; }
  .works-rail-note { display: none; }
}
@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  :root { --pad-x: 1.25rem; }
  body { overflow-x: hidden; }
  .works-grid { grid-template-columns: 1fr; }
  .works-topbar-tag { display: none; }
  .work-card-media { border-radius: 12px; }
  /* Three tiles instead of five: at phone width the outer pair of the fan is
     mostly off the screen anyway. */
  .works-hero-flat-tile:nth-child(1),
  .works-hero-flat-tile:nth-child(5) { display: none; }
  .works-hero-flat-tile { flex-basis: clamp(96px, 26vw, 150px); border-radius: 10px; }
}

/* Reduced motion: the from-tweens are skipped in JS, so nothing here has to
   restore a resting state — only the decorative loops are stopped. */
@media (prefers-reduced-motion: reduce) {
  .works-topbar-dot { animation: none; opacity: 1; }
  /* The scene paints a single still frame under reduced motion, so the stage
     still resolves to the spiral rather than staying on the flat strip. */
  .works-spiral, .works-hero-flat { transition: none; }
  .work-card-video,
  .work-card-year,
  .work-card-arrow,
  .works-btn-fill,
  .works-filter-fill { transition: none; }
}
`+WORKS_CURSOR_CSS).trim();
