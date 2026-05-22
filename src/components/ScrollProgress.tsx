import { type RefObject } from "react";

type Props = { progressRef: RefObject<HTMLDivElement | null> };

export function ScrollProgress({ progressRef }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(255,255,255,0.06)",
        zIndex: 9998,
      }}
    >
      <div
        ref={progressRef}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, var(--indigo), var(--sphere))",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
