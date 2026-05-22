"use client";

import { useEffect, useRef, useState } from "react";
import {
  AboutSection,
  ContactSection,
  CustomCursor,
  ExperienceSection,
  HeroSection,
  NavBar,
  ProjectsSection,
  ScrollProgress,
  SiteFooter,
  SkillsSection,
  ThreeCanvas,
} from "../../components";
import "../../globals";
import { useLoadPortfolioScripts, usePortfolioCursor, usePortfolioGsap, usePortfolioThree } from "../../hooks";
import { PortfolioStyles } from "../../styles/PortfolioStyles";

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const projectsTrackRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLoadPortfolioScripts(setLoaded);
  usePortfolioThree(canvasRef, loaded);
  usePortfolioCursor(cursorRef, cursorDotRef, loaded);
  usePortfolioGsap(loaded, {
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
  }, setActiveSection);

  return (
    <>
      <PortfolioStyles />
      <CustomCursor cursorRef={cursorRef} cursorDotRef={cursorDotRef} />
      <ScrollProgress progressRef={progressRef} />
      <ThreeCanvas canvasRef={canvasRef} />
      <NavBar navRef={navRef} activeSection={activeSection} />
      <HeroSection heroRef={heroRef} heroTextRef={heroTextRef} />
      <AboutSection aboutRef={aboutRef} />
      <SkillsSection skillsRef={skillsRef} />
      <ProjectsSection projectsRef={projectsRef} projectsTrackRef={projectsTrackRef} />
      <ExperienceSection experienceRef={experienceRef} />
      <ContactSection contactRef={contactRef} />
      <SiteFooter />
    </>
  );
}
