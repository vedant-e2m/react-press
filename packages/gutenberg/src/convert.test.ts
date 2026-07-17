import { describe, expect, it } from "vitest";
import { seedBlocksToGutenberg } from "./convert/puck-to-gutenberg";
import { buildStarterHomeBlocks } from "@nextpress/shared";
import { resolvePageDocument } from "./resolve";

describe("starter home → Gutenberg", () => {
  it("should convert starter homepage seed blocks", () => {
    const data = seedBlocksToGutenberg(buildStarterHomeBlocks());
    expect(data.editor).toBe("gutenberg");
    expect(data.blocks.length).toBeGreaterThanOrEqual(3);
    expect(data.blocks.some((b) => b.name === "nextpress/nav-bar")).toBe(true);
    expect(data.blocks.some((b) => b.name === "nextpress/hero-banner")).toBe(true);
    expect(data.html).toContain("wp:nextpress/nav-bar");
  });

  it("should resolve converted documents idempotently", () => {
    const once = seedBlocksToGutenberg(buildStarterHomeBlocks());
    const again = resolvePageDocument(once);
    expect(again.blocks).toHaveLength(once.blocks.length);
    expect(again.html).toBe(once.html);
  });
});
