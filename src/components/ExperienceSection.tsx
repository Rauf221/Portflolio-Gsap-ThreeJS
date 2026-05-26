"use client";

import { type RefObject } from "react";
import { experience } from "../content/site";
import { EXPERIENCE_META } from "../data";

type Props = { experienceRef: RefObject<HTMLElement | null> };

export function ExperienceSection({ experienceRef }: Props) {
  const experiences = EXPERIENCE_META;

  return (
    <section
      id="experience"
      ref={experienceRef}
      style={{ position: "relative", overflow: "hidden", zIndex: 1 }}
      className="section-padded"
    >
      {/* ambient bg */}
      <div
        className="section-bg"
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(155,148,255,0.05) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <style>{`
        .exp-card {
          position: relative;
          border: 1px solid rgba(155,148,255,0.12);
          border-radius: 24px;
          padding: 2.5rem 2.75rem;
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          transition: border-color 0.35s, background 0.35s, transform 0.35s;
          cursor: none;
        }
        .exp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, var(--indigo), var(--sphere));
          transform: scaleY(0);
          transform-origin: top center;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          border-radius: 0 2px 2px 0;
        }
        .exp-card:hover {
          border-color: rgba(155,148,255,0.3);
          background: rgba(255,255,255,0.04);
          transform: translateY(-4px);
        }
        .exp-card:hover::before {
          transform: scaleY(1);
        }
        .exp-card-index {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          font-size: clamp(3.5rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.06em;
          color: rgba(155,148,255,0.06);
          font-family: 'Exo 2', sans-serif;
          pointer-events: none;
          transition: color 0.35s;
        }
        .exp-card:hover .exp-card-index {
          color: rgba(155,148,255,0.13);
        }
        .exp-period-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Exo 2', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sphere);
          background: rgba(155,148,255,0.08);
          border: 1px solid rgba(155,148,255,0.18);
          border-radius: 100px;
          padding: 0.3rem 0.85rem;
          margin-bottom: 1.25rem;
        }
        .exp-period-badge::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--sphere);
          flex-shrink: 0;
        }
        .exp-role {
          font-family: 'Exo 2', sans-serif;
          font-size: clamp(1.15rem, 2vw, 1.45rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 0.3rem;
          line-height: 1.2;
        }
        .exp-company {
          font-size: 0.85rem;
          color: var(--indigo);
          margin-bottom: 1.1rem;
          font-family: 'Exo 2', sans-serif;
          font-weight: 500;
        }
        .exp-desc {
          color: rgba(240,237,232,0.5);
          font-size: 0.88rem;
          line-height: 1.75;
          max-width: 52ch;
        }

        /* grid layout */
        .exp-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.25rem;
        }
        /* each card occupies different column spans for asymmetry */
        .exp-grid-item:nth-child(1) { grid-column: 1 / 8; }
        .exp-grid-item:nth-child(2) { grid-column: 8 / 13; }
        .exp-grid-item:nth-child(3) { grid-column: 1 / 6; }
        .exp-grid-item:nth-child(4) { grid-column: 6 / 13; }
        .exp-grid-item:nth-child(5) { grid-column: 2 / 9; }
        .exp-grid-item:nth-child(6) { grid-column: 9 / 13; }
        /* fallback for more cards */
        .exp-grid-item:nth-child(n+7) { grid-column: 1 / -1; }

        @media (max-width: 900px) {
          .exp-grid-item { grid-column: 1 / -1 !important; }
        }

        /* header */
        .exp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .exp-header-count {
          font-family: 'Exo 2', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: rgba(240,237,232,0.3);
          text-transform: uppercase;
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(155,148,255,0.2);
          white-space: nowrap;
        }
        .exp-title-block { display: flex; flex-direction: column; gap: 1rem; }
        .exp-section-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .exp-headline {
          font-family: 'Exo 2', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--text);
        }
        .exp-headline em {
          font-style: normal;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(120deg, var(--indigo), var(--sphere));
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="exp-header">
          <div className="exp-title-block">
            <div className="exp-section-label">
              <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
              <span
                className="font-mono"
                style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--sphere)", textTransform: "uppercase" }}
              >
                {experience.label}
              </span>
            </div>
            <h2 className="exp-headline">
              Where I've <em>shipped.</em>
            </h2>
          </div>
          <span className="exp-header-count">
            {String(experiences.length).padStart(2, "0")} positions
          </span>
        </div>

        {/* Asymmetric bento grid */}
        <div className="exp-grid">
          {experiences.map((exp, i) => {
            const item = experience.items[exp.key];
            return (
              <div key={exp.key} className="exp-grid-item">
                <div className="exp-card exp-item">
                  {/* large ghost index */}
                  <span className="exp-card-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* period badge */}
                  <div className="exp-period-badge">{item.period}</div>

                  {/* content */}
                  <div className="exp-role">{item.role}</div>
                  <div className="exp-company">{item.company}</div>
                  <p className="exp-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}