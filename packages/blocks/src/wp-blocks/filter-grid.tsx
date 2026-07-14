"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { type LayoutProps, layoutStyle, maxWidthClass } from "../layout";
import { WithScrollReveal } from "../motion/with-scroll-reveal";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type FilterGridItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
};

export type FilterGridProps = {
  items: FilterGridItem[];
  categories?: { name: string }[];
  viewMode?: "grid" | "list";
  displayMode?: "grid" | "carousel";
  columns?: "2" | "3" | "4";
  showViewToggle?: boolean;
  showFilters?: boolean;
  sectionTitle?: string;
  sectionCtaLabel?: string;
  sectionCtaUrl?: string;
  sectionHeaderColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  cardStyle?: "default" | "title-first";
  accentColor?: string;
} & LayoutProps;

function FilterGridCard({
  item,
  viewMode,
  cardStyle,
  accentColor,
}: {
  item: FilterGridItem;
  viewMode: "grid" | "list";
  cardStyle: NonNullable<FilterGridProps["cardStyle"]>;
  accentColor?: string;
}) {
  const titleFirst = cardStyle === "title-first";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm",
        viewMode === "list" && "flex gap-4",
      )}
    >
      {item.imageUrl && !titleFirst ? (
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "object-cover",
            viewMode === "list" ? "h-24 w-24 shrink-0 rounded-lg" : "aspect-[4/3] w-full",
          )}
        />
      ) : null}
      <div className="p-5">
        {titleFirst ? (
          <>
            <h3 className="font-theme-heading text-2xl font-normal text-zinc-900">{item.title}</h3>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              {item.category}
            </span>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="mt-4 aspect-[4/3] w-full object-cover"
              />
            ) : null}
          </>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">{item.category}</span>
            <h3 className="mt-1 font-semibold text-zinc-900">
              {item.linkUrl ? (
                <a
                  href={item.linkUrl}
                  className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
          </>
        )}
        {item.description ? <p className="mt-2 text-sm text-zinc-600">{item.description}</p> : null}
        {(item.primaryCtaLabel || item.secondaryCtaLabel) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.primaryCtaLabel && item.primaryCtaUrl ? (
              <a
                href={item.primaryCtaUrl}
                className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: accentColor || "var(--theme-color-accent, #6FA84C)" }}
              >
                {item.primaryCtaLabel}
              </a>
            ) : null}
            {item.secondaryCtaLabel && item.secondaryCtaUrl ? (
              <a
                href={item.secondaryCtaUrl}
                className="inline-flex rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
              >
                {item.secondaryCtaLabel}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Filterable item grid with optional category filters and carousel display.
 */
export function FilterGrid({
  items,
  categories,
  viewMode: initialView = "grid",
  displayMode = "grid",
  columns = "3",
  showViewToggle = true,
  showFilters = true,
  sectionTitle,
  sectionCtaLabel,
  sectionCtaUrl,
  sectionHeaderColor,
  backgroundColor,
  backgroundImage,
  overlayColor = "rgba(0,0,0,0.5)",
  overlayOpacity = 0,
  cardStyle = "default",
  accentColor,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  offsetX,
  offsetY,
  maxWidth,
  className,
  blockId,
  animation,
  animationDelay,
  animationDuration,
}: FilterGridProps) {
  const allItems = items?.filter((i) => i.title) ?? [];
  const categoryList = useMemo(() => {
    const fromConfig = (categories ?? []).map((c) => c.name).filter(Boolean);
    if (fromConfig.length) return ["All", ...fromConfig];
    const unique = [...new Set(allItems.map((i) => i.category).filter(Boolean))];
    return ["All", ...unique];
  }, [allItems, categories]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const trackRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "All"
      ? allItems
      : allItems.filter((i) => i.category === activeCategory);

  const gridClass =
    viewMode === "list"
      ? "grid-cols-1"
      : columns === "4"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : columns === "2"
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const scrollCarousel = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 320, behavior: "smooth" });
  }, []);

  const overlayAlpha = Math.min(90, Math.max(0, overlayOpacity)) / 100;

  return (
    <WithScrollReveal
      animation={animation}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
    >
      <section
        id={blockId || undefined}
        className={cn("relative px-6 py-16", className)}
        style={{
          backgroundColor: backgroundColor || undefined,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: backgroundImage ? "cover" : undefined,
          backgroundPosition: backgroundImage ? "center" : undefined,
          backgroundAttachment: backgroundImage ? "fixed" : undefined,
          ...layoutStyle({
            marginTop,
            marginBottom,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
            offsetX,
            offsetY,
          }),
        }}
      >
        {backgroundImage && overlayAlpha > 0 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: overlayAlpha }}
            aria-hidden
          />
        ) : null}

        <div className={cn("relative z-10 mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
          {sectionTitle || sectionCtaLabel ? (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              {sectionTitle ? (
                <h2
                  className="font-theme-heading text-[clamp(32px,4vw,52px)] font-normal tracking-tight"
                  style={{ color: sectionHeaderColor || "#ffffff" }}
                >
                  {sectionTitle}
                </h2>
              ) : null}
              {sectionCtaLabel && sectionCtaUrl ? (
                <a
                  href={sectionCtaUrl}
                  className="text-sm font-medium uppercase tracking-wide hover:underline"
                  style={{ color: accentColor || sectionHeaderColor || "var(--theme-color-accent, #6FA84C)" }}
                >
                  {sectionCtaLabel} ↗
                </a>
              ) : null}
            </div>
          ) : null}

          {showFilters ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categoryList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
                      activeCategory === cat
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {showViewToggle && displayMode === "grid" ? (
                <div className="flex gap-1 rounded-lg border border-zinc-200 p-1" role="group" aria-label="View mode">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={viewMode === mode}
                      className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
                        viewMode === mode ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {displayMode === "carousel" ? (
            <div className={cn("relative", showFilters ? "mt-8" : "")}>
              <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-live="polite"
              >
                {filtered.map((item) => (
                  <div key={item.id} className="w-[min(340px,32vw)] shrink-0 snap-start sm:w-[min(360px,31%)]">
                    <FilterGridCard
                      item={item}
                      viewMode="grid"
                      cardStyle={cardStyle}
                      accentColor={accentColor}
                    />
                  </div>
                ))}
              </div>
              {filtered.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-1)}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-md"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(1)}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-md"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
          ) : (
            <div
              className={cn("grid gap-6 transition-all duration-300 ease-out", showFilters ? "mt-8" : "", gridClass)}
              aria-live="polite"
            >
              {filtered.length === 0 ? (
                <p className="col-span-full text-center text-zinc-500">No items match this filter.</p>
              ) : (
                filtered.map((item) => (
                  <FilterGridCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    cardStyle={cardStyle}
                    accentColor={accentColor}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </WithScrollReveal>
  );
}
