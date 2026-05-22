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
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
    ])
      .then(() =>
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
      )
      .then(() => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setLoaded(true);
      });
  }, [setLoaded]);
}
