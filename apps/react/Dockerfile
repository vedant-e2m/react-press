FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages ./packages
COPY apps/react/package.json ./apps/react/package.json

WORKDIR /app/apps/react
RUN pnpm install --filter react...

COPY apps/react ./apps/react
COPY packages ./packages

WORKDIR /app/apps/react
EXPOSE 5173

CMD ["pnpm", "dev", "--host"]
