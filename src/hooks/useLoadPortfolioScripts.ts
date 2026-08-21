import { useEffect } from "react";

export function useLoadPortfolioScripts(
  setLoaded: (v: boolean) => void,
  onError?: () => void,
) {
  useEffect(() => {
    // three is bundled from npm (also used by SkillModelViewer) — sharing the
    // single module avoids loading a second, duplicate copy from a CDN.
    Promise.all([
      import("three"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/DrawSVGPlugin"),
    ])
      .then(([threeMod, gsapMod, stMod, drawMod]) => {
        window.THREE = threeMod;
        window.gsap = gsapMod.gsap;
        window.ScrollTrigger = stMod.ScrollTrigger;
        window.gsap.registerPlugin(window.ScrollTrigger, drawMod.DrawSVGPlugin);
        /*
         * Mobile browsers fire `resize` every time the URL bar slides in or
         * out, which is mid-scroll and constant. Left alone, each one triggers
         * a full ScrollTrigger.refresh() — every pin on the page re-measures
         * and the scroll position visibly jumps. This tells ScrollTrigger to
         * ignore height-only mobile resizes; a real orientation change or
         * width change still refreshes. The section heights are in svh, which
         * is the unit that does NOT change when the bar moves, so nothing is
         * left mis-measured by skipping those refreshes.
         */
        window.ScrollTrigger.config({ ignoreMobileResize: true });
        setLoaded(true);
      })
      .catch((err) => {
        // Without this the page would stay locked forever: scroll is frozen and
        // the preloader waits for `loaded`, which will now never come. The
        // caller downgrades to a plain readable page instead.
        console.error("[portfolio] script load failed:", err);
        onError?.();
      });
  }, [setLoaded, onError]);
}
