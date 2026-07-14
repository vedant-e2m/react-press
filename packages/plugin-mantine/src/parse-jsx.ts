import { normalizeJsxForLive } from "./normalize-jsx";
import { INSTALLED_MANTINE_COMPONENTS } from "./installed-components";
import { isInstalledMantineComponent } from "./registry";

export interface ParsedJsxSnippet {
  baseComponent: string;
  defaultProps: Record<string, unknown>;
}

const IGNORED_TAGS = new Set(["Fragment", "React"]);

export function extractJsxTags(sourceCode: string): string[] {
  const matches = sourceCode.match(/<([A-Z][A-Za-z0-9]*)/g) ?? [];
  return [...new Set(matches.map((match) => match.slice(1)))];
}

function getRootComponent(sourceCode: string): string | null {
  const tags = extractJsxTags(sourceCode);
  return tags.find((tag) => !IGNORED_TAGS.has(tag)) ?? null;
}

function findUnsupportedTags(sourceCode: string): string[] {
  const installedSet = new Set(INSTALLED_MANTINE_COMPONENTS);
  return extractJsxTags(sourceCode).filter(
    (tag) => !installedSet.has(tag) && !IGNORED_TAGS.has(tag),
  );
}

export function extractJsxFromPaste(sourceCode: string): string {
  return normalizeJsxForLive(sourceCode);
}

export function parseMantineJsx(sourceCode: string): ParsedJsxSnippet | null {
  const trimmed = extractJsxFromPaste(sourceCode);
  if (!trimmed || !trimmed.includes("<")) return null;

  const unsupported = findUnsupportedTags(trimmed);
  if (unsupported.length > 0) return null;

  const root = getRootComponent(trimmed);
  if (!root || !isInstalledMantineComponent(root)) return null;

  return {
    baseComponent: root,
    defaultProps: { sourceCode: trimmed },
  };
}

export function getParseFailureMessage(sourceCode: string): string {
  if (parseMantineJsx(sourceCode)) return "";

  const trimmed = extractJsxFromPaste(sourceCode);
  if (!trimmed) return "Paste Mantine JSX from the docs, or click a sample button above.";

  const unsupported = findUnsupportedTags(trimmed);
  if (unsupported.length > 0) {
    return `\`${unsupported[0]}\` is not available in @mantine/core. Install the Mantine plugin and use components from https://mantine.dev`;
  }

  return "Could not parse Mantine JSX. Paste a complete example from the Mantine docs.";
}

export function slugifyPuckType(label: string, baseComponent: string): string {
  const slug = label
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `Mantine${slug || baseComponent}`;
}

export function ensureUniquePuckType(baseType: string, existingTypes: string[]): string {
  if (!existingTypes.includes(baseType)) return baseType;
  let index = 2;
  while (existingTypes.includes(`${baseType}${index}`)) {
    index += 1;
  }
  return `${baseType}${index}`;
}

export function getMissingRegistrySlugs(): string[] {
  return [];
}
