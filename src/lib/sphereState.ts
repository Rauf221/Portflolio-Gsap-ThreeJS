/** GSAP animates these; Three.js reads groupX each frame. Scene group origin stays 0. */
export const SPHERE_HERO_X = 6.2;
export const SPHERE_ABOUT_X = -6.2;
export const SPHERE_CENTER_X = 0;

export const sphereState = {
  groupX: SPHERE_HERO_X,
  rotateY: 0,
  outerExplode: 0,
  innerExplode: 0,
};

export function resetSphereState() {
  sphereState.groupX = SPHERE_HERO_X;
  sphereState.rotateY = 0;
  sphereState.outerExplode = 0;
  sphereState.innerExplode = 0;
}
