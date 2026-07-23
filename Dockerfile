# syntax=docker/dockerfile:1
# Production image for the NaqiJo site (Next.js 16 + Payload CMS 3).
# Debian slim (not alpine) for reliable sharp + Payload native modules.

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build queries the CMS (SSG/ISR), so these must be available at build time.
# Pass them with --build-arg (they are NOT baked into the final image).
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ENV DATABASE_URI=$DATABASE_URI \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    NODE_ENV=production
RUN npm run build

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production PORT=3000
RUN groupadd -r nodejs && useradd -r -g nodejs -m nextjs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
# Applies pending DB migrations (idempotent), then starts the server.
ENTRYPOINT ["./docker-entrypoint.sh"]
