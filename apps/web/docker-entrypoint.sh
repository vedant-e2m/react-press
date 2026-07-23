#!/bin/sh
set -e

cd /app
CI=1 pnpm install --filter web...

cd /app/apps/web
exec pnpm dev
