"use client";

import { useEffect, useRef, useState } from "react";
import { AboutSection } from "../../components/AboutSection";
import { CustomCursor } from "../../components/CustomCursor";
import { ExperienceSection } from "../../components/ExperienceSection";
import { FloatingDock } from "../../components/FloatingDock";
import { HeroSection } from "../../components/HeroSection";
import { Preloader } from "../../components/Preloader";
import { ProjectsSection } from "../../components/ProjectsSection";
import { ScrollProgress } from "../../components/ScrollProgress";
import { SiteFooter } from "../../components/SiteFooter";
import { SkillsSection } from "../../components/SkillsSection";
import { ThreeCanvas } from "../../components/ThreeCanvas";
import "../../globals";
import { useLoadPortfolioScripts } from "../../hooks/useLoadPortfolioScripts";
import { usePortfolioCursor } from "../../hooks/usePortfolioCursor";
import { usePortfolioGsap } from "../../hooks/usePortfolioGsap";
import { usePortfolioLenis } from "../../hooks/usePortfolioLenis";
import { usePortfolioThree } from "../../hooks/usePortfolioThree";
import { lockScroll, scrollToTop, unlockScroll } from "../../lib/scroll";
import { sphereState } from "../../lib/sphereState";
import { PortfolioStyles } from "../../styles/PortfolioStyles";

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroUiRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);

  const [loaded, setLoaded] = useState(false);
  // Scripts failed to arrive (offline, CDN block). The page downgrades to a
  // plain readable document: the preloader exits via its CSS fallback and the
  // scroll lock is released — content over choreography.
  const [loadFailed, setLoadFailed] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  // Written by the per-section ScrollTriggers in usePortfolioGsap; read by the
  // hero overlay nav to highlight the link for whatever section is on screen.
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    scrollToTop(true);
    lockScroll();
    sphereState.paused = true;
  }, []);

  useEffect(() => {
    if (introDone) {
      // Everything is wired up-front on `loaded` (model A); we just release the
      // scroll lock and start the 3D render loop once the intro reveal is done.
      unlockScroll();
      sphereState.paused = false;
    }
  }, [introDone]);

  useEffect(() => {
    if (loadFailed) {
      unlockScroll();
      // body carries cursor:none for the custom cursor, which never wired up.
      document.body.style.cursor = "auto";
    }
  }, [loadFailed]);

  useLoadPortfolioScripts(setLoaded, () => setLoadFailed(true));
  usePortfolioLenis(loaded);
  usePortfolioThree(canvasRef, loaded);
  usePortfolioCursor(cursorRef, cursorDotRef, loaded);
  usePortfolioGsap(loaded, {
    progressRef,
    heroRef,
    heroUiRef,
    dockRef,
    aboutRef,
    skillsRef,
    projectsRef,
    experienceRef,
  }, setActiveSection);

  return (
    <>
      <PortfolioStyles />
      {/* `loadFailed` reuses the preloader's no-gsap CSS fallback exit, so the
          curtain still lifts on a page whose scripts never arrived. */}
      <Preloader loaded={loaded || loadFailed} onDone={() => setIntroDone(true)} />
      <CustomCursor cursorRef={cursorRef} cursorDotRef={cursorDotRef} />
      <ScrollProgress progressRef={progressRef} />
      <FloatingDock dockRef={dockRef} />
      <ThreeCanvas canvasRef={canvasRef} />
      <HeroSection heroRef={heroRef} heroUiRef={heroUiRef} activeSection={activeSection} />
      <AboutSection aboutRef={aboutRef} />
      <SkillsSection skillsRef={skillsRef} />
      <ProjectsSection projectsRef={projectsRef} />
      <ExperienceSection experienceRef={experienceRef} />
      <SiteFooter />
    </>
  );
}
