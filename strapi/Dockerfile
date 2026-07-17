FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Monorepo workspace — Strapi depends on @nextpress/shared
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages ./packages
COPY strapi/package.json ./strapi/package.json
# postinstall runs patch-design-system.mjs — must exist before pnpm install
COPY strapi/scripts ./strapi/scripts

RUN pnpm install --filter strapi...
RUN pnpm --filter @nextpress/shared build

COPY strapi ./strapi

ENTRYPOINT ["sh", "/app/strapi/docker-entrypoint.sh"]
