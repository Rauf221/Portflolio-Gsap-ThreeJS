"use client";
import UnicornStudioScene from "unicornstudio-react";
import { useEffect, useState } from "react";

const SHORT_H = 417;

export function UnicornHeroBackground() {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    function update() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size.w) return null;

  const isShort = size.h <= SHORT_H;
  const jsonFile = isShort ? "/scene-short.json" : "/tqUOEVC1RzDBa8u7C0tj.json";

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
        key={isShort ? "short" : "tall"}
        jsonFilePath={jsonFile}
        width={`${size.w}px`}
        height={`${size.h}px`}
        scale={1}
        dpi={1}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js"
      />
    </div>
  );
}
