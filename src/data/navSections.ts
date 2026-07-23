export const NAV_SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];
