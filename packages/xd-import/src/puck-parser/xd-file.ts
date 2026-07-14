import { unzipSync } from "fflate";

export type XdBounds = { x: number; y: number; width: number; height: number };

export type XdArtboardMeta = {
  id: string;
  name: string;
  path: string;
  bounds: XdBounds;
  viewportHeight: number | null;
};

type FileMap = Record<string, Uint8Array>;

function normalizeZipPath(path: string) {
  return path.replace(/^\/+/, "").replace(/\\/g, "/");
}

function buildFileMap(buffer: Uint8Array): FileMap {
  const files: FileMap = {};
  for (const [rawPath, data] of Object.entries(unzipSync(buffer))) {
    files[normalizeZipPath(rawPath)] = data;
  }
  return files;
}

function resolveXdFiles(buffer: Uint8Array): FileMap {
  const outer = buildFileMap(buffer);
  if (outer.manifest) return outer;

  const xdEntry = Object.keys(outer).find((path) => path.endsWith(".xd") && !path.includes("__MACOSX"));
  if (!xdEntry) {
    throw new Error("Invalid upload: not an Adobe XD file (.xd)");
  }

  return buildFileMap(outer[xdEntry]);
}

function decodeText(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

export class XdFile {
  private files: FileMap;

  constructor(buffer: Uint8Array) {
    this.files = resolveXdFiles(buffer);
  }

  static fromBuffer(buffer: Uint8Array) {
    return new XdFile(buffer);
  }

  readText(entryName: string) {
    const bytes = this.files[normalizeZipPath(entryName)];
    return bytes ? decodeText(bytes) : null;
  }

  readBuffer(entryName: string) {
    return this.files[normalizeZipPath(entryName)] ?? null;
  }

  readJson<T>(entryName: string): T | null {
    const text = this.readText(entryName);
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  getManifest() {
    const manifest = this.readJson<{ name?: string; children?: unknown[] }>("manifest");
    if (!manifest) throw new Error("Invalid .xd file: missing manifest");
    return manifest;
  }

  get documentName() {
    return this.getManifest().name ?? "Imported XD";
  }

  listArtboards(): XdArtboardMeta[] {
    type ManifestNode = {
      id?: string;
      name?: string;
      path?: string;
      children?: ManifestNode[];
      "uxdesign#bounds"?: XdBounds;
      "uxdesign#viewport"?: { height?: number };
    };

    const manifest = this.getManifest() as { children?: ManifestNode[] };
    const artboards: XdArtboardMeta[] = [];

    const walk = (node: ManifestNode) => {
      const path = node.path ?? "";
      if (path.startsWith("artboard-") && path !== "pasteboard") {
        artboards.push({
          id: node.id ?? path,
          name: (node.name ?? "Untitled").trim() || "Untitled",
          path,
          bounds: node["uxdesign#bounds"] ?? { x: 0, y: 0, width: 0, height: 0 },
          viewportHeight: node["uxdesign#viewport"]?.height ?? null,
        });
      }
      for (const child of node.children ?? []) walk(child);
    };

    for (const child of manifest.children ?? []) walk(child);
    artboards.sort((a, b) => (a.bounds.x ?? 0) - (b.bounds.x ?? 0));
    return artboards;
  }

  getArtboardGraphics(artboardPath: string) {
    return this.readJson(`artwork/${artboardPath}/graphics/graphicContent.agc`);
  }

  getResourceBuffer(uid: string) {
    return this.readBuffer(`resources/${uid}`);
  }
}
