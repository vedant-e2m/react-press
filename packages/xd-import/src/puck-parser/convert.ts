import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PuckData } from "@nextpress/shared";
import { XdFile } from "./xd-file";
import { normalizeArtboard } from "./normalize";
import { extractAssets } from "./assets";
import { artboardToPuckData } from "./to-puck";

export type XdPuckPage = {
  slug: string;
  name: string;
  bounds: { x: number; y: number; width: number; height: number };
  nodeCount: number;
  puckData: PuckData;
  filePath?: string;
};

export type ConvertXdToPuckOptions = {
  outDir?: string;
  assetPublicPrefix?: string;
  artboardNames?: string[];
};

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "untitled"
  );
}

export function convertXdToPuck(buffer: Uint8Array, options: ConvertXdToPuckOptions = {}) {
  const xd = XdFile.fromBuffer(buffer);
  let artboards = xd.listArtboards();

  if (options.artboardNames?.length) {
    const wanted = new Set(options.artboardNames.map((n) => n.trim()));
    artboards = artboards.filter((board) => wanted.has(board.name.trim()) || wanted.has(board.name));
  }

  const outDir = options.outDir;
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    mkdirSync(join(outDir, "pages"), { recursive: true });
  }

  const assetPublicPrefix = options.assetPublicPrefix ?? "/imported/xd/import";
  const pages: XdPuckPage[] = [];
  const usedSlugs = new Set<string>();

  for (const artboard of artboards) {
    const graphicContent = xd.getArtboardGraphics(artboard.path);
    if (!graphicContent) continue;

    const nodes = normalizeArtboard(graphicContent, artboard.bounds);
    const uids = [...new Set(nodes.filter((n) => n.kind === "image" && n.image?.uid).map((n) => n.image!.uid))];

    const uidToAssetPath =
      outDir && uids.length > 0
        ? extractAssets({
            xdFile: xd,
            uids,
            outputDir: outDir,
            publicUrlPrefix: assetPublicPrefix,
          })
        : {};

    const puckData = artboardToPuckData(artboard, nodes, uidToAssetPath);

    let slug = slugify(artboard.name);
    let i = 2;
    while (usedSlugs.has(slug)) slug = `${slugify(artboard.name)}-${i++}`;
    usedSlugs.add(slug);

    let filePath: string | undefined;
    if (outDir) {
      filePath = join(outDir, "pages", `${slug}.json`);
      writeFileSync(filePath, JSON.stringify(puckData, null, 2));
    }

    pages.push({
      slug,
      name: artboard.name,
      bounds: artboard.bounds,
      nodeCount: nodes.length,
      puckData,
      filePath,
    });
  }

  if (outDir) {
    const manifestOut = {
      source: "xd",
      documentName: xd.documentName,
      pageCount: pages.length,
      pages: pages.map(({ slug, name, bounds, nodeCount, filePath }) => ({
        slug,
        name,
        bounds,
        nodeCount,
        path: filePath,
      })),
    };
    writeFileSync(join(outDir, "pages.json"), JSON.stringify(manifestOut, null, 2));
  }

  return {
    documentName: xd.documentName,
    pages,
  };
}
