import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function getPluginShadcnRoot(): string {
  return join(process.cwd(), "../../packages/plugin-shadcn");
}

export function readInstalledComponentsFromDisk(root = getPluginShadcnRoot()): string[] {
  const filePath = join(root, "src/installed-components.ts");
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/INSTALLED_SHADCN_COMPONENTS: string\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error("Could not read installed-components.ts");
  }
  return JSON.parse(match[1]) as string[];
}

export function readInstalledRegistrySlugsFromDisk(root = getPluginShadcnRoot()): string[] {
  const uiDir = join(root, "src/ui");
  return readdirSync(uiDir)
    .filter((file: string) => file.endsWith(".tsx") && file !== "index.ts")
    .map((file: string) => file.replace(/\.tsx$/, ""))
    .sort();
}
