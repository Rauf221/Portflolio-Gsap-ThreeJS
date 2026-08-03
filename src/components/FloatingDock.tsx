"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { dock } from "../content/site";
import { scrollToSection } from "../lib/scroll";
import { BrandMark } from "./BrandMark";

type Props = {
  /* Animated by usePortfolioGsap: the layer fades/slides in once the hero
     overlay's own navigation has scrolled away. */
  dockRef: RefObject<HTMLDivElement | null>;
};

/* The four inset corner marks every tile carries. */
function Corners() {
  return (
    <>
      <i className="dock-dot dock-dot--tl" aria-hidden="true" />
      <i className="dock-dot dock-dot--tr" aria-hidden="true" />
      <i className="dock-dot dock-dot--bl" aria-hidden="true" />
      <i className="dock-dot dock-dot--br" aria-hidden="true" />
    </>
  );
}

/* Marks for the icon-only tiles in the bottom row of the directory. Keyed by
   the `icon` value in site.ts — add a case here to add a social tile. */
function TileIcon({ name }: { name: "github" | "linkedin" }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.23c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3z" />
    </svg>
  );
}

export function FloatingDock({ dockRef }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Escape or a pointer down anywhere outside the bar closes the panel. The
  // scrim covers the rest of the page, so a click on it lands here too.
  //
  // Scrolling closes it as well, and that one is not just a nicety: the bar
  // hides itself at the footer (usePortfolioGsap), but the scrim is a separate
  // fixed element outside it — left open, the page would stay blurred with no
  // dock on screen to close it.
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", close);
    };
  }, [menuOpen]);

  // The ambient loop is optional — with no `src` configured the Sound tile is
  // still a working toggle (the meter animates), there is simply nothing to
  // play. Created once; only play/pause reacts to the toggle.
  useEffect(() => {
    const { src, volume } = dock.sound;
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // play() rejects if the browser still considers the gesture insufficient;
    // nothing to recover from, so the rejection is swallowed.
    if (soundOn) void audio.play().catch(() => {});
    else audio.pause();
  }, [soundOn]);

  const go = (section: string) => {
    setMenuOpen(false);
    scrollToSection(section);
  };

  return (
    <>
      {/* Dims and blurs the page behind the open panel. Its own fixed element
          rather than a child of the layer: the layer is a bottom-anchored strip
          and could never cover the viewport. */}
      <div className={`dock-scrim${menuOpen ? " is-open" : ""}`} aria-hidden="true" />

      <div className="dock-layer" ref={dockRef}>
        <div className="dock" ref={barRef}>
          {/* Always mounted so it can transition; `visibility: hidden` while
              closed keeps its links out of the tab order. */}
          <div id="dock-directory" className={`dock-menu${menuOpen ? " is-open" : ""}`}>
            {dock.directory.rows.map((row, rowIndex) => (
              <div className="dock-menu-row" key={rowIndex}>
                {row.map((item) =>
                  "section" in item ? (
                    <a
                      className="dock-menu-tile"
                      key={item.label}
                      href={`#${item.section}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.section);
                      }}
                    >
                      <span className="dock-menu-tile-label">{item.label}</span>
                      <Corners />
                    </a>
                  ) : "icon" in item ? (
                    <a
                      className="dock-menu-tile dock-menu-tile--icon"
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                    >
                      <TileIcon name={item.icon} />
                      <Corners />
                    </a>
                  ) : (
                    <a className="dock-menu-tile" key={item.label} href={item.href}>
                      <span className="dock-menu-tile-label">{item.label}</span>
                      <Corners />
                    </a>
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="dock-bar">
            <a
              className="dock-tile dock-tile--mark"
              href={`#${dock.home.section}`}
              aria-label={dock.home.label}
              onClick={(e) => {
                e.preventDefault();
                go(dock.home.section);
              }}
            >
              <BrandMark />
            </a>

            <button
              type="button"
              className={`dock-tile dock-tile--action${menuOpen ? " is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="dock-directory"
              aria-label={menuOpen ? dock.directory.closeLabel : dock.directory.label}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="dock-tile-label">{dock.directory.label}</span>
              {/* Two rules that scissor into a ✕ while the panel is open. */}
              <span className="dock-glyph dock-glyph--menu" aria-hidden="true">
                <i />
                <i />
              </span>
              <Corners />
            </button>

            <button
              type="button"
              className={`dock-tile dock-tile--action${soundOn ? " is-on" : ""}`}
              aria-pressed={soundOn}
              onClick={() => setSoundOn((on) => !on)}
            >
              <span className="dock-tile-label">{dock.sound.label}</span>
              <span className="dock-glyph dock-glyph--meter" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <Corners />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
