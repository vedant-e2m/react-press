import type { BlockPlugin } from "@nextpress/core";
import { mergePuckConfig } from "@nextpress/core";
import type { PluginComponentRecord } from "@nextpress/shared";
import type { Config } from "@puckeditor/core";
import { buildShadcnPluginFromComponents } from "./build-dynamic-plugin";
import { ShadcnAlertBlock } from "./blocks/alert-block";
import { ShadcnBadgeBlock } from "./blocks/badge-block";
import { ShadcnButtonBlock } from "./blocks/button-block";
import { ShadcnJsxBlock } from "./blocks/jsx-block";

export type { ShadcnAlertBlockProps } from "./blocks/alert-block";
export type { ShadcnBadgeBlockProps } from "./blocks/badge-block";
export type { ShadcnButtonBlockProps } from "./blocks/button-block";
export type { ShadcnJsxBlockProps } from "./blocks/jsx-block";
export { Alert, AlertTitle, AlertDescription } from "./ui/alert";
export { Badge, badgeVariants } from "./ui/badge";
export { Button, buttonVariants } from "./ui/button";
export { TooltipProvider } from "./ui/tooltip";
export { Toaster } from "./ui/sonner";
export {
  SHADCN_CATALOG,
  SHADCN_COMPONENT_SAMPLES,
  SHADCN_COMPONENT_TEMPLATES,
  GENERIC_PLUGIN_FIELDS,
  getInstalledShadcnComponents,
  getSourceCodeForRecord,
  isInstalledShadcnComponent,
  isShadcnBaseComponent,
  SUPPORTED_SHADCN_COMPONENTS,
} from "./registry";
export {
  parseShadcnJsx,
  slugifyPuckType,
  extractJsxFromPaste,
  ensureUniquePuckType,
  getParseFailureMessage,
} from "./parse-jsx";
export { buildShadcnPluginFromComponents } from "./build-dynamic-plugin";

/** @deprecated Use CMS-managed plugins via Admin → Plugins */
export const shadcnPlugin: BlockPlugin = {
  meta: {
    id: "shadcn",
    name: "shadcn/ui",
    version: "0.1.0",
    description: "shadcn/ui components as Puck blocks",
  },
  components: {
    ShadcnAlert: {
      label: "Alert",
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        variant: {
          type: "radio",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Destructive", value: "destructive" },
          ],
        },
      },
      defaultProps: {
        title: "Heads up!",
        description: "This alert is rendered via the @nextpress/plugin-shadcn block plugin.",
        variant: "default",
      },
      render: ShadcnAlertBlock,
    },
    ShadcnBadge: {
      label: "Badge",
      fields: {
        label: { type: "text", label: "Primary badge label", contentEditable: true },
        variant: {
          type: "radio",
          label: "Primary variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Secondary", value: "secondary" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
          ],
        },
      },
      defaultProps: {
        label: "shadcn/ui Plugin",
        variant: "default",
      },
      render: ShadcnBadgeBlock,
    },
  },
  categories: {
    shadcn: {
      title: "shadcn/ui",
      components: ["ShadcnAlert", "ShadcnBadge"],
    },
  },
};

export function buildDynamicPluginsFromRecords(
  enabledPluginIds: string[],
  componentsByPlugin: Record<string, PluginComponentRecord[]>,
): BlockPlugin[] {
  const plugins: BlockPlugin[] = [];

  if (enabledPluginIds.includes("shadcn")) {
    const shadcnPlugin = buildShadcnPluginFromComponents(componentsByPlugin.shadcn ?? []);
    if (shadcnPlugin) plugins.push(shadcnPlugin);
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

export { ShadcnJsxBlock };
