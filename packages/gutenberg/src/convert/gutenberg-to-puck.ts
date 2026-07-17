import type { PuckBlock, PuckData } from "@nextpress/shared";
import type { GutenbergBlock, GutenbergData } from "../types";
import { isGutenbergData } from "../types";

const BLOCK_TO_PUCK: Record<string, string> = {
  "nextpress/hero": "Hero",
  "nextpress/hero-banner": "HeroBanner",
  "nextpress/text": "Text",
  "nextpress/rich-text": "RichText",
  "nextpress/image": "Image",
  "nextpress/columns": "Columns",
  "nextpress/button": "Button",
  "nextpress/spacer": "Spacer",
  "nextpress/divider": "Divider",
  "nextpress/card": "Card",
  "nextpress/nav-bar": "NavBar",
  "nextpress/site-footer": "SiteFooter",
  "nextpress/section": "Section",
  "nextpress/content-media": "ContentMedia",
  "nextpress/gallery": "Gallery",
  "nextpress/video": "Video",
  "nextpress/contact-form": "ContactForm",
  "nextpress/carousel": "Carousel",
  "nextpress/filter-grid": "FilterGrid",
  "nextpress/map-embed": "MapEmbed",
  "nextpress/announcement-bar": "AnnouncementBar",
  "nextpress/page-hero": "PageHero",
  "nextpress/info-band": "InfoBand",
  "nextpress/image-link-grid": "ImageLinkGrid",
  "nextpress/highlight-cta": "HighlightCta",
  "nextpress/inquiry-list": "InquiryList",
  "nextpress/filter-toolbar": "FilterToolbar",
  "nextpress/hover-name-list": "HoverNameList",
  "nextpress/marketing-hero": "MarketingHero",
  "nextpress/bordered-split": "BorderedSplit",
  "nextpress/article-grid": "ArticleGrid",
  "core/paragraph": "Text",
  "core/html": "HtmlCode",
  "core/separator": "Divider",
  "core/spacer": "Spacer",
  "core/image": "Image",
};

function attrsOf(block: GutenbergBlock): Record<string, unknown> {
  const raw = block.attributes ?? {};
  const nested =
    raw.__props && typeof raw.__props === "object"
      ? (raw.__props as Record<string, unknown>)
      : {};
  const { __props: _p, data: _d, ...rest } = raw;
  return { ...nested, ...rest };
}

function gutenbergBlockToPuck(block: GutenbergBlock, index: number): PuckBlock {
  const type =
    BLOCK_TO_PUCK[block.name] ??
    block.name
      .replace(/^nextpress\//, "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

  const props: Record<string, unknown> = {
    id: `gb-${index}`,
    ...attrsOf(block),
  };

  if (type === "Text" && !props.content && block.innerHTML) {
    props.content = block.innerHTML.replace(/<[^>]+>/g, "").trim();
  }
  if (type === "HtmlCode" && !props.html && block.innerHTML) {
    props.html = block.innerHTML;
  }
  if (type === "Image" && !props.src && typeof props.url === "string") {
    props.src = props.url;
  }

  const children = (block.innerBlocks ?? []).map((child, i) =>
    gutenbergBlockToPuck(child, i),
  );
  if (children.length > 0) {
    props.content = children;
  }

  return { type, props };
}

/**
 * Convert Gutenberg page JSON back into Puck data for the Puck visual editor.
 */
export function gutenbergToPuck(data: GutenbergData | null | undefined): PuckData {
  if (!data?.blocks?.length) {
    return { content: [], root: { props: { title: "" } } };
  }
  return {
    root: { props: { title: "" } },
    content: data.blocks.map((block, index) => gutenbergBlockToPuck(block, index)),
  };
}

/**
 * Resolve whatever CMS JSON we have into PuckData for the page builder.
 */
export function resolvePuckDocument(value: unknown): PuckData {
  if (!value || typeof value !== "object") {
    return { content: [], root: { props: { title: "" } } };
  }
  if (isGutenbergData(value)) {
    return gutenbergToPuck(value);
  }
  if (Array.isArray((value as { content?: unknown }).content)) {
    return value as PuckData;
  }
  return { content: [], root: { props: { title: "" } } };
}
