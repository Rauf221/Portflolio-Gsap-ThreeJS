/* ── Projects: the diagonal panel swaps ─────────────────────────────────────
 * Full-viewport project cards swap under a CSS-sticky stage: the incoming
 * panel flies in from the top-right while the outgoing one leans back and
 * slides away to the bottom-left. This module owns the swap timeline, the
 * per-panel info reveals, and the video play/pause discipline. */

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
 * starts. A swap is 1 unit, so 1 here would mean "hold as long as the transition
 * takes". This is what makes the section pause on every project instead of
 * sliding continuously from the first to the last.
 *
 * It is dead scroll by design — nothing animates during a dwell — so it is the
 * knob that decides how long a landed card sits there ignoring the wheel. At 1
 * that was 0.7vh of unresponsive scrolling per card (DWELL x PROJECTS_UNIT_VH),
 * long enough to read as the page having stopped responding. 0.5 still gives
 * each project a beat to be looked at without that stall.
 */
const PROJECTS_PANEL_DWELL = 0.5;
/** Scroll distance for one timeline unit — a swap, or one panel's rest. */
const PROJECTS_UNIT_VH = 0.7;
/*
 * The info column's reveal, in timeline units — a swap is 1, so these are
 * fractions of a single transition.
 *
 * LEAD is the overlap: at 0.3 the text starts moving 30% into the panel's
 * arrival, while the card is still travelling. Push it to 1 and the reveal only
 * begins once the card has landed, which reads as two separate events.
 * DURATION + the full stagger must stay under (1 - LEAD) + the dwell, or the
 * last row is still fading in when the next swap takes the panel away.
 */
const PROJECTS_INFO_LEAD = 0.3;
const PROJECTS_INFO_DURATION = 0.5;
const PROJECTS_INFO_STAGGER = 0.055;
/** Half of one arrival wipe across a tag row — in, then out. */
const PROJECTS_SWEEP_DURATION = 0.22;
/**
 * Pixels the info column trails behind its own panel during a swap, on top of
 * the panel's travel. Depth cue only — keep it well under the panel's own
 * distance or the card visibly comes apart mid-flight.
 */
const PROJECTS_INFO_PARALLAX = 90;
// Scroll distance per swap lives in CSS (.projects-stage-scroll, 90vh each).

export function initProjectsPanels(root: HTMLElement, gsap: typeof window.gsap) {
  const projectPanels = Array.from(root.querySelectorAll<HTMLElement>(".project-panel"));
  const projectsStage = root.querySelector<HTMLElement>(".projects-stage-scroll");

  if (!projectsStage || projectPanels.length <= 1) return;

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
    const frameOf = (panel: HTMLElement) => panel.querySelector(".project-panel-media-frame");
    const infoOf = (panel: HTMLElement) => panel.querySelector(".project-panel-info");
    gsap.set(projectPanels.slice(1), PROJECTS_PANEL_IN);
    gsap.set(projectPanels.slice(1).map(mediaOf), { scale: PROJECTS_MEDIA_PARKED_SCALE });
    // Reciprocal of the line above — the window starts collapsed, the footage
    // inside it starts at true size. See the unfold in the swap loop.
    gsap.set(projectPanels.slice(1).map(frameOf), { scale: 1 / PROJECTS_MEDIA_PARKED_SCALE });

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

    /*
     * Panel clips play only while their panel is on screen. The markup
     * deliberately omits autoPlay (see ProjectsSection): every panel is in
     * the DOM the whole time, stacked, so autoPlay would leave all of them
     * decoding 1080p at once behind the Three.js scene and the scrubbed
     * triggers.
     *
     * Two are allowed to run: the active panel and the one before it, which
     * is still visible in the lower-left corner mid-swap (PROJECTS_PANEL_OUT
     * parks it at -75% rather than fully off-stage). Pausing that one early
     * would freeze a frame in plain sight.
     *
     * play() rejects when the browser blocks autoplay or the swap moves on
     * before the clip is ready — both are recoverable on the next update, so
     * the rejection is swallowed rather than logged every frame.
     */
    const videoOf = (panel: HTMLElement) =>
      panel.querySelector("video") as HTMLVideoElement | null;

    const syncPanelVideos = (time: number) => {
      let active = 0;
      for (let i = 1; i < projectPanels.length; i += 1) {
        if (time >= swapAt(i - 1)) active = i;
      }
      projectPanels.forEach((panel, i) => {
        const video = videoOf(panel);
        if (!video) return;
        if (i === active || i === active - 1) {
          if (video.paused) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    const pauseAllPanelVideos = () => {
      projectPanels.forEach((panel) => {
        const video = videoOf(panel);
        if (video && !video.paused) video.pause();
      });
    };

    /*
     * One panel playing, the rest stopped — for the two stretches that sit
     * OUTSIDE the swap range but still have a panel on screen.
     *
     * The sticky list is 100vh tall inside a much taller scroller, so it is
     * visible for a full viewport height before the first swap can start and
     * for another full viewport height after the last one has finished. The
     * swap trigger knows nothing about those two tails: its range covers only
     * the travel between panels. Pausing on its onLeave is what stopped the
     * final clip dead while its card was still on screen, sliding away.
     */
    const soloPanelVideo = (target: number) => {
      projectPanels.forEach((panel, i) => {
        const video = videoOf(panel);
        if (!video) return;
        if (i === target) {
          if (video.paused) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    };
    const lastPanelIndex = projectPanels.length - 1;

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
        onUpdate: (self: { progress: number }) =>
          syncPanelVideos(self.progress * totalUnits),
        // Past either end of the swap range a panel is still stuck to the
        // viewport, so hand it over rather than stopping: the last one below,
        // the first one above. The visibility trigger further down is what
        // finally stops them.
        onLeave: () => soloPanelVideo(lastPanelIndex),
        onLeaveBack: () => soloPanelVideo(0),
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

      /*
       * The unfold. The media box above is a window with overflow: hidden,
       * and this counter-scales the footage inside it by exactly the
       * reciprocal — 1/0.25 = 4 — about the same bottom-left origin. The two
       * cancel, so the video renders at its true final size the whole way
       * while the window opens over it.
       *
       * That is the entire difference between a clip being REVEALED and a
       * clip being ZOOMED. Scaling the box alone shrinks the picture to a
       * thumbnail and inflates it, which reads as cheap; this holds the
       * picture still and moves only the frame, so the panel feels like it is
       * uncovering footage that was already playing. Keep the two scales
       * reciprocal if PROJECTS_MEDIA_PARKED_SCALE ever changes.
       */
      tl.fromTo(
        frameOf(panel),
        { scale: 1 / PROJECTS_MEDIA_PARKED_SCALE },
        { scale: 1 },
        at,
      );

      /*
       * Internal parallax: the info column trails the card it is riding on,
       * then catches up. The panel travels xPercent 125 -> 0; this adds a
       * smaller, slower offset on top, so the two sides of the card do not
       * move as one rigid sheet. It is a small number on purpose — big enough
       * to register as depth, small enough that it never reads as the layout
       * being broken mid-transition.
       */
      tl.fromTo(
        infoOf(panel),
        { x: PROJECTS_INFO_PARALLAX },
        { x: 0, duration: 1.15, ease: "power2.out" },
        at,
      );

      /*
       * The info column writes itself as the panel lands, held back by
       * PROJECTS_INFO_LEAD so the words start moving while the card is still
       * arriving rather than after it has stopped — the two overlap instead
       * of queueing.
       *
       * fromTo (not from) is what makes this survive scrubbing: it pins both
       * ends of the tween, so scrolling back up rewinds the reveal exactly
       * instead of leaving the text stuck at whatever GSAP last recorded.
       * immediateRender is on by default for fromTo, which also gives every
       * panel below the first its hidden start state for free — no separate
       * gsap.set pass to keep in sync.
       */
      /*
       * The words arrive carrying the card's own lean — skewX starts at
       * PROJECTS_PANEL_SKEW, the exact angle the panel is skewed by while it
       * travels, and unwinds to 0 as the panel does. So the type reads as
       * something physically attached to the card, settling out of the same
       * motion, rather than a separate text animation that happens to fire
       * nearby. If the panel skew is ever retuned, this follows it for free.
       */
      tl.fromTo(
        panel.querySelectorAll(".pp-word"),
        { yPercent: 120, skewX: PROJECTS_PANEL_SKEW },
        {
          yPercent: 0,
          skewX: 0,
          duration: PROJECTS_INFO_DURATION,
          ease: "power3.out",
          stagger: PROJECTS_INFO_STAGGER * 1.6,
        },
        at + PROJECTS_INFO_LEAD,
      );
      tl.fromTo(
        panel.querySelectorAll(".pp-rise"),
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: PROJECTS_INFO_DURATION,
          ease: "power3.out",
          stagger: PROJECTS_INFO_STAGGER,
        },
        at + PROJECTS_INFO_LEAD + 0.06,
      );
      // The rule draws rather than fades, so it overrides the .pp-rise
      // opacity tween it also matches — same position, so they render as one.
      tl.fromTo(
        panel.querySelector(".project-panel-rule"),
        { scaleX: 0 },
        { scaleX: 1, duration: PROJECTS_INFO_DURATION * 1.4, ease: "power3.out" },
        at + PROJECTS_INFO_LEAD + 0.12,
      );

      /*
       * The index counts up to its own number instead of just appearing.
       * Because the whole timeline is scrubbed, the digits are driven by the
       * wheel — roll the scroll back and the counter runs backwards. snap
       * quantises the proxy so only whole numbers are ever written out.
       *
       * The tween targets a plain object rather than the element: there is no
       * text-content interpolation here, just a number GSAP owns and an
       * onUpdate that stamps it into the DOM.
       */
      /*
       * Each tag row is wiped through by a bright band as it lands: in from
       * the left, then out to the right. Flipping transformOrigin between the
       * two halves is what turns a grow-and-shrink into a band that travels —
       * at the moment of the flip the band is at full width, so moving the
       * origin is invisible, and the collapse then reads as the tail leaving
       * the other side.
       */
      const sweeps = panel.querySelectorAll(".project-panel-row-sweep");
      tl.fromTo(
        sweeps,
        { scaleX: 0, transformOrigin: "0% 50%" },
        {
          scaleX: 1,
          duration: PROJECTS_SWEEP_DURATION,
          ease: "power2.out",
          stagger: PROJECTS_INFO_STAGGER,
        },
        at + PROJECTS_INFO_LEAD + 0.1,
      );
      tl.to(
        sweeps,
        {
          scaleX: 0,
          transformOrigin: "100% 50%",
          duration: PROJECTS_SWEEP_DURATION,
          ease: "power2.in",
          stagger: PROJECTS_INFO_STAGGER,
        },
        at + PROJECTS_INFO_LEAD + 0.1 + PROJECTS_SWEEP_DURATION,
      );

      // Outgoing: skews away to the lower left, its image folding back into
      // its bottom-left corner. No fade and no dim — every panel keeps full
      // opacity and full brightness for its whole trip.
      tl.to(prev, { ...PROJECTS_PANEL_OUT }, at);
      tl.to(mediaOf(prev), { scale: PROJECTS_MEDIA_PARKED_SCALE }, at);
      // Reciprocal on the way out too, so the footage stays true-size as the
      // window closes over it — the unfold played backwards, not a zoom out.
      tl.to(frameOf(prev), { scale: 1 / PROJECTS_MEDIA_PARKED_SCALE }, at);
      // The info column leaves ahead of its own card, which is what stops the
      // outgoing panel from reading as a flat sheet sliding off.
      tl.to(infoOf(prev), { x: -PROJECTS_INFO_PARALLAX * 0.8, ease: "power2.in" }, at);
    });

    /*
     * Visibility, not choreography. This one spans the stage's whole height
     * and does nothing but decide when a clip is genuinely off screen, which
     * is the only honest point to stop decoding.
     *
     * Its bounds are computed from stageTop/offsetHeight rather than left to
     * rect resolution, for the reason spelled out on the swap trigger above:
     * the stage lives inside .projects-after-path, whose curtain translates
     * it on Y, so a rect-derived bound is a moving target between refreshes.
     *
     *   start = stage top reaching the bottom of the viewport (first panel
     *           becomes visible, a full viewport before the first swap)
     *   end   = stage bottom reaching the top of the viewport, which is
     *           exactly when the sticky list has finished scrolling away and
     *           the last panel is genuinely gone
     *
     * The gap between the swap trigger's end and this one is the tail the
     * last panel plays through.
     */
    window.ScrollTrigger.create({
      trigger: projectsStage,
      start: () => stageTop() - window.innerHeight,
      end: () => stageTop() + projectsStage.offsetHeight,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      // Entering from above: the first panel is on screen but no swap has
      // begun. Entering from below: the last one is back, still sliding.
      onEnter: () => soloPanelVideo(0),
      onEnterBack: () => soloPanelVideo(lastPanelIndex),
      onLeave: pauseAllPanelVideos,
      onLeaveBack: pauseAllPanelVideos,
    });
  }
}
