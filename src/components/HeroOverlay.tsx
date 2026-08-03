"use client";

import { useEffect, useState, type RefObject } from "react";
import { heroNav } from "../content/site";
import { scrollToSection } from "../lib/scroll";
import { BrandMark } from "./BrandMark";

type Props = {
  heroUiRef: RefObject<HTMLDivElement | null>;
  /** Section id currently crossing mid-viewport; drives the .is-active link. */
  activeSection: string;
};

/*
 * Live clock. Rendered as a stable placeholder on the server and on the first
 * client paint (state starts null), then filled in from an effect — otherwise
 * the server HTML and the client HTML disagree and React logs a hydration
 * mismatch. Intl formats in a fixed zone so the value does not depend on the
 * visitor's own clock.
 */
function HeroClock() {
  const { timeZone, zoneLabel, localeLabel } = heroNav.clock;
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <div className="hero-clock">
      <span className="hero-clock-time">{time ?? "--:--:--"}</span>
      <span className="hero-clock-meta">{zoneLabel}</span>
      <span className="hero-clock-meta">{localeLabel}</span>
    </div>
  );
}

export function HeroOverlay({ heroUiRef, activeSection }: Props) {
  return (
    <div ref={heroUiRef} className="hero-ui">
      <a
        className="hero-ui-mark"
        href="#hero"
        aria-label="Back to top"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("hero");
        }}
      >
        <BrandMark />
      </a>

      <nav className="hero-nav" aria-label="Primary">
        {heroNav.groups.map((group) => (
          <div className="hero-nav-group" key={group.id}>
            <p className="hero-nav-group-title">
              <span className={`hero-nav-glyph hero-nav-glyph--${group.glyph}`} aria-hidden="true" />
              {group.title}
            </p>
            <ul className="hero-nav-list">
              {/* Items are one of two shapes: in-page (`section`) or link
                  (`href`). The `in` check must be applied to `item` itself —
                  pulling the value into a local first loses the narrowing. */}
              {group.items.map((item) => (
                <li key={item.label}>
                  {"section" in item ? (
                    <a
                      className={`hero-nav-link${activeSection === item.section ? " is-active" : ""}`}
                      href={`#${item.section}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.section);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <a className="hero-nav-link" href={item.href}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <HeroClock />

      <p className="hero-discover">{heroNav.discover}</p>
      <span className="hero-rule" aria-hidden="true" />

      <a className="hero-cta" href={heroNav.cta.href}>
        <span className="hero-cta-label">
          {heroNav.cta.label} <span aria-hidden="true">&rarr;</span>
        </span>
        <i className="hero-cta-dot hero-cta-dot--tl" aria-hidden="true" />
        <i className="hero-cta-dot hero-cta-dot--tr" aria-hidden="true" />
        <i className="hero-cta-dot hero-cta-dot--bl" aria-hidden="true" />
        <i className="hero-cta-dot hero-cta-dot--br" aria-hidden="true" />
      </a>

      <div className="hero-statement">
        <i className="hero-bracket hero-bracket--tl" aria-hidden="true" />
        <i className="hero-bracket hero-bracket--tr" aria-hidden="true" />
        <i className="hero-bracket hero-bracket--bl" aria-hidden="true" />
        <i className="hero-bracket hero-bracket--br" aria-hidden="true" />
        {heroNav.statement.map((line) => (
          <p className="hero-statement-line" key={line}>
            {line}
          </p>
        ))}
        {/* Inside the statement box, not a sibling of it, so the four corner
            marks frame the statement and the era line as one block. */}
        <p className="hero-era">{heroNav.era}</p>
      </div>

      <span className="hero-signal" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
