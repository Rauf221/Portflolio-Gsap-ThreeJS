import { type RefObject, useEffect } from "react";
import { sphereState } from "../lib/sphereState";

export function usePortfolioThree(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  loaded: boolean,
) {
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    const THREE = window.THREE;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 14);

    // ── YENİ: tüm objeleri taşıyacak grup ──────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);
    // ────────────────────────────────────────────────────────────────────────

    const makeSphere = (radius: number, detail: number, color: number, opacity: number) => {
      const geo = new THREE.IcosahedronGeometry(radius, detail);
      const mat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(geo, mat);
      // ── scene.add yerine group.add ──────────────────────────────────────
      group.add(mesh);
      // ────────────────────────────────────────────────────────────────────

      const vtxCount = geo.attributes.position.count;
      const originPos = new Float32Array(geo.attributes.position.array.length);
      originPos.set(geo.attributes.position.array);

      const explodeTargets = new Float32Array(originPos.length);
      for (let i = 0; i < vtxCount; i++) {
        const ox = originPos[i * 3],
          oy = originPos[i * 3 + 1],
          oz = originPos[i * 3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        explodeTargets[i * 3] = (ox / len) * (9 + Math.random() * 14);
        explodeTargets[i * 3 + 1] = (oy / len) * (9 + Math.random() * 14);
        explodeTargets[i * 3 + 2] = (oz / len) * (9 + Math.random() * 14);
      }

      return { mesh, geo, mat, originPos, explodeTargets, vtxCount, baseOpacity: opacity };
    };

    const outer = makeSphere(3.8, 5, 0x9b94ff, 0.32);
    const inner = makeSphere(2.2, 4, 0xffffff, 0.26);

    const makeRing = (r: number, color: number, op: number, rx: number, rz: number) => {
      const g = new THREE.TorusGeometry(r, 0.006, 4, 180);
      const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = rx;
      mesh.rotation.z = rz;
      // ── group.add ───────────────────────────────────────────────────────
      group.add(mesh);
      // ────────────────────────────────────────────────────────────────────
      return { mesh, mat: m, baseOpacity: op };
    };
    const ring1 = makeRing(4.8, 0x9b94ff, 0.28, Math.PI / 2.8, 0);
    const ring2 = makeRing(4.2, 0x9b94ff, 0.12, -Math.PI / 3.5, Math.PI / 4);
    const ring3 = makeRing(2.8, 0xffffff, 0.1, Math.PI / 5, -Math.PI / 6);

    const pCount = 420;
    const pPos = new Float32Array(pCount * 3);
    const pOrigins = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.6 + Math.random() * 0.6;
      pOrigins[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pOrigins[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pOrigins[i * 3 + 2] = r * Math.cos(phi);
      pSpeeds[i] = 0.3 + Math.random() * 0.7;
    }
    pPos.set(pOrigins);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x9b94ff,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    // ── group.add ─────────────────────────────────────────────────────────
    group.add(particles);
    // ─────────────────────────────────────────────────────────────────────

    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const morphSphere = (
      geo: any,
      originArr: Float32Array,
      explodeArr: Float32Array,
      explodeT: number,
      waveAmp: number,
      waveFreq: number,
      frameOff: number,
      frame: number,
      mxi: number,
      myi: number,
    ) => {
      const pos = geo.attributes.position;
      const breathe = 1 + Math.sin(frame * 1.3 + frameOff) * 0.025;
      for (let i = 0; i < pos.count; i++) {
        const ox = originArr[i * 3],
          oy = originArr[i * 3 + 1],
          oz = originArr[i * 3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const mouseDot = (ox / len) * mxi * 0.5 + (oy / len) * myi * 0.5;
        const pushScale = 1 + mouseDot * 0.12;
        const wave =
          Math.sin(ox * waveFreq + frame * 2.2 + frameOff) *
          Math.cos(oy * waveFreq + frame * 1.7 + frameOff) *
          Math.sin(oz * waveFreq + frame * 1.9 + frameOff);
        const s = breathe * pushScale * (1 + wave * waveAmp);
        const bx = ox * s, by = oy * s, bz = oz * s;
        const ex = explodeArr[i * 3],
          ey = explodeArr[i * 3 + 1],
          ez = explodeArr[i * 3 + 2];
        pos.setXYZ(i, bx + (ex - bx) * explodeT, by + (ey - by) * explodeT, bz + (ez - bz) * explodeT);
      }
      pos.needsUpdate = true;
    };

    let frame = 0;
    let outerExplodeRender = 0;
    let innerExplodeRender = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      (animate as any)._id = id;
      frame += 0.004;

      group.position.x += (sphereState.groupX - group.position.x) * 0.08;
      group.rotation.y += (sphereState.rotateY - group.rotation.y) * 0.08;

      outerExplodeRender += (sphereState.outerExplode - outerExplodeRender) * 0.1;
      innerExplodeRender += (sphereState.innerExplode - innerExplodeRender) * 0.1;

      const outerExplodeT = outerExplodeRender;
      const innerExplodeT = innerExplodeRender;
      const outerOpacity = outer.baseOpacity * (1 - outerExplodeT * 0.85);
      const innerOpacity = inner.baseOpacity * (1 - innerExplodeT * 0.85);

      ring1.mat.opacity = ring1.baseOpacity * clamp01(1 - outerExplodeT);
      ring2.mat.opacity = ring2.baseOpacity * clamp01(1 - outerExplodeT);
      ring3.mat.opacity = ring3.baseOpacity * clamp01(1 - innerExplodeT);

      morphSphere(outer.geo, outer.originPos, outer.explodeTargets, outerExplodeT, 0.06, 1.8, 0, frame, mx, my);
      morphSphere(inner.geo, inner.originPos, inner.explodeTargets, innerExplodeT, 0.1, 2.4, 1.8, frame, mx, my);

      outer.mat.opacity = outerOpacity;
      inner.mat.opacity = innerOpacity;

      outer.mesh.rotation.y = frame * 0.08 + mx * 0.15;
      outer.mesh.rotation.x = frame * 0.04 + my * 0.1;
      inner.mesh.rotation.y = -frame * 0.13 - mx * 0.11;
      inner.mesh.rotation.x = -frame * 0.08 + my * 0.09;
      ring1.mesh.rotation.y = frame * 0.12 + mx * 0.08;
      ring2.mesh.rotation.z = frame * 0.07;
      ring3.mesh.rotation.y = -frame * 0.15 - mx * 0.1;
      ring3.mesh.rotation.x = frame * 0.09;

      const pAttr = pGeo.attributes.position;
      const maxExplode = Math.max(outerExplodeT, innerExplodeT);
      for (let i = 0; i < pCount; i++) {
        const ox = pOrigins[i * 3],
          oy = pOrigins[i * 3 + 1],
          oz = pOrigins[i * 3 + 2];
        const r = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const scatter = 1 + maxExplode * pSpeeds[i] * 6;
        pAttr.setXYZ(
          i,
          (ox / r) * r * scatter + Math.sin(frame * 0.8 + i) * 0.04,
          (oy / r) * r * scatter + Math.cos(frame * 1.1 + i) * 0.04,
          (oz / r) * r * scatter,
        );
      }
      pAttr.needsUpdate = true;
      pMat.opacity = 0.65 - maxExplode * 0.5;
      pMat.color.setHex(innerExplodeT > 0.1 ? 0xffffff : 0x9b94ff);
      particles.rotation.y = frame * 0.06 + mx * 0.05;
      particles.rotation.x = my * 0.04;

      // ── mouse parallax artık grup üzerinden değil camera üzerinden ───────
      // (group sağa kayarken kamera da takip etsin ama daha az miktarda)
      camera.position.x += (mx * 0.6 + group.position.x * 0.15 - camera.position.x) * 0.05;
      camera.position.y += (my * 0.35 - camera.position.y) * 0.05;
      // ─────────────────────────────────────────────────────────────────────
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame((animate as any)._id);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [loaded, canvasRef]);
}