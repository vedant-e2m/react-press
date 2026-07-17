import type { PuckData } from "@nextpress/shared";
import { puckToGutenberg } from "./convert/puck-to-gutenberg";
import { normalizeGutenbergData } from "./serialize";
import {
  EMPTY_GUTENBERG_DATA,
  isGutenbergData,
  type GutenbergData,
} from "./types";

/**
 * Resolve CMS page JSON that may be Gutenberg, legacy Puck, or empty.
 */
export function resolvePageDocument(value: unknown): GutenbergData {
  if (isGutenbergData(value)) return normalizeGutenbergData(value);
  if (value && typeof value === "object" && Array.isArray((value as { content?: unknown }).content)) {
    return puckToGutenberg(value as PuckData);
  }
  if (value && typeof value === "object" && typeof (value as { html?: unknown }).html === "string") {
    return normalizeGutenbergData(value);
  }
  return { ...EMPTY_GUTENBERG_DATA };
}
