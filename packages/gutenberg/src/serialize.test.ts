import { isGutenbergData } from "./types";
import { resolvePageDocument } from "./resolve";
import type { PuckData } from "@nextpress/shared";
import {
  parseBlocks,
  serializeBlocks,
  toGutenbergData,
  parseGutenbergHtml,
  countGutenbergWords,
} from "./serialize";
import { puckToGutenberg, seedBlocksToGutenberg } from "./convert/puck-to-gutenberg";
import { describe, expect, it } from "vitest";

describe("serialize / parse Gutenberg HTML", () => {
  it("should round-trip self-closing blocks", () => {
    const blocks = [
      {
        name: "nextpress/spacer",
        attributes: { height: "md" },
        innerBlocks: [],
      },
    ];
    const html = serializeBlocks(blocks);
    expect(html).toContain("<!-- wp:nextpress/spacer");
    expect(html).toContain("/-->");
    const parsed = parseBlocks(html);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("nextpress/spacer");
    expect(parsed[0].attributes.height).toBe("md");
  });

  it("should round-trip paragraph blocks with inner HTML", () => {
    const blocks = [
      {
        name: "core/paragraph",
        attributes: { align: "center" },
        innerBlocks: [],
        innerHTML: '<p class="has-text-align-center">Hello world</p>',
      },
    ];
    const html = serializeBlocks(blocks);
    const parsed = parseBlocks(html);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("core/paragraph");
    expect(parsed[0].attributes.align).toBe("center");
    expect(parsed[0].innerHTML).toContain("Hello world");
  });

  it("should parse nested group / column structures", () => {
    const html = `
<!-- wp:group -->
<!-- wp:paragraph -->
<p>One</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Two</p>
<!-- /wp:paragraph -->
<!-- /wp:group -->
`.trim();
    const parsed = parseBlocks(html);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("core/group");
    expect(parsed[0].innerBlocks.length).toBeGreaterThanOrEqual(2);
    expect(parsed[0].innerBlocks.every((b) => b.name === "core/paragraph")).toBe(true);
  });

  it("should build GutenbergData via toGutenbergData", () => {
    const data = toGutenbergData([
      { name: "core/heading", attributes: { level: 2, content: "Hi" }, innerBlocks: [], innerHTML: "<h2>Hi</h2>" },
    ]);
    expect(isGutenbergData(data)).toBe(true);
    expect(data.html).toContain("wp:heading");
  });

  it("should count words from attributes and inner HTML", () => {
    const data = parseGutenbergHtml(
      `<!-- wp:paragraph -->\n<p>Hello brave world</p>\n<!-- /wp:paragraph -->`,
    );
    expect(countGutenbergWords(data)).toBe(3);
  });
});

describe("puckToGutenberg", () => {
  it("should convert legacy Puck page trees", () => {
    const puck: PuckData = {
      root: { props: {} },
      content: [
        {
          type: "HeroBanner",
          props: { id: "hero", title: "Welcome", titleHighlight: "Home", subtitle: "Sub" },
        },
        {
          type: "Text",
          props: { id: "t1", content: "Body copy here", alignment: "left" },
        },
      ],
    };
    const gutenberg = puckToGutenberg(puck);
    expect(gutenberg.editor).toBe("gutenberg");
    expect(gutenberg.blocks.length).toBe(2);
    expect(gutenberg.blocks[0].name).toBe("nextpress/hero-banner");
    expect(gutenberg.blocks[1].name).toBe("core/paragraph");
    expect(gutenberg.html).toContain("nextpress/hero-banner");
  });

  it("should convert seed block lists", () => {
    const data = seedBlocksToGutenberg([
      { type: "NavBar", props: { brandLabel: "Acme", brandHref: "/", links: [] } },
      { type: "Spacer", props: { height: "md" } },
    ]);
    expect(data.blocks[0].name).toBe("nextpress/nav-bar");
    expect(data.blocks[1].name).toBe("nextpress/spacer");
  });
});

describe("resolvePageDocument", () => {
  it("should return empty doc for null", () => {
    const data = resolvePageDocument(null);
    expect(data.blocks).toEqual([]);
    expect(data.editor).toBe("gutenberg");
  });

  it("should pass through GutenbergData", () => {
    const original = toGutenbergData([
      { name: "core/separator", attributes: {}, innerBlocks: [] },
    ]);
    const resolved = resolvePageDocument(original);
    expect(resolved.blocks[0].name).toBe("core/separator");
  });

  it("should convert Puck-shaped JSON", () => {
    const resolved = resolvePageDocument({
      content: [{ type: "Divider", props: { style: "solid" } }],
      root: { props: {} },
    });
    expect(resolved.blocks[0].name).toBe("nextpress/divider");
  });
});
