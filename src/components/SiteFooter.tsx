"use client";

import { footer } from "../content/site";

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(155,148,255,0.1)",
        padding: "2rem 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="footer-inner">
        <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
          {footer.line1}
        </span>
        <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
          {footer.line2}
        </span>
      </div>
    </footer>
  );
}
