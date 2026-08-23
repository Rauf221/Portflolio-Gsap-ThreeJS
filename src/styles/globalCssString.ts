import { MOBILE_MAX_WIDTH, SKILLS_MOBILE_LIFT } from "../lib/viewport";

/** Inline global styles for the portfolio page (fonts, tokens, utilities). */
export const PORTFOLIO_GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #FFF8E7;
  --bg2: #F5F0E4;
  --indigo: #6B5BCB;
  /* One source for the brand indigo; --sphere survives as an alias because the
     3D-related rules read it by that name. */
  --sphere: var(--indigo);
  --text: #25212C;
  --muted: rgba(37,33,44,0.6);
  --max-w: 1440px;
  --pad-x: max(2rem, calc((100vw - var(--max-w)) / 2 + 2rem));
  /* Shared film-grain tile (feTurbulence SVG), referenced by the page wash and
     the hero scrim — one definition instead of two copies of the data URI. */
  --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");

  /* Hero-only palette. The hero is the single dark section on an otherwise
     cream page, so these are deliberately separate tokens rather than an
     override of --bg/--text: nothing outside the hero should pick them up. */
  --hero-bg: #060606;
  --hero-ink: #F5F0E4;
  --hero-ink-dim: rgba(245,240,228,0.55);
  --hero-line: rgba(245,240,228,0.28);
}
html { scroll-behavior: auto; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans-project);
  overflow-x: hidden;
  cursor: none;
}
body::before {
  content: '';
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(107,91,203,0.12) 0%, transparent 70%),
              var(--noise);
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
::selection { background: var(--sphere); color: #FFF8E7; }
::-webkit-scrollbar { width: 4px; background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--sphere); border-radius: 2px; }

.font-display { font-family: var(--font-sans-project); }
.font-mono { font-family: var(--font-sans-project); }
.overflow-clip { overflow: hidden; }
/* Screen-reader-only: rendered for assistive tech, invisible on screen. */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.container {
  width: 100%;
  max-width: var(--max-w);
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.grad-indigo {
  background: linear-gradient(135deg, var(--indigo), #25212C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }

.projects-section { position: relative; z-index: 1; width: 100%; background: transparent; }
.projects-path-scroll {
  position: relative;
}
.projects-path-stage {
  position: relative;
  width: 100%;
  /* svh, not vh: on mobile vh includes the space under the URL bar, so a
     "full viewport" pinned stage sits partly out of sight. MUST stay the same
     unit as .projects-after-path's negative margin-top below — the curtain's
     overlap is that margin cancelling this height exactly. */
  height: 100svh;
  overflow: hidden;
  background: transparent;
  z-index: 5; 
}
.projects-path-camera {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
}
.projects-path-svg {
  display: block;
  width: 3200px;
  height: 900px;
  pointer-events: none;
  /*
   * Headline size in the SVG's own user units, not screen px — the camera
   * scales the whole thing. It lives here as one variable because TWO rules
   * must read the same number: .projects-path-text is what gets measured
   * (character offsets along the path are taken from it) and
   * .projects-path-char is what actually gets drawn. Let them drift apart and
   * the glyphs are positioned for one size but rendered at another, so the
   * letters space out wrongly.
   *
   * It is load-bearing beyond looks, too: this width divided by the path length
   * is textPathRatio (usePortfolioGsap), which decides how much of the curve the
   * camera travels. Raise it and that ratio climbs; past 1.0 the sentence no
   * longer fits on the path and its tail is cut.
   *
   * So it is the counterweight to the headline's LENGTH (projects.pathHeadline,
   * content/site.ts): textSpan is roughly fontSize x charCount, and the two
   * must trade off to hold textSpan steady. 120px carried the old 73-character
   * line; the line is now 85, and 120 x 73 / 85 = 103 keeps the same arc length,
   * so every camera value stays tuned. Shorten the sentence and this can rise
   * again by the same ratio.
   */
  --path-font-size: 110px;
}
.projects-path-text {
  font-family: var(--font-sans-project);
  font-size: var(--path-font-size);
  font-weight: 400;
  letter-spacing: -0.025em;
}
.projects-path-textpath {
  user-select: none;
}
.projects-path-text-measure.is-split {
  visibility: hidden;
  pointer-events: none;
}
.projects-path-chars .projects-path-char {
  font-family: var(--font-sans-project);
  /* Must equal .projects-path-text — see the note on --path-font-size. */
  font-size: var(--path-font-size);
  font-weight: 400;
  letter-spacing: -0.025em;
  opacity: 0;
  will-change: opacity;
}
.projects-path-fallback {
  display: none;
  position: absolute;
  inset: 0;
  padding: 6rem var(--pad-x);
  font-size: clamp(2.5rem, 5.5vw, 4.5rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.05;
  max-width: 18ch;
}
@media (prefers-reduced-motion: reduce) {
  .projects-path-scroll { height: auto; }
  .projects-path-stage { height: auto; min-height: 52vh; }
  .projects-path-svg { display: none; }
  .projects-path-camera { display: none; }
  .projects-path-fallback { display: block; position: relative; inset: auto; }
}
.projects-after-path {
  position: relative;
  z-index: 2;
  opacity: 1;          
  pointer-events: none; 
  /* Cancels .projects-path-stage's height exactly — same unit, always. */
  margin-top: -100svh;
  background: var(--bg);
}
/* No horizontal padding on purpose: the count's own position is unchanged by
   this row, the archive link simply joins it on the same line. */
.projects-intro-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
}
.projects-intro-count {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}
/*
 * The way out to /works. Its parent (.projects-after-path) is
 * pointer-events:none — it lies over the pinned path stage and must not eat
 * that section's input — so this link turns them back on for itself alone.
 */
.projects-archive-link {
  pointer-events: auto;
  position: relative;
  margin-top: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text);
  text-decoration: none;
  cursor: none;
}
.projects-archive-link::after {
  content: '';
  position: absolute;
  left: 0; bottom: -5px;
  width: 100%; height: 1px;
  background: var(--indigo);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.projects-archive-link:hover::after { transform: scaleX(1); transform-origin: 0 50%; }
.projects-archive-arrow {
  display: inline-block;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.projects-archive-link:hover .projects-archive-arrow { transform: translateX(5px); }
/* The list is pinned by GSAP for the length of the whole sequence and the
   panels are stacked absolutely inside it, because the transition moves them
   diagonally (in from top-right, out to bottom-left) — that needs full control
   of x/y, which position:sticky's vertical-only travel can't give.
   overflow: clip (not hidden) crops the off-stage panels without turning this
   into a scroll container. */
/* Owns the scroll distance for the whole sequence: 70vh per timeline unit,
   where a unit is either one swap or one panel's rest. --scroll-units is set
   by the hook (it knows the dwell); --swaps is the inline pre-JS fallback.
   Kept as a unitless multiplier so vh does the work and nothing writes px back
   into the element ScrollTrigger measures. */
.projects-stage-scroll {
  position: relative;
  width: 100%;
  /* The leading term is the sticky viewport (svh, matching .projects-sticky-list);
     the per-unit term is pure scroll distance, so plain vh is right there. */
  height: calc(100svh + var(--scroll-units, var(--swaps, 1)) * 70vh);
}
.projects-sticky-list {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100svh;
  background: var(--bg);
  overflow: clip;
}
.project-panel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  padding: 0;
  background: var(--bg);
  will-change: transform, opacity;
}
.project-panel-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  gap: clamp(1rem, 2vw, 2rem);
  padding: clamp(0.75rem, 1.5vw, 1.5rem);
  background: var(--bg);
  will-change: transform;
  backface-visibility: hidden;
}
/* Bottom-left origin, matching the reference: the image collapses into that
   corner as its panel leaves and unfolds from it as the next one arrives. */
.project-panel-media {
  flex: 0 0 62%;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: color-mix(in srgb, var(--panel-accent) 16%, var(--bg2));
  transform-origin: 0% 100%;
  will-change: transform;
}
/* Same origin as its parent's arrival scale, so GSAP's counter-scale cancels it
   exactly and the footage sits still while the window opens. */
.project-panel-media-frame {
  position: absolute;
  inset: 0;
  transform-origin: 0% 100%;
  will-change: transform;
}
.project-panel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.project-panel-year {
  position: absolute;
  bottom: 18px;
  left: 20px;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 4px 11px;
  border-radius: 20px;
  color: #fff;
  background: rgba(0,0,0,0.42);
  backdrop-filter: blur(6px);
}
.project-panel-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2.5rem) clamp(0.5rem, 1.5vw, 1.5rem);
}

/* Index row — the panel's own number, then the section label pushed right by
   an accent rule that fills whatever space is left. */
.project-panel-index {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: clamp(0.9rem, 2vh, 1.6rem);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.project-panel-index-num {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--panel-accent);
}
.project-panel-index-total {
  font-size: 0.8rem;
  color: var(--muted);
  margin-left: -0.35rem;
}
.project-panel-index-label {
  position: relative;
  padding-left: 2.6rem;
  color: var(--muted);
}
.project-panel-index-label::before {
  content: "";
  position: absolute;
  left: 0.7rem;
  top: 50%;
  width: 1.5rem;
  height: 1px;
  background: var(--panel-accent);
  opacity: 0.55;
}

.project-panel-title {
  font-size: clamp(1.9rem, 3.2vw, 3.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 10px;
  /* Word masks are inline-block, so the whitespace between them in the JSX is
     what separates the words — no margin needed, and none wanted: a margin
     would show as a gap inside the crop while a word is still travelling. */
}
/* Crops its word so .pp-word can start below the baseline and slide up into
   place. overflow: hidden needs a block-ish box, and padding-bottom keeps
   descenders (g, y, p) from being shaved off by the crop. */
.pp-word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.12em;
}
.pp-word {
  display: inline-block;
  will-change: transform;
}

.project-panel-subtitle {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--panel-accent);
  margin-bottom: clamp(0.8rem, 1.8vh, 1.3rem);
}
/* Drawn open by GSAP (scaleX 0 -> 1) rather than faded, so the eye follows it
   left-to-right into the description. */
.project-panel-rule {
  display: block;
  width: min(100%, 26rem);
  height: 1px;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--panel-accent), transparent);
  margin-bottom: clamp(0.9rem, 2vh, 1.5rem);
}
.project-panel-desc {
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 26px;
  max-width: 30rem;
}
.project-panel-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
/* position: relative so .project-panel-row-fill can be absolutely placed under
   the text; isolation keeps that fill from painting over the rounded corner. */
.project-panel-row {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0 0 clamp(0.9rem, 1.6vw, 1.4rem);
  border-radius: 12px;
  background: color-mix(in srgb, var(--panel-accent) 11%, var(--bg));
  overflow: hidden;
  cursor: none;
}
/* The hover wipe. A scaleX from the left is used rather than animating
   background-color because transform is the only property here that stays off
   the main thread — these rows sit inside a scrubbed, pinned section where a
   paint-triggering hover would show up as scroll jank. */
.project-panel-row-fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: color-mix(in srgb, var(--panel-accent) 26%, var(--bg));
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
/* GSAP's arrival wipe — a brighter band that crosses the row once and leaves.
   Sits above the hover fill so the two never cancel each other out visually. */
.project-panel-row-sweep {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: color-mix(in srgb, var(--panel-accent) 52%, var(--bg));
  transform: scaleX(0);
  transform-origin: 0 50%;
  will-change: transform;
}
.project-panel-row:hover .project-panel-row-fill { transform: scaleX(1); }
.project-panel-row-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.35;
  padding: 1rem 0;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
/* Nudged right so the label rides the wipe instead of sitting still on top of
   it — the two together read as one movement. */
.project-panel-row:hover .project-panel-row-label { transform: translateX(6px); }
.project-panel-row-icon {
  flex: 0 0 auto;
  align-self: stretch;
  width: clamp(46px, 3.6vw, 58px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--panel-accent);
  color: #fff;
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-panel-row:hover .project-panel-row-icon { width: clamp(58px, 4.6vw, 72px); }
/* The glyph is an eight-pointed asterisk, so a 45deg turn lands it exactly on
   its own alternate points: it reads as the mark spinning into a new position
   rather than tilting off-axis. */
.project-panel-row-icon svg {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-panel-row:hover .project-panel-row-icon svg { transform: rotate(45deg) scale(1.15); }
/* The clip lifts slightly under the pointer, using the INDEPENDENT scale
   property rather than a transform. GSAP owns transform on .project-panel-media-frame
   just above, and the independent transform properties compose with it instead
   of overwriting it — which is why the hover survives the arrival animation.
   (Careful editing here: this file is a JS template literal, so no backticks.) */
.project-panel-media { cursor: none; }
.project-panel-video { transition: scale 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.project-panel-media:hover .project-panel-video { scale: 1.04; }
.project-panel-year { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
.project-panel-media:hover .project-panel-year { transform: translateY(-4px); }

@media (max-width: 900px) {
  .project-panel-inner { flex-direction: column; gap: 0.75rem; }
  .project-panel-media { flex: 0 0 40%; min-height: 0; }
  .project-panel-info { flex: 1; min-height: 0; justify-content: flex-start; padding: 0.5rem 0.75rem 1rem; }
  .project-panel-index { margin-bottom: 0.6rem; }
  .project-panel-subtitle { margin-bottom: 0.55rem; }
  .project-panel-rule { margin-bottom: 0.7rem; }
  .project-panel-desc { margin-bottom: 16px; }
  .project-panel-rows { gap: 6px; }
  .project-panel-row-label { padding: 0.7rem 0; font-size: 0.7rem; }
  .project-panel-row-icon { width: 42px; }
}

/* Phones: the panel is a full viewport tall and has to hold a video, a title,
   a paragraph and three rows. Everything tightens; the description is the one
   element that can lose lines without losing meaning, so it is clamped rather
   than allowed to push the rows off the bottom. */
@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  .project-panel-media { flex: 0 0 34%; border-radius: 12px; }
  .project-panel-title { font-size: clamp(1.5rem, 7.5vw, 2.1rem); }
  .project-panel-index { font-size: 0.62rem; margin-bottom: 0.5rem; }
  .project-panel-index-label { padding-left: 1.9rem; }
  .project-panel-index-label::before { left: 0.5rem; width: 1rem; }
  .project-panel-subtitle { font-size: 0.68rem; }
  .project-panel-desc {
    font-size: 0.82rem;
    line-height: 1.55;
    margin-bottom: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .project-panel-rows { gap: 5px; }
  .project-panel-row-label { padding: 0.6rem 0; font-size: 0.65rem; }
  .project-panel-row-icon { width: 38px; }
  .project-panel-row:hover .project-panel-row-icon { width: 38px; }
  /* Panels sit above the floating dock, which spans the bottom edge here. */
  .project-panel-info { padding-bottom: 4.5rem; }
}

/* Hover motion is decoration on top of information that is already legible, so
   it is dropped wholesale rather than shortened. */
@media (prefers-reduced-motion: reduce) {
  .project-panel-row-fill,
  .project-panel-row-label,
  .project-panel-row-icon,
  .project-panel-row-icon svg,
  .project-panel-video,
  .project-panel-year { transition: none; }
  .project-panel-row:hover .project-panel-row-fill { transform: scaleX(1); }
  .project-panel-media:hover .project-panel-video { scale: 1; }
  .project-panel-row:hover .project-panel-row-label,
  .project-panel-media:hover .project-panel-year { transform: none; }
  .project-panel-row:hover .project-panel-row-icon svg { transform: none; }
}

/* ===== Hero ===== */

/*
 * Darkens the Unicorn scene under the overlay layer. Two gradients: a vignette
 * that keeps the centre of the image readable while crushing the edges, and a
 * top band so the navigation always sits on near-black regardless of what the
 * scene is doing up there.
 */
.hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(6,6,6,0.75) 0%, rgba(6,6,6,0) 22%),
    radial-gradient(ellipse 70% 55% at 50% 42%, rgba(6,6,6,0) 0%, rgba(6,6,6,0.45) 55%, rgba(6,6,6,0.88) 100%);
}
/*
 * The hero's film grain. It cannot come from the global body::before layer:
 * that uses mix-blend-mode: overlay, which is a no-op over a near-black
 * backdrop, so the hero would render perfectly clean. Same noise source,
 * soft-light instead, which does show on dark.
 */
.hero-scrim::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--noise);
  opacity: 0.5;
  mix-blend-mode: soft-light;
}

/* ===== Hero overlay (nav, clock, statement, CTA) ===== */

/*
 * The hero's entire content layer. The container is pointer-events:none so it
 * never eats clicks over the Unicorn scene; only the anchors inside it opt
 * back in. z-index 4 puts it above the scrim (2).
 */
.hero-ui {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  color: var(--hero-ink);
}
.hero-ui a {
  pointer-events: auto;
  text-decoration: none;
  color: inherit;
  /* body sets cursor:none for the custom cursor; anchors must not re-introduce
     a native pointer or two cursors show at once. */
  cursor: none;
}

.hero-ui-mark {
  position: absolute;
  top: 0.6rem;
  left: 1.6rem;
  width: clamp(90px, 8vw, 150px);
  display: block;
  color: var(--hero-ink);
}
.hero-ui-mark svg { width: 100%; height: auto; display: block; }

.hero-nav {
  position: absolute;
  top: 1.5rem;
  left: 18vw;
  display: flex;
  align-items: flex-start;
  gap: clamp(2rem, 9vw, 10rem);
}
.hero-nav-group-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1;
  color: var(--hero-ink);
  margin-bottom: 0.75rem;
}
.hero-nav-glyph {
  width: 9px;
  height: 9px;
  flex: none;
  background: var(--hero-ink);
}
.hero-nav-glyph--circle { border-radius: 50%; }
.hero-nav-glyph--flag { clip-path: polygon(0 0, 100% 0, 0 100%); }

.hero-nav-list { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
/*
 * Every sub-item carries a resting underline (that is the reference look);
 * hover and the active section only raise its contrast, they do not draw it.
 */
.hero-nav-link {
  position: relative;
  display: inline-block;
  font-size: 1.05rem;
  line-height: 1.2;
  color: var(--hero-ink-dim);
  transition: color 0.3s;
}
.hero-nav-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -3px;
  height: 1px;
  background: var(--hero-line);
  transition: background 0.3s;
}
.hero-nav-link:hover,
.hero-nav-link.is-active { color: var(--hero-ink); }
.hero-nav-link:hover::after,
.hero-nav-link.is-active::after { background: var(--hero-ink); }

.hero-clock {
  position: absolute;
  top: 1.1rem;
  left: 66%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}
.hero-clock-time {
  padding: 0.15rem 0.35rem;
  border: 1px solid var(--hero-line);
  border-radius: 2px;
  font-size: 0.72rem;
  line-height: 1.1;
  /* Fixed-width digits, otherwise the box twitches once a second. */
  font-variant-numeric: tabular-nums;
}
.hero-clock-meta {
  font-size: 0.68rem;
  line-height: 1.25;
  color: var(--hero-ink-dim);
  letter-spacing: 0.04em;
}

.hero-discover {
  position: absolute;
  top: 1.2rem;
  right: 2.8rem;
  font-size: 0.86rem;
}
.hero-rule {
  position: absolute;
  top: 0;
  right: 2rem;
  width: 1px;
  height: 105px;
  background: var(--hero-line);
}

.hero-cta {
  position: absolute;
  top: 76%;
  left: 1.25rem;
  padding: 1.15rem 1.6rem;
  border: 1px solid var(--hero-line);
  border-radius: 4px;
  background: rgba(6,6,6,0.72);
  font-size: 0.95rem;
  transition: background 0.3s, border-color 0.3s;
}
.hero-cta:hover { background: rgba(6,6,6,0.92); border-color: var(--hero-ink); }
.hero-cta-label > span { display: inline-block; transition: transform 0.3s; }
.hero-cta:hover .hero-cta-label > span { transform: translateX(4px); }
/* Four corner dots, inset from the border. */
.hero-cta-dot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: var(--hero-ink-dim);
}
.hero-cta-dot--tl { top: 6px; left: 6px; }
.hero-cta-dot--tr { top: 6px; right: 6px; }
.hero-cta-dot--bl { bottom: 6px; left: 6px; }
.hero-cta-dot--br { bottom: 6px; right: 6px; }

/*
 * The centre block: three statement lines, a gap, then the era line, all
 * framed by four corner marks. Sized by its own content, so the only position
 * to tune is this top offset — measured against the 900px hero it occupies
 * roughly 630-844, with the marks 30px outside that.
 */
.hero-statement {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: clamp(1.1rem, 2.1vw, 2.25rem);
  line-height: 1.28;
  font-weight: 400;
}
.hero-statement-line { white-space: nowrap; }
/* Four squares marking an invisible frame around the statement. */
.hero-bracket {
  position: absolute;
  width: 7px; height: 7px;
  background: var(--hero-ink);
}
.hero-bracket--tl { top: -30px; left: -27%; }
.hero-bracket--tr { top: -30px; right: -27%; }
.hero-bracket--bl { bottom: -30px; left: -27%; }
.hero-bracket--br { bottom: -30px; right: -27%; }

.hero-era {
  margin-top: 2.6rem;
  white-space: nowrap;
}

.hero-signal {
  position: absolute;
  bottom: 3%;
  right: 1.4rem;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
  opacity: 0.4;
}
.hero-signal i { width: 2px; background: var(--hero-ink); }
.hero-signal i:nth-child(1) { height: 3px; }
.hero-signal i:nth-child(2) { height: 8px; }
.hero-signal i:nth-child(3) { height: 12px; }
.hero-signal i:nth-child(4) { height: 5px; }

/* ===== Floating dock =====
 *
 * The persistent navigation bar, centred along the bottom edge. It takes over
 * from the hero overlay's own nav: hidden while the hero is on screen, revealed
 * by a ScrollTrigger in usePortfolioGsap once that overlay has faded out (hero
 * 48%→62%). Kept hidden here — opacity 0 + visibility hidden, the pair GSAP's
 * autoAlpha drives — so it never flashes over the hero before that runs.
 *
 * Two elements on purpose: the LAYER owns fixed positioning and the horizontal
 * centring (flex), the BAR owns the look. GSAP animates the layer's transform,
 * so it can never fight a translateX(-50%) centring hack.
 */
.dock-layer {
  position: fixed;
  bottom: 1.35rem;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}
/* Sizes itself to the bar, and anchors the directory panel — which spans the
   bar's full width, so it hangs off this and not off the Directory tile. */
.dock {
  position: relative;
  pointer-events: auto;
  /* Local tokens: the whole bar rescales from these five values. */
  --dock-h: 48px;
  --dock-gap: 4px;
  /* The site's own indigo, not a dock-local colour — retinting the whole bar
     is a matter of changing --indigo. The hover step is a lighter mix of it. */
  --dock-bg: var(--indigo);
  --dock-bg-hi: color-mix(in srgb, var(--indigo) 84%, #FFF8E7);
  --dock-ink: var(--bg2);
}
.dock-bar {
  display: flex;
  align-items: stretch;
  gap: var(--dock-gap);
}
.dock a, .dock button {
  /* body sets cursor:none for the custom cursor; controls must not
     re-introduce a native pointer or two cursors show at once. */
  cursor: none;
  color: var(--dock-ink);
  text-decoration: none;
  font-family: inherit;
}

.dock-tile {
  position: relative;
  height: var(--dock-h);
  border: none;
  border-radius: 3px;
  background: var(--dock-bg);
  transition: background 0.3s;
}
.dock-tile:hover { background: var(--dock-bg-hi); }

.dock-tile--mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  padding: 0 14px;
}
.dock-tile--mark svg { width: 100%; height: auto; display: block; }

/* Label left, glyph right, on one baseline — the tiles share a min-width so
   they line up as equal blocks the way the reference bar does. */
.dock-tile--action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  min-width: 158px;
  padding: 0 18px 0 14px;
}
.dock-tile-label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
}

/* Four inset corner marks, matching the hero CTA's treatment. */
.dock-dot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: rgba(242,237,227,0.75);
}
.dock-dot--tl { top: 6px; left: 6px; }
.dock-dot--tr { top: 6px; right: 6px; }
.dock-dot--bl { bottom: 6px; left: 6px; }
.dock-dot--br { bottom: 6px; right: 6px; }

/* Directory: two stacked rules. They pull apart on hover, and scissor into a ✕
   while the panel is open. The 4px gap puts the rules' centres 6px apart, so
   3px of travel each is exactly what closes them onto one line. */
.dock-glyph { display: flex; flex: none; }
.dock-glyph--menu {
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 26px;
}
.dock-glyph--menu i {
  height: 2px;
  background: var(--dock-ink);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.dock-tile--action:hover .dock-glyph--menu i:first-child { transform: translateY(-1px); }
.dock-tile--action:hover .dock-glyph--menu i:last-child { transform: translateY(1px); }
.dock-tile--action.is-open .dock-glyph--menu i:first-child { transform: translateY(3px) rotate(45deg); }
.dock-tile--action.is-open .dock-glyph--menu i:last-child { transform: translateY(-3px) rotate(-45deg); }

/* Sound: a four-bar meter. Static heights while off, animated while on. */
.dock-glyph--meter {
  align-items: flex-end;
  gap: 3px;
  height: 12px;
}
.dock-glyph--meter i {
  width: 2px;
  background: var(--dock-ink);
  transform-origin: bottom center;
}
.dock-glyph--meter i:nth-child(1) { height: 3px; }
.dock-glyph--meter i:nth-child(2) { height: 9px; }
.dock-glyph--meter i:nth-child(3) { height: 12px; }
.dock-glyph--meter i:nth-child(4) { height: 3px; }
.dock-tile--action.is-on .dock-glyph--meter i {
  animation: dock-meter 0.9s ease-in-out infinite alternate;
}
.dock-tile--action.is-on .dock-glyph--meter i:nth-child(2) { animation-delay: 0.15s; }
.dock-tile--action.is-on .dock-glyph--meter i:nth-child(3) { animation-delay: 0.3s; }
.dock-tile--action.is-on .dock-glyph--meter i:nth-child(4) { animation-delay: 0.45s; }
@keyframes dock-meter { from { transform: scaleY(0.35); } to { transform: scaleY(1); } }

/* ----- Directory panel -----
 *
 * Square tiles on the same 4px rhythm as the bar, stacked directly above it.
 * The panel is exactly as wide as the bar (left/right 0 on .dock), so three
 * 1fr columns land on the same grid the bar's own tiles sit on. Rows are
 * separate elements rather than one grid, which is what lets a short row stay
 * left-aligned instead of being reflowed by grid auto-placement.
 */
.dock-menu {
  position: absolute;
  bottom: calc(100% + var(--dock-gap));
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dock-gap);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transform-origin: bottom center;
  transition: opacity 0.3s, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.35s;
}
.dock-menu.is-open { opacity: 1; visibility: visible; transform: translateY(0); }

.dock-menu-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--dock-gap);
}

.dock-menu-tile {
  position: relative;
  /* Square, so the tile's height follows the bar's width — nothing to keep in
     sync by hand when the labels or the breakpoints change. */
  aspect-ratio: 1;
  display: flex;
  padding: 13px;
  border-radius: 3px;
  background: var(--dock-bg);
  font-size: 0.94rem;
  font-weight: 500;
  line-height: 1.2;
  transition: background 0.3s;
}
.dock-menu-tile:hover { background: var(--dock-bg-hi); }
.dock-menu-tile-label { align-self: flex-start; }
.dock-menu-tile--icon { align-items: center; justify-content: center; }
.dock-menu-tile--icon svg { width: 24px; height: 24px; display: block; }

/* Dim + blur behind the open panel so it reads over any section. Drop this
   rule set (and the element in FloatingDock) for a plain, unobscured page. */
.dock-scrim {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(6,6,6,0.4);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s, visibility 0.35s;
}
.dock-scrim.is-open { opacity: 1; visibility: visible; pointer-events: auto; }

@media (prefers-reduced-motion: reduce) {
  .dock-tile--action.is-on .dock-glyph--meter i { animation: none; }
}

@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  .dock { --dock-h: 42px; }
  .dock-layer { bottom: 1rem; }
  /* The bar spans the viewport so the square tiles above it stay big enough to
     hold a label — at the desktop hug-content width they would be ~72px. */
  .dock-layer, .dock { left: 0; right: 0; }
  .dock { width: calc(100vw - 2rem); }
  .dock-bar > .dock-tile--action { flex: 1; }
  .dock-tile--mark { width: 46px; padding: 0 11px; }
  .dock-tile--action { min-width: 0; gap: 0.6rem; padding: 0 12px 0 11px; }
  .dock-tile-label { font-size: 0.78rem; }
  .dock-glyph--menu { width: 20px; }
  .dock-menu-tile { padding: 10px; font-size: 0.8rem; }
  .dock-menu-tile--icon svg { width: 20px; height: 20px; }
  .dock-dot { width: 2px; height: 2px; }
}

/*
 * padding-left parks the headline a full viewport off to the right so the
 * characters fly in from genuinely off-screen. Do NOT shorten it to reduce
 * scroll length — that starts the headline mid-screen and the entrance loses
 * its point. Compress the scroll cost instead, via
 * SKILLS_HEADLINE_SCROLL_RATIO in usePortfolioGsap.
 */
.skills-headline-stage {
  min-width: 165vw;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 100vw;
  padding-right: 6vw;
}

.skills-headline {
  font-size: clamp(4.5rem, 13vw, 10.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.92;
  white-space: nowrap;
  margin: 0;
}

.skills-headline-char-wrap {
  display: inline-block;
  vertical-align: top;
  perspective: 600px;
  transform-style: preserve-3d;
  overflow: visible;
}

.skills-headline-char {
  display: inline-block;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.skills-carousel-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 2;
 
}

.skills-carousel-stage.is-active {
  visibility: visible;
}

.skills-carousel-name-list {
  position: absolute;
  top: 50%;
  left: clamp(30%, 36vw, 40%);
  width: 0;
  height: 0;
  z-index: 5;
  pointer-events: none;
}

.skills-carousel-name-row {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  font-size: clamp(1.2rem, 2.4vw, 1.95rem);
  /* Heavy, and haloed in the page background. These names sit directly on top
     of the sphere's second act — a full screen of thin dark wireframe lines at
     roughly their own weight — so at 400 with no separation they read as more
     of the mesh. The halo is the same cream as the page, so it is invisible
     anywhere the background is plain and only shows as breathing room where a
     line would otherwise cross a stem. GSAP owns this element's opacity
     (layoutSkillsStack), so legibility has to come from weight and contrast,
     never from raising the opacity here. */
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: #25212C;
  text-shadow:
    0 0 10px var(--bg),
    0 0 4px var(--bg),
    0 0 2px var(--bg);
  opacity: 0.35;
  will-change: transform, opacity;
  transform-origin: left center;
}

.skills-carousel-stage.is-active .skills-icon-track {
  pointer-events: auto;
}

.skills-icon-track {
  position: absolute;
  top: 50%;
  left: clamp(56%, 62vw, 66%);
  right: auto;
  width: 0;
  height: 0;
  z-index: 4;
  pointer-events: none;
}

.skills-icon-item {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform, opacity;
  transform-origin: center center;
}

.skills-icon-tile {
  width: clamp(154px, 14vw, 218px);
  height: clamp(154px, 14vw, 218px);
  background: transparent;
  border: none;
  box-shadow: none;
  transform: translate(-50%, -50%);
  user-select: none;
  pointer-events: auto;
  touch-action: none;
}

.skills-icon-model-host {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.skills-icon-model-host:active {
  cursor: grabbing;
}

.skills-icon-model-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== Skills, small screens =====
 *
 * The pin, the fly-in and the carousel all survive — only the geometry
 * changes. The two columns (names left, tiles right) are far too tight side
 * by side on a phone, so the names move to the upper third and the tiles sit
 * centred below them, which is also why the tile column's left offset drops
 * to 50%.
 */
@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  .skills-headline-stage {
    /* The off-screen run-up is one viewport wide whatever the screen, so the
       stage only needs the headline's own width on top of it. */
    min-width: 200vw;
    padding-right: 10vw;
    /* Vertical bias out of dead centre, interpolated from SKILLS_MOBILE_LIFT
       so the sphere's canvas offset — which reads the same constant — can
       never drift off this line. Currently 0: see the note on the constant.
       Deliberately on the STAGE, not on .skills-headline: GSAP owns that
       element's transform (the descent tween) and .skills-track's (the
       horizontal fly-in), so this is the one box in the chain that no
       animation writes to. */
    transform: translateY(-${SKILLS_MOBILE_LIFT * 100}vh);
  }
  .skills-headline { font-size: clamp(3.4rem, 19vw, 6.5rem); }
  .skills-carousel-name-list { left: 8vw; top: 34%; }
  .skills-carousel-name-row { font-size: clamp(1.05rem, 4.8vw, 1.45rem); }
  /* Centred, and low enough that the names above never collide with a tile. */
  .skills-icon-track { left: 50%; top: 62%; }
  /* MUST mirror getSkillsCarouselMetrics' cardSize in animations/skills.ts. */
  .skills-icon-tile {
    width: clamp(118px, 32vw, 154px);
    height: clamp(118px, 32vw, 154px);
  }
}

@media (max-width: 900px) {
  /* Three nav columns cannot fit at this width, so the sub-items drop and the
     group titles collapse into one wrapped row under the mark. The sections
     stay reachable by scrolling; nothing here is the only route to a page. */
  .hero-ui-mark { width: 70px; left: 1rem; }
  .hero-nav {
    top: 5.2rem;
    left: 1rem;
    right: 1rem;
    flex-wrap: wrap;
    gap: 1.1rem;
  }
  .hero-nav-list { display: none; }
  .hero-nav-group-title { font-size: 0.8rem; margin-bottom: 0; gap: 0.4rem; }
  .hero-nav-glyph { width: 7px; height: 7px; }

  .hero-clock { top: 1rem; left: auto; right: 1rem; align-items: flex-end; }
  .hero-discover { display: none; }
  .hero-rule { display: none; }
  .hero-signal { display: none; }

  .hero-statement { top: 52%; font-size: clamp(0.95rem, 4.4vw, 1.4rem); }
  .hero-bracket { width: 5px; height: 5px; }
  .hero-bracket--tl, .hero-bracket--tr { top: -18px; }
  .hero-bracket--bl, .hero-bracket--br { bottom: -18px; }
  .hero-bracket--tl, .hero-bracket--bl { left: -8%; }
  .hero-bracket--tr, .hero-bracket--br { right: -8%; }
  .hero-era { margin-top: 1.6rem; }

  /* Full-width bar at the bottom instead of a floating card. */
  .hero-cta {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    padding: 0.9rem 1rem;
    text-align: center;
    font-size: 0.85rem;
  }
}

/* Narrow phones: the statement lines are nowrap so their three-line shape
   survives, but below this width a line can genuinely exceed the frame — at
   which point wrapping is better than being clipped by the page's
   overflow-x guard. */
@media (max-width: 430px) {
  .hero-statement {
    width: calc(100% - 2rem);
    font-size: clamp(0.9rem, 5vw, 1.2rem);
  }
  .hero-statement-line { white-space: normal; }
  .hero-nav { gap: 0.85rem; }
  .hero-nav-group-title { font-size: 0.72rem; }
  .hero-clock-meta { display: none; }
}

/*
 * Asymmetric on purpose. Skills contributes no top padding of its own, so this
 * bottom value alone sets the gap between one section's last line and whatever
 * the next section first puts on screen. At a symmetric 12rem that read as dead
 * scroll. Used by About and Experience only.
 */
.section-padded {
  padding-top: 9rem;
  padding-bottom: 6rem;
  padding-left: var(--pad-x);
  padding-right: var(--pad-x);
}

/* ===== About — mystic observatory ===== */
.about-mystic {
  position: relative;
  overflow: hidden;
  z-index: 1;
  background: var(--bg);
}

.about-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 4rem;
  align-items: center;
}

.about-logo-wrap {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
}
/* The tight viewBox is taller than wide, so height drives the fit and the
   mark spans the full box instead of sitting small inside it. */
/* No drop-shadow here, deliberately. This element is scrubbed: DrawSVG rewrites
   every path's stroke-dashoffset on each scroll frame, and any filter on the
   element has to re-rasterise and re-blur the whole ~560px box every time that
   happens — a 26px gaussian per frame for the entire length of the section.
   That was the frame-rate drop on entering About. The glow is supplied by the
   static .about-logo-glow layer behind it instead, which only animates opacity. */
.about-logo {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  display: block;
  overflow: visible;
  will-change: transform, opacity;
}
/* Picks up the halo the drop-shadow used to provide, at a fraction of the cost:
   one static gradient, painted once, animating opacity only. */
.about-logo-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(107,91,203,0.18) 0%, rgba(107,91,203,0.06) 45%, transparent 70%);
  pointer-events: none;
  animation: pulse-glow 5s ease-in-out infinite;
}

.about-headline {
  margin-bottom: 1.8rem;
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.18;
}
.about-headline-word {
  display: inline-block;
  margin-right: 0.28em;
  vertical-align: top;
}
.about-headline-word-inner { display: inline-block; }
/* No will-change here: the reveal fires once, and promoting every character to
   its own compositor layer for the whole page lifetime costs more than the
   single repaint it would save. */
.about-headline-char {
  display: inline-block;
  min-width: 0.22em;
}

.about-body {
  color: var(--muted);
  line-height: 1.85;
  font-size: 1.05rem;
  margin-bottom: 1.25rem;
  max-width: 56ch;
}

/* Editorial key/value rows. The hairline rules carry the structure, so there
   are no boxes, shadows or pseudo-element frames left to composite. */
.about-meta {
  /* dl/dd carry UA default margins that would break the flex row alignment */
  margin: 2.8rem 0 0;
  border-top: 1px solid rgba(107,91,203,0.22);
  max-width: 40ch;
}
.about-meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(107,91,203,0.22);
}
.about-meta-key {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}
.about-meta-value {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.01em;
}

.about-mantra {
  margin-top: 2.8rem;
  padding: 0.2rem 0 0.2rem 1.4rem;
  border-left: 1px solid rgba(107,91,203,0.4);
  color: rgba(37,33,44,0.6);
  font-style: italic;
  font-size: 1rem;
  line-height: 1.75;
  max-width: 48ch;
}

@media (max-width: 1024px) {
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .about-logo-wrap { max-width: 420px; }
  .about-content { text-align: left; }
}

@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  .about-logo-wrap { max-width: 260px; }
  .about-meta { max-width: none; margin-top: 2rem; }
  .about-body { font-size: 0.95rem; line-height: 1.75; }
  .about-meta-row { gap: 1rem; padding: 0.7rem 0; }
  .about-meta-value { font-size: 1rem; }
  .about-mantra { margin-top: 2rem; font-size: 0.92rem; padding-left: 1rem; }
  /* Section padding comes from .section-padded's own small-screen rule at the
     end of this sheet — both classes are on the section, and duplicating it
     here would just be a silent last-one-wins fight. */
}

/* First-load preloader: R [logo] H lockup + center-growing reveal */
.pl {
  position: fixed;
  inset: 0;
  z-index: 10050;
  pointer-events: none;
  overflow: hidden;
}

.pl-panel {
  position: fixed;
  background: var(--bg);
  will-change: transform;
}
.pl-top {
  top: 0;
  left: 0;
  width: 100vw;
  height: 51vh;
  transform-origin: top center;
}
.pl-bottom {
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 51vh;
  transform-origin: bottom center;
}
.pl-left {
  top: 0;
  left: 0;
  width: 51vw;
  height: 100vh;
  transform-origin: left center;
}
.pl-right {
  top: 0;
  right: 0;
  width: 51vw;
  height: 100vh;
  transform-origin: right center;
}

.pl-stage {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.pl-letter {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  display: block;
  font-weight: 500;
  font-size: clamp(7rem, 22vw, 20rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
  white-space: nowrap;
  will-change: transform, opacity;
}

.pl-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  height: clamp(6rem, 17vw, 15rem);
  width: auto;
  will-change: transform, opacity;
}

/* CSS fallback if GSAP is unavailable */
.pl.pl-exit {
  opacity: 0;
  transition: opacity 0.9s ease;
}

/* ===== Small screens: shared rhythm =====
 *
 * Kept last so these win over the section blocks above without needing
 * heavier selectors. Only spacing and type scale live here — every section's
 * own layout adjustments stay next to that section's rules.
 */
@media (max-width: ${MOBILE_MAX_WIDTH}px) {
  :root {
    /* 2rem of gutter on a 360px screen is a ninth of the width; 1.25rem keeps
       the same optical margin at phone scale. */
    --pad-x: 1.25rem;
  }
  .container { padding-left: 1.25rem; padding-right: 1.25rem; }
  .section-padded { padding-top: 5rem; padding-bottom: 3.5rem; }
  /* Nothing is allowed to widen the page: a single overflowing child turns
     the whole document into a horizontal scroller on touch. */
  body { overflow-x: hidden; }
}

/*
 * The custom cursor disables itself on coarse/hoverless pointers
 * (usePortfolioCursor). body and the interactive elements set cursor:none for
 * it, so on exactly those devices the native pointer must be handed back —
 * otherwise a tablet with a mouse attached has no visible cursor at all.
 */
@media (hover: none), (pointer: coarse) {
  body { cursor: auto; }
  .hero-ui a,
  .dock a,
  .dock button,
  .project-panel-row,
  .project-panel-media { cursor: pointer; }
}
`.trim();
