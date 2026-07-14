import type { ReactNode } from "react";
import { renderEditable } from "./editable";
import { type LayoutProps, layoutStyle, maxWidthClass } from "./layout";
import { WithScrollReveal } from "./motion/with-scroll-reveal";
import {
  elementTextStyleCss,
  pickElementTextStyle,
  type PrefixTextStyleProps,
} from "./element-styles";
import { NavBar, type NavBarLink, type NavBarProps } from "./nav-bar";
import { Section, type SectionProps } from "./section";

export { NavBar, type NavBarLink, type NavBarProps };
export { Section, type SectionProps };

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type HeroProps = {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  backgroundImage?: string;
  alignment: "left" | "center" | "right";
  textColor?: string;
  overlayColor?: string;
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"subtitle"> &
  LayoutProps;

export function Hero({
  title,
  subtitle,
  backgroundImage,
  alignment,
  textColor,
  overlayColor,
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
  ...styleProps
}: HeroProps) {
  const props = styleProps as Record<string, unknown>;
  const titleStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "title"),
    color: pickElementTextStyle(props, "title").color ?? textColor,
  });
  const subtitleStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "subtitle"),
    color: pickElementTextStyle(props, "subtitle").color ?? undefined,
  });
  const overlay = overlayColor ?? "rgba(0,0,0,.5)";

  return (
    <section
      className={cn(
        "relative flex min-h-[420px] items-center bg-zinc-900 px-6 py-20 text-white",
        className,
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: textColor || undefined,
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
            }
          : {
              color: textColor || undefined,
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
            }
      }
    >
      <div
        className={cn(
          "mx-auto w-full",
          maxWidthClass(maxWidth ?? "5xl"),
          alignment === "center" && "text-center",
          alignment === "right" && "text-right",
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={titleStyle}>
          {renderEditable(title)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-200" style={subtitleStyle}>
          {renderEditable(subtitle)}
        </p>
      </div>
    </section>
  );
}

export type HeroBannerProps = {
  videoUrl?: string;
  title: string | ReactNode;
  titleHighlight?: string | ReactNode;
  titleSuffix?: string | ReactNode;
  subtitle: string | ReactNode;
  highlightColor?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  minHeight?: "sm" | "md" | "lg" | "screen";
  showScrollIndicator?: boolean;
  contentAlign?: "left" | "center" | "right";
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"titleHighlight"> &
  PrefixTextStyleProps<"titleSuffix"> &
  PrefixTextStyleProps<"subtitle"> &
  LayoutProps;

const heroMinHeights = {
  sm: "min-h-[50vh]",
  md: "min-h-[78vh]",
  lg: "min-h-[90vh]",
  screen: "min-h-screen",
};

export function HeroBanner({
  videoUrl,
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  highlightColor,
  overlayOpacity = 55,
  overlayColor = "rgba(0,0,0,1)",
  minHeight = "md",
  showScrollIndicator = false,
  contentAlign = "center",
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
  borderRadius,
  borderWidth,
  borderColor,
  ...styleProps
}: HeroBannerProps) {
  const props = styleProps as Record<string, unknown>;
  const titleStyle = elementTextStyleCss(pickElementTextStyle(props, "title"));
  const titleHighlightStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "titleHighlight"),
    color: pickElementTextStyle(props, "titleHighlight").color ?? highlightColor,
  });
  const titleSuffixStyle = elementTextStyleCss(pickElementTextStyle(props, "titleSuffix"));
  const subtitleStyle = elementTextStyleCss(pickElementTextStyle(props, "subtitle"));
  const overlay = Math.min(90, Math.max(0, overlayOpacity)) / 100;
  const alignClass =
    contentAlign === "left" ? "text-left" : contentAlign === "right" ? "text-right" : "text-center";

  return (
    <section
      id={blockId || undefined}
      className={cn(
        "relative flex items-center overflow-hidden bg-black text-white",
        heroMinHeights[minHeight],
        className,
      )}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
        borderRadius,
        borderWidth,
        borderColor,
      })}
    >
      {videoUrl && (
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, opacity: overlay }}
      />
      <div
        className={cn(
          "relative z-10 mx-auto w-full px-6 py-20",
          alignClass,
          maxWidthClass(maxWidth ?? "6xl"),
        )}
      >
        <h1
          className={cn(
            "font-theme-heading max-w-4xl text-[clamp(36px,5.5vw,75px)] font-normal leading-[1.15] tracking-tight text-white",
            contentAlign === "center" && "mx-auto",
            contentAlign === "right" && "ml-auto",
          )}
        >
          <span style={titleStyle}>{renderEditable(title)}</span>
          {titleHighlight ? (
            <span style={titleHighlightStyle}> {renderEditable(titleHighlight)}</span>
          ) : null}
          {titleSuffix ? (
            <span style={titleSuffixStyle}> {renderEditable(titleSuffix)}</span>
          ) : null}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "mt-5 max-w-3xl text-[clamp(16px,2vw,20px)] font-light leading-relaxed text-white/90",
              contentAlign === "center" && "mx-auto",
              contentAlign === "right" && "ml-auto",
            )}
            style={subtitleStyle}
          >
            {renderEditable(subtitle)}
          </p>
        ) : null}
      </div>
      {showScrollIndicator ? (
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      ) : null}
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
  embedded?: boolean;
} & PrefixTextStyleProps<"content"> &
  LayoutProps;

const textFontSizes = {
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-relaxed",
  xl: "font-theme-heading text-[clamp(24px,3.5vw,44px)] leading-snug font-normal",
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
  embedded = false,
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
  ...styleProps
}: TextProps) {
  const props = styleProps as Record<string, unknown>;
  const contentStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "content"),
    color: pickElementTextStyle(props, "content").color ?? textColor,
    align: pickElementTextStyle(props, "content").align ?? alignment,
  });

  return (
    <div
      className={cn(
        embedded ? "w-full" : "mx-auto px-6",
        !embedded && maxWidthClass(maxWidth ?? "3xl"),
        embedded ? (padding === "none" ? "py-0" : textPadding[padding]) : textPadding[padding],
        className,
      )}
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
    >
      <div
        className={cn(
          "prose prose-zinc max-w-none",
          embedded ? "whitespace-normal" : "whitespace-pre-wrap",
          textFontSizes[fontSize],
          alignment === "center" && "text-center",
          alignment === "right" && "text-right",
        )}
        style={{
          ...contentStyle,
          ...(contentStyle.color ? {} : { color: textColor || undefined }),
        }}
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
  description?: string;
  rounded: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none";
  srcSet?: string;
  embedded?: boolean;
  alignment?: "left" | "center" | "right";
} & LayoutProps;

function buildSrcSet(formats?: Record<string, { url: string }> | null, fallback?: string): string | undefined {
  if (!formats) return undefined;
  const parts = Object.values(formats)
    .filter((f) => f?.url)
    .map((f) => `${f.url} ${f.url.includes("thumbnail") ? "150w" : f.url.includes("small") ? "500w" : f.url.includes("medium") ? "750w" : "1200w"}`);
  return parts.length > 0 ? parts.join(", ") : fallback;
}

export function ImageBlock({
  src,
  alt,
  caption,
  description,
  rounded,
  objectFit = "cover",
  srcSet,
  embedded = false,
  alignment = "left",
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
}: ImageBlockProps) {
  if (!src) {
    return (
      <div
        className={cn("mx-auto px-6 py-8", maxWidthClass(maxWidth ?? "4xl"), className)}
        style={layoutStyle({
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          offsetX,
          offsetY,
        })}
      >
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400">
          No image selected
        </div>
      </div>
    );
  }

  return (
    <figure
      className={cn(
        embedded ? "w-full py-4" : "mx-auto px-6 py-8",
        !embedded && maxWidthClass(maxWidth ?? "4xl"),
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        className,
      )}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
        className={cn("w-full", !embedded && "w-full", rounded && "rounded-xl", embedded && "mx-auto max-w-[220px]")}
        style={{ objectFit }}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">{caption}</figcaption>
      )}
      {description && (
        <p className="mt-1 text-center text-xs text-zinc-400">{description}</p>
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
  columns: "1" | "2" | "3" | "4";
  content?: ReactNode | (() => ReactNode);
} & LayoutProps;

export function Columns({
  columns,
  content,
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
}: ColumnsProps) {
  const gridClass =
    columns === "2"
      ? "grid-cols-1 md:grid-cols-2"
      : columns === "3"
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  const isStack = columns === "1";

  return (
    <div
      className={cn("mx-auto px-6 py-10", maxWidthClass(maxWidth ?? "6xl"), className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <div
        className={cn(
          isStack
            ? "flex w-full flex-col items-center gap-3 [&>div]:contents"
            : cn("grid w-full items-stretch gap-8 [&>div]:contents", gridClass),
        )}
      >
        {renderSlot(content)}
      </div>
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
} & PrefixTextStyleProps<"label"> &
  LayoutProps;

export function ButtonBlock({
  label,
  url,
  variant,
  alignment,
  backgroundColor,
  textColor,
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
  ...styleProps
}: ButtonBlockProps) {
  const props = styleProps as Record<string, unknown>;
  const labelStyle = elementTextStyleCss(pickElementTextStyle(props, "label"));
  const variantClass =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : variant === "secondary"
        ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50";

  return (
    <div
      className={cn(
        "mx-auto px-6 py-6",
        maxWidthClass(maxWidth ?? "6xl"),
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        className,
      )}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <a
        href={url}
        className={cn(
          "inline-block rounded-lg px-6 py-3 text-sm font-semibold transition-colors",
          !backgroundColor && !textColor && variantClass,
        )}
        style={{
          backgroundColor: backgroundColor || undefined,
          color: textColor || labelStyle.color || undefined,
          ...labelStyle,
        }}
      >
        {renderEditable(label)}
      </a>
    </div>
  );
}

export type SpacerProps = {
  height: "sm" | "md" | "lg" | "xl";
} & LayoutProps;

const spacerHeights = { sm: "h-8", md: "h-16", lg: "h-24", xl: "h-32" };

export function Spacer({
  height,
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
}: SpacerProps) {
  return (
    <div
      className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"), spacerHeights[height], className)}
      aria-hidden="true"
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    />
  );
}

export type DividerProps = {
  style: "solid" | "dashed";
} & LayoutProps;

export function Divider({
  style,
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
}: DividerProps) {
  return (
    <div
      className={cn("mx-auto px-6 py-4", maxWidthClass(maxWidth ?? "6xl"), className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
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
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"description"> &
  LayoutProps;

export function Card({
  title,
  description,
  imageUrl,
  linkUrl,
  linkText,
  textColor,
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
  borderRadius,
  borderWidth,
  borderColor,
  ...styleProps
}: CardProps) {
  const props = styleProps as Record<string, unknown>;
  const titlePick = pickElementTextStyle(props, "title");
  const descriptionPick = pickElementTextStyle(props, "description");
  const titleStyle = elementTextStyleCss({
    ...titlePick,
    color: titlePick.color ?? textColor,
  });
  const descriptionStyle = elementTextStyleCss({
    ...descriptionPick,
    color: descriptionPick.color ?? textColor,
  });
  return (
    <div
      className={cn(
        "mx-auto overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm",
        maxWidthClass(maxWidth ?? "4xl"),
        className,
      )}
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
          borderRadius,
          borderWidth,
          borderColor,
        }),
      }}
    >
      {imageUrl && (
        <img src={imageUrl} alt="" className="h-48 w-full object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold" style={titleStyle}>
          {renderEditable(title)}
        </h3>
        <p className="mt-2 text-sm opacity-80" style={descriptionStyle}>
          {renderEditable(description)}
        </p>
        {linkUrl && linkText && (
          <a href={linkUrl} className="mt-4 inline-block text-sm font-medium text-blue-600">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
}

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  linkUrl?: string;
  rotation?: number;
};

export type GalleryProps = {
  images: GalleryImage[];
  columns: "2" | "3" | "4";
  layout?: "grid" | "masonry" | "scatter";
  captionStyle?: "none" | "below" | "overlay";
  captionFont?: "body" | "accent";
  frameStyle?: "none" | "polaroid";
  centerBadgeUrl?: string;
  centerBadgeAlt?: string;
  scatterDensity?: "normal" | "tight";
  bleed?: boolean;
  backgroundColor?: string;
} & LayoutProps;

const SCATTER_OFFSETS = [
  { x: -28, y: 18, rotate: -9, z: 2 },
  { x: 42, y: -8, rotate: 6, z: 4 },
  { x: -18, y: 36, rotate: 5, z: 3 },
  { x: 24, y: 28, rotate: -6, z: 5 },
  { x: -36, y: -22, rotate: 8, z: 1 },
  { x: 52, y: 12, rotate: -4, z: 6 },
  { x: -8, y: 48, rotate: 7, z: 2 },
  { x: 64, y: -18, rotate: -5, z: 3 },
];

const TIGHT_SCATTER_LAYOUT = [
  { left: "4%", top: "8%", width: "26%", rotate: -8, z: 2 },
  { left: "30%", top: "0%", width: "28%", rotate: 5, z: 4 },
  { left: "58%", top: "6%", width: "24%", rotate: -4, z: 3 },
  { left: "12%", top: "38%", width: "25%", rotate: 6, z: 5 },
  { left: "42%", top: "34%", width: "27%", rotate: -7, z: 6 },
  { left: "68%", top: "40%", width: "24%", rotate: 4, z: 2 },
  { left: "22%", top: "62%", width: "26%", rotate: -5, z: 3 },
  { left: "52%", top: "58%", width: "28%", rotate: 8, z: 4 },
];

function GalleryImageCell({
  image,
  captionStyle,
  captionFont,
  scatterIndex,
  layout,
  frameStyle = "none",
}: {
  image: GalleryImage;
  captionStyle: GalleryProps["captionStyle"];
  captionFont: GalleryProps["captionFont"];
  scatterIndex?: number;
  layout: NonNullable<GalleryProps["layout"]>;
  frameStyle?: GalleryProps["frameStyle"];
}) {
  const caption = image.caption || image.alt;
  const offset = scatterIndex !== undefined ? SCATTER_OFFSETS[scatterIndex % SCATTER_OFFSETS.length] : null;
  const rotation = image.rotation ?? offset?.rotate ?? 0;
  const captionClass =
    captionFont === "accent" ? "font-theme-accent text-xl text-[#494747]" : "text-sm text-zinc-600";
  const polaroid = frameStyle === "polaroid";

  const imgEl = (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className={cn(
        "w-full object-cover shadow-lg",
        layout === "grid" && "aspect-square rounded-lg",
        layout === "masonry" && "rounded-lg",
        layout === "scatter" && !polaroid && "rounded-sm",
        polaroid && "aspect-[4/5]",
      )}
    />
  );

  const figureContent = polaroid ? (
  <>
    <div className="bg-white p-3 pb-8 shadow-xl">
      {imgEl}
      {captionStyle === "below" && caption ? (
        <figcaption className={cn("mt-3 text-center", captionClass)}>{caption}</figcaption>
      ) : null}
    </div>
  </>
  ) : (
    <>
      <div className="relative overflow-hidden rounded-lg">
        {imgEl}
        {captionStyle === "overlay" && caption ? (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-4 text-sm text-white">
            {caption}
          </figcaption>
        ) : null}
      </div>
      {captionStyle === "below" && caption ? (
        <figcaption className={cn("mt-2 text-center", captionClass)}>{caption}</figcaption>
      ) : null}
    </>
  );

  const style =
    layout === "scatter" && offset
      ? {
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
          zIndex: offset.z,
        }
      : image.rotation
        ? { transform: `rotate(${rotation}deg)` }
        : undefined;

  const inner = image.linkUrl ? (
    <a href={image.linkUrl} className="block transition-transform hover:scale-[1.02]">
      {figureContent}
    </a>
  ) : (
    figureContent
  );

  return (
    <figure style={style} className={layout === "scatter" ? "relative" : undefined}>
      {inner}
    </figure>
  );
}

export function Gallery({
  images,
  columns,
  layout = "grid",
  captionStyle = "none",
  captionFont = "body",
  frameStyle = "none",
  centerBadgeUrl,
  centerBadgeAlt = "",
  scatterDensity = "normal",
  bleed = false,
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
  animation,
  animationDelay,
  animationDuration,
}: GalleryProps) {
  const gridClass =
    columns === "2"
      ? "grid-cols-2"
      : columns === "3"
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-4";

  const items = images?.filter((img) => img.src) ?? [];

  if (items.length === 0) {
    return (
      <div
        className={cn("mx-auto px-6 py-8", maxWidthClass(maxWidth ?? "5xl"), className)}
        style={layoutStyle({
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          offsetX,
          offsetY,
        })}
      >
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-400">
          Add images to the gallery
        </div>
      </div>
    );
  }

  return (
    <WithScrollReveal
      animation={animation}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
    >
      <div
        className={cn(
          "mx-auto px-6 py-8",
          bleed && "max-w-none overflow-x-hidden px-0",
          !bleed && maxWidthClass(maxWidth ?? "5xl"),
          className,
        )}
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
      >
        {layout === "masonry" ? (
          <div className={cn("columns-2 gap-4 md:columns-3", columns === "4" && "lg:columns-4")}>
            {items.map((image, index) => (
              <div key={`${image.src}-${index}`} className="mb-4 break-inside-avoid">
                <GalleryImageCell
                  image={image}
                  captionStyle={captionStyle}
                  captionFont={captionFont}
                  frameStyle={frameStyle}
                  layout="masonry"
                />
              </div>
            ))}
          </div>
        ) : layout === "scatter" && scatterDensity === "tight" ? (
          <div className={cn("relative mx-auto", bleed ? "min-h-[520px] w-full max-w-6xl" : "min-h-[480px] max-w-5xl")}>
            {items.map((image, index) => {
              const pos = TIGHT_SCATTER_LAYOUT[index % TIGHT_SCATTER_LAYOUT.length];
              return (
                <div
                  key={`${image.src}-${index}`}
                  className="absolute"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: pos.width,
                    zIndex: pos.z,
                    transform: `rotate(${image.rotation ?? pos.rotate}deg)`,
                  }}
                >
                  <GalleryImageCell
                    image={image}
                    captionStyle={captionStyle}
                    captionFont={captionFont}
                    frameStyle={frameStyle}
                    layout="scatter"
                  />
                </div>
              );
            })}
            {centerBadgeUrl ? (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <img src={centerBadgeUrl} alt={centerBadgeAlt} className="h-28 w-28 object-contain drop-shadow-lg md:h-36 md:w-36" />
              </div>
            ) : null}
          </div>
        ) : layout === "scatter" ? (
          <div className="relative mx-auto min-h-[420px] max-w-4xl">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {items.map((image, index) => (
                <GalleryImageCell
                  key={`${image.src}-${index}`}
                  image={image}
                  captionStyle={captionStyle}
                  captionFont={captionFont}
                  frameStyle={frameStyle}
                  scatterIndex={index}
                  layout="scatter"
                />
              ))}
            </div>
            {centerBadgeUrl ? (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <img src={centerBadgeUrl} alt={centerBadgeAlt} className="h-24 w-24 object-contain md:h-32 md:w-32" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className={cn("grid gap-4", gridClass)}>
            {items.map((image, index) => (
              <GalleryImageCell
                key={`${image.src}-${index}`}
                image={image}
                captionStyle={captionStyle}
                captionFont={captionFont}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>
    </WithScrollReveal>
  );
}

export type VideoProps = {
  url: string;
  caption?: string;
} & LayoutProps;

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


export function Video({
  url,
  caption,
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
}: VideoProps) {
  const embedUrl = getEmbedUrl(url);

  return (
    <figure
      className={cn("mx-auto px-6 py-8", maxWidthClass(maxWidth ?? "4xl"), className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
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

export * from "./sections";
export * from "./content-blocks";
export * from "./layout";
export * from "./wp-blocks";
export { InfoCard, type InfoCardProps } from "./info-card";
export { ScrollReveal, type ScrollRevealProps } from "./motion/scroll-reveal";
export { WithScrollReveal } from "./motion/with-scroll-reveal";
export type { ScrollAnimation } from "./layout";
export { XdImportedScreen, type XdImportedScreenProps } from "./xd-screen";
export {
  XdText,
  XdImage,
  XdRect,
  XdEllipse,
  XdLine,
  XdPath,
  type XdTextProps,
  type XdImageProps,
  type XdRectProps,
  type XdEllipseProps,
  type XdLineProps,
  type XdPathProps,
} from "./xd-puck";