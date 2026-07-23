FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy monorepo workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc nextpress.config.ts ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --filter web...

COPY apps/web ./apps/web
COPY packages ./packages
COPY nextpress.config.ts ./

RUN chmod +x /app/apps/web/docker-entrypoint.sh

WORKDIR /app/apps/web
EXPOSE 3000

ENTRYPOINT ["/app/apps/web/docker-entrypoint.sh"]
