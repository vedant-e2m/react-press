import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { importXdPuckBuffer } from "../src/import-puck";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const inputPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(process.env.HOME ?? "", "Downloads/Auction_Dashboard.xd");
const slug = process.argv[3] ?? "auction-dashboard";
const title = process.argv[4] ?? "Auction Dashboard";

const assetOutputDir = resolve(root, "apps/web/public/imported/xd", slug);

console.log(`Importing with puck-parser: ${inputPath}`);

const buffer = readFileSync(inputPath);
const result = importXdPuckBuffer(new Uint8Array(buffer), {
  title,
  slug,
  assetOutputDir,
  assetPublicPrefix: `/imported/xd/${slug}`,
});

console.log(`Document: ${result.documentName}`);
console.log(`Pages: ${result.pages.length}`);
for (const page of result.pages) {
  console.log(
    `  - ${page.pageSlug.padEnd(40)} ${String(page.nodeCount).padStart(3)} nodes  ${page.bounds.width}x${page.bounds.height}`,
  );
}
console.log(`Assets written to: ${assetOutputDir}/assets`);
