"use client";

import { footer } from "../content/site";

/* Registration marks — small squares on a full-bleed 3×3 grid, like the ref. */
const MARKS = [
  { l: "var(--fpad)", t: "0%" },
  { l: "50%", t: "0%" },
  { l: "calc(100% - var(--fpad))", t: "0%" },
  { l: "var(--fpad)", t: "50%" },
  { l: "50%", t: "50%" },
  { l: "calc(100% - var(--fpad))", t: "50%" },
  { l: "var(--fpad)", t: "100%" },
  { l: "50%", t: "100%" },
  { l: "calc(100% - var(--fpad))", t: "100%" },
];

export function SiteFooter() {
  return (
    <footer className="rk-footer">
      <style>{`
        .rk-footer {
          --fpad: clamp(1.25rem, 2.5vw, 2.5rem);
          position: relative;
          z-index: 2;
          background: var(--text);      /* #25212C — inverted dark panel */
          color: var(--bg);             /* cream */
          min-height: min(100vh, 940px);
          display: flex;
          flex-direction: column;
          overflow: hidden;             /* the slogan bleeds past the edges */
        }

        /* ── contact zone (full-bleed grid with corner marks) ── */
        .rk-contact {
          position: relative;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: clamp(3rem, 8vh, 5.5rem) var(--fpad) clamp(3.5rem, 9vh, 6rem);
        }
        .rk-mark {
          position: absolute;
          width: 7px; height: 7px;
          background: rgba(255,248,231,0.5);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .rk-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: clamp(2.5rem, 8vh, 5.5rem);
        }
        .rk-col-r { justify-content: flex-start; gap: 0; }

        .rk-item {
          position: relative;
          width: fit-content;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--bg);
          text-decoration: none;
          line-height: 1.2;
          font-size: clamp(1.3rem, 2.5vw, 2rem);
          transition: color 0.3s;
          white-space: nowrap;
        }
        .rk-muted { color: rgba(255,248,231,0.55); }
        .rk-item .rk-arrow {
          display: inline-block;
          margin-left: 0.15em;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .rk-item[href]::after {
          content: '';
          position: absolute;
          left: 0; bottom: -0.18em;
          width: 100%; height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .rk-item[href]:hover { color: var(--sphere); }
        .rk-item[href]:hover::after { transform: scaleX(1); }
        .rk-item[href]:hover .rk-arrow { transform: translate(4px, -4px); }

        /* ── crossed-marker above the band ── */
        .rk-x {
          align-self: center;
          width: 34px; height: 34px;
          margin-bottom: clamp(1.5rem, 4vh, 3rem);
          color: rgba(255,248,231,0.75);
        }
        .rk-x svg { width: 100%; height: 100%; display: block; }

        /* ── purple slogan band (full bleed, text overflows both edges) ── */
        .rk-band {
          width: 100%;
          background: var(--sphere);    /* indigo #6B5BCB */
          overflow: hidden;
          display: flex;
          justify-content: center;
          will-change: clip-path;
        }
        .rk-slogan {
          font-family: var(--font-sans-project);
          font-weight: 800;
          font-size: clamp(3.5rem, 14vw, 14rem);
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: var(--text);           /* dark ink on the purple band */
          white-space: nowrap;
          padding: 0.06em 0;
          text-transform: none;
        }

        /* ── bottom info strip: four columns, vertical dividers ── */
        .rk-info {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,248,231,0.14);
        }
        .rk-info-col {
          padding: clamp(1rem, 2.5vh, 1.6rem) 1.25rem;
          text-align: center;
          font-size: clamp(0.82rem, 1vw, 0.95rem);
          line-height: 1.4;
          color: var(--bg);
          text-decoration: none;
          transition: color 0.3s;
        }
        .rk-info-col + .rk-info-col { border-left: 1px solid rgba(255,248,231,0.14); }
        .rk-info-col .l2 { color: rgba(255,248,231,0.55); }
        a.rk-info-col:hover, a.rk-info-col:hover .l2 { color: var(--sphere); }

        @media (max-width: 760px) {
          .rk-contact { grid-template-columns: 1fr; row-gap: 2.5rem; }
          .rk-col-r { margin-top: 2.5rem; }
          .rk-mark:nth-child(2), .rk-mark:nth-child(5), .rk-mark:nth-child(8) { display: none; }
          .rk-info { grid-template-columns: 1fr 1fr; }
          .rk-info-col:nth-child(3) { border-left: none; }
          .rk-info-col:nth-child(n+3) { border-top: 1px solid rgba(255,248,231,0.14); }
        }
      `}</style>

      {/* contact zone */}
      <div className="rk-contact">
        {MARKS.map((m, i) => (
          <span key={i} className="rk-mark" style={{ left: m.l, top: m.t }} />
        ))}

        <div className="rk-col">
          <a className="rk-item" href={`mailto:${footer.email}`}>
            {footer.email} <span className="rk-arrow">→</span>
          </a>
          <a className="rk-item" href={footer.ctaHref}>
            {footer.cta} <span className="rk-arrow">→</span>
          </a>
        </div>

        <div className="rk-col rk-col-r">
          <span className="rk-item rk-muted">{footer.location}</span>
        </div>
      </div>

      {/* crossed mark */}
      <div className="rk-x" aria-hidden="true">
        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8 L30 26 M30 8 L4 26" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="4" cy="8" r="1.4" fill="currentColor" />
          <circle cx="30" cy="8" r="1.4" fill="currentColor" />
          <circle cx="4" cy="26" r="1.4" fill="currentColor" />
          <circle cx="30" cy="26" r="1.4" fill="currentColor" />
        </svg>
      </div>

      {/* purple slogan band */}
      <div className="rk-band">
        <span className="rk-slogan">{footer.slogan}</span>
      </div>

      {/* bottom info strip */}
      <div className="rk-info">
        {footer.infoColumns.map((c, i) =>
          c.href ? (
            <a key={i} className="rk-info-col" href={c.href} target="_blank" rel="noreferrer">
              <div className="l1">{c.line1}</div>
              <div className="l2">{c.line2}</div>
            </a>
          ) : (
            <div key={i} className="rk-info-col">
              <div className="l1">{c.line1}</div>
              <div className="l2">{c.line2}</div>
            </div>
          ),
        )}
      </div>
    </footer>
  );
}
