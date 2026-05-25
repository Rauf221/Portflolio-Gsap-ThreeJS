import { type RefObject, useEffect } from "react";
import { resetSphereState, sphereState, SPHERE_ABOUT_X, SPHERE_CENTER_X, SPHERE_HERO_X } from "../lib/sphereState";

const SKILLS_HEADLINE_CHAR_FROM = [
  { x: 550, y: -440, ease: "power4.out" },
  { x: 420, y: -450, ease: "power3.out" },
  { x: 400, y: 430, ease: "power4.out" },
  { x: 460, y: 350, ease: "power2.out" },
  { x: 440, y: -440, ease: "power3.out" },
  { x: 400, y: -440, ease: "power4.out" },
  { x: 480, y: 370, ease: "power2.out" },
  { x: 450, y: -400, ease: "power3.out" },
  { x: 440, y: 460, ease: "power4.out" },
  { x: 410, y: 400, ease: "back.out(1.4)" },
  { x: 430, y: -460, ease: "power3.out" },
  { x: 480, y: -330, ease: "power2.out" },
  { x: 490, y: 490, ease: "power4.out" },
  { x: 470, y: -420, ease: "power3.out" },
  { x: 450, y: -420, ease: "power2.out" },
  { x: 460, y: 450, ease: "elastic.out(1, 0.7)" },
] as const;

const SKILLS_STREAM_LEAD = 1.35;
const SKILLS_STREAM_PREROLL = 1.25;
const SKILLS_CAROUSEL_INTRO = 0.14;

function getSkillsCarouselMetrics(itemCount: number) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const cardSize = Math.min(Math.max(vw * 0.14, 154), 218);
  const cardGap = cardSize * 1.38;
  const progressMin = -SKILLS_STREAM_LEAD;
  const progressMax = Math.max(itemCount - 1, 0) + SKILLS_STREAM_LEAD;
  const progressSpan = progressMax - progressMin;
  const streamPx = progressSpan * cardGap * 0.96;
  const introPx = vh * 0.28;
  const carouselPx =
    streamPx / (1 - SKILLS_CAROUSEL_INTRO) + introPx;
  return {
    cardGap,
    cardSize,
    progressSpan,
    progressMin,
    progressMax,
    streamStart: progressMin - SKILLS_STREAM_PREROLL,
    carouselPx: Math.max(carouselPx, vh * 0.95),
  };
}

function layoutSkillsStack(
  iconItems: NodeListOf<Element>,
  nameRows: NodeListOf<Element>,
  progress: number,
) {
  const gsap = window.gsap;
  if (!gsap) return;

  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const { cardGap, cardSize } = getSkillsCarouselMetrics(iconItems.length);
  const nameGap = cardGap * 0.82;
  const cardArc = vw * 0.022;
  const nameArc = vw * 0.018;
  const edgeLimit = vh * 0.54 - cardSize * 0.48;
  const fadeBand = vh * 0.11;

  const fadeFromBottomExitTop = (y: number) => {
    if (y > edgeLimit + fadeBand) return 0;
    if (y < -(edgeLimit + fadeBand)) return 0;
    if (y > edgeLimit) return gsap.utils.mapRange(edgeLimit + fadeBand, edgeLimit, 0, 1, y);
    if (y < -edgeLimit) return gsap.utils.mapRange(-(edgeLimit + fadeBand), -edgeLimit, 0, 1, y);
    return 1;
  };

  const fadeFromTopExitBottom = (y: number) => {
    if (y < -(edgeLimit + fadeBand)) return 0;
    if (y > edgeLimit + fadeBand) return 0;
    if (y < -edgeLimit) return gsap.utils.mapRange(-(edgeLimit + fadeBand), -edgeLimit, 0, 1, y);
    if (y > edgeLimit) return gsap.utils.mapRange(edgeLimit + fadeBand, edgeLimit, 0, 1, y);
    return 1;
  };

  iconItems.forEach((item, i) => {
    const y = (progress - i) * cardGap;
    const dist = Math.abs(i - progress);
    const arcX = Math.pow(Math.min(dist, 2.2), 1.15) * cardArc;
    const scale = gsap.utils.clamp(0.92, 1, 1.12 - dist * 0.07);
    const edgeOpacity = fadeFromTopExitBottom(y);
    const focusOpacity = gsap.utils.clamp(0, 1, 1.15 - dist * 0.55);
    const opacity = edgeOpacity * focusOpacity;
    gsap.set(item, {
      x: arcX,
      y,
      scale,
      opacity,
      rotation: gsap.utils.clamp(-4, 4, y * 0.011),
      zIndex: Math.round(100 + i),
      force3D: true,
    });
  });

  nameRows.forEach((row, i) => {
    const y = (i - progress) * nameGap;
    const dist = Math.abs(i - progress);
    const arcX = -Math.pow(Math.min(dist, 2.2), 1.1) * nameArc;
    const scale = gsap.utils.clamp(0.92, 1, 1.08 - dist * 0.035);
    const edgeOpacity = fadeFromBottomExitTop(y);
    const focusOpacity = gsap.utils.clamp(0, 1, 1.15 - dist * 0.55);
    const opacity = edgeOpacity * focusOpacity;

    gsap.set(row, {
      x: arcX,
      y,
      scale,
      opacity,
      force3D: true,
    });
  });
}

export type PortfolioGsapRefs = {
  progressRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  heroTextRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  skillsRef: RefObject<HTMLElement | null>;
  projectsRef: RefObject<HTMLElement | null>;
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
      const carouselStage = skillsRef.current.querySelector(".skills-carousel-stage") as HTMLElement | null;
      const iconTrack = skillsRef.current.querySelector(".skills-icon-track") as HTMLElement | null;
      const iconItems = skillsRef.current.querySelectorAll(".skills-icon-item");
      const nameRows = skillsRef.current.querySelectorAll(".skills-carousel-name-row");

      const headline = skillsTrack.querySelector(".skills-headline") as HTMLElement | null;
      const headlineChars = skillsTrack.querySelectorAll(".skills-headline-char");

      const measureHeadlineScroll = () => {
        if (!headline) {
          return { exitTrackX: window.innerWidth * 0.65 };
        }

        const savedTrackX = gsap.getProperty(skillsTrack, "x") as number;

        gsap.set(skillsTrack, { x: 0 });
        gsap.set(headline, { x: 0 });

        const exitTrackX = headline.getBoundingClientRect().right + 80;

        gsap.set(skillsTrack, { x: savedTrackX });

        return { exitTrackX };
      };

      const getSkillsPinMetrics = () => {
        const { exitTrackX } = measureHeadlineScroll();
        const headlinePx = Math.max(exitTrackX + window.innerHeight * 0.35, window.innerHeight);
        const bufferPx = window.innerHeight * 0.18;
        const carouselMetrics = getSkillsCarouselMetrics(iconItems.length);
        const totalPinPx = headlinePx + bufferPx + carouselMetrics.carouselPx;
        return {
          exitTrackX,
          totalPinPx,
          headlineRatio: headlinePx / totalPinPx,
          carouselStartRatio: (headlinePx + bufferPx) / totalPinPx,
          ...carouselMetrics,
        };
      };

      const headlineScroll = measureHeadlineScroll();
      const pinMetrics = getSkillsPinMetrics();
      const carouselProgress = { value: 0 };
      const headlinePx = Math.max(
        headlineScroll.exitTrackX + window.innerHeight * 0.35,
        window.innerHeight,
      );

      ST.create({
        trigger: skillsRef.current,
        start: "top top",
        end: () => `+=${pinMetrics.totalPinPx}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onRefresh: () => {
          Object.assign(headlineScroll, measureHeadlineScroll());
        },
        onUpdate: (self: { progress: number }) => {
          const bufferRatio = headlinePx / pinMetrics.totalPinPx;
          if (self.progress >= bufferRatio) {
            gsap.set(skillsTrack, { opacity: 0 });
          } else {
            gsap.set(skillsTrack, { opacity: 1 });
          }

          if (!carouselStage || !iconTrack || !iconItems.length) return;
          const carouselStartRatio = (headlinePx + window.innerHeight * 0.18) / pinMetrics.totalPinPx;

          if (self.progress >= carouselStartRatio) {
            carouselStage.removeAttribute("aria-hidden");
            carouselStage.classList.add("is-active");
            const carouselT = gsap.utils.clamp(
              0,
              1,
              (self.progress - carouselStartRatio) / (1 - carouselStartRatio),
            );
            const introT = gsap.utils.clamp(0, 1, carouselT / SKILLS_CAROUSEL_INTRO);
            const streamT = gsap.utils.clamp(
              0,
              1,
              (carouselT - SKILLS_CAROUSEL_INTRO) / (1 - SKILLS_CAROUSEL_INTRO),
            );
            const tailFade = gsap.utils.clamp(0, 1, (carouselT - 0.9) / 0.1);
            gsap.set(carouselStage, {
              opacity: introT * (1 - tailFade),
              visibility: introT > 0.02 && tailFade < 1 ? "visible" : "hidden",
            });
            carouselProgress.value =
              pinMetrics.streamStart +
              streamT * (pinMetrics.progressMax - pinMetrics.streamStart);
            layoutSkillsStack(iconItems, nameRows, carouselProgress.value);
          } else {
            gsap.set(carouselStage, { opacity: 0, visibility: "hidden" });
            layoutSkillsStack(iconItems, nameRows, pinMetrics.streamStart - 0.5);
          }
        },
      });

      const headlineTrackTween = gsap.to(skillsTrack, {
        x: () => -headlineScroll.exitTrackX,
        ease: "none",
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top top",
          end: () => `+=${headlinePx}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      if (headline && headlineChars.length) {
        Array.from(headlineChars).forEach((char: Element, i: number) => {
          const from = SKILLS_HEADLINE_CHAR_FROM[i % SKILLS_HEADLINE_CHAR_FROM.length];
          gsap.fromTo(
            char,
            { x: from.x, y: from.y, immediateRender: true },
            {
              x: 0,
              y: 0,
              ease: from.ease,
              immediateRender: false,
              scrollTrigger: {
                trigger: char,
                containerAnimation: headlineTrackTween,
                start: "left 108%",
                end: "left 54%",
                horizontal: true,
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      }

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
            end: () => `+=${pinMetrics.totalPinPx}`,
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
            end: () => `+=${pinMetrics.totalPinPx}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      if (iconTrack && iconItems.length) {
        const initMetrics = getSkillsCarouselMetrics(iconItems.length);
        layoutSkillsStack(iconItems, nameRows, initMetrics.streamStart - 0.5);
      }
    }

    if (projectsRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      }).to(sphereState, {
        groupX: SPHERE_CENTER_X,
        rotateY: 0,
        ease: "power2.inOut",
        duration: 1,
      });
    }

    const projectPanels = projectsRef.current
      ? Array.from(projectsRef.current.querySelectorAll<HTMLElement>(".project-panel"))
      : [];

    if (projectsRef.current && projectPanels.length) {
      const lastPanel = projectPanels[projectPanels.length - 1];

      gsap.fromTo(
        sphereState,
        { innerExplode: 0 },
        {
          innerExplode: 1,
          ease: "none",
          scrollTrigger: {
            trigger: projectPanels[0],
            endTrigger: lastPanel,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      projectPanels.forEach((panel, index) => {
        const isLast = index === projectPanels.length - 1;
        const card = panel.querySelector(".project-panel-inner");
        const visual = panel.querySelector(".project-panel-visual");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        if (card && !isLast) {
          tl.fromTo(
            card,
            { filter: "brightness(100%) blur(0px)", scale: 1, borderRadius: 0 },
            {
              filter: "brightness(50%) blur(10px)",
              scale: 0.9,
              borderRadius: 40,
              ease: "none",
            },
          );
        }

        if (visual) {
          tl.to(
            visual,
            {
              yPercent: -40,
              rotation: index % 2 === 0 ? 20 : -20,
              ease: "power1.in",
            },
            isLast ? 0 : "<",
          );
        }
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
