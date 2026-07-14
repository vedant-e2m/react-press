import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PuckData } from "@nextpress/shared";
import { convertXdToPuck, type XdPuckPage } from "./puck-parser";

export type ImportXdPuckOptions = {
  title: string;
  slug: string;
  assetOutputDir: string;
  assetPublicPrefix?: string;
  artboardNames?: string[];
};

export type ImportXdPuckResult = {
  documentName: string;
  pages: Array<
    XdPuckPage & {
      pageSlug: string;
      pageTitle: string;
    }
  >;
  warnings: string[];
};

export function importXdPuckBuffer(buffer: Uint8Array, options: ImportXdPuckOptions): ImportXdPuckResult {
  const publicPrefix = options.assetPublicPrefix ?? `/imported/xd/${options.slug}`;
  const { documentName, pages } = convertXdToPuck(buffer, {
    outDir: options.assetOutputDir,
    assetPublicPrefix: publicPrefix,
    artboardNames: options.artboardNames,
  });

  const warnings: string[] = [];
  if (pages.length === 0) {
    warnings.push("No artboards with drawable content were found in the XD file.");
  }

  warnings.push(
    "Imported pages use absolute pixel positioning from Adobe XD. They are faithful at the artboard size but not automatically responsive.",
  );

  const mappedPages = pages.map((page) => ({
    ...page,
    pageSlug: pages.length === 1 ? options.slug : `${options.slug}-${page.slug}`,
    pageTitle: pages.length === 1 ? options.title : `${options.title} — ${page.name.trim()}`,
    puckData: rewritePuckAssetUrls(page.puckData, publicPrefix),
  }));

  return {
    documentName,
    pages: mappedPages,
    warnings,
  };
}

function rewritePuckAssetUrls(data: PuckData, publicPrefix: string) {
  const prefix = publicPrefix.endsWith("/") ? publicPrefix.slice(0, -1) : publicPrefix;

  return {
    ...data,
    content: data.content.map((block) => {
      if (block.type !== "XdImage" || typeof block.props.src !== "string") return block;
      const src = block.props.src as string;
      if (src.startsWith("http") || src.startsWith("/")) return block;
      return {
        ...block,
        props: {
          ...block.props,
          src: src.startsWith("assets/") ? `${prefix}/${src}` : `${prefix}/${src}`,
        },
      };
    }),
  };
}

export function writeXdPuckArtifacts(
  result: ImportXdPuckResult,
  seedDir: string,
  options: { exportPrefix: string; status?: "draft" | "published" },
) {
  mkdirSync(seedDir, { recursive: true });

  const exports: string[] = [];
  for (const page of result.pages) {
    const exportName = `${options.exportPrefix}_${page.slug.replace(/-/g, "_").toUpperCase()}`;
    const seed = `/** Auto-generated from Adobe XD puck-parser import */\nexport const ${exportName} = ${JSON.stringify(
      {
        title: page.pageTitle,
        slug: page.pageSlug,
        status: options.status ?? "draft",
        seoTitle: `${page.pageTitle} — Imported from Adobe XD`,
        seoDescription: `Pixel-faithful import of the "${page.name.trim()}" artboard.`,
        puckData: page.puckData,
      },
      null,
      2,
    )};\n`;
    const filePath = join(seedDir, `${page.pageSlug}.ts`);
    writeFileSync(filePath, seed);
    exports.push(`export { ${exportName} } from "./${page.pageSlug}";`);
  }

  writeFileSync(join(seedDir, "index.ts"), `${exports.join("\n")}\n`);
}
