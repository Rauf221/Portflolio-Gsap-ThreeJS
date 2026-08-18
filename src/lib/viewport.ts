/**
 * Frozen render height (CSS px) for the hero visuals. The Unicorn scene box
 * (UnicornHeroBackground) and the Three.js sphere (usePortfolioThree) are both
 * pinned to this height instead of each machine's window.innerHeight, so the
 * SDK / renderer draws them ONCE at a fixed size and they never reframe on
 * resize or page-zoom. 900 matches public/unicorn/scene.json's options.height
 * (the Unicorn scene's authored 1440x900 canvas), so its cover scaling behaves
 * as designed. The hero section sizes itself to
 * min(100vh, DESKTOP_REFERENCE_HEIGHT) and clips this frozen box.
 */
export const DESKTOP_REFERENCE_HEIGHT = 900;

/**
 * When the Experience hall drops its 3D treatment for a plain readable stack.
 * Read from two places that must agree exactly — the GSAP choreography (which
 * skips the pin) and the atmosphere canvas (which refuses to mount) — so the
 * query lives here rather than being written out twice.
 */
export const HALL_FLAT_MEDIA =
  "(prefers-reduced-motion: reduce), (max-width: 900px)";

export function prefersFlatHall() {
  return (
    typeof window !== "undefined" && window.matchMedia(HALL_FLAT_MEDIA).matches
  );
}
