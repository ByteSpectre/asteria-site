#!/usr/bin/env bash
# First deploy / update on VPS or WSL.
# From repo root: bash deploy/vps/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> Storage dirs"
mkdir -p storage/uploads storage/logs
chmod -R u+rwX storage

if [[ ! -f .env ]]; then
  echo "Missing .env. Copy env.wsl.example or env.production.example to .env and fill it in."
  exit 1
fi

echo "==> Dependencies"
npm ci

echo "==> PostgreSQL migrations"
npm run db:deploy

echo "==> Next.js build"
npm run build

echo "==> PM2"
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe asteria >/dev/null 2>&1; then
    pm2 reload deploy/vps/ecosystem.config.cjs --update-env
  else
    pm2 start deploy/vps/ecosystem.config.cjs
  fi
  pm2 save
  echo "Done. Check: pm2 status"
else
  echo "PM2 not installed. Run: npm run start"
  echo "Or: sudo npm i -g pm2 && bash deploy/vps/deploy.sh"
fi
