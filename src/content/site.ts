export const metadata = {
  title: "Rauf Huseynzade — Full Stack / Creative Web Developer",
  description:
    "Next.js, React, TypeScript, interactive web experiences, dashboards, and production-grade frontend engineering.",
} as const;

/* Copy for the hero overlay layer (HeroOverlay.tsx): the grouped navigation,
   the clock, the centre statement, and the corner labels. Items carry EITHER a
   `section` (an in-page id, scrolled to via scrollToSection) OR an `href` (an
   external / mailto link) — never both. */
export const heroNav = {
  groups: [
    {
      id: "repertoire",
      glyph: "flag",
      title: "Repertoire",
      items: [
        { label: "Works", section: "projects" },
        /* The full archive lives on its own route — the home section only ever
           shows the four featured panels. */
        { label: "All works", href: "/works" },
        { label: "Insights", section: "skills" },
      ],
    },
    {
      id: "narrative",
      glyph: "circle",
      title: "Narrative",
      items: [
        { label: "About", section: "about" },
        { label: "Experience", section: "experience" },
      ],
    },
    {
      id: "liaison",
      glyph: "square",
      title: "Liaison",
      items: [
        { label: "For Brands", href: "mailto:Rauf280604@gmail.com?subject=Project" },
        { label: "For Agencies", href: "mailto:Rauf280604@gmail.com?subject=Collaboration" },
      ],
    },
  ],
  /* Local time of wherever the site's owner is (footer.location). Swap
     timeZone/zoneLabel together to show a different city. */
  clock: { timeZone: "Asia/Baku", zoneLabel: "AZT", localeLabel: "EN" },
  discover: "Discover",
  cta: { label: "Get in touch", href: "mailto:Rauf280604@gmail.com?subject=Collaboration" },
  /* One <p> per line — they are staggered individually on entrance. */
  statement: ["Rauf Huseynzade.", "Design & Code for those", "who refuse to settle."],
  era: "2026—Future",
} as const;

/* Copy for the floating dock (FloatingDock.tsx) — the small centred bar that
   takes over once the hero overlay's navigation has scrolled away. */
export const dock = {
  home: { label: "Back to top", section: "hero" },
  directory: {
    label: "Directory",
    closeLabel: "Close directory",
    /* The panel that stacks above the bar: a 3-column grid of square tiles,
       spanning the bar's full width. Rows render top-to-bottom exactly as
       written, so the SHORT row belongs first — a row with fewer than three
       tiles stays left-aligned, which is the staggered look the panel is after.
       Each tile is either in-page (`section`) or a link (`href`); an `href`
       tile may also carry an `icon` to render a mark instead of its label. */
    rows: [
      /* A 1—2—3—3 staircase: the archive gets the solo tile at the top, which
         is the widest-reading position in a left-aligned short row. */
      [{ label: "All works", href: "/works" }],
      [
        { label: "For Agencies", href: "mailto:Rauf280604@gmail.com?subject=Collaboration" },
        { label: "For Brands", href: "mailto:Rauf280604@gmail.com?subject=Project" },
      ],
      [
        { label: "Works", section: "projects" },
        { label: "Insights", section: "skills" },
        { label: "About", section: "about" },
      ],
      [
        { label: "Experience", section: "experience" },
        { label: "GitHub", href: "https://github.com/Rauf221", icon: "github" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/rauf-huseynzade", icon: "linkedin" },
      ],
    ],
  },
  sound: {
    label: "Sound",
    /* Ambient loop played while Sound is on. Empty = no audio asset yet: the
       button still toggles and the meter still animates, it is just silent.
       Drop a file in public/ (e.g. "/audio/ambient.mp3") to make it audible. */
    src: "",
    volume: 0.35,
  },
} as const;

export const about = {
  /* `|` splits the headline into words. AboutSection gives every word from
     index 3 on the indigo gradient, so the last two words are the accent —
     keep the phrasing five words long or that split lands mid-thought. */
  headline: "I|build|systems|that|endure.",
  body1:
    "I'm Rauf Huseynzade — a full-stack developer working where structure meets atmosphere: Next.js App Router, TypeScript, Tailwind, motion pipelines, dashboards, and multilingual platforms.",
  body2:
    "Production apps, real-estate platforms, CMS and editor surfaces, real-time systems, and WebGL scenes built to feel like places rather than pages.",
  mantra: "Every interface remembers the hand that built it.",
  /* Rendered as a plain key/value list, not counters — same three facts as the
     old diamond sigils, just without the ornament around them. */
  meta: [
    { key: "Shipped", value: "10+" },
    { key: "Stack", value: "Full-stack" },
    { key: "Languages", value: "3" },
  ],
} as const;

export const skills = {
  headingLine1: "What I",
  headingAccent: "do best",
  headingLine2: ".",
  proficiency: "Proficiency",
  categories: {
    frontend: "Frontend",
    language: "Language",
    creative: "3D / Creative",
    data: "Data / State",
    cms: "Rich text / CMS",
    backend: "Realtime / Backend",
    devops: "DevOps / Deploy",
  },
  items: {
    reactNext: { name: "React" },
    vue: { name: "Vue.js" },
    typescript: { name: "TypeScript" },
    realtime: { name: "JavaScript" },
    nextInfra: { name: "Next.js" },
    nodeJs: { name: "Node.js" },
    editorsCms: { name: "HTML5" },
    css3: { name: "CSS3" },
    deploy: { name: "Tailwind CSS" },
    threeGsap: { name: "Three.js · GSAP" },
    tanstackFirebase: { name: "Firebase" },
    blender: { name: "Blender" },
    cLang: { name: "C" },
    cpp: { name: "C++" },
  },
} as const;

export const projects = {
  label: "Selected projects",
  countLabel: (count: number) => `${count} projects`,
  /* The way out of the four-panel sequence and into the full archive
     (/works) — the section itself only ever shows the featured few. */
  archiveLabel: "See the full archive",
  /* Written character by character along the curve in ProjectsSection. Its
     LENGTH is load-bearing: the camera travels `textSpan / pathLength` of the
     curve, so a much shorter line leaves the back of the path unvisited — and
     once textSpan passes pathLength the tail runs off the end of the curve and
     is cut. This one is 85 characters; --path-font-size (globalCssString) is
     the counterweight, since textSpan scales with it. */
  pathHeadline:
    "Each one still carries the shape of the problem it was built to dissolve at its core.",
  headingLine1: "Work",
  headingAccent: "that speaks",
  headingLine2: ".",
  viewLabel: "View project",
  screenshotLabel: "[ SCREENSHOT ]",
  items: {
    burdaqal: {
      title: "BurdaQal.az",
      subtitle: "Real-estate platform · multilingual",
      desc: "A production real-estate product with listings, dashboards, charts, motion, and admin tooling.",
      tags: "Next.js 16, TypeScript, TanStack Query, ApexCharts, Framer Motion, Lenis",
    },
    develup: {
      title: "DevelUP",
      subtitle: "Developer community & site",
      desc: "A developer-focused platform with Firebase integration and modern UI motion.",
      tags: "Next.js, Firebase, Framer Motion, EmailJS, TypeScript",
    },
    bakuFlames: {
      title: "Baku Flames · Jury system",
      subtitle: "Event / media platform",
      desc: "Role-based UI, Redux Toolkit, custom HTTP server architecture, and media integration.",
      tags: "Redux Toolkit, Axios, Next.js, Sass, React Player",
    },
    /* PLACEHOLDER COPY — subtitle, desc and tags below are a draft, not a record
       of what was actually built. Replace them with the real brief and stack
       before this ships; `tags` in particular renders as the panel's row list,
       so each comma-separated item becomes a visible claim about the project. */
    casiobaku: {
      title: "Casiobaku.az",
      subtitle: "E-commerce · retail",
      desc: "Product catalogue and storefront with a motion-led browsing experience.",
      tags: "Next.js, TypeScript, Motion",
    },
  },
} as const;

export const experience = {
  /* Tunnel treatment ("Coding my way since ____"). The 3D perspective flythrough
     that upgrades this section reads these. `year` is the one thing to change —
     set it to the year you actually started coding. */
  tunnel: {
    headline: "Where I've shipped.",
    line1: "Coding",
    line2: "my way",
    line3: "since",
    year: "2019",
    hint: "Scroll",
  },
  /* Gravity playground treatment: cards fall out of the deep toward the
     camera; the reader catches them with the pointer. */
  playground: {
    hint: "Press & hold a card to catch it",
    caught: "Caught",
    done: "All caught — nice hands",
  },
  items: {
    burdaqal: {
      role: "Lead Frontend / Full Stack Developer",
      company: "BurdaQal.az",
      period: "2024 – Present",
      desc: "Production real-estate: listings, search, dashboards, SEO and performance tuning.",
    },
    develup: {
      role: "Founder / Developer",
      company: "DevelUP",
      period: "2023 – Present",
      desc: "Community platform with Firebase-backed flows and a modern landing experience.",
    },
    wayouth: {
      role: "Full Project Developer",
      company: "World Azerbaijanis Youth Organization",
      period: "2024",
      desc: "End-to-end corporate website and admin workflows.",
    },
    bakuFlames: {
      role: "Full Stack · Platform UI",
      company: "Baku Flames · Jury system",
      period: "2024",
      desc: "Event flows with tailored UI, media integrations, and deployment automation.",
    },
  },
} as const;

export const footer = {
  line1: "© 2026 Rauf Huseynzade — GSAP · Three.js · Next.js",
  line2: "Portfolio",
  /* Dramatic closing footer (raviklaassens.com treatment, re-skinned): a tall
     dark panel with a contact row up top and a giant full-width monogram that
     clip-reveals along the bottom edge. The footer is now the only place the
     site exposes contact details — there is no dedicated contact section. */
  email: "Rauf280604@gmail.com",
  cta: "Start collaboration",
  ctaHref: "mailto:Rauf280604@gmail.com?subject=Collaboration",
  availability: "Available for work",
  backToTop: "Back to top",
  /* The giant slogan printed on the purple band. Change this one line to
     re-brand the footer. */
  slogan: "Code Has Identity",
  location: "Baku, Azerbaijan",
  /* Bottom info strip: four columns separated by dividers, each two lines. */
  infoColumns: [
    { line1: "Building for startups,", line2: "agencies & brands", href: undefined },
    { line1: "Available for", line2: "new projects", href: undefined },
    { line1: "GitHub", line2: "@Rauf221", href: "https://github.com/Rauf221" },
    { line1: "LinkedIn", line2: "@rauf-huseynzade", href: "https://www.linkedin.com/in/rauf-huseynzade" },
  ],
} as const;

export const aboutPage = {
  metaTitle: "About — Rauf Huseynzade",
  metaDescription: "Full-stack developer, technologies, projects, and approach.",
  backHome: "Back to home",
  orbitTag: "// Constellation",
  orbitTitle: "Tech orbit",
  intro: {
    tag: "About",
    headline: "Full-stack developer · UX & performance",
    paragraphs: [
      "I'm a full-stack developer focused on modern web technologies and user experience. I build high-performance, visually strong, and technically scalable platforms.",
      "On the frontend I craft complex UI systems, motion-driven interfaces, interactive experiences, and maintainable architectures. On the backend I work on realtime systems, authentication, database design, API integrations, and performance optimization.",
      "In every project I care about architecture, usability, and long-term maintainability—not only visuals.",
      "I work mainly with React and Next.js. With Framer Motion, GSAP, and Three.js I build dynamic, immersive experiences—motion is functional, not decoration.",
      "On the backend I handle realtime data, auth flows, APIs, and security. I've shipped startup, corporate, and production platforms. I use Claude, Cursor, and AI-assisted workflows to move faster.",
    ],
  },
  philosophy: {
    quote:
      "A great product isn't just a pretty interface—it's fast, effortless, stable, and easy to extend.",
  },
  stats: {
    stack: { num: "Full", label: "Stack" },
    focus: { num: "10+", label: "Focus areas" },
    langs: { num: "3", label: "Languages" },
  },
  tech: {
    title: "Technologies",
    frontend: {
      title: "Frontend",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript (ES6+)",
        "TypeScript",
        "React",
        "Next.js 15 / 16",
        "Tailwind CSS v4",
        "Framer Motion",
        "GSAP",
        "Three.js / R3F",
        "Radix UI",
        "shadcn/ui",
        "TanStack Query",
        "TanStack Table",
        "React Hook Form",
        "Zod",
        "Lenis",
        "ApexCharts / Recharts",
        "TipTap",
        "CKEditor 5",
      ],
    },
    backend: {
      title: "Backend & Database",
      items: ["Firebase Auth", "Firestore", "Realtime Database", "REST API", "MongoDB", "PostgreSQL", "Socket.IO"],
    },
    tools: {
      title: "Tools & Workflow",
      items: ["Git", "GitHub", "Vercel", "Figma", "VS Code", "npm / pnpm", "Turbopack"],
    },
  },
  focus: {
    title: "Focus areas",
    items: [
      "Full-stack web apps",
      "SaaS platforms",
      "Real-time systems",
      "Motion & interaction design",
      "AI-integrated products",
      "Dashboards & admin panels",
      "Performance optimization",
      "Responsive & adaptive UI",
      "Scalable frontend architecture",
      "Modern UI/UX systems",
    ],
  },
  projects: {
    title: "Selected projects",
    items: [
      {
        name: "World Azerbaijanis Youth Organization",
        desc: "Corporate organization platform built from scratch with motion-driven design, admin panel, and responsive architecture.",
      },
      {
        name: "DevelUP Platform",
        desc: "Developer community platform with modern UI system, performance tuning, and scalable frontend structure.",
      },
      {
        name: "BurdaQal.az",
        desc: "Property listings and daily rental platform.",
        highlights: [
          "Dashboard systems",
          "Multi-language support",
          "Responsive mobile UX",
          "Form architecture",
          "Advanced filtering",
          "Motion optimizations",
          "Admin panel infrastructure",
        ],
      },
    ],
  },
} as const;

/*
 * Copy for the /works archive (app/works/WorksPage.tsx).
 *
 * `items` deliberately SPREADS projects.items rather than restating the four
 * projects the home page also shows — one edit to a shared project's title or
 * stack updates both surfaces. Entries after the spread exist only in the
 * archive. Every key here must have a matching entry in WORKS_META
 * (data/worksMeta.ts), which owns the year, accent and clip.
 */
export const worksPage = {
  metaTitle: "Works — Rauf Huseynzade",
  metaDescription:
    "The full archive: production platforms, dashboards, storefronts and interactive web experiences built with Next.js, TypeScript, GSAP and Three.js.",
  backHome: "Back to home",
  /* The hero draws no text at all — it is the spiral scene. This line survives
     as the page's <h1>, rendered for screen readers and the document outline
     only, so `|` here is just the word separator the other headlines use. */
  headline: "Everything|I|have|shipped.",
  lede:
    "Production platforms, admin surfaces, storefronts and experiments — each one still carrying the shape of the problem it was built to dissolve.",
  meta: {
    countLabel: "Projects",
  },
  index: {
    title: "Index",
    filterLabel: "Filter",
    emptyLabel: "Nothing in this bucket yet.",
    viewLabel: "View project",
  },
  filters: {
    all: "All",
    platform: "Platforms",
    product: "Products",
    ecommerce: "Commerce",
    experience: "Experiences",
  },
  cta: {
    line1: "Have something",
    line2: "worth building?",
    label: "Start collaboration",
    href: "mailto:Rauf280604@gmail.com?subject=Project",
  },
  items: {
    ...projects.items,
    wayouth: {
      title: "World Azerbaijanis Youth",
      subtitle: "Corporate organisation platform",
      desc: "End-to-end corporate site and admin workflows, built from scratch with motion-driven design and a responsive content architecture.",
      tags: "Next.js, TypeScript, Admin panel, Motion, Responsive UI",
    },
    portfolio: {
      title: "This portfolio",
      subtitle: "Scroll-driven WebGL experience",
      desc: "A single-page, scroll-choreographed site: a morphing sphere, a headline written along a curve, and a gravity playground where the cards fall out of the deep.",
      tags: "Next.js App Router, Three.js, GSAP ScrollTrigger, Lenis",
    },
  },
} as const;

/*
 * Copy for the project detail pages (/works/[slug], app/works/[slug]).
 *
 * ⚠ The per-project NARRATIVE below (tagline, challenge, approach, outcome,
 * highlights) was drafted from the one-line summaries already in `projects` and
 * `worksPage` — it is a working draft in the author's voice, not a transcript of
 * what happened. Read it through and correct it before this ships; `role`,
 * `timeline` and `client` in particular are the fields most likely to be wrong.
 *
 * Every key here must exist in WORKS_META (data/worksMeta.ts), which owns the
 * slug, the gallery and the stack spectrum.
 */
export const workDetail = {
  metaSuffix: "— Rauf Huseynzade",
  labels: {
    backToArchive: "All works",
    overview: "Overview",
    role: "Role",
    timeline: "Timeline",
    client: "Client",
    category: "Discipline",
    scrollCue: "Scroll",
    challenge: "The problem",
    approach: "The approach",
    outcome: "What it became",
    highlights: "What shipped",
    gallery: "Screens",
    galleryHint: "Click any frame to open it",
    galleryClose: "Close",
    galleryPrev: "Previous frame",
    galleryNext: "Next frame",
    stack: "Written in",
    stackHint: "Proportions are how much of the build each piece carried.",
    stackShare: "Share",
    next: "Next project",
    visit: "Visit the site",
  },
  items: {
    burdaqal: {
      tagline: "A real-estate platform that had to stay fast while it kept growing.",
      role: "Lead Frontend / Full Stack Developer",
      timeline: "2024 — Present",
      client: "BurdaQal.az",
      challenge:
        "Property platforms drown in their own data. Thousands of listings, every one of them filterable, in three languages, on phones that give you no patience — and an admin side that has to stay usable for people who are not developers.",
      approach:
        "A typed Next.js App Router build with TanStack Query owning every server round trip, so the UI never guesses what it already knows. Filtering, pagination and search read from one cache; charts and dashboards sit on the same source rather than re-fetching their own.",
      outcome:
        "Listings, search, dashboards and admin tooling in one product, with the motion layer tuned so it never costs a frame on a mid-range phone.",
      highlights: [
        "Multi-language listing and search flows",
        "Dashboard and analytics surfaces",
        "Admin panel infrastructure",
        "Advanced filtering with cached server state",
        "SEO and Core Web Vitals tuning",
      ],
    },
    develup: {
      tagline: "A developer community that needed a front door worth walking through.",
      role: "Founder / Developer",
      timeline: "2023 — Present",
      client: "DevelUP",
      challenge:
        "A community is only as real as the first thirty seconds of its landing page. It had to read as a product rather than a template, and it had to handle real accounts and real content from day one.",
      approach:
        "Firebase carries auth and data so the whole thing stays serverless, and the interface layer is built as a small design system: one set of motion rules, one type scale, one spacing rhythm, reused everywhere instead of restyled per page.",
      outcome:
        "A community platform with working account flows, a landing experience with its own character, and a structure that new sections drop straight into.",
      highlights: [
        "Firebase auth and Firestore-backed flows",
        "Motion-led landing experience",
        "Reusable UI system across the site",
        "Contact and onboarding pipelines",
      ],
    },
    bakuFlames: {
      tagline: "A jury system where the wrong person must never see the wrong screen.",
      role: "Full Stack · Platform UI",
      timeline: "2024",
      client: "Baku Flames",
      challenge:
        "Event judging is a permissions problem wearing a UI. Juries, organisers and the public need three different products out of one codebase, and media has to play flawlessly during a live event with an audience watching.",
      approach:
        "Redux Toolkit holds the role and session state so every screen derives what it may show rather than being told, a custom HTTP layer over Axios keeps the API surface in one place, and the media components are isolated so a player problem can never take a page down.",
      outcome:
        "Role-based flows for jury, organiser and public views, with media integration and deployment automation behind them.",
      highlights: [
        "Role-based access across three audiences",
        "Redux Toolkit session and scoring state",
        "Custom HTTP server architecture",
        "Media playback and streaming integration",
      ],
    },
    casiobaku: {
      tagline: "A storefront that moves like a showroom, not a catalogue.",
      role: "Frontend Developer",
      timeline: "2024",
      client: "Casiobaku.az",
      challenge:
        "Retail pages are usually a grid and a hope. The brief was a browsing experience with some theatre in it that still gets a shopper to the product page without a detour.",
      approach:
        "Product surfaces are composed from a small set of motion primitives — reveal, unfold, settle — so every page moves in the same language, and the catalogue stays a straight line from landing to product.",
      outcome:
        "A product catalogue and storefront where the motion is part of the browsing rather than decoration around it.",
      highlights: [
        "Motion-led catalogue browsing",
        "Product and contact surfaces",
        "Responsive storefront layouts",
      ],
    },
    wayouth: {
      tagline: "An organisation's whole public face, built from an empty folder.",
      role: "Full Project Developer",
      timeline: "2024",
      client: "World Azerbaijanis Youth Organization",
      challenge:
        "There was no site, no content model and no admin workflow — only an organisation that needed all three at once, and staff who would have to run it without a developer beside them.",
      approach:
        "Content structure first: everything the organisation publishes was modelled before a single page was styled, so the admin side and the public side are two views of one shape rather than two products kept in step by hand.",
      outcome:
        "A corporate platform with its own admin workflows, motion-driven design, and a content model the team maintains themselves.",
      highlights: [
        "End-to-end corporate platform",
        "Admin workflows for non-technical staff",
        "Content model shared by both surfaces",
        "Responsive, motion-driven design",
      ],
    },
    portfolio: {
      tagline: "The site you are reading — a scroll turned into choreography.",
      role: "Everything",
      timeline: "2026",
      client: "Self-initiated",
      challenge:
        "Most portfolios describe the work. This one had to BE the work: proof that a scroll-driven WebGL site can stay smooth, readable and accessible instead of trading all three for spectacle.",
      approach:
        "One shared Three.js instance and at most three WebGL contexts on the page, GSAP owning every scroll-linked value, and choreography written as stateless maths over pin progress so reversing the scroll is correct for free. Reduced motion is a real branch, not an afterthought.",
      outcome:
        "A morphing sphere, a headline written along a curve, a gravity playground you catch cards in — and a page that still degrades to a readable document when the scripts never arrive.",
      highlights: [
        "Scroll-choreographed single page",
        "Morphing sphere and hall atmosphere shaders",
        "Hand-rolled Z-axis physics playground",
        "Reduced-motion and no-WebGL fallbacks",
      ],
    },
  },
} as const;
