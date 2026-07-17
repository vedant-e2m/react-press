# CMS providers reference

NextPress uses a **headless CMS** for auth, content storage, and media. The visual page builder is the **WordPress block editor (Gutenberg)** via Automattic’s Isolated Block Editor — that layer is separate from the CMS.

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
| **Ghost** | MIT | Blog-focused. Content API is not ideal for generic block page trees. |
| **Decap CMS** | MIT | Git-based (commits to repo). No traditional REST API for pages. |

---

## Not MIT — excluded from official adapter targets

| CMS | License | Note |
|-----|---------|-----|
| **Directus** | BSL 1.1 | License changed; no longer MIT. |
| **Sanity** | Mixed | Studio is open; platform and cloud are proprietary. |
| **Contentful** | Proprietary | SaaS only. |
| **Hygraph** | Proprietary | SaaS only. |

---

## Page builder (not a CMS)

| Tool | License | Role |
|------|---------|------|
| **Gutenberg (Isolated Block Editor)** | GPL-2.0-or-later (WordPress packages) | Visual block editor familiar to WordPress users. Stores layout as Gutenberg JSON (`editor: "gutenberg"`) in the page JSON field. |
| **Puck** | MIT | Legacy editor — still supported for reading old `puck_data` trees; new edits save as Gutenberg. |

---

## How NextPress plugs a CMS in

Core does not hardcode any CMS from this list. See **[cms-architecture.md](./cms-architecture.md)** for the plugin model.

- **`@nextpress/cms-core`** — `ContentProvider` + `CmsAdapter` contracts only
- **`@nextpress/gutenberg`** — block parse/serialize, public renderer, Isolated Block Editor iframe host
