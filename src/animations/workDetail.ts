/* ── Project detail page: hero, chapters, the deck, the spectrum ────────────
 *
 * Same reveal vocabulary as the rest of the site (words out of masks, rules
 * drawing open, everything a FROM-tween over resting content), plus the two
 * pieces this page exists for: the gallery deck that deals itself out of a
 * stack, and the stack spectrum that draws itself and answers the rows below.
 *
 * Under prefers-reduced-motion every init returns early, which leaves the page
 * exactly as composed — the deck simply starts laid out. */

import { prefersReducedMotion } from "./worksArchive";

const EASE = "power3.out";
const WORD_RISE_PERCENT = 118;

/** How far the hero's poster closes into a card as the hero scrolls away. */
const HERO_CLIP_CLOSED = "inset(6% 6% 9% 6% round 22px)";
/** The poster pushes in slightly as it closes, so the crop never shows ground. */
const HERO_IMAGE_ZOOM = 1.12;
/** Scroll spent on the pinned deck, as a share of a viewport. */
const DECK_SCROLL = "+=110%";
/** How small a frame is while it is still in the pile. */
const DECK_STACK_SCALE = 0.44;
/** Alternating lean of the frames while stacked — a pile, not a neat deck. */
const DECK_STACK_TILT = 9;

/* ── Phase A: hero entrance (no ScrollTriggers) ──────────────────────────── */

export function initWorkHero(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.from(".wd-topbar > *", { y: -18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0)
    .from(".wd-hero-media img", { scale: 1.18, duration: 1.6, ease: "power2.out" }, 0)
    .from(".wd-hero-year", { opacity: 0, duration: 1.4 }, 0.2)
    .from(".wd-hero-eyebrow", { y: 16, opacity: 0, duration: 0.7 }, 0.25)
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
    const num = chapter.querySelector(".wd-chapter-num");
    const words = chapter.querySelectorAll(".wd-chapter-title .wk-word");
    const rule = chapter.querySelector(".wd-chapter-rule");
    const rises = chapter.querySelectorAll(".wk-rise");

    gsap
      .timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
      })
      .from(num, { y: 40, opacity: 0, duration: 0.9 }, 0)
      .from(words, { yPercent: WORD_RISE_PERCENT, duration: 0.8, stagger: 0.05 }, 0.1)
      .from(rule, { scaleX: 0, duration: 0.7 }, 0.24)
      .from(rises, { y: 22, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.2);

    // Drifts against the scroll for the whole time the chapter is on screen, so
    // the three numbers read as one column running past the text.
    if (num) {
      gsap.to(num, {
        yPercent: -22,
        ease: "none",
        scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }
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
 * The deck. Every frame is tweened IN from the middle of the stage, shrunk and
 * tilted, so the gallery arrives as a pile of prints being dealt onto a table.
 *
 * The travel is MEASURED, never authored: `offsetLeft/offsetTop` give each
 * frame's layout position relative to the stage — layout values, so they are
 * unaffected by the transforms this very timeline writes — and the tween starts
 * it that far from the stage's centre. That is what lets the scatter live
 * entirely in CSS: change a frame's --x/--y and the motion follows it, and the
 * phone's plain column works with the identical code.
 *
 * The resting rotation is read off --r and used as the tween's END value,
 * because GSAP writes the whole inline transform and would otherwise drop the
 * CSS rotation the scatter depends on.
 */
export function initWorkDeck(gsap: typeof window.gsap) {
  const stage = document.querySelector<HTMLElement>(".wd-deck");
  if (!stage || prefersReducedMotion()) return undefined;

  const frames = gsap.utils.toArray<HTMLElement>(".wd-frame");
  if (!frames.length) return undefined;

  const restRotation = (frame: HTMLElement) =>
    parseFloat(getComputedStyle(frame).getPropertyValue("--r")) || 0;
  const toCentreX = (frame: HTMLElement) =>
    stage.clientWidth / 2 - (frame.offsetLeft + frame.offsetWidth / 2);
  const toCentreY = (frame: HTMLElement) =>
    stage.clientHeight / 2 - (frame.offsetTop + frame.offsetHeight / 2);

  const deal = (tl: gsap.core.Timeline, stagger: number) => {
    frames.forEach((frame, i) => {
      tl.fromTo(
        frame,
        {
          x: () => toCentreX(frame),
          y: () => toCentreY(frame),
          rotation: i % 2 ? DECK_STACK_TILT : -DECK_STACK_TILT,
          scale: DECK_STACK_SCALE,
        },
        { x: 0, y: 0, rotation: restRotation(frame), scale: 1, ease: "power2.out" },
        i * stagger,
      );
    });
  };

  const mm = gsap.matchMedia();

  // Desktop and tablet: the stage is one viewport tall, so it can be pinned and
  // the deal-out happens in place while the reader scrolls.
  mm.add("(min-width: 701px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: DECK_SCROLL,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    deal(tl, 0.12);
  });

  // Phones: the scatter has collapsed to a column taller than the screen, and
  // pinning something taller than the viewport traps the reader. Each frame
  // deals itself in as it arrives instead.
  mm.add("(max-width: 700px)", () => {
    frames.forEach((frame, i) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: "top 88%", once: true },
      });
      tl.fromTo(
        frame,
        { y: 40, rotation: i % 2 ? 4 : -4, scale: 0.9, opacity: 0 },
        { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.75, ease: EASE },
      );
    });
  });

  // Returned rather than left to ctx.revert(): a matchMedia instance owns its
  // own scoped contexts, and reverting it explicitly is the documented way to
  // take them (and their pin) back down.
  return () => mm.revert();
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
