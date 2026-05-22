"use client";

import { useEffect, useRef } from "react";

interface Skill {
  name: string;
  x: number;
  y: number;
  size: number;
  orbit: number;
  speed: number;
  angle: number;
}

/** v6 tech orbit — dizayn eyni, rənglər ana səhifə (--sphere / --indigo) */
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

type Props = {
  className?: string;
  /** Sabit hündürlük; `fill` true olduqda parent-in hündürlüyünü doldurur */
  height?: number | string;
  fill?: boolean;
  /** Orbit mərkəzinin şaquli mövqeyi (0–1), default 0.5 */
  centerYRatio?: number;
};

export function TechOrbitCanvas({ className, height = 600, fill = false, centerYRatio = 0.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const skills = SKILLS.map((s) => ({ ...s, angle: (s.angle * Math.PI) / 180 }));
    let raf: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * centerYRatio;

      skills.slice(1).forEach((s) => {
        ctx.beginPath();
        ctx.arc(cx, cy, s.orbit * (canvas.width / 800), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(155,148,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      skills.forEach((s, i) => {
        if (i === 0) {
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 * s.size);
          glow.addColorStop(0, "rgba(155,148,255,0.6)");
          glow.addColorStop(0.5, "rgba(108,99,255,0.3)");
          glow.addColorStop(1, "rgba(108,99,255,0)");
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

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(155,148,255,${0.05 + 0.05 * Math.sin(time + i)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        const pulse = 1 + 0.15 * Math.sin(time * 2 + i);
        const ng = ctx.createRadialGradient(x, y, 0, x, y, 30 * s.size * pulse);
        ng.addColorStop(0, "rgba(155,148,255,0.4)");
        ng.addColorStop(1, "rgba(108,99,255,0)");
        ctx.beginPath();
        ctx.arc(x, y, 30 * s.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 5 * s.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "#9b94ff";
        ctx.fill();

        ctx.fillStyle = `rgba(220,218,255,${0.7 + 0.3 * Math.sin(time + i)})`;
        ctx.font = `${10 * s.size}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(s.name, x, y - 14 * s.size);
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [centerYRatio]);

  return (
    <div
      className={className}
      style={
        fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
          : { width: "100%", height, position: "relative" }
      }
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
