# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

There are no test files in this project.

## Architecture Overview

This is a single-page, scroll-driven portfolio built with **Next.js App Router**, **GSAP**, **Three.js**, and **Lenis**.

### Entry Points

- `src/app/page.tsx` — root route, renders `Portfolio`
- `src/app/portfolio/Portfolio.tsx` — **main orchestrator**: mounts all section components, holds all `useRef`s for DOM elements, and calls every animation/lifecycle hook in a fixed initialization order

### Hook Initialization Order (in `Portfolio.tsx`)

The order matters — each hook depends on the previous completing:

1. `useLoadPortfolioScripts` — imports GSAP plugins, registers them, sets `window.gsap` / `window.ScrollTrigger`, sets `loaded = true`
2. `usePortfolioLenis(loaded)` — creates the Lenis smooth-scroll instance, syncs it with ScrollTrigger's ticker
3. `usePortfolioThree(canvasRef, loaded)` — creates the Three.js scene (sphere, rings, particles)
4. `usePortfolioCursor(...)` — tracks mouse, lerps a custom cursor element
5. `usePortfolioGsap(loaded, refs, setActiveSection)` — registers **all** GSAP timelines and ScrollTriggers; this is the largest hook (~850 lines, `src/hooks/usePortfolioGsap.ts`)

### Animation Architecture (`usePortfolioGsap.ts`)

All scroll-driven animation lives here. Key areas:

- **Hero** — character-level text split via `splitGraphemes()`, staggered entrance; sphere moves right on scroll exit
- **Skills** — 14-character headline with per-character easing arrays (`SKILLS_HEADLINE_CHAR_FROM`); horizontal carousel pinned with `containerAnimation`; card metrics computed from `vw`
- **Projects** — SVG text written on a curved path as the user scrolls; camera pans/zooms (`PROJECTS_PATH_POV_SCALE`); sticky overlay curtain rises from bottom
- **About** — horizontal scroll with String-Tune parallax/glide text effects
- **3D Sphere** — `sphereState` singleton (`src/lib/sphereState.ts`) is the bridge: GSAP writes target values, Three.js reads them each frame

### Shared State Singletons

| File | Purpose |
|------|---------|
| `src/lib/sphereState.ts` | Mutable object that GSAP animates; Three.js renders from it each frame |
| `src/lib/lenisInstance.ts` | Singleton Lenis instance shared across hooks |
| `src/lib/scroll.ts` | Thin wrapper around `lenisInstance` for imperative scroll calls |

### Content & Data

- `src/content/site.ts` — all UI copy (hero text, nav labels, skill names, project descriptions)
- `src/data/portfolioMeta.ts` — structured metadata: `PROJECTS_META`, `SKILLS_META` (with `.glb` paths), `EXPERIENCE_META`

### Styles

Styles come from two places:
- `src/app/globals.css` — CSS variables (`--indigo`, `--sphere`, etc.), keyframes, font imports
- `src/styles/globalCssString.ts` — a large string of CSS injected at runtime via `src/styles/PortfolioStyles.tsx`; this is where section layouts, sticky panels, and SVG path animations live

### Three.js Setup

- Scene lives in `usePortfolioThree.ts`: icosahedron wireframe spheres, torus rings, 420 surface particles
- **GLB models** are loaded on-demand in `SkillModelViewer.tsx` from `/public/3d models/`; materials are converted to `MeshBasicMaterial` (no lights required)
- Three.js is loaded via CDN (`r128`) in `useLoadPortfolioScripts`; npm three is used for type imports only

### Next.js Notes

- `next.config.ts` transpiles `@fiddle-digital/string-tune` (required for that package to work in Next.js)
- Path alias `@/*` maps to `src/*`
- The `deneme1/` directory is excluded from TypeScript compilation (test scratchpad)
- Before editing any Next.js-specific API, read the relevant guide in `node_modules/next/dist/docs/` — this version may differ from training data
