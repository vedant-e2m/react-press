import type { ContentProvider } from "./provider";
import type { AdapterConfig } from "./types";

export interface CmsAdapterMeta {
  /** Stable adapter id, e.g. "strapi". Defined by the adapter package — not by core. */
  id: string;
  displayName: string;
  version?: string;
}

/**
 * Plugin contract for a CMS backend.
 *
 * Each CMS ships as its own npm package. Core never imports or names specific CMSes.
 *
 * @example
 * ```ts
 * // packages/cms-strapi/src/index.ts
 * export const cmsAdapter: CmsAdapter = {
 *   meta: { id: "strapi", displayName: "Strapi" },
 *   createProvider(config) {
 *     return new StrapiContentProvider({ url: config.url! });
 *   },
 * };
 * export default cmsAdapter;
 * ```
 */
export interface CmsAdapter {
  readonly meta: CmsAdapterMeta;
  createProvider(config: AdapterConfig): ContentProvider;
}
