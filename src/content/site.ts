export const metadata = {
  title: "Rauf Huseynzade — Full Stack / Creative Web Developer",
  description:
    "Next.js, React, TypeScript, interactive web experiences, dashboards, and production-grade frontend engineering.",
} as const;

export const nav = {
  brand: "Rauf Huseynzade",
  initials: "RH",
  hireMe: "Contact",
  sections: {
    hero: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
  },
} as const;

export const hero = {
  badge: "Available for new work · 2026",
  line1: "Rauf",
  line2: "Huseynzade",
  subBefore: "I build",
  subStrong: " high-performance, production-ready web applications ",
  subAfter:
    "with the modern React ecosystem — interactive UI, motion, 3D visuals, and scalable frontend architecture.",
  ctaWork: "View work",
  ctaTalk: "Let's talk",
  scroll: "SCROLL",
} as const;

export const about = {
  label: "About",
  headline: "I|build|large-scale|web|experiences.",
  body1:
    "I'm Rauf Huseynzade — a Full Stack developer focused on Next.js App Router, TypeScript, Tailwind, animation pipelines, dashboards, and multilingual platforms.",
  body2:
    "I ship production apps, real-estate platforms, CMS/editor experiences, real-time systems, and creative WebGL/Three.js showcases.",
  photoLabel: "[ PHOTO ]",
  currentLabel: "Focus",
  currentCompany: "Full Stack / Creative Web",
  stats: {
    projects: { num: "10+", label: "Projects" },
    stack: { num: "Full", label: "Stack" },
    langs: { num: "3", label: "Languages" },
  },
} as const;

export const skills = {
  label: "Skills",
  headingLine1: "What I",
  headingAccent: "do best",
  headingLine2: ".",
  proficiency: "Proficiency",
  scrollHint: "Scroll to explore",
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
    reactNext: { name: "React / Next.js" },
    typescript: { name: "TypeScript" },
    threeGsap: { name: "Three.js / GSAP" },
    nextInfra: { name: "Next.js infrastructure" },
    tanstackFirebase: { name: "TanStack Query · Firebase" },
    editorsCms: { name: "TipTap · CKEditor · Zod" },
    realtime: { name: "Socket.IO · JWT" },
    deploy: { name: "GitHub Actions · PM2 · VPS" },
  },
} as const;

export const projects = {
  label: "Selected projects",
  countLabel: (count: number) => `${count} projects`,
  headingLine1: "Work",
  headingAccent: "that speaks",
  headingLine2: ".",
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
    wayouth: {
      title: "World Azerbaijanis Youth Organization",
      subtitle: "worldazeyouth.az",
      desc: "Corporate site from scratch with custom UI architecture and admin capabilities.",
      tags: "Next.js, Admin, Motion, Brand design",
    },
    portfolioLab: {
      title: "Portfolio / WebGL experiments",
      subtitle: "Creative developer",
      desc: "Interactive scenes with GSAP, Three.js, R3F, and OGL — scroll-driven UX.",
      tags: "Three.js, GSAP, R3F, OGL, Motion",
    },
    bakuFlames: {
      title: "Baku Flames · Jury system",
      subtitle: "Event / media platform",
      desc: "Role-based UI, Redux Toolkit, custom HTTP server architecture, and media integration.",
      tags: "Redux Toolkit, Axios, Next.js, Sass, React Player",
    },
    gbaru: {
      title: "Gbaru New Front",
      subtitle: "Real-time frontend platform",
      desc: "Socket.IO, TipTap editor stack, multilingual flows, and modern UI architecture.",
      tags: "Socket.IO, TipTap, TanStack Query, Swiper, Framer Motion",
    },
    fonderra: {
      title: "Fonderra Ibrahim",
      subtitle: "Dashboard / admin panel",
      desc: "CKEditor Premium with TanStack Table and Recharts for data-heavy operations.",
      tags: "CKEditor 5, TanStack Table, Recharts, RHF, Zod",
    },
  },
} as const;

export const experience = {
  label: "Experience",
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

export const contact = {
  label: "Get in touch",
  headline: "Let's|build|something|legendary.",
  blurb:
    "Open to freelance, full-time roles, and strong product collaborations. Message me — let's ship crisp frontend and bold motion.",
  namePlaceholder: "Your name",
  emailPlaceholder: "your@email.com",
  messagePlaceholder: "Tell me about your project…",
  send: "Send message",
  info: {
    email: "Email",
    location: "Location",
    availability: "Availability",
  },
  infoValues: {
    email: "hello@youremail.com",
    location: "Baku, Azerbaijan",
    availability: "Open to new opportunities",
  },
  socials: {
    github: "GitHub",
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    dribbble: "Dribbble",
  },
} as const;

export const footer = {
  line1: "© 2026 Rauf Huseynzade — GSAP · Three.js · Next.js",
  line2: "Portfolio",
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
