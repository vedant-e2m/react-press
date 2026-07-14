import type { UiProviderServer } from "@nextpress/core";
import { buildMantinePluginFromComponents } from "./build-dynamic-plugin";
import {
  ensureUniquePuckType,
  getParseFailureMessage,
  parseMantineJsx,
  slugifyPuckType,
} from "./parse-jsx";
import {
  GENERIC_PLUGIN_FIELDS,
  getInstalledMantineComponents,
  MANTINE_COMPONENT_SAMPLES,
} from "./registry";

export const mantineUiProvider: UiProviderServer = {
  catalog: {
    providerId: "mantine",
    pluginId: "mantine",
    name: "Mantine",
    description:
      "Paste JSX from Mantine docs. The @mantine/core package is installed when you enable this plugin.",
    version: "0.1.0",
    kind: "npm",
    docsUrl: "https://mantine.dev/core/button",
  },
  puckCategoryId: "mantine",
  genericFields: GENERIC_PLUGIN_FIELDS,
  componentSamples: MANTINE_COMPONENT_SAMPLES,

  getInstalledComponents() {
    return getInstalledMantineComponents();
  },

  getInstalledRegistrySlugs() {
    return [];
  },

  parseJsx(sourceCode) {
    return parseMantineJsx(sourceCode);
  },

  getParseFailureMessage(sourceCode) {
    return getParseFailureMessage(sourceCode);
  },

  getMissingRegistrySlugs() {
    return [];
  },

  slugifyPuckType,
  ensureUniquePuckType,

  buildBlockPlugin(records) {
    return buildMantinePluginFromComponents(records);
  },
};
