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

    const lerp = () => {
      cx += (dx - cx) * 0.12;
      cy += (dy - cy) * 0.12;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      requestAnimationFrame(lerp);
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
    document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => window.removeEventListener("mousemove", move);
  }, [loaded, cursorRef, cursorDotRef]);
}
