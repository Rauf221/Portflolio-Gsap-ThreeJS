/**
 * Reference viewport height used to freeze full-viewport hero visuals
 * (UnicornHeroBackground, the Three.js sphere scene) at mount instead of
 * each machine's own window.innerHeight. Height is intentionally NOT
 * live-tracked (only width responds to viewport/device changes) — using a
 * fixed value here, rather than a per-machine runtime measurement, keeps
 * the frozen aspect ratio identical across every user's machine regardless
 * of monitor resolution, OS display-scaling, browser chrome height, or
 * whether the window is maximized. This also keeps any effect layered on
 * top of the hero photo (positioned against this same fixed reference
 * frame) aligned with the photo at every screen size, which live-tracking
 * height breaks.
 *
 * 900 matches public/unicorn/scene.json's options.height (the Unicorn
 * Studio scene's own authored design canvas, 1440x900), so the SDK's
 * internal cover-style layer scaling behaves exactly as the scene was
 * designed. The Three.js sphere scene reuses the same value for
 * consistency between the two hero visuals.
 */
export const DESKTOP_REFERENCE_HEIGHT = 900;

/**
 * Pixels trimmed off the TOP of the hero scene. The scene's authored
 * composition leaves ~105px of empty backdrop above the subject's head, which
 * buys nothing on screen and pushes the rest of the scene down. Cropping it is
 * strictly better than letting that emptiness eat viewport height.
 *
 * The crop is applied inside the zoom-compensating scale() (see
 * UnicornHeroBackground), never as a layout offset, so it stays fixed in scene
 * pixels rather than drifting relative to the artwork as the page is zoomed.
 *
 * 50 is the practical ceiling: it lifts the top of the head to ~55px, clearing
 * the fixed nav's visible text (which ends at ~44px) by 11px. Going much
 * further pushes the head behind the nav links.
 */
export const HERO_TOP_CROP = 50;

/**
 * On-screen height of the hero scene once HERO_TOP_CROP is removed — i.e. how
 * tall the hero section must be to show the scene in full. The scene itself is
 * still rendered at DESKTOP_REFERENCE_HEIGHT; only this much of it survives.
 */
export const HERO_VISIBLE_HEIGHT = DESKTOP_REFERENCE_HEIGHT - HERO_TOP_CROP;
