import type { ComponentType, ReactNode } from "react";
import type { PluginComponentRecord } from "@nextpress/shared";
import type { BlockPlugin } from "./plugin";

export type UiProviderKind = "registry" | "npm";

export interface UiProviderCatalogItem {
  providerId: string;
  pluginId: string;
  name: string;
  description: string;
  version: string;
  kind: UiProviderKind;
  docsUrl: string;
}

export interface ParsedJsxSnippet {
  baseComponent: string;
  defaultProps: Record<string, unknown>;
}

/** Server-side UI provider contract — no client React scope imports. */
export interface UiProviderServer {
  catalog: UiProviderCatalogItem;
  puckCategoryId: string;
  getInstalledComponents(): string[];
  getInstalledRegistrySlugs(): string[];
  parseJsx(sourceCode: string, installed?: string[]): ParsedJsxSnippet | null;
  getParseFailureMessage(sourceCode: string, installed?: string[]): string;
  getMissingRegistrySlugs(sourceCode: string, installed?: string[]): string[];
  slugifyPuckType(label: string, baseComponent: string): string;
  ensureUniquePuckType(baseType: string, existingTypes: string[]): string;
  buildBlockPlugin(records: PluginComponentRecord[]): BlockPlugin | null;
  genericFields: PluginComponentRecord["fields"];
  componentSamples: Record<string, { baseComponent: string; sampleCode: string }>;
}

export type UiProviderClientScope = Record<string, unknown>;

/** Client-only provider contract for react-live scope and app wrappers. */
export interface UiProviderClient {
  providerId: string;
  getComponentScope(): UiProviderClientScope;
  ProviderWrapper?: ComponentType<{ children: ReactNode }>;
}
