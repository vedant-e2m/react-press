/**
 * @strapi/design-system ships dist/index.mjs with @codemirror/state inlined.
 *
 * Modes:
 * - default: point "module" at CJS (index.js) for shared CodeMirror graph
 * - NEXTPRESS_KEEP_DESIGN_SYSTEM_MJS=1: keep/restores ESM (index.mjs) for single-bundle prebuild
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const roots = [
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
];

const KEEP_MJS = process.env.NEXTPRESS_KEEP_DESIGN_SYSTEM_MJS === "1";

/**
 * @param {string} root
 * @returns {string[]}
 */
function findDesignSystemPackageJsons(root) {
  const found = new Set();

  const direct = path.join(root, "node_modules", "@strapi", "design-system", "package.json");
  if (fs.existsSync(direct)) {
    found.add(direct);
  }

  const pnpmDir = path.join(root, "node_modules", ".pnpm");
  if (!fs.existsSync(pnpmDir)) {
    return [...found];
  }

  for (const entry of fs.readdirSync(pnpmDir)) {
    if (!entry.startsWith("@strapi+design-system@")) {
      continue;
    }

    const pkgPath = path.join(
      pnpmDir,
      entry,
      "node_modules",
      "@strapi",
      "design-system",
      "package.json",
    );

    if (fs.existsSync(pkgPath)) {
      found.add(pkgPath);
    }
  }

  return [...found];
}

/** @type {string[]} */
const pkgPaths = [];

for (const root of roots) {
  for (const pkgPath of findDesignSystemPackageJsons(root)) {
    if (!pkgPaths.includes(pkgPath)) {
      pkgPaths.push(pkgPath);
    }
  }
}

if (pkgPaths.length === 0) {
  console.warn("[patch-design-system] @strapi/design-system not found, skipping");
  process.exit(0);
}

let changed = 0;

for (const pkgPath of pkgPaths) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const distDir = path.join(path.dirname(pkgPath), "dist");
  const mjsEntry = fs.existsSync(path.join(distDir, "index.mjs"))
    ? "./dist/index.mjs"
    : pkg.module;

  const targetModule = KEEP_MJS ? mjsEntry : pkg.main;

  if (pkg.module === targetModule) {
    continue;
  }

  pkg.module = targetModule;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(
    `[patch-design-system] ${KEEP_MJS ? "Restored" : "Patched"} ${pkgPath} -> ${targetModule}`,
  );
  changed += 1;
}

if (changed === 0) {
  console.log(
    `[patch-design-system] All ${pkgPaths.length} copies already set (${KEEP_MJS ? "mjs" : "cjs"})`,
  );
}
