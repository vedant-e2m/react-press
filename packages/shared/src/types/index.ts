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

export interface CustomBlockField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "image" | "url";
  defaultValue?: string | number;
  required?: boolean;
}
