import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { workDetail, worksPage } from "@/content/site";
import { WORKS_META, findWork } from "@/data/worksMeta";
import WorkDetailPage from "./WorkDetailPage";

/* Every project is a known slug at build time, so all of them prerender as
   static pages — same as the rest of the site. */
export function generateStaticParams() {
  return WORKS_META.map((work) => ({ slug: work.slug }));
}

/* Params are a Promise in this version of Next — awaiting it is required, not
   optional; see node_modules/next/dist/docs. */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = findWork(slug);
  if (!work) return {};

  const archive = worksPage.items[work.key as keyof typeof worksPage.items];
  const copy = workDetail.items[work.key as keyof typeof workDetail.items];
  const title = `${archive.title} ${workDetail.metaSuffix}`;

  return {
    title,
    description: copy.tagline,
    openGraph: {
      title,
      description: copy.tagline,
      type: "article",
      images: work.poster ? [{ url: work.poster }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!findWork(slug)) notFound();
  return <WorkDetailPage slug={slug} />;
}
