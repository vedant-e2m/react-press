import type {
  AiSettings,
  ContentBlockPattern,
  ContentCategory,
  ContentCustomBlock,
  ContentMenu,
  ContentPage,
  ContentPost,
  ContentRevision,
  ContentTag,
  ContentTheme,
  CreateBlockPatternInput,
  CreateCustomBlockInput,
  CreateMenuInput,
  CreatePostInput,
  CreateThemeInput,
  MenuItem,
  SiteSettings,
  ThemeConfig,
  UpdateMenuInput,
  UpdatePostInput,
  UpdateThemeInput,
} from "@nextpress/cms-core";
import type { CustomBlockField, PuckData } from "@nextpress/shared";
import { getStrapiUrl, strapi } from "@nextpress/strapi-client";
import { resolveMediaUrl } from "./media-helpers";
import { strapiPopulate } from "./strapi-query";

interface StrapiMediaRef {
  documentId?: string;
  url?: string;
}

interface StrapiPost {
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  post_status: ContentPost["status"];
  featured_image?: StrapiMediaRef | null;
  featured_image_url?: string | null;
  category?: { documentId: string } | null;
  tags?: { documentId: string }[];
  seo_title?: string | null;
  seo_description?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StrapiCategory {
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface StrapiTag {
  documentId: string;
  name: string;
  slug: string;
}

interface StrapiMenu {
  documentId: string;
  name: string;
  location: ContentMenu["location"];
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface StrapiTheme {
  documentId: string;
  name: string;
  slug: string;
  config: ThemeConfig;
  is_active: boolean;
  preview_image?: StrapiMediaRef | null;
  createdAt: string;
  updatedAt: string;
}

interface StrapiBlockPattern {
  documentId: string;
  name: string;
  description?: string | null;
  category: string;
  kind?: "section" | "page";
  puck_data: PuckData;
  preview_image?: StrapiMediaRef | null;
  createdAt: string;
  updatedAt: string;
}

interface StrapiCustomBlock {
  documentId: string;
  puck_type: string;
  label: string;
  category?: string | null;
  fields: CustomBlockField[];
  template: string;
  createdAt: string;
  updatedAt: string;
}

interface StrapiSiteSetting {
  site_name: string;
  tagline?: string | null;
  logo?: StrapiMediaRef | null;
  favicon?: StrapiMediaRef | null;
  homepage_slug?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  header_background?: string | null;
  custom_css?: string | null;
  social_links?: Record<string, string> | null;
  widget_areas?: SiteSettings["widgetAreas"];
  header_scripts?: string | null;
  footer_scripts?: string | null;
  cdn_url?: string | null;
  active_theme?: { documentId: string } | null;
}

function mediaUrl(ref?: StrapiMediaRef | null): string | null {
  if (!ref?.url) return null;
  return resolveMediaUrl(ref.url);
}

function mapPost(doc: StrapiPost): ContentPost {
  return {
    id: doc.documentId,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? null,
    content: doc.content ?? null,
    status: doc.post_status,
    featuredImageUrl: mediaUrl(doc.featured_image) ?? doc.featured_image_url ?? null,
    categoryId: doc.category?.documentId ?? null,
    tagIds: doc.tags?.map((t) => t.documentId) ?? [],
    seoTitle: doc.seo_title ?? null,
    seoDescription: doc.seo_description ?? null,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapMenu(doc: StrapiMenu): ContentMenu {
  return {
    id: doc.documentId,
    name: doc.name,
    location: doc.location,
    items: doc.items ?? [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapTheme(doc: StrapiTheme): ContentTheme {
  return {
    id: doc.documentId,
    name: doc.name,
    slug: doc.slug,
    config: doc.config ?? {},
    isActive: doc.is_active,
    previewImageUrl: mediaUrl(doc.preview_image),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapPattern(doc: StrapiBlockPattern): ContentBlockPattern {
  return {
    id: doc.documentId,
    name: doc.name,
    description: doc.description ?? null,
    category: doc.category,
    kind: doc.kind ?? "section",
    puckData: doc.puck_data,
    previewImageUrl: mediaUrl(doc.preview_image),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapCustomBlock(doc: StrapiCustomBlock): ContentCustomBlock {
  return {
    id: doc.documentId,
    puckType: doc.puck_type,
    label: doc.label,
    category: doc.category ?? "custom",
    fields: Array.isArray(doc.fields) ? doc.fields : [],
    template: doc.template ?? "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapSiteSettings(doc: StrapiSiteSetting): SiteSettings {
  return {
    siteName: doc.site_name,
    tagline: doc.tagline ?? null,
    logoUrl: doc.logo_url ?? mediaUrl(doc.logo),
    faviconUrl: doc.favicon_url ?? mediaUrl(doc.favicon),
    headerBackground: doc.header_background ?? null,
    customCss: doc.custom_css ?? null,
    socialLinks: doc.social_links ?? null,
    widgetAreas: doc.widget_areas ?? null,
    headerScripts: doc.header_scripts ?? null,
    footerScripts: doc.footer_scripts ?? null,
    cdnUrl: doc.cdn_url ?? null,
    activeThemeId: doc.active_theme?.documentId ?? null,
    homepageSlug: doc.homepage_slug ?? "home",
  };
}

export async function listPosts(token?: string): Promise<ContentPost[]> {
  const docs = await strapi.find<StrapiPost>(
    "posts",
    {
      sort: "updatedAt:desc",
      "pagination[pageSize]": "100",
      ...strapiPopulate("featured_image", "category", "tags"),
    },
    token,
  );
  return docs.map(mapPost);
}

export async function getPost(id: string, token?: string): Promise<ContentPost | null> {
  try {
    const doc = await strapi.findOne<StrapiPost>(
      "posts",
      id,
      strapiPopulate("featured_image", "category", "tags"),
      token,
    );
    return mapPost(doc);
  } catch {
    return null;
  }
}

export async function getPostBySlug(
  slug: string,
  options?: { status?: ContentPost["status"] },
): Promise<ContentPost | null> {
  const params: Record<string, string> = {
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
    ...strapiPopulate("featured_image", "category", "tags"),
  };
  if (options?.status) params["filters[post_status][$eq]"] = options.status;
  const docs = await strapi.find<StrapiPost>("posts", params);
  return docs[0] ? mapPost(docs[0]) : null;
}

export async function createPost(input: CreatePostInput, token: string): Promise<ContentPost> {
  const doc = await strapi.create<StrapiPost>(
    "posts",
    {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      post_status: input.status ?? "draft",
      featured_image_url: input.featuredImageUrl,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
      category: input.categoryId ?? undefined,
      tags: input.tagIds ?? undefined,
    },
    token,
  );
  return mapPost(doc);
}

export async function updatePost(id: string, input: UpdatePostInput, token: string): Promise<ContentPost> {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.content !== undefined) data.content = input.content;
  if (input.status !== undefined) data.post_status = input.status;
  if (input.featuredImageUrl !== undefined) data.featured_image_url = input.featuredImageUrl;
  if (input.seoTitle !== undefined) data.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) data.seo_description = input.seoDescription;
  if (input.publishedAt !== undefined) data.publishedAt = input.publishedAt;
  if (input.categoryId !== undefined) data.category = input.categoryId;
  if (input.tagIds !== undefined) data.tags = input.tagIds;
  const doc = await strapi.update<StrapiPost>("posts", id, data, token);
  return mapPost(doc);
}

export async function deletePost(id: string, token: string): Promise<void> {
  await strapi.update("posts", id, { post_status: "trash" }, token);
}

export async function listCategories(): Promise<ContentCategory[]> {
  const docs = await strapi.find<StrapiCategory>("categories", { sort: "name:asc" });
  return docs.map((c) => ({
    id: c.documentId,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
  }));
}

export async function createCategory(
  input: { name: string; slug: string; description?: string | null },
  token: string,
): Promise<ContentCategory> {
  const doc = await strapi.create<StrapiCategory>(
    "categories",
    { name: input.name, slug: input.slug, description: input.description },
    token,
  );
  return { id: doc.documentId, name: doc.name, slug: doc.slug, description: doc.description ?? null };
}

export async function updateCategory(
  id: string,
  input: { name?: string; slug?: string; description?: string | null },
  token: string,
): Promise<ContentCategory> {
  const doc = await strapi.update<StrapiCategory>("categories", id, input, token);
  return { id: doc.documentId, name: doc.name, slug: doc.slug, description: doc.description ?? null };
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  await strapi.delete("categories", id, token);
}

export async function listTags(): Promise<ContentTag[]> {
  const docs = await strapi.find<StrapiTag>("tags", { sort: "name:asc" });
  return docs.map((t) => ({ id: t.documentId, name: t.name, slug: t.slug }));
}

export async function createTag(
  input: { name: string; slug: string },
  token: string,
): Promise<ContentTag> {
  const doc = await strapi.create<StrapiTag>("tags", input, token);
  return { id: doc.documentId, name: doc.name, slug: doc.slug };
}

export async function deleteTag(id: string, token: string): Promise<void> {
  await strapi.delete("tags", id, token);
}

interface StrapiRevision {
  documentId: string;
  title: string;
  resource_type: "page" | "post";
  resource_id: string;
  slug?: string | null;
  puck_data?: PuckData | null;
  content?: string | null;
  createdAt: string;
}

function mapRevision(doc: StrapiRevision): ContentRevision {
  return {
    id: doc.documentId,
    title: doc.title,
    resourceType: doc.resource_type,
    resourceId: doc.resource_id,
    slug: doc.slug ?? null,
    puckData: doc.puck_data ?? null,
    content: doc.content ?? null,
    createdAt: doc.createdAt,
  };
}

export async function listRevisions(
  resourceType: "page" | "post",
  resourceId: string,
  token: string,
): Promise<ContentRevision[]> {
  const docs = await strapi.find<StrapiRevision>(
    "content-revisions",
    {
      "filters[resource_type][$eq]": resourceType,
      "filters[resource_id][$eq]": resourceId,
      sort: "createdAt:desc",
      "pagination[pageSize]": "20",
    },
    token,
  );
  return docs.map(mapRevision);
}

export async function createRevision(
  input: {
    title: string;
    resourceType: "page" | "post";
    resourceId: string;
    slug?: string;
    puckData?: PuckData | null;
    content?: string | null;
    snapshot?: Record<string, unknown>;
  },
  token: string,
): Promise<ContentRevision> {
  const doc = await strapi.create<StrapiRevision>(
    "content-revisions",
    {
      title: input.title,
      resource_type: input.resourceType,
      resource_id: input.resourceId,
      slug: input.slug,
      puck_data: input.puckData,
      content: input.content,
      snapshot: input.snapshot,
    },
    token,
  );
  return mapRevision(doc);
}

export async function searchContent(
  query: string,
  token?: string,
): Promise<{ pages: ContentPage[]; posts: ContentPost[] }> {
  const q = query.trim();
  if (!q) return { pages: [], posts: [] };

  interface StrapiPageSearch {
    documentId: string;
    title: string;
    slug: string;
    page_status: ContentPage["status"];
    puck_data?: PuckData | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }

  const [pageDocs, postDocs] = await Promise.all([
    strapi.find<StrapiPageSearch>(
      "pages",
      {
        "filters[$or][0][title][$containsi]": q,
        "filters[$or][1][slug][$containsi]": q,
        "filters[page_status][$ne]": "trash",
        "pagination[pageSize]": "20",
      },
      token,
    ),
    strapi.find<StrapiPost>(
      "posts",
      {
        "filters[$or][0][title][$containsi]": q,
        "filters[$or][1][slug][$containsi]": q,
        "filters[post_status][$ne]": "trash",
        "pagination[pageSize]": "20",
      },
      token,
    ),
  ]);

  return {
    pages: pageDocs.map((doc) => ({
      id: doc.documentId,
      title: doc.title,
      slug: doc.slug,
      status: doc.page_status,
      puckData: doc.puck_data ?? null,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    posts: postDocs.map(mapPost),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const base = getStrapiUrl().replace(/\/$/, "");
    const query = new URLSearchParams(strapiPopulate("logo", "favicon", "active_theme"));
    const res = await fetch(`${base}/api/site-setting?${query}`);
    if (!res.ok) return { siteName: "NextPress" };
    const json = (await res.json()) as { data: StrapiSiteSetting };
    return mapSiteSettings(json.data);
  } catch {
    return { siteName: "NextPress" };
  }
}

export async function updateSiteSettings(
  input: Partial<SiteSettings>,
  token: string,
): Promise<SiteSettings> {
  const data: Record<string, unknown> = {};
  if (input.siteName !== undefined) data.site_name = input.siteName;
  if (input.tagline !== undefined) data.tagline = input.tagline;
  if (input.logoUrl !== undefined) data.logo_url = input.logoUrl;
  if (input.faviconUrl !== undefined) data.favicon_url = input.faviconUrl;
  if (input.homepageSlug !== undefined) data.homepage_slug = input.homepageSlug;
  if (input.headerBackground !== undefined) data.header_background = input.headerBackground;
  if (input.customCss !== undefined) data.custom_css = input.customCss;
  if (input.socialLinks !== undefined) data.social_links = input.socialLinks;
  if (input.widgetAreas !== undefined) data.widget_areas = input.widgetAreas;
  if (input.headerScripts !== undefined) data.header_scripts = input.headerScripts;
  if (input.footerScripts !== undefined) data.footer_scripts = input.footerScripts;
  if (input.cdnUrl !== undefined) data.cdn_url = input.cdnUrl;

  const base = getStrapiUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/site-setting`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`Failed to update site settings: ${res.status}`);
  const json = (await res.json()) as { data: StrapiSiteSetting };
  return mapSiteSettings(json.data);
}

interface StrapiAiSetting {
  provider?: string | null;
  model?: string | null;
  base_url?: string | null;
  api_key?: string | null;
}

function mapAiSettings(doc: StrapiAiSetting | null | undefined): AiSettings {
  return {
    provider: doc?.provider ?? "openrouter",
    model: doc?.model ?? null,
    baseUrl: doc?.base_url ?? null,
    apiKey: doc?.api_key ?? null,
  };
}

/** Fetch AI provider config. Admin-only — the caller must hold an authenticated token. */
export async function getAiSettings(token: string): Promise<AiSettings> {
  try {
    const base = getStrapiUrl().replace(/\/$/, "");
    const res = await fetch(`${base}/api/ai-setting`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return mapAiSettings(null);
    const json = (await res.json()) as { data: StrapiAiSetting | null };
    return mapAiSettings(json.data);
  } catch {
    return mapAiSettings(null);
  }
}

export async function updateAiSettings(
  input: Partial<AiSettings>,
  token: string,
): Promise<AiSettings> {
  const data: Record<string, unknown> = {};
  if (input.provider !== undefined) data.provider = input.provider;
  if (input.model !== undefined) data.model = input.model;
  if (input.baseUrl !== undefined) data.base_url = input.baseUrl;
  if (input.apiKey !== undefined) data.api_key = input.apiKey;

  const base = getStrapiUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/ai-setting`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`Failed to update AI settings: ${res.status}`);
  const json = (await res.json()) as { data: StrapiAiSetting };
  return mapAiSettings(json.data);
}

export async function listMenus(token?: string): Promise<ContentMenu[]> {
  const docs = await strapi.find<StrapiMenu>("menus", { sort: "name:asc" }, token);
  return docs.map(mapMenu);
}

export async function getMenuByLocation(location: ContentMenu["location"]): Promise<ContentMenu | null> {
  const docs = await strapi.find<StrapiMenu>("menus", {
    "filters[location][$eq]": location,
    "pagination[pageSize]": "1",
  });
  return docs[0] ? mapMenu(docs[0]) : null;
}

export async function createMenu(input: CreateMenuInput, token: string): Promise<ContentMenu> {
  const doc = await strapi.create<StrapiMenu>(
    "menus",
    { name: input.name, location: input.location, items: input.items ?? [] },
    token,
  );
  return mapMenu(doc);
}

export async function updateMenu(id: string, input: UpdateMenuInput, token: string): Promise<ContentMenu> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.location !== undefined) data.location = input.location;
  if (input.items !== undefined) data.items = input.items;
  const doc = await strapi.update<StrapiMenu>("menus", id, data, token);
  return mapMenu(doc);
}

export async function deleteMenu(id: string, token: string): Promise<void> {
  await strapi.delete("menus", id, token);
}

export async function listThemes(token?: string): Promise<ContentTheme[]> {
  const docs = await strapi.find<StrapiTheme>(
    "themes",
    { sort: "name:asc", ...strapiPopulate("preview_image") },
    token,
  );
  return docs.map(mapTheme);
}

export async function getActiveTheme(): Promise<ContentTheme | null> {
  const docs = await strapi.find<StrapiTheme>("themes", {
    "filters[is_active][$eq]": "true",
    "pagination[pageSize]": "1",
    ...strapiPopulate("preview_image"),
  });
  return docs[0] ? mapTheme(docs[0]) : null;
}

export async function createTheme(input: CreateThemeInput, token: string): Promise<ContentTheme> {
  const doc = await strapi.create<StrapiTheme>(
    "themes",
    { name: input.name, slug: input.slug, config: input.config ?? {}, is_active: input.isActive ?? false },
    token,
  );
  return mapTheme(doc);
}

export async function updateTheme(id: string, input: UpdateThemeInput, token: string): Promise<ContentTheme> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.config !== undefined) data.config = input.config;
  if (input.isActive !== undefined) data.is_active = input.isActive;
  const doc = await strapi.update<StrapiTheme>("themes", id, data, token);
  return mapTheme(doc);
}

export async function deleteTheme(id: string, token: string): Promise<void> {
  await strapi.delete("themes", id, token);
}

export async function activateTheme(id: string, token: string): Promise<ContentTheme> {
  const themes = await listThemes(token);
  for (const theme of themes) {
    if (theme.isActive && theme.id !== id) {
      await strapi.update("themes", theme.id, { is_active: false }, token);
    }
  }
  const doc = await strapi.update<StrapiTheme>("themes", id, { is_active: true }, token);
  return mapTheme(doc);
}

export async function listBlockPatterns(token?: string): Promise<ContentBlockPattern[]> {
  const docs = await strapi.find<StrapiBlockPattern>(
    "block-patterns",
    { sort: "name:asc", ...strapiPopulate("preview_image") },
    token,
  );
  return docs.map(mapPattern);
}

export async function createBlockPattern(
  input: CreateBlockPatternInput,
  token: string,
): Promise<ContentBlockPattern> {
  const doc = await strapi.create<StrapiBlockPattern>(
    "block-patterns",
    {
      name: input.name,
      description: input.description,
      category: input.category,
      kind: input.kind ?? "section",
      puck_data: input.puckData,
    },
    token,
  );
  return mapPattern(doc);
}

export async function deleteBlockPattern(id: string, token: string): Promise<void> {
  await strapi.delete("block-patterns", id, token);
}

export async function updateBlockPattern(
  id: string,
  input: Partial<CreateBlockPatternInput>,
  token: string,
): Promise<ContentBlockPattern> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.category !== undefined) data.category = input.category;
  if (input.kind !== undefined) data.kind = input.kind;
  if (input.puckData !== undefined) data.puck_data = input.puckData;
  const doc = await strapi.update<StrapiBlockPattern>("block-patterns", id, data, token);
  return mapPattern(doc);
}

export async function listCustomBlocks(token?: string): Promise<ContentCustomBlock[]> {
  const docs = await strapi.find<StrapiCustomBlock>(
    "custom-blocks",
    { sort: "label:asc" },
    token,
  );
  return docs.map(mapCustomBlock);
}

export async function createCustomBlock(
  input: CreateCustomBlockInput,
  token: string,
): Promise<ContentCustomBlock> {
  const doc = await strapi.create<StrapiCustomBlock>(
    "custom-blocks",
    {
      puck_type: input.puckType,
      label: input.label,
      category: input.category ?? "custom",
      fields: input.fields,
      template: input.template,
    },
    token,
  );
  return mapCustomBlock(doc);
}

export async function updateCustomBlock(
  id: string,
  input: Partial<CreateCustomBlockInput>,
  token: string,
): Promise<ContentCustomBlock> {
  const data: Record<string, unknown> = {};
  if (input.puckType !== undefined) data.puck_type = input.puckType;
  if (input.label !== undefined) data.label = input.label;
  if (input.category !== undefined) data.category = input.category;
  if (input.fields !== undefined) data.fields = input.fields;
  if (input.template !== undefined) data.template = input.template;
  const doc = await strapi.update<StrapiCustomBlock>("custom-blocks", id, data, token);
  return mapCustomBlock(doc);
}

export async function deleteCustomBlock(id: string, token: string): Promise<void> {
  await strapi.delete("custom-blocks", id, token);
}
