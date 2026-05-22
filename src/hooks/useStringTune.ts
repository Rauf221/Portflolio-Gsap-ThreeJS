"use client";

import { useEffect, useRef } from "react";

export type StringTuneScrollMode = "default" | "smooth" | "disable";

export type UseStringTuneOptions = {
  /** Native scroll — touchpad/mouse wheel üçün `default` saxla */
  scrollMode?: StringTuneScrollMode;
  fps?: number;
};

/**
 * About və digər client səhifələr üçün String-Tune singleton.
 * React/Next: DOM-da yalnız `data-string` / `data-string-*` işləyir.
 */
export function useStringTune(options: UseStringTuneOptions = {}) {
  const { scrollMode = "default", fps = 60 } = options;
  const instanceRef = useRef<ReturnType<
    Awaited<typeof import("@fiddle-digital/string-tune")>["default"]["getInstance"]
  > | null>(null);

  useEffect(() => {
    let destroyed = false;

    const boot = async () => {
      const {
        default: StringTune,
        StringParallax,
        StringLerp,
        StringMagnetic,
        StringGlide,
        StringProgress,
        StringSpotlight,
        StringImpulse,
        StringSplit,
      } = await import("@fiddle-digital/string-tune");

      if (destroyed) return;

      const tune = StringTune.getInstance();
      instanceRef.current = tune;

      tune.scrollDesktopMode = scrollMode;
      tune.scrollMobileMode = scrollMode;

      tune.use(StringParallax);
      tune.use(StringLerp);
      tune.use(StringMagnetic);
      tune.use(StringGlide);
      tune.use(StringProgress);
      tune.use(StringSpotlight);
      tune.use(StringImpulse);
      tune.use(StringSplit);

      tune.start(fps);

      requestAnimationFrame(() => {
        if (!destroyed) tune.onResize(true);
      });
    };

    boot().catch(console.error);

    return () => {
      destroyed = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [scrollMode, fps]);

  return instanceRef;
}
