import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenisInstance() {
  return lenisInstance;
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}
