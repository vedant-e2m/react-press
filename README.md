# NextPress

Open-source, WordPress-like platform for building **React** and **Next.js** websites with drag-and-drop.

**Stack:** Puck (editor) + Next.js or React (frontend) + **Strapi 5** + PostgreSQL

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
cp strapi/.env.example strapi/.env

# 2. Start all services
docker compose up

# 3. Open in browser
# Next.js public site:  http://localhost:3001
# Admin (Phase 1+):     http://localhost:3001/admin
# Strapi REST API:      http://localhost:1338/api
# Strapi admin:         http://localhost:1338/admin
# Postgres (host):      localhost:5433
```

### Optional: React SPA frontend

```bash
docker compose --profile react up
# React app: http://localhost:5173
```

### Local development (without Docker)

```bash
pnpm install

# Terminal 1 — PostgreSQL
docker compose up postgres

# Terminal 2 — Strapi
cd strapi && cp .env.example .env && pnpm install --ignore-workspace && pnpm develop

# Terminal 3 — Next.js
cd apps/web && pnpm dev
```

## Monorepo Structure

```
nextpress/
├── apps/
│   ├── web/            # Next.js 15 — public site + admin
│   └── react/          # Vite + React — optional SPA frontend
├── packages/
│   ├── shared/         # Shared TypeScript types
│   ├── cms-core/       # CMS-agnostic ContentProvider contract
│   ├── cms-strapi/     # Strapi adapter
│   └── strapi-client/  # Strapi REST SDK
├── strapi/             # Strapi 5 backend
└── docker-compose.yml
```

## CMS architecture

The web app calls `getCms()` — never Strapi APIs directly. See [docs/cms-architecture.md](./docs/cms-architecture.md).

## Phase 1 Status

- [x] Puck page builder with 10 blocks
- [x] Admin login, pages CRUD, drag-and-drop editor
- [x] Publish/unpublish, auto-save, preview, public `/[slug]` renderer

## Phase 0 Status

- [x] Turborepo monorepo with pnpm
- [x] Next.js 15 app (`apps/web`)
- [x] Vite + React app (`apps/react`)
- [x] Shared packages (`shared`, `cms-core`, `cms-strapi`, `strapi-client`)
- [x] Strapi 5 backend
- [x] Docker Compose (PostgreSQL + Strapi + Next.js)
- [x] Environment variables (`.env.example`)

## License

MIT
