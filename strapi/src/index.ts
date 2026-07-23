import { seedDemoPages } from "./seed";
import { seedAppearance } from "./seed/appearance";

/**
 * Users & Permissions roles are for public/API consumers only.
 * Content editing happens in Strapi Admin (+ Page Builder plugin), not via JWT REST writes.
 */
const READ_ONLY_CONTENT_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "api::menu.menu.find",
  "api::menu.menu.findOne",
  "api::theme.theme.find",
  "api::theme.theme.findOne",
  "api::site-setting.site-setting.find",
  "api::block-pattern.block-pattern.find",
  "api::block-pattern.block-pattern.findOne",
  "api::custom-block.custom-block.find",
  "api::custom-block.custom-block.findOne",
  "plugin::upload.read",
];

const AUTHENTICATED_PERMISSIONS = [...READ_ONLY_CONTENT_PERMISSIONS];

const EDITOR_PERMISSIONS = [...READ_ONLY_CONTENT_PERMISSIONS];

const AUTHOR_PERMISSIONS = [
  "api::page.page.find",
  "api::page.page.findOne",
  "api::post.post.find",
  "api::post.post.findOne",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "plugin::upload.read",
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

/**
 * Grants missing permissions and revokes any extras not in the desired set.
 */
async function syncPermissions(
  strapi: import("@strapi/strapi").Core.Strapi,
  roleId: number,
  actions: string[],
) {
  const desired = new Set(actions);
  const existing = await strapi.db.query("plugin::users-permissions.permission").findMany({
    where: { role: roleId },
  });

  const existingActions = new Set(
    existing.map((permission: { action: string }) => permission.action),
  );

  for (const action of actions) {
    if (existingActions.has(action)) continue;
    await strapi.db.query("plugin::users-permissions.permission").create({
      data: { action, role: roleId },
    });
  }

  for (const permission of existing as Array<{ id: number; action: string }>) {
    if (desired.has(permission.action)) continue;
    await strapi.db.query("plugin::users-permissions.permission").delete({
      where: { id: permission.id },
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

  await syncPermissions(strapi, role.id, actions);
}

/**
 * Optionally seeds a Users & Permissions user for local API experiments.
 * Disabled by default — Strapi Admin is the sole CMS login.
 */
async function ensureDefaultAppUser(strapi: import("@strapi/strapi").Core.Strapi) {
  if (process.env.NEXTPRESS_SEED_APP_USER !== "true") {
    return;
  }

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
  if (existingByEmail) {
    strapi.log.info(`NextPress app user already exists: ${email}`);
    return;
  }

  const existingByUsername = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { username },
  });
  if (existingByUsername) {
    strapi.log.info(`NextPress app user already exists: ${username}`);
    return;
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

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: import("@strapi/strapi").Core.Strapi }) {
    const authenticatedRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "authenticated" } });

    if (authenticatedRole) {
      await syncPermissions(strapi, authenticatedRole.id, AUTHENTICATED_PERMISSIONS);
    }

    await ensureRole(
      strapi,
      "editor",
      "Read-only content access (editing is Strapi Admin)",
      EDITOR_PERMISSIONS,
    );
    await ensureRole(
      strapi,
      "author",
      "Read-only content access (editing is Strapi Admin)",
      AUTHOR_PERMISSIONS,
    );

    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (publicRole) {
      await syncPermissions(strapi, publicRole.id, PUBLIC_PERMISSIONS);
    }

    await ensureDefaultAppUser(strapi);
    await seedDemoPages(strapi);
    await seedAppearance(strapi);
    registerScheduledPublishJob(strapi);
  },
};
