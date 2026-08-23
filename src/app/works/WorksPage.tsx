"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { CustomCursor } from "../../components/CustomCursor";
import { ScrollProgress } from "../../components/ScrollProgress";
import { SiteFooter } from "../../components/SiteFooter";
import { worksPage } from "../../content/site";
import {
  WORKS_META,
  WORK_CATEGORY_ORDER,
  countWorks,
  type WorkCategory,
} from "../../data/worksMeta";
import "../../globals";
import { usePortfolioCursor } from "../../hooks/usePortfolioCursor";
import { usePortfolioLenis } from "../../hooks/usePortfolioLenis";
import { useWorksGsap } from "../../hooks/useWorksGsap";
import { useWorksScripts } from "../../hooks/useWorksScripts";
import { prefersReducedMotion } from "../../animations/worksArchive";
import { WORKS_PAGE_CSS } from "../../styles/worksCssString";

/*
 * The hero scene pulls in three, so it stays out of this page's own bundle and
 * off the server — same rule SkillsSection follows for SkillModelViewer. The
 * flat poster strip underneath is what the reader sees until it arrives.
 */
const WorksSpiralHero = dynamic(
  () => import("../../components/WorksSpiralHero").then((m) => m.WorksSpiralHero),
  { ssr: false },
);

type FilterKey = WorkCategory | "all";

/** The eight-pointed asterisk the home panels use for their row icon. */
function AsteriskMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * Splits a line into words, each in its own crop so it can rise out of it.
 *
 * The separating space is rendered OUTSIDE the mask — inside, the crop would
 * eat it — and it has to be rendered explicitly, because React puts no text
 * node between array items and the masks are inline-block with no margin.
 * `accentFrom` is the word index where the indigo gradient takes over.
 */
function MaskedWords({ text, accentFrom }: { text: string; accentFrom?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="wk-word-mask">
            <span className={`wk-word${accentFrom !== undefined && i >= accentFrom ? " works-grad" : ""}`}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function WorksPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  // Which card the reader is on, reported by the rail counter's triggers. 1 so
  // the rail reads "01 / 06" before the first trigger has fired.
  const [activeWork, setActiveWork] = useState(1);

  // Flips once the spiral has painted its first frame, which cross-fades the
  // flat poster strip out from under it.
  const [spiralReady, setSpiralReady] = useState(false);
  const onSpiralReady = useCallback(() => setSpiralReady(true), []);

  const onLoadError = useCallback(() => setLoadFailed(true), []);

  /*
   * One panel per work, in archive order, so the hero is literally the archive
   * turned on its side. A work with no poster is drawn as an accent card by the
   * scene itself, and a list shorter than the ring is cycled to fill it — the
   * spiral needs no maintenance as projects are added.
   */
  const spiralTiles = useMemo(
    () =>
      WORKS_META.map((work) => ({
        src: work.poster,
        label: worksPage.items[work.key as keyof typeof worksPage.items]?.title ?? "",
        accent: work.color,
      })),
    [],
  );

  useWorksScripts(setLoaded, onLoadError);
  usePortfolioLenis(loaded);
  usePortfolioCursor(cursorRef, cursorDotRef, loaded);
  useWorksGsap(loaded, { progressRef, onActiveWork: setActiveWork });

  useEffect(() => {
    if (!loadFailed) return;
    // The sheet carries cursor:none for a custom cursor that never wired up.
    document.body.style.cursor = "auto";
  }, [loadFailed]);

  const filters: FilterKey[] = ["all", ...WORK_CATEGORY_ORDER];
  const visible = WORKS_META.filter((w) => filter === "all" || w.category === filter);

  /*
   * Filtering is a Flip: the state of every card is read BEFORE React swaps the
   * classes, then the same nodes are animated from where they were to where the
   * grid put them. Cards that leave or join the layout fade rather than
   * teleport. flushSync is what makes the capture-then-compare work at all —
   * Flip.from has to run against a DOM that has already reflowed.
   *
   * Without gsap (or under reduced motion) it degrades to a plain state change,
   * which is the same grid, just instantly.
   */
  const changeFilter = async (next: FilterKey) => {
    if (next === filter) return;
    const gsap = window.gsap;
    const grid = gridRef.current;
    if (!gsap || !grid || prefersReducedMotion()) {
      setFilter(next);
      return;
    }

    const { Flip } = await import("gsap/Flip");
    gsap.registerPlugin(Flip);

    const state = Flip.getState(grid.querySelectorAll(".work-card"));
    flushSync(() => setFilter(next));

    Flip.from(state, {
      duration: 0.62,
      ease: "power3.out",
      scale: true,
      /* Deliberately NOT absolute: true. Lifting every card out of flow would
         collapse the grid's height for the length of the animation, and the
         whole page below it — CTA, footer — would jump up and back. In flow,
         the container settles to its new height at once while the cards glide
         into place. */
      stagger: 0.025,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.28, ease: "power2.in" }),
      // The grid just changed height, so every trigger below it is measuring
      // against a layout that no longer exists.
      onComplete: () => window.ScrollTrigger?.refresh(),
    });
  };

  return (
    <>
      <style>{WORKS_PAGE_CSS}</style>
      <CustomCursor cursorRef={cursorRef} cursorDotRef={cursorDotRef} />
      <ScrollProgress progressRef={progressRef} />

      <main className="works-root">
        <header className="works-topbar">
          <Link href="/" className="works-back">
            <span className="works-back-arrow" aria-hidden="true">←</span>
            {worksPage.backHome}
          </Link>
          <span className="works-topbar-tag works-label">
            <i className="works-topbar-dot" aria-hidden="true" />
            {WORKS_META.length} {worksPage.meta.countLabel}
          </span>
        </header>

        {/*
          The hero is the spiral and nothing else — no headline, no lede. The
          <h1> is still here for the document outline and for anyone reading
          with a screen reader, it simply isn't drawn.
        */}
        <section className={`works-hero${spiralReady ? " is-ready" : ""}`}>
          <h1 className="sr-only">{worksPage.headline.split("|").join(" ")}</h1>

          {/* Shown until (or unless) the scene paints: no WebGL, or a slow
              first frame, leaves a composed strip of the same posters rather
              than an empty screen. */}
          <div className="works-hero-flat" aria-hidden="true">
            {spiralTiles.slice(0, 5).map((tile, i) => (
              <span
                key={`${tile.label}-${i}`}
                className="works-hero-flat-tile"
                style={{ "--flat-accent": tile.accent } as CSSProperties}
              >
                {/* A plain <img>, deliberately: the scene loads these exact
                    files as GL textures, so requesting the same URL means the
                    browser serves both from one download. next/image would ask
                    for a separate /_next/image variant and fetch every poster
                    twice. They are already sized for the job (720x480). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {tile.src ? <img src={tile.src} alt="" width={720} height={480} /> : null}
              </span>
            ))}
          </div>

          <WorksSpiralHero tiles={spiralTiles} onReady={onSpiralReady} />
        </section>

        <section className="works-index">
          <aside className="works-rail">
            <div className="works-rail-head">
              <span className="works-label">{worksPage.index.title}</span>
              <span className="works-rail-count">
                {String(activeWork).padStart(2, "0")} / {String(WORKS_META.length).padStart(2, "0")}
              </span>
            </div>

            <ul className="works-filters">
              {filters.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    className={`works-filter${filter === key ? " is-active" : ""}`}
                    aria-pressed={filter === key}
                    onClick={() => void changeFilter(key)}
                  >
                    <span className="works-filter-fill" aria-hidden="true" />
                    <span>{worksPage.filters[key]}</span>
                    <span className="works-filter-count">
                      {String(countWorks(key)).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="works-rail-note">{worksPage.lede}</p>
          </aside>

          <div className="works-grid" ref={gridRef}>
            {WORKS_META.map((work, i) => {
              /* WORKS_META owns the geometry, worksPage.items owns the copy,
                 and `key` is the join between them. A meta entry added without
                 its copy is skipped rather than crashing the whole archive. */
              const item = worksPage.items[work.key as keyof typeof worksPage.items] as
                | { title: string; subtitle: string; desc: string; tags: string }
                | undefined;
              if (!item) return null;
              const tags = item.tags.split(",").map((s) => s.trim()).filter(Boolean);
              const hidden = filter !== "all" && work.category !== filter;
              const media = (
                <>
                  <div className="work-card-frame">
                    {work.video ? (
                      /* Deliberately NOT autoPlay — initWorksMedia decides when
                         a clip may decode, so a twenty-card archive never has
                         twenty videos competing for frame budget. muted +
                         playsInline are what make that programmatic play()
                         legal outside a user gesture. */
                      <video
                        className="work-card-video"
                        src={work.video}
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="work-card-fallback" aria-hidden="true">
                        {item.title.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="work-card-year">{work.year}</span>
                  {/* Every card now leads somewhere — its own detail page — so
                      the mark is unconditional. */}
                  <span className="work-card-arrow" aria-hidden="true">
                    <AsteriskMark />
                  </span>
                </>
              );

              return (
                <article
                  key={work.key}
                  className={`work-card${hidden ? " is-hidden" : ""}`}
                  data-work-index={i + 1}
                  style={{ "--work-accent": work.color } as CSSProperties}
                >
                  {/* The card leads to the project's own page. The live site,
                      when there is one, is offered there — one card, one
                      destination, rather than two competing links. */}
                  <Link
                    className="work-card-media"
                    href={`/works/${work.slug}`}
                    aria-label={`${item.title} — ${worksPage.index.viewLabel}`}
                  >
                    {media}
                  </Link>

                  <div className="work-card-index wk-rise">
                    <span className="work-card-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="work-card-cat">{worksPage.filters[work.category]}</span>
                  </div>

                  <h2 className="work-card-title">
                    <Link className="work-card-title-link" href={`/works/${work.slug}`}>
                      <MaskedWords text={item.title} />
                    </Link>
                  </h2>

                  <p className="work-card-subtitle wk-rise">{item.subtitle}</p>
                  <span className="work-card-rule" aria-hidden="true" />
                  <p className="work-card-desc wk-rise">{item.desc}</p>

                  <ul className="work-card-tags">
                    {tags.map((tag) => (
                      <li key={tag} className="work-tag wk-rise">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}

            {visible.length === 0 ? (
              <p className="works-empty">{worksPage.index.emptyLabel}</p>
            ) : null}
          </div>
        </section>

        <section className="works-cta">
          <h2 className="works-cta-title">
            <MaskedWords text={worksPage.cta.line1} />
            <br />
            <MaskedWords text={worksPage.cta.line2} accentFrom={0} />
          </h2>
          <a className="works-btn" href={worksPage.cta.href}>
            <span className="works-btn-fill" aria-hidden="true" />
            {worksPage.cta.label}
            <AsteriskMark />
          </a>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
