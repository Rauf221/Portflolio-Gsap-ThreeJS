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
 * When the Experience section drops its 3D treatment for a plain readable
 * stack. Reduced motion ONLY — the gravity playground runs on phones too
 * (pointer events cover touch; cards carry touch-action: none so a drag never
 * turns into a scroll). Read from two places that must agree exactly — the
 * GSAP choreography (which skips the pin) and the atmosphere canvas (which
 * refuses to mount) — so the query lives here rather than being written out
 * twice.
 */
export const HALL_FLAT_MEDIA = "(prefers-reduced-motion: reduce)";

/**
 * Phone breakpoint, in CSS px. Shared rather than retyped because two very
 * different consumers have to agree on it: the stylesheet's `@media` blocks
 * and the sphere's canvas offset below.
 */
export const MOBILE_MAX_WIDTH = 700;

/**
 * How far the Skills headline sits above dead centre on phones, as a fraction
 * of the viewport height.
 *
 * Currently 0 — the headline rests dead centre once the section is pinned,
 * which is where the composition (headline plus the sphere behind it) is meant
 * to be read. The empty air above it *while the section arrives* is closed by
 * the descent tween instead (SKILLS_HEADLINE_RISE_VH in animations/skills.ts):
 * the line enters high and sinks into place. A static lift on top of that
 * tween double-counts, and leaves the pinned composition sitting high.
 *
 * Kept as a named constant because TWO things must agree on it:
 *   • `.skills-headline-stage`'s translateY (globalCssString) — the lift
 *   • the sphere canvas's own Y offset (usePortfolioThree) — the sphere has
 *     to ride on the headline's line, not the viewport's centre
 * Change it in one place and the sphere silently drifts off the headline.
 */
export const SKILLS_MOBILE_LIFT = 0;

export function prefersFlatHall() {
  return (
    typeof window !== "undefined" && window.matchMedia(HALL_FLAT_MEDIA).matches
  );
}
