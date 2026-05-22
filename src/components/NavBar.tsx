"use client";

import { type RefObject } from "react";
import { nav } from "../content/site";
import { NAV_SECTION_IDS } from "../data";
import { scrollToSection } from "../lib/scroll";

type Props = {
  navRef: RefObject<HTMLElement | null>;
  activeSection: string;
};

export function NavBar({ navRef, activeSection }: Props) {
  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "linear-gradient(to bottom, rgba(8,8,16,0.8) 0%, transparent 100%)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--indigo), var(--sphere))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span className="font-mono" style={{ fontSize: "0.7rem", color: "#fff", fontWeight: 700 }}>
              {nav.initials}
            </span>
          </div>
          <span
            className="font-display"
            style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}
          >
            {nav.brand}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {NAV_SECTION_IDS.map((s) => (
              <a
                key={s}
                className={`nav-link ${activeSection === s ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(s);
                }}
                href={`#${s}`}
              >
                {nav.sections[s]}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="btn-primary nav-cta"
            style={{ fontSize: "0.75rem", padding: "0.6rem 1.4rem", whiteSpace: "nowrap" }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            {nav.hireMe}
          </a>
        </div>
      </div>
    </nav>
  );
}
