import type {
  AiSettings,
  AuthSession,
  ContentBlockPattern,
  ContentCategory,
  ContentCustomBlock,
  ContentRevision,
  ContentMedia,
  ContentMenu,
  ContentPage,
  ContentPost,
  ContentTheme,
  CreateBlockPatternInput,
  CreateCustomBlockInput,
  CreateMenuInput,
  CreatePageInput,
  CreatePostInput,
  CreateThemeInput,
  ListPagesOptions,
  LoginInput,
  SiteSettings,
  UpdateMediaInput,
  UpdateMenuInput,
  UpdatePageInput,
  UpdatePostInput,
  UpdateThemeInput,
} from "./types";

/**
 * Core CMS contract for NextPress.
 *
 * Apps import a single `ContentProvider` instance (via factory) and never
 * call Strapi APIs directly. Each adapter implements this interface
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
  getPost?(id: string, token?: string): Promise<ContentPost | null>;
  getPostBySlug?(slug: string, options?: { status?: ContentPost["status"] }): Promise<ContentPost | null>;
  createPost?(input: CreatePostInput, token: string): Promise<ContentPost>;
  updatePost?(id: string, input: UpdatePostInput, token: string): Promise<ContentPost>;
  deletePost?(id: string, token: string): Promise<void>;

  // ---------------------------------------------------------------------------
  // Taxonomy (Phase 2)
  // ---------------------------------------------------------------------------

  listCategories?(): Promise<ContentCategory[]>;
  createCategory?(input: { name: string; slug: string; description?: string | null }, token: string): Promise<ContentCategory>;
  updateCategory?(id: string, input: { name?: string; slug?: string; description?: string | null }, token: string): Promise<ContentCategory>;
  deleteCategory?(id: string, token: string): Promise<void>;
  listTags?(): Promise<import("./types").ContentTag[]>;
  createTag?(input: { name: string; slug: string }, token: string): Promise<import("./types").ContentTag>;
  deleteTag?(id: string, token: string): Promise<void>;
  searchContent?(query: string, token?: string): Promise<{ pages: ContentPage[]; posts: ContentPost[] }>;
  listRevisions?(resourceType: "page" | "post", resourceId: string, token: string): Promise<import("./types").ContentRevision[]>;
  createRevision?(input: {
    title: string;
    resourceType: "page" | "post";
    resourceId: string;
    slug?: string;
    puckData?: import("@nextpress/shared").PuckData | null;
    content?: string | null;
    snapshot?: Record<string, unknown>;
  }, token: string): Promise<import("./types").ContentRevision>;
  restorePage?(id: string, token: string): Promise<ContentPage>;

  // ---------------------------------------------------------------------------
  // Media (Phase 2)
  // ---------------------------------------------------------------------------

  listMedia?(options?: { search?: string; limit?: number }, token?: string): Promise<ContentMedia[]>;
  uploadMedia?(file: Blob, filename: string, token: string): Promise<ContentMedia>;
  updateMedia?(id: string, input: UpdateMediaInput, token: string): Promise<ContentMedia>;
  deleteMedia?(id: string, token: string): Promise<void>;

  // ---------------------------------------------------------------------------
  // Site settings, menus, themes, patterns (Phase 3)
  // ---------------------------------------------------------------------------

  getSiteSettings?(): Promise<SiteSettings>;
  updateSiteSettings?(input: Partial<SiteSettings>, token: string): Promise<SiteSettings>;

  listMenus?(token?: string): Promise<ContentMenu[]>;
  getMenuByLocation?(location: ContentMenu["location"]): Promise<ContentMenu | null>;
  createMenu?(input: CreateMenuInput, token: string): Promise<ContentMenu>;
  updateMenu?(id: string, input: UpdateMenuInput, token: string): Promise<ContentMenu>;
  deleteMenu?(id: string, token: string): Promise<void>;

  listThemes?(token?: string): Promise<ContentTheme[]>;
  getActiveTheme?(): Promise<ContentTheme | null>;
  createTheme?(input: CreateThemeInput, token: string): Promise<ContentTheme>;
  updateTheme?(id: string, input: UpdateThemeInput, token: string): Promise<ContentTheme>;
  deleteTheme?(id: string, token: string): Promise<void>;
  activateTheme?(id: string, token: string): Promise<ContentTheme>;

  listBlockPatterns?(token?: string): Promise<ContentBlockPattern[]>;
  createBlockPattern?(input: CreateBlockPatternInput, token: string): Promise<ContentBlockPattern>;
  updateBlockPattern?(id: string, input: Partial<CreateBlockPatternInput>, token: string): Promise<ContentBlockPattern>;
  deleteBlockPattern?(id: string, token: string): Promise<void>;

  listCustomBlocks?(token?: string): Promise<ContentCustomBlock[]>;
  createCustomBlock?(input: CreateCustomBlockInput, token: string): Promise<ContentCustomBlock>;
  updateCustomBlock?(id: string, input: Partial<CreateCustomBlockInput>, token: string): Promise<ContentCustomBlock>;
  deleteCustomBlock?(id: string, token: string): Promise<void>;

  // ---------------------------------------------------------------------------
  // AI settings (Phase 4) — admin-only, never exposed unauthenticated.
  // ---------------------------------------------------------------------------

  /** Fetch AI provider config (includes the raw API key). Requires an authenticated token. */
  getAiSettings?(token: string): Promise<AiSettings>;
  updateAiSettings?(input: Partial<AiSettings>, token: string): Promise<AiSettings>;
}
