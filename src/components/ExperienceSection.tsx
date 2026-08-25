"use client";

import dynamic from "next/dynamic";
import { type RefObject } from "react";
import { experience } from "../content/site";
import { EXPERIENCE_META } from "../data/portfolioMeta";

/* Lazy so three stays out of the initial bundle — the same treatment
 * SkillModelViewer gets. ssr:false because the scene reads devicePixelRatio and
 * matchMedia at construction time. */
const ExperienceHallAtmosphere = dynamic(
  () => import("./ExperienceHallAtmosphere").then((m) => m.ExperienceHallAtmosphere),
  { ssr: false }
);

/** "2024 – Present" → "2024". The start year is the number worth setting at
 *  display size; the full span stays underneath it in small type. */
function startYear(period: string) {
  return period.split(/[–—-]/)[0].trim();
}

type Props = { experienceRef: RefObject<HTMLElement | null> };

export function ExperienceSection({ experienceRef }: Props) {
  const experiences = EXPERIENCE_META;
  const t = experience.tunnel;
  const play = experience.playground;

  return (
    <section id="experience" ref={experienceRef} style={{ position: "relative", zIndex: 1 }}>
      <style>{`
        /* ── The gravity playground ────────────────────────────────────────
           Gravity here points at the reader. Cards spawn deep in the dark near
           the centre of the frame — small, hazy, half-lost in the air — and
           fall along Z toward the camera, tumbling as they come. Catch one
           with the pointer (press and hold) and it stops falling, swims up to
           a readable plane and follows the hand; let go and it is thrown with
           the pointer's velocity before gravity takes it again. Miss one and
           it flies past the eye and respawns in the deep.

           Two layers, same division of labour as the hall this replaces:
             • WebGL (.hall-atmos) owns the AIR — light, haze, particulate,
               grain. Its centre glow is the light the cards emerge from.
             • CSS 3D owns the CARDS — rectangles with text on them, which is
               exactly what CSS 3D is good at, and it keeps the text
               selectable, crawlable and screen-readable.

           The physics lives in animations/experienceGravity.ts; this file owns
           only the markup and the paint. */
        #experience {
          --hall-void: #08070C;
          --hall-ink: #EDEAF7;
          --hall-dim: rgba(237,234,247,0.40);
          --hall-edge: #C9C0FF;
          --hall-accent: #9C8FE8;
          background: var(--hall-void);
        }

        .grav {
          position: relative;
          /* svh so the HUD's bottom row is never hidden under a mobile URL
             bar; the section background is the same void, so the sliver the
             bar sometimes frees up stays seamless. */
          height: 100svh;
          min-height: 640px;
          overflow: hidden;
          /* The one number the whole illusion hangs on. CSS stops drawing an
             element at z >= perspective, so the "missed, flew past the eye"
             threshold in experienceGravity.ts (NEAR_MISS) must stay below it. */
          perspective: 1400px;
          /* Resting value only — experienceGravity animates this inline
             (0.10 → 0.33 from the top) while the section slides into view,
             in lockstep with the shader's uHorizon and its own math. */
          perspective-origin: 50% 33%;
          background: var(--hall-void);
        }

        .hall-atmos {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 0;
          opacity: 0;                 /* the render loop raises this on entry */
          transition: opacity 0.6s ease;
          pointer-events: none;
        }

        .grav-field {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 2;
          /* The field itself never eats the pointer — only the cards do, so
             the rest of the frame stays scrollable. */
          pointer-events: none;
        }

        .grav-card {
          position: absolute;
          left: 0; top: 0;
          width: clamp(280px, 26vw, 360px);
          padding: 1.7rem 1.6rem 1.55rem;
          transform-style: preserve-3d;
          pointer-events: auto;
          /* Card drags must not turn into page scrolls on touch; the field
             around the cards still scrolls normally. */
          touch-action: none;
          cursor: grab;
          user-select: text;
          opacity: 0;                 /* the physics loop owns opacity from here */
          will-change: transform, opacity;
          border: 1px solid rgba(201,192,255,0.28);
          border-radius: 12px;
          background: linear-gradient(165deg,
            #100E1E 0%,
            #0B0A15 42%,
            #070610 100%);
          box-shadow:
            0 0 0 1px rgba(8,7,12,0.9),
            0 24px 70px -18px rgba(0,0,0,0.85),
            inset 0 1px 0 rgba(201,192,255,0.14);
        }
        .grav-card:active { cursor: grabbing; }

        /* Pre-spawn / parked cards must not be grabbable while invisible. */
        .grav-card--idle { pointer-events: none; }

        /* Deep in the air: washed toward the haze, slightly out of focus. The
           blur is a class toggle, not a per-frame write — filter changes are
           expensive and the tiers only flip at depth thresholds. */
        .grav-card--deep { filter: blur(1.2px) saturate(0.8); }

        /* Close to the eye: the card catches the hall light. */
        .grav-card--near {
          border-color: rgba(201,192,255,0.55);
          box-shadow:
            0 0 0 1px rgba(8,7,12,0.9),
            0 34px 90px -16px rgba(0,0,0,0.9),
            0 0 54px -8px rgba(156,143,232,0.38),
            inset 0 1px 0 rgba(201,192,255,0.22);
        }

        /* In the hand: held on the readable plane, lit like an object under a
           lamp rather than a thing in the air. */
        .grav-card--held {
          cursor: grabbing;
          border-color: rgba(201,192,255,0.8);
          box-shadow:
            0 0 0 1px rgba(8,7,12,0.9),
            0 44px 110px -14px rgba(0,0,0,0.95),
            0 0 74px -6px rgba(156,143,232,0.55),
            inset 0 1px 0 rgba(201,192,255,0.3);
        }

        /* Kill selection everywhere only while a drag is live — the copy stays
           selectable the rest of the time. Added to <body> by the physics
           module, removed on release and in its disposer. */
        body.grav-dragging, body.grav-dragging * {
          user-select: none;
          -webkit-user-select: none;
        }

        /* ── Card interior ── */
        .grav-year {
          display: block;
          font-size: clamp(2.6rem, 3.6vw, 3.4rem);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.055em;
          /* Etched rather than printed: the number falls off into the card
             instead of sitting on it. */
          background: linear-gradient(180deg,
            rgba(237,234,247,0.92), rgba(237,234,247,0.18));
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .grav-rule {
          width: 34px; height: 1px;
          background: rgba(201,192,255,0.4);
          margin: 0.95rem 0 0.9rem;
        }
        .grav-company {
          font-size: clamp(1.1rem, 1.6vw, 1.4rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.12;
          color: var(--hall-ink);
          margin: 0 0 0.3rem;
        }
        .grav-role {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--hall-accent);
          margin: 0 0 0.18rem;
        }
        .grav-period {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(237,234,247,0.3);
          margin-bottom: 0.85rem;
        }
        .grav-desc {
          font-size: 0.76rem;
          line-height: 1.62;
          color: var(--hall-dim);
          margin: 0;
        }

        /* Atmospheric perspective: a card deep in the frame washes toward the
           haze colour instead of merely dimming. The physics loop drives the
           opacity from depth, exactly as the hall drove .mono-haze. Rounded to
           match the card so the wash never leaks past the border. */
        .grav-haze {
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: 11px;
          background: #1A1830;
          pointer-events: none;
        }

        /* ── Fixed chrome ── */
        .grav-hud {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }
        .grav-head {
          position: absolute;
          top: clamp(1.5rem, 4vh, 2.75rem);
          left: var(--pad-x);
        }
        .grav-eyebrow {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(201,192,255,0.55);
          margin-bottom: 0.7rem;
        }
        .grav-title {
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          font-weight: 800; letter-spacing: -0.03em;
          color: var(--hall-ink);
          margin: 0;
        }

        .grav-hint {
          position: absolute;
          bottom: clamp(1.75rem, 5vh, 3rem); left: 50%;
          transform: translateX(-50%);
          font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(237,234,247,0.35);
          white-space: nowrap;
          transition: opacity 0.5s ease;
        }
        .grav-hint--done { display: none; }
        .grav-hud--done .grav-hint--catch { display: none; }
        .grav-hud--done .grav-hint--done {
          display: block;
          color: rgba(201,192,255,0.6);
        }

        .grav-count {
          position: absolute;
          right: var(--pad-x);
          bottom: clamp(1.75rem, 5vh, 3rem);
          display: flex;
          align-items: baseline;
          gap: 0.7rem;
          font-variant-numeric: tabular-nums;
        }
        .grav-count-label {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(237,234,247,0.35);
        }
        .grav-count-num {
          font-size: clamp(1.3rem, 2vw, 1.8rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--hall-edge);
        }

        /* ── Small screens ────────────────────────────────────────────────
           The playground runs on phones too (touch drags work through the
           same pointer events) — the cards just shrink so a held one still
           fits the frame with room to read. */
        @media (max-width: 700px) {
          .grav-card {
            width: clamp(220px, 74vw, 300px);
            padding: 1.3rem 1.25rem 1.2rem;
          }
          .grav-year { font-size: 2.2rem; }
          .grav-desc { font-size: 0.72rem; }
          .grav-head { max-width: 70vw; }
          /* Lifted clear of the floating dock, which spans the bottom edge
             on phones. */
          .grav-hint { bottom: clamp(4.5rem, 12vh, 6rem); }
          .grav-count { bottom: clamp(4.5rem, 12vh, 6rem); }
        }

        /* ── Flat fallback (reduced motion) ──────────────────────────────────
           No physics, no pin, no canvas — the cards simply stand and stack.
           This is also the keyboard / assistive-tech presentation. */
        .exp--flat .grav {
          height: auto; min-height: 0; overflow: visible;
          perspective: none;
          padding: 5rem 0 6rem;
        }
        .exp--flat .hall-atmos,
        .exp--flat .grav-hint,
        .exp--flat .grav-count,
        .exp--flat .grav-haze { display: none; }
        .exp--flat .grav-hud {
          position: relative; inset: auto;
        }
        .exp--flat .grav-head {
          position: relative; top: auto; left: auto;
          max-width: 660px; margin: 0 auto 2.75rem; padding: 0 1.5rem;
        }
        .exp--flat .grav-field {
          position: relative; inset: auto;
          display: flex; flex-direction: column; gap: 1rem;
          max-width: 660px; margin: 0 auto; padding: 0 1.5rem;
          pointer-events: auto;
        }
        .exp--flat .grav-card {
          position: relative; left: auto; top: auto;
          width: auto;
          transform: none !important;
          opacity: 1 !important;
          filter: none !important;
          cursor: default;
          touch-action: auto;
          pointer-events: auto;
        }
      `}</style>

      <div className="grav">
        <ExperienceHallAtmosphere />

        <div className="grav-field">
          {experiences.map((exp) => {
            const item = experience.items[exp.key];
            return (
              <article key={exp.key} className="grav-card grav-card--idle" data-cursor>
                <span className="grav-year">{startYear(item.period)}</span>
                <div className="grav-rule" aria-hidden="true" />
                <h3 className="grav-company">{item.company}</h3>
                <p className="grav-role">{item.role}</p>
                <span className="grav-period">{item.period}</span>
                <p className="grav-desc">{item.desc}</p>
                <div className="grav-haze" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <div className="grav-hud">
          <div className="grav-head">
            <span className="grav-eyebrow">Experience</span>
            <h2 className="grav-title">{t.headline}</h2>
          </div>

          <div className="grav-hint" aria-hidden="true">
            <span className="grav-hint--catch">{play.hint}</span>
            <span className="grav-hint--done">{play.done}</span>
          </div>

          <div className="grav-count" aria-hidden="true">
            <span className="grav-count-label">{play.caught}</span>
            <span className="grav-count-num">
              00 / {String(experiences.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
