/* ── Page chrome: progress bar, section-bg drift, active-section tracking ── */

export function initProgressBar(progressEl: HTMLElement | null, gsap: typeof window.gsap) {
  gsap.to(progressEl, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}

// Experience no longer carries a .section-bg — the hall paints its own air
// — so this drifts whichever sections still have one.
export function initSectionBgDrift(
  sections: (HTMLElement | null)[],
  gsap: typeof window.gsap,
) {
  sections.forEach((sec) => {
    const bg = sec?.querySelector(".section-bg") as HTMLElement | null;
    if (!sec || !bg) return;
    gsap.to(bg, {
      y: 80,
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.5 },
    });
  });
}

export function initActiveSectionTracking(
  entries: { id: string; el: HTMLElement | null }[],
  ST: typeof window.ScrollTrigger,
  setActiveSection: (id: string) => void,
) {
  entries.forEach(({ id, el }) => {
    ST.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
    });
  });
}
