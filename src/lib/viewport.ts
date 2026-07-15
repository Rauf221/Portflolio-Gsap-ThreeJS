/**
 * Reference viewport height used to freeze full-viewport hero visuals
 * (UnicornHeroBackground, the Three.js sphere scene) at mount instead of
 * each machine's own window.innerHeight. Height is intentionally NOT
 * live-tracked (only width responds to viewport/device changes) — using a
 * fixed value here, rather than a per-machine runtime measurement, keeps
 * the frozen aspect ratio identical across every user's machine regardless
 * of monitor resolution, OS display-scaling, browser chrome height, or
 * whether the window is maximized.
 *
 * 900 matches public/unicorn/scene.json's options.height (the Unicorn
 * Studio scene's own authored design canvas, 1440x900), so the SDK's
 * internal cover-style layer scaling behaves exactly as the scene was
 * designed. The Three.js sphere scene reuses the same value for
 * consistency between the two hero visuals.
 */
export const DESKTOP_REFERENCE_HEIGHT = 900;
