import { type RefObject, useEffect } from "react";

export function usePortfolioCursor(
  cursorRef: RefObject<HTMLDivElement | null>,
  cursorDotRef: RefObject<HTMLDivElement | null>,
  loaded: boolean,
) {
  useEffect(() => {
    if (!loaded) return;
    const cursor = cursorRef.current!;
    const dot = cursorDotRef.current!;

    // Touch devices have no cursor to replace. Without this guard the two
    // fixed elements sit visible in the top-left corner (they only move on
    // mousemove) and the lerp rAF runs for nothing.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      cursor.style.display = "none";
      dot.style.display = "none";
      return;
    }
    let cx = 0,
      cy = 0,
      dx = 0,
      dy = 0;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`;
    };
    window.addEventListener("mousemove", move);

    let rafId = 0;
    const lerp = () => {
      cx += (dx - cx) * 0.12;
      cy += (dy - cy) * 0.12;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      rafId = requestAnimationFrame(lerp);
    };
    lerp();

    const expand = () => {
      cursor.style.width = "60px";
      cursor.style.height = "60px";
      cursor.style.opacity = "0.4";
    };
    const shrink = () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.opacity = "0.6";
    };
    const interactive = document.querySelectorAll("a,button,[data-cursor]");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, [loaded, cursorRef, cursorDotRef]);
}
