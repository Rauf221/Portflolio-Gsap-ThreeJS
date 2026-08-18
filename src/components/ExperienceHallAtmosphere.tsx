"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { hallState } from "../lib/hallState";
import { prefersFlatHall } from "../lib/viewport";

/*
 * The air in the monolith hall.
 *
 * This is one full-screen quad running one fragment shader. No corridor
 * geometry, no particle system, no bloom pass — the monoliths themselves are
 * DOM elements in CSS 3D, because they are rectangles with text on them and
 * that is precisely what CSS 3D is good at. Rebuilding them in WebGL would buy
 * nothing and cost the text.
 *
 * What WebGL is here for is the one thing CSS genuinely cannot fake: air. A
 * flat CSS gradient reads as a flat CSS gradient. Layered value noise, a light
 * source with real falloff, suspended particulate and per-frame grain read as a
 * room with depth in it. Four things, one pass.
 *
 * The scene is drawn with an orthographic camera and a 2x2 plane, so the shader
 * works purely in screen space — the perspective in this section belongs to the
 * CSS layer, and the atmosphere must not fight it with a second, disagreeing
 * projection.
 */

/** Screen height fraction where the floor meets the air. Slightly below centre
 *  because that is where a standing person's horizon actually falls, and the
 *  CSS floor plane is anchored to the same figure. */
const HORIZON = 0.46;

const COLOR_VOID = new THREE.Color("#08070C");
const COLOR_HAZE = new THREE.Color("#1A1830");
const COLOR_GLOW = new THREE.Color("#6B5BCB");

export function ExperienceHallAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Same gate as the GSAP choreography: on reduced motion or a narrow screen
    // the section is a flat readable stack, so nothing here is built.
    if (!canvas || prefersFlatHall()) return;

    // No WebGL: the hall keeps its CSS layers (slabs, gradients) and just
    // loses the shader air — degraded, not broken.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    } catch (err) {
      console.warn("[portfolio] WebGL unavailable, hall atmosphere disabled:", err);
      return;
    }
    renderer.setClearColor(COLOR_VOID, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uOpacity: { value: 1 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uVoid: { value: COLOR_VOID },
      uHaze: { value: COLOR_HAZE },
      uGlow: { value: COLOR_GLOW },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime, uProgress, uOpacity;
        uniform vec2 uResolution;
        uniform vec3 uVoid, uHaze, uGlow;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        /* Five octaves. Fewer and the haze bands read as obvious blobs; more
           and they average out into the flat gradient this exists to avoid. */
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.02;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          float aspect = uResolution.x / max(uResolution.y, 1.0);
          float horizon = ${HORIZON};
          float dy = vUv.y - horizon;

          /* Light from the unseen end of the hall. Two exponentials: a tight
             one for the band itself, a wide one for the bleed that lets the
             monolith silhouettes separate from the dark above them. */
          float glow = exp(-abs(dy) * 8.0) * 0.5 + exp(-abs(dy) * 2.4) * 0.16;
          glow *= 1.0 - smoothstep(0.0, 0.62, abs(vUv.x - 0.5));
          // Walking deeper into the hall brings the source closer.
          glow *= 0.78 + uProgress * 0.42;

          /* Haze, densest at eye level and drifting almost imperceptibly.
             The x term is aspect-corrected so the bands do not stretch into
             stripes on a wide monitor. */
          vec2 hp = vec2(vUv.x * aspect * 1.7, dy * 4.2);
          float haze = fbm(hp + vec2(uTime * 0.011, uTime * -0.004));
          haze *= exp(-abs(dy) * 3.2);

          vec3 c = uVoid;
          c = mix(c, uHaze, clamp(haze * 0.9, 0.0, 1.0));
          c += uGlow * glow;

          /* Particulate suspended in the light. High-frequency fbm thresholded
             hard, so only the top of the noise survives as specks — a real
             particle system would be more code for a less convincing result at
             this density. */
          float m = fbm(vec2(vUv.x * aspect, vUv.y) * 58.0
                        + vec2(uTime * 0.018, uTime * 0.009));
          float motes = smoothstep(0.87, 1.0, m) * exp(-abs(dy) * 2.6);
          c += uGlow * motes * 0.55;

          // The floor is the same air, minus the light.
          float floorMask = 1.0 - smoothstep(horizon - 0.34, horizon, vUv.y);
          c *= 1.0 - floorMask * 0.42;

          vec2 q = (vUv - 0.5) * vec2(aspect, 1.0);
          c *= 1.0 - smoothstep(0.34, 0.98, length(q)) * 0.72;

          /* Grain. The single cheapest thing that stops a gradient looking like
             a gradient — resolution-locked so it stays film-fine rather than
             scaling into visible blocks on a HiDPI screen. */
          float g = hash(vUv * uResolution + fract(uTime) * 91.7);
          c += (g - 0.5) * 0.03;

          gl_FragColor = vec4(c, uOpacity);
        }
      `,
    });

    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      // Capped at 1.5 rather than 2: this pass is fill-rate bound and full
      // retina buys nothing on a shader with no hard edges in it.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // The canvas is section-local, so a window listener alone misses layout
    // shifts (pin spacing, font swap) that resize it without resizing the window.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let wasActive = false;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      const now = performance.now();
      // Clamped so a backgrounded tab does not resume with one enormous step.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!hallState.active) {
        if (wasActive) {
          wasActive = false;
          canvas.style.opacity = "0";
        }
        return;
      }
      if (!wasActive) {
        wasActive = true;
        canvas.style.opacity = "1";
      }

      uniforms.uTime.value += dt;
      uniforms.uProgress.value +=
        (hallState.progress - uniforms.uProgress.value) * Math.min(1, dt * 3);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hall-atmos" aria-hidden="true" />;
}
