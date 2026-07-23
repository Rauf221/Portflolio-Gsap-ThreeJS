"use client";

import { type RefObject } from "react";
import { experience } from "../content/site";
import { EXPERIENCE_META } from "../data";

type Props = { experienceRef: RefObject<HTMLElement | null> };

export function ExperienceSection({ experienceRef }: Props) {
  const experiences = EXPERIENCE_META;
  const t = experience.tunnel;

  return (
    <section id="experience" ref={experienceRef} style={{ position: "relative", zIndex: 1 }}>
      {/* kept transparent — the shared `.section-bg` parallax loop expects it */}
      <div className="section-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        /* Vanishing point, pinned to the fixed Three.js canvas's own centre:
           the canvas is top:0, height 900, horizontally centred — so its sphere
           sits at (50%, 450px). Everything in the tunnel converges there. */
        #experience { --exp-vp: 450px; }

        .exp-stage {
          position: relative;
          height: 100vh;
          min-height: 620px;
          overflow: hidden;
          perspective: 900px;
          perspective-origin: 50% var(--exp-vp);
          /* mostly transparent so the sphere canvas shows through; a faint
             indigo halo sits under the sphere to tie it into the scene */
          background: radial-gradient(circle at 50% var(--exp-vp),
            rgba(107,91,203,0.14), rgba(107,91,203,0) 40%);
        }

        /* Radial sunburst converging on the vanishing point (masked clear in the
           very centre so the sphere stays crisp, and faded out toward the rim). */
        .exp-rays {
          position: absolute;
          left: 50%; top: var(--exp-vp);
          width: 240vmax; height: 240vmax;
          transform: translate(-50%, -50%);
          background: repeating-conic-gradient(from 0deg,
            rgba(107,91,203,0.10) 0deg 0.34deg,
            transparent 0.34deg 3deg);
          -webkit-mask: radial-gradient(closest-side, transparent 6%, #000 25%, #000 54%, transparent 82%);
          mask: radial-gradient(closest-side, transparent 6%, #000 25%, #000 54%, transparent 82%);
          pointer-events: none;
          z-index: 1;
          animation: exp-rays-spin 120s linear infinite;
        }
        @keyframes exp-rays-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

        /* Giant headline laid on the floor, receding toward the vanishing point.
           Transform (rotateX + z drift) is written by GSAP each frame. */
        .exp-floortext {
          position: absolute;
          left: 50%; top: var(--exp-vp);
          margin: 0;
          font-family: 'Hanken Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(3.25rem, 10.5vw, 10.5rem);
          line-height: 0.84;
          letter-spacing: -0.045em;
          text-align: center;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 2;
          will-change: transform, opacity;
        }
        .exp-floortext span {
          display: block;
          color: transparent;
          background: linear-gradient(180deg, var(--indigo), rgba(107,91,203,0.12));
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .exp-floortext .yr {
          background: linear-gradient(180deg, var(--sphere), rgba(107,91,203,0.08));
          -webkit-background-clip: text; background-clip: text;
        }

        .exp-objects {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 3;
          pointer-events: none;
        }

        .exp-object {
          position: absolute;
          left: 50%; top: var(--exp-vp);
          width: min(360px, 78vw);
          padding: 1.5rem 1.6rem 1.65rem;
          border-radius: 20px;
          border: 1px solid rgba(107,91,203,0.26);
          background: rgba(255,248,231,0.74);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 34px 90px -32px rgba(37,33,44,0.5),
            0 0 0 1px rgba(255,255,255,0.4) inset;
          overflow: hidden;
          opacity: 0; /* GSAP reveals as the card enters the tunnel */
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .exp-object-index {
          position: absolute;
          top: 0.75rem; right: 1.15rem;
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.06em;
          color: rgba(107,91,203,0.10);
          pointer-events: none;
        }
        .exp-object-period {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sphere);
          background: rgba(107,91,203,0.08);
          border: 1px solid rgba(107,91,203,0.18);
          border-radius: 100px;
          padding: 0.28rem 0.8rem;
          margin-bottom: 1.05rem;
        }
        .exp-object-period::before {
          content: '';
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--sphere); flex-shrink: 0;
        }
        .exp-object-company {
          font-size: clamp(1.1rem, 1.7vw, 1.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--text);
          margin-bottom: 0.28rem;
        }
        .exp-object-role {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--indigo);
          margin-bottom: 0.85rem;
        }
        .exp-object-desc {
          font-size: 0.8rem;
          line-height: 1.6;
          color: rgba(37,33,44,0.55);
        }

        /* Fixed overlay chrome (label + scroll hint) that rides the pin. */
        .exp-head {
          position: absolute;
          top: clamp(1.5rem, 4vh, 2.75rem);
          left: var(--pad-x);
          z-index: 6;
          pointer-events: none;
        }
        .exp-head-title {
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          font-weight: 800; letter-spacing: -0.03em; color: var(--text);
        }
        .exp-hint {
          position: absolute;
          bottom: 1.75rem; left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          font-size: 0.66rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--muted);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          pointer-events: none;
        }
        .exp-hint::after {
          content: '';
          width: 1px; height: 26px;
          background: linear-gradient(var(--sphere), transparent);
          animation: exp-hint-pulse 1.8s ease-in-out infinite;
        }
        @keyframes exp-hint-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

        /* ── Flat fallback (reduced motion / small screens): plain readable stack ── */
        .exp--flat .exp-stage {
          height: auto; min-height: 0; overflow: visible;
          perspective: none; background: none;
          padding: 5rem 0 6rem;
        }
        .exp--flat .exp-rays,
        .exp--flat .exp-floortext,
        .exp--flat .exp-hint { display: none; }
        .exp--flat .exp-head {
          position: relative; top: auto; left: auto;
          max-width: 640px; margin: 0 auto 2.5rem; padding: 0 1.5rem;
        }
        .exp--flat .exp-objects {
          position: relative; inset: auto; transform: none;
          display: flex; flex-direction: column; gap: 1.1rem;
          max-width: 640px; margin: 0 auto; padding: 0 1.5rem;
          pointer-events: auto;
        }
        .exp--flat .exp-object {
          position: relative; left: auto; top: auto; width: auto;
          transform: none !important;
          opacity: 1 !important; visibility: visible !important;
        }
      `}</style>

      <div className="exp-stage">
        <div className="exp-rays" aria-hidden="true" />

        <div className="exp-floortext" aria-hidden="true">
          <span>{t.line1}</span>
          <span>{t.line2}</span>
          <span>{t.line3}</span>
          <span className="yr">{t.year}</span>
        </div>

        <div className="exp-head">
          <h2 className="exp-head-title">{t.headline}</h2>
        </div>

        <div className="exp-objects">
          {experiences.map((exp, i) => {
            const item = experience.items[exp.key];
            return (
              <article key={exp.key} className="exp-object">
                <span className="exp-object-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="exp-object-period">{item.period}</div>
                <div className="exp-object-company">{item.company}</div>
                <div className="exp-object-role">{item.role}</div>
                <p className="exp-object-desc">{item.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="exp-hint" aria-hidden="true">{t.hint}</div>
      </div>
    </section>
  );
}
