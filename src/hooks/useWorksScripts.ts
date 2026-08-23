import { useEffect } from "react";

/**
 * The /works page's loader — gsap + ScrollTrigger and nothing else.
 *
 * Deliberately NOT useLoadPortfolioScripts: that one also pulls three and
 * DrawSVG, which this page has no scene and no SVG stroke to draw. It writes to
 * the same window slots (typed in src/globals.ts), so Lenis and the cursor
 * hooks, which read window.gsap, work here unchanged.
 */
export function useWorksScripts(
  setLoaded: (v: boolean) => void,
  onError?: () => void,
) {
  useEffect(() => {
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapMod, stMod]) => {
        window.gsap = gsapMod.gsap;
        window.ScrollTrigger = stMod.ScrollTrigger;
        window.gsap.registerPlugin(window.ScrollTrigger);
        /*
         * Same reasoning as the home page: a mobile URL bar sliding in or out
         * fires `resize` constantly mid-scroll, and each one would otherwise
         * refresh every trigger on the page. The heights here are in svh, the
         * unit that does not change when the bar moves, so skipping those
         * refreshes leaves nothing mis-measured.
         */
        window.ScrollTrigger.config({ ignoreMobileResize: true });
        setLoaded(true);
      })
      .catch((err) => {
        // The page stays fully readable without gsap — every reveal is a
        // from-tween over resting content — so the caller only has to hand the
        // native cursor back.
        console.error("[works] script load failed:", err);
        onError?.();
      });
  }, [setLoaded, onError]);
}
