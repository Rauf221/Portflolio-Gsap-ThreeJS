import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { metadata as siteMetadata } from "@/content/site";

/*
 * Self-hosted via next/font: same variable axes the old Google <link> served
 * (wght 100..900, both styles), but from our own origin with zero
 * render-blocking CSS request and built-in size-adjusted fallback metrics.
 * Exposed as a CSS variable; globals.css folds it into --font-sans-project,
 * which every stylesheet already reads.
 */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${hanken.variable}`} suppressHydrationWarning>
      <head>
        {/* /about still @imports its three display families from Google at
            runtime (Cinzel, Space Grotesk, Space Mono) — the preconnects are
            for that request, not for Hanken, which is self-hosted above. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
