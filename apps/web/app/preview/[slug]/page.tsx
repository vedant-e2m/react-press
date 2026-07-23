import { notFound } from "next/navigation";
import { PublicBuilderPage } from "@/components/builder/public-page";
import { getCms } from "@/lib/cms";

type PageProps = { params: Promise<{ slug: string }> };

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getCms().getPageBySlug(slug);

  if (!page?.builderData) {
    notFound();
  }

  return (
    <>
      <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
        Preview mode — {page.status === "published" ? "published" : "draft"}
      </div>
      <PublicBuilderPage document={page.builderData} />
    </>
  );
}
