import { type RefObject, useEffect } from "react";
import { scrollToTop } from "../lib/scroll";
import {
  resetSphereState,
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

const PROJECTS_PATH_POV_SCALE = { from: 2.22, to: 2.42 };
const PROJECTS_CHAR_WRITE_LEAD = 0.045;
const PROJECTS_CHAR_WRITE_WINDOW = 0.028;
const PROJECTS_WRITE_SCROLL_VH = 2.1;
/**
 * Exit scroll — path camera slides left while section curtain rises simultaneously.
 * 0.7vh gives enough room for the curtain animation to feel smooth.
 */
const PROJECTS_EXIT_SCROLL_VH = 0.7;
/** Path focal point: starts left, drifts toward center as text writes. */
const PROJECTS_PATH_FOCUS = {
  startX: 0.24,
  endX: 0.5,
  startY: 0.6,
  endY: 1 / 1.5,
};
/**
 * Project panels swap diagonally, measured off the reference recording:
 * the incoming panel flies in from the top-right while the outgoing one leans
 * back and slides away to the bottom-left, each shrinking/growing as it goes.
 */
/*
 * The parked position must sit entirely outside the stage, so a panel that
 * hasn't had its turn yet is never a sliver peeking into the corner.
 * A panel is 100vw x 100vh, so at scale 0.5 its visual half-size is 25vw/25vh
 * and xPercent/yPercent shift its centre by that many vw/vh:
 *   visual left edge = 50 + xPercent - 25  ->  needs >= 100  ->  xPercent >= 75
 *   visual bottom edge = 50 + yPercent + 25 ->  needs <= 0   ->  yPercent <= -75
 * 85/-85 clears both axes with margin to spare.
 */
/*
 * Matched against the reference implementation (digital-culture.valmax.dev),
 * read straight off its live DOM rather than eyeballed from the recording.
 *
 * There, each full-viewport slide carries `translate(25%, ...) skew(10deg, 0)`
 * while parked and animates to identity when it becomes active; Swiper's
 * wrapper supplies a further +/-100% of horizontal travel. So the numbers here
 * fold the two together: 100 + 25 = 125 on the way in, -100 + 25 = -75 on the
 * way out.
 *
 * Notably the reference never scales and never fades — scale and opacity stay
 * at 1 the whole time. The lean is a flat skewX, not a 3D rotation.
 */
const PROJECTS_PANEL_SKEW = 10;
const PROJECTS_PANEL_IN = {
  xPercent: 125,
  yPercent: -100,
  skewX: PROJECTS_PANEL_SKEW,
  scale: 1,
  rotation: 0,
  opacity: 1,
};
const PROJECTS_PANEL_REST = {
  xPercent: 0,
  yPercent: 0,
  skewX: 0,
  scale: 1,
  rotation: 0,
  opacity: 1,
};
/*
 * -75 leaves a quarter of the panel showing at the lower left rather than
 * clearing the stage, exactly as the reference does; the arriving panel covers
 * the rest (every .project-panel is inset:0 with an opaque background and
 * zIndex index+1). All outgoing panels land on this identical transform, so
 * they stack perfectly and only the most recent one is ever visible.
 */
const PROJECTS_PANEL_OUT = {
  xPercent: -75,
  yPercent: 50,
  skewX: PROJECTS_PANEL_SKEW,
  scale: 1,
  rotation: 0,
  opacity: 1,
};
/*
 * While the panel itself never scales, its image does: the reference keeps
 * off-stage slides' media at scale(0.25) and grows it to 1 as the slide becomes
 * active. transform-origin is the media's bottom-left corner (CSS), so it
 * collapses into that corner rather than toward its own middle.
 */
const PROJECTS_MEDIA_PARKED_SCALE = 0.25;
/*
 * Timeline units each panel rests for once it has landed, before the next swap
 * starts. A swap is 1 unit, so 1 here means "hold as long as the transition
 * takes". This is what makes the section pause on every project instead of
 * sliding continuously from the first to the last.
 */
const PROJECTS_PANEL_DWELL = 1;
/** Scroll distance for one timeline unit — a swap, or one panel's rest. */
const PROJECTS_UNIT_VH = 0.7;
// Scroll distance per swap lives in CSS (.projects-stage-scroll, 90vh each).
const SVG_NS = "http://www.w3.org/2000/svg";

type ProjectsPathChar = {
  el: SVGTextElement;
  progress: number;
};

// Path "d" is in fixed user units, so its total length never changes with the
// viewport — cache it instead of recomputing (a layout-forcing call) every
// scroll frame.
const pathLengthCache = new WeakMap<SVGPathElement, number>();
function pointOnPath(path: SVGPathElement, progress: number) {
  let length = pathLengthCache.get(path);
  if (length === undefined) {
    length = path.getTotalLength();
    pathLengthCache.set(path, length);
  }
  const t = Math.max(0, Math.min(1, progress));
  return path.getPointAtLength(length * t);
}

function splitProjectsPathHeadline(
  textPath: SVGTextPathElement,
  charsGroup: SVGGElement,
  pathId: string,
): ProjectsPathChar[] {
  const headline = textPath.textContent ?? "";
  const numChars = textPath.getNumberOfChars();
  if (!headline || numChars === 0) return [];

  const textContent = textPath as SVGTextContentElement;
  const span = textContent.getSubStringLength(0, numChars) || 1;
  const chars: ProjectsPathChar[] = [];

  for (let i = 0; i < numChars; i += 1) {
    const raw = headline[i] ?? "";
    const glyph = raw === " " ? "\u00A0" : raw;
    const offset = textContent.getSubStringLength(0, i);

    const charText = document.createElementNS(SVG_NS, "text");
    charText.setAttribute("class", "projects-path-char");
    charText.setAttribute("fill", "#25212C");

    const charPath = document.createElementNS(SVG_NS, "textPath");
    charPath.setAttribute("href", pathId);
    charPath.setAttribute("startOffset", String(offset));
    charPath.textContent = glyph;
    charText.appendChild(charPath);
    charsGroup.appendChild(charText);

    chars.push({ el: charText, progress: offset / span });
  }

  return chars;
}

function initProjectsPathHeadline(root: HTMLElement, gsap: typeof window.gsap) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollWrap = root.querySelector(".projects-path-scroll") as HTMLElement | null;
  const stage = root.querySelector(".projects-path-stage") as HTMLElement | null;
  const camera = root.querySelector(".projects-path-camera") as HTMLElement | null;
  const path = root.querySelector(".projects-path-curve") as SVGPathElement | null;
  const textPath = root.querySelector(".projects-path-textpath") as SVGTextPathElement | null;
  const measureText = root.querySelector(".projects-path-text-measure") as SVGTextElement | null;
  const charsGroup = root.querySelector(".projects-path-chars") as SVGGElement | null;
  const pathLabel = root.querySelector(".projects-path-label") as HTMLElement | null;
  const afterPath = root.querySelector(".projects-after-path") as HTMLElement | null;

  if (!scrollWrap || !stage || !camera || !path || !textPath || !charsGroup) return;

  // afterPath stays in normal document flow (so sticky panels work correctly).
  // We translate it upward to overlap the pinned stage using a negative translateY.
  // Stage gets a high z-index initially; afterPath overtakes it as it rises.
  if (afterPath) {
    gsap.set(afterPath, {
      opacity: 1,
      pointerEvents: "none",
      zIndex: 2,
      y: "100vh",
    });
  }

  const pathChars = reducedMotion ? [] : splitProjectsPathHeadline(textPath, charsGroup, "#projects-headline-path");

  if (!reducedMotion && measureText && pathChars.length) {
    measureText.classList.add("is-split");
  }

  const numChars = textPath.getNumberOfChars();
  const textSpan =
    numChars > 0 ? (textPath as SVGTextContentElement).getSubStringLength(0, numChars) : 0;
  const pathLen = path.getTotalLength();
  const textPathRatio = pathLen > 0 && textSpan > 0 ? Math.min(1, textSpan / pathLen) : 0.72;

  const getWriteScrollPx = () => window.innerHeight * PROJECTS_WRITE_SCROLL_VH;
  const getExitScrollPx = () => window.innerHeight * PROJECTS_EXIT_SCROLL_VH;
  const getTotalPathScrollPx = () => getWriteScrollPx() + getExitScrollPx();

  // stage size only changes on resize/refresh — cache it so the per-frame
  // scrub handler doesn't force a layout read every frame.
  let cachedVw = stage.clientWidth;
  let cachedVh = stage.clientHeight;
  const refreshMetrics = () => {
    cachedVw = stage.clientWidth;
    cachedVh = stage.clientHeight;
  };
  const getMetrics = () => ({ vw: cachedVw, vh: cachedVh });

  const getPathFocus = (t: number) => {
    const { vw, vh } = getMetrics();
    return {
      x: gsap.utils.interpolate(vw * PROJECTS_PATH_FOCUS.startX, vw * PROJECTS_PATH_FOCUS.endX, t),
      y: gsap.utils.interpolate(vh * PROJECTS_PATH_FOCUS.startY, vh * PROJECTS_PATH_FOCUS.endY, t),
    };
  };

  // Pre-parse easing functions once instead of re-parsing on every scroll frame.
  const easePower2Out = gsap.parseEase("power2.out");
  const easePower2InOut = gsap.parseEase("power2.inOut");

  const updatePathChars = (progress: number) => {
    pathChars.forEach(({ el, progress: charProgress }) => {
      const t = gsap.utils.clamp(
        0,
        1,
        (progress - charProgress + PROJECTS_CHAR_WRITE_LEAD) / PROJECTS_CHAR_WRITE_WINDOW,
      );
      const eased = easePower2Out(t);
      gsap.set(el, { opacity: eased });
    });
  };

  const applyWriteScene = (writeT: number) => {
    const cameraProgress = writeT * textPathRatio;
    const pt = pointOnPath(path, cameraProgress);
    const scale = gsap.utils.interpolate(PROJECTS_PATH_POV_SCALE.from, PROJECTS_PATH_POV_SCALE.to, writeT);
    const focus = getPathFocus(writeT);

    gsap.set(camera, {
      x: focus.x - pt.x * scale,
      y: focus.y - pt.y * scale,
      scale,
      transformOrigin: "0 0",
      force3D: true,
    });

    if (pathLabel) gsap.set(pathLabel, { x: 0, y: 0 });
    updatePathChars(writeT);
  };

  const applyExitScene = (exitT: number) => {
    const { vw } = getMetrics();
    const pt = pointOnPath(path, textPathRatio);
    const scale = gsap.utils.interpolate(PROJECTS_PATH_POV_SCALE.from, PROJECTS_PATH_POV_SCALE.to, 1);
    const exitX = -exitT * vw * 1.35;
    const focus = getPathFocus(1);

    gsap.set(camera, {
      x: focus.x - pt.x * scale + exitX,
      y: focus.y - pt.y * scale,
      scale,
      transformOrigin: "0 0",
      force3D: true,
    });

    if (pathLabel) gsap.set(pathLabel, { x: exitX, y: 0 });
    updatePathChars(1);
  };

  const getPathWriteRatio = () => getWriteScrollPx() / getTotalPathScrollPx();

  // Track whether we've already triggered a ScrollTrigger.refresh() after
  // afterPath becomes visible, so we only do it once per scroll-through.
  let didRefreshAfterReveal = false;

  /**
   * Curtain timeline:
   *
   *   0 → curtainStart   write phase early  — y=100vh, fully hidden
   *   curtainStart → 1   write phase late + entire exit phase
   *                       — y: 100vh → 0, rises while "solved." still on screen
   *                          and continues as it slides left
   *
   * curtainStart = writeRatio * (1 - OVERLAP)
   * OVERLAP=0.35 means curtain begins at 65% of the write phase,
   * so there's plenty of "solved." still visible when it starts rising.
   */
  const CURTAIN_OVERLAP = 0.9; // fraction of write phase to start early
  const getCurtainStart = () => getPathWriteRatio() * (1 - CURTAIN_OVERLAP);

  const updateAfterPathGate = (progress: number) => {
    if (!afterPath) return;

    const curtainStart = getCurtainStart();

    // fully hidden
    if (progress <= curtainStart) {
      gsap.set(afterPath, { y: "100vh", pointerEvents: "none", zIndex: 2 });
      gsap.set(stage, { zIndex: 5 });
      didRefreshAfterReveal = false;
      return;
    }

    // curtainStart → 1  (covers both late write phase AND full exit phase)
    const curtainT = gsap.utils.clamp(0, 1, (progress - curtainStart) / (1 - curtainStart));
    const easedT = easePower2InOut(curtainT);
    const yVh = (1 - easedT) * 100;

    gsap.set(afterPath, {
      y: `${yVh}vh`,
      pointerEvents: curtainT > 0.08 ? "auto" : "none",
      zIndex: 6,
    });
    gsap.set(stage, { zIndex: 5 });

    if (!didRefreshAfterReveal && curtainT > 0.08) {
      didRefreshAfterReveal = true;
      window.ScrollTrigger?.refresh();
    }

    if (curtainT >= 0.98) {
      gsap.set(afterPath, { y: 0, pointerEvents: "auto", zIndex: 6 });
      gsap.set(stage, { zIndex: 1 });
    }
  };

  const updatePathScene = (progress: number) => {
    const writeRatio = getPathWriteRatio();

    if (progress <= writeRatio) {
      applyWriteScene(progress / writeRatio);
    } else {
      const exitT = (progress - writeRatio) / (1 - writeRatio);
      applyExitScene(exitT);
    }

    updateAfterPathGate(progress);
  };

  applyWriteScene(0);
  updateAfterPathGate(0);

  if (reducedMotion) {
    applyWriteScene(1);
    if (afterPath) {
      gsap.set(afterPath, { y: 0, pointerEvents: "auto", zIndex: 6 });
    }
    return;
  }

  window.ScrollTrigger.create({
    trigger: scrollWrap,
    start: "top top",
    end: () => `+=${getTotalPathScrollPx()}`,
    pin: stage,
    pinSpacing: true,
    scrub: 1,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onRefresh: refreshMetrics,
    onUpdate: (self: { progress: number }) => updatePathScene(self.progress),
    onLeave: () => gsap.set(stage, { zIndex: 1 }),
    onLeaveBack: (self: { progress: number }) => updatePathScene(self.progress),
    onEnterBack: (self: { progress: number }) => updatePathScene(self.progress),
  });

  requestAnimationFrame(() => window.ScrollTrigger?.refresh());
}

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

export type PortfolioGsapRefs = {
  progressRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  heroTextRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  skillsRef: RefObject<HTMLElement | null>;
  projectsRef: RefObject<HTMLElement | null>;
  experienceRef: RefObject<HTMLElement | null>;
  contactRef: RefObject<HTMLElement | null>;
};

export function usePortfolioGsap(
  loaded: boolean,
  refs: PortfolioGsapRefs,
  setActiveSection: (id: string) => void,
) {
  const {
    progressRef,
    navRef,
    heroRef,
    heroTextRef,
    aboutRef,
    skillsRef,
    projectsRef,
    experienceRef,
    contactRef,
  } = refs;

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    let heroCtx: { revert: () => void } | undefined;
    scrollToTop(true);

    const initId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        const gsap = window.gsap;

        // Phase A creates NO ScrollTriggers — only the immediate entrance tweens
        // — so nothing forces a ScrollTrigger.refresh() (full-page reflow) while
        // the preloader entrance is playing. All scroll-driven setup is Phase B.
        heroCtx = gsap.context(() => {
    gsap.from(navRef.current, { y: -60, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.4 });

    gsap.from(".nav-link", {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.7,
    });

    gsap.from(".nav-cta", {
      x: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 1.1,
    });

    const heroWords = heroTextRef.current?.querySelectorAll(".hero-word span");
    if (heroWords) {
      gsap.from(heroWords, {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.06,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });
    }
    resetSphereState();
        }); // end Phase A (heroCtx)
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(initId);
      if (window.gsap) window.gsap.killTweensOf(sphereState);
      resetSphereState();
      heroCtx?.revert();
    };
  }, [loaded]);

  // Scroll-driven setup: progress bar, hero exit, sphere choreography, and all
  // below-the-fold sections (skills pin, projects path, experience, contact).
  // Built up-front on `loaded` — model A: the whole page is wired before the
  // preloader plays its reveal, so the reveal runs on a ready page. Scroll stays
  // locked until `introDone` (released in Portfolio).
  useEffect(() => {
    if (!loaded) return;

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return;

    let cancelled = false;
    let sectionsCtx: { revert: () => void } | undefined;
    const rafs: number[] = [];

    rafs.push(
      requestAnimationFrame(() => {
        if (cancelled) return;
        sectionsCtx = gsap.context(() => {
    const toggleRv = "play none none reverse";
    const afterPrevSection = (prevEl: HTMLElement | null | undefined) => ({
      trigger: prevEl as HTMLElement | undefined,
      start: "bottom top" as const,
      toggleActions: toggleRv,
    });

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    // Hero stays pinned at the top as a backdrop while About slides up over it
    // (pinSpacing: false keeps page geometry identical, so no other trigger moves).
    // Pin ends the moment About's bottom reaches the viewport bottom: at that
    // instant About still covers the whole viewport (it's taller than 100vh), so
    // the hero unpins while fully hidden. Ending any later would let the pinned
    // hero show through the transparent sections that follow About.
    ST.create({
      trigger: heroRef.current,
      start: "top top",
      endTrigger: aboutRef.current,
      end: "bottom bottom",
      pin: true,
      pinSpacing: false,
    });

    // Parallax: the hero drifts up at exactly half the speed About covers it —
    // About travels one viewport height (bottom → top), the hero half of that.
    gsap.to(".hero-parallax", {
      y: () => -window.innerHeight * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    gsap.to(heroTextRef.current, {
      y: -200,
      opacity: 0,
      scale: 0.85,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "80% top",
        scrub: 1.5,
      },
    });

    // The sphere has no presence before the Skills pin — no slide, no fade-in.
    // Its entire lifecycle is driven from inside that pin by
    // `applySphereChoreography` below.

    // ===== About — mystic observatory =====
    const aboutEl = aboutRef.current;
    if (aboutEl) {
      gsap.from(".about-label", {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: aboutEl, start: "top 78%", toggleActions: toggleRv },
      });

      // Pure transform + opacity, no blur and no rotateX. Animated filters
      // force a full repaint of every character on every frame, which is what
      // made this reveal the most expensive moment in the section; the words
      // are already masked by .overflow-clip, so the slide alone reads fine.
      gsap.from(".about-headline-char", {
        y: 90,
        opacity: 0,
        stagger: 0.022,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: aboutEl, start: "top 72%", toggleActions: toggleRv },
      });

      gsap.from(".about-body", {
        y: 44,
        opacity: 0,
        stagger: 0.16,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: aboutEl, start: "top 62%", toggleActions: toggleRv },
      });

      gsap.from(".about-meta-row", {
        y: 24,
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: aboutEl, start: "top 52%", toggleActions: toggleRv },
      });

      gsap.from(".about-mantra", {
        opacity: 0,
        x: -30,
        clipPath: "inset(0 100% 0 0)",
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: aboutEl, start: "top 45%", toggleActions: toggleRv },
      });

      // RH mark: the preloader's draw-then-fill reveal, but scrubbed — the
      // strokes track scroll position, so the user draws the logo themselves.
      // Durations here are proportions of the scroll range, not seconds.
      //
      // The trigger is the logo's own box (not the section) and the range runs
      // from "logo reaches the middle of the screen" to "logo has crossed it",
      // so the mark starts at nothing and is drawn entirely on-screen. Nothing
      // is animated on .about-logo-wrap itself: transforming the trigger would
      // shift the very start/end points being measured.
      const aboutLogoPaths = aboutEl.querySelectorAll(".about-logo path");
      if (aboutLogoPaths.length) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".about-logo-wrap",
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
          })
          .fromTo(
            ".about-logo",
            { scale: 0.86, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
            0,
          )
          .fromTo(
            aboutLogoPaths,
            { drawSVG: "0%", fillOpacity: 0 },
            { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.06 },
            0,
          )
          // shards fill only once the outlines have essentially closed
          .to(aboutLogoPaths, { fillOpacity: 1, duration: 0.5, ease: "power1.out", stagger: 0.04 }, 1.5);
      }

      // gentle scroll-linked drift so the mark isn't dead-static in the column
      // (on the svg, not the wrap — see the trigger note above)
      gsap.to(".about-logo", {
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: aboutEl, start: "top bottom", end: "bottom top", scrub: 1.4 },
      });

    }

    const skillsTrack = skillsRef.current?.querySelector(".skills-track") as HTMLElement;
    if (skillsTrack && skillsRef.current) {
      const carouselStage = skillsRef.current.querySelector(".skills-carousel-stage") as HTMLElement | null;
      const iconTrack = skillsRef.current.querySelector(".skills-icon-track") as HTMLElement | null;
      const iconItems = skillsRef.current.querySelectorAll(".skills-icon-item");
      const nameRows = skillsRef.current.querySelectorAll(".skills-carousel-name-row");

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
        trigger: skillsRef.current,
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
          trigger: skillsRef.current,
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
              trigger: skillsRef.current,
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

    if (projectsRef.current) {
      initProjectsPathHeadline(projectsRef.current, gsap);

    }

    const projectPanels = projectsRef.current
      ? Array.from(projectsRef.current.querySelectorAll<HTMLElement>(".project-panel"))
      : [];

    const projectsStage = projectsRef.current
      ? projectsRef.current.querySelector<HTMLElement>(".projects-stage-scroll")
      : null;

    if (projectsStage && projectPanels.length > 1) {
      const panelsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (panelsReducedMotion) {
        // Plain stack, no travel: let each panel occupy its own screen.
        gsap.set(projectsStage, { height: "auto" });
        gsap.set(projectsStage.querySelector(".projects-sticky-list"), {
          position: "relative",
          height: "auto",
        });
        gsap.set(projectPanels, { position: "relative", inset: "auto", height: "100vh" });
      } else {
        // Panels swap diagonally: the incoming one flies in from the top-right
        // while the outgoing one leans back and slides away to the bottom-left.
        // Everything after panel 0 starts parked off-stage at the top-right,
        // with its image collapsed into its bottom-left corner.
        const mediaOf = (panel: HTMLElement) => panel.querySelector(".project-panel-media");
        gsap.set(projectPanels.slice(1), PROJECTS_PANEL_IN);
        gsap.set(projectPanels.slice(1).map(mediaOf), { scale: PROJECTS_MEDIA_PARKED_SCALE });

        // FIX: start/end are computed from offsetTop rather than left to
        // ScrollTrigger's rect-based resolution. The stage sits inside
        // .projects-after-path, which the curtain translates on Y (100vh -> 0),
        // so a rect-derived start is a moving target — it drifted between every
        // refresh. offsetTop is layout-based and ignores transforms, while
        // still honouring that element's margin-top:-100vh.
        const stageTop = () => {
          let el: HTMLElement | null = projectsStage;
          let top = 0;
          while (el) {
            top += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          return top;
        };
        const unitDistance = () => window.innerHeight * PROJECTS_UNIT_VH;

        /*
         * Pure scrub, no snap: the panels follow the wheel the whole way and
         * are free to rest at any point. Snapping was tried and removed — it
         * fought the user instead of helping.
         *
         * The timeline alternates rest and swap so the section stops on every
         * project: a leading dwell on panel 0, then each swap (1 unit) followed
         * by another dwell. During a dwell nothing is animating, so scrolling
         * through it holds the panel still until the next swap begins.
         */
        const swaps = projectPanels.length - 1;
        const step = 1 + PROJECTS_PANEL_DWELL;
        const swapAt = (i: number) => PROJECTS_PANEL_DWELL + i * step;
        const totalUnits = swapAt(swaps - 1) + 1 + PROJECTS_PANEL_DWELL;

        // Unitless custom property: CSS multiplies it by vh, so the stage keeps
        // the right height across resizes without JS writing px back into the
        // element ScrollTrigger measures.
        projectsStage.style.setProperty("--scroll-units", String(totalUnits));

        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: projectsStage,
            start: stageTop,
            end: () => stageTop() + totalUnits * unitDistance(),
            scrub: 1,
            invalidateOnRefresh: true,
            // FIX: lower refresh priority so path ScrollTrigger pins are
            // fully resolved before panel positions are calculated.
            refreshPriority: -1,
          },
        });
        // Anchor the timeline's full length so the trailing dwell isn't dropped
        // — a timeline otherwise ends at its last tween, and scrub maps the
        // scroll range onto that shorter duration.
        tl.set({}, {}, totalUnits);

        projectPanels.forEach((panel, index) => {
          if (index === 0) return;
          const at = swapAt(index - 1);
          const prev = projectPanels[index - 1];

          // Incoming: from off-stage top-right back to identity, its image
          // growing out of the bottom-left corner as it arrives.
          tl.fromTo(panel, PROJECTS_PANEL_IN, { ...PROJECTS_PANEL_REST }, at);
          tl.fromTo(
            mediaOf(panel),
            { scale: PROJECTS_MEDIA_PARKED_SCALE },
            { scale: 1 },
            at,
          );

          // Outgoing: skews away to the lower left, its image folding back into
          // its bottom-left corner. No fade and no dim — every panel keeps full
          // opacity and full brightness for its whole trip.
          tl.to(prev, { ...PROJECTS_PANEL_OUT }, at);
          tl.to(mediaOf(prev), { scale: PROJECTS_MEDIA_PARKED_SCALE }, at);
        });

      }
    }

    gsap.from(".exp-line-fill", {
      scaleY: 0,
      transformOrigin: "top center",
      scrollTrigger: { trigger: experienceRef.current, start: "top bottom", end: "bottom 50%", scrub: 1 },
    });

    experienceRef.current?.querySelectorAll(".exp-item").forEach((item, i) => {
      gsap.from(item, {
        x: i % 2 === 0 ? -80 : 80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 88%", toggleActions: toggleRv },
      });
    });

    gsap.from(".exp-dot", {
      scale: 0,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: experienceRef.current,
        start: "top 70%",
        toggleActions: toggleRv,
      },
    });

    gsap.from(".contact-headline span", {
      y: 120,
      opacity: 0,
      rotateX: -80,
      stagger: 0.1,
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from(".contact-field", {
      y: 40,
      opacity: 0,
      clipPath: "inset(0 0 100% 0)",
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from(".contact-social", {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: afterPrevSection(experienceRef.current),
    });

    gsap.from(".contact-info-row", {
      x: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from("footer", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "footer",
        start: "top 95%",
        toggleActions: toggleRv,
      },
    });

    [aboutRef.current, experienceRef.current, contactRef.current].forEach((sec) => {
      if (!sec) return;
      gsap.to(sec.querySelector(".section-bg") as HTMLElement, {
        y: 80,
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
    });

    [
      { id: "hero", el: heroRef.current },
      { id: "about", el: aboutRef.current },
      { id: "skills", el: skillsRef.current },
      { id: "projects", el: projectsRef.current },
      { id: "experience", el: experienceRef.current },
      { id: "contact", el: contactRef.current },
    ].forEach(({ id, el }) => {
      ST.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

        }); // end scroll-setup context

        // Refresh once all section triggers exist.
        rafs.push(
          requestAnimationFrame(() => {
            if (cancelled) return;
            ST.refresh();
          }),
        );
      })
    );

    return () => {
      cancelled = true;
      rafs.forEach((id) => cancelAnimationFrame(id));
      if (window.gsap) window.gsap.killTweensOf(sphereState);
      sectionsCtx?.revert();
    };
  }, [loaded, setActiveSection]);
}