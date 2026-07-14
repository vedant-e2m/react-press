// @ts-nocheck
import { BUILTIN_CUSTOM_BLOCK_SEEDS } from "@nextpress/shared";

export async function seedCustomBlocks(strapi: import("@strapi/strapi").Core.Strapi) {
  for (const seed of BUILTIN_CUSTOM_BLOCK_SEEDS) {
    const existing = await strapi.db.query("api::custom-block.custom-block").findOne({
      where: { puck_type: seed.puckType },
    });

    const data = {
      puck_type: seed.puckType,
      label: seed.label,
      category: seed.category ?? "sections",
      fields: seed.fields,
      template: seed.template,
    };

    if (existing) {
      await strapi.documents("api::custom-block.custom-block").update({
        documentId: existing.documentId,
        data,
      });
      strapi.log.info(`Custom block updated: ${seed.label} (${seed.puckType})`);
      continue;
    }

    await strapi.documents("api::custom-block.custom-block").create({ data });
    strapi.log.info(`Custom block seeded: ${seed.label} (${seed.puckType})`);
  }
}
