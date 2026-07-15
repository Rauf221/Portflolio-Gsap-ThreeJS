"use client";
import { useEffect, useState } from "react";
import UnicornStudioScene from "unicornstudio-react";

export function UnicornHeroBackground() {
  // The Unicorn Studio scene watches its container with a ResizeObserver and
  // redraws whenever the box size changes. Browser page-zoom (Ctrl +/-, Ctrl
  // + scroll) fires a burst of `resize` events while a smooth (trackpad)
  // zoom is in progress. Every event is compensated immediately and
  // unconditionally — the container's actual pixel size is never touched
  // mid-gesture, so it cannot visibly snap even if a single event's
  // dpr/innerWidth reading is momentarily inconsistent. The box stays
  // top-anchored (top: 0) so the photo's vertical framing never drifts
  // during zoom; only the horizontal axis is centered (left 50%, recomputed
  // live from the current viewport) since real resizes are what should move
  // the box, not zoom. scale()'s transform-origin is pinned to the top edge
  // too, so zoom-compensation grows/shrinks the box without moving that top
  // edge — cancelling the zoom-driven size change without any vertical
  // drift. Only after the resize events settle (RESIZE_SETTLE_MS of
  // silence) do we check whether the physical size actually changed — that
  // distinguishes a real device switch (DevTools device toolbar) or window
  // resize, which must resize immediately with no page refresh required,
  // from zoom on the same screen, which never touches the container's real
  // size at all. Both width and height live-track the real viewport on a
  // genuine resize, so the box always fully fills the actual screen on
  // every machine (no fixed reference size — a frozen value gaps or
  // overflows on viewports whose real height differs from it).
  const PHYSICAL_SIZE_TOLERANCE = 4;
  const RESIZE_SETTLE_MS = 200;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    let baseDpr = window.devicePixelRatio;
    let baseInnerW = window.innerWidth;
    let baseInnerH = window.innerHeight;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const commitResize = () => {
      baseDpr = window.devicePixelRatio;
      baseInnerW = window.innerWidth;
      baseInnerH = window.innerHeight;
      setZoomScale(1);
      setSize({ width: baseInnerW, height: baseInnerH });
    };
    commitResize();

    const onResize = () => {
      setZoomScale(baseDpr / window.devicePixelRatio);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        settleTimer = null;
        const dpr = window.devicePixelRatio;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const samePhysicalSize =
          Math.abs(w * dpr - baseInnerW * baseDpr) <= PHYSICAL_SIZE_TOLERANCE &&
          Math.abs(h * dpr - baseInnerH * baseDpr) <= PHYSICAL_SIZE_TOLERANCE;
        if (!samePhysicalSize) commitResize();
      }, RESIZE_SETTLE_MS);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: size ? `${size.width}px` : "100%",
        height: size ? `${size.height}px` : "100%",
        transform: `translateX(-50%) scale(${zoomScale})`,
        transformOrigin: "center top",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <UnicornStudioScene
        jsonFilePath="/unicorn/scene.json"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
      />
    </div>
  );
}
