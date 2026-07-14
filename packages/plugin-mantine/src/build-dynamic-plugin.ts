import type { BlockPlugin } from "@nextpress/core";
import type { PluginComponentRecord } from "@nextpress/shared";
import type { Config } from "@puckeditor/core";
import { MantineJsxBlock } from "./blocks/jsx-block";
import { GENERIC_PLUGIN_FIELDS, getSourceCodeForRecord } from "./registry";

export function buildMantinePluginFromComponents(
  components: PluginComponentRecord[],
): BlockPlugin | null {
  if (components.length === 0) return null;

  const puckComponents: Record<string, Config["components"][string]> = {};
  const componentTypes: string[] = [];

  for (const record of components) {
    puckComponents[record.puckType] = {
      label: record.label,
      fields: GENERIC_PLUGIN_FIELDS,
      defaultProps: { sourceCode: getSourceCodeForRecord(record) },
      render: MantineJsxBlock,
    };
    componentTypes.push(record.puckType);
  }

  return {
    meta: {
      id: "mantine",
      name: "Mantine",
      version: "0.1.0",
      description: "Mantine UI blocks via pasted JSX",
    },
    components: puckComponents,
    categories: {
      mantine: {
        title: "Mantine",
        components: componentTypes,
      },
    },
  };
}
