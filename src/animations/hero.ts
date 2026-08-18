/* ── Hero: scroll-out behaviour ─────────────────────────────────────────────
 * The hero stays pinned as a backdrop while About slides up over it; its
 * overlay fades away and hands navigation over to the floating dock. */

type HeroScrollEls = {
  heroEl: HTMLElement | null;
  aboutEl: HTMLElement | null;
  heroUiEl: HTMLElement | null;
  dockEl: HTMLElement | null;
};

export function initHeroScroll(
  { heroEl, aboutEl, heroUiEl, dockEl }: HeroScrollEls,
  gsap: typeof window.gsap,
  ST: typeof window.ScrollTrigger,
) {
  // Hero stays pinned at the top as a backdrop while About slides up over it
  // (pinSpacing: false keeps page geometry identical, so no other trigger moves).
  // Pin ends the moment About's bottom reaches the viewport bottom: at that
  // instant About still covers the whole viewport (it's taller than 100vh), so
  // the hero unpins while fully hidden. Ending any later would let the pinned
  // hero show through the transparent sections that follow About.
  ST.create({
    trigger: heroEl,
    start: "top top",
    endTrigger: aboutEl,
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
  });

  // Parallax: the hero drifts up at exactly half the speed About covers it —
  // About travels one viewport height (bottom → top), the hero half of that.
  gsap.to(".hero-parallax", {
    y: () => -window.innerHeight * 0.5,
    ease: "none",
    scrollTrigger: {
      trigger: aboutEl,
      start: "top bottom",
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // The overlay clears by 45% of the hero so the navigation is gone well
  // before About arrives, instead of lingering half-opaque over it.
  gsap.to(heroUiEl, {
    opacity: 0,
    y: -60,
    ease: "none",
    scrollTrigger: {
      trigger: heroEl,
      start: "top top",
      end: "45% top",
      scrub: 1,
    },
  });

  // The floating dock is the overlay nav's replacement, so it takes over
  // exactly where that nav leaves off: the fade above finishes at 45% of the
  // hero, the dock rises into the bottom of the viewport over 48%→62%.
  // autoAlpha (not opacity) so the bar is visibility:hidden while invisible
  // and cannot swallow clicks over the hero.
  gsap.fromTo(
    dockEl,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heroEl,
        start: "48% top",
        end: "62% top",
        scrub: 1,
      },
    },
  );
}
