import {
  sphereFit,
  sphereState,
  sphereWorldXAtScreenX,
  SPHERE_ACT_BREAK_BIAS,
  SPHERE_CENTER_X,
  SPHERE_CENTER_MOVE_SPAN,
  SPHERE_EXPLODE_EARLY,
  SPHERE_FADE_OUT_START,
  SPHERE_INNER_EXPLODE_END,
  SPHERE_OUTER_EXPLODE_MIN_SPAN,
  SPHERE_OUTER_EXPLODE_START,
  SPHERE_SKILLS_FADE_IN_END,
} from "../lib/sphereState";
import { MOBILE_MAX_WIDTH } from "../lib/viewport";

/* ── Skills: pinned headline fly-in + vertical carousel + sphere ────────────
 * One pin owns the headline that flies in and exits left and the icon/name
 * carousel that streams through after it. The 3D sphere — fade in, ride left,
 * centre sweep, burst, fade out — is a pure function of a single progress
 * number, but that number runs on a slightly LONGER clock than the pin: the
 * headline starts moving a lead before the pin engages (desktop), and the
 * sphere has to leave with the first character rather than a third of the way
 * through the line's journey. See `clockToPinProgress` below; pin progress is
 * still the unit, it just opens below zero. */

const SKILLS_HEADLINE_CHAR_FROM = [
  { x: 550, y: -440, ease: "power4.out" },
  { x: 420, y: -450, ease: "power3.out" },
  { x: 400, y: 430, ease: "power4.out" },
  { x: 460, y: 350, ease: "power2.out" },
  { x: 440, y: -440, ease: "power3.out" },
  { x: 400, y: -440, ease: "power4.out" },
  { x: 480, y: 370, ease: "power2.out" },
  { x: 450, y: -400, ease: "power3.out" },
  { x: 440, y: 460, ease: "power4.out" },
  { x: 410, y: 400, ease: "back.out(1.4)" },
  { x: 430, y: -460, ease: "power3.out" },
  { x: 480, y: -330, ease: "power2.out" },
  { x: 490, y: 490, ease: "power4.out" },
  { x: 470, y: -420, ease: "power3.out" },
  { x: 450, y: -420, ease: "power2.out" },
  { x: 460, y: 450, ease: "elastic.out(1, 0.7)" },
] as const;

const SKILLS_STREAM_LEAD = 1.35;
const SKILLS_STREAM_PREROLL = 1.25;
const SKILLS_CAROUSEL_INTRO = 0.14;
/** Carousel fades in once headline scroll reaches this fraction (before exit completes). */
const SKILLS_CAROUSEL_HEADLINE_START = 0.38;
const SKILLS_HEADLINE_BUFFER_VH = 0.05;
/**
 * Scroll pixels spent per pixel of the headline's horizontal travel.
 *
 * At 1 the mapping is 1:1 — the track moves exactly as far as you scroll, which
 * is what made the headline phase cost a full `exitTrackX` (~3.3 screen widths)
 * of scrolling. Lowering it compresses the same journey into less scroll: the
 * characters still start a full viewport off-screen and cover the same distance,
 * they just travel faster per wheel tick. This is the dial for "too much empty
 * scroll" — shortening the CSS padding-left instead would start the headline
 * mid-screen and kill the fly-in.
 */
const SKILLS_HEADLINE_SCROLL_RATIO = 0.65;
/**
 * How much of a head start the headline gets, in viewport heights, before the
 * pin engages. The track used to begin at "top top" — nothing moved until the
 * section had covered the whole screen, which is what made the approach read as
 * dead space. At 0.75 the characters start drifting in while About is still
 * finishing, and the pin only has to cover the remainder of the travel (so this
 * shortens the pin by the same amount rather than adding scroll).
 */
const SKILLS_HEADLINE_LEAD_VH = 0.75;
/**
 * Phones cut that lead right down, because on a narrow screen the headline's
 * travel is dominated by the one-viewport run-up: at 0.75 roughly two thirds
 * of the journey happens BEFORE the pin exists, so the line is most of the way
 * across — the "W" long since visible — while the sphere, which is a pure
 * function of pin progress, is not allowed to exist yet. Cutting the lead puts
 * that travel back on the pin, so the sphere arrives with the first character
 * and act 1 has room to finish as the line clears the frame.
 */
const SKILLS_HEADLINE_LEAD_VH_MOBILE = 0.15;
const getHeadlineLeadVh = () =>
  window.innerWidth <= MOBILE_MAX_WIDTH
    ? SKILLS_HEADLINE_LEAD_VH_MOBILE
    : SKILLS_HEADLINE_LEAD_VH;
/**
 * How far above its centred resting place the headline's baseline starts, in
 * viewport heights. The stage centres the headline (align-items: center), so at
 * 0.4 the first character enters near the top of the section and the whole line
 * then descends into centre as you scroll. Raise it to enter higher, lower it to
 * enter closer to centre.
 */
const SKILLS_HEADLINE_RISE_VH = 0.4;
/** Fraction of the headline's scroll over which that descent completes. */
const SKILLS_HEADLINE_RISE_SPAN = 0.2;
/**
 * Which character the sphere's first burst waits for, in
 * `.skills-headline-char-wrap` document order. The line is "What I" + a spacer
 * + "do best" + ".", so index 3 is the "t" of "What".
 */
const SKILLS_HEADLINE_WORD_END_INDEX = 3;
/**
 * The two viewport fractions the per-character fly-in ScrollTriggers use for
 * their own start/end ("left 108%" / "left 54%"), mirrored here so the sphere
 * can be timed off the exact same two moments the letters are. Change one of
 * these and you must change the matching literal on the char trigger below.
 */
const SKILLS_CHAR_ENTER_VW = 1.08;
const SKILLS_CHAR_LANDED_VW = 0.54;
/**
 * How far through that fly-in the "t" is when the purple shell starts to go —
 * **the dial for "the burst is early/late"**. Deliberately a fraction of the
 * character's own window rather than a viewport fraction of its own, so it
 * cannot drift away from the two anchors above.
 *
 * 0.5, not 1, because the characters land visually long before their trigger
 * ends: the from-tweens use hard out-eases (power2/power4), so at half the
 * window a `power2.out` character has already covered three quarters of its
 * distance. Waiting for the trigger to actually finish puts the burst a good
 * half-screen of scroll after the word reads as written.
 */
const SKILLS_BURST_CHAR_FLY_IN = 0.5;

function getSkillsCarouselMetrics(itemCount: number) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  // MUST mirror .skills-icon-tile's width clamp (globalCssString), including
  // its max-width: 700px override — this number spaces the stream, the CSS
  // sizes the tile, and they drift apart if only one is edited.
  const cardSize =
    vw <= MOBILE_MAX_WIDTH
      ? Math.min(Math.max(vw * 0.32, 118), 154)
      : Math.min(Math.max(vw * 0.14, 154), 218);
  const cardGap = cardSize * 1.38;
  const progressMin = -SKILLS_STREAM_LEAD;
  const progressMax = Math.max(itemCount - 1, 0) + SKILLS_STREAM_LEAD;
  const progressSpan = progressMax - progressMin;
  const streamPx = progressSpan * cardGap * 0.96;
  const introPx = vh * 0.28;
  const carouselPx =
    streamPx / (1 - SKILLS_CAROUSEL_INTRO) + introPx;
  return {
    cardGap,
    cardSize,
    progressSpan,
    progressMin,
    progressMax,
    streamStart: progressMin - SKILLS_STREAM_PREROLL,
    carouselPx: Math.max(carouselPx, vh * 0.95),
  };
}

function layoutSkillsStack(
  iconItems: NodeListOf<Element>,
  nameRows: NodeListOf<Element>,
  progress: number,
) {
  const gsap = window.gsap;
  if (!gsap) return;

  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const { cardGap, cardSize } = getSkillsCarouselMetrics(iconItems.length);
  const nameGap = cardGap * 0.82;
  const cardArc = vw * 0.022;
  const nameArc = vw * 0.018;
  const edgeLimit = vh * 0.54 - cardSize * 0.48;
  const fadeBand = vh * 0.11;

  const fadeFromBottomExitTop = (y: number) => {
    if (y > edgeLimit + fadeBand) return 0;
    if (y < -(edgeLimit + fadeBand)) return 0;
    if (y > edgeLimit) return gsap.utils.mapRange(edgeLimit + fadeBand, edgeLimit, 0, 1, y);
    if (y < -edgeLimit) return gsap.utils.mapRange(-(edgeLimit + fadeBand), -edgeLimit, 0, 1, y);
    return 1;
  };

  const fadeFromTopExitBottom = (y: number) => {
    if (y < -(edgeLimit + fadeBand)) return 0;
    if (y > edgeLimit + fadeBand) return 0;
    if (y < -edgeLimit) return gsap.utils.mapRange(-(edgeLimit + fadeBand), -edgeLimit, 0, 1, y);
    if (y > edgeLimit) return gsap.utils.mapRange(edgeLimit + fadeBand, edgeLimit, 0, 1, y);
    return 1;
  };

  iconItems.forEach((item, i) => {
    const y = (progress - i) * cardGap;
    const dist = Math.abs(i - progress);
    const arcX = Math.pow(Math.min(dist, 2.2), 1.15) * cardArc;
    const scale = gsap.utils.clamp(0.92, 1, 1.12 - dist * 0.07);
    const edgeOpacity = fadeFromTopExitBottom(y);
    const focusOpacity = gsap.utils.clamp(0, 1, 1.15 - dist * 0.55);
    const opacity = edgeOpacity * focusOpacity;
    gsap.set(item, {
      x: arcX,
      y,
      scale,
      opacity,
      // Not decoration: each tile hosts a WebGL render + a canvas blit on
      // every frame, and an IntersectionObserver only sees geometry, so a
      // faded-out tile still inside the viewport would keep paying for a
      // picture nobody can see. SkillModelViewer's loop reads exactly this
      // through checkVisibility(). Typically ~5 of the 14 survive the fade at
      // any one moment, so this is most of the Skills pin's GPU cost.
      visibility: opacity < 0.01 ? "hidden" : "visible",
      rotation: gsap.utils.clamp(-4, 4, y * 0.011),
      zIndex: Math.round(100 + i),
      force3D: true,
    });
  });

  nameRows.forEach((row, i) => {
    const y = (i - progress) * nameGap;
    const dist = Math.abs(i - progress);
    const arcX = -Math.pow(Math.min(dist, 2.2), 1.1) * nameArc;
    const scale = gsap.utils.clamp(0.92, 1, 1.08 - dist * 0.035);
    const edgeOpacity = fadeFromBottomExitTop(y);
    // A gentler falloff than the tiles above deliberately use: these are words
    // laid over the sphere's wireframe, and at the tiles' 0.55 the neighbours
    // land close enough to the mesh's own value to stop reading as text at all.
    // A logo is a solid shape and survives being dimmed; a line of type is not.
    const focusOpacity = gsap.utils.clamp(0, 1, 1.18 - dist * 0.46);
    const opacity = edgeOpacity * focusOpacity;

    gsap.set(row, {
      x: arcX,
      y,
      scale,
      opacity,
      force3D: true,
    });
  });
}

export function initSkillsSection(
  sectionEl: HTMLElement,
  gsap: typeof window.gsap,
  ST: typeof window.ScrollTrigger,
) {
  const skillsTrack = sectionEl.querySelector(".skills-track") as HTMLElement;
  if (!skillsTrack) return;

  const carouselStage = sectionEl.querySelector(".skills-carousel-stage") as HTMLElement | null;
  const iconTrack = sectionEl.querySelector(".skills-icon-track") as HTMLElement | null;
  const iconItems = sectionEl.querySelectorAll(".skills-icon-item");
  const nameRows = sectionEl.querySelectorAll(".skills-carousel-name-row");

  const headline = skillsTrack.querySelector(".skills-headline") as HTMLElement | null;
  const headlineChars = skillsTrack.querySelectorAll(".skills-headline-char");
  const headlineCharWraps = skillsTrack.querySelectorAll(".skills-headline-char-wrap");

  const measureHeadlineScroll = () => {
    const vw = window.innerWidth;
    if (!headline) {
      return {
        exitTrackX: vw * 0.65,
        firstCharLeft: vw,
        firstCharCenter: vw,
        wordEndCharLeft: vw,
      };
    }

    const savedTrackX = gsap.getProperty(skillsTrack, "x") as number;

    gsap.set(skillsTrack, { x: 0 });
    gsap.set(headline, { x: 0 });

    const exitTrackX = headline.getBoundingClientRect().right + 80;

    // The WRAPS, never the chars: GSAP owns the inner .skills-headline-char's
    // transform (the fly-in), so its rect is wherever that tween currently has
    // it, while the wrap sits at its layout position with only the track's x —
    // which the two gsap.set calls above have just zeroed — applied.
    const wordEnd = headlineCharWraps[
      Math.min(SKILLS_HEADLINE_WORD_END_INDEX, headlineCharWraps.length - 1)
    ];
    const firstRect = headlineCharWraps.length
      ? headlineCharWraps[0].getBoundingClientRect()
      : null;
    const firstCharLeft = firstRect ? firstRect.left : vw;
    // The centre, because the sphere is placed ON the "W" rather than timed
    // against its leading edge the way the entry anchor above is.
    const firstCharCenter = firstRect ? firstRect.left + firstRect.width / 2 : vw;
    const wordEndCharLeft = wordEnd
      ? wordEnd.getBoundingClientRect().left
      : firstCharLeft;

    gsap.set(skillsTrack, { x: savedTrackX });

    return { exitTrackX, firstCharLeft, firstCharCenter, wordEndCharLeft };
  };

  const getSkillsPinMetrics = () => {
    const { exitTrackX, firstCharLeft, firstCharCenter, wordEndCharLeft } =
      measureHeadlineScroll();
    // exitTrackX is the horizontal distance the track covers; headlinePx is
    // the scroll spent covering it. Keeping them decoupled is what lets the
    // characters keep their full off-screen run-up on a shorter pin.
    const headlinePx = Math.max(
      exitTrackX * SKILLS_HEADLINE_SCROLL_RATIO + window.innerHeight * 0.35,
      window.innerHeight,
    );
    // The track starts moving before the pin, so part of headlinePx is spent
    // during the approach. Only the remainder happens on the pin, and it is
    // that remainder every pin-relative number below has to be built from.
    const headlineLeadPx = window.innerHeight * getHeadlineLeadVh();
    const headlineOnPinPx = Math.max(
      headlinePx - headlineLeadPx,
      window.innerHeight * 0.2,
    );
    const bufferPx = window.innerHeight * SKILLS_HEADLINE_BUFFER_VH;
    const carouselMetrics = getSkillsCarouselMetrics(iconItems.length);
    const carouselStartPx = headlineOnPinPx * SKILLS_CAROUSEL_HEADLINE_START;
    const totalPinPx = headlineOnPinPx + bufferPx + carouselMetrics.carouselPx;

    /*
     * Two moments lifted off the headline's own clock and restated in pin
     * progress, which is what lets the sphere stay a function of a single
     * number — one that simply goes negative for the part of the headline's
     * journey that happens before the pin exists.
     *
     * The track moves linearly with scroll (ease "none"), so the scroll spent
     * before a character's left edge reaches a given fraction of the viewport
     * is a straight proportion of headlinePx. Both anchors ignore the scrubs'
     * easing lag (1.2 on the track, 0.65 on the characters): that is smoothing
     * laid over the same clock, not a second one.
     */
    const headlineScrollAtChar = (charLeft: number, vwFraction: number) =>
      ((charLeft - window.innerWidth * vwFraction) / exitTrackX) * headlinePx;
    const toPinProgress = (headlineScrollPx: number) =>
      (headlineScrollPx - headlineLeadPx) / totalPinPx;
    // Clamped at 0 because the stage's 100vw padding-left already parks the
    // first character just inside the 108% entry line at rest: the "W" enters
    // on the very first pixel of headline travel, and the ride leaves with it.
    const rideStartPin = toPinProgress(
      Math.max(0, headlineScrollAtChar(firstCharLeft, SKILLS_CHAR_ENTER_VW)),
    );
    const burstStartPin = toPinProgress(
      headlineScrollAtChar(
        wordEndCharLeft,
        SKILLS_CHAR_ENTER_VW +
          (SKILLS_CHAR_LANDED_VW - SKILLS_CHAR_ENTER_VW) * SKILLS_BURST_CHAR_FLY_IN,
      ),
    );

    return {
      exitTrackX,
      headlinePx,
      headlineOnPinPx,
      headlineLeadPx,
      bufferPx,
      carouselStartPx,
      totalPinPx,
      carouselStartRatio: carouselStartPx / totalPinPx,
      firstCharCenter,
      rideStartPin,
      burstStartPin,
      // Desktop hands the sphere the headline's pre-pin lead as well, so it can
      // start riding with the first character. Phones have no ride to sync to,
      // so the pin stays its whole life and every number below is unchanged.
      sphereLeadPx:
        window.innerWidth <= MOBILE_MAX_WIDTH ? 0 : headlineLeadPx,
      ...carouselMetrics,
    };
  };

  let pinMetrics = getSkillsPinMetrics();
  const carouselProgress = { value: 0 };
  /*
   * The last progress the sphere's clock reported. Cached because the sphere
   * has two independent reasons to be recomputed — the scroll moved, or the
   * scrubbed headline track moved — and only the first of them carries a
   * progress value. See the track tween's onUpdate at the bottom.
   */
  let sphereProgress = 0;

  /*
   * The sphere's whole life, as a pure function of one progress number:
   *
   *   right ──(rides the headline)──> left ──(headline exits)──> centre, burst
   *
   * The ride leaves with the "W" and the first burst waits for "What" to
   * finish, both measured off the characters' own fly-in anchors, so the line
   * and the sphere read as one gesture rather than two things that happen to
   * overlap.
   *
   * Deliberately not a set of scrubbed tweens. The two `groupX` channels —
   * the ride left and the sweep back to centre — would otherwise be separate
   * tweens both writing the same property with no defined winner. Composed
   * algebraically there is exactly one writer. It also puts the sphere on the
   * headline's own clock (raw `self.progress`) rather than trailing it by a
   * scrub; smoothing is still supplied downstream by the render loop's lerps.
   *
   * Being stateless is what makes reverse scrolling correct for free: the
   * same scroll position always yields the same values, in either direction.
   */
  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const easeInOut = gsap.parseEase("power2.inOut");
  /**
   * `p` is pin progress with its domain opened below zero: on desktop the
   * sphere's clock starts where the HEADLINE starts moving, a lead of
   * SKILLS_HEADLINE_LEAD_VH before the pin exists, so p is negative for that
   * stretch. p === 0 is still exactly the pin's start, which is why every
   * pin-space number below — the act break, SPHERE_INNER_EXPLODE_END,
   * SPHERE_FADE_OUT_START — reads unchanged.
   */
  const applySphereChoreography = (p: number) => {
    sphereProgress = p;
    /*
     * The act break, blended between two moments that are both measured
     * live (never hardcoded — `carouselStartRatio` and `headlinePx` are
     * recomputed from headline width and card geometry on every refresh,
     * so literals would drift on resize):
     *
     *   swiperIn    — the swiper stage has finished fading in
     *   headlineOut — the headline has fully left the screen
     *
     * SPHERE_ACT_BREAK_BIAS picks the point between them.
     */
    const { carouselStartRatio } = pinMetrics;
    const swiperIn =
      carouselStartRatio + SKILLS_CAROUSEL_INTRO * (1 - carouselStartRatio);
    // headlineOnPinPx, not headlinePx: part of the headline's travel happens
    // during the approach, before the pin exists to have progress at all.
    const headlineOut = pinMetrics.headlineOnPinPx / pinMetrics.totalPinPx;
    const swiperOnScreen =
      (swiperIn + (headlineOut - swiperIn) * SPHERE_ACT_BREAK_BIAS) *
      SPHERE_EXPLODE_EARLY;

    /* Refitted every update rather than cached: the sphere's authored travel
     * and size assume a desktop-width camera, and a narrow viewport sees far
     * less world width. Reading innerWidth is a property lookup, not a layout,
     * and doing it here means resize/orientation changes need no invalidation
     * hook of their own. */
    const vw = window.innerWidth;
    const fit = sphereFit(vw);
    sphereState.groupScale = fit.scale;

    /*
     * Phones stage the same two acts on a different clock.
     *
     * The desktop version has the sphere ride in from screen right alongside
     * the headline and finish shedding its purple shell early (SPHERE_EXPLODE_EARLY
     * halves the act break). A phone has no room for that ride — the sphere
     * would spend the whole act mostly off-frame — so it simply arrives at
     * centre with the first character and stays there, and the shell sheds
     * across the entire time the headline is on screen, finishing exactly as
     * the line clears the frame. The dark core then takes over from there, so
     * the two bursts still never overlap.
     */
    const isMobile = vw <= MOBILE_MAX_WIDTH;
    const actBreak = isMobile ? headlineOut : swiperOnScreen;

    /*
     * When the ride begins: the moment the "W" crosses into frame, measured off
     * the same "left 108%" the character's own fly-in trigger uses. That happens
     * during the pre-pin lead, hence a negative pin progress — driven by the pin
     * instead, the sphere could not exist until a third of the headline's
     * journey was already spent.
     *
     * Only the fade-in reads it. Where the sphere IS during the ride does not
     * need a start point at all, because it is an absolute position — the "W"'s
     * own (see the desktop branch at the bottom).
     *
     * Phones keep 0: no ride, and the fade-in stays on today's
     * 0 -> SPHERE_SKILLS_FADE_IN_END window.
     */
    const rideStart = isMobile ? 0 : pinMetrics.rideStartPin;
    /*
     * And the purple shell begins shedding as the word "What" completes — the
     * "t" halfway through its own fly-in, by which point it has visually all
     * but arrived. On desktop this lands during the pre-pin lead, so it is a
     * negative progress; the clock's extended domain is what makes that
     * expressible at all. Floored clear of the act break so act 1 always has
     * scroll to happen in, however the measurement lands.
     */
    const outerStart = Math.min(
      isMobile ? SPHERE_OUTER_EXPLODE_START : pinMetrics.burstStartPin,
      actBreak - SPHERE_OUTER_EXPLODE_MIN_SPAN,
    );

    /*
     * It materialises as it leaves and is whole exactly as it starts to break
     * up: on desktop the fade-in runs from the "W" entering to the first burst,
     * so the two never overlap and the sphere is never shedding at 70% opacity.
     * That long span is doing a second job too — the canvas is `position: fixed`
     * and the sections are transparent, so anything visible during the lead is
     * visible over the tail of About, and a slow emergence out of the dark
     * reads as arrival where a short window would read as a pop.
     *
     * Floored at SPHERE_SKILLS_FADE_IN_END so an unusually early burst cannot
     * collapse the fade to nothing; on phones that floor IS the window, which
     * is the original 0 -> SPHERE_SKILLS_FADE_IN_END behaviour unchanged.
     */
    const fadeInEnd = Math.max(outerStart, rideStart + SPHERE_SKILLS_FADE_IN_END);
    const fadeIn = clamp01((p - rideStart) / (fadeInEnd - rideStart));
    const fadeOut = clamp01(
      (p - SPHERE_FADE_OUT_START) / (1 - SPHERE_FADE_OUT_START),
    );
    sphereState.globalOpacity = fadeIn * (1 - fadeOut);

    // Act 1: purple sheds from the end of the word "What" (desktop) / from the
    // fade-in (phones) and is gone as the swiper lands / as the line clears.
    sphereState.outerExplode = clamp01((p - outerStart) / (actBreak - outerStart));

    // Act 2: the dark core only starts breaking up once act 1 has finished.
    sphereState.innerExplode = clamp01(
      (p - actBreak) / (SPHERE_INNER_EXPLODE_END - actBreak),
    );

    if (isMobile) {
      // No ride: the sphere is simply centred behind the headline for the
      // whole section, so there is nothing to travel back from either.
      sphereState.groupX = SPHERE_CENTER_X;
    } else {
      /*
       * The ride IS the "W": the sphere's centre is put exactly where the first
       * character's centre is, so the two are one object crossing the screen
       * together rather than two things that merely start at the same moment.
       * An authored travel range cannot do this — the letter covers three-odd
       * screen widths while the sphere covers one, so any fixed range drifts
       * apart the instant it starts.
       *
       * Read off the track's LIVE x, never recomputed from `p`. The track runs
       * on `scrub: 1.2`, so where it is drawn trails raw scroll by about a
       * second; deriving the letter's position from progress instead would sit
       * the sphere a long way ahead of the letter it is supposed to be riding.
       * The render loop's own 0.08/frame lerp then adds ~0.2s on top, which is
       * small against that 1.2s and reads as weight, not lag.
       */
      const trackX = (gsap.getProperty(skillsTrack, "x") as number) || 0;
      const rideX = sphereWorldXAtScreenX(
        pinMetrics.firstCharCenter + trackX,
        vw,
        window.innerHeight,
      );
      /*
       * Parked at the left anchor once the "W" carries on past it: the letter
       * is free to leave the screen, the sphere is not — it has to be whole and
       * on frame for the burst. So it waits there through the rest of act 1,
       * and `traveled` is already sitting on the anchor when the centre sweep
       * takes over at `swiperOnScreen` — one writer, no contention, and
       * centerT === 1 lands exactly on SPHERE_CENTER_X.
       */
      const traveled = Math.max(-fit.travelX, rideX);
      const centerT = easeInOut(
        clamp01((p - swiperOnScreen) / SPHERE_CENTER_MOVE_SPAN),
      );
      sphereState.groupX = traveled + (SPHERE_CENTER_X - traveled) * centerT;
    }
  };

  ST.create({
    trigger: sectionEl,
    start: "top top",
    end: () => `+=${pinMetrics.totalPinPx}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    onRefresh: () => {
      pinMetrics = getSkillsPinMetrics();
    },
    onUpdate: (self: { progress: number }) => {
      if (!carouselStage || !iconTrack || !iconItems.length) return;
      const { carouselStartRatio } = pinMetrics;

      if (self.progress >= carouselStartRatio) {
        carouselStage.removeAttribute("aria-hidden");
        carouselStage.classList.add("is-active");
        const carouselT = gsap.utils.clamp(
          0,
          1,
          (self.progress - carouselStartRatio) / (1 - carouselStartRatio),
        );
        const introT = gsap.utils.clamp(0, 1, carouselT / SKILLS_CAROUSEL_INTRO);
        const streamT = gsap.utils.clamp(
          0,
          1,
          (carouselT - SKILLS_CAROUSEL_INTRO) / (1 - SKILLS_CAROUSEL_INTRO),
        );
        const tailFade = gsap.utils.clamp(0, 1, (carouselT - 0.9) / 0.1);
        gsap.set(carouselStage, {
          opacity: introT * (1 - tailFade),
          visibility: introT > 0.02 && tailFade < 1 ? "visible" : "hidden",
        });
        carouselProgress.value =
          pinMetrics.streamStart +
          streamT * (pinMetrics.progressMax - pinMetrics.streamStart);
        layoutSkillsStack(iconItems, nameRows, carouselProgress.value);
      } else {
        carouselStage.setAttribute("aria-hidden", "true");
        carouselStage.classList.remove("is-active");
        gsap.set(carouselStage, { opacity: 0, visibility: "hidden" });
        layoutSkillsStack(iconItems, nameRows, pinMetrics.streamStart - 0.5);
      }
    },
  });

  /*
   * The sphere's own clock, deliberately NOT the pin.
   *
   * On desktop the headline starts moving SKILLS_HEADLINE_LEAD_VH before the
   * pin engages, and by the time the pin exists roughly a third of the line's
   * journey is already spent. Driven by the pin, the sphere therefore popped in
   * at screen right against a headline that had visibly been travelling for a
   * while. This trigger opens exactly where the headline's own tween opens, so
   * the two leave together; `clockToPinProgress` restates its progress in pin
   * space (negative through the lead) so the choreography stays the single
   * stateless function it was.
   *
   * On phones the lead is 0, making this trigger's span identical to the pin's
   * — the mobile staging is untouched.
   *
   * Non-pinning, so it does not disturb Phase B's top-down pin registration.
   */
  const clockToPinProgress = (clock: number) => {
    const { sphereLeadPx, totalPinPx } = pinMetrics;
    return (clock * (sphereLeadPx + totalPinPx) - sphereLeadPx) / totalPinPx;
  };

  ST.create({
    trigger: sectionEl,
    start: () =>
      window.innerWidth <= MOBILE_MAX_WIDTH
        ? "top top"
        : `top ${getHeadlineLeadVh() * 100}%`,
    // Measured here rather than read off the cached pinMetrics: this trigger
    // starts before the pin and so may refresh before it, and its end has to be
    // right on the very first pass.
    end: () => {
      const metrics = getSkillsPinMetrics();
      return `+=${metrics.sphereLeadPx + metrics.totalPinPx}`;
    },
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    onToggle: (self: { isActive: boolean; progress: number; direction: number }) => {
      sphereState.inRange = self.isActive;
      // Force the endpoint on leave. `fastScrollEnd` means a hard flick past
      // the edge can skip the onUpdate at progress 1, which would strand
      // globalOpacity mid-fade — invisible now, but the render loop snaps to
      // these values on re-entry and would trust the stale ones.
      applySphereChoreography(
        clockToPinProgress(
          self.isActive ? self.progress : self.direction > 0 ? 1 : 0,
        ),
      );
    },
    onUpdate: (self: { progress: number }) => {
      applySphereChoreography(clockToPinProgress(self.progress));
    },
  });

  // Coherent state before the first scroll event, so the canvas can never
  // become visible for a frame holding values nobody has computed yet.
  applySphereChoreography(clockToPinProgress(0));

  const headlineTrackTween = gsap.to(skillsTrack, {
    x: () => -measureHeadlineScroll().exitTrackX,
    ease: "none",
    /*
     * The sphere rides this track's LIVE x, and `scrub: 1.2` means the track
     * keeps easing for about a second after the scroll itself has stopped —
     * a stretch in which ScrollTrigger has no reason to fire an update and the
     * sphere would sit frozen while the letter it is riding slid out from
     * under it. This fires on every tick the track actually moves, tail
     * included. Recomputing the whole choreography rather than just the ride
     * keeps one writer per property; it is a dozen arithmetic ops.
     */
    onUpdate: () => applySphereChoreography(sphereProgress),
    scrollTrigger: {
      trigger: sectionEl,
      // Deliberately earlier than the pin's "top top": the characters begin
      // drifting in while About is still on screen, so the section never
      // sits fully covering the viewport with nothing happening. A function
      // so the phone's shorter lead is re-read on every refresh.
      start: () => `top ${getHeadlineLeadVh() * 100}%`,
      end: () => `+=${getSkillsPinMetrics().headlinePx}`,
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  // Vertical counterpart to the horizontal track: the line enters high —
  // level with the section label — and sinks to its centred position as the
  // page scrolls. Separate from headlineTrackTween because it settles over
  // only part of the travel; sharing that tween would tie the descent to the
  // full horizontal exit. Safe alongside measureHeadlineScroll(), which only
  // ever touches x and reads .right.
  if (headline) {
    gsap.fromTo(
      headline,
      { y: () => -window.innerHeight * SKILLS_HEADLINE_RISE_VH },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: () => `top ${getHeadlineLeadVh() * 100}%`,
          end: () =>
            `+=${getSkillsPinMetrics().headlinePx * SKILLS_HEADLINE_RISE_SPAN}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  if (headline && headlineChars.length) {
    Array.from(headlineChars).forEach((char: Element, i: number) => {
      const from = SKILLS_HEADLINE_CHAR_FROM[i % SKILLS_HEADLINE_CHAR_FROM.length];
      gsap.fromTo(
        char,
        { x: from.x, y: from.y, immediateRender: true },
        {
          x: 0,
          y: 0,
          ease: from.ease,
          immediateRender: false,
          scrollTrigger: {
            trigger: char,
            containerAnimation: headlineTrackTween,
            start: "left 108%",
            end: "left 54%",
            horizontal: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  }

  if (iconTrack && iconItems.length) {
    const initMetrics = getSkillsCarouselMetrics(iconItems.length);
    layoutSkillsStack(iconItems, nameRows, initMetrics.streamStart - 0.5);
  }
}
