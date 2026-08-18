import { hallState, resetHallState } from "../lib/hallState";
import { prefersFlatHall } from "../lib/viewport";

/* ── Experience: the gravity playground ─────────────────────────────────────
 * Gravity points at the reader. Cards spawn deep in Z near the centre of the
 * frame and fall toward the camera, tumbling; the reader catches one by
 * pressing and holding, at which point it stops falling, swims up to a
 * readable plane and follows the pointer. Release throws it with the
 * pointer's velocity — a hard fling shoves it back into the deep before
 * gravity turns it around. A card that flies past the eye respawns.
 *
 * This module owns the DOM half only: a hand-rolled integrator writing
 * transforms. The air (light, haze, grain) stays the single shader in
 * ExperienceHallAtmosphere, which idles off hallState.active exactly as it
 * did for the hall. The cards stay DOM because they are rectangles with text
 * on them — CSS 3D draws that as well as WebGL would, and the text stays
 * selectable, crawlable and screen-readable.
 *
 * Unlike the scrubbed sections this is NOT a pure function of pin progress —
 * a physics sim is inherently stateful. Scroll only meters how many cards are
 * unlocked; everything created here that gsap.context can't revert (rAF,
 * listeners, classLists, raw style writes) is undone by the returned
 * disposer. */

/** Gravity along +Z (toward the eye), px/s². */
const GZ = 900;
/** Air drag on the fall axis, 1/s — with GZ this caps terminal vz ≈ 1800. */
const DRAG_Z = 0.5;
/** Drag on lateral drift and on spin. */
const DRAG_XY = 1.4;
const ANG_DRAG = 0.35;
/** Restoring push (deg/s²) once a card tips far enough to show its back. */
const ANGLE_SPRING = 140;
const TILT_LIMIT_X = 28;
const TILT_LIMIT_Y = 26;
/** Hard caps so a wild fling can never explode the sim. */
const VZ_MAX = 2000;
const V_XY_MAX = 900;
const W_MAX = 120;
/** Spawn depth (± jitter). Deep enough that a card is born tiny and hazy. */
const SPAWN_Z = -3600;
const SPAWN_Z_JITTER = 400;
/** Where a held card floats: close, fully readable, comfortably inside the
 *  frame. */
const HOLD_Z = 120;
/** Past the eye. Must stay below the CSS `perspective` (1400) on .grav — at
 *  z = perspective the card is level with the eye and CSS stops drawing it. */
const NEAR_MISS = 900;
/** Depth-tier thresholds — class toggles, not per-frame styles. */
const DEEP_Z = -1500;
const NEAR_Z = -400;
/** Follow/spring rates while held, 1/s. */
const FOLLOW = 14;
const ZSPRING = 10;
/** Throw tuning. */
const THROW_GAIN = 0.9;
const THROW_MAX = 1600;
/** Pacing: one spawn at a time, misses come back after a beat. */
const SPAWN_STAGGER = 900;
const RESPAWN_DELAY_MIN = 900;
const RESPAWN_DELAY_VAR = 1200;
/** Pin progress per unlocked card — the last third of the pin is pure play. */
const UNLOCK_STEP = 0.22;
/** Fixed physics timestep. */
const H = 1 / 120;

type Phase = "idle" | "falling" | "held";

type Body = {
  el: HTMLElement;
  haze: HTMLElement | null;
  phase: Phase;
  /** Card centre on the z=0 layout plane, stage px. */
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  wx: number;
  wy: number;
  wz: number;
  halfW: number;
  halfH: number;
  respawnAt: number;
  caught: boolean;
  /** Current depth-tier class ("", "deep" or "near") to avoid class churn. */
  tier: string;
};

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const clamp01 = (v: number) => clamp(v, 0, 1);
// smoothstep between two z depths
const band = (a: number, b: number, z: number) => {
  const t = clamp01((z - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function initExperienceGravity(
  root: HTMLElement,
  gsap: typeof window.gsap,
): () => void {
  const stage = root.querySelector(".grav") as HTMLElement | null;
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".grav-card"));
  const hud = root.querySelector(".grav-hud") as HTMLElement | null;
  const countNum = root.querySelector(".grav-count-num") as HTMLElement | null;
  if (!stage || !cards.length) return () => {};

  // Reduced motion or narrow viewports fall back to a plain readable stack: no
  // pin, no physics, no listeners. The atmosphere canvas checks the same query
  // and refuses to mount, so the GPU cost disappears with the choreography.
  if (prefersFlatHall()) {
    root.classList.add("exp--flat");
    resetHallState();
    gsap.set(cards, { clearProps: "all" });
    return () => {
      root.classList.remove("exp--flat");
    };
  }

  const N = cards.length;
  const P = 1400; // must match .grav { perspective } in ExperienceSection

  /* ── Measure ── */
  let stageRect = stage.getBoundingClientRect();
  let stageW = stageRect.width;
  let stageH = stageRect.height;
  // Perspective origin — must match .grav { perspective-origin: 50% 42% }.
  let ox = stageW * 0.5;
  let oy = stageH * 0.42;

  const bodies: Body[] = cards.map((el) => ({
    el,
    haze: el.querySelector(".grav-haze") as HTMLElement | null,
    phase: "idle",
    x: 0,
    y: 0,
    z: SPAWN_Z,
    vx: 0,
    vy: 0,
    vz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    wx: 0,
    wy: 0,
    wz: 0,
    halfW: el.offsetWidth / 2,
    halfH: el.offsetHeight / 2,
    respawnAt: 0,
    caught: false,
    tier: "",
  }));

  const measure = () => {
    stageRect = stage.getBoundingClientRect();
    stageW = stageRect.width;
    stageH = stageRect.height;
    ox = stageW * 0.5;
    oy = stageH * 0.42;
    bodies.forEach((b) => {
      b.halfW = b.el.offsetWidth / 2;
      b.halfH = b.el.offsetHeight / 2;
    });
  };

  /* ── Interaction state ── */
  let heldIdx = -1;
  let heldPointerId = -1;
  let grabOffX = 0;
  let grabOffY = 0;
  // Pointer position in stage coordinates (screen plane, z = 0 projection).
  let px = 0;
  let py = 0;
  // Previous held-card position, for the tilt-from-motion read.
  let prevHeldX = 0;
  let prevHeldY = 0;
  /** Short pointer history for the throw velocity (≤ ~120 ms). */
  const samples: { x: number; y: number; t: number }[] = [];

  let caughtCount = 0;
  let nextSpawnAt = 0;

  /* Projection helper: a world point at depth z appears on screen at
   * origin + (world - origin) · P/(P - z). Inverting it puts the card centre
   * exactly under the pointer at ANY depth — without this, grabbing a deep
   * card would make it jump sideways as it swims up to the hold plane. */
  const toWorld = (sx: number, sy: number, z: number): [number, number] => {
    const f = (P - z) / P;
    return [ox + (sx - ox) * f, oy + (sy - oy) * f];
  };

  const updatePointer = (e: PointerEvent) => {
    px = e.clientX - stageRect.left;
    py = e.clientY - stageRect.top;
  };

  const pushSample = (e: PointerEvent) => {
    const t = performance.now();
    samples.push({ x: e.clientX, y: e.clientY, t });
    while (samples.length > 6 || (samples.length && t - samples[0].t > 120)) {
      samples.shift();
    }
  };

  /* ── Spawning ── */
  const spawn = (b: Body, now: number) => {
    b.phase = "falling";
    b.z = SPAWN_Z + (Math.random() * 2 - 1) * SPAWN_Z_JITTER;
    // Born in a centre band, clear of the HUD corners.
    b.x = stageW * (0.3 + Math.random() * 0.4);
    b.y = stageH * (0.32 + Math.random() * 0.3);
    b.vx = (Math.random() * 2 - 1) * 40;
    b.vy = (Math.random() * 2 - 1) * 30;
    b.vz = 120 + Math.random() * 180;
    b.rx = (Math.random() * 2 - 1) * 12;
    b.ry = (Math.random() * 2 - 1) * 12;
    b.rz = (Math.random() * 2 - 1) * 8;
    b.wx = (Math.random() * 2 - 1) * 26;
    b.wy = (Math.random() * 2 - 1) * 30;
    b.wz = (Math.random() * 2 - 1) * 16;
    b.el.classList.remove("grav-card--idle");
    nextSpawnAt = now + SPAWN_STAGGER;
  };

  const park = (b: Body, now: number) => {
    b.phase = "idle";
    b.respawnAt = now + RESPAWN_DELAY_MIN + Math.random() * RESPAWN_DELAY_VAR;
    b.el.classList.add("grav-card--idle");
    b.el.style.opacity = "0";
    if (b.haze) b.haze.style.opacity = "0";
  };

  /** Scroll meters the cast: card i may fly once progress passes i·0.22, so
   *  the set fills as the reader scrolls and thins again on the way back up.
   *  Airborne or held cards are never yanked — a locked card simply stops
   *  respawning. */
  const unlockCount = () =>
    clamp(Math.floor(hallState.progress / UNLOCK_STEP) + 1, 1, N);

  const trySpawn = (now: number) => {
    if (now < nextSpawnAt) return;
    const limit = unlockCount();
    let pick: Body | null = null;
    for (let i = 0; i < limit; i++) {
      const b = bodies[i];
      if (b.phase !== "idle" || now < b.respawnAt) continue;
      if (!pick || b.respawnAt < pick.respawnAt) pick = b;
    }
    if (pick) spawn(pick, now);
  };

  /* ── Catch / throw ── */
  const onCaught = (b: Body) => {
    if (b.caught) return;
    b.caught = true;
    caughtCount++;
    if (countNum) {
      countNum.textContent = `${String(caughtCount).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
    }
    if (caughtCount >= N && hud) hud.classList.add("grav-hud--done");
  };

  const releaseHeld = (throwIt: boolean) => {
    if (heldIdx === -1) return;
    const b = bodies[heldIdx];
    try {
      b.el.releasePointerCapture(heldPointerId);
    } catch {
      /* capture may already be gone */
    }
    b.el.classList.remove("grav-card--held");
    document.body.classList.remove("grav-dragging");
    b.phase = "falling";

    if (throwIt && samples.length >= 2) {
      const a = samples[0];
      const c = samples[samples.length - 1];
      const dt = (c.t - a.t) / 1000;
      if (dt > 0.01) {
        b.vx = clamp(((c.x - a.x) / dt) * THROW_GAIN, -THROW_MAX, THROW_MAX);
        b.vy = clamp(((c.y - a.y) / dt) * THROW_GAIN, -THROW_MAX, THROW_MAX);
        const speed = Math.hypot(b.vx, b.vy);
        // A hard fling shoves the card back into the deep; gravity brings it
        // around again. A gentle release just resumes the fall.
        b.vz = clamp(-speed * 0.35, -700, 0);
        b.wz = clamp(b.vx * 0.05, -W_MAX, W_MAX);
        b.wx = (Math.random() * 2 - 1) * 20;
        b.wy = (Math.random() * 2 - 1) * 24;
      }
    } else {
      b.vx = 0;
      b.vy = 0;
      b.vz = 60;
    }
    heldIdx = -1;
    heldPointerId = -1;
    samples.length = 0;
  };

  /* ── Listeners (one AbortController owns every one of them) ── */
  const abort = new AbortController();
  const { signal } = abort;

  cards.forEach((el, i) => {
    el.addEventListener(
      "pointerdown",
      (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const b = bodies[i];
        if (heldIdx !== -1 || b.phase !== "falling") return;
        e.preventDefault();
        // The pin holds the stage still while active, but re-measuring on
        // every grab keeps pointer math honest across refreshes.
        measure();
        updatePointer(e);
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* capture is an optimisation, not a requirement */
        }
        heldIdx = i;
        heldPointerId = e.pointerId;
        // Grab offset lives in the same perspective-corrected space as the
        // follow target, so the card never jumps under the cursor.
        const [wx, wy] = toWorld(px, py, b.z);
        grabOffX = wx - b.x;
        grabOffY = wy - b.y;
        prevHeldX = b.x;
        prevHeldY = b.y;
        b.phase = "held";
        b.wx = 0;
        b.wy = 0;
        b.wz = 0;
        el.classList.add("grav-card--held");
        document.body.classList.add("grav-dragging");
        samples.length = 0;
        pushSample(e);
        onCaught(b);
      },
      { signal },
    );
  });

  window.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      if (heldIdx === -1 || e.pointerId !== heldPointerId) return;
      updatePointer(e);
      pushSample(e);
    },
    { signal },
  );
  window.addEventListener(
    "pointerup",
    (e: PointerEvent) => {
      if (e.pointerId !== heldPointerId) return;
      releaseHeld(true);
    },
    { signal },
  );
  window.addEventListener(
    "pointercancel",
    (e: PointerEvent) => {
      if (e.pointerId !== heldPointerId) return;
      releaseHeld(false);
    },
    { signal },
  );
  window.addEventListener("resize", measure, { signal });

  const ro = new ResizeObserver(measure);
  ro.observe(stage);

  /* ── Integration ── */
  const stepFalling = (b: Body) => {
    b.vz = clamp((b.vz + GZ * H) * Math.exp(-DRAG_Z * H), -VZ_MAX, VZ_MAX);
    b.vx = clamp(b.vx * Math.exp(-DRAG_XY * H), -V_XY_MAX, V_XY_MAX);
    b.vy = clamp(b.vy * Math.exp(-DRAG_XY * H), -V_XY_MAX, V_XY_MAX);
    b.x += b.vx * H;
    b.y += b.vy * H;
    b.z += b.vz * H;

    // Soft walls keep thrown cards in the frame instead of losing them.
    const xMin = stageW * 0.15;
    const xMax = stageW * 0.85;
    const yMin = stageH * 0.22;
    const yMax = stageH * 0.8;
    if (b.x < xMin) {
      b.x = xMin;
      b.vx *= -0.55;
    } else if (b.x > xMax) {
      b.x = xMax;
      b.vx *= -0.55;
    }
    if (b.y < yMin) {
      b.y = yMin;
      b.vy *= -0.55;
    } else if (b.y > yMax) {
      b.y = yMax;
      b.vy *= -0.55;
    }

    // Tumble — with a restoring push once a face tips far enough that the
    // card would show its back. The text must stay legible mid-fall.
    if (b.rx > TILT_LIMIT_X) b.wx -= ANGLE_SPRING * H;
    else if (b.rx < -TILT_LIMIT_X) b.wx += ANGLE_SPRING * H;
    if (b.ry > TILT_LIMIT_Y) b.wy -= ANGLE_SPRING * H;
    else if (b.ry < -TILT_LIMIT_Y) b.wy += ANGLE_SPRING * H;
    const angDrag = Math.exp(-ANG_DRAG * H);
    b.wx = clamp(b.wx * angDrag, -W_MAX, W_MAX);
    b.wy = clamp(b.wy * angDrag, -W_MAX, W_MAX);
    b.wz = clamp(b.wz * angDrag, -W_MAX, W_MAX);
    b.rx += b.wx * H;
    b.ry += b.wy * H;
    b.rz += b.wz * H;
  };

  const stepHeld = (b: Body) => {
    // Swim up to the readable plane…
    b.z += (HOLD_Z - b.z) * (1 - Math.exp(-ZSPRING * H));
    // …and follow the pointer in the perspective-corrected plane.
    const [wx, wy] = toWorld(px, py, b.z);
    const k = 1 - Math.exp(-FOLLOW * H);
    b.x += (wx - grabOffX - b.x) * k;
    b.y += (wy - grabOffY - b.y) * k;

    // Tilt from motion: the card banks the way it is being moved, like a
    // plate carried across a room.
    const ivx = (b.x - prevHeldX) / H;
    const ivy = (b.y - prevHeldY) / H;
    prevHeldX = b.x;
    prevHeldY = b.y;
    const tk = 1 - Math.exp(-10 * H);
    b.ry += (clamp(ivx * 0.035, -16, 16) - b.ry) * tk;
    b.rx += (clamp(-ivy * 0.03, -14, 14) - b.rx) * tk;
    // Spin settles to the nearest upright turn.
    const rzTarget = Math.round(b.rz / 360) * 360;
    b.rz += (rzTarget - b.rz) * tk;
  };

  /* ── Render ── */
  const render = (b: Body) => {
    const fadeIn = band(SPAWN_Z - 200, SPAWN_Z + 600, b.z);
    const fadeOut = 1 - band(300, NEAR_MISS, b.z);
    b.el.style.transform =
      `translate3d(${(b.x - b.halfW).toFixed(2)}px, ${(b.y - b.halfH).toFixed(2)}px, ${b.z.toFixed(2)}px) ` +
      `rotateX(${b.rx.toFixed(2)}deg) rotateY(${b.ry.toFixed(2)}deg) rotateZ(${b.rz.toFixed(2)}deg)`;
    b.el.style.opacity = (fadeIn * fadeOut).toFixed(3);
    if (b.haze) {
      b.haze.style.opacity = ((1 - band(-3000, -800, b.z)) * 0.9).toFixed(3);
    }

    // Depth tiers are class flips at thresholds, not per-frame filter writes.
    const tier = b.phase === "held" ? "" : b.z < DEEP_Z ? "deep" : b.z > NEAR_Z ? "near" : "";
    if (tier !== b.tier) {
      if (b.tier) b.el.classList.remove(`grav-card--${b.tier}`);
      if (tier) b.el.classList.add(`grav-card--${tier}`);
      b.tier = tier;
    }
  };

  /* ── The loop ── */
  let rafId = 0;
  let last = 0;
  let acc = 0;
  let disposed = false;

  const tick = (now: number) => {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);

    // Idle with the pin, exactly like the atmosphere canvas: keep scheduling,
    // do nothing. `last = 0` makes the first active frame a clean restart
    // instead of one giant catch-up step.
    if (document.hidden || !hallState.active) {
      last = 0;
      return;
    }
    if (!last) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    trySpawn(now);

    acc = Math.min(acc + dt, H * 4);
    while (acc >= H) {
      acc -= H;
      for (const b of bodies) {
        if (b.phase === "falling") stepFalling(b);
        else if (b.phase === "held") stepHeld(b);
      }
    }

    for (const b of bodies) {
      if (b.phase === "idle") continue;
      if (b.phase === "falling" && b.z >= NEAR_MISS) {
        park(b, now);
        continue;
      }
      render(b);
    }
  };
  rafId = requestAnimationFrame(tick);

  /* ── The pin ── */
  const st = window.ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    // Shorter than the hall's walk: the physics keeps playing the whole time,
    // so the pin only needs to be long enough to unlock the cast and leave
    // room to play.
    end: () => `+=${window.innerHeight * 3.2}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    onToggle: (self: { isActive: boolean; progress: number }) => {
      hallState.active = self.isActive;
      hallState.progress = self.progress;
      // Scrolled away mid-hold: let the card go gracefully — the sim idles
      // the moment `active` drops, so a held flag would otherwise stick.
      if (!self.isActive) releaseHeld(true);
    },
    onUpdate: (self: { progress: number }) => {
      hallState.progress = self.progress;
    },
  });

  /* ── Disposer — everything gsap.context can't see ── */
  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    releaseHeld(false);
    abort.abort();
    ro.disconnect();
    st.kill();
    document.body.classList.remove("grav-dragging");
    bodies.forEach((b) => {
      b.el.classList.remove(
        "grav-card--held",
        "grav-card--deep",
        "grav-card--near",
        "grav-card--idle",
      );
      b.el.style.transform = "";
      b.el.style.opacity = "";
      if (b.haze) b.haze.style.opacity = "";
    });
    if (hud) hud.classList.remove("grav-hud--done");
  };
}
