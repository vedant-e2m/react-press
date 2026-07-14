import type { MediaType } from "@nextpress/shared";
import { getVideoEmbedUrl } from "@nextpress/shared";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ResponsiveMediaProps = {
  desktopUrl?: string;
  mobileUrl?: string;
  alt?: string;
  mediaType?: MediaType;
  videoUrl?: string;
  className?: string;
  objectFit?: "cover" | "contain";
  lazy?: boolean;
};

/** Renders image, video, or embed with optional desktop/mobile art direction. */
export function ResponsiveMedia({
  desktopUrl,
  mobileUrl,
  alt = "",
  mediaType = "image",
  videoUrl,
  className,
  objectFit = "cover",
  lazy = true,
}: ResponsiveMediaProps) {
  const effectiveType = mediaType === "image" && videoUrl ? "youtube" : mediaType;
  const imageSrc = desktopUrl || mobileUrl;

  if (effectiveType === "youtube" || effectiveType === "vimeo" || effectiveType === "embed") {
    const embedUrl = getVideoEmbedUrl(videoUrl ?? desktopUrl ?? "");
    if (!embedUrl) {
      return (
        <div
          className={cn(
            "flex aspect-video items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400",
            className,
          )}
          role="img"
          aria-label="Video placeholder"
        >
          Add a video URL
        </div>
      );
    }
    return (
      <div className={cn("aspect-video overflow-hidden rounded-lg bg-zinc-100", className)}>
        <iframe
          src={embedUrl}
          title={alt || "Embedded video"}
          className="h-full w-full"
          loading={lazy ? "lazy" : undefined}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (effectiveType === "video") {
    const src = videoUrl ?? desktopUrl;
    if (!src) return null;
    return (
      <video
        className={cn("h-full w-full rounded-lg", className)}
        style={{ objectFit }}
        controls
        playsInline
        preload={lazy ? "metadata" : "auto"}
        aria-label={alt || "Video"}
      >
        <source src={src} />
      </video>
    );
  }

  if (!imageSrc) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400",
          className,
        )}
        role="img"
        aria-label="Image placeholder"
      >
        Add an image
      </div>
    );
  }

  if (mobileUrl && desktopUrl && mobileUrl !== desktopUrl) {
    return (
      <picture className={cn("block h-full w-full", className)}>
        <source media="(max-width: 767px)" srcSet={mobileUrl} />
        <source media="(min-width: 768px)" srcSet={desktopUrl} />
        <img
          src={desktopUrl}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          decoding="async"
          className="h-full w-full rounded-lg"
          style={{ objectFit }}
        />
      </picture>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading={lazy ? "lazy" : undefined}
      decoding="async"
      className={cn("h-full w-full rounded-lg", className)}
      style={{ objectFit }}
    />
  );
}
