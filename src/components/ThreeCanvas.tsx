import { type RefObject } from "react";

type Props = { canvasRef: RefObject<HTMLCanvasElement | null> };

export function ThreeCanvas({ canvasRef }: Props) {
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: "50%", left: "50%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}
