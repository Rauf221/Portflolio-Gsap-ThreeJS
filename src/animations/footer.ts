/* ── Footer reveals + dock step-aside ───────────────────────────────────────
 * Contact items and grid marks appear, then the purple slogan band wipes in
 * and the info strip rises (the raviklaassens.com /contact treatment). */

const toggleRv = "play none none reverse";

export function initFooterReveals(gsap: typeof window.gsap, dockEl: HTMLElement | null) {
  // Reduced motion: all from-tweens — skipping them shows the footer at rest.
  // The dock step-aside below is skipped too; the dock and the info strip
  // overlap at the very bottom then, which reads fine as static layout.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.from(".rk-contact .rk-item", {
    y: 24,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: "footer", start: "top 78%", toggleActions: toggleRv },
  });

  gsap.from(".rk-mark", {
    opacity: 0,
    scale: 0,
    stagger: 0.04,
    duration: 0.5,
    ease: "back.out(2)",
    scrollTrigger: { trigger: "footer", start: "top 78%", toggleActions: toggleRv },
  });

  gsap.from(".rk-x", {
    opacity: 0,
    scale: 0,
    rotate: -90,
    duration: 0.6,
    ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".rk-band", start: "top 96%", toggleActions: toggleRv },
  });

  gsap.from(".rk-band", {
    clipPath: "inset(0 100% 0 0)",
    duration: 1.1,
    ease: "power4.inOut",
    scrollTrigger: { trigger: ".rk-band", start: "top 92%", toggleActions: toggleRv },
  });

  gsap.from(".rk-slogan", {
    yPercent: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".rk-band", start: "top 92%", toggleActions: toggleRv },
  });

  gsap.from(".rk-info-col", {
    y: 18,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: { trigger: ".rk-info", start: "top 99%", toggleActions: toggleRv },
  });

  // The dock is pinned to the bottom of the viewport, which is exactly where
  // the footer's own info strip lands — they would sit on top of each other.
  // So the dock steps aside once the footer owns the screen, and comes back
  // on the way up. Written to the inner .dock, NOT the .dock-layer the
  // entrance tween above animates, so the two never fight over autoAlpha/y.
  const dockBar = dockEl?.querySelector(".dock");
  if (dockBar) {
    gsap.to(dockBar, {
      autoAlpha: 0,
      y: 26,
      duration: 0.45,
      ease: "power2.in",
      scrollTrigger: { trigger: "footer", start: "top 30%", toggleActions: toggleRv },
    });
  }
}
