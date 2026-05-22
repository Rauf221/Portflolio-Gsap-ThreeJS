import type { Metadata } from "next";
import { aboutPage } from "@/content/site";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
};

export default function Page() {
  return <AboutPage />;
}
