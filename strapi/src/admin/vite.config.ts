/**
 * Strapi 5.48+ in a pnpm monorepo can load duplicate copies of Redux Toolkit and
 * CodeMirror, breaking the admin panel.
 *
 * Pre-bundle only @strapi/design-system/dist/index.mjs (set via patch script +
 * NEXTPRESS_KEEP_DESIGN_SYSTEM_MJS=1). That build inlines CodeMirror once.
 *
 * Also dedupe React and alias it to Strapi's copy so @nextpress/builder embeds
 * without pulling a second React (builder peers React 18–19).
 *
 * @see https://github.com/strapi/strapi/issues/26755
 * @see https://github.com/codemirror/dev/issues/608
 */
import path from 'node:path';

const REDUX_PACKAGES = ["react-redux", "@reduxjs/toolkit"];

const REACT_PACKAGES = ["react", "react-dom"];

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

/** Absolute path to the Strapi package root (`strapi/`). */
const STRAPI_ROOT = path.resolve(__dirname, "../..");

export default (config: ViteConfig): ViteConfig => {
  config.resolve ??= {};

  if (Array.isArray(config.resolve.dedupe)) {
    config.resolve.dedupe = config.resolve.dedupe.filter((pkg) => !REDUX_PACKAGES.includes(pkg));
  } else {
    config.resolve.dedupe = [];
  }

  for (const pkg of [...CODEMIRROR_PACKAGES, ...REACT_PACKAGES, "@nextpress/builder"]) {
    if (!config.resolve.dedupe.includes(pkg)) {
      config.resolve.dedupe.push(pkg);
    }
  }

  const reactAlias: Record<string, string> = {
    react: path.join(STRAPI_ROOT, "node_modules/react"),
    "react-dom": path.join(STRAPI_ROOT, "node_modules/react-dom"),
  };

  if (Array.isArray(config.resolve.alias)) {
    for (const [find, replacement] of Object.entries(reactAlias)) {
      config.resolve.alias.push({ find, replacement });
    }
  } else {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      ...reactAlias,
    };

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
  include.add("@nextpress/builder");
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
  exclude.delete("@nextpress/builder");
  config.optimizeDeps.exclude = [...exclude];

  return config;
};
