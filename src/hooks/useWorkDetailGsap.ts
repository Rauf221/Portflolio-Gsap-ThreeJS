import { useEffect, type RefObject } from "react";
import { initProgressBar } from "../animations/chrome";
import { initFooterReveals } from "../animations/footer";
import {
  initWorkChapters,
  initWorkFan,
  initWorkFacts,
  initWorkHero,
  initWorkHeroScrub,
  initWorkHighlights,
  initWorkNext,
  initWorkSpectrum,
} from "../animations/workDetail";

/**
 * Thin orchestrator for /works/[slug], with the same two-phase shape as the
 * other pages: the hero's entrance first (tweens only), then everything
 * scroll-driven, created in document order so the deck's pin registers after
 * the triggers above it.
 *
 * `slug` is in the dependency list on purpose. Next reuses this component
 * across a client-side navigation from one project to the next, so the whole
 * context has to be torn down and rebuilt against the new page's DOM.
 */
export function useWorkDetailGsap(
  loaded: boolean,
  slug: string,
  progressRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!loaded || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    let disposeSpectrum: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Phase A — entrance only.
      initWorkHero(gsap);

      // Phase B — scroll-driven, top down.
      initProgressBar(progressRef.current, gsap);
      initWorkHeroScrub(gsap);
      initWorkFacts(gsap);
      initWorkChapters(gsap);
      initWorkHighlights(gsap);
      initWorkFan(gsap);
      disposeSpectrum = initWorkSpectrum(gsap);
      initWorkNext(gsap);
      initFooterReveals(gsap, null);
    });

    ST.refresh();

    return () => {
      disposeSpectrum?.();
      ctx.revert();
    };
  }, [loaded, slug, progressRef]);
}
