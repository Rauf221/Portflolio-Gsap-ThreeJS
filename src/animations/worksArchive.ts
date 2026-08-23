/* ── Works archive: the /works page's whole choreography ────────────────────
 *
 * Same vocabulary as the home page's projects section, restaged for a list
 * that is meant to grow: words rise out of their masks, media unfolds from its
 * bottom-left corner, rules draw themselves open. What it deliberately does
 * NOT reuse is the pinned four-panel swap — that treatment costs one viewport
 * of pinned scroll per project, which is exactly what stops scaling at twenty.
 *
 * Every reveal is a FROM-tween, so the resting DOM is the finished page: under
 * prefers-reduced-motion each init returns early and the reader still sees the
 * composed layout. Constants live next to the only code that reads them. */

/** Shared out-ease — the same curve the home panels' reveals run on. */
const EASE = "power3.out";

/*
 * The media's parked scale, and the ONLY place it is written. Its reciprocal
 * is what the inner frame is counter-scaled by, so the footage holds its true
 * size while the window opens over it — that reciprocal pairing is what makes
 * the arrival read as an unfold rather than a zoom. Both elements carry
 * transform-origin: 0% 100% in CSS, so they collapse into the same corner.
 */
const WORK_MEDIA_PARKED_SCALE = 0.42;

/** How far a rising word starts below its mask, as a share of its own height. */
const WORD_RISE_PERCENT = 118;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ── Phase A: the hero entrance (no ScrollTriggers) ─────────────────────── */

export function initWorksHero(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  /*
   * The hero itself is the spiral scene, which animates on its own clock and
   * fades itself in from CSS the moment it paints — GSAP must not touch it, or
   * the two would fight over the same element's opacity. All that is left here
   * is the chrome above it.
   */
  gsap.from(".works-topbar > *", {
    y: -18,
    opacity: 0,
    duration: 0.7,
    ease: EASE,
    stagger: 0.08,
  });
}

/* ── Phase B: everything scroll-driven ──────────────────────────────────── */

/**
 * Per-card arrival. One timeline per card rather than a single batched stagger,
 * because the grid reflows under the filter: a batch would hold a stale set of
 * elements, while a per-card trigger simply re-measures on the refresh that
 * follows a filter change.
 *
 * `once: true` is what makes the filter safe. A card that has already played
 * sits at its resting (finished) state, so hiding and re-showing it never
 * re-hides its contents.
 */
export function initWorksCards(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
    const media = card.querySelector(".work-card-media");
    const frame = card.querySelector(".work-card-frame");
    const words = card.querySelectorAll(".work-card-title .wk-word");
    const rule = card.querySelector(".work-card-rule");
    const rises = card.querySelectorAll(".wk-rise");

    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
    });

    if (media && frame) {
      tl.from(media, { scale: WORK_MEDIA_PARKED_SCALE, duration: 1 }, 0).from(
        frame,
        { scale: 1 / WORK_MEDIA_PARKED_SCALE, duration: 1 },
        0,
      );
    }
    tl.from(words, { yPercent: WORD_RISE_PERCENT, duration: 0.8, stagger: 0.05 }, 0.16)
      .from(rule, { scaleX: 0, duration: 0.7 }, 0.3)
      .from(rises, { y: 20, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.24);
  });
}

/** The closing CTA — same rise, so the page ends the way it started. */
export function initWorksCta(gsap: typeof window.gsap) {
  if (prefersReducedMotion()) return;

  gsap.from(".works-cta .wk-word", {
    yPercent: WORD_RISE_PERCENT,
    duration: 0.9,
    ease: EASE,
    stagger: 0.06,
    scrollTrigger: { trigger: ".works-cta", start: "top 80%", once: true },
  });
  gsap.from(".works-btn", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: EASE,
    scrollTrigger: { trigger: ".works-cta", start: "top 74%", once: true },
  });
}

/**
 * Tells the rail which card the reader is on, so its counter tracks the scroll
 * the way the home panels' index does. Reports the card's `data-work-index`
 * rather than its position in the list, so the number stays correct while the
 * filter is hiding half the grid.
 */
export function initWorksRailCounter(
  ST: typeof window.ScrollTrigger,
  onActive: (index: number) => void,
) {
  document.querySelectorAll<HTMLElement>(".work-card").forEach((card) => {
    const index = Number(card.dataset.workIndex ?? "0");
    ST.create({
      trigger: card,
      start: "top 60%",
      end: "bottom 60%",
      onEnter: () => onActive(index),
      onEnterBack: () => onActive(index),
    });
  });
}

/**
 * Video discipline, and the reason this page can carry twenty clips.
 *
 * Nothing autoplays. On a pointer device a clip decodes only while the card is
 * hovered; on a coarse pointer (no hover to wait for) it plays only while its
 * card is the one crossing the middle of the screen. Either way at most a
 * couple of videos are ever decoding, which is what keeps the grid smooth as
 * the archive grows — the same discipline the home panels use, restaged for a
 * list instead of a sequence.
 *
 * Returns a disposer: these are raw listeners and ScrollTriggers created
 * outside any tween, so gsap.context()'s revert() cannot see them.
 */
export function initWorksMedia(ST: typeof window.ScrollTrigger) {
  const cleanups: (() => void)[] = [];
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  document.querySelectorAll<HTMLElement>(".work-card-media").forEach((media) => {
    const video = media.querySelector("video");
    if (!video) return;

    // play() rejects when the browser still wants a gesture, or when the clip
    // is swapped out mid-play. Nothing to recover from, so it is swallowed.
    const play = () => void video.play().catch(() => {});
    const stop = () => video.pause();

    if (coarse) {
      const trigger = ST.create({
        trigger: media,
        start: "top 75%",
        end: "bottom 25%",
        onEnter: play,
        onEnterBack: play,
        onLeave: stop,
        onLeaveBack: stop,
      });
      cleanups.push(() => {
        trigger.kill();
        stop();
      });
      return;
    }

    media.addEventListener("pointerenter", play);
    media.addEventListener("pointerleave", stop);
    cleanups.push(() => {
      media.removeEventListener("pointerenter", play);
      media.removeEventListener("pointerleave", stop);
      stop();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
