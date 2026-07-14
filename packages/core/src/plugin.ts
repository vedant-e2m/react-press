import type { Config } from "@puckeditor/core";

export interface BlockPluginMeta {
  id: string;
  name: string;
  version: string;
  description?: string;
}

/** WordPress-style block plugin: registers Puck components + categories. */
export interface BlockPlugin {
  readonly meta: BlockPluginMeta;
  readonly components: Record<string, Config["components"][string]>;
  readonly categories?: Config["categories"];
}

export interface NextPressConfig {
  plugins?: BlockPlugin[];
}

export function defineNextPress(config: NextPressConfig): NextPressConfig {
  return config;
}

/** Merge plugin components and categories into a base Puck config. */
export function mergePuckConfig<T extends Config>(base: T, plugins: BlockPlugin[] = []): T {
  const components = { ...base.components };
  const categories = { ...(base.categories ?? {}) };

  for (const plugin of plugins) {
    Object.assign(components, plugin.components);
    if (plugin.categories) {
      Object.assign(categories, plugin.categories);
    }
  }

  return {
    ...base,
    components,
    categories,
  };
}
