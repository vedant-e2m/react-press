FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY strapi/package.json strapi/pnpm-lock.yaml ./
RUN pnpm install --ignore-workspace --frozen-lockfile

COPY strapi/ .

EXPOSE 1337

CMD ["pnpm", "develop"]
