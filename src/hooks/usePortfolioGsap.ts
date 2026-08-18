import { type RefObject, useEffect } from "react";
import { initAboutReveals } from "../animations/about";
import {
  initActiveSectionTracking,
  initProgressBar,
  initSectionBgDrift,
} from "../animations/chrome";
import { initExperienceGravity } from "../animations/experienceGravity";
import { initFooterReveals } from "../animations/footer";
import { initHeroScroll } from "../animations/hero";
import { initHeroIntro } from "../animations/heroIntro";
import { initProjectsPanels } from "../animations/projectsPanels";
import { initProjectsPathHeadline } from "../animations/projectsPath";
import { initSkillsSection } from "../animations/skills";
import { resetHallState } from "../lib/hallState";
import { scrollToTop } from "../lib/scroll";
import { resetSphereState, sphereState } from "../lib/sphereState";

export type PortfolioGsapRefs = {
  progressRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  heroUiRef: RefObject<HTMLDivElement | null>;
  dockRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  skillsRef: RefObject<HTMLElement | null>;
  projectsRef: RefObject<HTMLElement | null>;
  experienceRef: RefObject<HTMLElement | null>;
};

/*
 * Thin orchestrator. Every section's choreography lives in its own module
 * under src/animations/ — this hook only owns the two-phase lifecycle:
 *
 *   Phase A (first effect)  — the immediate hero entrance tweens, created the
 *     moment the scripts land so they play under the preloader reveal. NO
 *     ScrollTriggers here: nothing may force a refresh (full-page reflow)
 *     while that reveal is playing.
 *
 *   Phase B (second effect) — every scroll-driven trigger, built up-front on
 *     `loaded` (model A: the whole page is wired before the preloader plays
 *     its reveal, so the reveal runs on a ready page). Scroll stays locked
 *     until `introDone` (released in Portfolio).
 *
 * The creation ORDER inside Phase B is deliberate and load-bearing — pins
 * register in document order so ScrollTrigger's refresh resolves their
 * spacers top-down. Reorder these calls only with a reason.
 */
export function usePortfolioGsap(
  loaded: boolean,
  refs: PortfolioGsapRefs,
  setActiveSection: (id: string) => void,
) {
  const {
    progressRef,
    heroRef,
    heroUiRef,
    dockRef,
    aboutRef,
    skillsRef,
    projectsRef,
    experienceRef,
  } = refs;

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    let heroCtx: { revert: () => void } | undefined;
    scrollToTop(true);

    const initId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        const gsap = window.gsap;

        heroCtx = gsap.context(() => {
          initHeroIntro(heroUiRef.current, gsap);
          resetSphereState();
        }); // end Phase A (heroCtx)
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(initId);
      if (window.gsap) window.gsap.killTweensOf(sphereState);
      resetSphereState();
      heroCtx?.revert();
    };
  }, [loaded, heroUiRef]);

  // Scroll-driven setup: progress bar, hero exit, sphere choreography, and all
  // below-the-fold sections (skills pin, projects path, experience, contact).
  useEffect(() => {
    if (!loaded) return;

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return;

    let cancelled = false;
    let sectionsCtx: { revert: () => void } | undefined;
    let disposeProjectsPath: (() => void) | undefined;
    let disposeExperience: (() => void) | undefined;
    const rafs: number[] = [];

    rafs.push(
      requestAnimationFrame(() => {
        if (cancelled) return;
        sectionsCtx = gsap.context(() => {
          initProgressBar(progressRef.current, gsap);

          initHeroScroll(
            {
              heroEl: heroRef.current,
              aboutEl: aboutRef.current,
              heroUiEl: heroUiRef.current,
              dockEl: dockRef.current,
            },
            gsap,
            ST,
          );

          // The sphere has no presence before the Skills pin — no slide, no
          // fade-in. Its entire lifecycle is driven from inside that pin by
          // the choreography in animations/skills.
          if (aboutRef.current) {
            initAboutReveals(aboutRef.current, gsap);
          }

          if (skillsRef.current) {
            initSkillsSection(skillsRef.current, gsap, ST);
          }

          if (projectsRef.current) {
            disposeProjectsPath = initProjectsPathHeadline(projectsRef.current, gsap);
            initProjectsPanels(projectsRef.current, gsap);
          }

          // Experience — the gravity playground. Owns its own atmosphere
          // canvas, a physics rAF and raw pointer listeners, so it returns a
          // disposer for everything ctx.revert() can't see.
          if (experienceRef.current) {
            disposeExperience = initExperienceGravity(experienceRef.current, gsap);
          }

          initFooterReveals(gsap, dockRef.current);

          initSectionBgDrift([aboutRef.current, experienceRef.current], gsap);

          initActiveSectionTracking(
            [
              { id: "hero", el: heroRef.current },
              { id: "about", el: aboutRef.current },
              { id: "skills", el: skillsRef.current },
              { id: "projects", el: projectsRef.current },
              { id: "experience", el: experienceRef.current },
            ],
            ST,
            setActiveSection,
          );
        }); // end scroll-setup context

        // Refresh once all section triggers exist.
        rafs.push(
          requestAnimationFrame(() => {
            if (cancelled) return;
            ST.refresh();
          }),
        );
      })
    );

    // Hanken Grotesk swaps in late on a cold cache; the swap reflows every
    // headline and the pin distances measured before it drift by the
    // difference. One refresh once the fonts settle re-measures everything.
    // (Resolves immediately when fonts were already cached, where the rAF
    // refresh above has it covered.)
    document.fonts.ready.then(() => {
      if (!cancelled) ST.refresh();
    });

    return () => {
      cancelled = true;
      rafs.forEach((id) => cancelAnimationFrame(id));
      disposeProjectsPath?.();
      disposeExperience?.();
      if (window.gsap) window.gsap.killTweensOf(sphereState);
      // The atmosphere's render loop keys off `active`; without this a hot
      // reload would leave it drawing against a pin that no longer exists.
      resetHallState();
      sectionsCtx?.revert();
    };
  }, [
    loaded,
    setActiveSection,
    progressRef,
    heroRef,
    heroUiRef,
    dockRef,
    aboutRef,
    skillsRef,
    projectsRef,
    experienceRef,
  ]);
}
