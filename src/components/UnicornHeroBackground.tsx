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
  // dpr/innerWidth reading is momentarily inconsistent. Anchoring at
  // top/left 50% (recomputed live from the current viewport) and
  // re-centering with translate(-50%, -50%) keeps it pinned to the true
  // center; scale() cancels the zoom-driven growth of the frozen pixel size.
  // Only after the resize events settle (RESIZE_SETTLE_MS of silence) do we
  // check whether the physical *width* actually changed — that distinguishes
  // a real device switch (DevTools device toolbar) or window resize, which
  // must resize immediately with no page refresh required, from zoom on the
  // same screen, which never touches the container's real size at all.
  // Height is intentionally frozen at whatever it was on first mount and
  // never revisited, even on a genuine device switch — only width adapts.
  const PHYSICAL_SIZE_TOLERANCE = 4;
  const RESIZE_SETTLE_MS = 200;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const frozenHeight = window.innerHeight;
    let baseDpr = window.devicePixelRatio;
    let baseInnerW = window.innerWidth;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const commitResize = () => {
      baseDpr = window.devicePixelRatio;
      baseInnerW = window.innerWidth;
      setZoomScale(1);
      setSize({ width: baseInnerW, height: frozenHeight });
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
        top: "50%",
        left: "50%",
        width: size ? `${size.width}px` : "100%",
        height: size ? `${size.height}px` : "100%",
        transform: `translate(-50%, -50%) scale(${zoomScale})`,
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
