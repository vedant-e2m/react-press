/**
 * Gutenberg-compatible block tree stored in the CMS.
 * `html` is WordPress block markup; `blocks` is the parsed tree for fast React render.
 */
export interface GutenbergData {
  /** Discriminator so storage can coexist with legacy Puck JSON. */
  editor: "gutenberg";
  version: 1;
  /** Serialized WordPress block HTML (comment format). */
  html: string;
  /** Parsed block tree used by the public renderer. */
  blocks: GutenbergBlock[];
}

export interface GutenbergBlock {
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks: GutenbergBlock[];
  /** Inner HTML for classic / freeform / paragraphs when present. */
  innerHTML?: string;
  /** Optional client id (editor only; not required for persistence). */
  clientId?: string;
}

export const EMPTY_GUTENBERG_DATA: GutenbergData = {
  editor: "gutenberg",
  version: 1,
  html: "",
  blocks: [],
};

/** Type guard for Gutenberg page documents. */
export function isGutenbergData(value: unknown): value is GutenbergData {
  if (!value || typeof value !== "object") return false;
  const doc = value as Record<string, unknown>;
  return (
    doc.editor === "gutenberg" &&
    doc.version === 1 &&
    typeof doc.html === "string" &&
    Array.isArray(doc.blocks)
  );
}
