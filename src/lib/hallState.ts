/**
 * Bridge between the Experience pin's ScrollTrigger (writer) and the hall's
 * atmosphere shader (reader) — the same pattern as `sphereState`, kept separate
 * because the two scenes are independent.
 *
 * Deliberately two fields. The hall is a still, heavy space: the only thing the
 * atmosphere needs to know is how far down the hall the camera has walked, so
 * the light at the far end can strengthen as it is approached. There is no
 * scroll-velocity term here on purpose — nothing in this scene is supposed to
 * react to how hard you flick the wheel.
 */
export const hallState = {
  /** Pin progress, 0 → 1. */
  progress: 0,
  /** Whether the Experience pin owns the screen; the render loop idles when false. */
  active: false,
};

export function resetHallState() {
  hallState.progress = 0;
  hallState.active = false;
}
