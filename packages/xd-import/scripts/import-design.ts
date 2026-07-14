import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { importDesignFile, writeDesignSeedFile } from "../src/import-design";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const defaultZip = resolve(process.env.HOME ?? "", "Downloads/CoinBase Web Dashboard.zip");
const zipPath = process.argv[2] ? resolve(process.argv[2]) : defaultZip;
const slug = process.argv[3] ?? "coinbase-dashboard";
const title = process.argv[4] ?? "CoinBase Web Dashboard";

const assetOutputDir = join(root, "apps/web/public/imported/design", slug);
const seedFilePath = join(root, "strapi/src/seed/coinbase-page.ts");

console.log(`Importing design export: ${zipPath}`);
console.log(`Mapping to core Puck blocks only (no custom React)`);

const result = importDesignFile(zipPath, {
  title,
  slug,
  assetOutputDir,
  assetPublicPrefix: "/imported/design",
});

writeDesignSeedFile(result, seedFilePath, "COINBASE_PAGE", slug);

console.log(`Screens found: ${result.parseResult.screens.length}`);
console.log(`Core blocks created: ${result.puckData.content.length}`);
console.log(`Assets written to: ${assetOutputDir}`);
console.log(`Seed file written to: ${seedFilePath}`);
if (result.warnings.length > 0) {
  console.log("Warnings:");
  for (const warning of result.warnings) {
    console.log(`- ${warning}`);
  }
}
