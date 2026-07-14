import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildDesignImportResult } from "./map-to-core-blocks";
import { getDesignExportFiles, parseDesignExportZip } from "./parse-design-export";

export type ImportDesignOptions = {
  title: string;
  slug: string;
  assetOutputDir?: string;
  assetPublicPrefix?: string;
};

export function writeDesignAssets(
  buffer: Uint8Array,
  outputDir: string,
  publicPrefix: string,
  slug: string,
) {
  const files = getDesignExportFiles(buffer);
  mkdirSync(outputDir, { recursive: true });

  for (const [rawPath, bytes] of Object.entries(files)) {
    if (!rawPath.toLowerCase().endsWith(".png")) continue;
    const normalized = rawPath.replace(/^\/+/, "").replace(/\\/g, "/");
    const parts = normalized.split("/").slice(1);
    const dest = join(outputDir, ...parts);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, bytes);
  }

  return parseDesignExportZip(buffer, publicPrefix, slug);
}

export function importDesignBuffer(buffer: Uint8Array, options: ImportDesignOptions) {
  const publicPrefix = options.assetPublicPrefix ?? "/imported/design";
  const assetPrefix = `${publicPrefix}/${options.slug}`;

  const parseResult = options.assetOutputDir
    ? writeDesignAssets(buffer, options.assetOutputDir, publicPrefix, options.slug)
    : parseDesignExportZip(buffer, assetPrefix, options.slug);

  return buildDesignImportResult(parseResult, {
    title: options.title,
    slug: options.slug,
  });
}

export function importDesignFile(filePath: string, options: ImportDesignOptions) {
  const buffer = readFileSync(filePath);
  return importDesignBuffer(new Uint8Array(buffer), options);
}

export function writeDesignSeedFile(
  result: ReturnType<typeof importDesignBuffer>,
  seedFilePath: string,
  exportName: string,
  slug: string,
) {
  const seed = `/** Auto-generated from design export import (core blocks only) */\nexport const ${exportName} = ${JSON.stringify(
    {
      title: result.parseResult.documentName,
      slug,
      status: "published" as const,
      seoTitle: `${result.parseResult.documentName} — Core blocks prototype`,
      seoDescription: "Dashboard prototype built from imported design kit using core NextPress blocks.",
      puckData: result.puckData,
    },
    null,
    2,
  )};\n`;

  mkdirSync(dirname(seedFilePath), { recursive: true });
  writeFileSync(seedFilePath, seed);
}
