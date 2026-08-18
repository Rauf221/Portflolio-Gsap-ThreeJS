/**
 * The sphere lives for exactly one section: the pinned Skills ("What I do best")
 * block, in two acts:
 *
 *   1. fades in on the right, rides the headline across to the left, shedding
 *      its purple shell as it goes;
 *   2. the moment the swiper lands — just before the headline clears the screen
 *      — it sweeps back to centre and its dark core bursts, then fades out.
 *
 * Everywhere else it is neither drawn nor rendered.
 *
 * GSAP writes these targets; the Three.js loop reads them each frame and lerps
 * toward them, so every value here is a destination, not a position.
 */
/** Where it appears — screen right. */
export const SPHERE_SKILLS_START_X = 6.2;
/** Where the headline drags it — screen left. */
export const SPHERE_SKILLS_LEFT_X = -6.2;
export const SPHERE_CENTER_X = 0;

/*
 * Choreography, as fractions of the Skills pin's progress.
 *
 * The handoff point between the two acts is deliberately NOT a constant here:
 * it is derived live from the carousel's own metrics (see `swiperOnScreen` in
 * usePortfolioGsap), because the moment the swiper lands depends on measured
 * headline width and card geometry and therefore shifts on every resize.
 */
export const SPHERE_SKILLS_FADE_IN_END = 0.02;
/** Purple starts shedding as soon as the fade-in completes. */
export const SPHERE_OUTER_EXPLODE_START = 0.02;
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
