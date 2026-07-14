import type { BlockPlugin } from "@nextpress/core";
import type { PluginComponentRecord } from "@nextpress/shared";
import type { Config } from "@puckeditor/core";
import { ShadcnJsxBlock } from "./blocks/jsx-block";
import { GENERIC_PLUGIN_FIELDS, getSourceCodeForRecord } from "./registry";

export function buildShadcnPluginFromComponents(
  components: PluginComponentRecord[],
): BlockPlugin | null {
  if (components.length === 0) return null;

  const puckComponents: Record<string, Config["components"][string]> = {};
  const componentTypes: string[] = [];

  for (const record of components) {
    const sourceCode = getSourceCodeForRecord(record);

    puckComponents[record.puckType] = {
      label: record.label,
      fields: GENERIC_PLUGIN_FIELDS,
      defaultProps: { sourceCode },
      render: ShadcnJsxBlock,
    };
    componentTypes.push(record.puckType);
  }

  if (componentTypes.length === 0) return null;

  return {
    meta: {
      id: "shadcn",
      name: "shadcn/ui",
      version: "0.1.0",
      description: "UI-managed shadcn/ui blocks",
    },
    components: puckComponents,
    categories: {
      shadcn: {
        title: "shadcn/ui",
        components: componentTypes,
      },
    },
  };
}
