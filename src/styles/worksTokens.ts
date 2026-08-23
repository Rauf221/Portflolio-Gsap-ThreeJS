/*
 * The base every /works page shares: brand tokens, the page ground, and the
 * reveal hooks the archive and the detail pages both animate.
 *
 * It exists because there are now two sheets in this family (worksCssString and
 * workDetailCssString) and a third hand-copied token block was one too many.
 * The values themselves are still a deliberate copy of globalCssString's — the
 * home page never renders alongside these, and pulling in its 1500-line sheet
 * just to learn what --indigo is would be worse. Change the brand ink here AND
 * there.
 *
 * These files are JS template literals: no backticks anywhere inside them.
 */
export const WORKS_BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #FFF8E7;
  --bg2: #F5F0E4;
  --indigo: #6B5BCB;
  --sphere: var(--indigo);
  --text: #25212C;
  --muted: rgba(37,33,44,0.6);
  --line: rgba(37,33,44,0.12);
  --max-w: 1440px;
  --pad-x: max(2rem, calc((100vw - var(--max-w)) / 2 + 2rem));
  --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
html { scroll-behavior: auto; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans-project);
  overflow-x: hidden;
  cursor: none;
}
/* The same wash and grain the home page carries, so every surface on the site
   reads as one ground rather than several similar creams. */
body::before {
  content: '';
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(107,91,203,0.12) 0%, transparent 70%),
              var(--noise);
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
::selection { background: var(--indigo); color: #FFF8E7; }
::-webkit-scrollbar { width: 4px; background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 2px; }

/* Rendered for assistive tech, invisible on screen. */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* The small-caps label used for every eyebrow and key on these pages. */
.works-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.works-grad {
  background: linear-gradient(135deg, var(--indigo), #25212C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* The two reveal hooks both pages animate. Their RESTING state is the finished
   state — every animation is a from-tween — so a reduced-motion visitor, or one
   whose scripts never arrived, reads the page as composed. */
.wk-rise, .wk-word { will-change: transform, opacity; }
.wk-word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.12em;
}
.wk-word { display: inline-block; }
`;

/*
 * Closing rules for both sheets: the custom cursor disables itself on coarse or
 * hoverless pointers, so those devices must get their native pointer back —
 * otherwise a tablet with a mouse attached has no visible cursor at all.
 * Appended LAST so it wins over the section blocks without heavier selectors.
 */
export const WORKS_CURSOR_CSS = `
@media (hover: none), (pointer: coarse) {
  body { cursor: auto; }
  .works-root a,
  .works-root button,
  .wd-root a,
  .wd-root button,
  .work-card-media { cursor: pointer; }
}
`;
