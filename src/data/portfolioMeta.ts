export const PROJECTS_META = [
  { id: 1, key: "burdaqal", color: "#6C63FF", year: "2024" },
  { id: 2, key: "develup", color: "#9b94ff", year: "2023" },
  { id: 3, key: "wayouth", color: "#FF6B6B", year: "2024" },
  { id: 4, key: "portfolioLab", color: "#FFD93D", year: "2025" },
  { id: 5, key: "bakuFlames", color: "#A8FF78", year: "2024" },
  { id: 6, key: "gbaru", color: "#6C63FF", year: "2024" },
  { id: 7, key: "fonderra", color: "#9b94ff", year: "2023" },
] as const;

export const EXPERIENCE_META = [
  { key: "burdaqal" },
  { key: "develup" },
  { key: "wayouth" },
  { key: "bakuFlames" },
] as const;

const MODEL_BASE = "/3d%20models";

export type SkillModelTune = {
  scale?: number;
  /** Base euler correction in radians [x, y, z] before mouse rotation */
  rotation?: readonly [number, number, number];
  cameraZ?: number;
};

export const SKILLS_META = [
  { key: "reactNext", level: 97, categoryKey: "frontend", modelPath: `${MODEL_BASE}/react_logo_circle.glb` },
  { key: "vue", level: 89, categoryKey: "frontend", modelPath: `${MODEL_BASE}/vue-logo.glb` },
  { key: "typescript", level: 94, categoryKey: "language", modelPath: `${MODEL_BASE}/ts-logo.glb` },
  { key: "realtime", level: 87, categoryKey: "backend", modelPath: `${MODEL_BASE}/js-logo.glb` },
  {
    key: "nextInfra",
    level: 92,
    categoryKey: "frontend",
    modelPath: `${MODEL_BASE}/Meshy_AI_Obsidian_N_0525104334_texture.glb`,
    modelTune: { scale: 2.65, cameraZ: 4.6 },
  },
  { key: "nodeJs", level: 88, categoryKey: "backend", modelPath: `${MODEL_BASE}/node-js-logo.glb` },
  {
    key: "editorsCms",
    level: 86,
    categoryKey: "cms",
    modelPath: `${MODEL_BASE}/html5_logo.glb`,
    modelTune: { rotation: [0, -Math.PI / 2, 0], scale: 2.35 },
  },
  { key: "css3", level: 90, categoryKey: "frontend", modelPath: `${MODEL_BASE}/css-3d.glb` },
  { key: "deploy", level: 85, categoryKey: "devops", modelPath: `${MODEL_BASE}/tailwindcss-logo.glb` },
  {
    key: "threeGsap",
    level: 90,
    categoryKey: "creative",
    modelPath: `${MODEL_BASE}/threejs.glb`,
    modelTune: { scale: 2.35, cameraZ: 4.4 },
  },
  { key: "tanstackFirebase", level: 88, categoryKey: "data", modelPath: `${MODEL_BASE}/firebase-logo.glb` },
  { key: "blender", level: 84, categoryKey: "creative", modelPath: `${MODEL_BASE}/blender-logo.glb` },
  { key: "cLang", level: 82, categoryKey: "language", modelPath: `${MODEL_BASE}/c-logo.glb` },
  { key: "cpp", level: 83, categoryKey: "language", modelPath: `${MODEL_BASE}/cpp-logo.glb` },
] as const;

export const CONTACT_SOCIAL_KEYS = ["github", "twitter", "linkedin", "dribbble"] as const;
