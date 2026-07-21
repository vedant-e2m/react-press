import type { BuilderDocument } from "@nextpress/builder/types";
import type { CustomBlockField } from "@nextpress/shared";

/**
 * Opaque key-value config passed from env or nextpress.config into an adapter.
 * Core does not define CMS-specific keys (no strapiUrl, etc.).
 */
export type AdapterConfig = Readonly<Record<string, string | undefined>>;

export type PageStatus = "draft" | "published" | "scheduled" | "trash";
export type PostStatus = "draft" | "published" | "trash";

/**
 * CMS-agnostic page model.
 * Adapters map provider-specific IDs (e.g. Strapi documentId) to `id`.
 */
export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  builderData: BuilderDocument | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  scheduledAt?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Blog post. */
export interface ContentPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status: PostStatus;
  featuredImageUrl?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status?: PostStatus;
  featuredImageUrl?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  status?: PostStatus;
  featuredImageUrl?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
}

/** Planned for Phase 2 — taxonomy. */
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
}

export interface ContentRevision {
  id: string;
  title: string;
  resourceType: "page" | "post";
  resourceId: string;
  slug?: string | null;
  builderData?: BuilderDocument | null;
  content?: string | null;
  createdAt: string;
}

/** Image size variant from CMS (thumbnail, small, medium, large). */
export interface MediaFormat {
  url: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
}

/** Media library item. */
export interface ContentMedia {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
  formats?: Record<string, MediaFormat> | null;
  createdAt: string;
}

export interface UpdateMediaInput {
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
}

/** Nested menu item (supports multi-level navigation). */
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  children?: MenuItem[];
}

/** Navigation menu assigned to a location (header, footer, etc.). */
export interface ContentMenu {
  id: string;
  name: string;
  location: "header" | "footer" | "sidebar" | "custom";
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuInput {
  name: string;
  location: ContentMenu["location"];
  items?: MenuItem[];
}

export interface UpdateMenuInput {
  name?: string;
  location?: ContentMenu["location"];
  items?: MenuItem[];
}

/** Theme configuration (colors, fonts, spacing). */
export interface ThemeConfig {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  spacing?: Record<string, string>;
  header?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    sticky?: boolean;
    imageUrl?: string;
  };
  background?: {
    bodyColor?: string;
    imageUrl?: string;
  };
  /**
   * Optional theme-scoped widgets. Structure is adapter-defined but typically:
   * `{ [areaId]: Widget[] }`.
   */
  widgets?: Record<string, unknown>;
  /** Optional custom CSS appended after theme variables. */
  customCss?: string;
}

export interface ContentTheme {
  id: string;
  name: string;
  slug: string;
  config: ThemeConfig;
  isActive: boolean;
  previewImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemeInput {
  name: string;
  slug: string;
  config?: ThemeConfig;
  isActive?: boolean;
}

export interface UpdateThemeInput {
  name?: string;
  slug?: string;
  config?: ThemeConfig;
  isActive?: boolean;
}

/** Reusable native builder layout. */
export interface ContentBlockPattern {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  /** Pattern type used by the editor (insert section vs apply full-page template). */
  kind?: "section" | "page";
  builderData: BuilderDocument;
  previewImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockPatternInput {
  name: string;
  description?: string | null;
  category: string;
  kind?: "section" | "page";
  builderData: BuilderDocument;
}

/** Editor-defined block/section with custom fields and an HTML template. */
export interface ContentCustomBlock {
  id: string;
  builderType: string;
  label: string;
  category: string;
  fields: CustomBlockField[];
  template: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomBlockInput {
  builderType: string;
  label: string;
  category?: string;
  fields: CustomBlockField[];
  template: string;
}

/** Widget in a widget area. */
export interface Widget {
  id: string;
  type: "text" | "html" | "menu" | "recent-posts";
  title?: string | null;
  content?: string | null;
  menuId?: string | null;
}

/** Global site settings (identity, appearance, widgets). */
export interface SiteSettings {
  siteName: string;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  headerBackground?: string | null;
  customCss?: string | null;
  socialLinks?: Record<string, string> | null;
  widgetAreas?: Record<string, Widget[]> | null;
  activeThemeId?: string | null;
  /** Slug of the page shown at `/` (WordPress-style static homepage). */
  homepageSlug?: string | null;
  /** Custom scripts injected in <head> (GTM, analytics, etc.) */
  headerScripts?: string | null;
  /** Custom scripts injected before </body> */
  footerScripts?: string | null;
  /** CDN origin for media and static assets */
  cdnUrl?: string | null;
}

/**
 * AI provider configuration used by the AI page-editor panel and AI chat page.
 * Stored server-side (admin-only); the raw `apiKey` must never be sent to the browser.
 */
export interface AiSettings {
  provider: string;
  model?: string | null;
  baseUrl?: string | null;
  apiKey?: string | null;
}

/** Client-safe view of `AiSettings` — never includes the raw API key. */
export interface MaskedAiSettings {
  provider: string;
  model: string | null;
  baseUrl: string | null;
  hasApiKey: boolean;
}

export interface ListPagesOptions {
  /** When set, only return pages with this status. Omit for all statuses (admin). */
  status?: PageStatus;
  sortBy?: "updatedAt" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  status?: PageStatus;
  builderData?: BuilderDocument | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  scheduledAt?: string | null;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  status?: PageStatus;
  builderData?: BuilderDocument | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  publishedAt?: string | null;
  scheduledAt?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export type CmsError = Error & { status: number; name: "CmsError" };
