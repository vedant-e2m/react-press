# CMS architecture — decoupled plugin model

NextPress core is **CMS-agnostic**. No CMS names, URLs, or switch statements live in `@nextpress/cms-core`.

---

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  apps/web, apps/react, admin, API routes                     │
│  import { getCms } from "@/lib/cms"   ← never import Strapi  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  @nextpress/cms-core                                          │
│  • ContentProvider  (domain contract)                         │
│  • CmsAdapter       (plugin contract)                         │
│  • initCms / getCms (runtime — no CMS names)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │ implements
                            ▼
                   @nextpress/cms-strapi
                   (npm package)
                            │
                            ▼
                       Strapi API
```

---

## What lives where

| Package | Responsibility | Knows about Strapi? |
|---------|----------------|---------------------|
| `cms-core` | Interfaces + runtime only | **No** |
| `cms-strapi` | Strapi → `ContentProvider` mapping | Yes |
| `apps/web` | Calls `getCms()` | **No** (only wires adapter at bootstrap) |

---

## Two ways to wire an adapter (no hardcoding in core)

### Option A — Config file (build-time choice)

The app picks its adapter via dependency + config. Core stays unaware.

```typescript
// nextpress.config.ts
import { defineNextPress } from "@nextpress/config";
import cmsAdapter from "@nextpress/cms-strapi";

export default defineNextPress({
  cms: {
    adapter: cmsAdapter,
    options: { url: process.env.CMS_URL },
  },
});
```

```typescript
// apps/web/lib/cms.ts
import { initCms } from "@nextpress/cms-core";
import nextpressConfig from "../../nextpress.config";

initCms(nextpressConfig.cms.adapter, nextpressConfig.cms.options);

export { getCms } from "@nextpress/cms-core";
```

Swap CMS = change npm dependency + config file. Zero changes to page/admin code.

### Option B — Environment (deploy-time choice)

No CMS import in app source. Adapter package must be installed in `node_modules`.

```bash
CMS_ADAPTER=@nextpress/cms-strapi
CMS_URL=http://localhost:1337
# optional adapter-specific options:
CMS_OPTION_API_TOKEN=secret
```

```typescript
// apps/web/instrumentation.ts or server bootstrap
import { initCmsFromEnv } from "@nextpress/cms-core";

await initCmsFromEnv();
```

---

## Writing an adapter package

Each CMS is a standalone package that exports `CmsAdapter`:

```typescript
import type { CmsAdapter, ContentProvider, AdapterConfig } from "@nextpress/cms-core";

class StrapiContentProvider implements ContentProvider {
  readonly id = "strapi";
  readonly displayName = "Strapi";
  // ... implement interface using Strapi REST internally
}

export const cmsAdapter: CmsAdapter = {
  meta: { id: "strapi", displayName: "Strapi" },
  createProvider(config: AdapterConfig) {
    const url = config.url ?? "http://localhost:1337";
    return new StrapiContentProvider({ url });
  },
};

export default cmsAdapter;
```

Core never lists `"strapi"` anywhere. The adapter defines its own `id`.

---

## What core does NOT do

- No `switch (provider)` on CMS names
- No `CmsProviderId` union type that grows with every CMS
- No `strapiUrl` fields in shared config
- No built-in registry of CMS products
- No requirement to ship multiple adapters in the monorepo

---

## What you ship in the monorepo

| Package | Required? |
|---------|-----------|
| `cms-core` | Yes — contract + runtime |
| `cms-strapi` (or rename `strapi-client`) | One reference adapter |

OSS users can add other adapters outside the repo. Core + Puck + admin stay the same.

---

## Domain model (CMS-agnostic)

All adapters map their native shapes to these types in `cms-core`:

- `ContentPage` — includes `puckData` (Puck JSON)
- `ContentPost`, `ContentCategory`, `ContentMedia` — Phase 2
- `AuthSession` — login result

Puck remains separate. Every adapter stores `puckData` as a JSON field in whatever CMS it uses.

See [cms-providers.md](./cms-providers.md) for a list of known MIT-licensed CMS products.
