export {};

/*
 * The portfolio wires its libraries through window (useLoadPortfolioScripts)
 * so every consumer sees the exact same instances the plugins were registered
 * on. These are the real module types, not `any` — window.gsap has the same
 * surface as `import { gsap } from "gsap"`.
 */
declare global {
  interface Window {
    gsap: typeof import("gsap").gsap;
    ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
    THREE: typeof import("three");
  }
}
