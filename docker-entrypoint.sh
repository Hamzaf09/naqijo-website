#!/bin/sh
# Runs pending DB migrations (idempotent), then starts the production server.
# Migrations are additive and safe to run on every boot.
set -e

echo "→ Applying database migrations..."
npm run migrate

echo "→ Starting NaqiJo..."
exec npm run start
