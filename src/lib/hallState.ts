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
  /** Vanishing-point height as a fraction of stage height, CSS-style (from
   *  the top). Animated by the entry trigger in experienceGravity — it rides
   *  from 0.10 down to 0.33 as the section slides up to fill the screen —
   *  and read every frame by the atmosphere shader, so the WebGL tunnel and
   *  the CSS perspective always agree on one tip. */
  originY: 0.33,
  /** Whether any of the Experience section is on screen (not just the pin) —
   *  both the atmosphere's render loop and the gravity sim idle when false. */
  active: false,
};

export function resetHallState() {
  hallState.progress = 0;
  hallState.originY = 0.33;
  hallState.active = false;
}
