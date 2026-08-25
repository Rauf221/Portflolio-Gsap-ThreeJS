/* ── Project detail page: hero, chapters, the fan, the spectrum ─────────────
 *
 * Same reveal vocabulary as the rest of the site (words out of masks, rules
 * drawing open, everything a FROM-tween over resting content), plus the two
 * pieces this page exists for: the gallery fan, where a stack of screens
 * spreads into a full rosette, and the stack spectrum that draws itself and
 * answers the rows below.
 *
 * Under prefers-reduced-motion every init returns early, which leaves the page
 * exactly as composed — the rosette simply starts open. */

import { prefersReducedMotion } from "./worksArchive";

const EASE = "power3.out";
const WORD_RISE_PERCENT = 118;

/** How far the hero's poster closes into a card as the hero scrolls away. */
const HERO_CLIP_CLOSED = "inset(6% 6% 9% 6% round 22px)";
/** The poster pushes in slightly as it closes, so the crop never shows ground. */
const HERO_IMAGE_ZOOM = 1.12;
/** Scroll spent on the pinned fan, as a share of a viewport. */
const FAN_SCROLL = "+=130%";
/**
 * The angle every card sits at while stacked. 0 means the deck is square to the
 * page before it opens; a few degrees would make it a thrown-down pile instead.
 */
const FAN_STACKED_ANGLE = 0;

/* ── Phase A: hero entrance (no ScrollTriggers) ──────────────────────────── */

export function initWorkHero(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.from(".wd-topbar > *", { y: -18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0)
    .from(".wd-hero-media img", { scale: 1.18, duration: 1.6, ease: "power2.out" }, 0)
    .from(".wd-hero-year", { opacity: 0, duration: 1.4 }, 0.2)
    .from(".wd-title .wk-word", { yPercent: WORD_RISE_PERCENT, duration: 1, stagger: 0.06 }, 0.35)
    .from(".wd-tagline", { y: 22, opacity: 0, duration: 0.8 }, 0.6)
    .from(".wd-hero-cue", { opacity: 0, duration: 0.6 }, 0.85);
}

/* ── Phase B: scroll-driven, in document order ───────────────────────────── */

/**
 * The hero closing itself. The poster starts full-bleed and its clip-path is
 * scrubbed into a rounded card while the image pushes in behind the crop, so
 * the whole thing reads as a cover shutting rather than a picture scrolling by.
 */
export function initWorkHeroScrub(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;
  const hero = document.querySelector(".wd-hero");
  if (!hero) return;

  const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 };

  gsap.to(".wd-hero-media", { clipPath: HERO_CLIP_CLOSED, ease: "none", scrollTrigger: scrub });
  gsap.to(".wd-hero-media img", { scale: HERO_IMAGE_ZOOM, ease: "none", scrollTrigger: scrub });
  // The year drifts faster than the page, which is what separates it from the
  // poster it is printed over.
  gsap.to(".wd-hero-year", { yPercent: -30, ease: "none", scrollTrigger: scrub });
  gsap.to(".wd-hero-inner", { y: -50, opacity: 0.15, ease: "none", scrollTrigger: scrub });
}

export function initWorkFacts(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;
  gsap.from(".wd-fact", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: EASE,
    stagger: 0.07,
    scrollTrigger: { trigger: ".wd-facts", start: "top 88%", once: true },
  });
}

export function initWorkChapters(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray<HTMLElement>(".wd-chapter").forEach((chapter) => {
    const words = chapter.querySelectorAll(".wd-chapter-title .wk-word");
    const rule = chapter.querySelector(".wd-chapter-rule");
    const rises = chapter.querySelectorAll(".wk-rise");

    gsap
      .timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
      })
      .from(words, { yPercent: WORD_RISE_PERCENT, duration: 0.8, stagger: 0.05 }, 0.1)
      .from(rule, { scaleX: 0, duration: 0.7 }, 0.24)
      .from(rises, { y: 22, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.2);
  });
}

export function initWorkHighlights(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;
  gsap.from(".wd-highlight", {
    y: 26,
    opacity: 0,
    duration: 0.6,
    ease: EASE,
    stagger: 0.05,
    scrollTrigger: { trigger: ".wd-highlights", start: "top 86%", once: true },
  });
}

/**
 * The fan. A neat stack of screens spreads into a full 360-degree rosette while
 * the stage is pinned.
 *
 * The whole arrangement is one pivot and a set of rotations. Every card is
 * anchored at the same point — the zero-size `.wd-fan-pivot` in the middle of
 * the stage — with `transform-origin: left bottom`, so a card's angle is the
 * ONLY thing that decides where it ends up. The pivot itself slides from a
 * position that centres the stack to dead centre, which is what turns "a deck
 * lying in the middle" into "a deck opening around a point".
 *
 * Two details worth keeping:
 *
 *  • The tween runs BACKWARDS from the composed state. The cards' resting
 *    angles live in CSS (--angle per card), so no-JS and reduced-motion readers
 *    get the finished rosette; this only animates the page into it.
 *
 *  • The stacked offset is (-w/2, +h/2), derived rather than authored: a card
 *    pinned at the pivot by its bottom-left corner has its centre at
 *    (+w/2, -h/2), so shifting the pivot by the negative of that puts the stack
 *    in the middle of the stage. It is read per refresh, because the card width
 *    is a share of the viewport and every resize changes it.
 */
export function initWorkFan(gsap: typeof window.gsap) {
  const stage = document.querySelector<HTMLElement>(".wd-fan");
  const pivot = document.querySelector<HTMLElement>(".wd-fan-pivot");
  if (!stage || !pivot || prefersReducedMotion()) return;

  const cards = gsap.utils.toArray<HTMLElement>(".wd-card");
  if (!cards.length) return;

  const cardWidth = () => cards[0].offsetWidth;
  const cardHeight = () => cards[0].offsetHeight;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: FAN_SCROLL,
      pin: true,
      scrub: 0.9,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(
    pivot,
    { x: () => -cardWidth() / 2, y: () => cardHeight() / 2 },
    { x: 0, y: 0, ease: "none" },
    0,
  );

  // Every card shares the one progress — they open together, like a hand of
  // cards being spread, rather than arriving one after another.
  cards.forEach((card) => {
    const resting = parseFloat(getComputedStyle(card).getPropertyValue("--angle")) || 0;
    tl.fromTo(card, { rotation: FAN_STACKED_ANGLE }, { rotation: resting, ease: "none" }, 0);
  });
}

/**
 * The spectrum: the bar draws itself open, the shares count up, and hovering a
 * row lifts that row's band out of the bar while the others dim.
 *
 * The lift is written as the independent `translate` property in CSS, NOT a
 * transform, precisely because this tween leaves an inline `transform` on every
 * segment — the two compose instead of one overwriting the other.
 *
 * Returns a disposer: the hover wiring is raw listeners, which gsap.context()'s
 * revert() cannot see.
 */
export function initWorkSpectrum(gsap: typeof window.gsap) {
  const segments = gsap.utils.toArray<HTMLElement>(".wd-seg");
  const bands = gsap.utils.toArray<HTMLElement>(".wd-band");
  const cleanups: (() => void)[] = [];

  if (!prefersReducedMotion() && segments.length) {
    gsap.from(segments, {
      scaleX: 0,
      duration: 0.9,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: ".wd-spectrum", start: "top 84%", once: true },
    });

    gsap.from(bands, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      stagger: 0.06,
      scrollTrigger: { trigger: ".wd-bands", start: "top 88%", once: true },
    });

    bands.forEach((band) => {
      const out = band.querySelector<HTMLElement>(".wd-band-share-num");
      const target = Number(band.dataset.share ?? "0");
      if (!out || !target) return;
      // The DOM already holds the real number, so a reader without JS (or one
      // scrolling faster than the tween) never sees a placeholder.
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          out.textContent = String(Math.round(counter.value));
        },
        scrollTrigger: { trigger: band, start: "top 90%", once: true },
      });
    });
  }

  bands.forEach((band, index) => {
    const enter = () => {
      segments.forEach((seg, i) => seg.classList.add(i === index ? "is-active" : "is-dim"));
    };
    const leave = () => {
      segments.forEach((seg) => seg.classList.remove("is-active", "is-dim"));
    };
    band.addEventListener("pointerenter", enter);
    band.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      band.removeEventListener("pointerenter", enter);
      band.removeEventListener("pointerleave", leave);
      leave();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function initWorkNext(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;
  const next = document.querySelector(".wd-next");
  if (!next) return;

  gsap.from(".wd-next-inner > *", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: EASE,
    stagger: 0.08,
    scrollTrigger: { trigger: next, start: "top 75%", once: true },
  });
  // The panel's own image drifts while it crosses the screen — the same
  // parallax the home hero uses, at a fraction of the amplitude.
  gsap.fromTo(
    ".wd-next-media img",
    { yPercent: -6 },
    {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: next, start: "top bottom", end: "bottom top", scrub: 1 },
    },
  );
}
