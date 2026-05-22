import { type RefObject, useEffect } from "react";
import { resetSphereState, sphereState, SPHERE_ABOUT_X, SPHERE_CENTER_X, SPHERE_HERO_X } from "../lib/sphereState";

const SKILLS_HEADLINE_CHAR_FROM = [
  { x: 450, y: -240, ease: "power4.out" },
  { x: 420, y: -250, ease: "power3.out" },
  { x: 400, y: 230, ease: "power4.out" },
  { x: 460, y: 150, ease: "power2.out" },
  { x: 440, y: -240, ease: "power3.out" },
  { x: 400, y: -240, ease: "power4.out" },
  { x: 480, y: 170, ease: "power2.out" },
  { x: 450, y: -200, ease: "power3.out" },
  { x: 440, y: 260, ease: "power4.out" },
  { x: 410, y: 200, ease: "back.out(1.4)" },
  { x: 430, y: -260, ease: "power3.out" },
  { x: 480, y: -130, ease: "power2.out" },
  { x: 490, y: 290, ease: "power4.out" },
  { x: 470, y: -220, ease: "power3.out" },
  { x: 450, y: -220, ease: "power2.out" },
  { x: 460, y: 250, ease: "elastic.out(1, 0.7)" },
] as const;

export type PortfolioGsapRefs = {
  progressRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  heroTextRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  skillsRef: RefObject<HTMLElement | null>;
  projectsRef: RefObject<HTMLElement | null>;
  projectsTrackRef: RefObject<HTMLDivElement | null>;
  experienceRef: RefObject<HTMLElement | null>;
  contactRef: RefObject<HTMLElement | null>;
};

export function usePortfolioGsap(
  loaded: boolean,
  refs: PortfolioGsapRefs,
  setActiveSection: (id: string) => void,
) {
  const {
    progressRef,
    navRef,
    heroRef,
    heroTextRef,
    aboutRef,
    skillsRef,
    projectsRef,
    projectsTrackRef,
    experienceRef,
    contactRef,
  } = refs;

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    window.scrollTo(0, 0);

    const initId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        const gsap = window.gsap;
        const ST = window.ScrollTrigger;

    const toggleRv = "play none none reverse";
    const afterPrevSection = (prevEl: HTMLElement | null | undefined) => ({
      trigger: prevEl as HTMLElement | undefined,
      start: "bottom top" as const,
      toggleActions: toggleRv,
    });

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    gsap.from(navRef.current, { y: -60, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.4 });

    gsap.from(".nav-link", {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.7,
    });

    gsap.from(".nav-cta", {
      x: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 1.1,
    });

    const heroWords = heroTextRef.current?.querySelectorAll(".hero-word span");
    if (heroWords) {
      gsap.from(heroWords, {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.06,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });
    }
    gsap.from(".hero-sub", { y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 1.2 });
    gsap.from(".hero-cta", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 1.6 });

    gsap.from(".hero-badge", {
      y: -16,
      opacity: 0,
      scale: 0.9,
      duration: 0.9,
      ease: "back.out(1.7)",
      delay: 0.2,
    });

    gsap.to(heroTextRef.current, {
      y: -200,
      opacity: 0,
      scale: 0.85,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "80% top",
        scrub: 1.5,
      },
    });

    resetSphereState();
    const sphereSlide = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        endTrigger: aboutRef.current,
        end: "top 40%",
        scrub: 2.8,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });
    sphereSlide
      .fromTo(
        sphereState,
        { groupX: SPHERE_HERO_X, rotateY: 0, outerExplode: 0, innerExplode: 0 },
        { groupX: SPHERE_ABOUT_X, rotateY: 0.06, duration: 1, ease: "power2.inOut" },
        0,
      );

    if (skillsRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      }).to(sphereState, {
        groupX: SPHERE_HERO_X,
        rotateY: 0,
        outerExplode: 0,
        innerExplode: 0,
        ease: "power2.inOut",
        duration: 1,
      });
    }

    gsap.from(".about-label", {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 80%",
        toggleActions: toggleRv,
      },
    });

    gsap.from(".about-headline span", {
      y: 100,
      opacity: 0,
      rotateX: -60,
      stagger: 0.08,
      duration: 0.8,
      scrollTrigger: { trigger: heroRef.current, start: "bottom 25%", toggleActions: toggleRv },
    });

    gsap.from(".about-body", {
      y: 50,
      opacity: 0,
      scrollTrigger: { trigger: heroRef.current, start: "bottom 28%", end: "bottom top", scrub: 1 },
    });
    gsap.from(".about-stat", {
      scale: 0,
      opacity: 0,
      stagger: 0.15,
      scrollTrigger: { trigger: heroRef.current, start: "bottom 22%", toggleActions: toggleRv },
    });

    gsap.to(".about-img", {
      y: -80,
      scrollTrigger: { trigger: aboutRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });

    gsap.from(".about-badge", {
      x: -40,
      opacity: 0,
      scale: 0.85,
      duration: 0.9,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 60%",
        toggleActions: toggleRv,
      },
    });

    const skillsTrack = skillsRef.current?.querySelector(".skills-track") as HTMLElement;
    if (skillsTrack && skillsRef.current) {
      const trackWidth = Math.max(skillsTrack.scrollWidth - window.innerWidth, 0);
      const horizontalPx = Math.max(trackWidth + window.innerHeight * 1.05, window.innerHeight);
      const skillCards = skillsTrack.querySelectorAll(".skill-card");
      const headlineStage = skillsTrack.querySelector(".skills-headline-stage") as HTMLElement | null;
      const headline = skillsTrack.querySelector(".skills-headline") as HTMLElement | null;
      const headlineChars = skillsTrack.querySelectorAll(".skills-headline-char");

      const trackTween = gsap.to(skillsTrack, {
        x: -trackWidth,
        ease: "none",
        scrollTrigger: {
          trigger: skillsRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${horizontalPx}`,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      gsap.fromTo(
        sphereState,
        { groupX: SPHERE_HERO_X, rotateY: 0 },
        {
          groupX: SPHERE_ABOUT_X,
          rotateY: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top top",
            end: () => `+=${horizontalPx}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        sphereState,
        { outerExplode: 0 },
        {
          outerExplode: 1,
          ease: "none",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top top",
            end: () => `+=${horizontalPx}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      if (headline && headlineStage) {
        gsap.fromTo(
          headline,
          { x: 0 },
          {
            x: () => -window.innerWidth * 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: headlineStage,
              containerAnimation: trackTween,
              start: "left left",
              end: "right left",
              horizontal: true,
              scrub: true,
            },
          },
        );

        if (headline && headlineChars.length) {
          const headlineCharTl = gsap.timeline({
            scrollTrigger: {
              trigger: headline,
              containerAnimation: trackTween,
              start: "left 95%",
              end: "left 20%",
              horizontal: true,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          Array.from(headlineChars).forEach((char: Element, i: number) => {
            const from = SKILLS_HEADLINE_CHAR_FROM[i % SKILLS_HEADLINE_CHAR_FROM.length];
            headlineCharTl.fromTo(
              char,
              { x: from.x, y: from.y },
              {
                x: 0,
                y: 0,
                duration: 0.14,
                ease: from.ease,
              },
              i * 0.035,
            );
          });
        }
      }

      skillCards.forEach((card) => {
        const bar = card.querySelector(".skill-bar-fill") as HTMLElement | null;
        const pct = card.querySelector(".skill-pct") as HTMLElement | null;
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: trackTween,
            start: "left 105%",
            end: "left 38%",
            horizontal: true,
            toggleActions: "play none none reverse",
          },
        });
        cardTl.from(card, {
          opacity: 0,
          x: 160,
          y: 24,
          scale: 0.88,
          rotateY: -12,
          duration: 0.7,
          ease: "power4.out",
          immediateRender: true,
        });
        if (bar) {
          cardTl.from(
            bar,
            { scaleX: 0, transformOrigin: "left center", duration: 0.65, ease: "power3.out", immediateRender: true },
            0.08,
          );
        }
        if (pct) {
          const targetVal = parseInt(pct.dataset.val || "0", 10);
          cardTl.from(
            { val: 0 },
            {
              val: targetVal,
              duration: 0.65,
              ease: "power3.out",
              onUpdate: function () {
                pct.textContent = Math.round(this.targets()[0].val) + "%";
              },
              immediateRender: false,
            },
            0.08,
          );
        }
      });
    }

    const pTrack = projectsTrackRef.current;
    if (pTrack && projectsRef.current) {
      const totalScroll = Math.max(pTrack.scrollWidth - window.innerWidth, 0);
      const horizontalPx = Math.max(totalScroll + window.innerHeight * 1.05, window.innerHeight);
      const projectCards = pTrack.querySelectorAll(".project-card");

      const projTrackTween = gsap.to(pTrack, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: projectsRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${horizontalPx}`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      gsap.fromTo(
        sphereState,
        { innerExplode: 0 },
        {
          innerExplode: 1,
          ease: "none",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top top",
            end: () => `+=${horizontalPx}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );

      projectCards.forEach((card, i) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: projTrackTween,
              start: "left 92%",
              end: "left 38%",
              horizontal: true,
              toggleActions: "play none none reverse",
            },
          })
          .from(card, {
            y: 80,
            opacity: 0,
            scale: 0.9,
            rotateY: i % 2 === 0 ? -8 : 8,
            duration: 0.65,
            ease: "power2.out",
            immediateRender: true,
          });
      });
    }

    if (experienceRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top bottom",
          end: "top 40%",
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      }).to(sphereState, {
        outerExplode: 0,
        innerExplode: 0,
        groupX: SPHERE_CENTER_X,
        rotateY: 0,
        ease: "power2.inOut",
        duration: 1,
      });
    }

    gsap.from(".exp-line-fill", {
      scaleY: 0,
      transformOrigin: "top center",
      scrollTrigger: { trigger: experienceRef.current, start: "top bottom", end: "bottom 50%", scrub: 1 },
    });

    experienceRef.current?.querySelectorAll(".exp-item").forEach((item, i) => {
      gsap.from(item, {
        x: i % 2 === 0 ? -80 : 80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 88%", toggleActions: toggleRv },
      });
    });

    gsap.from(".exp-dot", {
      scale: 0,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: experienceRef.current,
        start: "top 70%",
        toggleActions: toggleRv,
      },
    });

    gsap.from(".contact-headline span", {
      y: 120,
      opacity: 0,
      rotateX: -80,
      stagger: 0.1,
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from(".contact-field", {
      y: 40,
      opacity: 0,
      clipPath: "inset(0 0 100% 0)",
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from(".contact-social", {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: afterPrevSection(experienceRef.current),
    });

    gsap.from(".contact-info-row", {
      x: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { ...afterPrevSection(experienceRef.current) },
    });

    gsap.from("footer", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "footer",
        start: "top 95%",
        toggleActions: toggleRv,
      },
    });

    [aboutRef.current, experienceRef.current, contactRef.current].forEach((sec) => {
      if (!sec) return;
      gsap.to(sec.querySelector(".section-bg") as HTMLElement, {
        y: 80,
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
    });

    [
      { id: "hero", el: heroRef.current },
      { id: "about", el: aboutRef.current },
      { id: "skills", el: skillsRef.current },
      { id: "projects", el: projectsRef.current },
      { id: "experience", el: experienceRef.current },
      { id: "contact", el: contactRef.current },
    ].forEach(({ id, el }) => {
      ST.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    ST.refresh();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(initId);
      if (window.gsap) {
        window.gsap.killTweensOf(sphereState);
      }
      resetSphereState();
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger: { kill: (reset?: boolean) => void }) => {
          trigger.kill(true);
        });
        if (typeof window.ScrollTrigger.clearScrollMemory === "function") {
          window.ScrollTrigger.clearScrollMemory();
        }
      }
    };
  }, [loaded, setActiveSection]);
}
