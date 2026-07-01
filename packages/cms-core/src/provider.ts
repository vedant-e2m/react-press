import type {
  AuthSession,
  ContentCategory,
  ContentMedia,
  ContentPage,
  ContentPost,
  CreatePageInput,
  ListPagesOptions,
  LoginInput,
  UpdatePageInput,
} from "./types";

/**
 * Core CMS contract for NextPress.
 *
 * Apps import a single `ContentProvider` instance (via factory) and never
 * call Strapi/Payload APIs directly. Each adapter implements this interface
 * and maps provider-specific quirks internally.
 *
 * @example
 * ```ts
 * const cms = getCms();
 *
 * // Public site
 * const page = await cms.getPageBySlug("about", { status: "published" });
 *
 * // Admin
 * const token = (await cms.login({ email, password })).token;
 * await cms.updatePage(page.id, { puckData, status: "published" }, token);
 * ```
 */
export interface ContentProvider {
  /** Adapter-defined id, e.g. "strapi". Not enumerated in core. */
  readonly id: string;

  /** Human-readable provider name for admin UI / logs. */
  readonly displayName: string;

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  login(input: LoginInput): Promise<AuthSession>;

  // ---------------------------------------------------------------------------
  // Pages (Phase 1 — current)
  // ---------------------------------------------------------------------------

  /**
   * List pages for admin or filtered public queries.
   * Pass `token` for authenticated admin requests.
   */
  listPages(options?: ListPagesOptions, token?: string): Promise<ContentPage[]>;

  /** Fetch a single page by opaque CMS id (e.g. Strapi documentId). */
  getPage(id: string, token?: string): Promise<ContentPage | null>;

  /**
   * Fetch a page by URL slug.
   * Use `options.status` on the public site to return only published pages.
   */
  getPageBySlug(
    slug: string,
    options?: { status?: ContentPage["status"] },
    token?: string,
  ): Promise<ContentPage | null>;

  /** Slugs for static generation (ISR / SSG). */
  listPublishedPageSlugs(limit?: number): Promise<string[]>;

  createPage(input: CreatePageInput, token: string): Promise<ContentPage>;

  updatePage(id: string, input: UpdatePageInput, token: string): Promise<ContentPage>;

  deletePage(id: string, token: string): Promise<void>;

  // ---------------------------------------------------------------------------
  // Posts (Phase 2 — optional until adapter implements)
  // ---------------------------------------------------------------------------

  listPosts?(token?: string): Promise<ContentPost[]>;
  getPostBySlug?(slug: string): Promise<ContentPost | null>;
  createPost?(input: Omit<ContentPost, "id" | "createdAt" | "updatedAt">, token: string): Promise<ContentPost>;
  updatePost?(id: string, input: Partial<ContentPost>, token: string): Promise<ContentPost>;
  deletePost?(id: string, token: string): Promise<void>;

  // ---------------------------------------------------------------------------
  // Taxonomy (Phase 2)
  // ---------------------------------------------------------------------------

  listCategories?(): Promise<ContentCategory[]>;

  // ---------------------------------------------------------------------------
  // Media (Phase 2)
  // ---------------------------------------------------------------------------

  listMedia?(token?: string): Promise<ContentMedia[]>;
  uploadMedia?(file: Blob, filename: string, token: string): Promise<ContentMedia>;
  deleteMedia?(id: string, token: string): Promise<void>;
}
