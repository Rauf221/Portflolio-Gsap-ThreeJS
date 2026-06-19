import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fiddle-digital/string-tune"],
  // Serve next/image output as modern formats; gzip/br on HTML/CSS/JS responses.
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
