import { resolveCdnUrl } from "@nextpress/shared";
import type { ContentMedia, MediaFormat } from "@nextpress/cms-core";
import type { StrapiUploadFile } from "@nextpress/strapi-client";
import { getStrapiUrl } from "@nextpress/strapi-client";

let cachedCdnUrl: string | null | undefined;

function getCdnBase(): string | null {
  if (cachedCdnUrl !== undefined) return cachedCdnUrl;
  cachedCdnUrl = process.env.CDN_URL ?? process.env.NEXT_PUBLIC_CDN_URL ?? null;
  return cachedCdnUrl;
}

export function resolveMediaUrl(url: string, cdnOverride?: string | null): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return resolveCdnUrl(url, cdnOverride ?? getCdnBase());
  }
  const base = getStrapiUrl().replace(/\/$/, "");
  const absolute = `${base}${url.startsWith("/") ? url : `/${url}`}`;
  return resolveCdnUrl(absolute, cdnOverride ?? getCdnBase());
}

function mapFormats(
  formats: StrapiUploadFile["formats"],
): Record<string, MediaFormat> | null {
  if (!formats) return null;
  const result: Record<string, MediaFormat> = {};
  for (const [key, value] of Object.entries(formats)) {
    if (!value?.url) continue;
    result[key] = {
      url: resolveMediaUrl(value.url),
      width: value.width ?? null,
      height: value.height ?? null,
      size: value.size ?? null,
    };
  }
  return Object.keys(result).length > 0 ? result : null;
}

export function mapStrapiMedia(file: StrapiUploadFile): ContentMedia {
  return {
    id: file.documentId,
    url: resolveMediaUrl(file.url),
    name: file.name,
    mimeType: file.mime,
    width: file.width ?? null,
    height: file.height ?? null,
    size: file.size ?? null,
    alt: file.alternativeText ?? null,
    caption: file.caption ?? null,
    formats: mapFormats(file.formats),
    createdAt: file.createdAt,
  };
}
