#!/bin/sh
set -e

cd /app
CI=1 pnpm install --filter strapi... --no-frozen-lockfile
pnpm --filter @nextpress/shared build
NEXTPRESS_KEEP_DESIGN_SYSTEM_MJS=1 node /app/strapi/scripts/patch-design-system.mjs
rm -rf /app/strapi/node_modules/.strapi/vite

cd /app/strapi
exec pnpm develop
