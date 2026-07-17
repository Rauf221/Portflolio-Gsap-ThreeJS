import { useEffect } from "react";

export function useLoadPortfolioScripts(setLoaded: (v: boolean) => void) {
  useEffect(() => {
    // three is bundled from npm (also used by SkillModelViewer) — sharing the
    // single module avoids loading a second, duplicate copy from a CDN.
    Promise.all([
      import("three"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/MotionPathPlugin"),
      import("gsap/DrawSVGPlugin"),
    ])
      .then(([threeMod, gsapMod, stMod, mpMod, drawMod]) => {
        window.THREE = threeMod;
        window.gsap = gsapMod.gsap;
        window.ScrollTrigger = stMod.ScrollTrigger;
        window.MotionPathPlugin = mpMod.MotionPathPlugin;
        window.gsap.registerPlugin(
          window.ScrollTrigger,
          window.MotionPathPlugin,
          drawMod.DrawSVGPlugin
        );
        setLoaded(true);
      })
      .catch((err) => {
        console.error("[portfolio] script load failed:", err);
      });
  }, [setLoaded]);
}
