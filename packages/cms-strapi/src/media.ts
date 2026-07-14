import type { ContentMedia, UpdateMediaInput } from "@nextpress/cms-core";
import { strapiDeleteMedia, strapiListMedia, strapiUpdateMedia, strapiUpload } from "@nextpress/strapi-client";
import { mapStrapiMedia } from "./media-helpers";

export async function listMedia(
  options: { search?: string; limit?: number } = {},
  token?: string,
): Promise<ContentMedia[]> {
  const params: Record<string, string> = {
    "pagination[pageSize]": String(options.limit ?? 100),
  };
  if (options.search) {
    params["filters[name][$containsi]"] = options.search;
  }
  const files = await strapiListMedia(params, token);
  return files.map(mapStrapiMedia);
}

export async function uploadMedia(
  file: Blob,
  filename: string,
  token: string,
): Promise<ContentMedia> {
  const uploaded = await strapiUpload(file, filename, token);
  const first = uploaded[0];
  if (!first) throw new Error("Upload returned no files");
  return mapStrapiMedia(first);
}

export async function updateMedia(
  id: string,
  input: UpdateMediaInput,
  token: string,
): Promise<ContentMedia> {
  const updated = await strapiUpdateMedia(
    id,
    {
      alternativeText: input.alt ?? undefined,
      caption: input.caption ?? undefined,
    },
    token,
  );
  return mapStrapiMedia(updated);
}

export async function deleteMedia(id: string, token: string): Promise<void> {
  await strapiDeleteMedia(id, token);
}
