"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { renderEditable } from "./editable";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function lines(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Carousel announcement strip (site-wide top bar). */
export type AnnouncementBarProps = {
  messages?: Array<{ text: string }>;
  /** Single-message fallback when `messages` is empty. */
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  showArrows?: boolean;
};

export function AnnouncementBar({
  messages,
  text,
  backgroundColor = "#000000",
  textColor = "#6FA84C",
  showArrows = true,
}: AnnouncementBarProps) {
  const items = useMemo(() => {
    if (messages?.length) return messages.map((m) => m.text).filter(Boolean);
    if (text?.trim()) return [text.trim()];
    return [];
  }, [messages, text]);
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const current = items[index % items.length];

  return (
    <div
      className="relative flex items-center justify-center px-10 py-2 text-center text-xs tracking-wide"
      style={{ backgroundColor, color: textColor }}
      role="region"
      aria-label="Announcements"
    >
      {showArrows && items.length > 1 ? (
        <button
          type="button"
          aria-label="Previous announcement"
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        >
          ‹
        </button>
      ) : null}
      <p className="m-0 max-w-3xl">{current}</p>
      {showArrows && items.length > 1 ? (
        <button
          type="button"
          aria-label="Next announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          onClick={() => setIndex((i) => (i + 1) % items.length)}
        >
          ›
        </button>
      ) : null}
    </div>
  );
}

/** Full-bleed page hero with title pinned bottom-left (directory/events style). */
export type PageHeroProps = {
  title: string | ReactNode;
  imageUrl?: string;
  minHeight?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  textColor?: string;
};

export function PageHero({
  title,
  imageUrl,
  minHeight = "72vh",
  overlayOpacity = 40,
  overlayColor = "#000000",
  textColor = "#ffffff",
}: PageHeroProps) {
  const opacity = Math.min(90, Math.max(0, overlayOpacity)) / 100;
  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{
        minHeight,
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, opacity }}
        aria-hidden
      />
      <div className="relative z-10 w-full px-6 pb-10 pt-24 md:px-12 md:pb-14">
        <h1
          className="m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tight"
          style={{ color: textColor }}
        >
          {renderEditable(title)}
        </h1>
      </div>
    </section>
  );
}

/** Three-column hours | logo+copy | address band. */
export type InfoBandProps = {
  hoursLabel?: string;
  hoursLines?: string;
  logoUrl?: string;
  title?: string | ReactNode;
  highlight?: string | ReactNode;
  body?: string | ReactNode;
  addressLabel?: string;
  addressLines?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
};

export function InfoBand({
  hoursLabel = "Hours of Operation",
  hoursLines = "",
  logoUrl,
  title,
  highlight,
  body,
  addressLabel = "Address",
  addressLines = "",
  accentColor = "#6FA84C",
  textColor = "#494747",
  backgroundColor = "#F5F5F5",
}: InfoBandProps) {
  return (
    <section className="px-6 py-16" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:items-start">
        <div
          className="min-h-[220px] px-6 py-8 text-center"
          style={{ border: `1px solid ${accentColor}` }}
        >
          <p
            className="m-0 text-[11px] uppercase tracking-[0.22em]"
            style={{ color: accentColor }}
          >
            {hoursLabel}
          </p>
          <div className="mt-5 whitespace-pre-line text-[clamp(18px,2.2vw,24px)] leading-relaxed">
            {hoursLines}
          </div>
        </div>
        <div className="px-3 text-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="mx-auto mb-7 block h-auto w-full max-w-[220px]"
            />
          ) : null}
          <h2 className="m-0 text-[clamp(26px,3.5vw,42px)] font-normal leading-tight">
            {renderEditable(title)}{" "}
            <span style={{ color: accentColor }}>{renderEditable(highlight)}</span>
          </h2>
          {body ? (
            <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed">
              {renderEditable(body)}
            </p>
          ) : null}
        </div>
        <div
          className="min-h-[220px] px-6 py-8 text-center"
          style={{ border: `1px solid ${accentColor}` }}
        >
          <p
            className="m-0 text-[11px] uppercase tracking-[0.22em]"
            style={{ color: accentColor }}
          >
            {addressLabel}
          </p>
          <div className="mt-5 whitespace-pre-line text-[clamp(18px,2.2vw,24px)] leading-relaxed">
            {addressLines}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Overlay image cards linking to destinations (lease types, categories, etc.). */
export type ImageLinkGridProps = {
  title?: string | ReactNode;
  highlight?: string | ReactNode;
  highlightColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  tiles?: Array<{ title: string; imageUrl?: string; href?: string }>;
  backgroundColor?: string;
  textColor?: string;
};

export function ImageLinkGrid({
  title,
  highlight,
  highlightColor = "#6FA84C",
  ctaLabel,
  ctaUrl,
  tiles = [],
  backgroundColor = "#ffffff",
  textColor = "#111111",
}: ImageLinkGridProps) {
  return (
    <section className="px-6 py-16" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-6xl">
        {(title || highlight) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="m-0 text-[clamp(2rem,4vw,3.5rem)] font-normal">
              {renderEditable(title)}{" "}
              <span style={{ color: highlightColor }}>{renderEditable(highlight)}</span>
            </h2>
            {ctaLabel && ctaUrl ? (
              <a
                href={ctaUrl}
                className="inline-block rounded-sm px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline"
                style={{ backgroundColor: highlightColor }}
              >
                {ctaLabel}
              </a>
            ) : null}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          {tiles.map((tile) => (
            <a
              key={`${tile.title}-${tile.href}`}
              href={tile.href || "#"}
              className="group relative block min-h-[280px] overflow-hidden no-underline"
            >
              {tile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tile.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 flex h-full items-end p-6 text-white">
                <span className="text-lg font-medium">{tile.title}</span>
                <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 text-sm">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Title + highlight with optional outline CTA (social follow intros, etc.). */
export type HighlightCtaProps = {
  title?: string | ReactNode;
  highlight?: string | ReactNode;
  buttonLabel?: string;
  buttonUrl?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
};

export function HighlightCta({
  title,
  highlight,
  buttonLabel,
  buttonUrl,
  accentColor = "#6FA84C",
  textColor = "#494747",
  backgroundColor = "#ffffff",
}: HighlightCtaProps) {
  return (
    <section
      className="px-6 pb-6 pt-12 text-center"
      style={{ backgroundColor, color: textColor }}
    >
      <h2 className="m-0 text-[clamp(28px,4vw,48px)] font-normal">
        {renderEditable(title)}{" "}
        <span style={{ color: accentColor }}>{renderEditable(highlight)}</span>
      </h2>
      {buttonLabel ? (
        <a
          href={buttonUrl || "#"}
          className="mt-6 inline-block rounded border-2 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] no-underline"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {buttonLabel}
        </a>
      ) : null}
    </section>
  );
}

export type InquiryItem = {
  title: string;
  emailLabel?: string;
  email?: string;
  actionLabel?: string;
  actionText?: string;
  actionHref?: string;
};

/** Stacked inquiry rows used on contact pages. */
export type InquiryListProps = {
  heading?: string | ReactNode;
  headingColor?: string;
  items?: InquiryItem[];
  accentColor?: string;
  backgroundColor?: string;
};

export function InquiryList({
  heading,
  headingColor = "#6FA84C",
  items = [],
  accentColor = "#6FA84C",
  backgroundColor = "#ffffff",
}: InquiryListProps) {
  return (
    <section className="px-6 py-12" style={{ backgroundColor }}>
      <div className="mx-auto max-w-5xl">
        {heading ? (
          <h1
            className="mb-10 text-[clamp(2.5rem,5vw,4rem)] font-normal"
            style={{ color: headingColor }}
          >
            {renderEditable(heading)}
          </h1>
        ) : null}
        <div>
          {items.map((item) => (
            <div
              key={item.title}
              className="grid gap-4 border-t py-8 md:grid-cols-[1.2fr_1fr_1fr]"
              style={{ borderColor: `${accentColor}55` }}
            >
              <h2 className="m-0 text-xl font-semibold text-zinc-900">{item.title}</h2>
              <div>
                <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  {item.emailLabel || "Email"}
                </p>
                {item.email ? (
                  <a href={`mailto:${item.email}`} className="mt-1 block text-zinc-900">
                    {item.email}
                  </a>
                ) : null}
              </div>
              <div>
                <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  {item.actionLabel || "Get in touch"}
                </p>
                {item.actionText ? (
                  <a
                    href={item.actionHref || "#"}
                    className="mt-1 block text-zinc-900 underline-offset-2 hover:underline"
                  >
                    {item.actionText}
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Toolbar for directory-like listings (category, view mode, CTA). */
export type FilterToolbarProps = {
  categoryLabel?: string;
  galleryLabel?: string;
  listLabel?: string;
  activeView?: "gallery" | "list";
  directoryLabel?: string;
  directoryUrl?: string;
  backgroundColor?: string;
};

export function FilterToolbar({
  categoryLabel = "Category: All",
  galleryLabel = "Gallery",
  listLabel = "List",
  activeView = "gallery",
  directoryLabel = "View Directory",
  directoryUrl = "/directory",
  backgroundColor = "#ffffff",
}: FilterToolbarProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-6 py-4"
      style={{ backgroundColor }}
    >
      <button type="button" className="text-sm text-zinc-700">
        {categoryLabel} ▾
      </button>
      <div className="flex items-center gap-4 text-sm">
        <span className={cn(activeView === "gallery" && "font-semibold")}>{galleryLabel}</span>
        <span className="text-zinc-400">·</span>
        <span className={cn(activeView === "list" && "font-semibold")}>{listLabel}</span>
        <a
          href={directoryUrl}
          className="ml-2 rounded-full border border-zinc-400 px-4 py-1.5 text-xs uppercase tracking-wide text-zinc-800 no-underline"
        >
          {directoryLabel}
        </a>
      </div>
    </div>
  );
}

export type HoverNameItem = {
  title: string;
  href?: string;
  imageUrl?: string;
};

/** Large name list with hover image preview (vendors / tenants). */
export type HoverNameListProps = {
  items?: HoverNameItem[];
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
};

export function HoverNameList({
  items = [],
  backgroundColor = "#ffffff",
  textColor = "#9a8f86",
  hoverColor = "#111111",
}: HoverNameListProps) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <section className="px-6 py-10" style={{ backgroundColor }}>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-start">
        <ul className="m-0 list-none p-0">
          {items.map((item, i) => (
            <li key={item.title}>
              <a
                href={item.href || "#"}
                className="block py-2 text-[clamp(1.5rem,3vw,2.5rem)] font-light no-underline transition-colors"
                style={{ color: i === active ? hoverColor : textColor }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative min-h-[320px] overflow-hidden bg-zinc-100">
          {current?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt={current.title || ""}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Dark marketing hero with breadcrumb + accent-highlighted copy. */
export type MarketingHeroProps = {
  breadcrumb?: string;
  html?: string;
  backgroundColor?: string;
  accentColor?: string;
};

export function MarketingHero({
  breadcrumb,
  html,
  backgroundColor = "#111111",
  accentColor = "#6FA84C",
}: MarketingHeroProps) {
  return (
    <section className="px-6 py-20 md:px-12" style={{ backgroundColor }}>
      <div className="mx-auto max-w-5xl">
        {breadcrumb ? (
          <p className="mb-8 text-xs uppercase tracking-[0.18em] text-white/80">{breadcrumb}</p>
        ) : null}
        {html ? (
          <div
            className="marketing-hero-copy text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-snug text-white [&_strong]:font-semibold"
            style={{ ["--mh-accent" as string]: accentColor }}
            dangerouslySetInnerHTML={{
              __html: html.replace(
                /<strong>/g,
                `<strong style="color:${accentColor}">`,
              ),
            }}
          />
        ) : null}
      </div>
    </section>
  );
}

/** Bordered split content panel (order food / featured info). */
export type BorderedSplitProps = {
  borderColor?: string;
  mediaHtml?: string;
  mediaBackgroundColor?: string;
  title?: string | ReactNode;
  bodyHtml?: string;
  backgroundColor?: string;
};

export function BorderedSplit({
  borderColor = "#6FA84C",
  mediaHtml,
  mediaBackgroundColor = "#6FA84C",
  title,
  bodyHtml,
  backgroundColor = "#ffffff",
}: BorderedSplitProps) {
  return (
    <section className="px-6 py-12" style={{ backgroundColor }}>
      <div
        className="mx-auto grid max-w-6xl overflow-hidden md:grid-cols-2"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div
          className="flex min-h-[280px] items-center justify-center p-8"
          style={{ backgroundColor: mediaBackgroundColor }}
          dangerouslySetInnerHTML={mediaHtml ? { __html: mediaHtml } : undefined}
        />
        <div className="p-8 md:p-10">
          {title ? (
            <h1 className="m-0 text-[clamp(1.4rem,3vw,2rem)] font-semibold uppercase tracking-wide text-zinc-900">
              {renderEditable(title)}
            </h1>
          ) : null}
          {bodyHtml ? (
            <div
              className="prose prose-zinc mt-4 max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Escape helper for building safe line text. */
export function formatMultiline(value: string): string[] {
  return lines(value);
}
