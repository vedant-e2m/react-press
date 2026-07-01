// @ts-nocheck
import { DEMO_PAGES } from "../seed/demo-pages";

async function seedDemoPages(strapi: import("@strapi/strapi").Core.Strapi) {
  for (const page of DEMO_PAGES) {
    const existing = await strapi.db.query("api::page.page").findOne({
      where: { slug: page.slug },
    });

    const isPublished = page.page_status === "published";
    const data = {
      title: page.title,
      slug: page.slug,
      page_status: page.page_status,
      puck_data: page.puck_data,
      seo_title: "seo_title" in page ? page.seo_title : undefined,
      seo_description: "seo_description" in page ? page.seo_description : undefined,
      publishedAt: isPublished ? new Date() : undefined,
    };

    if (existing) {
      await strapi.documents("api::page.page").update({
        documentId: existing.documentId,
        data: { puck_data: page.puck_data },
      });
      strapi.log.info(`Demo page updated: /${page.slug}`);
      continue;
    }

    await strapi.documents("api::page.page").create({ data });

    strapi.log.info(`Demo page seeded: /${page.slug} (${page.page_status})`);
  }
}

export { seedDemoPages };
