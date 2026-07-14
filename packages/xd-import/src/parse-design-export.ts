import { unzipSync } from "fflate";

export type DesignScreen = {
  name: string;
  fileName: string;
  theme: "light" | "dark" | "unknown";
  role: "admin" | "agent" | "user" | "unknown";
  zipPath: string;
  publicUrl: string;
};

export type DesignExportParseResult = {
  documentName: string;
  screens: DesignScreen[];
  screenNames: string[];
  themes: string[];
  roles: string[];
};

function decodePath(path: string) {
  return path.replace(/^\/+/, "").replace(/\\/g, "/");
}

function parseTheme(segment: string): DesignScreen["theme"] {
  const lower = segment.toLowerCase();
  if (lower.includes("light")) return "light";
  if (lower.includes("dark")) return "dark";
  return "unknown";
}

function parseRole(segment: string): DesignScreen["role"] {
  const lower = segment.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("agent")) return "agent";
  if (lower.includes("user")) return "user";
  return "unknown";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function parseDesignExportZip(
  buffer: Uint8Array,
  publicPrefix: string,
  slug: string,
): DesignExportParseResult {
  const entries = unzipSync(buffer);
  const screens: DesignScreen[] = [];
  let documentName = "Imported Design";

  for (const rawPath of Object.keys(entries)) {
    const path = decodePath(rawPath);
    if (!path.toLowerCase().endsWith(".png")) continue;

    const parts = path.split("/").filter(Boolean);
    const fileName = parts[parts.length - 1] ?? path;
    const name = fileName.replace(/\.png$/i, "");
    const themePart = parts.find((p) => /theme/i.test(p)) ?? "";
    const rolePart = parts.find((p) => /admin|agent|user/i.test(p)) ?? "";

    if (parts.length >= 2 && !documentName.includes("Dashboard")) {
      documentName = parts[0].replace(/\.fig$/i, "").trim() || documentName;
    }

    const publicUrl = `${publicPrefix}/${slug}/${path.split("/").slice(1).join("/")}`;
    screens.push({
      name,
      fileName,
      theme: parseTheme(themePart),
      role: parseRole(rolePart),
      zipPath: path,
      publicUrl,
    });
  }

  const screenNames = [...new Set(screens.map((s) => s.name))].sort();
  const themes = [...new Set(screens.map((s) => s.theme).filter((t) => t !== "unknown"))];
  const roles = [...new Set(screens.map((s) => s.role).filter((r) => r !== "unknown"))];

  return {
    documentName: documentName.replace(/\/$/, ""),
    screens,
    screenNames,
    themes,
    roles,
  };
}

export function getDesignExportFiles(buffer: Uint8Array) {
  return unzipSync(buffer);
}

export function pickPrimaryScreen(screens: DesignScreen[]) {
  return (
    screens.find((s) => s.theme === "light" && s.role === "admin" && s.name === "Overview") ??
    screens.find((s) => s.name === "Overview") ??
    screens[0]
  );
}

export function screensForGallery(screens: DesignScreen[], limit = 12) {
  const preferred = screens.filter((s) => s.theme === "light" && s.role === "admin");
  const pool = preferred.length > 0 ? preferred : screens;
  const unique = new Map<string, DesignScreen>();
  for (const screen of pool) {
    if (!unique.has(screen.name)) unique.set(screen.name, screen);
  }
  return [...unique.values()].slice(0, limit);
}

export { slugify };
