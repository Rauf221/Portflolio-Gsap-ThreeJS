/* ── About — mystic observatory reveals ─────────────────────────────────────
 * One-shot (toggle-reversed) entrance tweens plus the scrubbed RH-mark draw. */

const toggleRv = "play none none reverse";

export function initAboutReveals(aboutEl: HTMLElement, gsap: typeof window.gsap) {
  // Reduced motion: every element here is a from-tween — skipping them leaves
  // the section fully visible in its resting state, which is exactly the
  // no-motion presentation. (The scrubbed logo draw is skipped with the rest;
  // the mark then simply stands complete.)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Pure transform + opacity, no blur and no rotateX. Animated filters
  // force a full repaint of every character on every frame, which is what
  // made this reveal the most expensive moment in the section; the words
  // are already masked by .overflow-clip, so the slide alone reads fine.
  gsap.from(".about-headline-char", {
    y: 90,
    opacity: 0,
    stagger: 0.022,
    duration: 0.9,
    ease: "power4.out",
    scrollTrigger: { trigger: aboutEl, start: "top 72%", toggleActions: toggleRv },
  });

  gsap.from(".about-body", {
    y: 44,
    opacity: 0,
    stagger: 0.16,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: aboutEl, start: "top 62%", toggleActions: toggleRv },
  });

  gsap.from(".about-meta-row", {
    y: 24,
    opacity: 0,
    stagger: 0.09,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: aboutEl, start: "top 52%", toggleActions: toggleRv },
  });

  gsap.from(".about-mantra", {
    opacity: 0,
    x: -30,
    clipPath: "inset(0 100% 0 0)",
    duration: 1.3,
    ease: "power3.out",
    scrollTrigger: { trigger: aboutEl, start: "top 45%", toggleActions: toggleRv },
  });

  // RH mark: the preloader's draw-then-fill reveal, but scrubbed — the
  // strokes track scroll position, so the user draws the logo themselves.
  // Durations here are proportions of the scroll range, not seconds.
  //
  // The trigger is the logo's own box (not the section) and the range runs
  // from "logo reaches the middle of the screen" to "logo has crossed it",
  // so the mark starts at nothing and is drawn entirely on-screen. Nothing
  // is animated on .about-logo-wrap itself: transforming the trigger would
  // shift the very start/end points being measured.
  const aboutLogoPaths = aboutEl.querySelectorAll(".about-logo path");
  if (aboutLogoPaths.length) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".about-logo-wrap",
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      })
      .fromTo(
        ".about-logo",
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
        0,
      )
      .fromTo(
        aboutLogoPaths,
        { drawSVG: "0%", fillOpacity: 0 },
        { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.06 },
        0,
      )
      // shards fill only once the outlines have essentially closed
      .to(aboutLogoPaths, { fillOpacity: 1, duration: 0.5, ease: "power1.out", stagger: 0.04 }, 1.5);
  }

  // gentle scroll-linked drift so the mark isn't dead-static in the column
  // (on the svg, not the wrap — see the trigger note above)
  gsap.to(".about-logo", {
    y: -40,
    ease: "none",
    scrollTrigger: { trigger: aboutEl, start: "top bottom", end: "bottom top", scrub: 1.4 },
  });
}
