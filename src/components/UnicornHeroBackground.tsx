"use client";
import { useEffect, useRef, useState } from "react";
import UnicornStudioScene from "unicornstudio-react";
import { DESKTOP_REFERENCE_HEIGHT } from "../lib/viewport";

export function UnicornHeroBackground() {
  // The Unicorn Studio scene watches its container with a ResizeObserver and
  // re-renders (re-covers) whenever the box size changes. If we let the box
  // track the live viewport, browser page-zoom (which changes innerWidth /
  // innerHeight in CSS px) makes the SDK re-cover on every zoom step, so the
  // PHOTO ITSELF reframes — the subject grows/shrinks. To stop that, the box is
  // frozen: its width is captured once (state) and its height is a constant
  // DESKTOP_REFERENCE_HEIGHT, so the SDK renders the scene ONCE and never
  // reframes. A compensating transform: scale(zoomScale) then keeps that frozen
  // box visually the same physical size across zoom levels, so the whole hero
  // just scales uniformly with the rest of the page — it does not drift.
  //
  // Only after the resize events settle (RESIZE_SETTLE_MS of silence) do we
  // check whether the physical *width* actually changed — that distinguishes a
  // real device switch / window resize (must re-freeze so the scene re-covers
  // at the new width) from zoom on the same screen (physical width unchanged,
  // so the box is left frozen and only compensated). The box is bottom-anchored
  // (bottom: 0, transform-origin bottom) so the subject's bottom edge stays
  // pinned; the parent section is only min(100vh, DESKTOP_REFERENCE_HEIGHT) tall
  // and clips the dead space off the TOP with overflow: hidden.
  const PHYSICAL_SIZE_TOLERANCE = 4;
  const RESIZE_SETTLE_MS = 200;
  // Only width lives in state — height is a compile-time constant, since it is
  // frozen rather than measured.
  const [width, setWidth] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  /*
   * The scene is a full-viewport WebGL renderer at dpi 1.5, and it has no idea
   * the page has scrolled: left alone it keeps drawing every frame for the
   * whole session, including the eight screens below where the sphere, the
   * fourteen skill tiles and the gravity hall are all competing for the same
   * GPU. Pausing it off-screen is the single biggest saving on this page.
   *
   * `paused` is applied by the SDK wrapper in an effect of its own and is not
   * in its init effect's dependency list, so this toggles the render loop
   * without tearing the scene down and rebuilding its context.
   */
  const sceneRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      // Resume a little before it is back on screen, so scrolling up to the
      // hero never catches a frozen frame.
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let baseDpr = window.devicePixelRatio;
    let baseInnerW = window.innerWidth;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    // Publish the same zoom-compensation factor the scene box uses so the hero
    // section can compensate its own min(100vh, 900px) cap by it. The cap is in
    // CSS px, which shrink under zoom-out; without this the section would clip
    // fewer physical px than the (physically-constant) frozen scene box on
    // zoom-out, shifting the top crop. Multiplying the cap by this factor keeps
    // it physically DESKTOP_REFERENCE_HEIGHT, so the crop stays put both ways.
    const applyZoomScale = (z: number) => {
      setZoomScale(z);
      document.documentElement.style.setProperty("--hero-zoom-scale", String(z));
    };

    const commitResize = () => {
      baseDpr = window.devicePixelRatio;
      baseInnerW = window.innerWidth;
      applyZoomScale(1);
      setWidth(baseInnerW);
    };
    commitResize();

    const onResize = () => {
      applyZoomScale(baseDpr / window.devicePixelRatio);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        settleTimer = null;
        const dpr = window.devicePixelRatio;
        const w = window.innerWidth;
        const sameWidth = Math.abs(w * dpr - baseInnerW * baseDpr) <= PHYSICAL_SIZE_TOLERANCE;
        if (!sameWidth) commitResize();
      }, RESIZE_SETTLE_MS);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (settleTimer) clearTimeout(settleTimer);
      document.documentElement.style.removeProperty("--hero-zoom-scale");
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: width ? `${width}px` : "100%",
        height: `${DESKTOP_REFERENCE_HEIGHT}px`,
        transform: `translateX(-50%) scale(${zoomScale})`,
        transformOrigin: "center bottom",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <UnicornStudioScene
        jsonFilePath="/unicorn/scene.json"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        paused={paused}
      />
    </div>
  );
}
