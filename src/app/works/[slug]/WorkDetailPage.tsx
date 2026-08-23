"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "../../../animations/worksArchive";
import { CustomCursor } from "../../../components/CustomCursor";
import { ScrollProgress } from "../../../components/ScrollProgress";
import { SiteFooter } from "../../../components/SiteFooter";
import { workDetail, worksPage } from "../../../content/site";
import { findWork, nextWork } from "../../../data/worksMeta";
import "../../../globals";
import { usePortfolioCursor } from "../../../hooks/usePortfolioCursor";
import { usePortfolioLenis } from "../../../hooks/usePortfolioLenis";
import { useWorkDetailGsap } from "../../../hooks/useWorkDetailGsap";
import { useWorksScripts } from "../../../hooks/useWorksScripts";
import { lockScroll, unlockScroll } from "../../../lib/scroll";
import { WORK_DETAIL_CSS } from "../../../styles/workDetailCssString";

type Props = { slug: string };

/*
 * Where the gallery frames sit on the stage, as shares of the stage itself —
 * percentages, never vw, so a wide monitor (where --pad-x grows and the stage
 * stops at --max-w) cannot push a frame past the right edge.
 *
 * This is the only place the scatter is authored. The deal-out animation
 * measures whatever these produce, so the arrangement can be reshuffled freely
 * without touching animations/workDetail.ts. A gallery longer than this list
 * wraps back to the first slot.
 */
const DECK_SLOTS = [
  { x: "2%", y: "6%", w: "31%", r: "-4deg" },
  { x: "39%", y: "0%", w: "27%", r: "3deg" },
  { x: "71%", y: "15%", w: "27%", r: "-2deg" },
  { x: "0%", y: "53%", w: "28%", r: "5deg" },
  { x: "31%", y: "45%", w: "34%", r: "-3deg" },
  { x: "68%", y: "63%", w: "30%", r: "4deg" },
];

function Arrow({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "right" ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 18l-6-6 6-6" />}
    </svg>
  );
}

function CloseMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Words in their own crops, with the separating space kept outside the mask. */
function MaskedWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="wk-word-mask">
            <span className="wk-word">{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function WorkDetailPage({ slug }: Props) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  // Which frame the lightbox is showing (null = not mounted), and whether the
  // overlay is faded in. They are separate so the closing tween can play while
  // the element is still on the page.
  const [activeFrame, setActiveFrame] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const onLoadError = useCallback(() => setLoadFailed(true), []);

  useWorksScripts(setLoaded, onLoadError);
  usePortfolioLenis(loaded);
  usePortfolioCursor(cursorRef, cursorDotRef, loaded);
  useWorkDetailGsap(loaded, slug, progressRef);

  useEffect(() => {
    if (!loadFailed) return;
    document.body.style.cursor = "auto";
  }, [loadFailed]);

  const work = findWork(slug);
  const gallery = work?.gallery ?? [];

  /*
   * The lightbox is a Flip.fit: the overlay's own image is snapped onto the
   * clicked frame's rect, that state is recorded, the transform is cleared so
   * the image sits where the layout wants it, and Flip animates between the two.
   *
   * It is done this way — rather than moving the thumbnail into the overlay —
   * because React owns both nodes, and relocating a node it rendered is how you
   * get a hydration mismatch later. flushSync is what puts the overlay's image
   * in the DOM with the right src before the rect is read.
   */
  const openFrame = async (index: number) => {
    lockScroll();
    flushSync(() => setActiveFrame(index));
    setLightboxOpen(true);

    const gsap = window.gsap;
    const img = lightboxImgRef.current;
    const thumb = frameRefs.current[index];
    if (!gsap || !img || !thumb || prefersReducedMotion()) return;

    const { Flip } = await import("gsap/Flip");
    gsap.registerPlugin(Flip);

    Flip.fit(img, thumb, { scale: true });
    const state = Flip.getState(img);
    gsap.set(img, { clearProps: "transform" });
    Flip.from(state, { duration: 0.6, ease: "power3.inOut", scale: true });
  };

  const closeFrame = useCallback(async () => {
    const index = activeFrame;
    if (index === null) return;
    unlockScroll();
    setLightboxOpen(false);

    const gsap = window.gsap;
    const img = lightboxImgRef.current;
    const thumb = frameRefs.current[index];
    if (!gsap || !img || !thumb || prefersReducedMotion()) {
      setActiveFrame(null);
      return;
    }

    const { Flip } = await import("gsap/Flip");
    gsap.registerPlugin(Flip);
    // Flies back to whichever frame is on screen NOW — which, after arrow
    // navigation, is not the one it came from.
    Flip.fit(img, thumb, {
      scale: true,
      duration: 0.45,
      ease: "power3.inOut",
      onComplete: () => {
        setActiveFrame(null);
        gsap.set(img, { clearProps: "transform" });
      },
    });
  }, [activeFrame]);

  const stepFrame = useCallback(
    (delta: number) => {
      if (activeFrame === null || gallery.length === 0) return;
      setActiveFrame((activeFrame + delta + gallery.length) % gallery.length);

      // A short dissolve rather than a Flip: the image is not travelling
      // anywhere, it is being replaced in place. Kept OUT of the state updater —
      // React may run an updater twice, and this would tween twice with it.
      const gsap = window.gsap;
      const img = lightboxImgRef.current;
      if (gsap && img && !prefersReducedMotion()) {
        gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
      }
    },
    [activeFrame, gallery.length],
  );

  useEffect(() => {
    if (activeFrame === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void closeFrame();
      else if (e.key === "ArrowRight") stepFrame(1);
      else if (e.key === "ArrowLeft") stepFrame(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeFrame, closeFrame, stepFrame]);

  // Leaving the page (or hot-reloading) with the lightbox open must not leave
  // Lenis stopped — nothing else would ever start it again.
  useEffect(() => () => unlockScroll(), []);

  if (!work) return null;

  const copy = workDetail.items[work.key as keyof typeof workDetail.items];
  const archive = worksPage.items[work.key as keyof typeof worksPage.items];
  const labels = workDetail.labels;
  const upNext = nextWork(work.slug);
  const nextArchive = worksPage.items[upNext.key as keyof typeof worksPage.items];

  const chapters = [
    { n: "01", title: labels.challenge, text: copy.challenge },
    { n: "02", title: labels.approach, text: copy.approach },
    { n: "03", title: labels.outcome, text: copy.outcome },
  ];

  return (
    <>
      <style>{WORK_DETAIL_CSS}</style>
      <CustomCursor cursorRef={cursorRef} cursorDotRef={cursorDotRef} />
      <ScrollProgress progressRef={progressRef} />

      <main className="wd-root" style={{ "--accent": work.color } as CSSProperties}>
        <header className="wd-topbar">
          <Link href="/works" className="wd-back">
            <span className="wd-back-arrow" aria-hidden="true">←</span>
            {labels.backToArchive}
          </Link>
          <span className="wd-topbar-name">{archive.title}</span>
        </header>

        {/* ── hero ───────────────────────────────────────────────────── */}
        <section className={`wd-hero${work.poster ? "" : " wd-hero--bare"}`}>
          <div className="wd-hero-media">
            {work.poster ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={work.poster} alt="" fetchPriority="high" />
            ) : null}
          </div>
          <div className="wd-hero-scrim" aria-hidden="true" />
          <span className="wd-hero-year" aria-hidden="true">{work.year}</span>

          <div className="wd-hero-inner">
            <p className="wd-hero-eyebrow works-label">
              <i aria-hidden="true" />
              {worksPage.filters[work.category]} · {work.year}
            </p>
            <h1 className="wd-title">
              <MaskedWords text={archive.title} />
            </h1>
            <p className="wd-tagline">{copy.tagline}</p>
            <p className="wd-hero-cue works-label">
              <span aria-hidden="true" />
              {labels.scrollCue}
            </p>
          </div>
        </section>

        {/* ── facts ──────────────────────────────────────────────────── */}
        <section className="wd-facts">
          <div className="wd-fact">
            <span className="works-label">{labels.role}</span>
            <span className="wd-fact-val">{copy.role}</span>
          </div>
          <div className="wd-fact">
            <span className="works-label">{labels.timeline}</span>
            <span className="wd-fact-val">{copy.timeline}</span>
          </div>
          <div className="wd-fact">
            <span className="works-label">{labels.client}</span>
            <span className="wd-fact-val">{copy.client}</span>
          </div>
          <div className="wd-fact">
            <span className="works-label">{labels.category}</span>
            {work.href ? (
              <a className="wd-fact-val wd-visit" href={work.href} target="_blank" rel="noreferrer">
                {labels.visit}
                <Arrow />
              </a>
            ) : (
              <span className="wd-fact-val">{worksPage.filters[work.category]}</span>
            )}
          </div>
        </section>

        {/* ── the three chapters ─────────────────────────────────────── */}
        <section className="wd-story">
          {chapters.map((chapter) => (
            <article className="wd-chapter" key={chapter.n}>
              <div className="wd-chapter-head">
                <span className="wd-chapter-num" aria-hidden="true">{chapter.n}</span>
                <h2 className="wd-chapter-title">
                  <MaskedWords text={chapter.title} />
                </h2>
              </div>
              <div>
                <span className="wd-chapter-rule" aria-hidden="true" />
                <p className="wd-chapter-text wk-rise">{chapter.text}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ── what shipped ───────────────────────────────────────────── */}
        <div className="wd-head">
          <h2 className="wd-head-title">{labels.highlights}</h2>
          <span className="works-label">{archive.subtitle}</span>
        </div>
        <ul className="wd-highlights">
          {copy.highlights.map((item, i) => (
            <li className="wd-highlight" key={item}>
              <span className="wd-highlight-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="wd-highlight-text">{item}</span>
            </li>
          ))}
        </ul>

        {/* ── gallery ────────────────────────────────────────────────── */}
        {gallery.length > 0 ? (
          <section className="wd-gallery">
            <div className="wd-head">
              <h2 className="wd-head-title">{labels.gallery}</h2>
              <span className="works-label">{labels.galleryHint}</span>
            </div>

            <div className="wd-deck">
              {gallery.map((src, i) => {
                const slot = DECK_SLOTS[i % DECK_SLOTS.length];
                return (
                  <button
                    type="button"
                    key={src}
                    ref={(el) => {
                      frameRefs.current[i] = el;
                    }}
                    className={`wd-frame${activeFrame === i ? " is-lifted" : ""}`}
                    style={{ "--x": slot.x, "--y": slot.y, "--w": slot.w, "--r": slot.r } as CSSProperties}
                    onClick={() => void openFrame(i)}
                    aria-label={`${archive.title} — ${i + 1}/${gallery.length}`}
                  >
                    {/* Plain <img>: the lightbox shows the very same file, so one
                        request serves both. They are already sized for the job. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" width={1280} height={720} />
                    <span className="wd-frame-index">{String(i + 1).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* ── written in ─────────────────────────────────────────────── */}
        {work.stack && work.stack.length > 0 ? (
          <section className="wd-stack">
            <div className="wd-head">
              <h2 className="wd-head-title">{labels.stack}</h2>
              <span className="works-label">{labels.stackShare}</span>
            </div>

            {/* Each segment's flex-grow IS its share, so the bar is exact
                without any percentage arithmetic. */}
            <div className="wd-spectrum" aria-hidden="true">
              {work.stack.map((band) => (
                <span
                  className="wd-seg"
                  key={band.name}
                  style={{ "--share": band.share, "--seg": band.color } as CSSProperties}
                />
              ))}
            </div>

            <ul className="wd-bands">
              {work.stack.map((band) => (
                <li
                  className="wd-band"
                  key={band.name}
                  data-share={band.share}
                  style={{ "--seg": band.color } as CSSProperties}
                >
                  <span className="wd-band-swatch" aria-hidden="true" />
                  <span className="wd-band-name">{band.name}</span>
                  <span className="wd-band-role">{band.role}</span>
                  <span className="wd-band-share">
                    <span className="wd-band-share-num">{band.share}</span>
                    <i>%</i>
                  </span>
                </li>
              ))}
            </ul>

            <p className="wd-stack-hint works-label">{labels.stackHint}</p>
          </section>
        ) : null}

        {/* ── next project ───────────────────────────────────────────── */}
        <Link
          href={`/works/${upNext.slug}`}
          className={`wd-next${upNext.poster ? "" : " wd-next--bare"}`}
          style={{ "--next-accent": upNext.color } as CSSProperties}
        >
          <span className="wd-next-media">
            {upNext.poster ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={upNext.poster} alt="" loading="lazy" />
            ) : null}
          </span>
          <span className="wd-next-scrim" aria-hidden="true" />
          <span className="wd-next-inner">
            <span className="works-label wd-next-label">{labels.next}</span>
            <span className="wd-next-title">{nextArchive.title}</span>
            <span className="wd-next-go">
              {worksPage.index.viewLabel}
              <Arrow />
            </span>
          </span>
        </Link>

        <SiteFooter />
      </main>

      {/* ── lightbox ─────────────────────────────────────────────────── */}
      {activeFrame !== null ? (
        <div
          className={`wd-lightbox${lightboxOpen ? " is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={labels.gallery}
          onClick={() => void closeFrame()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={lightboxImgRef}
            className="wd-lightbox-img"
            src={gallery[activeFrame]}
            alt={`${archive.title} — ${activeFrame + 1}/${gallery.length}`}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="wd-lb-btn wd-lb-close"
            aria-label={labels.galleryClose}
            onClick={(e) => {
              e.stopPropagation();
              void closeFrame();
            }}
          >
            <CloseMark />
          </button>

          <div className="wd-lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="wd-lb-btn"
              aria-label={labels.galleryPrev}
              onClick={() => stepFrame(-1)}
            >
              <Arrow dir="left" />
            </button>
            <span className="wd-lb-count">
              {String(activeFrame + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="wd-lb-btn"
              aria-label={labels.galleryNext}
              onClick={() => stepFrame(1)}
            >
              <Arrow />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
