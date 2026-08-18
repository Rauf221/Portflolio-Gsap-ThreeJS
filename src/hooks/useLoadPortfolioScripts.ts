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
