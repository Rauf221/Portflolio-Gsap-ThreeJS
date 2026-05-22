import { type RefObject } from "react";

type Props = {
  cursorRef: RefObject<HTMLDivElement | null>;
  cursorDotRef: RefObject<HTMLDivElement | null>;
};

export function CustomCursor({ cursorRef, cursorDotRef }: Props) {
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(155,148,255,0.6)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          mixBlendMode: "exclusion",
        }}
      />
      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--sphere)",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
}
