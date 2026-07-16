/**
 * Frozen render height of the hero scene, in CSS pixels. The scene box is
 * ALWAYS this tall regardless of the machine's window.innerHeight — it is never
 * scaled or stretched to fit. 900 matches public/unicorn/scene.json's
 * options.height (the Unicorn Studio scene's authored canvas, 1440x900), so the
 * SDK's cover-style layer scaling behaves exactly as designed, and keeping it
 * fixed means the scene's aspect ratio is identical on every screen.
 *
 * The hero section instead sizes itself to `min(100vh, DESKTOP_REFERENCE_HEIGHT)`
 * and the scene box is bottom-anchored inside it, so on viewports shorter than
 * the scene the section's `overflow: hidden` crops the dead space off the TOP
 * while the bottom edge (the subject) stays put. On taller viewports the
 * section ends at the scene's bottom and the next section takes over — no empty
 * backdrop below the scene. Because the box's height never changes, the SDK's
 * ResizeObserver never fires on the vertical axis; only width stays live.
 *
 * The Three.js sphere scene reuses the same value for consistency.
 */
export const DESKTOP_REFERENCE_HEIGHT = 900;
