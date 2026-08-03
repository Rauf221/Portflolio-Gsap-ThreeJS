/** Inline global styles for the portfolio page (fonts, tokens, utilities). */
export const PORTFOLIO_GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #FFF8E7;
  --bg2: #F5F0E4;
  --indigo: #6B5BCB;
  --sphere: #6B5BCB;
  --sphere-dim: #6B5BCB;
  --sphere-glow: rgba(107,91,203,0.4);
  --text: #25212C;
  --muted: rgba(37,33,44,0.6);
  --border: rgba(107,91,203,0.28);
  --glass: rgba(37,33,44,0.04);
  --max-w: 1440px;
  --pad-x: max(2rem, calc((100vw - var(--max-w)) / 2 + 2rem));

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
  font-family: 'Hanken Grotesk', sans-serif;
  overflow-x: hidden;
  cursor: none;
}
body::before {
  content: '';
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(107,91,203,0.12) 0%, transparent 70%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
::selection { background: var(--sphere); color: #FFF8E7; }
::-webkit-scrollbar { width: 4px; background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--sphere); border-radius: 2px; }

.font-display { font-family: 'Hanken Grotesk', sans-serif; }
.font-mono { font-family: 'Hanken Grotesk', sans-serif; }
.overflow-clip { overflow: hidden; }
.perspective { perspective: 1200px; }

.container {
  width: 100%;
  max-width: var(--max-w);
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.glow-sphere { box-shadow: 0 0 40px var(--sphere-glow), 0 0 80px rgba(107,91,203,0.15); }
.text-glow { text-shadow: 0 0 40px rgba(107,91,203,0.6); }

.glass {
  background: var(--glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border);
}

.grad-indigo {
  background: linear-gradient(135deg, var(--indigo), #25212C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-hot { background: linear-gradient(135deg, #6B5BCB, #25212C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

@keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }

.skill-bar-fill { transform-origin: left center; }

.project-card { transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275); cursor: none; }
.project-card:hover { transform: translateY(-12px) scale(1.02) !important; }
.project-card:hover .project-img-overlay { opacity: 0; }

.projects-section { position: relative; z-index: 1; width: 100%; background: transparent; }
.projects-path-scroll {
  position: relative;
}
.projects-path-stage {
  position: relative;
  width: 100%;
  height: 100vh;
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
}
.projects-path-text {
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 118px;
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
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 118px;
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
  margin-top: -100vh;   
  background: var(--bg); 
}
.projects-intro-count {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}
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
  height: calc(100vh + var(--scroll-units, var(--swaps, 1)) * 70vh);
}
.projects-sticky-list {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
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
.project-panel-img {
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
.project-panel-title {
  font-size: clamp(1.9rem, 3.2vw, 3.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 14px;
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
.project-panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0 0 clamp(0.9rem, 1.6vw, 1.4rem);
  border-radius: 12px;
  background: color-mix(in srgb, var(--panel-accent) 11%, var(--bg));
  overflow: hidden;
}
.project-panel-row-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.35;
  padding: 1rem 0;
}
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
}
.project-panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(1.75rem, 4vh, 3rem);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.project-panel-footer-label { color: var(--muted); }
.project-panel-footer-label::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 9px;
  border-radius: 50%;
  vertical-align: middle;
  background: var(--panel-accent);
}
.project-panel-footer-count { font-weight: 600; }
.project-panel-footer-count > span { color: var(--muted); font-weight: 400; }
@media (max-width: 900px) {
  .project-panel-inner { flex-direction: column; gap: 0.75rem; }
  .project-panel-media { flex: 0 0 40%; min-height: 0; }
  .project-panel-info { flex: 1; min-height: 0; justify-content: flex-start; padding: 0.5rem 0.75rem 1rem; }
  .project-panel-desc { margin-bottom: 16px; }
  .project-panel-rows { gap: 6px; }
  .project-panel-row-label { padding: 0.7rem 0; font-size: 0.7rem; }
  .project-panel-row-icon { width: 42px; }
  .project-panel-footer { margin-top: 1.25rem; }
}

.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, var(--indigo), #25212C);
  color: #FFF8E7; font-family: 'Hanken Grotesk', sans-serif; font-weight: 700;
  font-size: 0.9rem; letter-spacing: 0.05em;
  padding: 0.85rem 2rem; border-radius: 100px; border: none;
  cursor: none; transition: all 0.3s; text-decoration: none;
  box-shadow: 0 8px 32px var(--sphere-glow);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(107,91,203,0.6); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: transparent;
  color: var(--text); font-family: 'Hanken Grotesk', sans-serif; font-weight: 600;
  font-size: 0.9rem; letter-spacing: 0.05em;
  padding: 0.85rem 2rem; border-radius: 100px;
  border: 1px solid rgba(37,33,44,0.2);
  cursor: none; transition: all 0.3s; text-decoration: none;
}
.btn-ghost:hover { border-color: var(--sphere); color: var(--sphere); background: rgba(107,91,203,0.08); }

.exp-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--sphere);
  box-shadow: 0 0 0 4px rgba(107,91,203,0.2), 0 0 20px rgba(107,91,203,0.5);
}

/* ===== Hero ===== */

.hero-fade-bottom {
  display: none;
}

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
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
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

@media (max-width: 700px) {
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
  font-size: clamp(1.05rem, 2.1vw, 1.65rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: #25212C;
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

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 2rem;
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

@media (max-width: 700px) {
  .about-logo-wrap { max-width: 320px; }
  .about-meta { max-width: none; }
  .about-mystic { padding-top: 6rem; padding-bottom: 4rem; }
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
`.trim();
