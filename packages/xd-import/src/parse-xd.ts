import { unzipSync } from "fflate";
import type {
  XdArtboardScreen,
  XdArtboardVariant,
  XdImageNode,
  XdParseResult,
  XdProduct,
  XdRgb,
  XdSection,
  XdTextNode,
} from "./types";

type ManifestNode = {
  name?: string;
  path?: string;
  children?: ManifestNode[];
  "uxdesign#bounds"?: { x: number; y: number; width: number; height: number };
};

type AgcNode = {
  type?: string;
  name?: string;
  transform?: { tx?: number; ty?: number };
  meta?: { ux?: { localTransform?: { tx?: number; ty?: number } } };
  style?: {
    fill?: {
      type?: string;
      color?: XdRgb;
      pattern?: {
        meta?: { ux?: { uid?: string } };
      };
    };
    font?: { family?: string; style?: string; size?: number };
  };
  text?: { rawText?: string };
  visualBounds?: { x?: number; y?: number; width?: number; height?: number };
  group?: { children?: AgcNode[] };
  artboard?: { children?: AgcNode[] };
};

type FileMap = Record<string, Uint8Array>;

const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

function decodeText(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

function rgbToHex(color?: XdRgb & { value?: XdRgb }) {
  if (!color) return undefined;
  const value = color.value ?? color;
  if (typeof value.r !== "number") return undefined;
  const { r = 0, g = 0, b = 0 } = value;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function detectMime(bytes: Uint8Array) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  return "application/octet-stream";
}

function normalizeZipPath(path: string) {
  return path.replace(/^\/+/, "").replace(/\\/g, "/");
}

function buildFileMap(buffer: Uint8Array): FileMap {
  const entries = unzipSync(buffer);
  const files: FileMap = {};
  for (const [rawPath, data] of Object.entries(entries)) {
    files[normalizeZipPath(rawPath)] = data;
  }
  return files;
}

function resolveXdRoot(files: FileMap) {
  if (files.manifest) {
    return { prefix: "", files };
  }

  const xdEntry = Object.keys(files).find((path) => path.endsWith(".xd") && !path.includes("__MACOSX"));
  if (!xdEntry) {
    throw new Error("Zip does not contain an Adobe XD file (.xd)");
  }

  const inner = unzipSync(files[xdEntry]);
  const nested: FileMap = {};
  for (const [rawPath, data] of Object.entries(inner)) {
    nested[normalizeZipPath(rawPath)] = data;
  }
  return { prefix: "", files: nested };
}

function readJsonFile<T>(files: FileMap, path: string): T {
  const normalized = normalizeZipPath(path);
  const bytes = files[normalized];
  if (!bytes) {
    throw new Error(`Missing XD file: ${path}`);
  }
  return JSON.parse(decodeText(bytes)) as T;
}

function listArtboards(manifest: ManifestNode) {
  const artboards: Array<{
    name: string;
    path: string;
    width: number;
    height: number;
    originX: number;
    originY: number;
  }> = [];

  function walk(nodes?: ManifestNode[]) {
    for (const node of nodes ?? []) {
      const bounds = node["uxdesign#bounds"];
      if (bounds && node.path?.startsWith("artboard-")) {
        artboards.push({
          name: node.name ?? node.path,
          path: node.path,
          width: bounds.width,
          height: bounds.height,
          originX: bounds.x,
          originY: bounds.y,
        });
      }
      walk(node.children);
    }
  }

  walk(manifest.children);
  return artboards;
}

function getAgcChildren(node: AgcNode): AgcNode[] {
  return node.group?.children ?? node.artboard?.children ?? [];
}

function resolveLocalPosition(
  node: AgcNode,
  originX: number,
  originY: number,
  parentLocalX: number,
  parentLocalY: number,
  parentHasLocal: boolean,
) {
  const tx = node.transform?.tx ?? 0;
  const ty = node.transform?.ty ?? 0;
  const localTransform = node.meta?.ux?.localTransform;
  const hasLocal = typeof localTransform?.tx === "number";

  if (hasLocal) {
    return {
      x: Math.round(localTransform.tx ?? 0),
      y: Math.round(localTransform.ty ?? 0),
      parentLocalX: localTransform.tx ?? 0,
      parentLocalY: localTransform.ty ?? 0,
      parentHasLocal: true,
    };
  }

  if (parentHasLocal) {
    return {
      x: Math.round(parentLocalX + tx),
      y: Math.round(parentLocalY + ty),
      parentLocalX,
      parentLocalY,
      parentHasLocal: true,
    };
  }

  return {
    x: Math.round(tx - originX),
    y: Math.round(ty - originY),
    parentLocalX: 0,
    parentLocalY: 0,
    parentHasLocal: false,
  };
}

function walkAgc(
  nodes: AgcNode[],
  originX: number,
  originY: number,
  texts: XdTextNode[],
  images: XdImageNode[],
  parentLocalX = 0,
  parentLocalY = 0,
  parentHasLocal = false,
) {
  for (const node of nodes) {
    const position = resolveLocalPosition(
      node,
      originX,
      originY,
      parentLocalX,
      parentLocalY,
      parentHasLocal,
    );

    if (node.type === "text") {
      const raw = node.text?.rawText?.trim() ?? "";
      if (raw) {
        texts.push({
          name: node.name ?? "",
          text: raw,
          x: position.x,
          y: position.y,
          fontSize: node.style?.font?.size,
          fontFamily: node.style?.font?.family,
          fontStyle: node.style?.font?.style,
          color: rgbToHex(node.style?.fill?.color),
        });
      }
    }

    if (node.type === "shape" && node.style?.fill?.type === "pattern") {
      const uid = node.style.fill.pattern?.meta?.ux?.uid;
      if (uid) {
        const vb = node.visualBounds;
        images.push({
          name: node.name ?? "",
          uid,
          x: vb?.x != null ? Math.round(vb.x - originX) : position.x,
          y: vb?.y != null ? Math.round(vb.y - originY) : position.y,
          width: Math.round(vb?.width ?? 0),
          height: Math.round(vb?.height ?? 0),
        });
      }
    }

    walkAgc(
      getAgcChildren(node),
      originX,
      originY,
      texts,
      images,
      position.parentLocalX,
      position.parentLocalY,
      position.parentHasLocal,
    );
  }
}

function collectColors(nodes: AgcNode[], colors: Set<string>) {
  for (const node of nodes) {
    const fillColor = rgbToHex(node.style?.fill?.color);
    if (fillColor) colors.add(fillColor);
    if (node.type === "shape" && node.style?.fill?.type === "gradient") {
      colors.add("#ff5b55");
      colors.add("#ff1161");
    }
    collectColors(getAgcChildren(node), colors);
  }
}

function pairProducts(texts: XdTextNode[]): XdProduct[] {
  const products: XdProduct[] = [];
  const pricePattern = /^\$[\d,]+(?:\.\d+)?$/;

  for (let i = 0; i < texts.length; i++) {
    const current = texts[i];
    if (!pricePattern.test(current.text)) continue;
    const nameNode = [...texts]
      .slice(Math.max(0, i - 3), i)
      .reverse()
      .find((t) => t.text && !pricePattern.test(t.text) && t.text.length > 2);
    if (!nameNode) continue;
    if (products.some((p) => p.name === nameNode.text && p.price === current.text)) continue;
    products.push({ name: nameNode.text, price: current.text });
  }

  return products;
}

function detectVariant(name: string, texts: XdTextNode[]): XdArtboardVariant {
  const lower = name.toLowerCase().trim();
  const joined = texts.map((t) => t.text.toLowerCase()).join(" ");
  if (lower.includes("splash") || (joined.includes("get started") && joined.includes("sign in") && !joined.includes("trending"))) {
    return "splash";
  }
  if (lower.includes("welcome")) return "welcome";
  if (lower.includes("sidebar")) return "generic";
  if (lower === "home" || joined.includes("trending products")) return "home";
  return "generic";
}

function buildHomeModel(texts: XdTextNode[], images: XdImageNode[]) {
  const sections: XdSection[] = [];
  const headings = texts.filter((t) => /products|categories/i.test(t.text));
  const products = pairProducts(texts);
  const imageUids = images.map((i) => i.uid);

  if (headings[0]) {
    sections.push({
      title: headings[0].text,
      seeAll: texts.some((t) => t.text.toLowerCase() === "see all"),
      products: products.slice(0, 3).map((product, index) => ({
        ...product,
        imageUid: imageUids[index],
      })),
    });
  }

  if (headings[1]) {
    sections.push({
      title: headings[1].text,
      seeAll: true,
      products: products.slice(3).map((product, index) => ({
        ...product,
        imageUid: imageUids[index + 3],
      })),
    });
  }

  const categoryLabels = ["All", "electronics and appliances", "SHIRT", "Mo"];
  const categories = categoryLabels
    .filter((label) => texts.some((t) => t.text.toLowerCase() === label.toLowerCase() || t.text === label))
    .map((label, index) => ({ label, active: index === 0 }));

  return {
    searchPlaceholder: texts.find((t) => /search/i.test(t.text))?.text ?? "Search",
    sections,
    categories,
  };
}

function buildSplashModel(texts: XdTextNode[]) {
  const find = (pattern: RegExp) => texts.find((t) => pattern.test(t.text))?.text ?? "";
  return {
    brandName: find(/^ramni$/i) || "Ramni",
    primaryCta: find(/get started/i) || "Get Started",
    secondaryCta: find(/sign in/i) || "Sign In",
  };
}

function buildWelcomeModel(texts: XdTextNode[]) {
  return {
    title: texts.find((t) => /welcome/i.test(t.text))?.text ?? "Welcome",
    subtitle: texts.find((t) => /hello/i.test(t.text))?.text ?? "",
    skipLabel: texts.find((t) => /skip/i.test(t.text))?.text,
  };
}

function parseArtboard(
  files: FileMap,
  artboard: ReturnType<typeof listArtboards>[number],
  assets: XdParseResult["assets"],
  assetPublicPrefix: string,
): XdArtboardScreen {
  const agcPath = `artwork/${artboard.path}/graphics/graphicContent.agc`;
  const agc = readJsonFile<{ children?: AgcNode[] }>(files, agcPath);
  const texts: XdTextNode[] = [];
  const images: XdImageNode[] = [];
  walkAgc(agc.children ?? [], artboard.originX, artboard.originY, texts, images);

  const colors = new Set<string>();
  for (const child of agc.children ?? []) {
    collectColors(getAgcChildren(child), colors);
    if (child.type === "artboard") {
      const bg = rgbToHex(child.style?.fill?.color);
      if (bg) colors.add(bg);
    }
  }

  const accentColor = colors.has("#ff5b55")
    ? "#ff5b55"
    : [...colors].find((c) => c !== "#ffffff" && c !== "#000000") ?? "#ff5b55";

  const variant = detectVariant(artboard.name, texts);
  const hasPreview = Boolean(files["preview.png"]);

  const screen: XdArtboardScreen = {
    id: artboard.path.replace("artboard-", ""),
    name: artboard.name,
    width: artboard.width,
    height: artboard.height,
    variant,
    accentColor,
    backgroundColor: "#ffffff",
    previewPath:
      variant === "splash" && hasPreview ? `${assetPublicPrefix}/preview.png` : undefined,
    texts,
    images: images.map((image) => ({
      ...image,
      imageUrl: assets[image.uid]
        ? `${assetPublicPrefix}/${image.uid}.${MIME_EXT[assets[image.uid].mime] ?? "png"}`
        : undefined,
    })),
  };

  if (variant === "splash") screen.splash = buildSplashModel(texts);
  if (variant === "home") screen.home = buildHomeModel(texts, images);
  if (variant === "welcome") screen.welcome = buildWelcomeModel(texts);

  return screen;
}

function indexAssets(files: FileMap) {
  const assets: XdParseResult["assets"] = {};
  for (const [path, bytes] of Object.entries(files)) {
    if (!path.startsWith("resources/")) continue;
    const uid = path.slice("resources/".length);
    if (!uid || uid.includes("/")) continue;
    assets[uid] = { path, mime: detectMime(bytes) };
  }
  return assets;
}

export function parseXdArchive(buffer: Uint8Array, assetPublicPrefix = "/imported/xd"): XdParseResult {
  const outer = buildFileMap(buffer);
  const { files } = resolveXdRoot(outer);
  const manifest = readJsonFile<{ name?: string; children?: ManifestNode[] }>(files, "manifest");
  const assets = indexAssets(files);
  const artboardDefs = listArtboards(manifest);

  const artboards = artboardDefs.map((artboard) =>
    parseArtboard(files, artboard, assets, assetPublicPrefix),
  );

  const fonts = [
    ...new Set(
      artboards.flatMap((board) => board.texts.map((text) => text.fontFamily).filter(Boolean) as string[]),
    ),
  ];

  return {
    documentName: manifest.name ?? "Imported XD",
    artboards,
    fonts,
    assets,
  };
}

export function getXdFiles(buffer: Uint8Array): FileMap {
  const outer = buildFileMap(buffer);
  return resolveXdRoot(outer).files;
}

export { detectMime, MIME_EXT };
