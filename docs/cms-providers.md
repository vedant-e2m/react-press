# CMS providers reference

NextPress uses a **headless CMS** for auth, content storage, and media. The visual page builder is **Puck** (MIT) — that is separate and not replaced by any CMS below.

This document lists known options and how NextPress relates to them.

---

## MIT-licensed — good fit as a backend

| CMS | License | API | Notes |
|-----|---------|-----|-------|
| **Strapi** | MIT (Community Edition) | REST, GraphQL | **Default NextPress backend.** Separate Node service. Works well with both Next.js and React SPA. |
| **KeystoneJS** | MIT | GraphQL | Schema-in-code. Smaller ecosystem than Strapi. |

---

## MIT-licensed — limited fit for NextPress

| CMS | License | Why limited |
|-----|---------|-------------|
| **Ghost** | MIT | Blog-focused. Content API is not ideal for generic Puck page trees. |
| **Decap CMS** | MIT | Git-based (commits to repo). No traditional REST API for pages. |

---

## Not MIT — excluded from official adapter targets

| CMS | License | Note |
|-----|---------|------|
| **Directus** | BSL 1.1 | License changed; no longer MIT. |
| **Sanity** | Mixed | Studio is open; platform and cloud are proprietary. |
| **Contentful** | Proprietary | SaaS only. |
| **Hygraph** | Proprietary | SaaS only. |

---

## Page builder (not a CMS)

| Tool | License | Role |
|------|---------|------|
| **Puck** | MIT | Drag-and-drop visual editor. Stores layout as JSON (`puck_data`) in whichever CMS you use. |

---

## How NextPress plugs a CMS in

Core does not hardcode any CMS from this list. See **[cms-architecture.md](./cms-architecture.md)** for the plugin model.

- **`@nextpress/cms-core`** — `ContentProvider` + `CmsAdapter` contracts only
- **`@nextpress/cms-strapi`** (or similar) — one adapter package per CMS, installed separately
- **Swap backend** — change `CMS_ADAPTER` env or `nextpress.config.ts`; app code unchanged
