/* ── Hero: the one-shot entrance timeline ───────────────────────────────────
 * Runs during the preloader reveal (Phase A). Creates NO ScrollTriggers — only
 * the immediate entrance tweens — so nothing forces a ScrollTrigger.refresh()
 * (full-page reflow) while the preloader entrance is playing. */
export function initHeroIntro(heroUi: HTMLElement | null, gsap: typeof window.gsap) {
  // The overlay layer (nav, clock, statement, CTA) is the whole hero now.
  // It reads top-down: chrome drops in from above, then the statement rises,
  // then the remaining marks fade up.
  if (!heroUi) return;
  // Reduced motion: the overlay is simply there when the preloader lifts.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap
    .timeline({ delay: 0.3 })
    .from(heroUi.querySelectorAll(".hero-ui-mark, .hero-nav-group, .hero-clock, .hero-discover"), {
      y: -18,
      opacity: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: "power3.out",
    })
    .from(
      heroUi.querySelectorAll(".hero-statement-line"),
      { y: 26, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      "-=0.4",
    )
    .from(
      heroUi.querySelectorAll(".hero-era, .hero-cta, .hero-rule, .hero-signal"),
      { opacity: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" },
      "-=0.5",
    );
}
