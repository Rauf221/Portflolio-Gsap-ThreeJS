/* ── Projects: the written-on-a-curve headline ──────────────────────────────
 * The sentence is written along an SVG path as the user scrolls; a "camera"
 * (CSS transform on a wrapper) pans and zooms so the character currently being
 * written stays parked on the stage's focal point. Extracted verbatim from
 * usePortfolioGsap — this module owns the path constants, the per-character
 * split, and the pinned ScrollTrigger that drives the whole scene. */

/**
 * Camera zoom across the write phase — how close the camera sits to the curve.
 * This is the knob for glyph size on screen: the whole SVG is scaled by it, so
 * lowering it shrinks the letters without touching the text/path relationship
 * (font-size would change how much of the sentence fits on the curve, and with
 * it how far the camera travels).
 *
 * Raising it is free of retuning: PROJECTS_PATH_FOCUS is in stage fractions and
 * stagePointOnPath maps the curve out of viewBox units, so the letter being
 * written stays parked on the same focal point at any zoom. What does change is
 * pace — at a closer zoom the same stretch of curve covers more screen, so the
 * camera pans faster and fewer words are legible at once. Push it much past ~2.6
 * and the waves start throwing the line off the top and bottom of the stage.
 */
const PROJECTS_PATH_POV_SCALE = { from: 2.24, to: 2.45 };
/**
 * Width the zoom above was authored against. The glyphs are sized in the SVG's
 * own units and then scaled by the camera, so at a fixed zoom they keep their
 * PIXEL size while the screen shrinks — on a phone a single letter would be
 * most of the frame. Scaling the zoom by stageWidth / this keeps the letters
 * at a constant FRACTION of the frame instead. Capped at 1: a screen wider
 * than the reference keeps the authored zoom rather than magnifying past it.
 */
const PROJECTS_PATH_REFERENCE_WIDTH = 1440;
const PROJECTS_CHAR_WRITE_LEAD = 0.045;
const PROJECTS_CHAR_WRITE_WINDOW = 0.028;
/**
 * Scroll distance the write phase is stretched over, in viewport heights. This
 * is what sets how *fast* the section reads: progress is scrolled-px / this, so
 * raising it makes a given flick of the wheel advance the writing less. Deliberately
 * long — the section is meant to resist fast scrolling and be read, not skimmed.
 */
const PROJECTS_WRITE_SCROLL_VH = 5.2;
/**
 * Exit scroll — path camera slides left while section curtain rises simultaneously.
 * 0.7vh gives enough room for the curtain animation to feel smooth.
 */
const PROJECTS_EXIT_SCROLL_VH = 0.7;
/**
 * Path focal point, as a fraction of the stage. The camera parks the character
 * currently being written at this point, so it is also where letters resolve
 * into view.
 *
 * Locked to dead centre. start and end being equal is the whole point: any gap
 * between them is a drift of the focal point ACROSS the stage that rides on top
 * of the camera's travel along the curve, and that drift is what reads as the
 * camera losing the path — the writing tip slides out of the middle and the
 * curve leans off-frame. Equal values mean the camera tracks the curve and only
 * the curve, so the point being written never leaves the centre of frame.
 *
 * These are literal, since stagePointOnPath maps the curve out of viewBox units:
 * 0.5 really is the middle of the stage. Give start/end different values only if
 * you deliberately want that sliding-off-centre feel back.
 */
const PROJECTS_PATH_FOCUS = {
  startX: 0.5,
  endX: 0.5,
  startY: 0.5,
  endY: 0.5,
};
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

export function initProjectsPathHeadline(root: HTMLElement, gsap: typeof window.gsap) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollWrap = root.querySelector(".projects-path-scroll") as HTMLElement | null;
  const stage = root.querySelector(".projects-path-stage") as HTMLElement | null;
  const camera = root.querySelector(".projects-path-camera") as HTMLElement | null;
  const path = root.querySelector(".projects-path-curve") as SVGPathElement | null;
  const textPath = root.querySelector(".projects-path-textpath") as SVGTextPathElement | null;
  const measureText = root.querySelector(".projects-path-text-measure") as SVGTextElement | null;
  const charsGroup = root.querySelector(".projects-path-chars") as SVGGElement | null;
  const afterPath = root.querySelector(".projects-after-path") as HTMLElement | null;

  if (!scrollWrap || !stage || !camera || !path || !textPath || !charsGroup) return;

  // The glyph <text> nodes below are created by hand, so gsap.context.revert()
  // does not remove them — on a re-run (React dev double-mount, hot reload) a
  // second full set would stack on top of the first. Clear before splitting.
  while (charsGroup.firstChild) charsGroup.removeChild(charsGroup.firstChild);

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
  /*
   * viewBox → CSS-pixel mapping inside the SVG.
   *
   * The SVG's CSS box (.projects-path-svg, globalCssString) does not match its
   * viewBox (ProjectsSection) in either size or aspect ratio, so
   * preserveAspectRatio fits the viewBox with a uniform scale plus a centring
   * offset. getPointAtLength answers in viewBox user units, but the camera
   * translates CSS pixels — feed it raw user units and the focal point lands
   * where that offset happens to cancel and nowhere else: the character being
   * written slides sideways off the focus as the camera travels, and bobs up
   * and down with every wave in the curve.
   *
   * Reading the matrix instead of hardcoding it is what lets the viewBox, the
   * CSS width/height and the curve all be retuned without the tracking silently
   * drifting out again.
   *
   * getCTM() on the path is exactly this matrix (it stops at the nearest <svg>
   * viewport, so the camera's own CSS transform is not folded in). It is a
   * layout read, so cache it next to the stage size.
   */
  let viewScaleX = 1;
  let viewScaleY = 1;
  let viewOffsetX = 0;
  let viewOffsetY = 0;
  const refreshMetrics = () => {
    cachedVw = stage.clientWidth;
    cachedVh = stage.clientHeight;
    const ctm = path.getCTM();
    if (ctm) {
      viewScaleX = ctm.a;
      viewScaleY = ctm.d;
      viewOffsetX = ctm.e;
      viewOffsetY = ctm.f;
    }
  };
  refreshMetrics();
  const getMetrics = () => ({ vw: cachedVw, vh: cachedVh });

  /** A point on the curve, in the camera's own CSS-pixel space. */
  const stagePointOnPath = (progress: number) => {
    const pt = pointOnPath(path, progress);
    return {
      x: viewOffsetX + viewScaleX * pt.x,
      y: viewOffsetY + viewScaleY * pt.y,
    };
  };

  /** Camera zoom at write-progress t, refitted to the current stage width. */
  const getPovScale = (t: number) => {
    const { vw } = getMetrics();
    const fit = Math.min(1, vw / PROJECTS_PATH_REFERENCE_WIDTH);
    return (
      gsap.utils.interpolate(PROJECTS_PATH_POV_SCALE.from, PROJECTS_PATH_POV_SCALE.to, t) *
      fit
    );
  };

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
    const pt = stagePointOnPath(cameraProgress);
    const scale = getPovScale(writeT);
    const focus = getPathFocus(writeT);

    gsap.set(camera, {
      x: focus.x - pt.x * scale,
      y: focus.y - pt.y * scale,
      scale,
      transformOrigin: "0 0",
      force3D: true,
    });

    updatePathChars(writeT);
  };

  const applyExitScene = (exitT: number) => {
    const { vw } = getMetrics();
    const pt = stagePointOnPath(textPathRatio);
    const scale = getPovScale(1);
    const exitX = -exitT * vw * 1.35;
    const focus = getPathFocus(1);

    gsap.set(camera, {
      x: focus.x - pt.x * scale + exitX,
      y: focus.y - pt.y * scale,
      scale,
      transformOrigin: "0 0",
      force3D: true,
    });

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
    // Heavier than the site's usual scrub: 1. The long write distance already
    // makes each wheel tick advance little; this adds the catch-up lag on top,
    // so a hard flick glides to a stop instead of snapping ahead.
    scrub: 1.7,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onRefresh: refreshMetrics,
    onUpdate: (self: { progress: number }) => updatePathScene(self.progress),
    onLeave: () => gsap.set(stage, { zIndex: 1 }),
    onLeaveBack: (self: { progress: number }) => updatePathScene(self.progress),
    onEnterBack: (self: { progress: number }) => updatePathScene(self.progress),
  });

  // Handed back to the hook's cleanup: without it a fast unmount (dev double
  // mount, quick navigation) lets this fire a full refresh against a page whose
  // triggers were just reverted.
  const refreshId = requestAnimationFrame(() => window.ScrollTrigger?.refresh());
  return () => cancelAnimationFrame(refreshId);
}
