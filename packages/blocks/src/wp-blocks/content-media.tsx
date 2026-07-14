import type { ReactNode } from "react";
import { renderEditable } from "../editable";
import { type LayoutProps, layoutStyle, maxWidthClass } from "../layout";
import { ResponsiveMedia } from "./responsive-media";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ContentMediaProps = {
  title?: ReactNode;
  content?: ReactNode;
  ctaLabel?: ReactNode;
  ctaUrl?: string;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  mediaPosition?: "left" | "right";
  mediaType?: "image" | "video" | "youtube" | "vimeo";
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  mediaAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  paddingY?: "sm" | "md" | "lg";
} & LayoutProps;

const paddingMap = { sm: "py-10", md: "py-16", lg: "py-24" };

/**
 * Two-column content block — text alongside image or video.
 */
export function ContentMedia({
  title,
  content,
  ctaLabel,
  ctaUrl,
  ctaBackgroundColor,
  ctaTextColor,
  mediaPosition = "right",
  mediaType,
  desktopImageUrl,
  mobileImageUrl,
  videoUrl,
  mediaAlt = "",
  backgroundColor,
  textColor,
  paddingY = "md",
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
}: ContentMediaProps) {
  const media = desktopImageUrl || mobileImageUrl || videoUrl ? (
    <div className="relative min-h-[240px] w-full overflow-hidden">
      <ResponsiveMedia
        desktopUrl={desktopImageUrl}
        mobileUrl={mobileImageUrl}
        alt={mediaAlt}
        mediaType={mediaType ?? "image"}
        videoUrl={videoUrl}
        objectFit="cover"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  ) : null;

  const text = (
    <div className="flex flex-col justify-center">
      {title && (
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {renderEditable(title)}
        </h2>
      )}
      {content && (
        <div className="mt-4 text-base leading-relaxed opacity-90">{renderEditable(content)}</div>
      )}
      {ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          className="mt-6 inline-flex w-fit items-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          style={{
            backgroundColor: ctaBackgroundColor || "#18181B",
            color: ctaTextColor || "#FFFFFF",
          }}
        >
          {renderEditable(ctaLabel)}
        </a>
      )}
    </div>
  );

  return (
    <section
      id={blockId || undefined}
      className={cn("px-6", paddingMap[paddingY], className)}
      style={{
        backgroundColor: backgroundColor || undefined,
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
      }}
    >
      <div className={cn("mx-auto grid items-center gap-10 lg:grid-cols-2", maxWidthClass(maxWidth ?? "6xl"))}>
        {mediaPosition === "left" ? (
          <>
            {media}
            {text}
          </>
        ) : (
          <>
            {text}
            {media}
          </>
        )}
      </div>
    </section>
  );
}
