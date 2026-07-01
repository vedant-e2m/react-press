import type { ReactNode } from "react";
import { renderEditable } from "./editable";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type HeroProps = {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  backgroundImage?: string;
  ctaText?: string | ReactNode;
  ctaUrl?: string;
  alignment: "left" | "center" | "right";
  textColor?: string;
  overlayColor?: string;
};

export function Hero({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaUrl,
  alignment,
  textColor,
  overlayColor,
}: HeroProps) {
  const overlay = overlayColor ?? "rgba(0,0,0,.5)";

  return (
    <section
      className="relative flex min-h-[420px] items-center bg-zinc-900 px-6 py-20 text-white"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: textColor || undefined,
            }
          : { color: textColor || undefined }
      }
    >
      <div
        className={cn(
          "mx-auto w-full max-w-5xl",
          alignment === "center" && "text-center",
          alignment === "right" && "text-right",
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{renderEditable(title)}</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-200">{renderEditable(subtitle)}</p>
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            {renderEditable(ctaText)}
          </a>
        )}
      </div>
    </section>
  );
}

export type TextProps = {
  content: string | ReactNode;
  alignment: "left" | "center" | "right";
  textColor?: string;
  backgroundColor?: string;
  fontSize?: "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg";
};

const textFontSizes = {
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-relaxed",
  xl: "text-2xl leading-snug font-medium",
};

const textPadding = {
  none: "py-0",
  sm: "py-4",
  md: "py-10",
  lg: "py-16",
};

export function Text({
  content,
  alignment,
  textColor,
  backgroundColor,
  fontSize = "md",
  padding = "md",
}: TextProps) {
  return (
    <div
      className={cn("mx-auto max-w-3xl px-6", textPadding[padding])}
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <div
        className={cn(
          "prose prose-zinc max-w-none whitespace-pre-wrap",
          textFontSizes[fontSize],
          alignment === "center" && "text-center",
          alignment === "right" && "text-right",
        )}
        style={{ color: textColor || undefined }}
      >
        {renderEditable(content)}
      </div>
    </div>
  );
}

export type ImageBlockProps = {
  src: string;
  alt: string;
  caption?: string;
  rounded: boolean;
};

export function ImageBlock({ src, alt, caption, rounded }: ImageBlockProps) {
  if (!src) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400">
          No image selected
        </div>
      </div>
    );
  }

  return (
    <figure className="mx-auto max-w-4xl px-6 py-8">
      <img
        src={src}
        alt={alt}
        className={cn("w-full", rounded && "rounded-xl")}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">{caption}</figcaption>
      )}
    </figure>
  );
}

function renderSlot(slot: ReactNode | (() => ReactNode) | undefined) {
  if (!slot) return null;
  if (typeof slot === "function") {
    return slot();
  }
  return slot;
}

export type ColumnsProps = {
  columns: "2" | "3" | "4";
  content?: ReactNode | (() => ReactNode);
};

export function Columns({ columns, content }: ColumnsProps) {
  const gridClass =
    columns === "2"
      ? "grid-cols-1 md:grid-cols-2"
      : columns === "3"
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className={cn("grid gap-6", gridClass)}>{renderSlot(content)}</div>
    </div>
  );
}

export type ButtonBlockProps = {
  label: string | ReactNode;
  url: string;
  variant: "primary" | "secondary" | "outline";
  alignment: "left" | "center" | "right";
  backgroundColor?: string;
  textColor?: string;
};

export function ButtonBlock({
  label,
  url,
  variant,
  alignment,
  backgroundColor,
  textColor,
}: ButtonBlockProps) {
  const variantClass =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : variant === "secondary"
        ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50";

  return (
    <div
      className={cn(
        "px-6 py-6",
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
      )}
    >
      <a
        href={url}
        className={cn(
          "inline-block rounded-lg px-6 py-3 text-sm font-semibold transition-colors",
          !backgroundColor && !textColor && variantClass,
        )}
        style={{
          backgroundColor: backgroundColor || undefined,
          color: textColor || undefined,
        }}
      >
        {renderEditable(label)}
      </a>
    </div>
  );
}

export type SpacerProps = {
  height: "sm" | "md" | "lg" | "xl";
};

const spacerHeights = { sm: "h-8", md: "h-16", lg: "h-24", xl: "h-32" };

export function Spacer({ height }: SpacerProps) {
  return <div className={spacerHeights[height]} aria-hidden="true" />;
}

export type DividerProps = {
  style: "solid" | "dashed";
};

export function Divider({ style }: DividerProps) {
  return (
    <div className="px-6 py-4">
      <hr className={cn("border-zinc-200", style === "dashed" && "border-dashed")} />
    </div>
  );
}

export type CardProps = {
  title: string | ReactNode;
  description: string | ReactNode;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  textColor?: string;
  backgroundColor?: string;
};

export function Card({
  title,
  description,
  imageUrl,
  linkUrl,
  linkText,
  textColor,
  backgroundColor,
}: CardProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      {imageUrl && (
        <img src={imageUrl} alt="" className="h-48 w-full object-cover" />
      )}
      <div className="p-6" style={{ color: textColor || undefined }}>
        <h3 className="text-lg font-semibold">{renderEditable(title)}</h3>
        <p className="mt-2 text-sm opacity-80">{renderEditable(description)}</p>
        {linkUrl && linkText && (
          <a href={linkUrl} className="mt-4 inline-block text-sm font-medium text-blue-600">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
}

export type GalleryProps = {
  images: { src: string; alt: string }[];
  columns: "2" | "3" | "4";
};

export function Gallery({ images, columns }: GalleryProps) {
  const gridClass =
    columns === "2"
      ? "grid-cols-2"
      : columns === "3"
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-4";

  const items = images?.filter((img) => img.src) ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-400">
          Add images to the gallery
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className={cn("grid gap-4", gridClass)}>
        {items.map((image, index) => (
          <img
            key={`${image.src}-${index}`}
            src={image.src}
            alt={image.alt}
            className="aspect-square w-full rounded-lg object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export type VideoProps = {
  url: string;
  caption?: string;
};

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/,
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  if (url.includes("embed") || url.endsWith(".mp4")) return url;
  return null;
}

export function Video({ url, caption }: VideoProps) {
  const embedUrl = getEmbedUrl(url);

  return (
    <figure className="mx-auto max-w-4xl px-6 py-8">
      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-zinc-100">
          <iframe
            src={embedUrl}
            title={caption ?? "Video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-400">
          Enter a YouTube, Vimeo, or embed URL
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">{caption}</figcaption>
      )}
    </figure>
  );
}
