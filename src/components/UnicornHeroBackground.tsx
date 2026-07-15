"use client";
import UnicornStudioScene from "unicornstudio-react";

export function UnicornHeroBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <UnicornStudioScene
        jsonFilePath="/unicorn/scene.json"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
      />
    </div>
  );
}
