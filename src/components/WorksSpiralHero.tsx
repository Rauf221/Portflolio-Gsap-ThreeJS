"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * The works hero: a helix of project panels wrapped around an invisible pole.
 *
 * Each tile is NOT a plane — it is a slice of a cylinder whose arc length is
 * the tile's width, so every panel is curved around the same axis and the ring
 * reads as one continuous surface rather than a carousel of flat cards. The
 * tiles are laid out by a single normalised position `t` in [0,1) that decides
 * BOTH the height on the spiral and the rotation around it; wrapping that value
 * is what makes the spiral endless. Scroll advances it, and the leftover
 * velocity is fed to the shader as "wind", which flutters the panels.
 *
 * This file imports three statically, so it must stay behind next/dynamic with
 * ssr:false at every call site (same rule as SkillModelViewer).
 */

export type SpiralTile = {
  /** Poster image; when absent the tile is drawn as an accent card instead. */
  src?: string;
  label: string;
  accent: string;
};

/* ── Layout, in world units ──────────────────────────────────────────────── */
const RADIUS = 7.7;
const ITEM_WIDTH = 6;
const ITEM_HEIGHT = 4;
/** Total vertical span of the helix — tiles ride from -half to +half. */
const SPIRAL_HEIGHT = 30;
/** Wraps around the pole over that span. */
const REVOLUTIONS = 1.5;
/**
 * Bends the panels outward by the SQUARE of their height, so the column pinches
 * at the middle and flares at both ends. Tiny by design: 0.028 x 15² is already
 * 6 units of outward push at the extremes.
 */
const POLE_FLARE = 0.028;
/** Corner rounding, in the same units as the tile — see the SDF below. */
const BORDER_RADIUS = 0.2;
const CAMERA_Z = 20;
const CAMERA_FOV = 45;
/**
 * The share of the loop at each end over which a tile fades. Without it panels
 * would pop into existence at the bottom of the column and vanish at the top.
 */
const EDGE_FADE = 0.5;

/* ── Motion ──────────────────────────────────────────────────────────────── */
/** Turns page scroll into spiral travel: 1.0 is one full loop of the helix. */
const SCROLL_SENSITIVITY = 0.0004;
/** Drag is direct manipulation, so it gets a stronger ratio than the wheel. */
const DRAG_SENSITIVITY = 0.0016;
/** Per-frame approach to the target. Low = long, floaty glide. */
const DAMPING = 0.06;
/** Constant drift, so the column is alive before the reader touches anything. */
const AUTO_SPEED = 0.00035;
/** How hard the leftover velocity deforms the panels. */
const WIND_STRENGTH = 0.5;

/** Fewest panels on the ring — a short list is cycled to fill it. */
const MIN_TILES = 12;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float poleFlare;
  uniform float wind;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    // Push the panel away from the axis by the square of its height, so the
    // column pinches in the middle and opens out at both ends.
    vec2 outward = normalize(worldPos.xz);
    float yDist = worldPos.y;
    worldPos.xz += outward * (yDist * yDist) * poleFlare;

    // Wind: the panel sags in the middle of its span and lifts off the pole,
    // both scaled by how fast the spiral is currently travelling.
    float flutter = sin(vUv.x * 3.1415926) * wind * 30.0;
    worldPos.y -= flutter;
    worldPos.xz -= outward * (vUv.y - 0.5) * wind * 20.0;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D map;
  uniform vec2 planeSize;
  uniform float borderRadius;
  uniform float opacity;

  void main() {
    // Rounded corners as a signed distance field rather than a texture mask:
    // the panel is curved and stretched by the vertex stage, and an SDF stays
    // crisp through both.
    vec2 px = vUv * planeSize;
    vec2 halfSize = planeSize * 0.5;
    vec2 d = abs(px - halfSize) - halfSize + vec2(borderRadius);
    float dist = length(max(d, 0.0)) - borderRadius;
    float alpha = 1.0 - smoothstep(-0.02, 0.02, dist);
    if (alpha < 0.01) discard;

    vec4 texColor = texture2D(map, vUv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha * opacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * A tile with no poster yet, drawn on a canvas in the site's own language:
 * the accent field, the project's name, nothing else. It exists so adding a
 * project to the archive never has to wait on artwork.
 */
function drawCardTexture(tile: SpiralTile) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = tile.accent;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // A soft corner light, so a flat fill does not read as a missing image.
  const glow = ctx.createRadialGradient(140, 110, 0, 140, 110, 620);
  glow.addColorStop(0, "rgba(255,248,231,0.20)");
  glow.addColorStop(1, "rgba(255,248,231,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF8E7";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 54px 'Hanken Grotesk', system-ui, sans-serif";
  ctx.fillText(tile.label, canvas.width / 2, canvas.height / 2, canvas.width - 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type Props = {
  tiles: readonly SpiralTile[];
  /** Marked on the container once the scene is live, for the CSS fade-in. */
  onReady?: () => void;
};

export function WorksSpiralHero({ tiles, onReady }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  // The callback is only ever read inside the effect's async setup, and the
  // effect must not re-run when a parent re-render hands it a new function.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || tiles.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      // No WebGL: the flat fallback underneath stays visible and the hero is
      // a still composition rather than a hole.
      return;
    }

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    // Phones pair the highest pixel ratios with the least fill rate, and this
    // scene is nothing but overdraw — same caps the rest of the site uses.
    const dprCap = window.innerWidth <= 700 ? 1 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 1000);

    /*
     * The panels are sized in world units, so a narrow window would simply cut
     * them off. Pulling the camera back by how far the aspect falls short of a
     * landscape frame refits the column instead — the same problem, and the
     * same answer, as sphereFit() on the home page.
     */
    const fitCamera = (aspect: number) => {
      camera.position.set(0, 0, CAMERA_Z * Math.min(1.9, Math.max(1, 1.6 / aspect)));
      camera.lookAt(0, 0, 0);
    };
    fitCamera(width / height);

    const disposables: { dispose: () => void }[] = [];

    /*
     * ONE geometry for every panel: a slice of a cylinder whose arc length is
     * the tile width (theta = width / radius), centred on the front of the ring
     * so a mesh's rotation.y is also its position around the pole.
     */
    const theta = ITEM_WIDTH / RADIUS;
    const geometry = new THREE.CylinderGeometry(
      RADIUS, RADIUS, ITEM_HEIGHT, 64, 16, true, Math.PI / 2 - theta / 2, theta,
    );
    disposables.push(geometry);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const loader = new THREE.TextureLoader();

    const makeMaterial = (map: THREE.Texture | null) =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: map },
          planeSize: { value: new THREE.Vector2(ITEM_WIDTH, ITEM_HEIGHT) },
          borderRadius: { value: BORDER_RADIUS },
          opacity: { value: 1 },
          poleFlare: { value: POLE_FLARE },
          wind: { value: 0 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true,
      });

    // A short archive is cycled around the ring rather than leaving it gappy —
    // once there are MIN_TILES projects, every panel is a different one.
    const count = Math.max(MIN_TILES, tiles.length);
    const meshes: THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>[] = [];

    for (let i = 0; i < count; i++) {
      const tile = tiles[i % tiles.length];
      let texture: THREE.Texture | null = null;

      if (tile.src) {
        texture = loader.load(tile.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
      } else {
        texture = drawCardTexture(tile);
      }
      if (texture) disposables.push(texture);

      const material = makeMaterial(texture);
      disposables.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshes.push(mesh);
    }

    /* ── travel state ────────────────────────────────────────────────────── */
    let target = 0;          // where the spiral is being asked to be
    let current = 0;         // where it actually is (damped)
    let auto = 0;            // the idle drift
    let last = 0;            // previous `current`, for the velocity
    let velocity = 0;        // smoothed, drives the wind
    let dragOffset = 0;
    let dragging = false;
    let dragStartY = 0;

    const readScroll = () => window.scrollY * SCROLL_SENSITIVITY + dragOffset;
    target = readScroll();
    current = target;

    const onScroll = () => {
      target = readScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Drag is mouse-only: on a touch screen a vertical drag IS the page scroll,
    // and stealing it would trap the reader in the hero.
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const onPointerDown = (e: PointerEvent) => {
      if (coarse || e.button !== 0) return;
      dragging = true;
      dragStartY = e.clientY;
      mount.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      dragOffset += (dragStartY - e.clientY) * DRAG_SENSITIVITY;
      dragStartY = e.clientY;
      target = readScroll();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (mount.hasPointerCapture(e.pointerId)) mount.releasePointerCapture(e.pointerId);
    };
    if (!coarse) {
      mount.addEventListener("pointerdown", onPointerDown);
      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerup", onPointerUp);
      mount.addEventListener("pointercancel", onPointerUp);
    }

    const layout = () => {
      for (let i = 0; i < meshes.length; i++) {
        // Every panel's normalised place on the loop. Wrapping it is what makes
        // the helix endless: a tile that passes the top re-enters at the bottom.
        let t = i / count + current;
        t -= Math.floor(t);

        let edge = 1;
        if (EDGE_FADE > 0.001) {
          if (t < EDGE_FADE) edge = t / EDGE_FADE;
          else if (t > 1 - EDGE_FADE) edge = (1 - t) / EDGE_FADE;
        }

        const uniforms = meshes[i].material.uniforms;
        // sin() rather than the raw ramp: the fade holds near full opacity
        // through the middle and falls away quickly at the very ends.
        uniforms.opacity.value = Math.sin((Math.PI / 2) * edge);
        uniforms.wind.value = velocity * WIND_STRENGTH;

        meshes[i].position.y = (t - 0.5) * SPIRAL_HEIGHT;
        meshes[i].rotation.y = t * Math.PI * 2 * REVOLUTIONS;
      }
    };

    /* ── the loop, gated on being both visible and on screen ─────────────── */
    let onScreen = true;
    let frame = 0;
    let ready = false;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;

      auto += AUTO_SPEED;
      current += (target + auto - current) * DAMPING;
      const delta = current - last;
      last = current;
      velocity = velocity * 0.8 + delta * 0.2;

      layout();
      renderer.render(scene, camera);

      if (!ready) {
        ready = true;
        onReadyRef.current?.();
      }
    };

    if (reducedMotion) {
      // One composed frame: the spiral as a still image, no drift, no wind.
      layout();
      renderer.render(scene, camera);
      onReadyRef.current?.();
    } else {
      tick();
    }

    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      fitCamera(camera.aspect);
      camera.updateProjectionMatrix();
      if (reducedMotion) renderer.render(scene, camera);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (!coarse) {
        mount.removeEventListener("pointerdown", onPointerDown);
        mount.removeEventListener("pointermove", onPointerMove);
        mount.removeEventListener("pointerup", onPointerUp);
        mount.removeEventListener("pointercancel", onPointerUp);
      }
      scene.clear();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [tiles]);

  return <div className="works-spiral" ref={mountRef} aria-hidden="true" />;
}
