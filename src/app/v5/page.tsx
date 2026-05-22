"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
//  TYPE DECLARATIONS  (avoids TS errors in single file)
// ─────────────────────────────────────────────
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    THREE: any;
  }
}

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
const SKILLS = [
  { label: "React / Next.js", pct: 97 },
  { label: "TypeScript", pct: 94 },
  { label: "Three.js / WebGL", pct: 88 },
  { label: "GSAP / Motion", pct: 92 },
  { label: "Node.js / APIs", pct: 85 },
  { label: "UI/UX Design", pct: 90 },
  { label: "CSS / Tailwind", pct: 96 },
  { label: "Rust / WASM", pct: 72 },
];

const PROJECTS = [
  {
    title: "Nebula OS",
    tag: "UI / Design System",
    year: "2024",
    desc: "Award-winning operating system interface with adaptive AI panels and fluid spatial navigation.",
    color: "#9333ea",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    title: "Lumina AR",
    tag: "WebXR / Three.js",
    year: "2024",
    desc: "Browser-native augmented reality experience serving 2M+ monthly active users in 40 countries.",
    color: "#7c3aed",
    img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80",
  },
  {
    title: "Void Protocol",
    tag: "Creative Coding",
    year: "2023",
    desc: "Generative art engine powering real-time visual installations at festivals across Europe.",
    color: "#6d28d9",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  },
  {
    title: "Helix Finance",
    tag: "FinTech / Dashboard",
    year: "2023",
    desc: "Real-time trading interface processing 500k events/sec with sub-16ms render budgets.",
    color: "#5b21b6",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    title: "Echo Studio",
    tag: "Audio / Visualizer",
    year: "2023",
    desc: "Spatial audio workstation with WebAudio API and generative 3-D waveform visualisations.",
    color: "#4c1d95",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  },
];

const EXPERIENCES = [
  {
    role: "Lead Creative Engineer",
    company: "Axiom Labs",
    period: "2022 – Present",
    desc: "Architecting immersive web experiences for Fortune 500 brands. Led a 12-person team shipping 40+ interactive campaigns.",
  },
  {
    role: "Senior Frontend Engineer",
    company: "Vercel",
    period: "2020 – 2022",
    desc: "Core contributor to Edge Runtime and the preview deployment pipeline. Reduced cold-start latency by 60%.",
  },
  {
    role: "Creative Technologist",
    company: "Active Theory",
    period: "2018 – 2020",
    desc: "Built award-winning WebGL experiences for Google, Nike, and Spotify. 3× FWA Site of the Day.",
  },
  {
    role: "Frontend Engineer",
    company: "Figma",
    period: "2016 – 2018",
    desc: "Worked on the canvas renderer and plugin API surface. Shipped the first public version of Auto Layout.",
  },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [activeNav, setActiveNav] = useState("hero");

  const canvasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsTrackRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // ── Load external scripts ──
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    ];

    let loaded = 0;
    scripts.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        loaded++;
        if (loaded === scripts.length) setLoaded(true);
      };
      document.head.appendChild(s);
    });
  }, []);

  // ── Custom cursor ──
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ── Three.js hero scene ──
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    const THREE = window.THREE;
    const container = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Torus knot – main 3-D object
    const torusGeo = new THREE.TorusKnotGeometry(8, 2.5, 200, 32);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd8b4fe,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wire = new THREE.Mesh(torusGeo, wireMat);
    scene.add(wire);

    // Floating particles
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 120;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.18,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lights
    const aLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(aLight);
    const pLight = new THREE.PointLight(0x9333ea, 4, 80);
    pLight.position.set(10, 10, 10);
    scene.add(pLight);
    const pLight2 = new THREE.PointLight(0xffffff, 2, 60);
    pLight2.position.set(-15, -10, 5);
    scene.add(pLight2);

    // Mouse interaction
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Scroll-linked rotation
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      torus.rotation.x = t * 0.18 + my * 0.4 + scrollY * 0.0008;
      torus.rotation.y = t * 0.22 + mx * 0.4 + scrollY * 0.0005;
      wire.rotation.copy(torus.rotation);
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;
      camera.position.x += (mx * 3 - camera.position.x) * 0.04;
      camera.position.y += (my * 2 - camera.position.y) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [loaded]);

  // ── GSAP Animations ──
  useEffect(() => {
    if (!loaded) return;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    // ── Scroll progress bar ──
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
      },
    });

    // ── Hero title stagger reveal ──
    const heroChars = heroTitleRef.current?.querySelectorAll(".char");
    if (heroChars) {
      gsap.fromTo(
        heroChars,
        { y: 120, opacity: 0, rotateX: -90, filter: "blur(20px)" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          stagger: 0.04,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.3,
        }
      );
    }

    // Hero parallax on scroll
    gsap.to(".hero-bg-layer", {
      yPercent: 40,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    gsap.to(".hero-three-canvas", {
      scale: 0.6,
      opacity: 0,
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "20% top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    gsap.to(".hero-content", {
      yPercent: -30,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "30% top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // ── About section ──
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1.2,
        toggleActions: "play reverse play reverse",
      },
    });
    aboutTl
      .fromTo(".about-tag", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4 })
      .fromTo(".about-h", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(".about-p", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(
        ".about-stat",
        { opacity: 0, scale: 0.7, y: 30 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.5 },
        "-=0.2"
      );

    // ── Skills bars ──
    ST.create({
      trigger: skillsRef.current,
      start: "top 70%",
      end: "bottom 30%",
      scrub: 1,
      onEnter: () => {
        gsap.fromTo(
          ".skill-bar-fill",
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.08, duration: 1.4, ease: "expo.out" }
        );
        gsap.fromTo(
          ".skill-row",
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, stagger: 0.07, duration: 0.8, ease: "power3.out" }
        );
      },
      onLeaveBack: () => {
        gsap.to(".skill-bar-fill", { scaleX: 0, stagger: 0.04, duration: 0.6 });
        gsap.to(".skill-row", { opacity: 0, x: -40, stagger: 0.04, duration: 0.4 });
      },
    });

    // ── Projects – HORIZONTAL SCROLL ──
    const track = projectsTrackRef.current;
    if (track) {
      const cards = track.querySelectorAll(".proj-card");
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top top",
          end: () => `+=${totalScroll * 1.4}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card entrance as they scroll into horizontal view
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { scale: 0.85, opacity: 0.3, rotateY: 15 },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            scrollTrigger: {
              trigger: projectsRef.current,
              start: () => `top+=${i * totalScroll * 0.22} top`,
              end: () => `top+=${i * totalScroll * 0.22 + 300} top`,
              scrub: 1,
              containerAnimation: gsap.to(track, {}), // links to horizontal
            },
          }
        );
      });
    }

    // ── Experience timeline ──
    const expItems = experienceRef.current?.querySelectorAll(".exp-item");
    expItems?.forEach((item, i) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: i % 2 === 0 ? -80 : 80,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.7,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    // ── Contact section ──
    gsap.fromTo(
      ".contact-inner",
      { opacity: 0, scale: 0.9, y: 60 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1.2,
          toggleActions: "play reverse play reverse",
        },
      }
    );

    // ── Nav active section tracker ──
    ["hero", "about", "skills", "projects", "experience", "contact"].forEach((id) => {
      ST.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveNav(id),
        onEnterBack: () => setActiveNav(id),
      });
    });

    return () => ST.getAll().forEach((t: any) => t.kill());
  }, [loaded]);

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles injected via style tag ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --purple-900: #1a0533;
          --purple-800: #2d0a57;
          --purple-700: #4c1d95;
          --purple-600: #6d28d9;
          --purple-500: #7c3aed;
          --purple-400: #9333ea;
          --purple-300: #a855f7;
          --purple-200: #c084fc;
          --purple-100: #e9d5ff;
          --white: #ffffff;
          --off-white: #f5f0ff;
          --dark-bg: #06000f;
          --card-bg: rgba(255,255,255,0.03);
        }

        html { scroll-behavior: smooth; overflow-x: hidden; }

        body {
          background: var(--dark-bg);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }

        ::selection { background: var(--purple-500); color: var(--white); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--dark-bg); }
        ::-webkit-scrollbar-thumb { background: var(--purple-500); border-radius: 4px; }

        h1, h2, h3, h4 { font-family: 'Syne', sans-serif; }

        .noise-overlay {
          position: fixed; inset: 0; z-index: 9998; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }

        .glow { text-shadow: 0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(147,51,234,0.4); }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .purple-glow-box {
          box-shadow: 0 0 40px rgba(147,51,234,0.25), 0 0 80px rgba(147,51,234,0.1), inset 0 0 30px rgba(147,51,234,0.05);
        }

        /* Cursor */
        .cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none;
          width: 36px; height: 36px; margin: -18px 0 0 -18px;
          border: 1.5px solid rgba(147,51,234,0.8);
          border-radius: 50%;
          transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          will-change: transform;
        }
        .cursor-ring.hovered {
          width: 60px; height: 60px; margin: -30px 0 0 -30px;
          background: rgba(147,51,234,0.15);
          border-color: var(--purple-300);
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none;
          width: 6px; height: 6px; margin: -3px 0 0 -3px;
          background: var(--purple-300);
          border-radius: 50%;
        }

        /* Nav */
        .nav-link { position: relative; color: rgba(255,255,255,0.5); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s; }
        .nav-link::after { content: ''; position: absolute; left: 0; bottom: -2px; height: 1px; width: 0; background: var(--purple-300); transition: width 0.3s ease; }
        .nav-link:hover, .nav-link.active { color: var(--white); }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }

        /* Section labels */
        .section-tag {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--purple-300);
        }
        .section-tag::before {
          content: ''; display: block; width: 24px; height: 1px; background: var(--purple-400);
        }

        /* Animated gradient text */
        .grad-text {
          background: linear-gradient(135deg, #fff 0%, #c084fc 40%, #7c3aed 70%, #c084fc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradShift 4s linear infinite;
        }
        @keyframes gradShift { to { background-position: 200% center; } }

        /* Floating orbs */
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px);
          pointer-events: none; animation: orbFloat 8s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Skill bar */
        .skill-bar-fill { transform-origin: left; }

        /* Proj card hover */
        .proj-card {
          flex-shrink: 0;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
        }
        .proj-card:hover .proj-img { transform: scale(1.06); }
        .proj-card:hover .proj-overlay { opacity: 1; }
        .proj-img { transition: transform 0.6s cubic-bezier(0.23,1,0.32,1); }
        .proj-overlay { opacity: 0; transition: opacity 0.4s ease; }

        /* Magnetic button */
        .btn-magnetic {
          position: relative; overflow: hidden;
          background: transparent; cursor: none;
          border: 1.5px solid var(--purple-400);
          color: var(--white);
          padding: 0.9rem 2.4rem;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: color 0.3s;
          border-radius: 2px;
        }
        .btn-magnetic::before {
          content: ''; position: absolute; inset: 0;
          background: var(--purple-600);
          transform: translateY(101%);
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .btn-magnetic:hover::before { transform: translateY(0); }
        .btn-magnetic span { position: relative; z-index: 1; }

        /* Divider */
        .div-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(147,51,234,0.4), transparent);
        }
      `}</style>

      {/* ── Noise overlay ── */}
      <div className="noise-overlay" />

      {/* ── Custom cursor ── */}
      <div
        ref={cursorRef}
        className={`cursor-ring ${cursorHover ? "hovered" : ""}`}
        style={{ transform: `translate(${cursorPos.x}px,${cursorPos.y}px)` }}
      />
      <div
        ref={cursorDotRef}
        className="cursor-dot"
        style={{ transform: `translate(${cursorPos.x}px,${cursorPos.y}px)` }}
      />

      {/* ── Scroll progress ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.06)",
          zIndex: 9997,
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#7c3aed,#c084fc)",
            transformOrigin: "left",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9996,
          padding: "1rem 2.5rem",
          marginTop: "1rem",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "Syne",
            fontWeight: 800,
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg,#c084fc,#7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginRight: "1rem",
          }}
        >
          AX
        </span>
        {["about", "skills", "projects", "experience", "contact"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-link ${activeNav === id ? "active" : ""}`}
            onMouseEnter={() => setCursorHover(true)}
            onMouseLeave={() => setCursorHover(false)}
          >
            {id}
          </a>
        ))}
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div
          className="orb hero-bg-layer"
          style={{
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle,rgba(124,58,237,0.35) 0%,transparent 70%)",
            top: "10%",
            left: "20%",
            animationDelay: "0s",
          }}
        />
        <div
          className="orb hero-bg-layer"
          style={{
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)",
            bottom: "15%",
            right: "10%",
            animationDelay: "-3s",
          }}
        />

        {/* Three.js canvas */}
        <div
          ref={canvasRef}
          className="hero-three-canvas"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 2rem",
          }}
        >
          <div className="section-tag" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            Available for work · 2025
          </div>

          <div
            ref={heroTitleRef}
            style={{
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              fontFamily: "Syne",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              perspective: "1000px",
              overflow: "hidden",
            }}
          >
            {"ALEX\nXYANG".split("").map((ch, i) => (
              <span
                key={i}
                className={`char grad-text`}
                style={{ display: "inline-block", whiteSpace: ch === "\n" ? "none" : undefined }}
              >
                {ch === "\n" ? <br /> : ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Creative engineer & interaction designer crafting{" "}
            <em style={{ color: "var(--purple-200)", fontStyle: "normal" }}>immersive digital experiences</em>{" "}
            at the edge of web technology.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a
              href="#projects"
              className="btn-magnetic"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
            >
              <span>View Work</span>
            </a>
            <a
              href="#contact"
              className="btn-magnetic"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <span>Contact Me</span>
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Scroll
          <div
            style={{
              width: "1px",
              height: "48px",
              background: "linear-gradient(to bottom,rgba(147,51,234,0.8),transparent)",
              animation: "orbFloat 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section
        id="about"
        ref={aboutRef}
        style={{
          position: "relative",
          padding: "10rem 6vw",
          maxWidth: "1400px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          className="orb"
          style={{
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle,rgba(76,29,149,0.3) 0%,transparent 70%)",
            top: "-20%",
            right: "-10%",
            animationDelay: "-2s",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <div className="about-tag section-tag" style={{ marginBottom: "1.5rem" }}>
              About Me
            </div>
            <h2
              className="about-h glow"
              style={{
                fontSize: "clamp(2.5rem,5vw,4.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
              }}
            >
              Building the
              <br />
              <span className="grad-text">future of the</span>
              <br />
              open web.
            </h2>
            <p
              className="about-p"
              style={{
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.8,
                fontSize: "1.05rem",
                fontWeight: 300,
                maxWidth: "480px",
              }}
            >
              I'm a London-based creative engineer with 10 years crafting award-winning digital
              experiences. My work lives at the intersection of engineering precision and design
              artistry — combining WebGL, motion, and systems thinking to build products people
              remember.
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            {[
              { n: "10+", label: "Years of\nExperience" },
              { n: "120+", label: "Projects\nDelivered" },
              { n: "3×", label: "FWA\nAward Winner" },
              { n: "2M+", label: "Monthly\nActive Users" },
            ].map((s, i) => (
              <div
                key={i}
                className="about-stat glass purple-glow-box"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                style={{
                  padding: "2rem",
                  borderRadius: "2px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg,var(--purple-600),var(--purple-300))",
                  }}
                />
                <div
                  style={{
                    fontSize: "clamp(2rem,3vw,2.8rem)",
                    fontFamily: "Syne",
                    fontWeight: 800,
                    background: "linear-gradient(135deg,#fff,var(--purple-300))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="div-line" style={{ margin: "0 6vw" }} />

      {/* ══════════════════════════════════════
          SKILLS
      ══════════════════════════════════════ */}
      <section
        id="skills"
        ref={skillsRef}
        style={{ padding: "10rem 6vw", maxWidth: "1400px", margin: "0 auto" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "6rem", alignItems: "start" }}>
          <div>
            <div className="section-tag" style={{ marginBottom: "1.5rem" }}>
              Expertise
            </div>
            <h2
              style={{
                fontSize: "clamp(2.5rem,4vw,3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
              }}
            >
              Mastery across{" "}
              <span className="grad-text">the full stack.</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              From GPU-accelerated WebGL shaders to accessible, semantic HTML — I work across the
              entire spectrum of frontend engineering with a focus on performance and craft.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {SKILLS.map((sk, i) => (
              <div key={i} className="skill-row" style={{ opacity: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.6rem",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span>{sk.label}</span>
                  <span style={{ color: "var(--purple-300)" }}>{sk.pct}%</span>
                </div>
                <div
                  style={{
                    height: "2px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="skill-bar-fill"
                    style={{
                      height: "100%",
                      width: `${sk.pct}%`,
                      background: `linear-gradient(90deg,var(--purple-700),var(--purple-300))`,
                      borderRadius: "2px",
                      transformOrigin: "left",
                      transform: "scaleX(0)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="div-line" style={{ margin: "0 6vw" }} />

      {/* ══════════════════════════════════════
          PROJECTS – HORIZONTAL SCROLL
      ══════════════════════════════════════ */}
      <section id="projects" ref={projectsRef} style={{ overflow: "hidden" }}>
        {/* Section header inside pinned area */}
        <div
          style={{
            padding: "5rem 6vw 3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div className="section-tag" style={{ marginBottom: "1rem" }}>
              Selected Work
            </div>
            <h2
              style={{
                fontSize: "clamp(2.5rem,5vw,4rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Projects that{" "}
              <span className="grad-text">move the needle.</span>
            </h2>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              paddingBottom: "0.3rem",
            }}
          >
            Scroll →
          </p>
        </div>

        {/* Horizontal track */}
        <div
          ref={projectsTrackRef}
          style={{
            display: "flex",
            gap: "2rem",
            paddingLeft: "6vw",
            paddingRight: "6vw",
            paddingBottom: "5rem",
            width: "max-content",
          }}
        >
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="proj-card glass purple-glow-box"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              style={{
                width: "clamp(340px,28vw,460px)",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Image */}
              <div style={{ height: "280px", overflow: "hidden", position: "relative" }}>
                <img
                  src={p.img}
                  alt={p.title}
                  className="proj-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Overlay */}
                <div
                  className="proj-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg,${p.color}cc,${p.color}33)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      border: "1.5px solid rgba(255,255,255,0.6)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                    }}
                  >
                    ↗
                  </div>
                </div>

                {/* Top accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg,${p.color},transparent)`,
                  }}
                />
              </div>

              {/* Body */}
              <div style={{ padding: "1.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--purple-300)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                    {p.year}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "Syne",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="div-line" style={{ margin: "0 6vw" }} />

      {/* ══════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════ */}
      <section
        id="experience"
        ref={experienceRef}
        style={{ padding: "10rem 6vw", maxWidth: "1400px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "5rem" }}>
          <div className="section-tag" style={{ marginBottom: "1rem" }}>
            Experience
          </div>
          <h2
            style={{
              fontSize: "clamp(2.5rem,5vw,4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Where I've
            <br />
            <span className="grad-text">built things.</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {EXPERIENCES.map((e, i) => (
            <div
              key={i}
              className="exp-item glass"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr auto",
                gap: "2rem",
                alignItems: "start",
                padding: "2.5rem",
                borderRadius: 0,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                position: "relative",
                overflow: "hidden",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: "linear-gradient(to bottom,var(--purple-600),transparent)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                className="exp-accent"
              />
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--purple-300)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.3rem",
                  }}
                >
                  {e.period}
                </div>
                <div
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {e.company}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 600,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    color: "var(--white)",
                  }}
                >
                  {e.role}
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  {e.desc}
                </p>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1px solid rgba(147,51,234,0.4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--purple-300)",
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                ↗
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="div-line" style={{ margin: "0 6vw" }} />

      {/* ══════════════════════════════════════
          CONTACT
      ══════════════════════════════════════ */}
      <section
        id="contact"
        ref={contactRef}
        style={{
          padding: "10rem 6vw 8rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="orb"
          style={{
            width: "70vw",
            height: "70vw",
            background: "radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="contact-inner" style={{ position: "relative", zIndex: 1, opacity: 0 }}>
          <div className="section-tag" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            Get In Touch
          </div>

          <h2
            className="glow"
            style={{
              fontSize: "clamp(3rem,7vw,7rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginBottom: "2rem",
            }}
          >
            Let's build
            <br />
            <span className="grad-text">something extraordinary.</span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1.1rem",
              fontWeight: 300,
              maxWidth: "500px",
              margin: "0 auto 3rem",
              lineHeight: 1.7,
            }}
          >
            I'm currently open to senior roles, advisory work, and ambitious freelance
            collaborations. Let's talk.
          </p>

          <a
            href="mailto:hello@alexxyang.io"
            className="btn-magnetic"
            onMouseEnter={() => setCursorHover(true)}
            onMouseLeave={() => setCursorHover(false)}
            style={{ fontSize: "0.9rem" }}
          >
            <span>hello@alexxyang.io</span>
          </a>

          <div
            style={{
              marginTop: "5rem",
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
            }}
          >
            {["GitHub", "LinkedIn", "Twitter", "Dribbble"].map((s) => (
              <a
                key={s}
                href="#"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 6vw",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        <span>© 2025 Alex Xyang. All rights reserved.</span>
        <span style={{ color: "rgba(147,51,234,0.5)" }}>Built with love & caffeine.</span>
      </footer>
    </>
  );
}