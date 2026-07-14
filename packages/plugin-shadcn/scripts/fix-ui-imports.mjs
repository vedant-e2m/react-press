#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const uiDir = "src/ui";
for (const file of readdirSync(uiDir)) {
  if (!file.endsWith(".tsx")) continue;
  const path = join(uiDir, file);
  const source = readFileSync(path, "utf8");
  const updated = source
    .replaceAll('from "@/lib/utils"', 'from "../lib/utils"')
    .replaceAll('from "@/ui/button"', 'from "./button"');
  if (updated !== source) {
    writeFileSync(path, updated);
    console.log(`fixed ${path}`);
  }
}
