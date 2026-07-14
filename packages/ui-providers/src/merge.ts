import { mergePuckConfig } from "@nextpress/core";
import { buildMantinePluginFromComponents } from "@nextpress/plugin-mantine/build";
import { buildShadcnPluginFromComponents } from "@nextpress/plugin-shadcn/build";
import type { PluginComponentRecord } from "@nextpress/shared";
import type { Config } from "@puckeditor/core";

export function buildDynamicPluginsFromRecords(
  enabledPluginIds: string[],
  componentsByPlugin: Record<string, PluginComponentRecord[]>,
) {
  const plugins = [];

  for (const pluginId of enabledPluginIds) {
    if (pluginId === "shadcn") {
      const records = componentsByPlugin.shadcn ?? [];
      const plugin = buildShadcnPluginFromComponents(records);
      if (plugin) plugins.push(plugin);
      continue;
    }
    if (pluginId === "mantine") {
      const records = componentsByPlugin.mantine ?? [];
      const plugin = buildMantinePluginFromComponents(records);
      if (plugin) plugins.push(plugin);
    }
  }

  return plugins;
}

export function mergeDynamicPuckConfig<T extends Config>(
  base: T,
  enabledPluginIds: string[],
  componentsByPlugin: Record<string, PluginComponentRecord[]>,
): T {
  const dynamicPlugins = buildDynamicPluginsFromRecords(enabledPluginIds, componentsByPlugin);
  return mergePuckConfig(base, dynamicPlugins);
}
