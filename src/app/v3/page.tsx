"use client";

import { useEffect, useRef } from "react";

// ─── Type augmentation for CDN globals ───────────────────────────────────────
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    THREE: any;
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "React / Next.js", level: 97, color: "#00d4ff" },
  { name: "TypeScript", level: 93, color: "#00d4ff" },
  { name: "Three.js / WebGL", level: 88, color: "#f59e0b" },
  { name: "Node.js / API Design", level: 91, color: "#00d4ff" },
  { name: "GSAP / Motion Design", level: 95, color: "#f59e0b" },
  { name: "UI/UX & Design Systems", level: 89, color: "#00d4ff" },
  { name: "AWS / DevOps", level: 82, color: "#f59e0b" },
  { name: "GraphQL", level: 86, color: "#00d4ff" },
];

const PROJECTS = [
  {
    title: "Luminary OS",
    tag: "SaaS Platform",
    desc: "AI-powered creative workspace with real-time collaboration and generative design tools.",
    color: "#00d4ff",
    year: "2024",
  },
  {
    title: "Vortex Finance",
    tag: "Fintech",
    desc: "High-frequency trading dashboard with live 3D data visualization and predictive analytics.",
    color: "#f59e0b",
    year: "2024",
  },
  {
    title: "Phantom XR",
    tag: "WebXR Experience",
    desc: "Immersive extended-reality brand experience for a global luxury automotive client.",
    color: "#a78bfa",
    year: "2023",
  },
  {
    title: "Nexus Protocol",
    tag: "Web3 / DeFi",
    desc: "Decentralized exchange interface with cinematic onboarding and gamified reward flows.",
    color: "#34d399",
    year: "2023",
  },
  {
    title: "Aurora CMS",
    tag: "Developer Tool",
    desc: "Headless CMS with a fully keyboard-driven interface and live collaborative editing.",
    color: "#f472b6",
    year: "2022",
  },
];

const EXPERIENCE = [
  {
    role: "Lead Creative Engineer",
    company: "Prism Interactive",
    period: "2022 – Present",
    desc: "Architected award-winning web experiences for Fortune 500 clients. Led a team of 8 engineers. Delivered 40+ production projects.",
  },
  {
    role: "Senior Frontend Engineer",
    company: "Neon Labs",
    period: "2020 – 2022",
    desc: "Spearheaded the migration to Next.js, reducing TTI by 62%. Built the company's internal design system from scratch.",
  },
  {
    role: "Creative Developer",
    company: "Studio Meridian",
    period: "2018 – 2020",
    desc: "Designed and coded interactive digital campaigns. Won 3 Awwwards Site of the Day recognitions.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load CDN scripts sequentially
    const loadScript = (src: string) =>
      new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej();
        document.head.appendChild(s);
      });

    (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js");
      init();
    })();

    function init() {
      const { gsap, ScrollTrigger, THREE } = window;
      gsap.registerPlugin(ScrollTrigger);

      // ── Scroll progress bar ──────────────────────────────────────────────
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0 },
      });

      // ── Custom cursor ────────────────────────────────────────────────────
      const cursor = cursorRef.current!;
      const dot = cursorDotRef.current!;
      let mx = -100, my = -100;
      window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        gsap.to(dot, { x: mx - 4, y: my - 4, duration: 0.05 });
        gsap.to(cursor, { x: mx - 20, y: my - 20, duration: 0.18 });
      });
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 2, opacity: 0.6, duration: 0.2 }));
        el.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 }));
      });

      // ── THREE.JS Hero Particle Field ─────────────────────────────────────
      const container = canvasRef.current!;
      const W = container.clientWidth, H = container.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 80;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Particles
      const COUNT = 3500;
      const positions = new Float32Array(COUNT * 3);
      const velocities: number[] = [];
      const originalPos = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 20 + Math.random() * 55;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        originalPos[i * 3] = positions[i * 3];
        originalPos[i * 3 + 1] = positions[i * 3 + 1];
        originalPos[i * 3 + 2] = positions[i * 3 + 2];
        velocities.push((Math.random() - 0.5) * 0.02);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x00d4ff, size: 0.35, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const particles = new THREE.Points(geo, mat);
      scene.add(particles);

      // Inner glow sphere
      const sphereGeo = new THREE.SphereGeometry(10, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff, transparent: true, opacity: 0.04, wireframe: false,
      });
      const glowSphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(glowSphere);

      // Mouse interaction
      let mouseX = 0, mouseY = 0;
      window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
      });

      // Scroll collapse animation
      const scrollObj = { progress: 0 };
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self: any) => {
          scrollObj.progress = self.progress;
          const p = self.progress;
          const pos = geo.attributes.position.array as Float32Array;
          for (let i = 0; i < COUNT; i++) {
            pos[i * 3] = originalPos[i * 3] * (1 - p * 0.85);
            pos[i * 3 + 1] = originalPos[i * 3 + 1] * (1 - p * 0.85);
            pos[i * 3 + 2] = originalPos[i * 3 + 2] * (1 - p * 0.85);
          }
          geo.attributes.position.needsUpdate = true;
          mat.opacity = 0.8 - p * 0.6;
          camera.position.z = 80 + p * 30;
        },
      });

      // Resize
      window.addEventListener("resize", () => {
        const nw = container.clientWidth, nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      });

      // Animate loop
      let frame = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        frame++;
        particles.rotation.y += 0.0008 + mouseX * 0.002;
        particles.rotation.x += 0.0003 + mouseY * 0.001;
        glowSphere.rotation.y += 0.004;
        renderer.render(scene, camera);
      };
      animate();

      // ── HERO section ─────────────────────────────────────────────────────
      const heroTl = gsap.timeline({
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.2, pin: false },
      });
      heroTl
        .to("#hero-eyebrow", { y: -60, opacity: 0, ease: "power2.in" }, 0)
        .to("#hero-title", { y: -80, opacity: 0, scale: 0.95, ease: "power2.in" }, 0.05)
        .to("#hero-sub", { y: -40, opacity: 0, ease: "power2.in" }, 0.1)
        .to("#hero-cta", { y: -30, opacity: 0, ease: "power2.in" }, 0.12)
        .to("#hero-scroll-hint", { opacity: 0 }, 0);

      // Hero entrance
      gsap.fromTo(
        "#hero-eyebrow",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        "#hero-title .char",
        { y: 120, opacity: 0, rotateX: -80 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.0, ease: "power3.out", stagger: 0.04, delay: 0.5 }
      );
      gsap.fromTo(
        "#hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 1.1 }
      );
      gsap.fromTo(
        "#hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.35 }
      );
      gsap.fromTo(
        "#hero-scroll-hint",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.0 }
      );
      // Scroll hint bounce
      gsap.to("#hero-scroll-hint", {
        y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: "sine.inOut", delay: 2.5,
      });

      // ── ABOUT section ────────────────────────────────────────────────────
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about", start: "top 80%", end: "top 20%", scrub: 0.8,
        },
      });
      aboutTl
        .fromTo("#about-img", { x: -80, opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, ease: "power3.out" })
        .fromTo("#about-text-block", { x: 80, opacity: 0 }, { x: 0, opacity: 1, ease: "power3.out" }, "<0.1")
        .fromTo("#about-stats .stat-item", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, ease: "power3.out" }, "<0.2");

      // About leave
      gsap.to("#about-img", {
        y: -60, opacity: 0, scale: 1.05,
        scrollTrigger: { trigger: "#about", start: "bottom 60%", end: "bottom top", scrub: 0.8 },
      });

      // ── SKILLS section ───────────────────────────────────────────────────
      gsap.fromTo(
        "#skills-header",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: "#skills", start: "top 75%", toggleActions: "play none none reverse" },
        }
      );
      (gsap.utils.toArray(".skill-bar-fill") as HTMLElement[]).forEach((bar, i) => {
        const target = bar.dataset.level || "0";
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: parseFloat(target) / 100,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: "#skills", start: "top 65%", toggleActions: "play none none reverse" },
            delay: i * 0.08,
          }
        );
      });
      gsap.fromTo(
        ".skill-row",
        { x: (i: number) => (i % 2 === 0 ? -60 : 60), opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.09, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#skills", start: "top 70%", toggleActions: "play none none reverse" },
        }
      );

      // ── PROJECTS – Horizontal scroll ─────────────────────────────────────
      const projectsTrack = document.querySelector<HTMLElement>("#projects-track");
      if (projectsTrack) {
        const totalScroll = projectsTrack.scrollWidth - projectsTrack.clientWidth;
        gsap.to(projectsTrack, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: "#projects-pin",
            start: "top top",
            end: () => `+=${totalScroll + window.innerWidth * 0.5}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
      // Project cards entrance stagger on horizontal
      gsap.fromTo(
        ".project-card",
        { y: 60, opacity: 0, rotateY: 15 },
        {
          y: 0, opacity: 1, rotateY: 0, stagger: 0.15, duration: 1.0, ease: "power3.out",
          scrollTrigger: { trigger: "#projects-pin", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // ── EXPERIENCE section ───────────────────────────────────────────────
      gsap.fromTo(
        "#exp-header",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: "#experience", start: "top 75%", toggleActions: "play none none reverse" },
        }
      );
      (gsap.utils.toArray(".exp-item") as HTMLElement[]).forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: i % 2 === 0 ? -70 : 70, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      });
      // Timeline line draw
      gsap.fromTo(
        "#timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1, transformOrigin: "top center", duration: 1.5, ease: "power2.inOut",
          scrollTrigger: { trigger: "#experience", start: "top 65%", toggleActions: "play none none reverse" },
        }
      );

      // ── CONTACT section ──────────────────────────────────────────────────
      const ctTl = gsap.timeline({
        scrollTrigger: { trigger: "#contact", start: "top 70%", toggleActions: "play none none reverse" },
      });
      ctTl
        .fromTo("#contact-glow", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" })
        .fromTo("#contact-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .fromTo("#contact-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .fromTo(".contact-link", { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .fromTo("#contact-form-wrap", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");

      // Floating orbs parallax
      (gsap.utils.toArray(".orb") as HTMLElement[]).forEach((orb, i) => {
        gsap.to(orb, {
          y: `${(i % 2 === 0 ? -1 : 1) * (80 + i * 30)}px`,
          ease: "none",
          scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 + i * 0.3 },
        });
      });

      // Section labels parallax
      (gsap.utils.toArray(".section-label-bg") as HTMLElement[]).forEach((el) => {
        gsap.to(el, {
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: el.closest("section"), scrub: 1.5 },
        });
      });
    }

    return () => {
      // cleanup
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:   #060608;
          --bg:      #09090f;
          --bg2:     #0e0e18;
          --bg3:     #111120;
          --cyan:    #00d4ff;
          --amber:   #f59e0b;
          --purple:  #a78bfa;
          --muted:   #6b7280;
          --text:    #e2e8f0;
          --border:  rgba(255,255,255,0.06);
        }

        html { scroll-behavior: auto; }

        body {
          background: var(--black);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }

        ::selection { background: rgba(0,212,255,0.25); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }

        /* Hero title chars */
        .char { display: inline-block; perspective: 600px; }

        /* Noise overlay */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        /* Glass card */
        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
        }

        /* Glow text */
        .glow-cyan { text-shadow: 0 0 30px rgba(0,212,255,0.5); }
        .glow-amber { text-shadow: 0 0 30px rgba(245,158,11,0.5); }

        /* Section base */
        section { position: relative; }

        /* Tag badge */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid rgba(0,212,255,0.3);
          color: var(--cyan); background: rgba(0,212,255,0.07);
        }

        /* Scroll progress */
        #scroll-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--amber));
          transform-origin: left center; transform: scaleX(0);
          z-index: 1000;
        }

        /* Cursor */
        #cursor-ring {
          position: fixed; width: 40px; height: 40px;
          border: 1.5px solid rgba(0,212,255,0.6); border-radius: 50%;
          pointer-events: none; z-index: 9999; mix-blend-mode: difference;
          transition: background 0.2s;
        }
        #cursor-dot {
          position: fixed; width: 8px; height: 8px;
          background: var(--cyan); border-radius: 50%;
          pointer-events: none; z-index: 9999;
        }

        /* Nav */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          padding: 20px 48px;
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(to bottom, rgba(6,6,8,0.8), transparent);
          backdrop-filter: blur(6px);
        }

        .nav-logo {
          font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--cyan), var(--amber));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .nav-links { display: flex; gap: 36px; }
        .nav-links a {
          font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); text-decoration: none;
          font-family: 'DM Mono', monospace;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--cyan); }

        /* Hero */
        #hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative;
        }

        #hero-canvas {
          position: absolute; inset: 0; z-index: 0;
        }

        .hero-content {
          position: relative; z-index: 2; text-align: center;
          max-width: 900px; padding: 0 24px;
        }

        #hero-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 12px;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--cyan); margin-bottom: 28px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        #hero-eyebrow::before, #hero-eyebrow::after {
          content: ''; display: block; width: 40px; height: 1px; background: var(--cyan); opacity: 0.4;
        }

        #hero-title {
          font-size: clamp(52px, 9vw, 120px); font-weight: 800; line-height: 0.9;
          letter-spacing: -0.03em; margin-bottom: 32px;
          perspective: 800px;
        }

        .hero-title-row { overflow: hidden; display: block; }

        .hero-gradient-text {
          background: linear-gradient(135deg, #fff 30%, var(--cyan) 70%, var(--amber) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        #hero-sub {
          font-size: 18px; color: rgba(255,255,255,0.45); max-width: 560px; margin: 0 auto 48px;
          font-weight: 400; line-height: 1.7; font-family: 'DM Mono', monospace; font-size: 14px;
        }

        #hero-cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        .btn-primary {
          padding: 14px 36px; border-radius: 4px;
          background: var(--cyan); color: var(--black);
          font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          border: none; cursor: none; text-decoration: none;
          transition: box-shadow 0.3s, transform 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { box-shadow: 0 0 40px rgba(0,212,255,0.5); transform: translateY(-2px); }

        .btn-outline {
          padding: 14px 36px; border-radius: 4px;
          background: transparent; color: var(--text);
          font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.15); cursor: none; text-decoration: none;
          transition: border-color 0.3s, color 0.3s;
          display: inline-flex; align-items: center;
        }
        .btn-outline:hover { border-color: var(--cyan); color: var(--cyan); }

        #hero-scroll-hint {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
        }
        .scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, var(--cyan), transparent);
        }

        /* Floating orbs */
        .orb {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          filter: blur(80px);
        }

        /* Section shared */
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .section-label-bg {
          position: absolute; top: 20px; right: 48px;
          font-size: 110px; font-weight: 800; letter-spacing: -0.05em;
          color: rgba(255,255,255,0.02); pointer-events: none; user-select: none;
          white-space: nowrap;
        }

        /* About */
        #about { padding: 140px 0; background: var(--bg); }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        
        #about-img {
          position: relative;
          aspect-ratio: 3/4; border-radius: 8px; overflow: hidden;
          background: var(--bg3);
          border: 1px solid var(--border);
        }
        .about-img-inner {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--bg3) 0%, #1a1a2e 50%, var(--bg3) 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .about-img-placeholder {
          font-size: 72px; opacity: 0.2;
        }
        #about-img::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent, rgba(0,212,255,0.06));
          pointer-events: none;
        }
        .about-img-accent {
          position: absolute; bottom: -1px; left: -1px; right: -1px; height: 2px;
          background: linear-gradient(90deg, var(--cyan), transparent);
        }

        .about-eyebrow { margin-bottom: 20px; }
        .about-title { font-size: clamp(32px, 4vw, 52px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 24px; }
        .about-body { color: rgba(255,255,255,0.5); font-size: 16px; line-height: 1.8; margin-bottom: 40px; font-weight: 400; }

        #about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
        .stat-item { padding: 20px; border-radius: 6px; }
        .stat-num { font-size: 36px; font-weight: 800; color: var(--cyan); letter-spacing: -0.03em; line-height: 1; }
        .stat-label { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 6px; }

        /* Skills */
        #skills { padding: 140px 0; background: var(--black); }
        #skills-header { text-align: center; margin-bottom: 80px; }
        .section-title { font-size: clamp(36px, 5vw, 64px); font-weight: 800; letter-spacing: -0.03em; }
        .section-sub { color: var(--muted); font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.1em; margin-top: 16px; }
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .skill-row {
          padding: 20px 24px; border-radius: 6px; background: var(--bg);
          border: 1px solid var(--border);
        }
        .skill-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .skill-name { font-size: 15px; font-weight: 600; }
        .skill-pct { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); }
        .skill-bar-bg { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .skill-bar-fill { height: 100%; border-radius: 2px; transform-origin: left center; transform: scaleX(0); }

        /* Projects */
        #projects-pin { height: auto; overflow: hidden; background: var(--bg2); }
        .projects-pin-inner { padding-top: 80px; }
        #projects-header { max-width: 1200px; margin: 0 auto; padding: 0 48px 60px; }
        #projects-viewport { overflow: hidden; }
        #projects-track { display: flex; gap: 28px; padding: 0 48px 100px; width: max-content; }

        .project-card {
          width: 380px; flex-shrink: 0; border-radius: 12px; overflow: hidden;
          background: var(--bg3); border: 1px solid var(--border);
          transition: border-color 0.4s, transform 0.4s;
          position: relative;
        }
        .project-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-8px) !important; }
        .project-card:hover .project-overlay { opacity: 1; }
        .project-card:hover .project-img-el { transform: scale(1.06); }

        .project-img { aspect-ratio: 16/10; overflow: hidden; position: relative; background: var(--black); }
        .project-img-el {
          width: 100%; height: 100%; transition: transform 0.6s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .project-placeholder {
          width: 100%; height: 100%; position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .project-grid-lines {
          position: absolute; inset: 0; opacity: 0.07;
          background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 40px),
                            repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 40px);
        }
        .project-num {
          position: absolute; top: 20px; right: 20px;
          font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.2);
          letter-spacing: 0.15em;
        }
        .project-icon {
          font-size: 48px; opacity: 0.15;
        }

        .project-overlay {
          position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,212,255,0.12));
          pointer-events: none;
        }

        .project-body { padding: 24px 28px 28px; }
        .project-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
        .project-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; }
        .project-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.65; margin-bottom: 24px; }
        .project-footer { display: flex; justify-content: space-between; align-items: center; }
        .project-year { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
        .project-arrow {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; transition: all 0.3s; cursor: none;
          color: rgba(255,255,255,0.5);
        }
        .project-card:hover .project-arrow {
          border-color: var(--cyan); color: var(--cyan);
          background: rgba(0,212,255,0.08);
        }
        .accent-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          opacity: 0; transition: opacity 0.4s;
        }
        .project-card:hover .accent-line { opacity: 1; }

        /* Experience */
        #experience { padding: 140px 0; background: var(--bg); }
        .exp-grid { display: grid; grid-template-columns: 60px 1fr; gap: 0; max-width: 700px; }

        #timeline-line {
          grid-column: 1; grid-row: 1 / -1;
          width: 1px; background: linear-gradient(to bottom, var(--cyan), rgba(0,212,255,0.1));
          margin-left: 20px; transform-origin: top;
        }

        .exp-item { display: contents; }
        .exp-dot-wrap { display: flex; justify-content: center; align-items: flex-start; padding-top: 8px; }
        .exp-dot {
          width: 10px; height: 10px; border-radius: 50%; background: var(--cyan);
          box-shadow: 0 0 12px rgba(0,212,255,0.6); flex-shrink: 0;
        }
        .exp-content { padding: 0 0 60px 32px; }
        .exp-period { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 8px; }
        .exp-role { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
        .exp-company { font-size: 14px; color: var(--cyan); margin: 4px 0 12px; font-family: 'DM Mono', monospace; }
        .exp-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; }

        /* Contact */
        #contact { padding: 140px 0 80px; background: var(--black); overflow: hidden; }
        .contact-inner { text-align: center; position: relative; }

        #contact-glow {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
        }

        #contact-title { font-size: clamp(40px, 7vw, 88px); font-weight: 800; letter-spacing: -0.03em; line-height: 0.95; margin-bottom: 24px; }
        #contact-sub { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--muted); letter-spacing: 0.08em; margin-bottom: 60px; }

        .contact-links { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 80px; }
        .contact-link {
          display: flex; align-items: center; gap: 10px; padding: 14px 28px;
          border-radius: 6px; border: 1px solid var(--border);
          font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); text-decoration: none; background: var(--bg);
          transition: all 0.3s;
        }
        .contact-link:hover { border-color: var(--cyan); color: var(--cyan); background: rgba(0,212,255,0.05); }

        #contact-form-wrap { max-width: 600px; margin: 0 auto; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-input, .form-textarea {
          width: 100%; padding: 14px 18px; border-radius: 6px;
          background: var(--bg); border: 1px solid var(--border);
          color: var(--text); font-family: 'Syne', sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.3s;
        }
        .form-input:focus, .form-textarea:focus { border-color: rgba(0,212,255,0.4); }
        .form-input::placeholder, .form-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .form-textarea { resize: none; height: 120px; margin-bottom: 16px; }

        .form-submit {
          width: 100%; padding: 16px; border-radius: 6px;
          background: linear-gradient(135deg, var(--cyan), #0099bb);
          color: var(--black); font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: none;
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .form-submit:hover { box-shadow: 0 0 40px rgba(0,212,255,0.4); transform: translateY(-2px); }

        /* Footer */
        footer {
          padding: 40px 48px; border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          background: var(--black);
        }
        .footer-logo { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: rgba(255,255,255,0.3); }
        .footer-copy { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }

        /* Responsive */
        @media (max-width: 768px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .section-inner { padding: 0 24px; }
          .about-grid { grid-template-columns: 1fr; gap: 48px; }
          .skills-grid { grid-template-columns: 1fr; }
          #projects-track { padding: 0 24px 80px; }
          .project-card { width: 320px; }
          .form-row { grid-template-columns: 1fr; }
          footer { flex-direction: column; gap: 16px; text-align: center; }
          #projects-header { padding: 0 24px 48px; }
        }
      `}</style>

      {/* Scroll progress */}
      <div id="scroll-progress" ref={progressRef} />

      {/* Custom cursor */}
      <div id="cursor-ring" ref={cursorRef} />
      <div id="cursor-dot" ref={cursorDotRef} />

      {/* Floating orbs */}
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(0,212,255,0.04)", top: "10%", left: "5%", position: "fixed" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "rgba(245,158,11,0.04)", top: "50%", right: "5%", position: "fixed" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "rgba(167,139,250,0.03)", top: "80%", left: "20%", position: "fixed" }} />

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">AK.</div>
        <div className="nav-links">
          {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} data-hover>{item}</a>
          ))}
        </div>
        <a href="#contact" className="btn-primary" style={{ padding: "10px 22px", fontSize: "11px" }} data-hover>
          Hire Me
        </a>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div id="hero-canvas" ref={canvasRef} />
        <div className="hero-content">
          <div id="hero-eyebrow">Creative Engineer &amp; Interactive Developer</div>
          <h1 id="hero-title">
            <span className="hero-title-row">
              {"ALEX".split("").map((c, i) => (
                <span key={i} className="char">{c}</span>
              ))}
            </span>
            <span className="hero-title-row hero-gradient-text">
              {"KING".split("").map((c, i) => (
                <span key={i} className="char">{c}</span>
              ))}
            </span>
          </h1>
          <p id="hero-sub">
            Crafting immersive digital experiences at the intersection of engineering and art. 
            5+ years building the web's most ambitious interfaces.
          </p>
          <div id="hero-cta">
            <a href="#projects" className="btn-primary" data-hover>
              View Work <span>↓</span>
            </a>
            <a href="#contact" className="btn-outline" data-hover>Get in Touch</a>
          </div>
        </div>
        <div id="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <span className="section-label-bg">ABOUT</span>
        <div className="section-inner">
          <div className="about-grid">
            <div id="about-img">
              <div className="about-img-inner">
                <div className="about-img-placeholder">👤</div>
              </div>
              <div className="about-img-accent" />
              {/* Corner accent */}
              <div style={{ position: "absolute", top: 20, left: 20, width: 32, height: 32, borderTop: "2px solid rgba(0,212,255,0.4)", borderLeft: "2px solid rgba(0,212,255,0.4)" }} />
              <div style={{ position: "absolute", bottom: 24, right: 20, width: 32, height: 32, borderBottom: "2px solid rgba(245,158,11,0.4)", borderRight: "2px solid rgba(245,158,11,0.4)" }} />
            </div>

            <div id="about-text-block">
              <div className="about-eyebrow">
                <span className="badge">About Me</span>
              </div>
              <h2 className="about-title">
                I build things that<br />
                <span style={{ color: "var(--cyan)" }}>feel alive.</span>
              </h2>
              <p className="about-body">
                I'm a creative developer based in New York with a passion for building 
                visually stunning and technically complex digital experiences. I believe 
                the web is the most expressive medium ever created — and I push it to its limits.
              </p>
              <p className="about-body" style={{ marginBottom: 0 }}>
                From WebGL shaders to micro-interaction systems, from design systems to 
                real-time 3D applications — I work where design and engineering intersect.
              </p>

              <div id="about-stats">
                {[
                  { num: "5+", label: "Years Exp." },
                  { num: "60+", label: "Projects" },
                  { num: "3×", label: "Awwwards" },
                ].map((s) => (
                  <div key={s.label} className="stat-item glass">
                    <div className="stat-num glow-cyan">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills">
        <span className="section-label-bg">SKILLS</span>
        <div className="section-inner">
          <div id="skills-header">
            <span className="badge">Expertise</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>
              Technical <span style={{ color: "var(--cyan)" }}>Arsenal</span>
            </h2>
            <p className="section-sub">The tools I wield daily</p>
          </div>
          <div className="skills-grid">
            {SKILLS.map((skill) => (
              <div key={skill.name} className="skill-row glass">
                <div className="skill-head">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-pct">{skill.level}%</span>
                </div>
                <div className="skill-bar-bg">
                  <div
                    className="skill-bar-fill"
                    data-level={skill.level}
                    style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS (horizontal scroll) ── */}
      <section id="projects-pin">
        <div className="projects-pin-inner">
          <div id="projects-header">
            <span className="badge">Selected Work</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>
              Featured <span style={{ color: "var(--amber)" }}>Projects</span>
            </h2>
            <p className="section-sub" style={{ color: "var(--muted)" }}>Scroll to explore →</p>
          </div>
          <div id="projects-viewport">
            <div id="projects-track">
              {PROJECTS.map((p, i) => (
                <div key={p.title} className="project-card" data-hover>
                  <div className="project-img">
                    <div className="project-img-el">
                      <div className="project-placeholder">
                        <div className="project-grid-lines" />
                        <div className="project-icon">{["🌐", "📈", "🕶️", "⛓️", "✏️"][i]}</div>
                      </div>
                    </div>
                    <div className="project-overlay" />
                    <div className="project-num">0{i + 1}</div>
                    {/* Glow bar at bottom of image */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
                      background: `linear-gradient(to top, ${p.color}22, transparent)`,
                    }} />
                  </div>

                  <div className="project-body">
                    <div className="project-tag">{p.tag}</div>
                    <div className="project-title">{p.title}</div>
                    <div className="project-desc">{p.desc}</div>
                    <div className="project-footer">
                      <span className="project-year">{p.year}</span>
                      <div className="project-arrow">→</div>
                    </div>
                  </div>

                  <div
                    className="accent-line"
                    style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
                  />
                </div>
              ))}

              {/* CTA card */}
              <div style={{
                width: 280, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 32px",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>✦</div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 24 }}>
                    MORE COMING SOON
                  </p>
                  <a href="#contact" className="btn-outline" data-hover style={{ fontSize: "11px", padding: "12px 24px" }}>
                    Collaborate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience">
        <span className="section-label-bg">WORK</span>
        <div className="section-inner">
          <div style={{ marginBottom: 80 }}>
            <span className="badge" id="exp-header">Experience</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>
              Career <span style={{ color: "var(--cyan)" }}>Journey</span>
            </h2>
          </div>

          <div className="exp-grid">
            <div id="timeline-line" />
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="exp-item">
                <div className="exp-dot-wrap">
                  <div className="exp-dot" />
                </div>
                <div className="exp-content">
                  <div className="exp-period">{exp.period}</div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                  <div className="exp-desc">{exp.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="section-inner">
          <div className="contact-inner">
            <div id="contact-glow" />
            <span className="badge" style={{ marginBottom: 32, display: "inline-flex" }}>Let's Connect</span>
            <h2 id="contact-title">
              Let's Build<br />
              <span className="hero-gradient-text">Something Great</span>
            </h2>
            <p id="contact-sub">Available for freelance &amp; full-time opportunities</p>

            <div className="contact-links">
              {[
                { icon: "✉", label: "hello@alexking.dev" },
                { icon: "⌨", label: "GitHub" },
                { icon: "💼", label: "LinkedIn" },
                { icon: "🐦", label: "Twitter" },
              ].map((link) => (
                <a key={link.label} href="#" className="contact-link" data-hover>
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <div id="contact-form-wrap">
              <div className="form-row">
                <input className="form-input" type="text" placeholder="Your Name" />
                <input className="form-input" type="email" placeholder="Email Address" />
              </div>
              <textarea className="form-textarea" placeholder="Tell me about your project..." />
              <button className="form-submit" data-hover>Send Message →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">AK.</div>
        <div className="footer-copy">© 2025 Alex King. Crafted with obsession.</div>
        <a href="#hero" className="btn-outline" style={{ fontSize: "11px", padding: "10px 20px" }} data-hover>↑ Top</a>
      </footer>
    </>
  );
}