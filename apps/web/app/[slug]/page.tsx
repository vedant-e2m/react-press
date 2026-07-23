import { notFound } from "next/navigation";
import { PublicBuilderPage } from "@/components/builder/public-page";
import { getCms } from "@/lib/cms";

type PageProps = { params: Promise<{ slug: string }> };

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getCms().getPageBySlug(slug, { status: "published" });

  if (!page?.builderData) {
    notFound();
  }

  return <PublicBuilderPage document={page.builderData} />;
}

export async function generateStaticParams() {
  try {
    const slugs = await getCms().listPublishedPageSlugs(100);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;
