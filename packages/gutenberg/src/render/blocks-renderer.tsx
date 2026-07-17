"use client";

import type { ReactNode } from "react";
import {
  Hero,
  HeroBanner,
  Text,
  ImageBlock,
  Columns,
  ButtonBlock,
  Spacer,
  Divider,
  Card,
  NavBar,
  SiteFooter,
  Section,
  Gallery,
  Video,
  RichText,
  ContentMedia,
  AnnouncementBar,
  PageHero,
  InfoBand,
  ImageLinkGrid,
  HighlightCta,
  InquiryList,
  FilterToolbar,
  HoverNameList,
  MarketingHero,
  BorderedSplit,
  ArticleGrid,
  ContactFormBlock,
  FilterGrid,
} from "@nextpress/blocks";
import type { GutenbergBlock, GutenbergData } from "../types";

type Attrs = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function spacerHeight(value: unknown): "sm" | "md" | "lg" | "xl" {
  if (value === "sm" || value === "md" || value === "lg" || value === "xl") return value;
  const px = asNumber(value, 64);
  if (px <= 32) return "sm";
  if (px <= 64) return "md";
  if (px <= 96) return "lg";
  return "xl";
}

function heroMinHeight(value: unknown): "sm" | "md" | "lg" | "screen" {
  if (value === "sm" || value === "md" || value === "lg" || value === "screen") return value;
  if (value === "full") return "screen";
  return "md";
}

/**
 * Render one Gutenberg block to React using NextPress presentational components.
 */
export function renderGutenbergBlock(block: GutenbergBlock, key: string): ReactNode {
  const raw = (block.attributes ?? {}) as Attrs;
  const nested =
    raw.__props && typeof raw.__props === "object"
      ? (raw.__props as Attrs)
      : raw.data && typeof raw.data === "object"
        ? (raw.data as Attrs)
        : {};
  const attrs: Attrs = { ...nested, ...raw };
  delete attrs.__props;
  delete attrs.data;
  const children = (block.innerBlocks ?? []).map((child, i) =>
    renderGutenbergBlock(child, `${key}-${i}`),
  );

  switch (block.name) {
    case "core/paragraph": {
      const content =
        asString(attrs.content) ||
        (block.innerHTML ? stripTags(block.innerHTML) : "");
      return (
        <Text
          key={key}
          content={content}
          alignment={(asString(attrs.align, "left") as "left" | "center" | "right")}
        />
      );
    }
    case "core/heading": {
      const level = Math.min(6, Math.max(1, asNumber(attrs.level, 2)));
      const Tag = (`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");
      const content =
        asString(attrs.content) ||
        (block.innerHTML ? stripTags(block.innerHTML) : "");
      return (
        <Tag key={key} className="mb-3 px-6 font-semibold text-zinc-900">
          {content}
        </Tag>
      );
    }
    case "core/image": {
      const url = asString(attrs.url);
      if (!url) return null;
      return (
        <ImageBlock
          key={key}
          src={url}
          alt={asString(attrs.alt)}
          caption={asString(attrs.caption) || undefined}
          rounded={Boolean(attrs.rounded)}
        />
      );
    }
    case "core/list": {
      if (block.innerHTML) {
        return (
          <div
            key={key}
            className="prose prose-zinc mx-auto mb-4 max-w-3xl px-6"
            dangerouslySetInnerHTML={{ __html: block.innerHTML }}
          />
        );
      }
      const ordered = Boolean(attrs.ordered);
      const ListTag = ordered ? "ol" : "ul";
      return (
        <ListTag key={key} className="mb-4 list-disc px-10 text-zinc-800">
          {children}
        </ListTag>
      );
    }
    case "core/list-item": {
      const content =
        asString(attrs.content) ||
        (block.innerHTML ? stripTags(block.innerHTML) : "");
      return <li key={key}>{content}</li>;
    }
    case "core/quote":
      return (
        <blockquote
          key={key}
          className="my-6 border-l-4 border-zinc-300 px-6 py-2 text-lg italic text-zinc-700"
        >
          {block.innerHTML ? (
            <div dangerouslySetInnerHTML={{ __html: block.innerHTML }} />
          ) : (
            children
          )}
        </blockquote>
      );
    case "core/separator":
      return <Divider key={key} style="solid" />;
    case "core/spacer":
      return <Spacer key={key} height={spacerHeight(attrs.height)} />;
    case "core/html":
    case "core/freeform":
      return block.innerHTML ? (
        <div
          key={key}
          className="px-6"
          dangerouslySetInnerHTML={{ __html: block.innerHTML }}
        />
      ) : null;
    case "core/group":
      return (
        <div key={key} className="my-4">
          {children}
        </div>
      );
    case "core/columns":
      return (
        <Columns
          key={key}
          columns={String(Math.min(4, Math.max(1, children.length || 2))) as "1" | "2" | "3" | "4"}
          content={() => <>{children}</>}
        />
      );
    case "core/column":
      return (
        <div key={key} className="min-w-0 flex-1">
          {children}
        </div>
      );
    case "core/buttons":
      return (
        <div key={key} className="my-4 flex flex-wrap gap-3 px-6">
          {children}
        </div>
      );
    case "core/button":
      return (
        <ButtonBlock
          key={key}
          label={asString(attrs.text, "Button")}
          url={asString(attrs.url, "#")}
          variant="primary"
          alignment="left"
        />
      );
    case "nextpress/hero":
      return (
        <Hero
          key={key}
          title={asString(attrs.title, "Hero")}
          subtitle={asString(attrs.subtitle)}
          backgroundImage={asString(attrs.backgroundImage) || undefined}
          alignment={(asString(attrs.alignment, "center") as "left" | "center" | "right")}
          textColor={asString(attrs.textColor) || undefined}
          overlayColor={asString(attrs.overlayColor) || undefined}
        />
      );
    case "nextpress/hero-banner":
      return (
        <HeroBanner
          key={key}
          title={asString(attrs.title)}
          titleHighlight={asString(attrs.titleHighlight)}
          subtitle={asString(attrs.subtitle)}
          overlayOpacity={asNumber(attrs.overlayOpacity, 55)}
          minHeight={heroMinHeight(attrs.minHeight)}
          videoUrl={asString(attrs.videoUrl || attrs.backgroundImage) || undefined}
        />
      );
    case "nextpress/text":
      return (
        <Text
          key={key}
          content={asString(attrs.content)}
          alignment={(asString(attrs.alignment, "left") as "left" | "center" | "right")}
        />
      );
    case "nextpress/rich-text":
      return <RichText key={key} html={asString(attrs.html)} />;
    case "nextpress/image":
      return (
        <ImageBlock
          key={key}
          src={asString(attrs.src ?? attrs.url)}
          alt={asString(attrs.alt)}
          caption={asString(attrs.caption) || undefined}
          rounded={Boolean(attrs.rounded)}
        />
      );
    case "nextpress/columns":
      return (
        <Columns
          key={key}
            columns={String(attrs.columns ?? (children.length || 2)) as "1" | "2" | "3" | "4"}
          content={() => <>{children}</>}
        />
      );
    case "nextpress/button":
      return (
        <ButtonBlock
          key={key}
          label={asString(attrs.label ?? attrs.text, "Button")}
          url={asString(attrs.href ?? attrs.url, "#")}
          variant={(asString(attrs.variant, "primary") as "primary" | "secondary" | "outline")}
          alignment={(asString(attrs.alignment, "left") as "left" | "center" | "right")}
        />
      );
    case "nextpress/spacer":
      return <Spacer key={key} height={spacerHeight(attrs.height)} />;
    case "nextpress/divider":
      return (
        <Divider
          key={key}
          style={(asString(attrs.style, "solid") as "solid" | "dashed")}
        />
      );
    case "nextpress/card":
      return (
        <Card
          key={key}
          title={asString(attrs.title)}
          description={asString(attrs.description ?? attrs.body)}
          imageUrl={asString(attrs.imageUrl) || undefined}
          linkUrl={asString(attrs.href ?? attrs.linkUrl) || undefined}
        />
      );
    case "nextpress/nav-bar":
      return (
        <NavBar
          key={key}
          brandLabel={asString(attrs.brandLabel, "Site")}
          brandHref={asString(attrs.brandHref, "/")}
          links={Array.isArray(attrs.links) ? (attrs.links as never) : []}
        />
      );
    case "nextpress/site-footer":
      return (
        <SiteFooter
          key={key}
          copyright={asString(attrs.copyright)}
          columns={Array.isArray(attrs.columns) ? (attrs.columns as never) : []}
        />
      );
    case "nextpress/section":
      return (
        <Section
          key={key}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
          paddingY={(asString(attrs.paddingY, "md") as "none" | "sm" | "md" | "lg" | "xl")}
          content={() => <>{children}</>}
        />
      );
    case "nextpress/content-media":
      return (
        <ContentMedia
          key={key}
          title={asString(attrs.title)}
          content={asString(attrs.content)}
          mediaPosition={(asString(attrs.mediaPosition, "right") as "left" | "right")}
          mediaType={(asString(attrs.mediaType, "image") as "image" | "video")}
          desktopImageUrl={asString(attrs.desktopImageUrl)}
          paddingY={(asString(attrs.paddingY, "lg") as "sm" | "md" | "lg")}
        />
      );
    case "nextpress/gallery":
      return (
        <Gallery
          key={key}
          images={Array.isArray(attrs.images) ? (attrs.images as never) : []}
          columns={(asString(attrs.columns, "3") as "2" | "3" | "4")}
        />
      );
    case "nextpress/video":
      return (
        <Video
          key={key}
          url={asString(attrs.url)}
          caption={asString(attrs.caption) || undefined}
        />
      );
    case "nextpress/announcement-bar":
      return (
        <AnnouncementBar
          key={key}
          text={asString(attrs.text)}
          messages={Array.isArray(attrs.messages) ? (attrs.messages as never) : undefined}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
          textColor={asString(attrs.textColor) || undefined}
          showArrows={attrs.showArrows !== false}
        />
      );
    case "nextpress/page-hero":
      return (
        <PageHero
          key={key}
          title={asString(attrs.title)}
          imageUrl={asString(attrs.imageUrl) || undefined}
          minHeight={asString(attrs.minHeight, "72vh")}
          overlayOpacity={asNumber(attrs.overlayOpacity, 40)}
        />
      );
    case "nextpress/info-band":
      return (
        <InfoBand
          key={key}
          hoursLabel={asString(attrs.hoursLabel) || undefined}
          hoursLines={asString(attrs.hoursLines)}
          logoUrl={asString(attrs.logoUrl) || undefined}
          title={asString(attrs.title)}
          highlight={asString(attrs.highlight)}
          body={asString(attrs.body)}
          addressLabel={asString(attrs.addressLabel) || undefined}
          addressLines={asString(attrs.addressLines)}
          accentColor={asString(attrs.accentColor) || undefined}
          textColor={asString(attrs.textColor) || undefined}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
        />
      );
    case "nextpress/image-link-grid":
      return (
        <ImageLinkGrid
          key={key}
          title={asString(attrs.title)}
          highlight={asString(attrs.highlight)}
          highlightColor={asString(attrs.highlightColor) || undefined}
          ctaLabel={asString(attrs.ctaLabel) || undefined}
          ctaUrl={asString(attrs.ctaUrl) || undefined}
          tiles={Array.isArray(attrs.tiles) ? (attrs.tiles as never) : []}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
        />
      );
    case "nextpress/highlight-cta":
      return (
        <HighlightCta
          key={key}
          title={asString(attrs.title)}
          highlight={asString(attrs.highlight)}
          buttonLabel={asString(attrs.buttonLabel) || undefined}
          buttonUrl={asString(attrs.buttonUrl) || undefined}
          accentColor={asString(attrs.accentColor) || undefined}
          textColor={asString(attrs.textColor) || undefined}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
        />
      );
    case "nextpress/inquiry-list":
      return (
        <InquiryList
          key={key}
          heading={asString(attrs.heading) || undefined}
          headingColor={asString(attrs.headingColor) || undefined}
          items={Array.isArray(attrs.items) ? (attrs.items as never) : []}
          accentColor={asString(attrs.accentColor) || undefined}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
        />
      );
    case "nextpress/filter-toolbar":
      return (
        <FilterToolbar
          key={key}
          categoryLabel={asString(attrs.categoryLabel) || undefined}
          galleryLabel={asString(attrs.galleryLabel) || undefined}
          listLabel={asString(attrs.listLabel) || undefined}
          activeView={(asString(attrs.activeView, "gallery") as "gallery" | "list")}
          directoryLabel={asString(attrs.directoryLabel) || undefined}
          directoryUrl={asString(attrs.directoryUrl) || undefined}
        />
      );
    case "nextpress/hover-name-list":
      return (
        <HoverNameList
          key={key}
          items={Array.isArray(attrs.items) ? (attrs.items as never) : []}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
        />
      );
    case "nextpress/marketing-hero":
      return (
        <MarketingHero
          key={key}
          breadcrumb={asString(attrs.breadcrumb) || undefined}
          html={asString(attrs.html)}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
          accentColor={asString(attrs.accentColor) || undefined}
        />
      );
    case "nextpress/bordered-split":
      return (
        <BorderedSplit
          key={key}
          borderColor={asString(attrs.borderColor) || undefined}
          mediaHtml={asString(attrs.mediaHtml) || undefined}
          mediaBackgroundColor={asString(attrs.mediaBackgroundColor) || undefined}
          title={asString(attrs.title)}
          bodyHtml={asString(attrs.bodyHtml)}
        />
      );
    case "nextpress/article-grid":
      return (
        <ArticleGrid
          key={key}
          title={asString(attrs.title)}
          description={asString(attrs.description)}
          articles={Array.isArray(attrs.articles) ? (attrs.articles as never) : []}
          layout={(asString(attrs.layout, "grid") as "grid" | "masonry")}
          cardVariant={(asString(attrs.cardVariant, "default") as "default" | "image-overlay")}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
          textColor={asString(attrs.textColor) || undefined}
          linkColor={asString(attrs.linkColor) || undefined}
          sectionCtaLabel={asString(attrs.sectionCtaLabel) || undefined}
          sectionCtaUrl={asString(attrs.sectionCtaUrl) || undefined}
          sectionCtaStyle={(asString(attrs.sectionCtaStyle, "link") as "link" | "button")}
        />
      );
    case "nextpress/filter-grid":
      return (
        <FilterGrid
          key={key}
          items={Array.isArray(attrs.items) ? (attrs.items as never) : []}
          sectionTitle={asString(attrs.sectionTitle) || undefined}
          sectionHeaderColor={asString(attrs.sectionHeaderColor) || undefined}
          sectionCtaLabel={asString(attrs.sectionCtaLabel) || undefined}
          sectionCtaUrl={asString(attrs.sectionCtaUrl) || undefined}
          accentColor={asString(attrs.accentColor) || undefined}
          backgroundImage={asString(attrs.backgroundImage) || undefined}
          overlayOpacity={asNumber(attrs.overlayOpacity, 0)}
          displayMode={(asString(attrs.displayMode, "grid") as never)}
          cardStyle={(asString(attrs.cardStyle, "default") as never)}
          showFilters={Boolean(attrs.showFilters)}
          showViewToggle={Boolean(attrs.showViewToggle)}
          blockId={asString(attrs.blockId) || undefined}
        />
      );
    case "nextpress/contact-form":
      return (
        <ContactFormBlock
          key={key}
          formId={asString(attrs.formId, "contact")}
          title={asString(attrs.title)}
          description={asString(attrs.description)}
          submitLabel={asString(attrs.submitLabel, "Submit")}
          successMessage={asString(attrs.successMessage)}
          variant={(asString(attrs.variant, "inline") as never)}
          buttonColor={asString(attrs.buttonColor) || undefined}
          backgroundColor={asString(attrs.backgroundColor) || undefined}
          backgroundImage={asString(attrs.backgroundImage) || undefined}
          overlayOpacity={asNumber(attrs.overlayOpacity, 0)}
          textColor={asString(attrs.textColor) || undefined}
          columns={(asString(attrs.columns, "1") as never)}
          fields={Array.isArray(attrs.fields) ? (attrs.fields as never) : []}
          blockId={asString(attrs.blockId) || undefined}
        />
      );
    default:
      if (children.length > 0) {
        return (
          <div key={key} data-block={block.name}>
            {children}
          </div>
        );
      }
      if (block.innerHTML) {
        return (
          <div
            key={key}
            data-block={block.name}
            dangerouslySetInnerHTML={{ __html: block.innerHTML }}
          />
        );
      }
      return null;
  }
}

/**
 * Public-site renderer for Gutenberg page documents.
 */
export function GutenbergBlocksRenderer({ data }: { data: GutenbergData }) {
  if (!data.blocks.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        This page has no content yet.
      </div>
    );
  }

  return (
    <>
      {data.blocks.map((block, index) => renderGutenbergBlock(block, `b-${index}`))}
    </>
  );
}
