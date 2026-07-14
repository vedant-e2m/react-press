import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { XdFile } from "./xd-file";

export function detectImageExt(buffer: Uint8Array | null) {
  if (!buffer || buffer.length < 4) return "bin";
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "jpg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "gif";
  const head = new TextDecoder().decode(buffer.subarray(0, 5));
  if (head === "<?xml" || new TextDecoder().decode(buffer.subarray(0, 4)) === "<svg") return "svg";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return "webp";
  return "bin";
}

export function extractAssets({
  xdFile,
  uids,
  outputDir,
  publicUrlPrefix,
}: {
  xdFile: XdFile;
  uids: string[];
  outputDir: string;
  publicUrlPrefix: string;
}) {
  const assetsDir = join(outputDir, "assets");
  mkdirSync(assetsDir, { recursive: true });

  const prefix = publicUrlPrefix.endsWith("/") ? publicUrlPrefix.slice(0, -1) : publicUrlPrefix;
  const uidToPath: Record<string, string> = {};

  for (const uid of uids) {
    const buf = xdFile.getResourceBuffer(uid);
    if (!buf) continue;
    const ext = detectImageExt(buf);
    const filename = `${uid}.${ext}`;
    writeFileSync(join(assetsDir, filename), buf);
    uidToPath[uid] = `${prefix}/assets/${filename}`;
  }

  return uidToPath;
}
