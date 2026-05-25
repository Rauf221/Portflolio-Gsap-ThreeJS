"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { SkillModelTune } from "../data/portfolioMeta";

type Props = {
  modelPath: string;
  modelTune?: SkillModelTune;
  className?: string;
};

function toBasicMaterial(mat: THREE.Material): THREE.Material {
  if (mat instanceof THREE.MeshBasicMaterial) {
    mat.side = THREE.DoubleSide;
    return mat;
  }

  const basic = new THREE.MeshBasicMaterial({
    map: "map" in mat ? (mat.map as THREE.Texture | null) ?? undefined : undefined,
    color: "color" in mat && mat.color instanceof THREE.Color ? mat.color.clone() : new THREE.Color(0xffffff),
    transparent: mat.transparent,
    opacity: mat.opacity ?? 1,
    side: THREE.DoubleSide,
    alphaTest: mat.transparent ? 0.04 : 0,
    depthWrite: !mat.transparent,
  });

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

    const canvas = document.createElement("canvas");
    canvas.className = "skills-icon-model-canvas";
    host.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

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
    let isVisible = false;
    let hasRendered = false;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio > 0.02;
      },
      { threshold: [0, 0.02, 0.1, 0.25] },
    );
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const loader = new GLTFLoader();
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
      },
      undefined,
      (err) => {
        console.warn("[SkillModelViewer] load failed:", modelPath, err);
      },
    );

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

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isVisible && hasRendered) return;

      if (model) {
        model.rotation.x += (targetRotX - model.rotation.x) * 0.09;
        model.rotation.y += (targetRotY - model.rotation.y) * 0.09;
        model.rotation.y += 0.004;
        hasRendered = true;
      }

      if (isVisible || !hasRendered) {
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          const { material } = obj;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose();
        }
      });

      renderer.dispose();
      canvas.remove();
    };
  }, [modelPath, modelTune]);

  return <div ref={hostRef} className={className} aria-hidden />;
}
