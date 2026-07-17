import type { ContentProvider } from "@nextpress/cms-core";
import type {
  AdapterConfig,
  AuthSession,
  ContentPage,
  CreatePageInput,
  GutenbergData,
  ListPagesOptions,
  LoginInput,
  UpdatePageInput,
} from "@nextpress/cms-core";
import type { PuckData } from "@nextpress/shared";
import {
  configureStrapiClient,
  strapi,
  strapiLogin,
} from "@nextpress/strapi-client";
import * as extensions from "./extensions";
import * as media from "./media";
import { resolveMediaUrl } from "./media-helpers";

interface StrapiMediaRef {
  url?: string;
}

interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  page_status: ContentPage["status"];
  /** JSON column — GutenbergData or legacy PuckData. */
  puck_data: GutenbergData | PuckData | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: StrapiMediaRef | null;
  scheduled_at?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function isGutenbergDoc(value: unknown): value is GutenbergData {
  return (
    !!value &&
    typeof value === "object" &&
    (value as { editor?: unknown }).editor === "gutenberg" &&
    Array.isArray((value as { blocks?: unknown }).blocks)
  );
}

function isPuckDoc(value: unknown): value is PuckData {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as { content?: unknown }).content) &&
    !isGutenbergDoc(value)
  );
}

function mapPage(doc: StrapiPage): ContentPage {
  const raw = doc.puck_data;
  return {
    id: doc.documentId,
    title: doc.title,
    slug: doc.slug,
    status: doc.page_status,
    gutenbergData: isGutenbergDoc(raw) ? raw : null,
    puckData: isPuckDoc(raw) ? raw : null,
    seoTitle: doc.seo_title ?? null,
    seoDescription: doc.seo_description ?? null,
    ogImageUrl: doc.og_image?.url ? resolveMediaUrl(doc.og_image.url) : null,
    scheduledAt: doc.scheduled_at ?? null,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function sortParam(options: ListPagesOptions = {}): string {
  const field = options.sortBy ?? "updatedAt";
  const order = options.sortOrder === "asc" ? "asc" : "desc";
  return `${field}:${order}`;
}

export class StrapiContentProvider implements ContentProvider {
  readonly id = "strapi";
  readonly displayName = "Strapi";

  constructor(config: AdapterConfig) {
    configureStrapiClient({
      url: config.url ?? "http://localhost:1337",
    });
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const result = await strapiLogin(input.email, input.password);
    return {
      token: result.jwt,
      user: {
        id: String(result.user.id),
        email: result.user.email,
        name: result.user.username,
      },
    };
  }

  async listPages(options: ListPagesOptions = {}, token?: string): Promise<ContentPage[]> {
    const params: Record<string, string> = {
      sort: sortParam(options),
      "pagination[pageSize]": String(options.limit ?? 100),
      populate: "og_image",
    };

    if (options.status) {
      params["filters[page_status][$eq]"] = options.status;
    } else {
      params["filters[page_status][$ne]"] = "trash";
    }

    const docs = await strapi.find<StrapiPage>("pages", params, token);
    return docs.map(mapPage);
  }

  async getPage(id: string, token?: string): Promise<ContentPage | null> {
    try {
      const doc = await strapi.findOne<StrapiPage>("pages", id, { populate: "og_image" }, token);
      return mapPage(doc);
    } catch {
      return null;
    }
  }

  async getPageBySlug(
    slug: string,
    options?: { status?: ContentPage["status"] },
    token?: string,
  ): Promise<ContentPage | null> {
    const params: Record<string, string> = {
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "1",
      populate: "og_image",
    };

    if (options?.status) {
      params["filters[page_status][$eq]"] = options.status;
    }

    const docs = await strapi.find<StrapiPage>("pages", params, token);
    return docs[0] ? mapPage(docs[0]) : null;
  }

  async listPublishedPageSlugs(limit = 100): Promise<string[]> {
    const pages = await this.listPages({ status: "published", limit });
    return pages.map((page) => page.slug);
  }

  async createPage(input: CreatePageInput, token: string): Promise<ContentPage> {
    const doc = await strapi.create<StrapiPage>(
      "pages",
      {
        title: input.title,
        slug: input.slug,
        page_status: input.status ?? "draft",
        puck_data: input.puckData ?? input.gutenbergData ?? null,
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
      },
      token,
    );
    return mapPage(doc);
  }

  async updatePage(id: string, input: UpdatePageInput, token: string): Promise<ContentPage> {
    const data: Record<string, unknown> = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.status !== undefined) data.page_status = input.status;
    // Prefer Puck JSON when both are sent — editor round-trips more reliably.
    if (input.puckData !== undefined) data.puck_data = input.puckData;
    else if (input.gutenbergData !== undefined) data.puck_data = input.gutenbergData;
    if (input.seoTitle !== undefined) data.seo_title = input.seoTitle;
    if (input.seoDescription !== undefined) data.seo_description = input.seoDescription;
    if (input.publishedAt !== undefined) data.publishedAt = input.publishedAt;
    if (input.scheduledAt !== undefined) data.scheduled_at = input.scheduledAt;

    const doc = await strapi.update<StrapiPage>("pages", id, data, token);
    return mapPage(doc);
  }

  async deletePage(id: string, token: string): Promise<void> {
    await strapi.update("pages", id, { page_status: "trash" }, token);
  }

  async restorePage(id: string, token: string): Promise<ContentPage> {
    const doc = await strapi.update<StrapiPage>("pages", id, { page_status: "draft" }, token);
    return mapPage(doc);
  }

  // Posts
  listPosts = extensions.listPosts;
  getPost = extensions.getPost;
  getPostBySlug = extensions.getPostBySlug;
  createPost = extensions.createPost;
  updatePost = extensions.updatePost;
  deletePost = extensions.deletePost;
  listCategories = extensions.listCategories;
  createCategory = extensions.createCategory;
  updateCategory = extensions.updateCategory;
  deleteCategory = extensions.deleteCategory;
  listTags = extensions.listTags;
  createTag = extensions.createTag;
  deleteTag = extensions.deleteTag;
  searchContent = extensions.searchContent;
  listRevisions = extensions.listRevisions;
  createRevision = extensions.createRevision;

  // Media
  listMedia = media.listMedia;
  uploadMedia = media.uploadMedia;
  updateMedia = media.updateMedia;
  deleteMedia = media.deleteMedia;

  // Settings, menus, themes, patterns
  getSiteSettings = extensions.getSiteSettings;
  updateSiteSettings = extensions.updateSiteSettings;
  listMenus = extensions.listMenus;
  getMenuByLocation = extensions.getMenuByLocation;
  createMenu = extensions.createMenu;
  updateMenu = extensions.updateMenu;
  deleteMenu = extensions.deleteMenu;
  listThemes = extensions.listThemes;
  getActiveTheme = extensions.getActiveTheme;
  createTheme = extensions.createTheme;
  updateTheme = extensions.updateTheme;
  deleteTheme = extensions.deleteTheme;
  activateTheme = extensions.activateTheme;
  listBlockPatterns = extensions.listBlockPatterns;
  createBlockPattern = extensions.createBlockPattern;
  updateBlockPattern = extensions.updateBlockPattern;
  deleteBlockPattern = extensions.deleteBlockPattern;
  listCustomBlocks = extensions.listCustomBlocks;
  createCustomBlock = extensions.createCustomBlock;
  updateCustomBlock = extensions.updateCustomBlock;
  deleteCustomBlock = extensions.deleteCustomBlock;

  // AI settings
  getAiSettings = extensions.getAiSettings;
  updateAiSettings = extensions.updateAiSettings;
}
