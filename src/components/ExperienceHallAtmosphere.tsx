"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { hallState } from "../lib/hallState";
import { MOBILE_MAX_WIDTH, prefersFlatHall } from "../lib/viewport";

/*
 * The air in the gravity playground.
 *
 * This is one full-screen quad running one fragment shader. No real geometry,
 * no particle system, no bloom pass — the cards themselves are DOM elements in
 * CSS 3D, because they are rectangles with text on them and that is precisely
 * what CSS 3D is good at. Rebuilding them in WebGL would buy nothing and cost
 * the text.
 *
 * What WebGL draws is the space the cards fall through: a square grid tunnel
 * receding into the vanishing point they are born from, streaming toward the
 * viewer in the same direction the cards travel, wrapped in haze, a deep light
 * source, suspended particulate and per-frame grain. The tunnel's vanishing
 * point matches the CSS `perspective-origin` on `.grav`, so the analytic grid
 * here and the CSS 3D cards agree on one projection — that agreement is the
 * whole depth effect.
 *
 * The scene is drawn with an orthographic camera and a 2x2 plane, so the shader
 * works purely in screen space — the perspective in this section belongs to the
 * CSS layer, and the atmosphere must not fight it with a second, disagreeing
 * projection.
 */

/* The vanishing point's height is NOT a constant here: experienceGravity
 * animates hallState.originY (0.10 → 0.33, CSS-style from the top) while the
 * section slides into view, and this component mirrors it into the uHorizon
 * uniform every frame. The grid tunnel and the CSS 3D cards must share one
 * vanishing point — that agreement is what makes the cards read as objects
 * inside this space rather than sprites pasted over a backdrop.
 * (The shader's UV y runs bottom-up, so the value is flipped there.) */

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
      uHorizon: { value: hallState.originY },
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
        uniform float uTime, uProgress, uHorizon, uOpacity;
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
          // UV y runs bottom-up; uHorizon is CSS-style top-down. Flip once.
          float vpy = 1.0 - uHorizon;

          /* ── The tunnel ────────────────────────────────────────────────
             The screen is the open mouth of a square tunnel whose far end is
             the vanishing point the CSS cards fall out of. Normalised so the
             screen edges are the tunnel mouth (d = 1) and depth grows toward
             the centre: d IS world depth, so grid rings spaced at integer d
             foreshorten exactly the way the cards do. */
          vec2 tq = vec2((vUv.x - 0.5) * aspect, vUv.y - vpy);
          float nx = tq.x / (0.5 * aspect);
          float ny = tq.y / 0.5;
          float side = max(abs(nx), abs(ny));
          float d = 1.0 / max(side, 1e-3);

          // Which wall this pixel lies on, and where across that wall.
          // u is constant along a ray from the vanishing point, so the
          // longitudinal lines converge into it on their own.
          float u = abs(nx) > abs(ny) ? ny * d : nx * d;

          /* The grid streams toward the viewer — the same direction the
             cards fall — fast enough to read as rushing down the tunnel. */
          float zc = d * 1.6 + uTime * 1.9;
          float ringD = abs(fract(zc + 0.5) - 0.5);
          float ring = smoothstep(0.05 + d * 0.006, 0.0, ringD);
          float railD = abs(fract(u * 2.0 + 0.5) - 0.5);
          float rail = smoothstep(0.035 + d * 0.004, 0.0, railD);

          /* Far squares dissolve into the haze before they can alias; the
             glow of the deep light takes over where they fade. The far limit
             is generous so the tunnel visibly tapers to a point instead of
             washing out early into a wide soft blob. */
          float depthFade = smoothstep(16.0, 4.0, d);
          float grid = clamp(ring + rail * 0.8, 0.0, 1.0) * depthFade;
          // Floor and ceiling read a touch brighter than the side walls —
          // the cheapest possible directional light.
          grid *= abs(nx) > abs(ny) ? 0.8 : 1.0;

          /* Light at the far end of the tunnel — the point the cards are
             born from. Two exponentials: a tight core and a wide bleed. Kept
             small so the tip stays a point of light, not a flood. */
          float r = length(vec2(tq.x, tq.y * 1.25));
          float glow = exp(-r * 7.5) * 0.55 + exp(-r * 2.6) * 0.13;
          // Scrolling deeper into the section strengthens the source.
          glow *= 0.78 + uProgress * 0.42;

          /* Haze, densest around the vanishing point and drifting almost
             imperceptibly. Aspect-corrected so the bands do not stretch into
             stripes on a wide monitor. */
          vec2 hp = vec2(vUv.x * aspect * 1.7, tq.y * 4.2);
          float haze = fbm(hp + vec2(uTime * 0.011, uTime * -0.004));
          haze *= exp(-abs(tq.y) * 3.2);

          vec3 c = uVoid;
          c = mix(c, uHaze, clamp(haze * 0.9, 0.0, 1.0));
          c += uGlow * glow;
          c += uGlow * grid * 0.24;

          /* Particulate suspended in the light. High-frequency fbm thresholded
             hard, so only the top of the noise survives as specks — a real
             particle system would be more code for a less convincing result at
             this density. */
          float m = fbm(vec2(vUv.x * aspect, vUv.y) * 58.0
                        + vec2(uTime * 0.018, uTime * 0.009));
          float motes = smoothstep(0.87, 1.0, m) * exp(-abs(tq.y) * 2.6);
          c += uGlow * motes * 0.55;

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
      // retina buys nothing on a shader with no hard edges in it. Phones cap
      // at 1 — they carry the highest device pixel ratios and the least
      // fill-rate, and every pixel here runs five octaves of fbm.
      const dprCap = window.innerWidth <= MOBILE_MAX_WIDTH ? 1 : 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
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
      // Mirrors the animated vanishing point (already scroll-smooth, no lerp).
      uniforms.uHorizon.value = hallState.originY;

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
