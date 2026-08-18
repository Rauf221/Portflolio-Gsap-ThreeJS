import {
  sphereState,
  SPHERE_ACT_BREAK_BIAS,
  SPHERE_CENTER_X,
  SPHERE_CENTER_MOVE_SPAN,
  SPHERE_EXPLODE_EARLY,
  SPHERE_FADE_OUT_START,
  SPHERE_INNER_EXPLODE_END,
  SPHERE_OUTER_EXPLODE_START,
  SPHERE_SKILLS_FADE_IN_END,
  SPHERE_SKILLS_LEFT_X,
  SPHERE_SKILLS_START_X,
} from "../lib/sphereState";

/* ── Skills: pinned headline fly-in + vertical carousel + sphere ────────────
 * One pin owns three things that must share a clock: the 14-character headline
 * that flies in and exits left, the icon/name carousel that streams through
 * after it, and the 3D sphere whose whole lifecycle (fade in, ride left,
 * centre sweep, burst, fade out) is a pure function of this pin's progress. */

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
 * How far above its centred resting place the headline's baseline starts, in
 * viewport heights. The stage centres the headline (align-items: center), so at
 * 0.4 the first character enters near the top of the section and the whole line
 * then descends into centre as you scroll. Raise it to enter higher, lower it to
 * enter closer to centre.
 */
const SKILLS_HEADLINE_RISE_VH = 0.4;
/** Fraction of the headline's scroll over which that descent completes. */
const SKILLS_HEADLINE_RISE_SPAN = 0.2;

function getSkillsCarouselMetrics(itemCount: number) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const cardSize = Math.min(Math.max(vw * 0.14, 154), 218);
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
    const focusOpacity = gsap.utils.clamp(0, 1, 1.15 - dist * 0.55);
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

  const measureHeadlineScroll = () => {
    if (!headline) {
      return { exitTrackX: window.innerWidth * 0.65 };
    }

    const savedTrackX = gsap.getProperty(skillsTrack, "x") as number;

    gsap.set(skillsTrack, { x: 0 });
    gsap.set(headline, { x: 0 });

    const exitTrackX = headline.getBoundingClientRect().right + 80;

    gsap.set(skillsTrack, { x: savedTrackX });

    return { exitTrackX };
  };

  const getSkillsPinMetrics = () => {
    const { exitTrackX } = measureHeadlineScroll();
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
    const headlineLeadPx = window.innerHeight * SKILLS_HEADLINE_LEAD_VH;
    const headlineOnPinPx = Math.max(
      headlinePx - headlineLeadPx,
      window.innerHeight * 0.2,
    );
    const bufferPx = window.innerHeight * SKILLS_HEADLINE_BUFFER_VH;
    const carouselMetrics = getSkillsCarouselMetrics(iconItems.length);
    const carouselStartPx = headlineOnPinPx * SKILLS_CAROUSEL_HEADLINE_START;
    const totalPinPx = headlineOnPinPx + bufferPx + carouselMetrics.carouselPx;
    return {
      exitTrackX,
      headlinePx,
      headlineOnPinPx,
      bufferPx,
      carouselStartPx,
      totalPinPx,
      carouselStartRatio: carouselStartPx / totalPinPx,
      ...carouselMetrics,
    };
  };

  const headlineScroll = measureHeadlineScroll();
  let pinMetrics = getSkillsPinMetrics();
  const carouselProgress = { value: 0 };

  /*
   * The sphere's whole life, as a pure function of the pin's progress:
   *
   *   right ──(rides the headline)──> left ──(headline exits)──> centre, burst
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
  const applySphereChoreography = (p: number) => {
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

    const fadeIn = clamp01(p / SPHERE_SKILLS_FADE_IN_END);
    const fadeOut = clamp01(
      (p - SPHERE_FADE_OUT_START) / (1 - SPHERE_FADE_OUT_START),
    );
    sphereState.globalOpacity = fadeIn * (1 - fadeOut);

    // Act 1: purple sheds over the ride and is gone as the swiper lands.
    sphereState.outerExplode = clamp01(
      (p - SPHERE_OUTER_EXPLODE_START) /
        (swiperOnScreen - SPHERE_OUTER_EXPLODE_START),
    );

    // Act 2: the dark core only starts breaking up once the swiper is in.
    sphereState.innerExplode = clamp01(
      (p - swiperOnScreen) / (SPHERE_INNER_EXPLODE_END - swiperOnScreen),
    );

    // Linear across the ride so it tracks the headline (which also uses
    // ease "none"), then eased on the way back to centre. The two windows
    // meet at `swiperOnScreen` rather than overlapping, so travelT is
    // already pinned at 1 before centerT leaves 0 — no contention, and
    // centerT === 1 lands exactly on SPHERE_CENTER_X.
    const travelT = clamp01(p / swiperOnScreen);
    const traveled =
      SPHERE_SKILLS_START_X + (SPHERE_SKILLS_LEFT_X - SPHERE_SKILLS_START_X) * travelT;
    const centerT = easeInOut(
      clamp01((p - swiperOnScreen) / SPHERE_CENTER_MOVE_SPAN),
    );
    sphereState.groupX = traveled + (SPHERE_CENTER_X - traveled) * centerT;
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
      Object.assign(headlineScroll, measureHeadlineScroll());
      pinMetrics = getSkillsPinMetrics();
    },
    onToggle: (self: { isActive: boolean; progress: number; direction: number }) => {
      sphereState.inRange = self.isActive;
      // Force the endpoint on leave. `fastScrollEnd` means a hard flick past
      // the pin's edge can skip the onUpdate at progress 1, which would
      // strand globalOpacity mid-fade — invisible now, but the render loop
      // snaps to these values on re-entry and would trust the stale ones.
      applySphereChoreography(
        self.isActive ? self.progress : self.direction > 0 ? 1 : 0,
      );
    },
    onUpdate: (self: { progress: number }) => {
      // Ahead of the carousel guard below: a missing carousel node must not
      // strand the sphere mid-explosion.
      applySphereChoreography(self.progress);

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

  // Coherent state before the first scroll event, so the canvas can never
  // become visible for a frame holding values nobody has computed yet.
  applySphereChoreography(0);

  const headlineTrackTween = gsap.to(skillsTrack, {
    x: () => -measureHeadlineScroll().exitTrackX,
    ease: "none",
    scrollTrigger: {
      trigger: sectionEl,
      // Deliberately earlier than the pin's "top top": the characters begin
      // drifting in while About is still on screen, so the section never
      // sits fully covering the viewport with nothing happening.
      start: `top ${SKILLS_HEADLINE_LEAD_VH * 100}%`,
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
          start: `top ${SKILLS_HEADLINE_LEAD_VH * 100}%`,
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
