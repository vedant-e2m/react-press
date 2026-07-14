import type { UiProviderServer } from "@nextpress/core";
import { buildShadcnPluginFromComponents } from "./build-dynamic-plugin";
import {
  ensureUniquePuckType,
  extractJsxFromPaste,
  getParseFailureMessage,
  parseShadcnJsx,
  slugifyPuckType,
} from "./parse-jsx";
import {
  extractJsxTags,
  getRegistrySlugsForMissingTags,
  tagToRegistrySlug,
} from "./registry-slugs";
import {
  GENERIC_PLUGIN_FIELDS,
  getInstalledShadcnComponents,
  isInstalledShadcnComponent,
  SHADCN_COMPONENT_SAMPLES,
} from "./registry";

const IGNORED_TAGS = new Set(["Fragment", "React"]);

function getInstalledSet(installed?: string[]): Set<string> {
  return new Set(installed ?? getInstalledShadcnComponents());
}

function findUnsupportedTags(sourceCode: string, installed?: string[]): string[] {
  const installedSet = getInstalledSet(installed);
  return extractJsxTags(sourceCode).filter(
    (tag) => !installedSet.has(tag) && !IGNORED_TAGS.has(tag),
  );
}

function getInstalledRegistrySlugsFromComponents(): string[] {
  const slugs = new Set<string>();
  for (const name of getInstalledShadcnComponents()) {
    if (/^[A-Z]/.test(name)) {
      slugs.add(tagToRegistrySlug(name));
    }
  }
  return [...slugs].sort();
}

export const shadcnUiProvider: UiProviderServer = {
  catalog: {
    providerId: "shadcn",
    pluginId: "shadcn",
    name: "shadcn/ui",
    description:
      "Paste JSX from shadcn docs. Components install on demand from the shadcn registry.",
    version: "0.1.0",
    kind: "registry",
    docsUrl: "https://ui.shadcn.com/docs/components",
  },
  puckCategoryId: "shadcn",
  genericFields: GENERIC_PLUGIN_FIELDS,
  componentSamples: SHADCN_COMPONENT_SAMPLES,

  getInstalledComponents() {
    return getInstalledShadcnComponents();
  },

  getInstalledRegistrySlugs() {
    return getInstalledRegistrySlugsFromComponents();
  },

  parseJsx(sourceCode, installed) {
    return parseShadcnJsx(sourceCode, installed);
  },

  getParseFailureMessage(sourceCode, installed) {
    return getParseFailureMessage(sourceCode, installed);
  },

  getMissingRegistrySlugs(sourceCode, installed) {
    const trimmed = extractJsxFromPaste(sourceCode);
    const unsupported = findUnsupportedTags(trimmed, installed);
    return getRegistrySlugsForMissingTags(unsupported, this.getInstalledRegistrySlugs());
  },

  slugifyPuckType,
  ensureUniquePuckType,

  buildBlockPlugin(records) {
    return buildShadcnPluginFromComponents(records);
  },
};

export function isTagInstalled(tag: string, installed?: string[]): boolean {
  return getInstalledSet(installed).has(tag) || isInstalledShadcnComponent(tag, installed);
}

export { tagToRegistrySlug };
