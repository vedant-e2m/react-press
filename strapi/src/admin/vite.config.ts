/**
 * Strapi 5.48+ in a pnpm monorepo can load duplicate copies of Redux Toolkit and
 * CodeMirror, breaking the admin panel.
 *
 * Pre-bundle only @strapi/design-system/dist/index.mjs (set via patch script +
 * NEXTPRESS_KEEP_DESIGN_SYSTEM_MJS=1). That build inlines CodeMirror once.
 *
 * @see https://github.com/strapi/strapi/issues/26755
 * @see https://github.com/codemirror/dev/issues/608
 */
const REDUX_PACKAGES = ["react-redux", "@reduxjs/toolkit"];

const CODEMIRROR_PACKAGES = [
  "@codemirror/state",
  "@codemirror/view",
  "@codemirror/language",
  "@codemirror/commands",
  "@codemirror/autocomplete",
  "@codemirror/lint",
  "@codemirror/search",
  "@codemirror/lang-json",
  "@codemirror/theme-one-dark",
  "@uiw/react-codemirror",
  "@uiw/codemirror-extensions-basic-setup",
  "@lezer/common",
  "@lezer/highlight",
];

type ViteConfig = {
  resolve?: {
    dedupe?: string[];
    alias?: Record<string, unknown> | unknown[];
  };
  optimizeDeps?: {
    include?: string[];
    exclude?: string[];
    esbuildOptions?: {
      mainFields?: string[];
    };
  };
};

export default (config: ViteConfig): ViteConfig => {
  config.resolve ??= {};

  if (Array.isArray(config.resolve.dedupe)) {
    config.resolve.dedupe = config.resolve.dedupe.filter((pkg) => !REDUX_PACKAGES.includes(pkg));
  } else {
    config.resolve.dedupe = [];
  }

  for (const pkg of CODEMIRROR_PACKAGES) {
    if (!config.resolve.dedupe.includes(pkg)) {
      config.resolve.dedupe.push(pkg);
    }
  }

  if (config.resolve.alias && !Array.isArray(config.resolve.alias)) {
    for (const pkg of REDUX_PACKAGES) {
      delete (config.resolve.alias as Record<string, unknown>)[pkg];
    }
    for (const pkg of CODEMIRROR_PACKAGES) {
      delete (config.resolve.alias as Record<string, unknown>)[pkg];
    }
  }

  config.optimizeDeps ??= {};
  config.optimizeDeps.esbuildOptions ??= {};
  config.optimizeDeps.esbuildOptions.mainFields = ["module", "main", "browser"];

  const include = new Set(config.optimizeDeps.include ?? []);
  for (const pkg of REDUX_PACKAGES) {
    include.delete(pkg);
  }
  include.add("@strapi/design-system");
  for (const pkg of CODEMIRROR_PACKAGES) {
    include.delete(pkg);
  }
  config.optimizeDeps.include = [...include];

  const exclude = new Set(config.optimizeDeps.exclude ?? []);
  for (const pkg of REDUX_PACKAGES) {
    exclude.delete(pkg);
  }
  for (const pkg of CODEMIRROR_PACKAGES) {
    exclude.add(pkg);
  }
  exclude.delete("@strapi/design-system");
  config.optimizeDeps.exclude = [...exclude];

  return config;
};
