"use client";

import { type RefObject } from "react";
import { about } from "../content/site";
import { splitGraphemes } from "../lib/splitGraphemes";
import { RHLogoMark, VIEWBOX_TIGHT } from "./RHLogoMark";

type Props = { aboutRef: RefObject<HTMLElement | null> };

export function AboutSection({ aboutRef }: Props) {
  const headlineWords = about.headline.split("|");

  return (
    <section id="about" ref={aboutRef} className="about-mystic section-padded">
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
          </div>

          <h2 className="about-headline">
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

          <p className="about-body">{about.body1}</p>
          <p className="about-body">{about.body2}</p>

          <dl className="about-meta">
            {about.meta.map(({ key, value }) => (
              <div key={key} className="about-meta-row">
                <dt className="about-meta-key font-mono">{key}</dt>
                <dd className="about-meta-value font-display grad-indigo">{value}</dd>
              </div>
            ))}
          </dl>

          <blockquote className="about-mantra">{about.mantra}</blockquote>
        </div>
      </div>
    </section>
  );
}
