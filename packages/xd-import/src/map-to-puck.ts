import type { PuckData } from "@nextpress/shared";
import type { XdArtboardScreen, XdImportOptions, XdImportResult, XdParseResult } from "./types";

function blockId(prefix: string, name: string) {
  return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function artboardToBlock(screen: XdArtboardScreen, slug: string) {
  const imageByUid = Object.fromEntries(screen.images.map((image) => [image.uid, image]));

  return {
    type: "XdImportedScreen",
    props: {
      id: blockId(slug, screen.name),
      title: screen.name,
      artboardName: screen.name,
      width: screen.width,
      height: screen.height,
      variant: screen.variant,
      accentColor: screen.accentColor,
      backgroundColor: screen.backgroundColor,
      previewImageUrl: screen.previewPath,
      splash: screen.splash,
      home: screen.home
        ? {
            ...screen.home,
            sections: screen.home.sections.map((section) => ({
              ...section,
              products: section.products.map((product) => ({
                name: product.name,
                price: product.price,
                imageUrl:
                  product.imageUrl ??
                  (product.imageUid
                    ? imageByUid[product.imageUid]?.imageUrl ??
                      `${screen.previewPath?.replace("/preview.png", "")}/${product.imageUid}.png`
                    : undefined),
              })),
            })),
          }
        : undefined,
      welcome: screen.welcome,
      genericTexts: screen.variant === "generic" ? screen.texts.slice(0, 24) : undefined,
    },
  };
}

export function artboardsToPuckData(
  parseResult: XdParseResult,
  options: XdImportOptions,
): PuckData {
  const selected =
    options.artboardNames && options.artboardNames.length > 0
      ? parseResult.artboards.filter((board) => options.artboardNames!.includes(board.name))
      : parseResult.artboards;

  const priority = ["Splash ", "Splash 2", "Splash 3", "Welcome screen", "Home"];
  const ordered = [
    ...priority
      .map((name) => selected.find((board) => board.name === name))
      .filter((board): board is XdArtboardScreen => Boolean(board)),
    ...selected.filter((board) => !priority.includes(board.name)),
  ];

  return {
    root: { props: { title: options.title } },
    content: ordered.map((screen) => artboardToBlock(screen, options.slug)),
  };
}

export function buildXdImportResult(
  parseResult: XdParseResult,
  options: XdImportOptions,
): XdImportResult {
  const warnings: string[] = [];

  if (parseResult.fonts.some((font) => /sf pro/i.test(font))) {
    warnings.push("SF Pro is an Apple system font — using Inter as a web fallback.");
  }

  const unmapped = parseResult.artboards.filter((board) => board.variant === "generic");
  if (unmapped.length > 0) {
    warnings.push(
      `${unmapped.length} artboard(s) rendered as preview/generic: ${unmapped.map((b) => b.name).join(", ")}`,
    );
  }

  return {
    parseResult,
    puckData: artboardsToPuckData(parseResult, options),
    warnings,
  };
}
