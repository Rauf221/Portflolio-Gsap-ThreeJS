/*
 * The full works archive — the page the home section links out to, and the
 * source for every /works/[slug] detail page.
 *
 * This is the list that is MEANT to grow: /works is built so twenty entries
 * cost the same UX as six (a filterable index instead of a pinned sequence),
 * which is exactly what the home page's four-panel swap cannot do.
 *
 * `key` indexes worksPage.items AND workDetail.items in content/site.ts — the
 * copy lives there, the geometry and assets live here. `featured: true` marks
 * the ones the home page also shows (PROJECTS_META); nothing is derived from
 * it, it is a record of the overlap so the two lists can be kept honest by eye.
 *
 * Everything optional degrades rather than breaks: no `video` renders the
 * monogram card, no `gallery` drops the detail page's gallery section entirely,
 * no `href` means the card never pretends to be a link.
 */

/** Filter buckets. Adding one means adding its label to worksPage.filters. */
export type WorkCategory = "platform" | "product" | "ecommerce" | "experience";

/**
 * One band of the detail page's stack spectrum.
 *
 * `share` is an AUTHORED proportion, not a measured line count — it is how much
 * of the build each technology carried, as the author reads it. The shares of a
 * work should add up to 100, because the spectrum bar lays them out as shares
 * of its own width — anything else just re-scales silently.
 *
 * `color` is the technology's own brand colour, which is what makes the bar
 * readable at a glance rather than a row of tinted blocks.
 */
export type StackBand = {
  readonly name: string;
  readonly share: number;
  readonly color: string;
  /** Small label under the name — what the thing does on this project. */
  readonly role: string;
};

export type WorkMeta = {
  readonly key: string;
  /** URL segment for /works/[slug]. Must be unique and stay stable — it is a link. */
  readonly slug: string;
  readonly category: WorkCategory;
  readonly year: string;
  /** Card accent — alternate the two brand inks so the grid keeps a rhythm. */
  readonly color: string;
  readonly video?: string;
  /** Still frame for the spiral hero and the detail hero; pulled from `video`. */
  readonly poster?: string;
  /** Detail-page gallery. Empty (or absent) hides that section on the page. */
  readonly gallery?: readonly string[];
  readonly stack?: readonly StackBand[];
  readonly href?: string;
  readonly featured?: boolean;
};

const INDIGO = "#6B5BCB";
const INK = "#25212C";

/** The six frames pulled out of a project's clip, by convention -1 .. -6. */
const gallery = (name: string, count = 6) =>
  Array.from({ length: count }, (_, i) => `/works/gallery/${name}-${i + 1}.jpg`);

export const WORKS_META: readonly WorkMeta[] = [
  {
    key: "burdaqal",
    slug: "burdaqal",
    category: "platform",
    year: "2024",
    color: INDIGO,
    video: "/projects/burdaqal.mp4",
    poster: "/works/burdaqal.jpg",
    gallery: gallery("burdaqal"),
    stack: [
      { name: "TypeScript", share: 38, color: "#3178C6", role: "Language" },
      { name: "Next.js", share: 22, color: INK, role: "App framework" },
      { name: "Tailwind CSS", share: 14, color: "#38BDF8", role: "Styling" },
      { name: "TanStack Query", share: 10, color: "#FF4154", role: "Server state" },
      { name: "Framer Motion", share: 9, color: "#0055FF", role: "Motion" },
      { name: "ApexCharts", share: 7, color: "#008FFB", role: "Charts" },
    ],
    featured: true,
  },
  {
    key: "develup",
    slug: "develup",
    category: "platform",
    year: "2023",
    color: INK,
    video: "/projects/develup.mp4",
    poster: "/works/develup.jpg",
    gallery: gallery("develup"),
    stack: [
      { name: "TypeScript", share: 32, color: "#3178C6", role: "Language" },
      { name: "Next.js", share: 24, color: INK, role: "App framework" },
      { name: "Firebase", share: 18, color: "#FFCA28", role: "Auth & data" },
      { name: "Tailwind CSS", share: 14, color: "#38BDF8", role: "Styling" },
      { name: "Framer Motion", share: 12, color: "#0055FF", role: "Motion" },
    ],
    featured: true,
  },
  {
    key: "bakuFlames",
    slug: "baku-flames",
    category: "product",
    year: "2024",
    color: INDIGO,
    video: "/projects/baku-flames.mp4",
    poster: "/works/baku-flames.jpg",
    gallery: gallery("baku-flames"),
    stack: [
      { name: "JavaScript", share: 30, color: "#F7DF1E", role: "Language" },
      { name: "Next.js", share: 24, color: INK, role: "App framework" },
      { name: "Redux Toolkit", share: 18, color: "#764ABC", role: "Client state" },
      { name: "Sass", share: 16, color: "#CC6699", role: "Styling" },
      { name: "Axios", share: 12, color: "#5A29E4", role: "HTTP layer" },
    ],
    featured: true,
  },
  {
    key: "casiobaku",
    slug: "casiobaku",
    category: "ecommerce",
    year: "2024",
    color: INK,
    video: "/projects/casiobaku.mp4",
    poster: "/works/casiobaku.jpg",
    gallery: gallery("casiobaku"),
    stack: [
      { name: "TypeScript", share: 34, color: "#3178C6", role: "Language" },
      { name: "Next.js", share: 26, color: INK, role: "App framework" },
      { name: "Tailwind CSS", share: 22, color: "#38BDF8", role: "Styling" },
      { name: "Motion", share: 18, color: "#0055FF", role: "Motion" },
    ],
    featured: true,
  },
  {
    key: "wayouth",
    slug: "wayouth",
    category: "platform",
    year: "2024",
    color: INDIGO,
    stack: [
      { name: "TypeScript", share: 34, color: "#3178C6", role: "Language" },
      { name: "Next.js", share: 26, color: INK, role: "App framework" },
      { name: "Tailwind CSS", share: 20, color: "#38BDF8", role: "Styling" },
      { name: "Motion", share: 12, color: "#0055FF", role: "Motion" },
      { name: "REST API", share: 8, color: "#22A06B", role: "Integration" },
    ],
  },
  {
    key: "portfolio",
    slug: "portfolio",
    category: "experience",
    year: "2026",
    color: INK,
    stack: [
      { name: "TypeScript", share: 30, color: "#3178C6", role: "Language" },
      { name: "Three.js", share: 24, color: "#049EF4", role: "WebGL scenes" },
      { name: "GSAP", share: 22, color: "#0AE448", role: "Choreography" },
      { name: "Next.js", share: 14, color: INK, role: "App framework" },
      { name: "CSS", share: 10, color: "#1572B6", role: "Styling" },
    ],
  },
];

/** Order of the filter rail; "all" is prepended by the page itself. */
export const WORK_CATEGORY_ORDER: readonly WorkCategory[] = [
  "platform",
  "product",
  "ecommerce",
  "experience",
];

export function findWork(slug: string) {
  return WORKS_META.find((w) => w.slug === slug);
}

/**
 * The work after this one, wrapping at the end — the detail page always has a
 * next project to hand the reader, so the archive never dead-ends.
 */
export function nextWork(slug: string) {
  const index = WORKS_META.findIndex((w) => w.slug === slug);
  if (index === -1) return WORKS_META[0];
  return WORKS_META[(index + 1) % WORKS_META.length];
}
