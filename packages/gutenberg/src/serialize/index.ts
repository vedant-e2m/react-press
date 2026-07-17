import type { GutenbergBlock, GutenbergData } from "../types";
import { EMPTY_GUTENBERG_DATA } from "../types";

const BLOCK_COMMENT_OPEN =
  /<!--\s+wp:([\w/-]+)(\s+(\{[\s\S]*?\}))?\s+(\/?)\s*-->/g;

/**
 * Escape attribute JSON for WordPress block comment delimiters.
 */
function stringifyAttrs(attrs: Record<string, unknown>): string {
  const keys = Object.keys(attrs);
  if (keys.length === 0) return "";
  return ` ${JSON.stringify(attrs)}`;
}

/**
 * WordPress omits the `core/` namespace in block comment delimiters
 * (`<!-- wp:paragraph -->` not `<!-- wp:core/paragraph -->`).
 */
export function toCommentName(blockName: string): string {
  return blockName.startsWith("core/") ? blockName.slice("core/".length) : blockName;
}

/**
 * Expand a delimiter name back to a full block name.
 */
export function fromCommentName(commentName: string): string {
  return commentName.includes("/") ? commentName : `core/${commentName}`;
}

/**
 * Serialize a single block (and its children) to WordPress block markup.
 */
export function serializeBlock(block: GutenbergBlock): string {
  const commentName = toCommentName(block.name);
  const attrs = stringifyAttrs(block.attributes ?? {});
  const hasInner =
    (block.innerBlocks?.length ?? 0) > 0 ||
    (block.innerHTML !== undefined && block.innerHTML !== "");

  if (!hasInner) {
    return `<!-- wp:${commentName}${attrs} /-->`;
  }

  const innerFromChildren = (block.innerBlocks ?? [])
    .map((child) => serializeBlock(child))
    .join("\n\n");
  const inner = block.innerHTML ?? innerFromChildren;

  return `<!-- wp:${commentName}${attrs} -->\n${inner}\n<!-- /wp:${commentName} -->`;
}

/**
 * Serialize a block list to WordPress block HTML.
 */
export function serializeBlocks(blocks: GutenbergBlock[]): string {
  return blocks.map(serializeBlock).join("\n\n");
}

/**
 * Build a full GutenbergData document from blocks.
 */
export function toGutenbergData(blocks: GutenbergBlock[]): GutenbergData {
  return {
    editor: "gutenberg",
    version: 1,
    blocks,
    html: serializeBlocks(blocks),
  };
}

interface OpenToken {
  name: string;
  attributes: Record<string, unknown>;
  selfClosing: boolean;
  index: number;
  end: number;
}

function parseOpenComment(html: string, from: number): OpenToken | null {
  BLOCK_COMMENT_OPEN.lastIndex = from;
  const match = BLOCK_COMMENT_OPEN.exec(html);
  if (!match || match.index !== from) {
    // Search forward for next open
    BLOCK_COMMENT_OPEN.lastIndex = from;
    const next = BLOCK_COMMENT_OPEN.exec(html);
    if (!next) return null;
    return parseAttrs(next);
  }
  return parseAttrs(match);
}

function parseAttrs(match: RegExpExecArray): OpenToken {
  let attributes: Record<string, unknown> = {};
  if (match[3]) {
    try {
      attributes = JSON.parse(match[3]) as Record<string, unknown>;
    } catch {
      attributes = {};
    }
  }
  return {
    name: fromCommentName(match[1]),
    attributes,
    selfClosing: match[4] === "/",
    index: match.index,
    end: match.index + match[0].length,
  };
}

function findCloseComment(html: string, blockName: string, from: number): number {
  const close = `<!-- /wp:${toCommentName(blockName)} -->`;
  return html.indexOf(close, from);
}

/**
 * Parse WordPress block markup into a Gutenberg block tree.
 * Handles nested blocks and freeform HTML between blocks.
 */
export function parseBlocks(html: string): GutenbergBlock[] {
  if (!html.trim()) return [];

  const blocks: GutenbergBlock[] = [];
  let cursor = 0;
  const source = html;

  while (cursor < source.length) {
    const openIdx = source.indexOf("<!-- wp:", cursor);
    if (openIdx === -1) {
      const trailing = source.slice(cursor).trim();
      if (trailing) {
        blocks.push({
          name: "core/freeform",
          attributes: {},
          innerBlocks: [],
          innerHTML: trailing,
        });
      }
      break;
    }

    if (openIdx > cursor) {
      const freeform = source.slice(cursor, openIdx).trim();
      if (freeform) {
        blocks.push({
          name: "core/freeform",
          attributes: {},
          innerBlocks: [],
          innerHTML: freeform,
        });
      }
    }

    const token = parseOpenComment(source, openIdx);
    if (!token) break;

    if (token.selfClosing) {
      blocks.push({
        name: token.name,
        attributes: token.attributes,
        innerBlocks: [],
      });
      cursor = token.end;
      continue;
    }

    const closeIdx = findCloseComment(source, token.name, token.end);
    if (closeIdx === -1) {
      // Treat remainder as freeform if close missing
      blocks.push({
        name: "core/freeform",
        attributes: {},
        innerBlocks: [],
        innerHTML: source.slice(openIdx).trim(),
      });
      break;
    }

    const innerRaw = source.slice(token.end, closeIdx);
    const closeTag = `<!-- /wp:${toCommentName(token.name)} -->`;
    const childBlocks = parseBlocks(innerRaw);
    const hasWpChildren = childBlocks.some((b) => b.name !== "core/freeform");

    blocks.push({
      name: token.name,
      attributes: token.attributes,
      innerBlocks: hasWpChildren
        ? childBlocks.filter((b) => b.name !== "core/freeform" || (b.innerHTML?.trim() ?? ""))
        : [],
      innerHTML: hasWpChildren ? undefined : innerRaw.trim(),
    });

    cursor = closeIdx + closeTag.length;
  }

  return blocks;
}

/**
 * Parse HTML into a full GutenbergData document.
 */
export function parseGutenbergHtml(html: string): GutenbergData {
  const blocks = parseBlocks(html);
  return {
    editor: "gutenberg",
    version: 1,
    html: html.trim() ? serializeBlocks(blocks) : "",
    blocks,
  };
}

/**
 * Normalize unknown CMS JSON into GutenbergData when possible.
 */
export function normalizeGutenbergData(value: unknown): GutenbergData {
  if (!value || typeof value !== "object") return { ...EMPTY_GUTENBERG_DATA };

  const doc = value as Record<string, unknown>;
  if (doc.editor === "gutenberg" && Array.isArray(doc.blocks)) {
    const blocks = doc.blocks as GutenbergBlock[];
    const html =
      typeof doc.html === "string" && doc.html.length > 0
        ? doc.html
        : serializeBlocks(blocks);
    return { editor: "gutenberg", version: 1, html, blocks };
  }

  if (typeof doc.html === "string") {
    return parseGutenbergHtml(doc.html);
  }

  return { ...EMPTY_GUTENBERG_DATA };
}

/**
 * Approximate word count for editor chrome.
 */
export function countGutenbergWords(data: GutenbergData): number {
  const text = extractPlainText(data.blocks);
  const parts = text.trim().split(/\s+/).filter(Boolean);
  return parts.length;
}

function extractPlainText(blocks: GutenbergBlock[]): string {
  return blocks
    .map((block) => {
      const attrText = Object.values(block.attributes)
        .filter((v): v is string => typeof v === "string")
        .join(" ");
      const htmlText = (block.innerHTML ?? "").replace(/<[^>]+>/g, " ");
      const childText = extractPlainText(block.innerBlocks ?? []);
      return `${attrText} ${htmlText} ${childText}`;
    })
    .join(" ");
}
