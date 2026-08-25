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
- `src/app/works/WorksPage.tsx` — **the works archive** (`/works`), the page the home Projects section links out to. Same palette, type and motion vocabulary as the home page, but staged as a filterable index instead of a pinned sequence: the four-panel swap costs a viewport of pinned scroll per project, which is what stops scaling past a handful. Its own lighter stack — `useWorksScripts` (gsap + ScrollTrigger only, no three/DrawSVG) → `usePortfolioLenis` → `usePortfolioCursor` → `useWorksGsap`, all reused from the home page except the first and last. Reuses `ScrollProgress`, `CustomCursor` and `SiteFooter` (including `initFooterReveals`, passed `null` for the dock) so both pages close identically

### The works archive (`/works`)

| File | Owns |
|---|---|
| `data/worksMeta.ts` | the archive list — year, category, accent, optional clip, optional `href`. **This is the list meant to grow**; `key` joins it to `worksPage.items` in `content/site.ts`, which is where the copy lives (and which spreads `projects.items`, so a shared project is written once) |
| `animations/worksArchive.ts` | hero entrance (Phase A, no ScrollTriggers), per-card reveals, the rail counter, and the video discipline (returns a disposer — raw listeners) |
| `hooks/useWorksGsap.ts` | thin orchestrator, one `gsap.context()`, same two-phase order as `usePortfolioGsap` |
| `styles/worksCssString.ts` | the page's CSS as a JS template literal (no backticks inside), tokens deliberately **copied** from `globalCssString` rather than imported |
| `components/WorksSpiralHero.tsx` | the hero — a Three.js helix of project panels. Imports three statically, so it **must** stay behind `next/dynamic` + `ssr: false` |

The hero carries no text (the `<h1>` is `sr-only`). Each panel is a **slice of a cylinder** whose arc length is the tile width, not a plane, so the whole ring is one curved surface; a single normalised `t` in `[0,1)` sets both a panel's height on the helix and its rotation around it, and wrapping `t` is what makes the column endless. `poleFlare` pushes panels outward by the *square* of their height (pinched middle, flared ends), the corners are an SDF in the fragment shader (a texture mask would break under the vertex stage's curve), and the leftover scroll velocity is fed in as `wind`. Panels come from `WORKS_META` in order — `poster` where there is one, a canvas-drawn accent card where there isn't — and a list shorter than `MIN_TILES` is cycled, so the hero needs no maintenance as the archive grows. `public/works/*.jpg` are still frames pulled from the project clips with ffmpeg. The flat poster strip under the canvas is the no-WebGL/first-paint state; the scene's own `onReady` adds `.is-ready`, which cross-fades them — **never animate `.works-spiral`'s opacity from GSAP**, that fade owns it.

Filtering is a **Flip** (`gsap/Flip`, dynamically imported in the click handler): state captured, `flushSync` applies the React class change, `Flip.from` animates the reflow, and `ScrollTrigger.refresh()` runs on complete because the grid's height just changed. Card reveals use `once: true`, which is what makes hiding and re-showing a card safe.

### Project detail pages (`/works/[slug]`)

One statically generated page per entry in `WORKS_META` (`generateStaticParams` over its slugs; `slug` is a URL and must stay stable). `app/works/[slug]/page.tsx` is a server component that awaits `params` — a Promise in this version of Next — and owns the metadata; `WorkDetailPage.tsx` is the client half.

| File | Owns |
|---|---|
| `animations/workDetail.ts` | hero entrance + the scrubbed hero close, chapter reveals and number drift, the gallery fan, the stack spectrum (returns a disposer), the next-project panel |
| `hooks/useWorkDetailGsap.ts` | thin orchestrator; `slug` is in its dep list so a client-side navigation between two projects rebuilds the whole context |
| `styles/workDetailCssString.ts` | the page's CSS; shares tokens with `worksCssString` via `styles/worksTokens.ts` |
| `content/site.ts` → `workDetail` | labels + per-project narrative. **The narrative is a draft** written from the existing one-line summaries — see the warning above it |

Three pieces carry the page:

- **The hero closes.** The poster starts full-bleed and its `clip-path` inset is scrubbed into a rounded card while the image pushes in behind the crop. The open state must be written as `inset(0% round 0px)` in CSS — a clip-path only interpolates against a shape of the same kind, so animating from `none` would snap.
- **The gallery fans open.** A stack of screens spreads into a full 360° rosette while the stage is pinned. The entire layout is *one pivot and a set of rotations*: every card is anchored at the zero-size `.wd-fan-pivot` with `transform-origin: left bottom`, so `fanAngle(i, total) = -60 + (360/total) * i` is the only thing deciding where a card lands — which is why the rosette stays even at any number of screens. The pivot itself slides from `(-w/2, +h/2)` (the offset that centres the closed stack, derived rather than authored) to dead centre. The tween runs **backwards from the composed state**: resting angles live in CSS as `--angle`, so no-JS and reduced-motion readers get the finished rosette. Card width is a share of the *short* viewport axis (`--fan-fit` on `.wd-fan`, 0.42 desktop / 0.40 phone — the rosette spans 2.29× it, so 0.42 is ~96% of that axis and about as large as it can sit) because the rosette is as wide as it is tall — its radius is the card diagonal — which is also why it needs no phone branch at all.
- **The spectrum answers the rows.** Each band's `flex-grow` *is* its share, so the bar is exact with no percentage arithmetic. Hovering a row lifts its band — written as the independent `translate` property, because the draw-in tween leaves an inline `transform: scaleX(1)` on every segment and `translate` composes with it instead of being overwritten.

The lightbox is a **`Flip.fit`**, not a moved node: the overlay's own `<img>` is snapped onto the clicked frame's rect, that state is recorded, the transform is cleared, and `Flip.from` animates between the two. Never relocate the thumbnail into the overlay — React rendered both nodes and owns them. `public/works/gallery/*.jpg` are six frames per project pulled from its clip with ffmpeg; a work with no `gallery` simply drops that section.

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
| `skills.ts` | Skills pin: headline fly-in (`containerAnimation`), carousel, and the sphere choreography (a pure function of one progress number — see below) |
| `projectsPath.ts` | curve-written headline, camera, curtain; returns a disposer the hook must call |
| `projectsPanels.ts` | diagonal panel swaps, info reveals, video play/pause discipline |
| `experienceGravity.ts` | gravity-playground pin: hand-rolled Z-axis physics (cards fall out of the deep toward the camera), pointer catch/throw, HUD counter (CSS 3D cards; the air is WebGL). Returns a disposer — it owns a rAF, raw listeners and class toggles that `ctx.revert()` can't see |
| `footer.ts` | footer reveals + dock step-aside |
| `chrome.ts` | progress bar, section-bg drift, active-section tracking |

Two-phase lifecycle in the hook: **Phase A** = entrance tweens only, created immediately on `loaded`; **Phase B** = all ScrollTriggers, created in document order (pins must register top-down). Scroll stays locked until the preloader finishes (`introDone`).

### Shared State Singletons (`src/lib/`)

| File | Purpose |
|---|---|
| `sphereState.ts` | GSAP writes target values; the Three.js loop lerps toward them each frame. Sphere choreography is deliberately **stateless math over pin progress**, not scrubbed tweens — one writer per property, reverse-scroll correct for free. On desktop that progress is driven by its **own non-pinning trigger** starting where the headline's tween starts, so it opens *below zero* through the pre-pin lead (`clockToPinProgress` in `animations/skills.ts`); 0 is still exactly the pin's start, so every pin-space constant reads unchanged. The one exception to "math over progress" is `groupX` during the desktop ride, which is an absolute position read off the headline track's live transform — that is the only way it can sit *on* the letter rather than near it |
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

### Responsive

The full choreography runs on mobile — there is no "flat site" branch. Only reduced motion drops to static (`HALL_FLAT_MEDIA` in `viewport.ts` is now `prefers-reduced-motion` alone). What changes on small screens is geometry, not behaviour:

- **`svh`, never `vh`, for any box meant to be "one viewport tall"** (`.grav`, `.projects-path-stage`, `.projects-sticky-list`, `#skills`, hero, footer). `vh` includes the space under a mobile URL bar, so a `vh`-sized pinned stage sits partly out of sight. **Paired units must match**: `.projects-after-path`'s `margin-top: -100svh` cancels `.projects-path-stage`'s `height: 100svh` exactly — change one and you change both. Pure scroll *distances* (the `* 70vh` term in `.projects-stage-scroll`) stay `vh`
- **`ScrollTrigger.config({ ignoreMobileResize: true })`** in `useLoadPortfolioScripts` — the URL bar fires `resize` constantly mid-scroll, and each one would refresh every pin and jump the page. Safe precisely because the heights are in `svh`, which that resize does not change
- **Anything sized in world/SVG units needs a viewport refit**, because those units keep their pixel size while the screen shrinks: `sphereFit()` (`lib/sphereState.ts`) refits the sphere's travel and scale to the camera's visible half-width, and `PROJECTS_PATH_REFERENCE_WIDTH` (`animations/projectsPath.ts`) scales the path camera's zoom by `stageWidth / 1440`. Both are recomputed per update, so resize needs no extra hook
- **Two numbers that must stay in sync by hand**: `getSkillsCarouselMetrics`'s `cardSize` (`animations/skills.ts`) mirrors `.skills-icon-tile`'s width clamp *including its ≤700px override* — the JS spaces the stream, the CSS sizes the tile
- **`MOBILE_MAX_WIDTH` and `SKILLS_MOBILE_LIFT` (`lib/viewport.ts`) are interpolated into `globalCssString`**, so the stylesheet's `@media` widths and the headline's vertical bias are the same values the JS reads. `SKILLS_MOBILE_LIFT` is load-bearing twice — `.skills-headline-stage`'s `translateY` and the sphere canvas's Y offset in `usePortfolioThree` — because the frozen 900px canvas box is taller than a phone screen, so without that offset the sphere renders below the headline instead of behind it. It is currently `0`: the arrival gap is the descent tween's job (`SKILLS_HEADLINE_RISE_VH`), and a static lift on top of it double-counts and leaves the *pinned* composition sitting high
- **Skills stages differently on phones** (all inside `animations/skills.ts`, desktop branches untouched): the headline's pre-pin lead drops to `SKILLS_HEADLINE_LEAD_VH_MOBILE` so the travel happens *on* the pin (at the desktop 0.75 two thirds of it finishes before the pin exists — desktop answers that by extending the sphere's clock back over the lead, phones by shortening the lead); the sphere skips the right-to-left ride and simply sits centred; and the act break moves from `swiperOnScreen` to `headlineOut`, so the purple shell finishes shedding exactly as the line clears the frame
- Breakpoints: `900px` (layout reflow — hero nav, project panels), `700px` (phone: `--pad-x`, type scale, DPR caps, carousel geometry), `430px` (narrow-phone hero). `(hover: none), (pointer: coarse)` hands the native cursor back, since `body { cursor: none }` exists only for the custom cursor that disables itself there
- Renderers cap DPR lower at ≤700px (atmosphere 1.0, sphere 1.5) — phones pair the highest pixel ratios with the least fill-rate

### Next.js Notes

- `next.config.ts` transpiles `@fiddle-digital/string-tune`
- Path alias `@/*` → `src/*`
- Bundle analysis: `npx next experimental-analyze` (Turbopack-native; do NOT install `@next/bundle-analyzer`, it's webpack-only)
- Before editing any Next.js-specific API, read the relevant guide in `node_modules/next/dist/docs/` — this version may differ from training data

## Don't do this

- **No barrel files** (`index.ts` re-exports) — they were removed deliberately; import modules directly
- **Don't autoplay the archive's videos** — `initWorksMedia` decides when a clip may decode (hover on a pointer device, mid-screen on a coarse one). Twenty clips looping at once is exactly the failure the archive page exists to avoid
- **Keep the project clips at 60fps, never 120** — the originals were 1080p **120fps at ~13 Mbps**, and the panel swap decodes TWO at once (incoming plus outgoing), which is what made that section drop frames. 60 is the right rate: it maps 1:1 to a 60Hz display, while 120 forces the decoder to drop half of what it decodes. They are now 1600x900 / 60fps / no audio / faststart, ~3.4MB each. Re-encode anything new the same way (`ffmpeg -i in.mp4 -an -vf "fps=60,scale=1600:900:flags=lanczos" -crf 25 -preset slow -movflags +faststart`); the media box is ~62vw, so 1600 is already retina-correct, and on this kind of footage 60fps costs only ~10% more than 30 because consecutive frames barely differ
- **Don't put the space *inside* a word mask** — `.pp-word-mask` / `.wk-word-mask` crop their contents, so the separator has to be rendered between the masks, explicitly: React puts no text node between array items, and neither mask carries a margin (`.about-headline-word` solves the same problem the other way, with `margin-right`)
- **Don't give the archive's Flip `absolute: true`** — lifting the cards out of flow collapses the grid's height mid-animation and the whole page below it jumps
- **Don't hardcode the fan's angles or size** — `fanAngle` divides 360 by the card count (so any number of screens stays even) and the card is a share of `min(100vw, 100svh)` (so the rosette, which is as wide as it is tall, needs no phone branch). The stacked pivot offset is derived from the card box, not authored
- **No `any`** — `window.gsap/ScrollTrigger/THREE` are properly typed in `src/globals.ts`
- **Don't import `unicornstudio-react` statically** — its SDK is ~1.4 MB; `UnicornHeroBackground` must stay behind `next/dynamic` + `ssr: false` (the preloader covers its load). Same for anything importing three
- **Don't create ScrollTriggers in Phase A** (`heroIntro.ts`) or reorder Phase B's init calls without a reason — pins must register in document order
- **Don't convert the panels' sticky stage to a GSAP pin** — `.projects-after-path` carries `margin-top: -100svh` under an existing pin; a second pin-spacer makes ScrollTrigger's measurements unstable (see comments in `ProjectsSection`)
- **Don't compute the panel trigger bounds from rects** — the curtain translates their container on Y; use the `offsetTop` walk that's already there
- **Don't snap the panel swaps** — tried and removed; it fights the user
- **Don't hardcode the sphere's act-break point** — it's measured live from headline width and card geometry (`swiperOnScreen` in `animations/skills.ts`) and must stay measured
- **Don't give the sphere's desktop ride an authored travel range** — its centre is put *on* the headline's first character: `sphereWorldXAtScreenX(firstCharCenter + trackX, …)`. The letter covers three-odd screen widths while the sphere covers one, so any fixed range drifts apart immediately. Two things that look like cleanups but are not: (a) `trackX` must be the track's **live** `gsap.getProperty(skillsTrack, "x")`, never recomputed from pin progress — the track runs `scrub: 1.2` and the sphere would sit ~a second ahead of the letter; (b) `sphereWorldXAtScreenX` does **not** subtract the camera's `0.15` pan, because `lookAt(0,0,0)` gives it back — see the comment there. It parks at `-fit.travelX` once the "W" carries on off screen, so the burst is never half off-frame
- **Don't hardcode the sphere's first burst or its fade-in either** — both are measured off the headline characters' own fly-in anchors: `rideStartPin` (the "W" crossing `SKILLS_CHAR_ENTER_VW`) opens the fade-in, `burstStartPin` (the "t" of "What" `SKILLS_BURST_CHAR_FLY_IN` of the way through its window) starts the purple shedding, and the fade-in ends exactly where the burst starts so the sphere is never shedding half-transparent. `SKILLS_BURST_CHAR_FLY_IN` is the dial if the burst feels early or late; it is 0.5 and **not** 1 because the from-tweens use hard out-eases, so a character reads as landed at roughly half its trigger window. The two viewport fractions mirror the `"left 108%"` / `"left 54%"` literals on the per-character triggers — change one, change both. Measure off `.skills-headline-char-wrap`, never `.skills-headline-char`: GSAP owns the inner element's transform
- **Keep the two reciprocal media scales in sync** — if `PROJECTS_MEDIA_PARKED_SCALE` changes, its `1/x` counter-scale must follow (that reciprocal is what makes the reveal read as an unfold, not a zoom). `WORK_MEDIA_PARKED_SCALE` (`animations/worksArchive.ts`) is the archive's copy of the same pairing
- **Keep the Experience "past the eye" threshold (`NEAR_MISS`, 900) below the `.grav` CSS `perspective` (1400)** — at z ≥ perspective CSS stops drawing the card; the perspective value is also hardcoded as `P` in `experienceGravity.ts` and the two must agree
- **Don't touch DOM nodes created by hand inside gsap.context and expect revert() to remove them** — clear them explicitly (see the glyph clearing in `projectsPath.ts`)
- **Respect `prefers-reduced-motion`** — every new one-shot reveal must either skip its tweens (from-tweens at rest = the no-motion presentation) or provide a flat variant like the hall's `exp--flat`
- The zoom-compensation logic in `usePortfolioThree` and `UnicornHeroBackground` is subtle and heavily commented — read the comments fully before editing either copy
