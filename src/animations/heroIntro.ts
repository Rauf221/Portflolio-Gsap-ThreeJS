/* ── Hero: the one-shot entrance timeline ───────────────────────────────────
 * Runs during the preloader reveal (Phase A). Creates NO ScrollTriggers — only
 * the immediate entrance tweens — so nothing forces a ScrollTrigger.refresh()
 * (full-page reflow) while the preloader entrance is playing. */
export function initHeroIntro(heroUi: HTMLElement | null, gsap: typeof window.gsap) {
  // The overlay assembles from the frame inward: the top rail drops in, the
  // lead block rises out of the left, then the index and the foot band arrive
  // together at the two remaining edges. Nothing in the frame is ruled across
  // its width, so nothing draws — it is all arrival.
  if (!heroUi) return;
  // Reduced motion: every tween below is a from-tween, so skipping them leaves
  // the overlay exactly where it rests — simply there when the preloader lifts.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap
    .timeline({ delay: 0.3 })
    .from(heroUi.querySelectorAll(".hero-ui-mark, .hero-nav-list li, .hero-clock"), {
      y: -14,
      opacity: 0,
      duration: 0.75,
      stagger: 0.05,
      ease: "power3.out",
    })
    // The lead block's CHILDREN, never .hero-lead itself: that element carries
    // the translateY(-50%) that centres it, and a y tween here would overwrite
    // the centring and drop the whole block half a height down the frame.
    .from(
      heroUi.querySelectorAll(".hero-headline-line, .hero-subline, .hero-cta"),
      { y: 22, opacity: 0, duration: 0.85, stagger: 0.08, ease: "power3.out" },
      "-=0.4",
    )
    // Same rule on the index rail — the rows move, the positioned wrapper does
    // not. x, not y, so the count slides in off the edge it is pinned to.
    .from(
      heroUi.querySelectorAll(".hero-index-list li"),
      { x: 16, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" },
      "-=0.55",
    )
    .from(
      heroUi.querySelectorAll(".hero-foot-link"),
      { y: 16, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power2.out" },
      "-=0.5",
    );
}
