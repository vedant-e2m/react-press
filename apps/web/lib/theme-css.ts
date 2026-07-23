import type { ThemeConfig } from "@nextpress/cms-core";

const SYSTEM_FONTS = new Set([
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "sans-serif",
  "serif",
  "monospace",
  "georgia",
  "times new roman",
  "arial",
  "inter",
]);

/** Extract loadable Google Font family names from theme font stacks. */
export function themeConfigToFontFamilies(config: ThemeConfig): string[] {
  const families = new Set<string>();
  if (!config.fonts) return [];

  for (const value of Object.values(config.fonts)) {
    const first = value.split(",")[0]?.replace(/['"]/g, "").trim();
    if (!first) continue;
    if (SYSTEM_FONTS.has(first.toLowerCase())) continue;
    families.add(first);
  }
  return [...families];
}

/** Google Fonts stylesheet URL for theme fonts. */
export function themeConfigToFontUrl(config: ThemeConfig): string | null {
  const families = themeConfigToFontFamilies(config);
  if (families.length === 0) return null;

  const params = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

/** Build CSS custom properties from active theme config. */
export function themeConfigToCss(config: ThemeConfig): string {
  const lines: string[] = [];

  if (config.colors) {
    for (const [key, value] of Object.entries(config.colors)) {
      lines.push(`--theme-color-${key}: ${value};`);
    }
  }

  if (config.fonts) {
    for (const [key, value] of Object.entries(config.fonts)) {
      lines.push(`--theme-font-${key}: ${value};`);
    }
  }

  if (config.spacing) {
    for (const [key, value] of Object.entries(config.spacing)) {
      lines.push(`--theme-spacing-${key}: ${value};`);
    }
  }

  if (config.header) {
    if (config.header.backgroundColor) lines.push(`--theme-header-background: ${config.header.backgroundColor};`);
    if (config.header.textColor) lines.push(`--theme-header-text: ${config.header.textColor};`);
    if (config.header.accentColor) lines.push(`--theme-header-accent: ${config.header.accentColor};`);
  }

  if (config.background?.bodyColor) {
    lines.push(`--theme-background-body: ${config.background.bodyColor};`);
  }

  if (config.background?.imageUrl) {
    lines.push(`--theme-background-image: url("${config.background.imageUrl}");`);
  }

  if (config.header?.imageUrl) {
    lines.push(`--theme-header-image: url("${config.header.imageUrl}");`);
  }

  if (config.colors?.text) {
    lines.push(`--theme-color-text: ${config.colors.text};`);
  }

  const variables = lines.length ? `:root { ${lines.join(" ")} }` : "";
  const customCss = config.customCss?.trim() ? `\n${config.customCss}\n` : "";
  return `${variables}${customCss}`.trim();
}
