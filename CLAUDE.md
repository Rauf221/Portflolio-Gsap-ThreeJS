# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
npx tsc --noEmit # type-check (must pass clean before any commit)
```

There are no test files in this project. Verification is: `npm run build` + `npx tsc --noEmit` clean, plus a manual scroll-through in the dev server.

## Architecture Overview

Single-page, scroll-driven portfolio: **Next.js App Router**, **GSAP + ScrollTrigger**, **Three.js**, **Lenis**. All three routes are statically generated.

### Entry Points

- `src/app/page.tsx` — root route, renders `Portfolio`
- `src/app/portfolio/Portfolio.tsx` — **main orchestrator**: holds every DOM ref, mounts all sections, calls the lifecycle hooks in a fixed order, and owns the load-failure downgrade path (failed script load → preloader exits via CSS fallback, scroll unlocks, page stays readable)
- `src/app/about/AboutPage.tsx` — separate "mystic" page with its own styling and its own GSAP context (scoped; `ctx.revert()` on unmount)

### Hook Initialization Order (in `Portfolio.tsx`)

The order matters — each hook depends on the previous completing:

1. `useLoadPortfolioScripts` — dynamic-imports three + gsap + ScrollTrigger + DrawSVG, registers plugins, sets `window.THREE/gsap/ScrollTrigger` (typed in `src/globals.ts`, no `any`), sets `loaded`; reports failure to the caller
2. `usePortfolioLenis(loaded)` — Lenis smooth scroll, synced with GSAP's ticker
3. `usePortfolioThree(canvasRef, loaded)` — the morphing sphere scene
4. `usePortfolioCursor(...)` — custom cursor (self-disables on `(hover: none), (pointer: coarse)`)
5. `usePortfolioGsap(loaded, refs, setActiveSection)` — **thin orchestrator** (~200 lines) that owns the two-phase lifecycle and delegates every section to `src/animations/`

### Animation Modules (`src/animations/`)

One module per section, each owning its constants next to the only code that reads them. All are called from inside `usePortfolioGsap`'s `gsap.context()`, so `ctx.revert()` cleans everything up:

| Module | Owns |
|---|---|
| `heroIntro.ts` | one-shot entrance timeline (Phase A — **must not create ScrollTriggers**; nothing may force a refresh while the preloader reveal plays) |
| `hero.ts` | hero pin behind About, parallax, overlay fade, dock rise |
| `about.ts` | About reveals + scrubbed RH-mark DrawSVG |
| `skills.ts` | Skills pin: headline fly-in (`containerAnimation`), carousel, and the sphere choreography (a pure function of pin progress — see below) |
| `projectsPath.ts` | curve-written headline, camera, curtain; returns a disposer the hook must call |
| `projectsPanels.ts` | diagonal panel swaps, info reveals, video play/pause discipline |
| `experienceGravity.ts` | gravity-playground pin: hand-rolled Z-axis physics (cards fall out of the deep toward the camera), pointer catch/throw, HUD counter (CSS 3D cards; the air is WebGL). Returns a disposer — it owns a rAF, raw listeners and class toggles that `ctx.revert()` can't see |
| `footer.ts` | footer reveals + dock step-aside |
| `chrome.ts` | progress bar, section-bg drift, active-section tracking |

Two-phase lifecycle in the hook: **Phase A** = entrance tweens only, created immediately on `loaded`; **Phase B** = all ScrollTriggers, created in document order (pins must register top-down). Scroll stays locked until the preloader finishes (`introDone`).

### Shared State Singletons (`src/lib/`)

| File | Purpose |
|---|---|
| `sphereState.ts` | GSAP writes target values; the Three.js loop lerps toward them each frame. Sphere choreography is deliberately **stateless math over pin progress**, not scrubbed tweens — one writer per property, reverse-scroll correct for free |
| `hallState.ts` | same pattern for the Experience section's atmosphere shader (progress + active); the gravity sim also idles off `active` |
| `lenisInstance.ts` / `scroll.ts` | Lenis singleton + imperative scroll helpers |
| `viewport.ts` | `DESKTOP_REFERENCE_HEIGHT` (frozen hero render height) and `HALL_FLAT_MEDIA` (the one query both the hall choreography and its canvas must agree on) |

### Three.js Setup

- three comes from **npm (0.18x)** everywhere; `window.THREE` is the shared instance so only one copy ships (in an async chunk, not First Load JS)
- **Skill tiles share ONE WebGLRenderer** (module singleton in `SkillModelViewer.tsx`): each tile renders into the shared buffer and blits to its own 2D canvas via `drawImage`. The page holds **max 3 WebGL contexts** (sphere, hall, tiles). Never give tiles their own renderer — browsers cap ~16 contexts and evict the oldest
- All scenes guard renderer creation with try/catch (no WebGL → degraded, not broken), dispose everything on unmount, clamp DPR, and gate their render loops on visibility state
- GLBs are meshopt-compressed in `/public/3d models/`; materials are converted to `MeshBasicMaterial`
- Per-frame-morphed attributes carry `DynamicDrawUsage`

### Content & Data

- `src/content/site.ts` — all UI copy
- `src/data/portfolioMeta.ts` — `PROJECTS_META`, `SKILLS_META` (with `.glb` paths + per-model tuning), `EXPERIENCE_META`

### Styles

- Fonts: **Hanken Grotesk self-hosted via `next/font`** in `layout.tsx`, published as `--font-hanken` and consumed through `--font-sans-project`. Never add a Google Fonts `<link>`/`@import` for it
- `src/app/globals.css` — Tailwind import + base tokens
- `src/styles/globalCssString.ts` — the portfolio page's CSS as a **JS template literal** (injected by `PortfolioStyles`); no backticks allowed inside. Tokens: `--indigo` is the single source for the brand purple (`--sphere` is an alias); `--noise` holds the shared grain tile
- `ExperienceSection` and `SiteFooter` carry scoped inline `<style>` blocks; `AboutPage` has its own separate style string

### Next.js Notes

- `next.config.ts` transpiles `@fiddle-digital/string-tune`
- Path alias `@/*` → `src/*`
- Bundle analysis: `npx next experimental-analyze` (Turbopack-native; do NOT install `@next/bundle-analyzer`, it's webpack-only)
- Before editing any Next.js-specific API, read the relevant guide in `node_modules/next/dist/docs/` — this version may differ from training data

## Don't do this

- **No barrel files** (`index.ts` re-exports) — they were removed deliberately; import modules directly
- **No `any`** — `window.gsap/ScrollTrigger/THREE` are properly typed in `src/globals.ts`
- **Don't import `unicornstudio-react` statically** — its SDK is ~1.4 MB; `UnicornHeroBackground` must stay behind `next/dynamic` + `ssr: false` (the preloader covers its load). Same for anything importing three
- **Don't create ScrollTriggers in Phase A** (`heroIntro.ts`) or reorder Phase B's init calls without a reason — pins must register in document order
- **Don't convert the panels' sticky stage to a GSAP pin** — `.projects-after-path` carries `margin-top: -100vh` under an existing pin; a second pin-spacer makes ScrollTrigger's measurements unstable (see comments in `ProjectsSection`)
- **Don't compute the panel trigger bounds from rects** — the curtain translates their container on Y; use the `offsetTop` walk that's already there
- **Don't snap the panel swaps** — tried and removed; it fights the user
- **Don't hardcode the sphere's act-break point** — it's measured live from headline width and card geometry (`swiperOnScreen` in `animations/skills.ts`) and must stay measured
- **Keep the two reciprocal media scales in sync** — if `PROJECTS_MEDIA_PARKED_SCALE` changes, its `1/x` counter-scale must follow (that reciprocal is what makes the reveal read as an unfold, not a zoom)
- **Keep the Experience "past the eye" threshold (`NEAR_MISS`, 900) below the `.grav` CSS `perspective` (1400)** — at z ≥ perspective CSS stops drawing the card; the perspective value is also hardcoded as `P` in `experienceGravity.ts` and the two must agree
- **Don't touch DOM nodes created by hand inside gsap.context and expect revert() to remove them** — clear them explicitly (see the glyph clearing in `projectsPath.ts`)
- **Respect `prefers-reduced-motion`** — every new one-shot reveal must either skip its tweens (from-tweens at rest = the no-motion presentation) or provide a flat variant like the hall's `exp--flat`
- The zoom-compensation logic in `usePortfolioThree` and `UnicornHeroBackground` is subtle and heavily commented — read the comments fully before editing either copy
