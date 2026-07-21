// @ts-nocheck
import { DEMO_PAGES, REMOVED_DEMO_SLUGS } from "../seed/demo-pages";

async function removeOldDemoPages(strapi: import("@strapi/strapi").Core.Strapi) {
  for (const slug of REMOVED_DEMO_SLUGS) {
    const existing = await strapi.db.query("api::page.page").findOne({
      where: { slug },
    });

    if (existing) {
      await strapi.documents("api::page.page").delete({
        documentId: existing.documentId,
      });
      strapi.log.info(`Removed old demo page: /${slug}`);
    }
  }
}

async function seedDemoPages(strapi: import("@strapi/strapi").Core.Strapi) {
  await removeOldDemoPages(strapi);

  for (const page of DEMO_PAGES) {
    const existing = await strapi.db.query("api::page.page").findOne({
      where: { slug: page.slug },
    });

    const isPublished = page.page_status === "published";
    const data = {
      title: page.title,
      slug: page.slug,
      page_status: page.page_status,
      builder_data: page.builder_data,
      seo_title: "seo_title" in page ? page.seo_title : undefined,
      seo_description: "seo_description" in page ? page.seo_description : undefined,
      publishedAt: isPublished ? new Date() : undefined,
    };

    if (existing) {
      await strapi.documents("api::page.page").update({
        documentId: existing.documentId,
        data: {
          title: page.title,
          builder_data: page.builder_data,
          seo_title: "seo_title" in page ? page.seo_title : undefined,
          seo_description: "seo_description" in page ? page.seo_description : undefined,
        },
      });
      strapi.log.info(`Demo page updated: /${page.slug}`);
      continue;
    }

    await strapi.documents("api::page.page").create({ data });

    strapi.log.info(`Demo page seeded: /${page.slug} (${page.page_status})`);
  }
}

export { seedDemoPages };
