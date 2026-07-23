# NextPress Web

Public Next.js site for NextPress. Renders published builder pages from the CMS via `getCms()`.

## Develop

```bash
# from repo root (with Postgres + Strapi running)
pnpm --filter web dev
```

Open http://localhost:3000 (or the port from `docker compose`).

## Notes

- Use `@/lib/cms` (`getCms()`), not Strapi APIs directly.
- Admin / page builder lives in Strapi, not this app.
