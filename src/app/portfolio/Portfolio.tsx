"use client";

import { useEffect, useRef, useState } from "react";
import {
  AboutSection,
  CustomCursor,
  ExperienceSection,
  FloatingDock,
  HeroSection,
  Preloader,
  ProjectsSection,
  ScrollProgress,
  SiteFooter,
  SkillsSection,
  ThreeCanvas,
} from "../../components";
import "../../globals";
import {
  useLoadPortfolioScripts,
  usePortfolioCursor,
  usePortfolioGsap,
  usePortfolioLenis,
  usePortfolioThree,
} from "../../hooks";
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

  useLoadPortfolioScripts(setLoaded);
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
      <Preloader loaded={loaded} onDone={() => setIntroDone(true)} />
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
