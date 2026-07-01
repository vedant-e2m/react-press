# NextPress

Open-source, WordPress-like platform for building **React** and **Next.js** websites with drag-and-drop.

**Stack:** Puck (editor) + Next.js or React (frontend) + Strapi 5 (backend) + PostgreSQL

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
cp strapi/.env.example strapi/.env

# 2. Start all services
docker compose up

# 3. Open in browser
# Next.js public site:  http://localhost:3000
# Admin (Phase 1+):     http://localhost:3000/admin
# Strapi admin:         http://localhost:1337/admin
```

### Optional: React SPA frontend

```bash
docker compose --profile react up
# React app: http://localhost:5173
```

### Local development (without Docker)

```bash
pnpm install

# Terminal 1 — PostgreSQL (or use Docker for postgres only)
docker compose up postgres

# Terminal 2 — Strapi
cd strapi && cp .env.example .env && pnpm install && pnpm develop

# Terminal 3 — Next.js
cd apps/web && pnpm dev

# Terminal 4 (optional) — React
cd apps/react && pnpm dev
```

## Monorepo Structure

```
nextpress/
├── apps/
│   ├── web/          # Next.js 15 — public site + admin
│   └── react/        # Vite + React — optional SPA frontend
├── packages/
│   ├── shared/       # Shared TypeScript types
│   └── strapi-client/# Strapi REST SDK (used by both frontends)
├── strapi/           # Strapi 5 backend
└── docker-compose.yml
```

## Phase 1 Status

- [x] Puck page builder with 10 blocks
- [x] Admin login, pages CRUD, drag-and-drop editor
- [x] Publish/unpublish, auto-save, preview, public `/[slug]` renderer

## Phase 0 Status

- [x] Turborepo monorepo with pnpm
- [x] Next.js 15 app (`apps/web`)
- [x] Vite + React app (`apps/react`)
- [x] Shared packages (`shared`, `strapi-client`)
- [x] Strapi 5 with Page, Post, Category, Tag content types
- [x] Docker Compose (PostgreSQL + Strapi + Next.js)
- [x] Strapi roles bootstrap (Editor, Author, public read)
- [x] Environment variables (`.env.example`)

## License

MIT
# react-press
