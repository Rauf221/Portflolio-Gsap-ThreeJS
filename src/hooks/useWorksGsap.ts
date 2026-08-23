import { useEffect, useRef, type RefObject } from "react";
import { initProgressBar } from "../animations/chrome";
import { initFooterReveals } from "../animations/footer";
import {
  initWorksCards,
  initWorksCta,
  initWorksHero,
  initWorksMedia,
  initWorksRailCounter,
} from "../animations/worksArchive";

type Args = {
  progressRef: RefObject<HTMLDivElement | null>;
  /** Called with the data-work-index of whichever card is crossing mid-screen. */
  onActiveWork: (index: number) => void;
};

/**
 * Thin orchestrator for /works — the archive's counterpart to usePortfolioGsap.
 * It owns the same two-phase order: the hero's entrance first (tweens only, no
 * ScrollTriggers), then everything scroll-driven, created top-down so triggers
 * register in document order.
 *
 * Everything lands inside one gsap.context, so ctx.revert() undoes the tweens
 * and their triggers on unmount. The media discipline returns its own disposer
 * because it owns raw listeners and standalone triggers that revert() cannot
 * see.
 */
export function useWorksGsap(loaded: boolean, { progressRef, onActiveWork }: Args) {
  // Kept in a ref so a parent re-render (the filter state lives up there) never
  // tears down and rebuilds every trigger on the page.
  const onActiveRef = useRef(onActiveWork);
  useEffect(() => {
    onActiveRef.current = onActiveWork;
  }, [onActiveWork]);

  useEffect(() => {
    if (!loaded || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    let disposeMedia: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Phase A — entrance only.
      initWorksHero(gsap);

      // Phase B — scroll-driven, in document order.
      initProgressBar(progressRef.current, gsap);
      initWorksCards(gsap);
      initWorksRailCounter(ST, (index) => onActiveRef.current(index));
      initWorksCta(gsap);
      // The shared footer, animated exactly as it is on the home page. `null`
      // for the dock: there is no floating dock on this page to step aside.
      initFooterReveals(gsap, null);
      disposeMedia = initWorksMedia(ST);
    });

    ST.refresh();

    return () => {
      disposeMedia?.();
      ctx.revert();
    };
  }, [loaded, progressRef]);
}
