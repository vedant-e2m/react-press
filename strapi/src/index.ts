import { seedDemoPages } from "./seed";

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
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "plugin::upload.read",
  "plugin::upload.assets.create",
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
  "api::tag.tag.find",
  "api::tag.tag.findOne",
  "plugin::upload.read",
  "plugin::upload.assets.create",
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
  "api::tag.tag.find",
  "api::tag.tag.findOne",
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
  },
};

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
