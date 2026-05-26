import { useEffect } from "react";

export function useLoadPortfolioScripts(setLoaded: (v: boolean) => void) {
  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          res();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = rej;
        document.head.appendChild(s);
      });

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/MotionPathPlugin"),
    ])
      .then(([, gsapMod, stMod, mpMod]) => {
        window.gsap = gsapMod.gsap;
        window.ScrollTrigger = stMod.ScrollTrigger;
        window.MotionPathPlugin = mpMod.MotionPathPlugin;
        window.gsap.registerPlugin(window.ScrollTrigger, window.MotionPathPlugin);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("[portfolio] script load failed:", err);
      });
  }, [setLoaded]);
}
