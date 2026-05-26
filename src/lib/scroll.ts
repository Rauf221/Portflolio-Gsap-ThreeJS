import { getLenisInstance } from "./lenisInstance";

export function scrollToTop(immediate = true) {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo(0, 0);
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    return;
  }

  el.scrollIntoView({ behavior: "smooth" });
}
