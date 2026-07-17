"use client";

import { type RefObject } from "react";
import { about } from "../content/site";
import { splitGraphemes } from "../lib/splitGraphemes";
import { RHLogoMark, VIEWBOX_TIGHT } from "./RHLogoMark";

type Props = { aboutRef: RefObject<HTMLElement | null> };

/* Deterministic star field — module scope + seeded PRNG so SSR and client
   render the exact same markup (no hydration mismatch). */
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
const rand = seededRandom(28_06_04);
const STARS = Array.from({ length: 46 }, () => ({
  top: rand() * 100,
  left: rand() * 100,
  size: 1 + rand() * 1.8,
  delay: rand() * 4,
  dur: 2.6 + rand() * 3.2,
}));

const GLYPHS = [
  { char: "✦", top: "10%", left: "5%", depth: 0.85, size: "1rem" },
  { char: "◇", top: "18%", left: "90%", depth: 0.5, size: "1.25rem" },
  { char: "</>", top: "74%", left: "6%", depth: 0.65, size: "0.85rem" },
  { char: "λ", top: "62%", left: "93%", depth: 0.95, size: "1.1rem" },
  { char: "Ψ", top: "88%", left: "72%", depth: 0.4, size: "0.9rem" },
  { char: "∴", top: "6%", left: "58%", depth: 0.7, size: "1rem" },
  { char: "⟁", top: "40%", left: "3%", depth: 0.3, size: "1.15rem" },
] as const;

export function AboutSection({ aboutRef }: Props) {
  const headlineWords = about.headline.split("|");
  const stats = [
    { num: about.stats.projects.num, label: about.stats.projects.label, count: 10, suffix: "+" },
    { num: about.stats.stack.num, label: about.stats.stack.label, count: null, suffix: "" },
    { num: about.stats.langs.num, label: about.stats.langs.label, count: 3, suffix: "" },
  ] as const;

  return (
    <section id="about" ref={aboutRef} className="about-mystic section-padded">
      {/* ambient layers */}
      <div className="about-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="about-star"
            style={{
              top: `${s.top.toFixed(2)}%`,
              left: `${s.left.toFixed(2)}%`,
              width: `${s.size.toFixed(2)}px`,
              height: `${s.size.toFixed(2)}px`,
              ["--tw-delay" as string]: `${s.delay.toFixed(2)}s`,
              ["--tw-dur" as string]: `${s.dur.toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="about-glyph font-mono"
          data-depth={g.depth}
          style={{ top: g.top, left: g.left, fontSize: g.size }}
          aria-hidden="true"
        >
          <span className="about-glyph-inner">{g.char}</span>
        </span>
      ))}

      <div className="container about-grid">
        {/* left — the RH mark, drawn in stroke-by-stroke on scroll */}
        <div className="about-logo-wrap" aria-hidden="true">
          <RHLogoMark
            className="about-logo"
            viewBox={VIEWBOX_TIGHT}
            color="var(--sphere)"
            strokeWidth={4}
          />
          <div className="about-logo-glow" />
        </div>

        {/* right — content */}
        <div className="about-content">
          <div className="about-label font-mono">
            <span className="about-label-line" />
            {about.label}
            <span className="about-label-glyph">✦</span>
          </div>

          <h2 className="about-headline perspective">
            {headlineWords.map((word, wi) => (
              <span key={wi} className="about-headline-word overflow-clip">
                <span className={`about-headline-word-inner font-display ${wi >= 3 ? "grad-indigo" : ""}`}>
                  {splitGraphemes(word).map((ch, ci) => (
                    <span key={ci} className="about-headline-char">
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h2>

          <div className="about-rune-divider" aria-hidden="true">
            <span className="about-rune-divider-line" />
            <span className="about-rune-divider-mark">◇</span>
            <span className="about-rune-divider-line about-rune-divider-line--fade" />
          </div>

          <p className="about-body">{about.body1}</p>
          <p className="about-body">{about.body2}</p>

          <div className="about-sigils">
            {stats.map(({ num, label, count, suffix }) => (
              <div key={label} className="about-sigil">
                <div className="about-sigil-diamond">
                  <span
                    className="about-sigil-num font-display grad-indigo"
                    {...(count !== null ? { "data-count": count, "data-suffix": suffix } : {})}
                  >
                    {num}
                  </span>
                </div>
                <div className="about-sigil-label font-mono">{label}</div>
              </div>
            ))}
          </div>

          <blockquote className="about-mantra">{about.mantra}</blockquote>
        </div>
      </div>
    </section>
  );
}
