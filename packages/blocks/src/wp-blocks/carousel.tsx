"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type LayoutProps, layoutStyle, maxWidthClass } from "../layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type CarouselSlide = {
  imageUrl?: string;
  mobileImageUrl?: string;
  alt?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
};

export type CarouselBlockProps = {
  slides: CarouselSlide[];
  autoplay?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  showArrows?: boolean;
  backgroundColor?: string;
} & LayoutProps;

/**
 * Swiper-style carousel block with keyboard navigation and reduced-motion support.
 */
export function CarouselBlock({
  slides,
  autoplay = false,
  intervalMs = 5000,
  showDots = true,
  showArrows = true,
  backgroundColor,
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
}: CarouselBlockProps) {
  const items = slides?.filter((s) => s.imageUrl || s.title) ?? [];
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      setActive(((index % items.length) + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!autoplay || reducedMotion || items.length <= 1) return;
    timerRef.current = setInterval(() => goTo(active + 1), intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, autoplay, goTo, intervalMs, items.length, reducedMotion]);

  if (items.length === 0) {
    return (
      <section className="px-6 py-12 text-center text-zinc-400">Add slides to the carousel</section>
    );
  }

  const slide = items[active];

  return (
    <section
      id={blockId || undefined}
      className={cn("px-6 py-10", className)}
      style={{
        backgroundColor: backgroundColor || undefined,
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
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <div className={cn("relative mx-auto overflow-hidden rounded-xl", maxWidthClass(maxWidth ?? "5xl"))}>
        <div
          className={cn(
            "relative aspect-[16/9] w-full bg-zinc-100",
            !reducedMotion && "transition-opacity duration-500 ease-out",
          )}
          aria-live="polite"
        >
          {slide.imageUrl && (
            <picture>
              {slide.mobileImageUrl && (
                <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl} />
              )}
              <img
                src={slide.imageUrl}
                alt={slide.alt ?? slide.title ?? ""}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          )}
          {(slide.title || slide.description) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              {slide.title && <h3 className="text-lg font-semibold">{slide.title}</h3>}
              {slide.description && <p className="mt-1 text-sm text-white/85">{slide.description}</p>}
              {slide.linkUrl && (
                <a
                  href={slide.linkUrl}
                  className="mt-3 inline-block text-sm font-medium underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Learn more
                </a>
              )}
            </div>
          )}
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}

        {showDots && items.length > 1 && (
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Carousel slides">
            {items.map((item, i) => (
              <button
                key={`${item.imageUrl}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
                  i === active ? "bg-zinc-900" : "bg-zinc-300",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
