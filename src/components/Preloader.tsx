"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  loaded: boolean;
  onDone: () => void;
};

// The heavy below-the-fold ScrollTrigger setup is now deferred until the intro
// finishes (Phase B in usePortfolioGsap), so only the lightweight hero setup runs
// before this animation. A short settle is enough for that to land.
const SETTLE_MS = 300;
const LOGO_SRC = "/Logos/RHLogoWhite.webp";

export function Preloader({ loaded, onDone }: Props) {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const rRef = useRef<HTMLSpanElement>(null);
  const hRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!loaded || firedRef.current) return;
    firedRef.current = true;

    const timer = window.setTimeout(() => {
      const gsap = window.gsap;
      const root = rootRef.current;
      const finish = () => {
        setDone(true);
        onDone();
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!gsap || !root) {
        if (root) {
          root.classList.add("pl-exit");
          window.setTimeout(finish, 900);
        } else {
          finish();
        }
        return;
      }

      if (reduced) {
        gsap.to(root, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: finish });
        return;
      }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const r = rRef.current;
      const h = hRef.current;
      const logo = logoRef.current;
      // Entrance order must read R → logo → H, so list them in that order; the
      // stagger below walks this array.
      const all = [r, logo, h];
      const vPanels = root.querySelectorAll(".pl-top, .pl-bottom");
      const hPanels = root.querySelectorAll(".pl-left, .pl-right");

      // Each stage element is centered (left/top 50%); x/y are px offsets from screen center.
      // Cluster is right-biased but kept on-screen so H is never clipped; letters start big.
      gsap.set(all, { xPercent: -50, yPercent: -30, y: H * 0.95, opacity: 0, scale: 1 });
      gsap.set(r, { x: W * 0.18 });
      gsap.set(logo, { x: W * 0.30, scale: 1.3 , yPercent: -20});
      gsap.set(h, { x: W * 0.42 });

      const tl = gsap.timeline({ onComplete: finish });

      // 1) Rise from below one-by-one (R, then logo, then H) into the cluster.
      //    Larger stagger + shorter per-item duration so the sequence reads
      //    clearly instead of looking like they all appear at once.
      tl.to(all, { y: H * 0.28, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.22 }, 0);

      // 2) Spread (frame 175921): R far-left, logo to center, H stays right; letters shrink a bit.
      tl.to(r, { x: -W * 0.42, y: H * 0.3, scale: 0.72, duration: 0.9, ease: "power3.inOut" }, 1.0)
        .to(logo, { x: 0, y: H * 0.3, scale: 1, duration: 0.9, ease: "power3.inOut" }, 1.0)
        .to(h, { x: W * 0.4, y: H * 0.3, scale: 0.72, duration: 0.9, ease: "power3.inOut" }, 1.0)
        // small transparent window appears dead center
        .to(vPanels, { scaleY: 0.86, duration: 0.6, ease: "power2.inOut" }, 1.2)
        .to(hPanels, { scaleX: 0.86, duration: 0.6, ease: "power2.inOut" }, 1.2);

      // 3) Window grows to ~50% and holds 2s; letters + logo slide down (frame 175932).
      tl.to(vPanels, { scaleY: 0.47, duration: 0.8, ease: "power2.inOut" }, 2.1)
        .to(hPanels, { scaleX: 0.47, duration: 0.8, ease: "power2.inOut" }, 2.1)
        .to(r, {x: -W * 0.7 , y: H * 0.62, duration: 0.8, ease: "power2.inOut" }, 3)
        .to(h, {x: W * 0.7, y: H * 0.62, duration: 0.8, ease: "power2.inOut" }, 3)
        .to(logo, {x: 0, y: H * 0.62, duration: 0.8, ease: "power2.inOut" }, 3)

      // 4) After the hold, window grows to fullscreen; letters/logo slide off and fade.
      tl.to(vPanels, { scaleY: 0, duration: 1.0, ease: "power4.inOut" }, 2.9)
        .to(hPanels, { scaleX: 0, duration: 1.0, ease: "power4.inOut" }, 2.9)
        .to(all, { y: H * 1.05, opacity: 0, duration: 0.7, ease: "power2.in" }, 4.9);
    }, SETTLE_MS);

    return () => window.clearTimeout(timer);
  }, [loaded, onDone]);

  if (done) return null;

  return (
    <div ref={rootRef} className="pl" aria-hidden="true">
      <div className="pl-panel pl-top" />
      <div className="pl-panel pl-bottom" />
      <div className="pl-panel pl-left" />
      <div className="pl-panel pl-right" />
      <div className="pl-stage">
        <span ref={rRef} className="pl-letter font-display">R</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={logoRef} className="pl-logo" src={LOGO_SRC} alt="" />
        <span ref={hRef} className="pl-letter font-display">H</span>
      </div>
    </div>
  );
}
