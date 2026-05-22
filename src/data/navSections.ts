export const NAV_SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];
