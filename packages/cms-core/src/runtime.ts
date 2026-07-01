import type { CmsAdapter } from "./adapter";
import type { ContentProvider } from "./provider";
import type { AdapterConfig } from "./types";

let activeProvider: ContentProvider | null = null;

function mergeConfig(overrides: AdapterConfig = {}): AdapterConfig {
  const fromEnv = readAdapterConfigFromEnv();
  return { ...fromEnv, ...overrides };
}

/**
 * Reads generic adapter options from environment.
 *
 * - `CMS_URL` — primary backend URL (adapter interprets it)
 * - `CMS_OPTION_<KEY>` — passed as `key` (lowercase) to the adapter, e.g.
 *   `CMS_OPTION_API_TOKEN` → `{ apiToken: "..." }`
 */
export function readAdapterConfigFromEnv(): AdapterConfig {
  const config: Record<string, string> = {};

  if (process.env.CMS_URL) {
    config.url = process.env.CMS_URL;
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value || !key.startsWith("CMS_OPTION_")) continue;
    const optionKey = key.slice("CMS_OPTION_".length).toLowerCase();
    config[optionKey] = value;
  }

  return config;
}

/**
 * Initialize the active CMS from an adapter instance.
 * Use in `nextpress.config.ts` when the app selects its adapter at build time.
 */
export function initCms(adapter: CmsAdapter, config?: AdapterConfig): ContentProvider {
  activeProvider = adapter.createProvider(mergeConfig(config));
  return activeProvider;
}

/**
 * Load adapter package dynamically from `CMS_ADAPTER` env var.
 * Use when the adapter is chosen at deploy time without a static import in app code.
 *
 * ```bash
 * CMS_ADAPTER=@nextpress/cms-strapi
 * CMS_URL=http://localhost:1337
 * ```
 */
export async function initCmsFromEnv(config?: AdapterConfig): Promise<ContentProvider> {
  const adapterPackage = process.env.CMS_ADAPTER;
  if (!adapterPackage) {
    throw new Error(
      "CMS_ADAPTER is not set. Point it at an npm package that exports a CmsAdapter " +
        '(e.g. CMS_ADAPTER=@nextpress/cms-strapi).',
    );
  }

  const mod = (await import(adapterPackage)) as {
    default?: CmsAdapter;
    cmsAdapter?: CmsAdapter;
  };

  const adapter = mod.default ?? mod.cmsAdapter;
  if (!adapter?.createProvider) {
    throw new Error(
      `Package "${adapterPackage}" does not export a valid CmsAdapter. ` +
        "Export `cmsAdapter` or use `export default`.",
    );
  }

  return initCms(adapter, config);
}

/** Returns the initialized ContentProvider. Throws if `initCms` was not called. */
export function getCms(): ContentProvider {
  if (!activeProvider) {
    throw new Error(
      "CMS is not initialized. Call initCms(adapter) or initCmsFromEnv() during app bootstrap.",
    );
  }
  return activeProvider;
}

/** Reset runtime — useful in tests. */
export function resetCms(): void {
  activeProvider = null;
}
