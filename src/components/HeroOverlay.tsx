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
  const { timeZone, zoneLabel } = heroNav.clock;
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
    <p className="hero-clock">
      <span className="hero-clock-time">{time ?? "--:--:--"}</span>
      <span className="hero-clock-zone">{zoneLabel}</span>
    </p>
  );
}

/*
 * Four clusters pinned to the frame's edges, with the portrait left alone in
 * the middle of them: the top rail, the left-middle lead block, the right-hand
 * section index, and the foot band. Nothing is ruled across the frame — the
 * clusters hold together by alignment, and the only drawn shapes are the index
 * rail's hairline and the two circles in the foot.
 */
export function HeroOverlay({ heroUiRef, activeSection }: Props) {
  const { headline, index } = heroNav;

  return (
    <div ref={heroUiRef} className="hero-ui">
      <div className="hero-head">
        <div className="hero-rail">
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

          <nav className="hero-rail-nav" aria-label="Primary">
            <ul className="hero-nav-list">
              {/* Items are one of two shapes: in-page (`section`) or link
                  (`href`). The `in` check must be applied to `item` itself —
                  pulling the value into a local first loses the narrowing. */}
              {heroNav.nav.map((item) => (
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
          </nav>

          <HeroClock />
        </div>
      </div>

      {/* Left-middle. The one block in the frame with a reading order of its
          own: headline, the line under it, then the single link. */}
      <div className="hero-lead">
        <p className="hero-headline">
          <span className="hero-headline-line">{headline.line1}</span>
          <span className="hero-headline-line">
            {headline.line2} <span className="hero-headline-accent">{headline.accent}</span>
          </span>
        </p>
        <p className="hero-subline">{heroNav.subline}</p>
        <a className="hero-cta" href={heroNav.cta.href}>
          {heroNav.cta.label}
          <span className="hero-cta-arrow" aria-hidden="true">
            &#8599;
          </span>
        </a>
      </div>

      {/* Right-middle. A position in the page, not a menu — so the numbers are
          the label and the section names ride along only for assistive tech.
          The count is derived from the array, padded to two digits. */}
      <nav className="hero-index" aria-label="Sections">
        <ul className="hero-index-list">
          {index.map((item, i) => (
            <li key={item.section}>
              <a
                className={`hero-index-link${activeSection === item.section ? " is-active" : ""}`}
                href={`#${item.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.section);
                }}
              >
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="sr-only">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hero-foot">
        <a className="hero-foot-link" href={heroNav.contact.href}>
          <span className="hero-foot-label">{heroNav.contact.label}</span>
          <span className="hero-round" aria-hidden="true">
            &#8594;
          </span>
        </a>

        {/* The scroll hint is a control, not a caption: it goes where the
            scroll would take you, so the circle is worth clicking. */}
        <a
          className="hero-foot-link hero-foot-link--end"
          href={`#${heroNav.scrollHint.section}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(heroNav.scrollHint.section);
          }}
        >
          <span className="hero-foot-label">{heroNav.scrollHint.label}</span>
          <span className="hero-round" aria-hidden="true">
            &#8595;
          </span>
        </a>
      </div>
    </div>
  );
}
