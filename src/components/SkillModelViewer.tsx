"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import type { SkillModelTune } from "../data/portfolioMeta";

type Props = {
  modelPath: string;
  modelTune?: SkillModelTune;
  className?: string;
};

/*
 * ONE WebGL renderer for all fourteen tiles.
 *
 * A renderer per tile means a WebGL context per tile, and contexts are a hard
 * browser resource: Chrome caps a page at ~16 and silently evicts the oldest
 * ("Oldest context will be lost") once the cap is hit. Fourteen tiles plus the
 * hero sphere plus the hall atmosphere sits exactly on that cliff — the main
 * sphere's context was the likely victim.
 *
 * So the tiles share a single off-screen renderer. Every tile keeps its own
 * scene, camera and model exactly as before; on its frame it renders into the
 * shared buffer and blits the result onto its own plain 2D canvas with
 * drawImage. The blit is synchronous, in the same task as the render, so the
 * drawing buffer is still valid — no preserveDrawingBuffer needed. All tiles
 * are the same CSS size (.skills-icon-tile), so the shared buffer essentially
 * never reallocates.
 *
 * Ref-counted: the renderer exists only while at least one tile is started,
 * and is disposed when the section unmounts.
 */
let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedRendererUsers = 0;
let sharedW = 0;
let sharedH = 0;

function acquireSharedRenderer(): THREE.WebGLRenderer {
  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    sharedRenderer.setClearColor(0x000000, 0);
    sharedRenderer.outputColorSpace = THREE.SRGBColorSpace;
    sharedW = 0;
    sharedH = 0;
  }
  sharedRendererUsers += 1;
  return sharedRenderer;
}

function releaseSharedRenderer() {
  sharedRendererUsers -= 1;
  if (sharedRendererUsers <= 0 && sharedRenderer) {
    sharedRenderer.dispose();
    sharedRenderer = null;
    sharedRendererUsers = 0;
  }
}

/** Render a tile's scene into the shared buffer and blit it to the tile. */
function renderTile(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  ctx: CanvasRenderingContext2D,
  bufW: number,
  bufH: number,
) {
  if (bufW !== sharedW || bufH !== sharedH) {
    // Buffer pixels are managed directly (pixelRatio stays 1); the DPR clamp
    // is folded into bufW/bufH by the tile's resize handler.
    renderer.setSize(bufW, bufH, false);
    sharedW = bufW;
    sharedH = bufH;
  }
  renderer.render(scene, camera);
  ctx.clearRect(0, 0, bufW, bufH);
  ctx.drawImage(renderer.domElement, 0, 0, bufW, bufH, 0, 0, bufW, bufH);
}

function toBasicMaterial(mat: THREE.Material): THREE.Material {
  if (mat instanceof THREE.MeshBasicMaterial) {
    mat.side = THREE.DoubleSide;
    return mat;
  }

  const params: THREE.MeshBasicMaterialParameters = {
    color: "color" in mat && mat.color instanceof THREE.Color ? mat.color.clone() : new THREE.Color(0xffffff),
    transparent: mat.transparent,
    opacity: mat.opacity ?? 1,
    side: THREE.DoubleSide,
    alphaTest: mat.transparent ? 0.04 : 0,
    depthWrite: !mat.transparent,
  };

  // Assigned only when there IS one. Material.setValues() warns on any key
  // whose value is undefined and then skips it, so passing `map: undefined`
  // for the untextured materials — most of these logos are flat colour — got
  // us one console warning per material for no behavioural difference. An
  // absent key leaves map null, which is exactly what the undefined branch
  // was already achieving, silently.
  const map = "map" in mat ? (mat.map as THREE.Texture | null) : null;
  if (map) params.map = map;

  const basic = new THREE.MeshBasicMaterial(params);

  mat.dispose();
  return basic;
}

function prepareModelMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    if (Array.isArray(child.material)) {
      child.material = child.material.map((mat) => toBasicMaterial(mat));
    } else if (child.material) {
      child.material = toBasicMaterial(child.material);
    }
  });
}

/** Y/X tilts only — Z spins break already face-on square logos (TS, JS, React). */
const FLAT_ROTATION_CANDIDATES: readonly (readonly [number, number, number])[] = [
  [0, Math.PI / 2, 0],
  [0, -Math.PI / 2, 0],
  [0, Math.PI / 2, Math.PI],
  [0, -Math.PI / 2, Math.PI],
  [Math.PI / 2, 0, 0],
  [-Math.PI / 2, 0, 0],
];

const FACE_ON_DEPTH_RATIO = 0.35;

function isFaceOn(size: THREE.Vector3) {
  return size.z / Math.max(size.x, size.y, 0.001) < FACE_ON_DEPTH_RATIO;
}

function faceScore(size: THREE.Vector3) {
  return size.z / Math.max(size.x, size.y, 0.001);
}

function pickFaceRotation(root: THREE.Object3D): [number, number, number] {
  root.updateMatrixWorld(true);
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  if (isFaceOn(size)) return [0, 0, 0];

  let best: [number, number, number] = [...FLAT_ROTATION_CANDIDATES[0]];
  let bestScore = Infinity;

  for (const rotation of FLAT_ROTATION_CANDIDATES) {
    const probe = new THREE.Group();
    probe.rotation.set(rotation[0], rotation[1], rotation[2]);
    const clone = root.clone(true);
    probe.add(clone);
    probe.updateMatrixWorld(true);

    const nextSize = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
    const nextScore = faceScore(nextSize);

    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry?.dispose();
    });

    if (nextScore < bestScore) {
      bestScore = nextScore;
      best = [...rotation];
    }
  }

  return best;
}

function fitModel(root: THREE.Object3D, tune?: SkillModelTune) {
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  if (box.isEmpty()) return null;

  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  const orient = new THREE.Group();
  const rotation = tune?.rotation ?? pickFaceRotation(root);
  orient.rotation.set(rotation[0], rotation[1], rotation[2]);
  orient.add(root);

  orient.updateMatrixWorld(true);
  const fittedBox = new THREE.Box3().setFromObject(orient);
  const fittedSize = fittedBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(fittedSize.x, fittedSize.y, fittedSize.z) || 1;
  const targetSize = tune?.scale ?? 2.35;
  orient.scale.setScalar(targetSize / maxDim);

  return orient;
}

export function SkillModelViewer({ modelPath, modelTune, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Shared between the IntersectionObserver and the lazily-built instance.
    let isVisible = false;
    let started = false;
    let teardown: (() => void) | null = null;
    // Set by start(); lets the observer below restart a loop that parked
    // itself. Null until the tile has been built.
    let resume: (() => void) | null = null;

    // ALL scene setup (canvas, scene, GLB) is deferred until the tile first
    // nears the viewport. Building on mount would parse ~14 GLBs at once — a
    // big synchronous freeze that lands right on the preloader intro. Skills
    // sit far below the fold, so during the intro nothing here runs.
    const start = () => {
      if (started) return;
      started = true;

      const canvas = document.createElement("canvas");
      canvas.className = "skills-icon-model-canvas";
      host.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // No WebGL: the tile stays an empty square (it is aria-hidden
      // decoration); the names column still lists the skill. The render loop
      // reads the module-level sharedRenderer, so only the acquisition needs
      // guarding here.
      try {
        acquireSharedRenderer();
      } catch (err) {
        console.warn("[SkillModelViewer] WebGL unavailable:", err);
        canvas.remove();
        return;
      }

      const scene = new THREE.Scene();
      const cameraZ = modelTune?.cameraZ ?? 4.2;
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
      camera.position.set(0, 0, cameraZ);

      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const key = new THREE.DirectionalLight(0xffffff, 0.6);
      key.position.set(2, 3, 4);
      scene.add(key);

      const pivot = new THREE.Group();
      scene.add(pivot);

      let model: THREE.Object3D | null = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let raf = 0;
      let hasRendered = false;
      let bufW = 0;
      let bufH = 0;

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (width < 2 || height < 2) return;
        const pr = Math.min(window.devicePixelRatio, 2);
        bufW = Math.round(width * pr);
        bufH = Math.round(height * pr);
        // The blit target owns its own buffer; CSS keeps it at 100% of the tile.
        canvas.width = bufW;
        canvas.height = bufH;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const loader = new GLTFLoader();
      // Models are meshopt-compressed (EXT_meshopt_compression) to shrink them
      // from ~20 MB down to ~2 MB; the decoder is required to read them.
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        modelPath,
        (gltf) => {
          const root = gltf.scene;
          prepareModelMaterials(root);
          const fitted = fitModel(root, modelTune);
          if (!fitted) {
            console.warn("[SkillModelViewer] empty bounds:", modelPath);
            return;
          }
          pivot.add(fitted);
          model = pivot;
          hasRendered = false;
          // The loop may have parked while this was in flight.
          resume?.();
        },
        undefined,
        (err) => {
          console.warn("[SkillModelViewer] load failed:", modelPath, err);
        },
      );

      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const onPointerMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = nx * 0.65;
        targetRotX = -ny * 0.45;
      };

      const onPointerLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
      };

      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      resize();

      /*
       * Parks rather than spins. The old loop re-armed unconditionally and
       * only skipped its body, so fourteen tiles kept fourteen rAF callbacks
       * alive for the whole session no matter where the page was. Now the loop
       * stops when there is nothing to draw and the observer (or the model
       * finally arriving) starts it again.
       */
      const animate = () => {
        raf = 0;
        if (!isVisible && hasRendered) return;

        /*
         * A tile can be inside the viewport and still have nothing to show: the
         * carousel fades all but the few tiles around the focus to zero and
         * marks them `visibility: hidden` (layoutSkillsStack). Geometry is all
         * an IntersectionObserver sees, so without this every one of the
         * fourteen would render and blit on every frame of the Skills pin —
         * the heaviest moment on the page — to paint something invisible.
         * checkVisibility also covers the whole stage being hidden between
         * acts. Guarded because it is a recent API; where it is missing the
         * behaviour is simply the old one.
         */
        const drawable =
          typeof host.checkVisibility !== "function" || host.checkVisibility();

        if (model && drawable) {
          model.rotation.x += (targetRotX - model.rotation.x) * 0.09;
          model.rotation.y += (targetRotY - model.rotation.y) * 0.09;
          model.rotation.y += 0.004;
          hasRendered = true;
        }

        if (
          drawable &&
          (isVisible || !hasRendered) &&
          sharedRenderer &&
          bufW > 0 &&
          bufH > 0
        ) {
          renderTile(sharedRenderer, scene, camera, ctx, bufW, bufH);
        }

        raf = requestAnimationFrame(animate);
      };
      resume = () => {
        if (!raf) raf = requestAnimationFrame(animate);
      };
      animate();

      teardown = () => {
        resume = null;
        cancelAnimationFrame(raf);
        ro.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);

        const disposeMaterial = (m: THREE.Material) => {
          // Free any textures held by the material before the material itself.
          for (const value of Object.values(m)) {
            if (value instanceof THREE.Texture) value.dispose();
          }
          m.dispose();
        };
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            const { material } = obj;
            if (Array.isArray(material)) material.forEach(disposeMaterial);
            else if (material) disposeMaterial(material);
          }
        });

        releaseSharedRenderer();
        canvas.remove();
      };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio > 0.02;
        if (entry.isIntersecting) start();
        if (isVisible) resume?.();
      },
      { rootMargin: "200px", threshold: [0, 0.02, 0.1, 0.25] },
    );
    io.observe(host);

    return () => {
      io.disconnect();
      teardown?.();
    };
  }, [modelPath, modelTune]);

  return <div ref={hostRef} className={className} aria-hidden />;
}
