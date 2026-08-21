import { DESKTOP_REFERENCE_HEIGHT } from "./viewport";

/**
 * The sphere lives for exactly one section: the pinned Skills ("What I do best")
 * block, in two acts:
 *
 *   1. fades in on the right as the headline's first character enters, rides
 *      across to the left in lockstep with it, and sheds its purple shell —
 *      that first burst starting once the word "What" has finished assembling;
 *   2. the moment the swiper lands — just before the headline clears the screen
 *      — it sweeps back to centre and its dark core bursts, then fades out.
 *
 * Everywhere else it is neither drawn nor rendered.
 *
 * GSAP writes these targets; the Three.js loop reads them each frame and lerps
 * toward them, so every value here is a destination, not a position.
 */
/**
 * Seed value only. The ride itself is not authored from here any more: the
 * sphere's centre is pinned to the screen position of the headline's first
 * character (see the desktop branch in animations/skills.ts), so where it
 * appears is wherever the "W" appears. This is what `groupX` holds before
 * anything has computed a real one.
 */
export const SPHERE_SKILLS_START_X = 6.2;
export const SPHERE_CENTER_X = 0;

/*
 * Those two numbers are authored for a desktop frame. The renderer is sized
 * innerWidth x DESKTOP_REFERENCE_HEIGHT, so the camera's aspect — and with it
 * the world width it can see — collapses with the viewport: a 390px phone
 * sees ~7 world units across, where a 1440px desktop sees ~26. Used as
 * literals there, the sphere would ride entirely off-screen and be wider than
 * the frame while it did it.
 *
 * So both the travel and the size are refitted to the half-width the camera
 * actually sees, with the desktop values as the ceiling. These three must
 * match the camera and geometry built in usePortfolioThree.
 */
const SPHERE_CAMERA_Z = 14;
const SPHERE_FOV_DEG = 60;
const SPHERE_OUTER_RADIUS = 3.8;
/** How much of the visible width the sphere may span, and how far out from
 *  centre it may sit as a fraction of the visible half-width — the anchor it
 *  parks at once the "W" it is riding carries on off the edge. */
const SPHERE_WIDTH_SHARE = 0.62;
const SPHERE_TRAVEL_SHARE = 0.55;

/** Half the world width the camera sees at the sphere's plane, in units. */
export function sphereVisibleHalfWidth(viewportWidth: number) {
  const visibleH =
    2 * SPHERE_CAMERA_Z * Math.tan((SPHERE_FOV_DEG * Math.PI) / 360);
  return (visibleH / 2) * (viewportWidth / DESKTOP_REFERENCE_HEIGHT);
}

/** Park anchor and scale that keep the sphere on screen at any width. */
export function sphereFit(viewportWidth: number) {
  const halfW = sphereVisibleHalfWidth(viewportWidth);
  return {
    travelX: Math.min(SPHERE_SKILLS_START_X, halfW * SPHERE_TRAVEL_SHARE),
    scale: Math.min(1, (halfW * SPHERE_WIDTH_SHARE) / SPHERE_OUTER_RADIUS),
  };
}

/**
 * A screen x (CSS px from the left of the viewport) as the sphere's world X —
 * the inverse of how the scene lands on the page, so the choreography can say
 * "be exactly here, where that letter is" instead of guessing at a fraction.
 *
 * Two things make this exact rather than approximate:
 *
 *  - The camera pans by `group.position.x * 0.15` and then `lookAt(0,0,0)`.
 *    Those two very nearly cancel: the pan moves the sphere 0.85x across the
 *    frame and the re-aim gives back the 0.15x, so to first order one world
 *    unit is still one `halfW`-th of the frame. Do not "fix" this by
 *    subtracting the pan — that would double-count the re-aim.
 *  - The canvas is innerWidth CSS px wide but drawn into a frozen
 *    DESKTOP_REFERENCE_HEIGHT-tall box that usePortfolioThree scales up to
 *    cover a taller viewport. That scale widens the frame on screen too, so it
 *    has to divide out here. It mirrors `coverScale` there at its steady state
 *    (the dpr terms in that copy are browser-zoom compensation, which cancels).
 */
export function sphereWorldXAtScreenX(
  screenX: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const halfW = sphereVisibleHalfWidth(viewportWidth);
  const cover = Math.max(1, viewportHeight / DESKTOP_REFERENCE_HEIGHT);
  const halfFramePx = (viewportWidth / 2) * cover;
  return ((screenX - viewportWidth / 2) / halfFramePx) * halfW;
}

/*
 * Choreography, as fractions of the Skills pin's progress.
 *
 * The handoff point between the two acts is deliberately NOT a constant here:
 * it is derived live from the carousel's own metrics (see `swiperOnScreen` in
 * usePortfolioGsap), because the moment the swiper lands depends on measured
 * headline width and card geometry and therefore shifts on every resize.
 */
export const SPHERE_SKILLS_FADE_IN_END = 0.02;
/**
 * Phone fallback for where the purple shell starts shedding: as soon as the
 * fade-in completes. On desktop this moment is measured rather than authored —
 * act 1 waits for the word "What" to complete (`burstStartPin` in
 * animations/skills.ts), so the first burst reads as the headline's own beat.
 * Phones have no ride to sync to, so they keep this literal.
 */
export const SPHERE_OUTER_EXPLODE_START = 0.02;
/**
 * Floor on how much of the pin act 1 gets, whatever that measurement says. The
 * word-completion anchor is derived from headline width against viewport width,
 * so a very wide headline on a narrow screen could otherwise push it past the
 * act break and leave the purple shell to shed in zero scroll.
 */
export const SPHERE_OUTER_EXPLODE_MIN_SPAN = 0.04;
/**
 * Pulls the whole second act earlier. The measured act break (swiper landing /
 * headline exit) sits around 0.22 of the pin; this multiplies it, so 0.5 fires
 * the centre sweep and the dark burst at roughly half that point.
 *
 * SPHERE_ACT_BREAK_BIAS cannot do this job — it only blends between two moments
 * that are ~1.5% of the pin apart. This is the dial for "the explosion should
 * happen earlier"; note it also shortens the ride, since the sphere's travel
 * from right to left finishes at the same anchor.
 */
export const SPHERE_EXPLODE_EARLY = 0.5;
/**
 * Where act 1 hands over to act 2, as a blend between two live-measured moments:
 *
 *   0 = the swiper stage has finished fading in   (pin progress ~0.28)
 *   1 = the headline has fully cleared the screen (pin progress ~0.43)
 *
 * The brief is "just before the text exits, as the swiper lands", which sits
 * between the two — hence a blend rather than either endpoint. **This is the
 * dial to turn if the centre sweep and the dark burst feel early or late.**
 * Lower it toward 0 to fire earlier with the swiper's arrival, raise it toward
 * 1 to hold until the headline is genuinely gone.
 */
export const SPHERE_ACT_BREAK_BIAS = 0.6;
/** How much of the pin the sweep from screen-left to centre occupies. */
export const SPHERE_CENTER_MOVE_SPAN = 0.15;
export const SPHERE_INNER_EXPLODE_END = 0.85;
export const SPHERE_FADE_OUT_START = 0.92;

export const sphereState = {
  groupX: SPHERE_SKILLS_START_X,
  /** Uniform scale of the whole sphere group. 1 for Skills; shrunk for the tunnel. */
  groupScale: 1,
  outerExplode: 0,
  innerExplode: 0,
  globalOpacity: 0,
  /** While true the Three.js render loop idles (set false once the intro finishes). */
  paused: true,
  /** True while the Skills pin — the sphere's only owner — is on screen. */
  inRange: false,
};

/**
 * `paused` and `inRange` have deliberately disjoint owners — the preloader in
 * `Portfolio.tsx` owns the first, the Skills pin trigger owns the second, and
 * neither ever reads or writes the other's flag. The render loop is the only
 * place the two are combined, which is why this lives here rather than being
 * inlined as a second boolean check.
 */
export function sphereShouldRender() {
  return !sphereState.paused && sphereState.inRange;
}

export function resetSphereState() {
  sphereState.groupX = SPHERE_SKILLS_START_X;
  sphereState.groupScale = 1;
  sphereState.outerExplode = 0;
  sphereState.innerExplode = 0;
  sphereState.globalOpacity = 0;
  sphereState.inRange = false;
}
