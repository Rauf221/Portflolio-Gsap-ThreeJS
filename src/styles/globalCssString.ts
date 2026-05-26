/** Inline global styles for the portfolio page (fonts, tokens, utilities). */
export const PORTFOLIO_GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #080810;
  --bg2: #0d0d1a;
  --indigo: #6C63FF;
  --sphere: #9b94ff;
  --sphere-dim: #7a74d4;
  --sphere-glow: rgba(155,148,255,0.4);
  --text: #F0EDE8;
  --muted: rgba(240,237,232,0.45);
  --border: rgba(155,148,255,0.2);
  --glass: rgba(255,255,255,0.04);
  --max-w: 1440px;
  --pad-x: max(2rem, calc((100vw - var(--max-w)) / 2 + 2rem));
}
html { scroll-behavior: auto; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Exo 2', sans-serif;
  overflow-x: hidden;
  cursor: none;
}
body::before {
  content: '';
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(155,148,255,0.12) 0%, transparent 70%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
::selection { background: var(--sphere); color: #fff; }
::-webkit-scrollbar { width: 4px; background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--sphere); border-radius: 2px; }

.font-display { font-family: 'Exo 2', sans-serif; }
.font-mono { font-family: 'Exo 2', sans-serif; }
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

.glow-sphere { box-shadow: 0 0 40px var(--sphere-glow), 0 0 80px rgba(155,148,255,0.15); }
.text-glow { text-shadow: 0 0 40px rgba(155,148,255,0.6); }

.glass {
  background: var(--glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border);
}

.grad-indigo {
  background: linear-gradient(135deg, var(--indigo), var(--sphere));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-hot { background: linear-gradient(135deg, #FF6B6B, #FFD93D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

@keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }

.nav-link {
  position: relative;
  color: var(--muted);
  font-size: 0.8rem;
  font-family: 'Exo 2', sans-serif;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.3s;
  cursor: none;
  text-decoration: none;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0; right: 0;
  height: 1px;
  background: var(--sphere);
  transform: scaleX(0);
  transition: transform 0.3s;
}
.nav-link:hover, .nav-link.active { color: var(--text); }
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

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
.projects-path-label {
  position: absolute;
  top: 6rem;
  left: var(--pad-x);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  will-change: transform;
}
.projects-intro-line { width: 32px; height: 1px; background: var(--sphere); }
.projects-path-label span {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--sphere);
  text-transform: uppercase;
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
  font-family: 'Exo 2', sans-serif;
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
  font-family: 'Exo 2', sans-serif;
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
}
.projects-intro-count {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}
.projects-sticky-list { position: relative; width: 100%; background: transparent; }
.project-panel {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 0;
  background: var(--bg2);
}
.project-panel-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0;
  background: var(--bg2);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  will-change: transform, filter;
  transform-origin: center top;
}
.project-panel-body {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
.project-panel-visual {
  flex: 0 0 52%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: color-mix(in srgb, var(--panel-accent) 14%, var(--bg2));
  overflow: hidden;
  will-change: transform;
}
.project-panel-screen {
  width: 72%;
  aspect-ratio: 16 / 10;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: var(--bg2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.project-panel-screen-bar {
  height: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 5px;
  background: var(--bg);
}
.project-panel-screen-dot { width: 7px; height: 7px; border-radius: 50%; opacity: 0.6; }
.project-panel-screen-body {
  flex: 1;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.project-panel-block {
  border-radius: 5px;
  background: color-mix(in srgb, var(--panel-accent) 22%, var(--bg2));
}
.project-panel-block-wide { grid-column: 1 / -1; height: 44px; }
.project-panel-block-sm { height: 20px; }
.project-panel-block-xs { height: 26px; }
.project-panel-block-fade { background: color-mix(in srgb, var(--panel-accent) 12%, var(--bg2)); }
.project-panel-index {
  position: absolute;
  bottom: 20px;
  right: 24px;
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 500;
  line-height: 1;
  opacity: 0.06;
  letter-spacing: -0.04em;
}
.project-panel-info {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: clamp(2rem, 5vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg);
}
.project-panel-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 12px;
  color: var(--muted);
}
.project-panel-meta-line { width: 48px; height: 1px; background: rgba(255,255,255,0.1); }
.project-panel-year {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
}
.project-panel-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 6px;
}
.project-panel-subtitle {
  font-size: 0.85rem;
  color: var(--panel-accent);
  margin-bottom: 20px;
}
.project-panel-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 28px;
  max-width: 420px;
}
.project-panel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 32px;
}
.project-panel-tag {
  background: color-mix(in srgb, var(--panel-accent) 18%, var(--bg2));
  border: 1px solid color-mix(in srgb, var(--panel-accent) 40%, var(--bg2));
  color: var(--panel-accent);
  font-size: 0.7rem;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
}
.project-panel-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  padding-bottom: 2px;
}
@media (max-width: 900px) {
  .project-panel-body { flex-direction: column !important; min-height: 100vh; height: 100vh; }
  .project-panel-visual { flex: 1; min-height: 0; width: 100%; }
  .project-panel-info { flex: 1; min-height: 0; padding: 2rem 1.5rem 2.5rem; }
}

.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, var(--indigo), var(--sphere));
  color: #fff; font-family: 'Exo 2', sans-serif; font-weight: 700;
  font-size: 0.9rem; letter-spacing: 0.05em;
  padding: 0.85rem 2rem; border-radius: 100px; border: none;
  cursor: none; transition: all 0.3s; text-decoration: none;
  box-shadow: 0 8px 32px var(--sphere-glow);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(155,148,255,0.6); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: transparent;
  color: var(--text); font-family: 'Exo 2', sans-serif; font-weight: 600;
  font-size: 0.9rem; letter-spacing: 0.05em;
  padding: 0.85rem 2rem; border-radius: 100px;
  border: 1px solid rgba(240,237,232,0.2);
  cursor: none; transition: all 0.3s; text-decoration: none;
}
.btn-ghost:hover { border-color: var(--sphere); color: var(--sphere); background: rgba(155,148,255,0.08); }

.exp-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--sphere);
  box-shadow: 0 0 0 4px rgba(155,148,255,0.2), 0 0 20px rgba(155,148,255,0.5);
}

.contact-input {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text); font-family: 'Exo 2', sans-serif; font-size: 1rem;
  padding: 1rem 1.25rem; border-radius: 12px; width: 100%;
  outline: none; transition: border-color 0.3s, box-shadow 0.3s;
}
.contact-input:focus { border-color: var(--sphere); box-shadow: 0 0 0 3px rgba(155,148,255,0.15); }
.contact-input::placeholder { color: var(--muted); }
textarea.contact-input { resize: vertical; min-height: 140px; }

.hero-grid {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 clamp(2rem, 5vw, 5rem);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.hero-inner {
  width: 100%;
  text-align: left;
  position: relative;
  z-index: 2;
  padding: 6rem 0 4rem;
}

.hero-visual {
  min-height: 420px;
  pointer-events: none;
}

.hero-scroll-hint {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 3;
}

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
  color: #f0ede8;
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
  .hero-grid {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 7rem;
    padding-bottom: 3rem;
  }
  .hero-inner { padding: 0 0 2rem; }
  .hero-visual { min-height: 280px; order: -1; }
  .hero-scroll-hint {
    bottom: 1.5rem;
  }
}

.section-padded {
  padding-top: 12rem;
  padding-bottom: 12rem;
  padding-left: var(--pad-x);
  padding-right: var(--pad-x);
}

.h-section-label {
  position: absolute;
  top: 4rem;
  left: var(--pad-x);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
`.trim();
