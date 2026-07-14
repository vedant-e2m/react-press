import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { importXdFile, writeImportArtifacts } from "../src/import";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const inputPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(process.env.HOME ?? "", "Downloads/Auction_Dashboard.xd");
const slug = process.argv[3] ?? "auction-dashboard";
const title = process.argv[4] ?? "Auction Dashboard";
const exportName = process.argv[5] ?? "AUCTION_XD_PAGE";

const assetOutputDir = join(root, "apps/web/public/imported/xd", slug);
const seedFilePath = join(root, "strapi/src/seed/auction-page.ts");

console.log(`Importing Adobe XD file: ${inputPath}`);

const result = importXdFile(inputPath, {
  title,
  slug,
  assetOutputDir,
  assetPublicPrefix: "/imported/xd",
});

writeImportArtifacts(result, seedFilePath, {
  exportName,
  slug,
  seoTitle: "Auction Dashboard — Imported from Adobe XD",
  seoDescription: "Auction admin dashboard prototype imported from Auction_Dashboard.xd",
});

console.log(`Document: ${result.parseResult.documentName}`);
console.log(`Artboards imported: ${result.parseResult.artboards.length}`);
console.log(`Puck blocks created: ${result.puckData.content.length}`);
console.log(`Assets written to: ${assetOutputDir}`);
console.log(`Seed file written to: ${seedFilePath}`);
if (result.warnings.length > 0) {
  console.log("Warnings:");
  for (const warning of result.warnings) {
    console.log(`- ${warning}`);
  }
}
