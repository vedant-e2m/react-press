import { notFound } from "next/navigation";
import { PublicBuilderPage } from "@/components/builder/public-page";
import { getCms } from "@/lib/cms";

async function getPublishedPage(slug: string) {
  try {
    return await getCms().getPageBySlug(slug, { status: "published" });
  } catch {
    return null;
  }
}

export default async function Home() {
  const cms = getCms();
  let homepageSlug = "home";

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      homepageSlug = settings.homepageSlug?.trim() || "home";
    }
  } catch {
    homepageSlug = "home";
  }

  const page = await getPublishedPage(homepageSlug);

  if (!page?.builderData) {
    notFound();
  }

  return <PublicBuilderPage document={page.builderData} />;
}
