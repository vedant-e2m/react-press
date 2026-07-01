import type { PuckData } from "@nextpress/shared";

/**
 * Opaque key-value config passed from env or nextpress.config into an adapter.
 * Core does not define CMS-specific keys (no strapiUrl, payloadUrl, etc.).
 */
export type AdapterConfig = Readonly<Record<string, string | undefined>>;

export type PageStatus = "draft" | "published" | "scheduled";
export type PostStatus = "draft" | "published";

/**
 * CMS-agnostic page model.
 * Adapters map provider-specific IDs (e.g. Strapi documentId) to `id`.
 */
export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  puckData: PuckData | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Planned for Phase 2 — posts CRUD. */
export interface ContentPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Planned for Phase 2 — taxonomy. */
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

/** Planned for Phase 2 — media library. */
export interface ContentMedia {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  createdAt: string;
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
  puckData?: PuckData | null;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  status?: PageStatus;
  puckData?: PuckData | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
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
