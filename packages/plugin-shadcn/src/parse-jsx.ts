import { INSTALLED_SHADCN_COMPONENTS } from "./installed-components";
import { normalizeJsxForLive } from "./normalize-jsx";
import { isInstalledShadcnComponent } from "./registry";
import { extractJsxTags } from "./registry-slugs";

export interface ParsedJsxSnippet {
  baseComponent: string;
  defaultProps: Record<string, unknown>;
}

const IGNORED_TAGS = new Set(["Fragment", "React"]);

function getInstalledSet(installed?: string[]): Set<string> {
  return new Set(installed ?? INSTALLED_SHADCN_COMPONENTS);
}

function getRootComponent(sourceCode: string): string | null {
  const tags = extractJsxTags(sourceCode);
  return tags.find((tag) => !IGNORED_TAGS.has(tag)) ?? null;
}

function findUnsupportedTags(sourceCode: string, installed?: string[]): string[] {
  const installedSet = getInstalledSet(installed);
  return extractJsxTags(sourceCode).filter(
    (tag) => !installedSet.has(tag) && !IGNORED_TAGS.has(tag),
  );
}

/** Strip imports / "use client" and return JSX suitable for react-live. */
export function extractJsxFromPaste(sourceCode: string): string {
  return normalizeJsxForLive(sourceCode);
}

/** Parse shadcn JSX snippets pasted from the docs. */
export function parseShadcnJsx(sourceCode: string, installed?: string[]): ParsedJsxSnippet | null {
  const trimmed = normalizeJsxForLive(sourceCode);
  if (!trimmed || !trimmed.includes("<")) return null;

  const unsupported = findUnsupportedTags(trimmed, installed);
  if (unsupported.length > 0) return null;

  const root = getRootComponent(trimmed);
  if (!root || !isInstalledShadcnComponent(root, installed)) return null;

  return {
    baseComponent: root,
    defaultProps: { sourceCode: trimmed },
  };
}

export function getParseFailureMessage(sourceCode: string, installed?: string[]): string {
  if (parseShadcnJsx(sourceCode, installed)) {
    return "";
  }

  const trimmed = extractJsxFromPaste(sourceCode);
  if (!trimmed) {
    return "Paste component JSX from the docs, or click a sample button above.";
  }

  const unsupported = findUnsupportedTags(trimmed, installed);
  if (unsupported.length > 0) {
    const missing = unsupported[0];
    return `\`${missing}\` is not installed yet. Click "Install missing components" below.`;
  }

  const root = getRootComponent(trimmed);
  if (!root) {
    return "Could not find a component in the pasted JSX.";
  }

  return `Could not parse JSX for \`${root}\`. Paste a complete example from the docs.`;
}

export function slugifyPuckType(label: string, baseComponent: string): string {
  const slug = label
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `Shadcn${slug || baseComponent}`;
}

export function ensureUniquePuckType(baseType: string, existingTypes: string[]): string {
  if (!existingTypes.includes(baseType)) return baseType;
  let index = 2;
  while (existingTypes.includes(`${baseType}${index}`)) {
    index += 1;
  }
  return `${baseType}${index}`;
}
