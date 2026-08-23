import type { Metadata } from "next";
import { worksPage } from "@/content/site";
import WorksPage from "./WorksPage";

export const metadata: Metadata = {
  title: worksPage.metaTitle,
  description: worksPage.metaDescription,
};

export default function Page() {
  return <WorksPage />;
}
