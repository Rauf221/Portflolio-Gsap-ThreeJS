export const metadata = {
  title: "Rauf Huseynzade — Full Stack / Creative Web Developer",
  description:
    "Next.js, React, TypeScript, interactive web experiences, dashboards, and production-grade frontend engineering.",
} as const;

/*
 * Copy for the hero overlay layer (HeroOverlay.tsx).
 *
 * The overlay is four clusters pinned to the frame's edges with the portrait
 * breathing between them: a top rail (mark / centred nav / clock), a
 * left-middle lead block (headline, one supporting line, one primary link), a
 * right-middle section index, and a foot band with contact at one end and the
 * scroll hint at the other. Nothing is ruled across the frame — the clusters
 * are held by alignment alone, so the only drawn shapes are the index rail's
 * hairline and the two small circles in the foot band.
 *
 * Nav items carry EITHER a `section` (an in-page id, scrolled to via
 * scrollToSection) OR an `href` (an external / route link) — never both. The
 * same rule applies to `cta` and `scrollHint`.
 */
export const heroNav = {
  nav: [
    { label: "Works", section: "projects" },
    /* The full archive lives on its own route — the home section only ever
       shows the four featured panels. */
    { label: "Archive", href: "/works" },
    { label: "Insights", section: "skills" },
    { label: "About", section: "about" },
    { label: "Experience", section: "experience" },
  ],
  /* Local time of wherever the site's owner is. Swap timeZone/zoneLabel
     together to show a different city. */
  clock: { timeZone: "Asia/Baku", zoneLabel: "AZT" },
  /*
   * The headline is written as explicit lines rather than one string left to a
   * max-width, because where it breaks IS the composition: two lines with the
   * accent closing the second is the shape, and a measure would pick a
   * different break at every viewport width. `accent` is the indigo tail of
   * line two — keep the period on it, it is the full stop of the whole block.
   */
  headline: { line1: "Where structure", line2: "meets", accent: "atmosphere." },
  /* Two lines' worth at the set measure — the only prose in the frame, so it
     says what the work is for instead of restating the headline. */
  subline: "I build digital experiences that balance clarity, motion and purpose.",
  /* The lead block's own link: the one thing the hero actually asks for. Points
     at the archive ROUTE, not the home section — the arrow is a north-east one,
     so it has to leave the page for that arrow to be honest. */
  cta: { label: "View works", href: "/works" },
  /*
   * The right-hand index. `section` joins each row to a real section id, so the
   * live row lights up off the same activeSection the nav rail reads; the
   * numbers come from row order and are never authored, so inserting a section
   * cannot leave a gap in the count. Order must stay DOCUMENT order — it is
   * read as a position in the page, not as a menu.
   */
  index: [
    { section: "about", label: "About" },
    { section: "skills", label: "Insights" },
    { section: "projects", label: "Works" },
    { section: "experience", label: "Experience" },
  ],
  /* Foot band, left end. The mail link that used to be the lead CTA — down here
     it reads as the way out of the page rather than the point of it. */
  contact: { label: "Get in touch", href: "mailto:Rauf280604@gmail.com?subject=Collaboration" },
  /* Foot band, right end. Points at the first section under the hero, so the
     circle is a control and not just a caption about scrolling. */
  scrollHint: { label: "Scroll to explore", section: "about" },
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
    corporate: "Corporate",
    experience: "Experiences",
  },
  /* Chip on the cards of work the Markup Agency team shipped without my
     commits in it (WORKS_META `agency: true`). */
  agencyCredit: "Markup Agency",
  cta: {
    line1: "Have something",
    line2: "worth building?",
    label: "Start collaboration",
    href: "mailto:Rauf280604@gmail.com?subject=Project",
    lede: "Platforms, storefronts, dashboards, scroll-driven sites. Tell me what you are building and I will tell you how I would build it.",
    factProjects: "Projects in the archive",
    factSince: "Writing code since",
    emailLabel: "Or write directly",
    email: "Rauf280604@gmail.com",
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
    fonderaPlatform: {
      title: "Fondera · Startup platform",
      subtitle: "Startup & investor platform",
      desc: "The platform side of Fondera: startups submit and edit their projects, investors browse, favourite and track them from their own dashboard.",
      tags: "Next.js 16, TypeScript, TanStack Query, React Hook Form, Zod, CKEditor, Recharts",
    },
    markupAgency: {
      title: "Markup.az",
      subtitle: "Agency website · 3D · multilingual",
      desc: "The Markup Agency site: core pages with a Three.js scene, an AI assistant, a digital academy, and an API-driven media gallery.",
      tags: "Next.js 16, TypeScript, Three.js, GSAP, Lenis, next-intl",
    },
    fondera: {
      title: "Fondera.az",
      subtitle: "Tech & startup news portal",
      desc: "Azerbaijan's technology and startup news portal. I built its vacancies section and the event filtering.",
      tags: "Next.js 16, TypeScript, TanStack Query, GSAP, Motion, Tailwind CSS",
    },
    shoplink: {
      title: "Shoplink.az",
      subtitle: "Store builder SaaS",
      desc: "A platform where anyone can open their own online store. I added the Cloudflare nameserver step to the store's domain settings.",
      tags: "Next.js 16, TypeScript, TanStack Query, Tiptap, next-intl",
    },
    fleurGarden: {
      title: "Fleur Garden",
      subtitle: "Wholesale flower store",
      desc: "A storefront with wishlist, compare and a minimum-order checkout. My part was wiring order details to the real backend data.",
      tags: "Next.js 16, TypeScript, TanStack Query, next-intl",
    },
    gbaru: {
      title: "GBARU",
      subtitle: "Global B2B trade network",
      desc: "An AI-assisted B2B platform: listings, procurement auctions and company profiles across 25+ countries, with web, API and mobile clients.",
      tags: "Next.js 16, TypeScript, TanStack Query, Tiptap, Laravel, Flutter",
    },
    platinium: {
      title: "Platinium-17",
      subtitle: "Professional kitchen equipment",
      desc: "Catalogue site for a professional kitchen equipment supplier — brands, categories, projects and news, managed from its own admin panel.",
      tags: "Next.js 16, TypeScript, MUI, next-intl, Swiper",
    },
    elba: {
      title: "ELBA",
      subtitle: "Industrial producer · corporate",
      desc: "Corporate site for Azerbaijan's first potassium sulphate (SOP) production complex — products, sustainability, production and news.",
      tags: "Next.js 15, TypeScript, TanStack Query, next-intl",
    },
    glassHouse: {
      title: "Glass House",
      subtitle: "Glass processing · corporate",
      desc: "Corporate site for a glass processing company — products, services, projects, vacancies and a gallery.",
      tags: "Next.js 16, TypeScript, TanStack Query, next-intl",
    },
    lezzetGroup: {
      title: "Lezzet Group",
      subtitle: "Food group · corporate",
      desc: "Corporate site for a food producer active since 1995 — business lines, brands and export.",
      tags: "Laravel, Bootstrap, Sass",
    },
    shamkirAgro: {
      title: "Şəmkir Aqro",
      subtitle: "Agriculture · corporate",
      desc: "Corporate site for an agricultural company in Shamkir — about, products and contact, in three languages.",
      tags: "Next.js 16, TypeScript, next-intl",
    },
    innosert: {
      title: "Innosert",
      subtitle: "Online exams & certificates",
      desc: "An exam platform: public and code-protected exams, paid exams, results and earned certificates.",
      tags: "Next.js 14, i18next, ApexCharts, React Quill, Laravel",
    },
    azfar: {
      title: "Azfar Group",
      subtitle: "Reservation CRM",
      desc: "An internal CRM for Azfar Group built around reservations, including automatic reservation rules.",
      tags: "Next.js 14, MUI, Formik, Yup, Laravel",
    },
    feridinEvi: {
      title: "Fərid'in Evi",
      subtitle: "Rental housing",
      desc: "Site for a rental housing concept — listings, search, a map of the homes and campaign sign-ups.",
      tags: "Next.js 16, TypeScript, TanStack Query, Leaflet, next-intl",
    },
    agriman: {
      title: "Agriman",
      subtitle: "Agricultural consulting",
      desc: "Site for an agricultural consulting firm — services, projects, an expert blog and application forms, with a Turkish edition.",
      tags: "Next.js 15, TypeScript, react-i18next, AOS",
    },
    bcGroup: {
      title: "BC Group",
      subtitle: "Equipment manufacturer · corporate",
      desc: "Corporate site for a company that manufactures and imports equipment — product range, FAQ and enquiry forms.",
      tags: "Next.js 16, i18next, Swiper, Yup",
    },
    consultex: {
      title: "Consultex",
      subtitle: "Consulting · corporate",
      desc: "Corporate site for a consulting company, with validated contact flows and its own admin panel.",
      tags: "Next.js 15, TypeScript, next-intl, React Hook Form",
    },
    greenCaspian: {
      title: "Green Caspian",
      subtitle: "Corporate site",
      desc: "Multilingual corporate site with its own admin panel.",
      tags: "Next.js 16, TypeScript, next-intl, Swiper",
    },
    agriGubre: {
      title: "AgriGübrə",
      subtitle: "Fertiliser · corporate",
      desc: "Multilingual corporate site for a fertiliser company.",
      tags: "Next.js 15, TypeScript, next-intl",
    },
    bakuCreators: {
      title: "Baku Creators",
      subtitle: "Videography studio",
      desc: "Site for a videography studio — services and showcase.",
      tags: "Next.js 16, Embla Carousel",
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
/**
 * Detail copy for work the Markup Agency team shipped without my commits in it
 * (WORKS_META `agency: true`). The role is fixed so no page reads as my build.
 */
function agencyWork(copy: {
  tagline: string;
  timeline: string;
  client: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: readonly string[];
}) {
  return { ...copy, role: "Markup Agency team project" };
}

export const workDetail = {
  metaSuffix: "— Rauf Huseynzade",
  labels: {
    backToArchive: "All works",
    overview: "Overview",
    role: "Role",
    timeline: "Timeline",
    client: "Client",
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
    fonderaPlatform: {
      tagline: "Where a startup's pitch and an investor's shortlist meet.",
      role: "Frontend Developer",
      timeline: "2026",
      client: "Fondera",
      challenge:
        "Two audiences, one product. Founders need to put a whole startup on the page — team, strategy, operations, reports — and keep editing it; investors need to scan many of them and keep track of the few that matter.",
      approach:
        "I set up the core app structure and auth flows, then built the founder side as multi-tab forms with rich-text editing (CKEditor) and a guarded edit route, and the investor side as listings with status filters, favourites and a metrics dashboard.",
      outcome:
        "A working startup and investor platform: submission and editing for founders, discovery, inquiries and a dashboard for investors.",
      highlights: [
        "Core app structure and authentication flows",
        "Startup submission and editing with rich text",
        "Investor dashboard with investment metrics",
        "Startup listings, favourites and status filters",
        "Support requests and messaging screens",
      ],
    },
    markupAgency: {
      tagline: "An agency site that has to show the craft it sells.",
      role: "Frontend Developer",
      timeline: "2026",
      client: "Markup Agency",
      challenge:
        "An agency's own site is its first case study. It had to carry a 3D first impression, read in several languages, and give the team a place to publish their AI and motion work without a developer.",
      approach:
        "I built the core pages and components around a Three.js scene, added the AI assistant with localisation, the sitemap route and the digital academy section, and later made the AI content gallery API-driven with real aspect ratios, a Motion tab and YouTube / Instagram embeds.",
      outcome:
        "markup.az — a multilingual agency site with a 3D hero, an AI assistant and a self-serve media gallery.",
      highlights: [
        "Core pages and the Three.js scene",
        "AI assistant with localisation",
        "API-driven photo and video gallery",
        "Dynamic XML sitemap",
      ],
    },
    fondera: {
      tagline: "A news portal that also has to work as a job board.",
      role: "Frontend Developer (features)",
      timeline: "2026",
      client: "Fondera",
      challenge:
        "The portal already published news; it also needed vacancies that companies can post and readers can browse, and an events list that filters by real dates.",
      approach:
        "I built the vacancies feature end to end on the client — listing, detail page, image support and a create-vacancy modal wired to the API — and a date-parsing utility that the home and events pages filter through.",
      outcome:
        "Vacancies and event filtering live on fondera.az.",
      highlights: [
        "Vacancies listing and detail pages",
        "Create-vacancy modal with API mutation",
        "Event date parsing and filtering",
      ],
    },
    shoplink: {
      tagline: "Your own online store in one click.",
      role: "Contributor",
      timeline: "2026",
      client: "Shoplink",
      challenge:
        "Store owners connecting their own domain need to know exactly which nameservers to set.",
      approach:
        "I added a Cloudflare nameserver step to the store's domain settings and tidied the settings layout around it.",
      outcome:
        "Domain connection guidance inside the Shoplink dashboard.",
      highlights: ["Cloudflare NS settings in the domain flow"],
    },
    fleurGarden: {
      tagline: "A wholesale flower store with a real order history.",
      role: "Contributor",
      timeline: "2026",
      client: "Fleur Garden",
      challenge:
        "Order details were still running on mock data.",
      approach:
        "I replaced the mock order data with the backend's responses and added fallback images.",
      outcome:
        "Order details showing real data.",
      highlights: ["Order details on live backend data", "Image fallbacks"],
    },
    gbaru: agencyWork({
      tagline: "A trade network that opens the world to local business.",
      timeline: "2024 — 2026",
      client: "GBARU",
      challenge:
        "Connecting buyers and suppliers across countries means listings, procurement auctions and company profiles, in several languages, on web and mobile.",
      approach:
        "A Next.js front end over a Laravel API, with rich-text listings, auctions and a Flutter mobile app on the same backend.",
      outcome:
        "gbaru.com — an AI-assisted B2B platform with listings and procurement across 25+ countries.",
      highlights: ["Listings and procurement auctions", "Company profiles", "Web, API and mobile clients"],
    }),
    platinium: agencyWork({
      tagline: "A catalogue for professional kitchens.",
      timeline: "2025 — 2026",
      client: "Platinium-17",
      challenge:
        "A supplier carrying dozens of brands needed its whole range browsable by category, plus projects and news.",
      approach:
        "A multilingual Next.js catalogue backed by its own admin panel.",
      outcome: "platinium-17.az — brands, categories, portfolio and news.",
      highlights: ["Brand and category catalogue", "Portfolio and news", "Admin panel"],
    }),
    elba: agencyWork({
      tagline: "Earth. Life. Better. Azerbaijan.",
      timeline: "2025 — 2026",
      client: "ELBA",
      challenge:
        "An industrial complex needed a corporate presence that explains its products, production and sustainability work.",
      approach: "A multilingual Next.js corporate site.",
      outcome: "elba.az — products, sustainability, production and news.",
      highlights: ["Product pages", "Sustainability and production", "News"],
    }),
    glassHouse: agencyWork({
      tagline: "Glass processing, shown on screen.",
      timeline: "2025",
      client: "Glass House",
      challenge:
        "A glass processor needed to present products, services and finished projects, and hire.",
      approach: "A multilingual Next.js corporate site.",
      outcome: "glasshouse.az — products, services, projects, vacancies and gallery.",
      highlights: ["Products and services", "Projects and gallery", "Vacancies"],
    }),
    lezzetGroup: agencyWork({
      tagline: "Thirty years of a food group, on one site.",
      timeline: "2024",
      client: "Lezzet Group",
      challenge: "A long-running food group needed its business lines, brands and export in one place.",
      approach: "A Laravel site with a Bootstrap admin.",
      outcome: "lezzet.az — business lines, brands and export.",
      highlights: ["Business lines", "Brands", "Export"],
    }),
    shamkirAgro: agencyWork({
      tagline: "An agricultural company from Shamkir.",
      timeline: "2026",
      client: "Şəmkir Aqro",
      challenge: "A presence for the company's products in three languages.",
      approach: "A multilingual Next.js corporate site.",
      outcome: "shamkiragro.az — about, products and contact.",
      highlights: ["About", "Products", "Three languages"],
    }),
    innosert: agencyWork({
      tagline: "Exams, results and certificates in one place.",
      timeline: "2025",
      client: "Innosert",
      challenge: "Running public, private and paid exams and issuing certificates online.",
      approach: "A Next.js front end over a Laravel API.",
      outcome: "An exam platform with results and certificates.",
      highlights: ["Public and code-protected exams", "Paid exams", "Results and certificates"],
    }),
    azfar: agencyWork({
      tagline: "Reservations, run from one panel.",
      timeline: "2024 — 2025",
      client: "Azfar Group",
      challenge: "Managing reservations, including automatic ones, for the group's staff.",
      approach: "A Next.js CRM over a Laravel API.",
      outcome: "An internal reservation CRM.",
      highlights: ["Reservations", "Automatic reservation rules", "Role permissions"],
    }),
    feridinEvi: agencyWork({
      tagline: "Comfortable and safe living.",
      timeline: "2025",
      client: "Fərid'in Evi",
      challenge: "A rental housing concept needed its homes listed, searchable and on a map.",
      approach: "A multilingual Next.js site with Leaflet maps and its own admin panel.",
      outcome: "Listings, search, map and campaign sign-ups.",
      highlights: ["Listings and search", "Map of the homes", "Admin panel"],
    }),
    agriman: agencyWork({
      tagline: "Agricultural consulting, with advice on the record.",
      timeline: "2025 — 2026",
      client: "Agriman",
      challenge: "A consulting firm needed its services, projects and expert advice online, in Azerbaijan and Türkiye.",
      approach: "A multilingual Next.js site with its own admin panel and a Turkish edition.",
      outcome: "Services, projects, blog and application forms.",
      highlights: ["Services and projects", "Expert blog", "Turkish edition"],
    }),
    bcGroup: agencyWork({
      tagline: "Equipment, made and imported.",
      timeline: "2025",
      client: "BC Group",
      challenge: "Presenting the equipment the company manufactures and imports.",
      approach: "A multilingual Next.js corporate site.",
      outcome: "Product range, FAQ and enquiry forms.",
      highlights: ["Product range", "FAQ", "Enquiry forms"],
    }),
    consultex: agencyWork({
      tagline: "A consulting company, introduced.",
      timeline: "2025",
      client: "Consultex",
      challenge: "A corporate presence with dependable contact flows.",
      approach: "A multilingual Next.js site with its own admin panel.",
      outcome: "Corporate site with validated contact forms.",
      highlights: ["Corporate pages", "Validated contact forms", "Admin panel"],
    }),
    greenCaspian: agencyWork({
      tagline: "A corporate site, in several languages.",
      timeline: "2025",
      client: "Green Caspian",
      challenge: "A multilingual corporate presence the client can update.",
      approach: "A multilingual Next.js site with its own admin panel.",
      outcome: "Corporate site with admin-managed content.",
      highlights: ["Corporate pages", "Admin panel"],
    }),
    agriGubre: agencyWork({
      tagline: "A fertiliser company, online.",
      timeline: "2025",
      client: "AgriGübrə",
      challenge: "A multilingual corporate presence.",
      approach: "A multilingual Next.js corporate site.",
      outcome: "Corporate site.",
      highlights: ["Corporate pages", "Multilingual"],
    }),
    bakuCreators: agencyWork({
      tagline: "A videography studio's showcase.",
      timeline: "2025",
      client: "Baku Creators",
      challenge: "Showing a studio's services and work.",
      approach: "A Next.js site.",
      outcome: "Services and showcase site.",
      highlights: ["Services", "Showcase"],
    }),
  },
} as const;
