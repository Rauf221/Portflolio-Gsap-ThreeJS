import { type RefObject } from "react";

type Props = { canvasRef: RefObject<HTMLCanvasElement | null> };

export function ThreeCanvas({ canvasRef }: Props) {
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: "50%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}
