import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { setLenisInstance } from "../lib/lenisInstance";

export function usePortfolioLenis(loaded: boolean) {
  useEffect(() => {
    if (!loaded || !window.gsap || !window.ScrollTrigger) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      autoRaf: false,
    });

    setLenisInstance(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tickerUpdate);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [loaded]);
}
