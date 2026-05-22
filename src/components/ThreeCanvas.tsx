import { type RefObject } from "react";

type Props = { canvasRef: RefObject<HTMLCanvasElement | null> };

export function ThreeCanvas({ canvasRef }: Props) {
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}
