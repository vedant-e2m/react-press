export type PageStatus = "draft" | "published" | "scheduled";
export type PostStatus = "draft" | "published";

export interface StrapiEntity<T> {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  attributes?: T;
}

export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  page_status: PageStatus;
  puck_data: PuckData | null;
  seo_title?: string | null;
  seo_description?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PuckData {
  content: PuckBlock[];
  root: { props: Record<string, unknown> };
  zones?: Record<string, PuckBlock[]>;
}

export interface PuckBlock {
  type: string;
  props: Record<string, unknown>;
  children?: PuckBlock[];
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  post_status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export * from "./plugins";
