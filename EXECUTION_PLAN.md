# NextPress — Execution Plan

> Open-source, WordPress-like platform for building React/Next.js websites with drag-and-drop.

**Stack:** Next.js 15 (App Router) **or** React (Vite) + Puck (page builder) + Strapi 5 (backend) + PostgreSQL

**Strategy:** Use Strapi for backend/storage/auth/media. Build only the core product: visual page builder, custom admin, themes, and plugin layer. Framework-agnostic shared packages (`blocks`, `puck-config`, `strapi-client`) power both frontend targets.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [What We Build vs What Strapi Handles](#3-what-we-build-vs-what-strapi-handles)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Strapi Content Model](#5-strapi-content-model)
6. [Puck Block Registry](#6-puck-block-registry)
7. [Admin Modules & Pages](#7-admin-modules--pages)
8. [Data Flow](#8-data-flow)
9. [Authentication & Roles](#9-authentication--roles)
10. [Phase-by-Phase Build Plan](#10-phase-by-phase-build-plan)
11. [Docker Compose](#11-docker-compose)
12. [Integration Patterns](#12-integration-patterns)
13. [Deployment Strategy](#13-deployment-strategy)
14. [Success Metrics](#14-success-metrics)
15. [Future Roadmap (Post v1)](#15-future-roadmap-post-v1)

---

## 1. Project Overview

### Vision

A self-hosted platform where anyone can build professional React/Next.js websites using drag-and-drop — WordPress ease with modern performance.

### One-Liner

**NextPress = Puck (editor) + Next.js (frontend/admin) + Strapi (data/auth/media)**

### Target Users

- Non-technical site owners and small business owners
- Content editors managing pages and blog posts
- Developers extending via blocks, themes, and plugins

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend (Next) | Next.js 15 (App Router) | Public site with SSG/ISR + custom admin shell |
| Frontend (React) | Vite + React Router | Public SPA site (CSR); same blocks & Puck renderer |
| Admin | Next.js 15 (App Router) | Custom admin shell (shared across both frontend targets) |
| Page Builder | Puck (MIT) | Drag-and-drop visual editor |
| Backend / CMS | Strapi 5 | Content, auth, media, API |
| Database | PostgreSQL | Primary data store |
| Auth | Strapi JWT + Next.js middleware | Session management |
| Styling | Tailwind CSS + shadcn/ui | Admin UI components |
| Monorepo | Turborepo + pnpm | Package management |
| Local Dev | Docker Compose | One-command setup |
| Production | Vercel (Next.js) + Railway/Fly (Strapi) | Deployment |

### License

MIT (open source)

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌──────────────────┐  ┌────────────────────────────────┐ │
│  │  Public Site      │  │  Admin Panel                    │ │
│  │  yourdomain.com   │  │  yourdomain.com/admin           │ │
│  │                   │  │  yourdomain.com/admin/editor    │ │
│  └────────┬─────────┘  └──────────────┬─────────────────┘ │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App (apps/web)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ Block        │  │ Admin        │  │ Puck Integration  │ │
│  │ Renderer     │  │ Dashboard    │  │ (Editor Wrapper)  │ │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬─────────┘ │
│         └─────────────────┼─────────────────────┘           │
│                           │                                  │
│                    Strapi SDK Client                         │
└───────────────────────────┼─────────────────────────────────┘
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Strapi 5 (strapi/)                       │
│  Pages │ Posts │ Media │ Users │ Menus │ Themes │ Settings  │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        PostgreSQL                   S3 / Local
```

### Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Page builder | Puck (don't build from scratch) | MIT, React-native, JSON output, 12k+ stars |
| Backend | Strapi (don't rebuild CMS) | Saves ~12 weeks on auth, media, API, content types |
| Puck data storage | JSON field on Page collection | No schema sync needed; Puck is source of truth |
| Admin UI | Custom Next.js admin | Replace Strapi admin for end users; Strapi admin for power users only |
| Deployment model | Docker Compose locally, split deploy in prod | WordPress-like local experience |
| Rendering (Next.js) | SSG + ISR for pages, SSR for dynamic routes | Performance + fresh content on publish |
| Rendering (React) | CSR with optional static export | Simpler hosting; same Puck JSON from Strapi |
| Frontend choice | `create-nextpress --template next\|react` | User picks target at scaffold time; shared packages stay identical |

---

## 3. What We Build vs What Strapi Handles

### Strapi Handles (Don't Build)

| Feature | Time Saved |
|---|---|
| User auth & roles | ~3 weeks |
| Media library & uploads | ~2 weeks |
| REST / GraphQL API | ~2 weeks |
| Content type schemas | ~2 weeks |
| Draft / publish workflow | ~1 week |
| Webhooks | ~1 week |
| Database migrations | ~1 week |
| **Total** | **~12+ weeks** |

### We Build (Core Product)

| Feature | Priority |
|---|---|
| Puck page builder integration | P0 |
| Custom admin dashboard | P0 |
| Block component library (15 blocks) | P0 |
| Public page renderer | P0 |
| Theme system | P1 |
| Navigation menus | P1 |
| Block patterns library | P1 |
| Plugin / hook system | P2 |
| `create-nextpress` CLI | P2 |
| Import / export | P2 |

---

## 4. Monorepo Structure

```
nextpress/
├── apps/
│   ├── web/                              # Next.js app (default)
│   └── react/                            # Vite + React SPA (optional frontend)
│       ├── app/
│       │   ├── (public)/                 # Public website routes
│       │   │   ├── page.tsx              # Homepage
│       │   │   ├── [slug]/page.tsx       # Dynamic pages
│       │   │   └── blog/
│       │   │       ├── page.tsx          # Blog listing
│       │   │       └── [slug]/page.tsx   # Blog post
│       │   ├── admin/                    # Admin dashboard
│       │   │   ├── layout.tsx            # Admin shell (sidebar + header)
│       │   │   ├── page.tsx              # Dashboard home
│       │   │   ├── login/page.tsx
│       │   │   ├── pages/
│       │   │   │   ├── page.tsx          # Pages list
│       │   │   │   ├── new/page.tsx      # Create page
│       │   │   │   └── [id]/
│       │   │   │       ├── page.tsx      # Page settings
│       │   │   │       └── edit/page.tsx # Puck editor
│       │   │   ├── posts/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── new/page.tsx
│       │   │   │   └── [id]/page.tsx
│       │   │   ├── media/page.tsx
│       │   │   ├── appearance/
│       │   │   │   ├── themes/page.tsx
│       │   │   │   ├── menus/page.tsx
│       │   │   │   └── customize/page.tsx
│       │   │   ├── plugins/page.tsx
│       │   │   ├── users/page.tsx
│       │   │   └── settings/page.tsx
│       │   └── api/
│       │       ├── revalidate/route.ts   # ISR webhook from Strapi
│       │       ├── auth/route.ts
│       │       └── pages/[id]/route.ts   # Proxy to Strapi
│       ├── components/
│       │   ├── blocks/                   # Frontend block components
│       │   │   ├── Hero.tsx
│       │   │   ├── Text.tsx
│       │   │   ├── Image.tsx
│       │   │   ├── Columns.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Gallery.tsx
│       │   │   ├── Testimonial.tsx
│       │   │   ├── Pricing.tsx
│       │   │   ├── FAQ.tsx
│       │   │   ├── ContactForm.tsx
│       │   │   ├── Video.tsx
│       │   │   ├── Spacer.tsx
│       │   │   ├── Divider.tsx
│       │   │   ├── Card.tsx
│       │   │   └── Stats.tsx
│       │   ├── admin/                    # Admin UI components
│       │   │   ├── sidebar.tsx
│       │   │   ├── header.tsx
│       │   │   ├── data-table.tsx
│       │   │   ├── stat-card.tsx
│       │   │   └── media-picker.tsx
│       │   └── puck/
│       │       ├── config.tsx            # Puck block registry
│       │       ├── editor.tsx            # Puck editor wrapper
│       │       └── render.tsx            # Puck → React renderer
│       └── lib/
│           ├── strapi.ts                 # Strapi API client
│           ├── auth.ts                   # JWT auth helpers
│           └── types.ts                  # Shared TypeScript types
│
├── strapi/                               # Strapi backend
│   ├── src/
│   │   ├── api/
│   │   │   ├── page/
│   │   │   ├── post/
│   │   │   ├── category/
│   │   │   ├── tag/
│   │   │   ├── menu/
│   │   │   ├── menu-item/
│   │   │   ├── theme/
│   │   │   ├── site-setting/
│   │   │   └── block-pattern/
│   │   └── extensions/
│   │       └── upload/                   # S3 provider config
│   └── config/
│       ├── database.ts
│       └── plugins.ts
│
├── packages/
│   ├── shared/                           # Shared types + constants
│   │   ├── types/
│   │   └── constants/
│   ├── blocks/                           # Framework-agnostic React block components
│   ├── puck-config/                      # Puck block registry (shared by Next + React)
│   └── strapi-client/                    # Strapi REST SDK (shared)
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json
├── turbo.json
├── .env.example
└── README.md
```

---

## 5. Strapi Content Model

### Page (Core Collection — stores Puck JSON)

```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "published", "scheduled"],
      "default": "draft"
    },
    "puck_data": { "type": "json", "required": false },
    "seo_title": { "type": "string" },
    "seo_description": { "type": "text" },
    "og_image": { "type": "media", "allowedTypes": ["images"] },
    "published_at": { "type": "datetime" },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::page.page"
    }
  }
}
```

**Puck data format stored in `puck_data`:**

```json
{
  "content": [
    {
      "type": "Hero",
      "props": {
        "title": "Welcome to Our Site",
        "subtitle": "Build something amazing",
        "backgroundImage": "/uploads/hero.jpg",
        "ctaText": "Get Started",
        "ctaUrl": "/contact",
        "alignment": "center"
      }
    },
    {
      "type": "Columns",
      "props": { "columns": 3 },
      "children": []
    }
  ],
  "root": { "props": { "title": "Home Page" } }
}
```

### Post

```json
{
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "excerpt": { "type": "text" },
    "content": { "type": "richtext" },
    "featured_image": { "type": "media", "allowedTypes": ["images"] },
    "status": { "type": "enumeration", "enum": ["draft", "published"] },
    "published_at": { "type": "datetime" },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "tags": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::tag.tag"
    },
    "seo_title": { "type": "string" },
    "seo_description": { "type": "text" }
  }
}
```

### All Collections Summary

| Collection | Key Fields | Purpose |
|---|---|---|
| **Page** | title, slug, puck_data (JSON), status, seo_*, author | Visual pages built with Puck |
| **Post** | title, slug, content, featured_image, category, tags | Blog posts |
| **Category** | name, slug, description | Blog categories |
| **Tag** | name, slug | Blog tags |
| **Menu** | name, location (header/footer) | Navigation menus |
| **Menu Item** | label, url, order, parent, menu | Menu links (nested) |
| **Theme** | name, slug, config (JSON), preview_image, is_active | Theme system |
| **Site Setting** | site_name, logo, favicon, social_links (JSON) | Global settings |
| **Block Pattern** | name, description, category, puck_data (JSON), preview_image | Reusable Puck layouts |

---

## 6. Puck Block Registry

### Phase 1 Blocks (15 blocks)

| Category | Blocks |
|---|---|
| **Layout** | Hero, Columns, Spacer, Divider |
| **Content** | Text, Image, Video, Card |
| **Marketing** | Testimonial, Pricing, FAQ, Stats |
| **Interactive** | Button, Contact Form, Gallery |

### Puck Config Structure

```typescript
// components/puck/config.tsx
export const puckConfig = {
  components: {
    Hero: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        backgroundImage: { type: "custom", render: MediaPickerField },
        ctaText: { type: "text", label: "Button Text" },
        ctaUrl: { type: "text", label: "Button URL" },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        title: "Welcome to Our Site",
        subtitle: "Build something amazing",
        alignment: "center",
      },
      render: HeroBlock,
    },
    // ... other blocks
  },
  categories: {
    layout: {
      title: "Layout",
      components: ["Hero", "Columns", "Spacer", "Divider"],
    },
    content: {
      title: "Content",
      components: ["Text", "Image", "Video", "Card"],
    },
    marketing: {
      title: "Marketing",
      components: ["Testimonial", "Pricing", "FAQ", "Stats"],
    },
    interactive: {
      title: "Interactive",
      components: ["Button", "ContactForm", "Gallery"],
    },
  },
};
```

### Block Patterns (Pre-built Layouts)

| Pattern | Blocks Included |
|---|---|
| Hero + Features | Hero, Columns (3x Card) |
| Pricing Table | Pricing |
| Team Section | Columns (4x Card with avatar) |
| Contact Page | Hero, ContactForm |
| Landing Page | Hero, Stats, Testimonial, Pricing, Button |
| About Page | Hero, Text, Columns (team), FAQ |

---

## 7. Admin Modules & Pages

### Modules

| # | Module | Description |
|---|---|---|
| 1 | **Authentication** | Login, forgot password, session management |
| 2 | **Dashboard** | Overview, stats, quick actions, recent activity |
| 3 | **Pages** | CRUD, status management, SEO settings |
| 4 | **Page Builder** | Puck drag-and-drop editor (core feature) |
| 5 | **Posts** | Blog CRUD with rich text editor |
| 6 | **Media Library** | Upload, browse, manage files |
| 7 | **Appearance — Themes** | Browse, activate, preview themes |
| 8 | **Appearance — Menus** | Create/edit navigation menus |
| 9 | **Appearance — Customize** | Global colors, typography, layout |
| 10 | **Plugins** | Install, activate, configure plugins |
| 11 | **Users** | Invite, manage users and roles |
| 12 | **Settings** | Site title, logo, permalinks, reading settings |

### Admin Pages

| # | Page | Route | Module |
|---|---|---|---|
| 1 | Login | `/admin/login` | Authentication |
| 2 | Dashboard | `/admin` | Dashboard |
| 3 | Pages List | `/admin/pages` | Pages |
| 4 | Create New Page | `/admin/pages/new` | Pages |
| 5 | Page Editor (Puck) | `/admin/pages/[id]/edit` | Page Builder |
| 6 | Page Settings | `/admin/pages/[id]` | Pages |
| 7 | Posts List | `/admin/posts` | Posts |
| 8 | Post Editor | `/admin/posts/new`, `/admin/posts/[id]` | Posts |
| 9 | Media Library | `/admin/media` | Media |
| 10 | Themes | `/admin/appearance/themes` | Appearance |
| 11 | Menus | `/admin/appearance/menus` | Appearance |
| 12 | Customize | `/admin/appearance/customize` | Appearance |
| 13 | Plugins | `/admin/plugins` | Plugins |
| 14 | Users | `/admin/users` | Users |
| 15 | Settings | `/admin/settings` | Settings |

### Public Website Pages

| # | Page | Route |
|---|---|---|
| 1 | Homepage | `/` |
| 2 | Dynamic Page | `/[slug]` |
| 3 | Blog Listing | `/blog` |
| 4 | Blog Post | `/blog/[slug]` |
| 5 | 404 Not Found | `/404` |

### Shared Admin Components

- Admin sidebar navigation
- Admin top bar (breadcrumbs, view site link, user menu)
- Data tables (pages, posts, users lists)
- Status badges (draft, published, scheduled)
- Confirmation dialogs
- Toast notifications
- Media picker modal
- Empty states

---

## 8. Data Flow

### Save Page (Puck → Strapi)

```
User edits in Puck Editor
  → Click Save / auto-save (debounced 30s)
  → PUT /api/pages/[id] (Next.js API route)
  → PUT /api/pages/:documentId (Strapi REST API)
  → Validate + save puck_data JSON to PostgreSQL
  → Return 200 → show "Saved" toast
```

### Publish Page (trigger ISR revalidation)

```
User clicks Publish in editor
  → PUT status=published to Strapi
  → Strapi webhook fires POST /api/revalidate
  → Next.js revalidatePath('/[slug]')
  → Public site serves updated page
```

### Render Public Page

```
Visitor requests /about-us
  → Next.js [slug]/page.tsx (Server Component)
  → Fetch page from Strapi (status=published, slug=about-us)
  → Pass puck_data to PuckRenderer
  → PuckRenderer maps block types → React components
  → Return rendered HTML (SSG/ISR)
```

### Media Upload

```
User uploads in Media Library or Puck editor
  → POST /api/upload (Next.js) → POST /api/upload (Strapi)
  → Strapi stores file (local dev / S3 prod)
  → Returns media object with URL
  → Available in media picker across admin
```

---

## 9. Authentication & Roles

### Auth Flow

```
User visits /admin
  → Middleware checks JWT cookie
  → No cookie → redirect to /admin/login
  → Login form → POST Strapi /api/auth/local
  → Strapi returns JWT
  → Set httpOnly cookie
  → Redirect to /admin dashboard
```

### Roles & Permissions

| Role | Pages | Posts | Media | Themes | Menus | Plugins | Users | Settings |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Super Admin** | Full | Full | Full | Full | Full | Full | Full | Full |
| **Admin** | Full | Full | Full | Full | Full | Full | Full | Full |
| **Editor** | Full | Full | Full | View | Full | — | — | — |
| **Author** | View | Own only | Upload | — | — | — | — | — |
| **Viewer** | View | View | View | — | — | — | — | — |

Configured via Strapi Users & Permissions plugin.

---

## 10. Phase-by-Phase Build Plan

### Phase 0 — Foundation (Week 1–2)

**Goal:** Dev environment runs with one command.

**Tasks:**

- [x] Initialize Turborepo monorepo with pnpm
- [x] Scaffold Next.js 15 app (`apps/web`)
- [x] Scaffold Vite + React app (`apps/react`) — public site shell
- [x] Create shared packages: `shared`, `strapi-client`
- [x] Scaffold Strapi 5 (`strapi/`)
- [x] Docker Compose: PostgreSQL + Strapi + Next.js (+ React optional profile)
- [x] Create Strapi content types: Page, Post, Category
- [x] Configure Strapi roles: Admin, Editor, Author
- [x] Basic Strapi SDK client in Next.js (`lib/strapi.ts`)
- [x] Environment variables (`.env.example`)
- [x] README with setup instructions

**Deliverable:** `docker compose up` → Strapi at `:1337`, Next.js at `:3000`

---

### Phase 1 — Page Builder MVP (Week 3–5)

**Goal:** Create, edit, and publish a page visually.

**Tasks:**

- [x] Install Puck in Next.js
- [x] Build 10 core block components (Hero, Text, Image, Columns, Button, Spacer, Divider, Card, Gallery, Video)
- [x] Puck config with block registry and categories
- [x] Admin layout (sidebar + header shell)
- [x] Login page + JWT auth flow
- [x] Pages list page (table: title, status, date, actions)
- [x] Create page flow (title → slug → open editor)
- [x] Puck editor page at `/admin/pages/[id]/edit`
- [x] Save Puck JSON to Strapi (`puck_data` field)
- [x] Load Puck JSON from Strapi on editor open
- [x] Public page renderer at `/[slug]`
- [x] Publish / unpublish toggle
- [x] Auto-save (debounced, every 30 seconds)
- [x] Preview page in new tab

**Deliverable:** Non-dev can log in, build a landing page with drag-and-drop, publish it, and view the live site.

---

### Phase 2 — CMS Essentials (Week 6–8)

**Goal:** Full content management (WordPress basics).

**Tasks:**

- [ ] Posts CRUD (list, create, edit with rich text)
- [ ] Categories and tags for posts
- [ ] Blog listing page (`/blog`)
- [ ] Blog post page (`/blog/[slug]`)
- [ ] Media library page (grid view, upload, delete, search)
- [ ] Media picker component (reused in Puck blocks + post editor)
- [ ] SEO fields on pages (title, description, OG image)
- [ ] Site settings page (site name, logo, favicon)
- [ ] Dashboard home (stats cards, recent pages/posts, quick actions)
- [ ] User management page (list, invite, change roles)
- [ ] Page revisions (store puck_data history)
- [ ] Duplicate page action
- [ ] Bulk actions on pages list (publish, draft, delete)

**Deliverable:** Run a full blog + business site without touching code.

---

### Phase 3 — Appearance & Themes (Week 9–11)

**Goal:** Change site look without losing content.

**Tasks:**

- [ ] Theme collection in Strapi
- [ ] 2 built-in themes (Default, Blog)
- [ ] Theme switcher in admin
- [ ] `theme.json`-like config (colors, fonts, spacing) stored in Strapi
- [ ] Global styles → CSS variables injection in Next.js layout
- [ ] Navigation menus (create, edit, nested items, drag reorder)
- [ ] Menu renderer component for public site header/footer
- [ ] Customize page (adjust global colors/fonts with live preview)
- [ ] Block patterns library (pre-built Puck layouts in Strapi)
- [ ] "Insert pattern" button in Puck editor
- [ ] Header/footer template parts (editable via Puck or dedicated editor)

**Deliverable:** Switch themes, customize colors/fonts, use pre-built patterns, manage navigation.

---

### Phase 4 — Extensibility & Polish (Week 12–14)

**Goal:** Plugin-ready, production-quality, open-source release.

**Tasks:**

- [ ] Plugin registry (Strapi collection + Next.js loader)
- [ ] Hook system (actions/filters in Next.js, WordPress-inspired)
- [ ] Reference SEO plugin
- [ ] Reference contact form plugin
- [ ] Import/export (JSON backup of all content)
- [ ] Strapi webhook → Next.js ISR revalidation on publish
- [ ] S3 media storage for production
- [ ] `create-nextpress` CLI scaffold command
- [ ] Production Docker Compose
- [ ] Documentation site
- [ ] CONTRIBUTING.md and issue templates
- [ ] GitHub open-source release

**Deliverable:** Installable open-source platform via CLI, documented, with reference plugins.

---

### Phase 5 — Growth (Ongoing)

- [ ] AI page generation (describe page → generate Puck blocks)
- [ ] Collaborative editing (multiplayer)
- [ ] Plugin marketplace
- [ ] Theme marketplace
- [ ] WordPress migration tool
- [ ] Multisite / multi-tenant support
- [ ] i18n / multi-language
- [ ] E-commerce plugin
- [ ] Analytics dashboard plugin

---

## 11. Docker Compose

### Development (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: nextpress
      POSTGRES_USER: nextpress
      POSTGRES_PASSWORD: nextpress
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  strapi:
    build: ./strapi
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: nextpress
      DATABASE_USERNAME: nextpress
      DATABASE_PASSWORD: nextpress
      JWT_SECRET: ${JWT_SECRET}
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
    ports:
      - "1337:1337"
    depends_on:
      - postgres
    volumes:
      - ./strapi:/app
      - strapi_uploads:/app/public/uploads

  web:
    build: ./apps/web
    environment:
      STRAPI_URL: http://strapi:1337
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
    ports:
      - "3000:3000"
    depends_on:
      - strapi

volumes:
  pgdata:
  strapi_uploads:
```

### Environment Variables (`.env.example`)

```env
# Strapi
JWT_SECRET=your-jwt-secret
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret

# Next.js
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
REVALIDATION_SECRET=your-revalidation-secret

# Production only
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_REGION=
```

### Quick Start

```bash
git clone https://github.com/your-org/nextpress.git
cd nextpress
cp .env.example .env
docker compose up
# → Next.js: http://localhost:3000
# → Admin:   http://localhost:3000/admin
# → Strapi:  http://localhost:1337/admin (power users only)
```

---

## 12. Integration Patterns

### Strapi Client

```typescript
// lib/strapi.ts
const STRAPI_URL = process.env.STRAPI_URL!;

export async function strapiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export const strapi = {
  find: <T>(collection: string, params?: Record<string, string>) =>
    strapiFetch<T[]>(`/${collection}?${new URLSearchParams(params)}`),

  findOne: <T>(collection: string, id: string, params?: Record<string, string>) =>
    strapiFetch<T>(`/${collection}/${id}?${new URLSearchParams(params)}`),

  create: <T>(collection: string, data: unknown, token: string) =>
    strapiFetch<T>(`/${collection}`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  update: <T>(collection: string, id: string, data: unknown, token: string) =>
    strapiFetch<T>(`/${collection}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
      headers: { Authorization: `Bearer ${token}` },
    }),
};
```

### Public Page Renderer

```typescript
// app/(public)/[slug]/page.tsx
import { strapi } from "@/lib/strapi";
import { PuckRenderer } from "@/components/puck/render";
import { puckConfig } from "@/components/puck/config";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const pages = await strapi.find("pages", {
    "filters[slug][$eq]": params.slug,
    "filters[status][$eq]": "published",
    "populate[og_image]": "true",
  });

  const page = pages[0];
  if (!page?.puck_data) notFound();

  return <PuckRenderer config={puckConfig} data={page.puck_data} />;
}

export async function generateStaticParams() {
  const pages = await strapi.find("pages", {
    "filters[status][$eq]": "published",
    "fields[0]": "slug",
  });
  return pages.map((page) => ({ slug: page.slug }));
}

export const revalidate = 3600;
```

### Puck Editor Save Handler

```typescript
// app/admin/pages/[id]/edit/page.tsx
"use client";

import { Puck } from "@measured/puck";
import { puckConfig } from "@/components/puck/config";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function PageEditor({ page }: { page: Page }) {
  const [data, setData] = useState(page.puck_data);

  const save = useDebouncedCallback(async (puckData: Data) => {
    await fetch(`/api/pages/${page.documentId}`, {
      method: "PUT",
      body: JSON.stringify({ puck_data: puckData }),
    });
  }, 30000);

  const handlePublish = async (puckData: Data) => {
    await fetch(`/api/pages/${page.documentId}`, {
      method: "PUT",
      body: JSON.stringify({
        puck_data: puckData,
        status: "published",
        published_at: new Date().toISOString(),
      }),
    });
  };

  return (
    <Puck
      config={puckConfig}
      data={data}
      onChange={(newData) => {
        setData(newData);
        save(newData);
      }}
      onPublish={handlePublish}
    />
  );
}
```

### ISR Revalidation Webhook

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.entry?.slug;

  if (slug) {
    revalidatePath(`/${slug}`);
  }
  revalidatePath("/");

  return NextResponse.json({ revalidated: true });
}
```

### Plugin Hook System

```typescript
// lib/hooks.ts
type ActionCallback = (...args: unknown[]) => void | Promise<void>;
type FilterCallback = (value: unknown, ...args: unknown[]) => unknown;

const actions = new Map<string, ActionCallback[]>();
const filters = new Map<string, FilterCallback[]>();

export function addAction(hook: string, callback: ActionCallback, priority = 10) {
  const existing = actions.get(hook) ?? [];
  existing.push(callback);
  existing.sort((a, b) => priority - priority);
  actions.set(hook, existing);
}

export function doAction(hook: string, ...args: unknown[]) {
  actions.get(hook)?.forEach((cb) => cb(...args));
}

export function addFilter(hook: string, callback: FilterCallback, priority = 10) {
  const existing = filters.get(hook) ?? [];
  existing.push(callback);
  filters.set(hook, existing);
}

export function applyFilters(hook: string, value: unknown, ...args: unknown[]) {
  return filters.get(hook)?.reduce((v, cb) => cb(v, ...args), value) ?? value;
}

// Available hooks:
// Actions:  page.beforeSave, page.afterSave, page.beforePublish, plugin.activate
// Filters:  page.metadata, block.render, menu.items, sitemap.urls
```

---

## 13. Deployment Strategy

### Local Development

```bash
docker compose up
```

All services run locally. Strapi uploads stored in Docker volume.

### Production

| Service | Platform | Notes |
|---|---|---|
| Next.js (apps/web) | Vercel | SSG/ISR for public pages, serverless API routes |
| Strapi | Railway / Fly.io / Render | Persistent Node.js process |
| PostgreSQL | Railway / Supabase / Neon | Managed Postgres |
| Media files | AWS S3 / Cloudflare R2 | Required — ephemeral filesystem on most hosts |
| Domain | Cloudflare | DNS + CDN |

### Production Checklist

- [ ] Configure Strapi S3 upload provider
- [ ] Set up Strapi webhook → Next.js `/api/revalidate`
- [ ] Environment variables in Vercel + Railway
- [ ] CORS config in Strapi for production domain
- [ ] SSL certificates (handled by Vercel/Railway)
- [ ] Database backups (automated via provider)
- [ ] Rate limiting on Strapi API

---

## 14. Success Metrics

| Phase | Success Criteria |
|---|---|
| **Phase 0** | `docker compose up` works, Strapi + Next.js communicate |
| **Phase 1** | Create and publish a 5-block landing page in under 10 minutes |
| **Phase 2** | Run a blog with 10 posts, media library, SEO fields |
| **Phase 3** | Switch theme without content loss, use block patterns |
| **Phase 4** | Third-party dev builds a plugin in under 1 day |
| **Phase 5** | 100+ GitHub stars, 5+ community plugins |

---

## 15. Future Roadmap (Post v1)

### v1.1 — Developer Experience

- Block SDK (create custom blocks with CLI)
- Theme SDK (create themes with CLI)
- Local development without Docker (optional)
- Hot reload for block components in editor

### v1.2 — Content Features

- AI page generation from text prompt
- Collaborative editing (multiplayer in Puck)
- Content scheduling (publish at future date)
- Multi-language / i18n support

### v2.0 — Platform

- Multisite (multiple sites, one install)
- Plugin marketplace
- Theme marketplace
- WordPress migration tool (import WP XML → NextPress)
- E-commerce plugin (products, cart, checkout)
- Analytics dashboard plugin

### v2.1 — Enterprise

- SSO / SAML authentication
- Audit logs
- Content approval workflows
- Role-based block restrictions (limit which blocks editors can use)
- White-label admin (custom branding)

---

## Appendix A: Key User Flows

### Flow 1: Create and Publish a Page

```
Login → Dashboard → "New Page" → Enter title + slug → Page Editor
→ Drag blocks from library → Configure block settings → Publish → View live site
```

### Flow 2: Write a Blog Post

```
Login → Posts → "New Post" → Write content in rich text editor
→ Set featured image → Assign category/tags → Publish
```

### Flow 3: Upload and Use Media

```
Login → Media → Upload files → Go to Page Editor → Select Image block
→ Click "Choose Image" → Media picker modal → Select file → Image appears in block
```

### Flow 4: Change Site Theme

```
Login → Appearance → Themes → Preview theme → "Activate" → Site restyles (content unchanged)
```

### Flow 5: Set Up Navigation

```
Login → Appearance → Menus → Create menu → Add pages/posts/custom links
→ Drag to reorder → Assign to "Header" location → Save
```

### Flow 6: Install a Plugin

```
Login → Plugins → "Add New" → Find plugin → Install → Activate → Configure in Settings
```

---

## Appendix B: Reference Projects

| Project | What to Learn | Use As |
|---|---|---|
| [Puck](https://github.com/puckeditor/puck) | Visual editor, block model | **Editor engine** |
| [NexPress](https://github.com/nexpress-cms/nexpress) | Monorepo structure, themes, plugins | Architecture reference |
| [Strapi](https://strapi.io/) | Dynamic Zones, media, roles | **Backend** |
| [WordPress Gutenberg](https://github.com/WordPress/gutenberg) | Block architecture, theme.json | Pattern reference |
| [shadcn/ui](https://ui.shadcn.com/) | Admin UI components | **Admin UI** |

---

## Appendix C: Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Puck API changes | Editor breaks | Pin version, follow Puck changelog |
| Strapi major version upgrade | Backend breaks | Pin Strapi 5.x, test upgrades in staging |
| Two-service deployment complexity | Harder for non-devs | Docker Compose abstracts this locally; CLI for prod |
| Block schema drift | Blocks break on old pages | Version blocks, migration scripts |
| Strapi admin confusion | Users find two admins | Hide Strapi admin URL; document for devs only |
| Media storage in production | Uploads lost on restart | S3/R2 from Phase 4 onwards |

---

*Last updated: June 2026*
