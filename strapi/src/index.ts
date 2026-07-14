import { seedDemoPages } from "./seed";
import { seedAppearance } from "./seed/appearance";
import { seedCustomBlocks } from "./seed/custom-blocks";

const AUTHENTICATED_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::page.page.create",
  "api::page.page.update",
  "api::page.page.delete",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::post.post.create",
  "api::post.post.update",
  "api::post.post.delete",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::category.category.create",
  "api::category.category.update",
  "api::category.category.delete",
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "api::tag.tag.create",
  "api::tag.tag.update",
  "api::tag.tag.delete",
  "api::content-revision.content-revision.find",
  "api::content-revision.content-revision.findOne",
  "api::content-revision.content-revision.create",
  "api::menu.menu.find",
  "api::menu.menu.findOne",
  "api::menu.menu.create",
  "api::menu.menu.update",
  "api::menu.menu.delete",
  "api::theme.theme.find",
  "api::theme.theme.findOne",
  "api::theme.theme.create",
  "api::theme.theme.update",
  "api::theme.theme.delete",
  "api::block-pattern.block-pattern.find",
  "api::block-pattern.block-pattern.findOne",
  "api::block-pattern.block-pattern.create",
  "api::block-pattern.block-pattern.update",
  "api::block-pattern.block-pattern.delete",
  "api::custom-block.custom-block.find",
  "api::custom-block.custom-block.findOne",
  "api::custom-block.custom-block.create",
  "api::custom-block.custom-block.update",
  "api::custom-block.custom-block.delete",
  "api::site-setting.site-setting.find",
  "api::site-setting.site-setting.update",
  "api::ai-setting.ai-setting.find",
  "api::ai-setting.ai-setting.update",
  "plugin::upload.read",
  "plugin::upload.assets.create",
  "plugin::upload.assets.update",
  "plugin::upload.assets.destroy",
];

const EDITOR_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::page.page.create",
  "api::page.page.update",
  "api::page.page.delete",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::post.post.create",
  "api::post.post.update",
  "api::post.post.delete",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::category.category.create",
  "api::category.category.update",
  "api::category.category.delete",
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "api::tag.tag.create",
  "api::tag.tag.update",
  "api::tag.tag.delete",
  "api::content-revision.content-revision.find",
  "api::content-revision.content-revision.findOne",
  "api::content-revision.content-revision.create",
  "api::menu.menu.find",
  "api::menu.menu.findOne",
  "api::menu.menu.create",
  "api::menu.menu.update",
  "api::menu.menu.delete",
  "api::theme.theme.find",
  "api::theme.theme.findOne",
  "api::theme.theme.create",
  "api::theme.theme.update",
  "api::theme.theme.delete",
  "api::block-pattern.block-pattern.find",
  "api::block-pattern.block-pattern.findOne",
  "api::block-pattern.block-pattern.create",
  "api::block-pattern.block-pattern.update",
  "api::block-pattern.block-pattern.delete",
  "api::custom-block.custom-block.find",
  "api::custom-block.custom-block.findOne",
  "api::custom-block.custom-block.create",
  "api::custom-block.custom-block.update",
  "api::custom-block.custom-block.delete",
  "api::site-setting.site-setting.find",
  "api::site-setting.site-setting.update",
  "api::ai-setting.ai-setting.find",
  "api::ai-setting.ai-setting.update",
  "plugin::upload.read",
  "plugin::upload.assets.create",
  "plugin::upload.assets.update",
  "plugin::upload.assets.destroy",
];

const AUTHOR_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::post.post.create",
  "api::post.post.update",
  "api::post.post.delete",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::category.category.create",
  "api::category.category.update",
  "api::category.category.delete",
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "api::tag.tag.create",
  "api::tag.tag.update",
  "api::tag.tag.delete",
  "api::content-revision.content-revision.find",
  "api::content-revision.content-revision.findOne",
  "api::content-revision.content-revision.create",
  "plugin::upload.read",
  "plugin::upload.assets.create",
];

const PUBLIC_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::menu.menu.find",
  "api::menu.menu.findOne",
  "api::theme.theme.find",
  "api::theme.theme.findOne",
  "api::site-setting.site-setting.find",
  "api::block-pattern.block-pattern.find",
  "api::block-pattern.block-pattern.findOne",
  "api::custom-block.custom-block.find",
  "api::custom-block.custom-block.findOne",
];

async function grantPermissions(
  strapi: import("@strapi/strapi").Core.Strapi,
  roleId: number,
  actions: string[],
) {
  const existing = await strapi.db.query("plugin::users-permissions.permission").findMany({
    where: { role: roleId },
  });
  const existingActions = new Set(existing.map((permission: { action: string }) => permission.action));

  for (const action of actions) {
    if (existingActions.has(action)) continue;
    await strapi.db.query("plugin::users-permissions.permission").create({
      data: { action, role: roleId },
    });
  }
}

async function ensureRole(
  strapi: import("@strapi/strapi").Core.Strapi,
  name: string,
  description: string,
  actions: string[],
) {
  let role = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: name },
  });

  if (!role) {
    role = await strapi.db.query("plugin::users-permissions.role").create({
      data: { name, description, type: name },
    });
  }

  await grantPermissions(strapi, role.id, actions);
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: import("@strapi/strapi").Core.Strapi }) {
    const authenticatedRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "authenticated" } });

    if (authenticatedRole) {
      await grantPermissions(strapi, authenticatedRole.id, AUTHENTICATED_PERMISSIONS);
    }

    await ensureRole(strapi, "editor", "Can manage pages, posts, and media", EDITOR_PERMISSIONS);
    await ensureRole(strapi, "author", "Can manage own posts and upload media", AUTHOR_PERMISSIONS);

    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (publicRole) {
      await grantPermissions(strapi, publicRole.id, PUBLIC_PERMISSIONS);
    }

    await ensureDefaultAppUser(strapi);
    await seedDemoPages(strapi);
    await seedAppearance(strapi);
    await seedCustomBlocks(strapi);
    registerScheduledPublishJob(strapi);
  },
};

async function registerScheduledPublishJob(strapi: import("@strapi/strapi").Core.Strapi) {
  const publishDuePages = async () => {
    const now = new Date().toISOString();
    const due = await strapi.db.query("api::page.page").findMany({
      where: {
        page_status: "scheduled",
        scheduled_at: { $lte: now },
      },
      limit: 50,
    });

    for (const page of due) {
      await strapi.documents("api::page.page").update({
        documentId: page.documentId,
        data: {
          page_status: "published",
          publishedAt: new Date(),
          scheduled_at: undefined,
        },
      });
      strapi.log.info(`Published scheduled page: /${page.slug}`);
    }
  };

  setInterval(() => {
    void publishDuePages().catch((error: unknown) => {
      strapi.log.error("Scheduled publish job failed", error);
    });
  }, 60_000);

  void publishDuePages();
}

async function ensureDefaultAppUser(strapi: import("@strapi/strapi").Core.Strapi) {
  const email = process.env.NEXTPRESS_DEFAULT_USER_EMAIL ?? "admin@nextpress.local";
  const password = process.env.NEXTPRESS_DEFAULT_USER_PASSWORD ?? "NextPressDev123";
  const username = process.env.NEXTPRESS_DEFAULT_USER_USERNAME ?? "nextpress";

  const authenticatedRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "authenticated" } });
  if (!authenticatedRole) {
    strapi.log.warn("NextPress: authenticated role missing, skipping app user bootstrap");
    return;
  }

  const existingByEmail = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { email },
  });
  const existingByUsername = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { username },
  });

  for (const user of [existingByEmail, existingByUsername]) {
    if (user) {
      await strapi.plugin("users-permissions").service("user").remove({ id: user.id });
    }
  }

  try {
    await strapi.plugin("users-permissions").service("user").add({
      username,
      email,
      password,
      provider: "local",
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
    });
    strapi.log.info(`NextPress app user ready: ${email}`);
  } catch (error) {
    strapi.log.error("NextPress app user bootstrap failed", error);
  }
}
