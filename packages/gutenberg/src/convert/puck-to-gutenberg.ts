import type { PuckBlock, PuckData } from "@nextpress/shared";
import type { GutenbergBlock, GutenbergData } from "../types";
import { toGutenbergData } from "../serialize";

/** Map legacy Puck component type → Gutenberg block name. */
const PUCK_TYPE_TO_BLOCK: Record<string, string> = {
  Hero: "nextpress/hero",
  HeroBanner: "nextpress/hero-banner",
  Text: "nextpress/text",
  RichText: "nextpress/rich-text",
  Image: "nextpress/image",
  Columns: "nextpress/columns",
  Button: "nextpress/button",
  Spacer: "nextpress/spacer",
  Divider: "nextpress/divider",
  Card: "nextpress/card",
  NavBar: "nextpress/nav-bar",
  SiteFooter: "nextpress/site-footer",
  Section: "nextpress/section",
  ContentMedia: "nextpress/content-media",
  Gallery: "nextpress/gallery",
  Video: "nextpress/video",
  HtmlCode: "core/html",
  ContactForm: "nextpress/contact-form",
  Carousel: "nextpress/carousel",
  FilterGrid: "nextpress/filter-grid",
  MapEmbed: "nextpress/map-embed",
  AnnouncementBar: "nextpress/announcement-bar",
  PageHero: "nextpress/page-hero",
  InfoBand: "nextpress/info-band",
  ImageLinkGrid: "nextpress/image-link-grid",
  HighlightCta: "nextpress/highlight-cta",
  InquiryList: "nextpress/inquiry-list",
  FilterToolbar: "nextpress/filter-toolbar",
  HoverNameList: "nextpress/hover-name-list",
  MarketingHero: "nextpress/marketing-hero",
  BorderedSplit: "nextpress/bordered-split",
  ArticleGrid: "nextpress/article-grid",
};

function stripId(props: Record<string, unknown>): Record<string, unknown> {
  const { id: _id, ...rest } = props;
  return rest;
}

function puckBlockToGutenberg(
  block: PuckBlock,
  zones: Record<string, PuckBlock[]> | undefined,
): GutenbergBlock {
  const name = PUCK_TYPE_TO_BLOCK[block.type] ?? `nextpress/${kebab(block.type)}`;
  const props = stripId((block.props ?? {}) as Record<string, unknown>);

  // Slot zone keys in Puck look like `${blockId}-content` or are stored under zones
  const zoneKeyCandidates = Object.keys(zones ?? {}).filter((key) =>
    key.includes(String(block.props?.id ?? "")),
  );

  let innerFromZones: GutenbergBlock[] = [];
  if (zones) {
    for (const key of zoneKeyCandidates) {
      const zoneBlocks = zones[key] ?? [];
      innerFromZones = zoneBlocks.map((child) => puckBlockToGutenberg(child, zones));
      if (innerFromZones.length > 0) break;
    }
  }

  const nestedProp = props.content;
  const innerFromProps = Array.isArray(nestedProp)
    ? (nestedProp as PuckBlock[]).map((child) => puckBlockToGutenberg(child, zones))
    : [];
  // Don't put nested block arrays into Gutenberg attributes
  if (Array.isArray(nestedProp)) {
    delete props.content;
  }

  const childBlocks =
    innerFromZones.length > 0
      ? innerFromZones
      : innerFromProps.length > 0
        ? innerFromProps
        : (block.children ?? []).map((child) => puckBlockToGutenberg(child, zones));

  // Map a few core-friendly shapes
  if (name === "nextpress/text" && typeof props.content === "string") {
    return {
      name: "core/paragraph",
      attributes: { content: props.content, align: props.alignment },
      innerBlocks: [],
      innerHTML: `<p>${escapeHtml(String(props.content))}</p>`,
    };
  }

  if (name === "core/html" && typeof props.code === "string") {
    return {
      name: "core/html",
      attributes: {},
      innerBlocks: [],
      innerHTML: String(props.code),
    };
  }

  if (name === "core/html" && typeof props.html === "string") {
    return {
      name: "core/html",
      attributes: {},
      innerBlocks: [],
      innerHTML: String(props.html),
    };
  }

  return {
    name,
    attributes: { __props: props },
    innerBlocks: childBlocks,
  };
}

function kebab(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert legacy Puck page JSON into GutenbergData.
 * Slot/zone nesting is best-effort using block `id` props.
 */
export function puckToGutenberg(data: PuckData | null | undefined): GutenbergData {
  if (!data?.content?.length) {
    return toGutenbergData([]);
  }

  const blocks = data.content.map((block) =>
    puckBlockToGutenberg(block, data.zones),
  );
  return toGutenbergData(blocks);
}

/**
 * Convert a list of seed blocks `{ type, props }` into GutenbergData.
 */
export function seedBlocksToGutenberg(
  blocks: Array<{ type: string; props: Record<string, unknown> }>,
): GutenbergData {
  const puckLike: PuckData = {
    content: blocks.map((b) => ({ type: b.type, props: b.props })),
    root: { props: {} },
  };
  return puckToGutenberg(puckLike);
}
