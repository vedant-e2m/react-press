export type MediaType = "image" | "video" | "youtube" | "vimeo" | "embed";

export type ResponsiveMediaSource = {
  desktopUrl?: string;
  mobileUrl?: string;
  alt?: string;
  mediaType?: MediaType;
  videoUrl?: string;
};

/** Extracts a YouTube or Vimeo embed URL from common share link formats. */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/,
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  if (url.includes("embed") || url.endsWith(".mp4") || url.endsWith(".webm")) return url;
  return null;
}

/** Builds a srcSet string from named format URLs (thumbnail, small, medium, large). */
export function buildResponsiveSrcSet(
  formats?: Record<string, { url: string; width?: number | null }> | null,
): string | undefined {
  if (!formats) return undefined;
  const widthMap: Record<string, number> = {
    thumbnail: 150,
    small: 500,
    medium: 750,
    large: 1200,
  };
  const parts = Object.entries(formats)
    .filter(([, value]) => value?.url)
    .map(([key, value]) => `${value.url} ${value.width ?? widthMap[key] ?? 1200}w`);
  return parts.length > 0 ? parts.join(", ") : undefined;
}
