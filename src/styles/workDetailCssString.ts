import { MOBILE_MAX_WIDTH } from "../lib/viewport";
import { WORKS_BASE_CSS, WORKS_CURSOR_CSS } from "./worksTokens";

/*
 * Styles for a project detail page (/works/[slug]). Shares its ground and
 * reveal hooks with the archive via worksTokens.
 *
 * This file is a JS template literal: no backticks anywhere inside it.
 */
export const WORK_DETAIL_CSS = (WORKS_BASE_CSS + `
.wd-root {
  position: relative;
  z-index: 2;
  width: 100%;
  overflow-x: hidden;
  /* Every accent on the page reads from this, set inline per project, so one
     value re-tints the hero, the chapter numbers and the next-project panel. */
  --accent: var(--indigo);
}

/* ── sticky top bar ──────────────────────────────────────────────────── */
.wd-topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(0.9rem, 2.2vh, 1.4rem) var(--pad-x);
  background: linear-gradient(180deg, rgba(255,248,231,0.92), rgba(255,248,231,0));
  backdrop-filter: blur(6px);
  pointer-events: none;
}
.wd-topbar > * { pointer-events: auto; }
.wd-back {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text);
  text-decoration: none;
  cursor: none;
}
.wd-back-arrow { display: inline-block; transition: transform 0.45s var(--ease-out); }
.wd-back:hover .wd-back-arrow { transform: translateX(-5px); }
.wd-topbar-name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── hero ────────────────────────────────────────────────────────────── */
.wd-hero {
  position: relative;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 var(--pad-x) clamp(2.5rem, 7vh, 4.5rem);
  overflow: hidden;
}
/*
 * The poster starts full-bleed and is closed into a rounded card as the reader
 * scrolls (the clip-path inset is scrubbed in animations/workDetail.ts) — the
 * dossier shutting behind them. The image itself scales in the same tween, so
 * the crop never reveals empty ground at the edges.
 */
.wd-hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  /* The open state is written explicitly, with a round() term, because a
     clip-path only interpolates against a shape of the same kind — animating
     from none to an inset would snap instead of close. */
  clip-path: inset(0% round 0px);
  will-change: clip-path;
}
.wd-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  will-change: transform;
}
/* Without a scrim the title sits on whatever the screenshot happens to be. */
.wd-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(37,33,44,0.42) 0%, rgba(37,33,44,0.10) 34%, rgba(37,33,44,0.86) 100%),
    radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--accent) 42%, transparent), transparent 70%);
}
/* A work with no poster still needs a hero: the accent field carries it. */
.wd-hero--bare .wd-hero-media {
  background: linear-gradient(150deg, color-mix(in srgb, var(--accent) 78%, #000), var(--text));
}
/* The year, set as an outline the width of the screen — the page's biggest
   piece of type, and the only one that is purely graphic. */
.wd-hero-year {
  position: absolute;
  left: 50%;
  bottom: 20%;
  z-index: 1;
  transform: translateX(-50%);
  font-size: clamp(7rem, 30vw, 26rem);
  font-weight: 800;
  line-height: 0.8;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,248,231,0.30);
  pointer-events: none;
  white-space: nowrap;
}
.wd-hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: clamp(0.9rem, 2.4vh, 1.6rem);
  color: #FFF8E7;
}
.wd-title {
  font-size: clamp(2.4rem, 7.5vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
  max-width: 18ch;
}
.wd-tagline {
  max-width: 40rem;
  font-size: clamp(1rem, 1.5vw, 1.35rem);
  line-height: 1.5;
  color: rgba(255,248,231,0.82);
}
.wd-hero-cue {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: clamp(0.5rem, 2vh, 1.5rem);
  color: rgba(255,248,231,0.65);
}
.wd-hero-cue span {
  width: clamp(2.5rem, 5vw, 4rem);
  height: 1px;
  background: rgba(255,248,231,0.5);
  transform-origin: 0 50%;
  animation: wd-cue 2.6s var(--ease-out) infinite;
}
@keyframes wd-cue {
  0% { transform: scaleX(0); opacity: 0; }
  40% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

/* ── fact strip ──────────────────────────────────────────────────────── */
/* auto-fit, not a fixed four: the visit column only exists for works with a
   live site, and the remaining facts should close ranks rather than leave a
   hole where it would have been. */
.wd-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
  gap: clamp(1.25rem, 3vw, 2.5rem);
  padding: clamp(2.5rem, 7vh, 4.5rem) var(--pad-x);
  border-bottom: 1px solid var(--line);
}
.wd-fact { display: flex; flex-direction: column; gap: 0.5rem; }
.wd-fact-val {
  font-size: clamp(0.95rem, 1.3vw, 1.15rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.35;
}
.wd-visit {
  position: relative;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
  cursor: none;
}
.wd-visit::after {
  content: '';
  position: absolute;
  left: 0; bottom: -5px;
  width: 100%; height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform 0.5s var(--ease-out);
}
.wd-visit:hover::after { transform: scaleX(1); transform-origin: 0 50%; }

/* ── the three chapters ──────────────────────────────────────────────── */
.wd-story {
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 12vh, 9rem);
  padding: clamp(4rem, 12vh, 8rem) var(--pad-x);
}
.wd-chapter {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}
.wd-chapter-head { display: flex; flex-direction: column; gap: 1rem; }
.wd-chapter-title {
  font-size: clamp(1.5rem, 2.6vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.wd-chapter-text {
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  line-height: 1.7;
  color: var(--muted);
  max-width: 44rem;
}
.wd-chapter-rule {
  display: block;
  width: 100%;
  height: 1px;
  margin-bottom: clamp(1rem, 2.5vh, 1.75rem);
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--accent), transparent);
}

/* ── what shipped ────────────────────────────────────────────────────── */
.wd-highlights {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border-block: 1px solid var(--line);
}
.wd-highlight {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: clamp(1.25rem, 3vh, 2rem) clamp(1rem, 2vw, 2rem);
  background: var(--bg);
  overflow: hidden;
}
/* Same scaleX wipe the archive's rows use — transform stays off the main thread
   where a background transition would not. */
.wd-highlight::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: color-mix(in srgb, var(--accent) 10%, var(--bg));
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.5s var(--ease-out);
}
.wd-highlight:hover::before { transform: scaleX(1); }
/* Replaces the old 01/02 counter: the row still gets an accent anchor at its
   left edge, without putting a position on screen. */
.wd-highlight-mark {
  flex: 0 0 auto;
  width: 7px; height: 7px;
  border-radius: 2px;
  background: var(--accent);
  align-self: center;
}
.wd-highlight-text {
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* ── section heads ───────────────────────────────────────────────────── */
.wd-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  padding: 0 var(--pad-x);
  margin-bottom: clamp(1.5rem, 4vh, 2.75rem);
}
.wd-head-title {
  font-size: clamp(1.6rem, 3.4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
}

/* ── gallery: the fan ────────────────────────────────────────────────── */
.wd-gallery { position: relative; padding: clamp(3rem, 9vh, 6rem) 0; }
/*
 * The stage is pinned while a neat stack of screens spreads into a full 360
 * degree rosette. Every card is anchored to ONE pivot — the zero-size element
 * at the centre — and carries transform-origin: left bottom, so a card is
 * placed entirely by its own rotation. Its resting angle is --angle, handed
 * down per card by the component.
 *
 * The FANNED state is the resting state, on purpose: a reader whose scripts
 * never arrived, or who asked for reduced motion, gets the composed rosette
 * rather than a pile of cards on top of each other. The JS only animates the
 * page INTO it, from the stack.
 */
.wd-fan {
  position: relative;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /*
   * THE dial for how big the rosette reads. It is the card's width as a share
   * of the short viewport axis, and the circle the cards sweep is
   * 2 x 1.147 x that (the radius is the card's DIAGONAL, since every card is
   * pinned by a corner). So the rosette spans 2.29 x this much of the short
   * side: at 0.42 that is ~96%, which is as close to edge-to-edge as it can sit
   * before the outermost cards start clipping. Lower it to give the fan air.
   */
  --fan-fit: 0.42;
}
/* Zero-size on purpose: it is a point, not a box, and every card hangs off it. */
.wd-fan-pivot { position: relative; width: 0; height: 0; will-change: transform; }
.wd-card {
  position: absolute;
  left: 0;
  bottom: 0;
  /* Sized off the SMALLER viewport axis, because the rosette is as wide as it
     is tall. The factor lives on .wd-fan above, where the geometry is
     explained — it is the one number that resizes the whole thing. */
  width: calc(var(--fan-fit, 0.42) * min(100vw, 100svh));
  padding: 0;
  border: 0;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg2);
  transform-origin: left bottom;
  transform: rotate(var(--angle));
  box-shadow: 0 26px 60px -28px rgba(37,33,44,0.55);
  cursor: none;
  will-change: transform;
  transition: box-shadow 0.5s var(--ease-out), scale 0.5s var(--ease-out);
}
.wd-card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
/* The sheen that makes the stack read as a deck of physical cards rather than
   a pile of screenshots — brightest at the top-left corner of each one. */
.wd-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.07) 42%, transparent 100%);
}
/* Lifts under the pointer with the INDEPENDENT scale property: GSAP owns this
   element's transform (the rotation), and scale composes with it instead of
   overwriting it. */
.wd-card:hover { scale: 1.05; box-shadow: 0 36px 80px -26px rgba(37,33,44,0.7); }
/* The card the lightbox is showing is held invisible, so the image is never in
   two places at once. */
.wd-card.is-lifted { opacity: 0; }

/* ── lightbox ────────────────────────────────────────────────────────── */
.wd-lightbox {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 5vh, 4rem);
  background: rgba(37,33,44,0.92);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.45s var(--ease-out), visibility 0.45s;
}
.wd-lightbox.is-open { opacity: 1; visibility: visible; }
.wd-lightbox-img {
  max-width: min(96vw, 1500px);
  max-height: 82svh;
  width: auto;
  border-radius: 12px;
  display: block;
  will-change: transform;
}
.wd-lightbox-bar {
  position: absolute;
  left: 0; right: 0; bottom: clamp(1rem, 4vh, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
  color: rgba(255,248,231,0.8);
}
.wd-lb-btn {
  width: 46px; height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,248,231,0.25);
  border-radius: 50%;
  background: transparent;
  color: #FFF8E7;
  cursor: none;
  transition: background 0.35s var(--ease-out), border-color 0.35s var(--ease-out);
}
.wd-lb-btn:hover { background: rgba(255,248,231,0.14); border-color: rgba(255,248,231,0.5); }
.wd-lb-dots { display: flex; align-items: center; gap: 10px; }
.wd-lb-dot {
  width: 7px; height: 7px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255,248,231,0.32);
  cursor: none;
  transition: background 0.35s var(--ease-out), scale 0.35s var(--ease-out);
}
.wd-lb-dot:hover { background: rgba(255,248,231,0.6); }
.wd-lb-dot.is-active { background: #FFF8E7; scale: 1.5; }
.wd-lb-close {
  position: absolute;
  top: clamp(1rem, 3vh, 2rem);
  right: clamp(1rem, 3vw, 2.5rem);
}

/* ── stack spectrum ──────────────────────────────────────────────────── */
.wd-stack { padding: clamp(4rem, 12vh, 8rem) 0; }
/*
 * One bar, split by share. The segments are flex children whose grow factor IS
 * the share, so the proportions are exact without any percentage arithmetic and
 * the gaps cost nothing from the values.
 */
.wd-spectrum {
  display: flex;
  gap: 6px;
  height: clamp(64px, 9vw, 104px);
  margin: 0 var(--pad-x);
}
.wd-seg {
  flex: var(--share) 1 0%;
  border-radius: 8px;
  background: var(--seg);
  transform-origin: 0 50%;
  will-change: transform;
  transition: translate 0.45s var(--ease-out), opacity 0.45s var(--ease-out);
}
/* Hovering a row below lifts its own band out of the bar and dims the rest —
   the two halves of the section point at each other.
   The lift is the INDEPENDENT translate property, not a transform: the draw-in
   tween leaves an inline transform: scaleX(1) on every segment, and translate
   composes with it instead of being overwritten by it. */
.wd-seg.is-active { translate: 0 -10px; }
.wd-seg.is-dim { opacity: 0.25; }
.wd-bands {
  list-style: none;
  margin: clamp(1.5rem, 4vh, 2.5rem) var(--pad-x) 0;
  border-top: 1px solid var(--line);
}
.wd-band {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  padding: clamp(0.85rem, 2vh, 1.15rem) 0;
  border-bottom: 1px solid var(--line);
  transition: padding-left 0.45s var(--ease-out);
}
.wd-band:hover { padding-left: 0.75rem; }
.wd-band-swatch {
  width: 14px; height: 14px;
  border-radius: 4px;
  background: var(--seg);
}
.wd-band-name {
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.wd-band-role {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
.wd-band-share {
  font-size: clamp(1.1rem, 2vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.wd-band-share i { font-style: normal; font-size: 0.6em; color: var(--muted); margin-left: 0.15em; }
.wd-stack-hint { margin: 1.25rem var(--pad-x) 0; }

/* ── next project ────────────────────────────────────────────────────── */
.wd-next {
  position: relative;
  display: block;
  height: min(78svh, 720px);
  overflow: hidden;
  text-decoration: none;
  color: #FFF8E7;
  cursor: none;
}
.wd-next-media { position: absolute; inset: 0; }
.wd-next-media img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: scale 1.1s var(--ease-out);
}
.wd-next:hover .wd-next-media img { scale: 1.06; }
.wd-next--bare .wd-next-media {
  background: linear-gradient(150deg, color-mix(in srgb, var(--next-accent) 78%, #000), var(--text));
}
.wd-next-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(37,33,44,0.35), rgba(37,33,44,0.82));
}
.wd-next-inner {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(0.75rem, 2vh, 1.25rem);
  padding: 0 var(--pad-x);
}
.wd-next-label { color: rgba(255,248,231,0.7); }
.wd-next-title {
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.wd-next-go {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.wd-next-go svg { transition: transform 0.5s var(--ease-out); }
.wd-next:hover .wd-next-go svg { transform: translateX(6px); }

/* ── responsive ──────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .wd-chapter { grid-template-columns: 1fr; gap: 1.25rem; }
  .wd-band { grid-template-columns: 14px minmax(0, 1fr) auto; }
  .wd-band-role { display: none; }
}
@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  :root { --pad-x: 1.25rem; }
  body { overflow-x: hidden; }
  .wd-highlights { grid-template-columns: 1fr; }
  .wd-hero-year { bottom: 26%; -webkit-text-stroke-width: 1px; }
  .wd-title { max-width: none; }
  /* The rosette needs no phone branch for its geometry — every dimension in it
     is a share of the short viewport axis, so it just gets smaller. It only
     takes a slightly gentler fit: on a phone the short axis is the WIDTH, and
     cards reaching to within a few pixels of both edges reads as an accident
     rather than as full bleed. */
  .wd-fan { --fan-fit: 0.40; }
  .wd-card { border-radius: 10px; }
  .wd-lb-btn { width: 40px; height: 40px; }
}

/* Reduced motion: the reveals are skipped in JS and the fan's RESTING state is
   already the spread rosette, so only the decorative loops need stopping. */
@media (prefers-reduced-motion: reduce) {
  .wd-hero-cue span { animation: none; transform: scaleX(1); opacity: 1; }
  .wd-card, .wd-next-media img, .wd-seg, .wd-band { transition: none; }
}
`+WORKS_CURSOR_CSS).trim();
