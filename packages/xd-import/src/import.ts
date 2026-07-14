import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildXdImportResult } from "./map-to-puck";
import { getXdFiles, MIME_EXT, parseXdArchive } from "./parse-xd";

export type WriteAssetsOptions = {
  buffer: Uint8Array;
  outputDir: string;
  publicPrefix: string;
  slug: string;
};

export function writeXdAssets({ buffer, outputDir, publicPrefix, slug }: WriteAssetsOptions) {
  const files = getXdFiles(buffer);
  const prefix = publicPrefix.endsWith("/") ? publicPrefix.slice(0, -1) : publicPrefix;
  const assetPrefix = `${prefix}/${slug}`;
  const parsed = parseXdArchive(buffer, assetPrefix);

  mkdirSync(outputDir, { recursive: true });

  for (const [uid, asset] of Object.entries(parsed.assets)) {
    const ext = MIME_EXT[asset.mime] ?? "bin";
    const bytes = files[asset.path];
    if (!bytes) continue;
    writeFileSync(join(outputDir, `${uid}.${ext}`), bytes);
  }

  if (files["preview.png"]) {
    writeFileSync(join(outputDir, "preview.png"), files["preview.png"]);
  }

  if (files["thumbnail.png"]) {
    writeFileSync(join(outputDir, "thumbnail.png"), files["thumbnail.png"]);
  }

  return parsed;
}

export function importXdBuffer(
  buffer: Uint8Array,
  options: {
    title: string;
    slug: string;
    assetOutputDir?: string;
    assetPublicPrefix?: string;
    artboardNames?: string[];
  },
) {
  const publicPrefix = options.assetPublicPrefix ?? "/imported/xd";
  let parseResult = parseXdArchive(buffer, `${publicPrefix}/${options.slug}`);

  if (options.assetOutputDir) {
    parseResult = writeXdAssets({
      buffer,
      outputDir: options.assetOutputDir,
      publicPrefix,
      slug: options.slug,
    });
  }

  return buildXdImportResult(parseResult, {
    title: options.title,
    slug: options.slug,
    artboardNames: options.artboardNames,
    assetPublicPrefix: publicPrefix,
  });
}

export function importXdFile(filePath: string, options: Parameters<typeof importXdBuffer>[1]) {
  const buffer = readFileSync(filePath);
  return importXdBuffer(new Uint8Array(buffer), options);
}

export function writeImportArtifacts(
  result: ReturnType<typeof importXdBuffer>,
  seedFilePath: string,
  options: {
    exportName: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
  },
) {
  const seed = `/** Auto-generated from Adobe XD import */\nexport const ${options.exportName} = ${JSON.stringify(
    {
      title: result.parseResult.documentName,
      slug: options.slug,
      status: "published" as const,
      seoTitle: options.seoTitle ?? `${result.parseResult.documentName} — Imported from Adobe XD`,
      seoDescription:
        options.seoDescription ?? `Prototype imported from ${result.parseResult.documentName}.xd`,
      puckData: result.puckData,
    },
    null,
    2,
  )};\n`;

  mkdirSync(dirname(seedFilePath), { recursive: true });
  writeFileSync(seedFilePath, seed);
}
