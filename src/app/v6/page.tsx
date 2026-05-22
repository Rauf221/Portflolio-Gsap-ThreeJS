"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================
interface Project {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  color: string;
  accent: string;
}

interface Skill {
  name: string;
  x: number;
  y: number;
  size: number;
  orbit: number;
  speed: number;
  angle: number;
}

// ============================================================
// DATA
// ============================================================
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "VOID PROTOCOL",
    subtitle: "Generative AI visual engine with real-time neural rendering",
    year: "2024",
    tags: ["Three.js", "WebGPU", "TensorFlow"],
    color: "#0d0014",
    accent: "#b45bff",
  },
  {
    id: 2,
    title: "ECHO MEMBRANE",
    subtitle: "Spatial audio-reactive installation across 12 cities",
    year: "2024",
    tags: ["Web Audio API", "WebGL", "GSAP"],
    color: "#000a1a",
    accent: "#5baaff",
  },
  {
    id: 3,
    title: "ÆTHER CANVAS",
    subtitle: "Collaborative infinite world-building metaverse experience",
    year: "2023",
    tags: ["WebXR", "Rust/WASM", "Solidity"],
    color: "#0a0014",
    accent: "#ff5bdc",
  },
  {
    id: 4,
    title: "LIMINAL STATE",
    subtitle: "Consciousness-mapping meditation interface using biofeedback",
    year: "2023",
    tags: ["BLE API", "Canvas2D", "Next.js"],
    color: "#00100a",
    accent: "#5bffb4",
  },
];

const SKILLS: Skill[] = [
  { name: "Three.js", x: 50, y: 50, size: 1.4, orbit: 0, speed: 0, angle: 0 },
  { name: "WebGL/GLSL", x: 50, y: 50, size: 1.1, orbit: 120, speed: 0.4, angle: 0 },
  { name: "Next.js", x: 50, y: 50, size: 1.0, orbit: 180, speed: -0.3, angle: 60 },
  { name: "TypeScript", x: 50, y: 50, size: 0.9, orbit: 220, speed: 0.25, angle: 120 },
  { name: "GSAP", x: 50, y: 50, size: 0.95, orbit: 160, speed: -0.5, angle: 200 },
  { name: "WebXR", x: 50, y: 50, size: 0.8, orbit: 260, speed: 0.2, angle: 300 },
  { name: "Rust/WASM", x: 50, y: 50, size: 0.75, orbit: 300, speed: -0.15, angle: 45 },
  { name: "WebGPU", x: 50, y: 50, size: 0.85, orbit: 240, speed: 0.35, angle: 180 },
  { name: "Solidity", x: 50, y: 50, size: 0.7, orbit: 340, speed: -0.22, angle: 270 },
  { name: "React", x: 50, y: 50, size: 1.0, orbit: 140, speed: 0.45, angle: 90 },
  { name: "Node.js", x: 50, y: 50, size: 0.8, orbit: 280, speed: -0.28, angle: 150 },
  { name: "TensorFlow", x: 50, y: 50, size: 0.75, orbit: 320, speed: 0.18, angle: 330 },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  // ── Three.js / WebGL hero orb ──────────────────────────────
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Vertex shader
    const vsSource = `
      attribute vec4 aPosition;
      void main() { gl_Position = aPosition; }
    `;

    // Fragment shader — cosmic orb with raymarching-lite
    const fsSource = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      #define PI 3.14159265358979

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1,0)), f.x),
          mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p = p * 2.1 + vec2(1.7, 9.2);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);
        vec2 mouse = (uMouse - uResolution * 0.5) / min(uResolution.x, uResolution.y);

        float t = uTime * 0.3;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);

        // Core orb
        float orb = 1.0 - smoothstep(0.28, 0.32, dist);
        float rim = smoothstep(0.25, 0.32, dist) * (1.0 - smoothstep(0.32, 0.42, dist));

        // Energy field
        float field = fbm(uv * 3.0 + vec2(t * 0.4, t * 0.3));
        float field2 = fbm(uv * 5.0 - vec2(t * 0.2, t * 0.5) + mouse * 0.5);

        // Nebula wisps
        vec2 polar = vec2(dist, angle / (2.0 * PI));
        float wisps = fbm(polar * 4.0 + vec2(t * 0.6, 0.0));

        // Energy tendrils
        float tendrils = 0.0;
        for (int i = 0; i < 8; i++) {
          float a = float(i) * PI * 0.25 + t * 0.2;
          vec2 dir = vec2(cos(a), sin(a));
          float d = abs(dot(uv, dir));
          float r = length(uv - dir * clamp(dot(uv, dir), 0.0, 0.35));
          tendrils += 0.04 / (r * r + 0.01) * (1.0 - smoothstep(0.0, 0.5, dist));
        }

        // Atmosphere glow
        float atmosphere = exp(-dist * 4.0) * (field * 0.5 + 0.5);
        float outerGlow = exp(-dist * 2.0) * 0.4;

        // Colors
        vec3 coreColor = vec3(0.6, 0.1, 1.0);
        vec3 rimColor = vec3(0.9, 0.4, 1.0);
        vec3 tendrilColor = vec3(0.4, 0.8, 1.0);
        vec3 atmosphereColor = vec3(0.3, 0.05, 0.6);
        vec3 glowColor = vec3(0.5, 0.1, 0.8);

        vec3 col = vec3(0.0);
        col += coreColor * orb * (field * 0.3 + 0.7);
        col += rimColor * rim * (field2 * 0.5 + 0.5) * 2.0;
        col += tendrilColor * tendrils * (1.0 - orb);
        col += atmosphereColor * atmosphere * wisps * 2.0;
        col += glowColor * outerGlow;

        // Starfield
        vec2 starUV = gl_FragCoord.xy / uResolution;
        float stars = 0.0;
        for (int i = 0; i < 3; i++) {
          float s = float(i) * 7.3;
          vec2 grid = floor(starUV * (80.0 + s * 30.0));
          float h = hash(grid + s);
          if (h > 0.97) {
            stars += (h - 0.97) * 33.0 * (sin(t * 2.0 + h * 10.0) * 0.5 + 0.5);
          }
        }
        col += vec3(stars) * (1.0 - smoothstep(0.0, 0.6, dist));

        // Mouse interaction
        float mouseInfluence = exp(-length(uv - mouse * 0.5) * 6.0);
        col += vec3(0.3, 0.6, 1.0) * mouseInfluence * 0.3;

        // Tone map
        col = col / (col + 1.0);
        col = pow(col, vec3(0.8));

        float alpha = max(max(col.r, col.g), col.b);
        alpha = smoothstep(0.0, 0.05, alpha);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = canvas.height - (e.clientY - rect.top);
    };
    window.addEventListener("mousemove", onMouse);

    let startTime = Date.now();
    let raf: number;

    const render = () => {
      gl.uniform1f(uTime, (Date.now() - startTime) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Particle field canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number; life: number; maxLife: number;
    }

    const particles: Particle[] = [];
    const MAX = 180;

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 2 + 0.3,
      alpha: 0,
      hue: 260 + Math.random() * 80,
      life: 0,
      maxLife: 200 + Math.random() * 300,
    });

    for (let i = 0; i < MAX; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      p.alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
      particles.push(p);
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.life++;
        if (p.life >= p.maxLife) {
          particles[i] = spawn();
          return;
        }
        const t = p.life / p.maxLife;
        p.alpha = Math.sin(t * Math.PI) * 0.5;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.fill();

        // Glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        g.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${p.alpha * 0.3})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Custom cursor ──────────────────────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    let raf: number;
    const animate = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // ── Scroll effects ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / maxScroll;

      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.height = `${progress * 100}%`;
      }

      setScrolled(scrollY > 50);

      // Section detection
      const sections = document.querySelectorAll("[data-section]");
      sections.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          setCurrentSection(i);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Skill orbits canvas ────────────────────────────────────
  useEffect(() => {
    const canvas = document.getElementById("skill-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const skills = SKILLS.map((s) => ({ ...s, angle: (s.angle * Math.PI) / 180 }));
    let raf: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw orbit rings
      skills.slice(1).forEach((s) => {
        ctx.beginPath();
        ctx.arc(cx, cy, s.orbit * (canvas.width / 800), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(150,80,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Update and draw nodes
      skills.forEach((s, i) => {
        if (i === 0) {
          // Center node
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 * s.size);
          glow.addColorStop(0, "rgba(180,91,255,0.6)");
          glow.addColorStop(0.5, "rgba(120,40,220,0.3)");
          glow.addColorStop(1, "rgba(80,0,160,0)");
          ctx.beginPath();
          ctx.arc(cx, cy, 40 * s.size, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.font = `bold ${12 * s.size}px 'Courier New', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(s.name, cx, cy);
          return;
        }

        s.angle += (s.speed * Math.PI) / 180;
        const r = s.orbit * (canvas.width / 800);
        const x = cx + Math.cos(s.angle + Math.sin(time * 0.5 + i) * 0.3) * r;
        const y = cy + Math.sin(s.angle + Math.cos(time * 0.4 + i) * 0.2) * r * 0.6;

        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(150,80,255,${0.05 + 0.05 * Math.sin(time + i)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Draw node glow
        const pulse = 1 + 0.15 * Math.sin(time * 2 + i);
        const ng = ctx.createRadialGradient(x, y, 0, x, y, 30 * s.size * pulse);
        ng.addColorStop(0, "rgba(180,91,255,0.4)");
        ng.addColorStop(1, "rgba(80,0,160,0)");
        ctx.beginPath();
        ctx.arc(x, y, 30 * s.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(x, y, 5 * s.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "#c084fc";
        ctx.fill();

        // Label
        ctx.fillStyle = `rgba(220,180,255,${0.7 + 0.3 * Math.sin(time + i)})`;
        ctx.font = `${10 * s.size}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(s.name, x, y - 14 * s.size);
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Scroll-driven parallax ─────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      // Hero parallax layers
      const heroOrb = document.getElementById("hero-orb");
      const heroTitle = document.getElementById("hero-title");
      const heroSub = document.getElementById("hero-sub");

      if (heroOrb) heroOrb.style.transform = `translateY(${y * 0.5}px) scale(${1 + y * 0.0005})`;
      if (heroTitle) heroTitle.style.transform = `translateY(${y * 0.3}px)`;
      if (heroSub) heroSub.style.opacity = `${1 - y / 400}`;

      // Section reveals
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const progress = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
        (el as HTMLElement).style.opacity = `${progress}`;
        (el as HTMLElement).style.transform = `translateY(${(1 - progress) * 60}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionColors = ["#0a0010", "#050015", "#000a1a", "#0a0010", "#050005", "#000510"];

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --void: #02000a;
          --deep: #080015;
          --purple: #b45bff;
          --violet: #7c3aed;
          --glow: #e879f9;
          --white: #f0e8ff;
          --muted: rgba(200,170,255,0.5);
          --font-serif: 'Cormorant Garamond', serif;
          --font-mono: 'Space Mono', monospace;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--void);
          color: var(--white);
          font-family: var(--font-serif);
          overflow-x: hidden;
          cursor: none;
        }

        ::selection { background: rgba(180,91,255,0.3); color: white; }

        /* Cursor */
        .cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 40px; height: 40px;
          border: 1px solid rgba(180,91,255,0.6);
          border-radius: 50%;
          pointer-events: none;
          transition: width 0.3s, height 0.3s, border-color 0.3s;
          mix-blend-mode: screen;
        }
        .cursor-ring.hovered {
          width: 60px; height: 60px;
          border-color: rgba(180,91,255,1);
          background: rgba(180,91,255,0.05);
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 8px; height: 8px;
          background: var(--glow);
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 12px var(--glow);
        }

        /* Scroll progress */
        .scroll-progress {
          position: fixed; right: 24px; top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          width: 1px; height: 120px;
          background: rgba(180,91,255,0.15);
        }
        .scroll-progress-fill {
          width: 100%; height: 0%;
          background: linear-gradient(to bottom, var(--purple), var(--glow));
          transition: height 0.1s;
          box-shadow: 0 0 8px var(--purple);
        }

        /* Particle canvas */
        .particle-canvas {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none; opacity: 0.6;
        }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px;
          transition: background 0.5s;
        }
        .nav.scrolled {
          background: rgba(2,0,10,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(180,91,255,0.1);
        }
        .nav-logo {
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.3em;
          color: var(--purple);
          text-transform: uppercase;
        }
        .nav-links {
          display: flex; gap: 40px; list-style: none;
        }
        .nav-links a {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--muted);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--purple); }

        /* Hero */
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-bg-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .hero-orb-wrap {
          position: absolute;
          width: min(70vw, 70vh);
          height: min(70vw, 70vh);
        }
        .hero-content {
          position: relative; z-index: 10;
          text-align: center;
          pointer-events: none;
        }
        .hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.5em;
          color: var(--purple);
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(64px, 9vw, 160px);
          font-weight: 300;
          line-height: 0.9;
          color: var(--white);
          letter-spacing: -0.02em;
        }
        .hero-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1px rgba(180,91,255,0.7);
        }
        .hero-subtitle {
          font-family: var(--font-mono);
          font-size: clamp(11px, 1.2vw, 14px);
          letter-spacing: 0.25em;
          color: var(--muted);
          margin-top: 32px;
          text-transform: uppercase;
        }
        .hero-scroll-hint {
          position: absolute;
          bottom: 40px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--purple), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }

        /* Sections */
        .section {
          position: relative;
          padding: 120px 0;
          overflow: hidden;
        }
        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }
        .section-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.4em;
          color: var(--purple);
          text-transform: uppercase;
          margin-bottom: 16px;
          opacity: 0.7;
        }
        .section-title {
          font-family: var(--font-serif);
          font-size: clamp(48px, 6vw, 96px);
          font-weight: 300;
          line-height: 1;
          color: var(--white);
          letter-spacing: -0.02em;
          margin-bottom: 64px;
        }
        .section-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1px rgba(180,91,255,0.6);
        }

        /* About */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-text p {
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.8;
          color: rgba(200,175,255,0.75);
          margin-bottom: 24px;
          font-weight: 300;
        }
        .about-stats {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .stat-item {
          border-left: 1px solid rgba(180,91,255,0.3);
          padding-left: 24px;
        }
        .stat-number {
          font-family: var(--font-mono);
          font-size: 48px;
          color: var(--purple);
          line-height: 1;
          display: block;
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Skills */
        .skills-canvas-wrap {
          width: 100%;
          height: 600px;
          position: relative;
        }

        /* Projects */
        .projects-tabs {
          display: flex; gap: 0;
          margin-bottom: 48px;
          border-bottom: 1px solid rgba(180,91,255,0.15);
        }
        .project-tab {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 12px 24px;
          color: var(--muted);
          cursor: none;
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s;
          margin-bottom: -1px;
        }
        .project-tab.active {
          color: var(--purple);
          border-bottom-color: var(--purple);
        }

        .project-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: 520px;
        }
        .project-info {
          padding: 48px 48px 48px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .project-number {
          font-family: var(--font-mono);
          font-size: 80px;
          font-weight: 700;
          color: rgba(180,91,255,0.08);
          line-height: 1;
          margin-bottom: 24px;
        }
        .project-title {
          font-family: var(--font-mono);
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--white);
          margin-bottom: 16px;
        }
        .project-subtitle {
          font-size: clamp(14px, 1.2vw, 18px);
          color: var(--muted);
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 32px;
        }
        .project-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .tag {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--purple);
          border: 1px solid rgba(180,91,255,0.3);
          padding: 4px 12px;
          text-transform: uppercase;
        }
        .project-image {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(80,0,120,0.3), rgba(0,20,60,0.3));
          border: 1px solid rgba(180,91,255,0.1);
        }
        .project-image-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .project-placeholder {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .project-placeholder-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(180,91,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,91,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 8s linear infinite;
        }
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(40px); }
        }
        .project-placeholder-orb {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,91,255,0.4), rgba(80,0,160,0.1));
          animation: orbPulse 3s ease-in-out infinite;
          box-shadow: 0 0 60px rgba(180,91,255,0.3), inset 0 0 40px rgba(180,91,255,0.2);
        }
        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        .project-placeholder-label {
          position: absolute;
          bottom: 24px; left: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.3em;
          color: rgba(180,91,255,0.5);
          text-transform: uppercase;
        }

        /* Experience */
        .timeline {
          position: relative;
          padding-left: 48px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--purple), transparent);
        }
        .timeline-item {
          position: relative;
          padding-bottom: 64px;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -52px; top: 6px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--purple);
          box-shadow: 0 0 16px var(--purple);
        }
        .timeline-year {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          color: var(--purple);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .timeline-role {
          font-family: var(--font-serif);
          font-size: clamp(22px, 2.5vw, 36px);
          font-weight: 300;
          color: var(--white);
          margin-bottom: 4px;
        }
        .timeline-company {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }
        .timeline-desc {
          font-size: 15px;
          color: rgba(200,175,255,0.6);
          line-height: 1.8;
          max-width: 560px;
          font-weight: 300;
        }

        /* Contact */
        .contact-inner {
          text-align: center;
          position: relative;
          z-index: 10;
        }
        .contact-orb {
          width: 300px; height: 300px;
          border-radius: 50%;
          margin: 0 auto 64px;
          position: relative;
          background: radial-gradient(circle at 40% 40%, rgba(180,91,255,0.3), rgba(40,0,80,0.1));
          border: 1px solid rgba(180,91,255,0.2);
          animation: contactBreath 4s ease-in-out infinite;
          box-shadow:
            0 0 60px rgba(180,91,255,0.15),
            0 0 120px rgba(100,0,200,0.1),
            inset 0 0 60px rgba(180,91,255,0.05);
        }
        @keyframes contactBreath {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(180,91,255,0.15), 0 0 120px rgba(100,0,200,0.1); }
          50% { transform: scale(1.04); box-shadow: 0 0 80px rgba(180,91,255,0.25), 0 0 160px rgba(100,0,200,0.15); }
        }
        .contact-email {
          font-family: var(--font-serif);
          font-size: clamp(24px, 3vw, 48px);
          font-weight: 300;
          color: var(--white);
          text-decoration: none;
          display: block;
          margin-bottom: 48px;
          transition: color 0.3s;
          letter-spacing: 0.02em;
        }
        .contact-email:hover { color: var(--purple); }
        .contact-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }
        .social-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        .social-link:hover { color: var(--purple); }
        .social-sep {
          width: 1px; height: 20px;
          background: rgba(180,91,255,0.2);
        }

        /* Glitch line dividers */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(180,91,255,0.2), transparent);
          position: relative;
          overflow: hidden;
        }
        .divider::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(180,91,255,0.8), transparent);
          animation: dividerScan 4s ease-in-out infinite;
        }
        @keyframes dividerScan {
          0% { left: -60%; }
          100% { left: 160%; }
        }

        /* Noise overlay */
        .noise {
          position: fixed; inset: 0; z-index: 300;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          animation: noiseAnim 0.15s steps(1) infinite;
        }
        @keyframes noiseAnim {
          0% { background-position: 0 0; }
          20% { background-position: -50px 30px; }
          40% { background-position: 30px -50px; }
          60% { background-position: -80px 60px; }
          80% { background-position: 60px -80px; }
          100% { background-position: -30px 30px; }
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 40px 48px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.3em;
          color: rgba(200,175,255,0.25);
          text-transform: uppercase;
          border-top: 1px solid rgba(180,91,255,0.05);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .section-inner { padding: 0 24px; }
          .about-grid { grid-template-columns: 1fr; gap: 48px; }
          .project-showcase { grid-template-columns: 1fr; }
          .project-image { height: 280px; }
          .project-info { padding: 32px 0; }
          .hero-title { font-size: clamp(48px, 12vw, 96px); }
          .skills-canvas-wrap { height: 400px; }
        }

        /* Animate on scroll helpers */
        [data-reveal] {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise" />

      {/* Ambient particle canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`cursor-ring ${cursorHovered ? "hovered" : ""}`}
      />
      <div ref={cursorDotRef} className="cursor-dot" />

      {/* Scroll progress */}
      <div className="scroll-progress">
        <div ref={scrollProgressRef} className="scroll-progress-fill" />
      </div>

      {/* Navigation */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">◈ Aether.Dev</div>
        <ul className="nav-links">
          {["About", "Skills", "Projects", "Experience", "Contact"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >{l}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero" data-section="0">
        <canvas ref={heroCanvasRef} className="hero-bg-canvas" />

        <div id="hero-orb" className="hero-orb-wrap" />

        <div className="hero-content" id="hero-title">
          <p className="hero-eyebrow">Digital Artist · Creative Developer</p>
          <h1 className="hero-title">
            KAEL<br /><em>VOSS</em>
          </h1>
          <p className="hero-subtitle" id="hero-sub">
            Architect of digital realities · Weaver of impossible experiences
          </p>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Descend</span>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════ ABOUT ══════════════ */}
      <section className="section" id="about" data-section="1">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-text" data-reveal>
              <p className="section-tag">// Identity</p>
              <h2 className="section-title">A <em>mind</em><br />between worlds</h2>
              <p>
                I exist at the threshold between art and technology — a space
                most call impossible. My work dissolves boundaries: between
                the physical and digital, between code and consciousness,
                between what is and what could be.
              </p>
              <p>
                For a decade I have been crafting experiences that change
                how people feel about the internet. Not websites. Not apps.
                <em style={{ color: "var(--purple)", fontStyle: "italic" }}> Worlds.</em>
              </p>
              <p>
                Currently operating from a studio somewhere between
                Reykjavík and the void, building the visual language
                of the next era of the web.
              </p>
            </div>
            <div className="about-stats" data-reveal style={{ transitionDelay: "0.2s" }}>
              {[
                { n: "10+", l: "Years of experimentation" },
                { n: "47", l: "Award-winning projects" },
                { n: "∞", l: "Pixels reimagined" },
                { n: "3", l: "Reality layers inhabited" },
              ].map((s) => (
                <div key={s.l} className="stat-item">
                  <span className="stat-number">{s.n}</span>
                  <span className="stat-label">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════ SKILLS ══════════════ */}
      <section className="section" id="skills" data-section="2">
        <div className="section-inner">
          <p className="section-tag" data-reveal>// Constellation</p>
          <h2 className="section-title" data-reveal>
            Tech <em>orbit</em>
          </h2>
        </div>
        <div className="skills-canvas-wrap">
          <canvas id="skill-canvas" style={{ width: "100%", height: "100%" }} />
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════ PROJECTS ══════════════ */}
      <section className="section" id="projects" data-section="3">
        <div className="section-inner">
          <p className="section-tag" data-reveal>// Selected works</p>
          <h2 className="section-title" data-reveal>
            The <em>work</em>
          </h2>

          <div className="projects-tabs">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                className={`project-tab ${activeProject === i ? "active" : ""}`}
                onClick={() => setActiveProject(i)}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="project-showcase"
              style={{ display: activeProject === i ? "grid" : "none" }}
            >
              <div className="project-info">
                <div>
                  <div className="project-number">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <div className="project-tags">
                    {project.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 32 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}>
                    {project.year} · View Project →
                  </span>
                </div>
              </div>

              <div className="project-image">
                <div className="project-placeholder">
                  <div
                    className="project-placeholder-grid"
                    style={{
                      backgroundImage: `
                        linear-gradient(${project.accent}15 1px, transparent 1px),
                        linear-gradient(90deg, ${project.accent}15 1px, transparent 1px)
                      `,
                    }}
                  />
                  <div
                    className="project-placeholder-orb"
                    style={{
                      background: `radial-gradient(circle, ${project.accent}50, ${project.color})`,
                      boxShadow: `0 0 60px ${project.accent}40, inset 0 0 40px ${project.accent}20`,
                    }}
                  />
                  <div className="project-placeholder-label">
                    {project.year} · {project.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════ EXPERIENCE ══════════════ */}
      <section className="section" id="experience" data-section="4">
        <div className="section-inner">
          <p className="section-tag" data-reveal>// Journey</p>
          <h2 className="section-title" data-reveal>
            The <em>path</em>
          </h2>

          <div className="timeline" data-reveal>
            {[
              {
                year: "2022 — Present",
                role: "Principal Creative Technologist",
                company: "Studio Liminal, Reykjavík",
                desc: "Leading experimental interfaces for the world's most boundary-pushing brands. Pioneering WebGPU experiences that have won 12 international awards.",
              },
              {
                year: "2019 — 2022",
                role: "Senior Experience Engineer",
                company: "Refik Anadol Studio, Los Angeles",
                desc: "Built data-driven machine hallucination experiences viewed by millions. Developed real-time rendering pipelines for monumental architectural installations.",
              },
              {
                year: "2016 — 2019",
                role: "Creative Developer",
                company: "Resn, Wellington",
                desc: "Crafted award-winning interactive campaigns for Nike, Google, and Apple. Pioneered WebGL narrative experiences before anyone knew that was a genre.",
              },
              {
                year: "2014 — 2016",
                role: "Digital Artist",
                company: "Independent",
                desc: "Solo exhibitions of generative art across Berlin, Tokyo, and São Paulo. Developed my visual language at the intersection of code and perception.",
              },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <p className="timeline-year">{item.year}</p>
                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-company">{item.company}</p>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════ CONTACT ══════════════ */}
      <section className="section" id="contact" data-section="5"
        style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}
      >
        <div className="section-inner" style={{ width: "100%" }}>
          <div className="contact-inner">
            <p className="section-tag" style={{ textAlign: "center" }}>// Portal</p>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              Enter <em>the void</em>
            </h2>

            <div className="contact-orb">
              {/* Rings */}
              {[1, 2, 3].map((r) => (
                <div key={r} style={{
                  position: "absolute",
                  inset: `${r * 20}px`,
                  borderRadius: "50%",
                  border: "1px solid rgba(180,91,255,0.1)",
                  animation: `contactBreath ${3 + r}s ease-in-out infinite`,
                  animationDelay: `${r * 0.5}s`,
                }} />
              ))}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--purple)",
                textTransform: "uppercase",
              }}>Transmit</div>
            </div>

            <a
              href="mailto:kael@aether.dev"
              className="contact-email"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              kael@aether.dev
            </a>

            <div className="contact-socials">
              {[
                ["GitHub", "#"],
                ["Twitter", "#"],
                ["Dribbble", "#"],
                ["Arena", "#"],
              ].map(([label, href], i, arr) => (
                <>
                  <a key={label} href={href} className="social-link"
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                  >{label}</a>
                  {i < arr.length - 1 && <div key={`sep-${i}`} className="social-sep" />}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>◈ Kael Voss · {new Date().getFullYear()} · All realities reserved</span>
      </footer>
    </>
  );
}