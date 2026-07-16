"use client";
import { useEffect, useState } from "react";
import UnicornStudioScene from "unicornstudio-react";
import { DESKTOP_REFERENCE_HEIGHT } from "../lib/viewport";

export function UnicornHeroBackground() {
  // The Unicorn Studio scene watches its container with a ResizeObserver and
  // redraws whenever the box size changes. Browser page-zoom (Ctrl +/-, Ctrl
  // + scroll) fires a burst of `resize` events while a smooth (trackpad)
  // zoom is in progress. Every event is compensated immediately and
  // unconditionally — the container's actual pixel size is never touched
  // mid-gesture, so it cannot visibly snap even if a single event's
  // dpr/innerWidth reading is momentarily inconsistent. Only the horizontal
  // axis is centered (left 50%, recomputed live from the current viewport)
  // since width is the only axis that varies — the box's height is frozen at
  // DESKTOP_REFERENCE_HEIGHT, so the SDK never sees a vertical resize at all.
  // Only after the resize events settle (RESIZE_SETTLE_MS of silence) do we
  // check whether the physical *width* actually changed — that distinguishes
  // a real device switch (DevTools device toolbar) or window resize, which
  // must resize immediately with no page refresh required, from zoom on the
  // same screen, which never touches the container's real size at all.
  //
  // The box is bottom-anchored (bottom: 0) with transform-origin at the bottom
  // edge, so the subject's bottom edge stays pinned while zoom-compensation and
  // the parent section's crop both act on the top. The section is only
  // min(100vh, DESKTOP_REFERENCE_HEIGHT) tall and clips this box with
  // overflow: hidden, so on short viewports the scene's dead top space is cut
  // and the viewport is filled without ever scaling the scene.
  const PHYSICAL_SIZE_TOLERANCE = 4;
  const RESIZE_SETTLE_MS = 200;
  // Only width lives in state — height is a compile-time constant, since it is
  // frozen rather than measured.
  const [width, setWidth] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    let baseDpr = window.devicePixelRatio;
    let baseInnerW = window.innerWidth;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const commitResize = () => {
      baseDpr = window.devicePixelRatio;
      baseInnerW = window.innerWidth;
      setZoomScale(1);
      setWidth(baseInnerW);
    };
    commitResize();

    const onResize = () => {
      setZoomScale(baseDpr / window.devicePixelRatio);
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
    };
  }, []);

  return (
    <div
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
      />
    </div>
  );
}
