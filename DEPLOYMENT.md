# NaqiJo — Production Deployment Guide

Next.js 16 + Payload CMS 3, one app (public site + `/admin` + `/api`). The app is
**adapter-aware**: it uses Supabase Postgres + Supabase Storage in production and
SQLite + local disk in development, chosen automatically from env.

> You only need to provide external credentials (Supabase, domain, optional
> email). No further code changes are required to deploy.

---

## 0. Prerequisites

- Node.js ≥ 20.9 (22 LTS recommended)
- A Supabase project (free tier is fine)
- A host: **Vercel** (recommended), **Docker**, or a **self-hosted Node** server
- (Optional) A Resend account or SMTP server for password-reset emails

---

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com). Pick a region close to
   your host (e.g. `eu-central` if deploying to Vercel `fra1`).
2. **Database → Connection pooling** → copy the **Transaction pooler** URI
   (port `6543`). This is your `DATABASE_URI`:
   ```
   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
   ```

## 2. Configure Storage

1. **Storage → Create bucket** → name it `naqijo-media` → mark it **Public**.
2. **Storage → S3 access keys** (or Project Settings → Storage) → create an access
   key. Note the **Access key ID** and **Secret**.
3. Your S3 endpoint is `https://<ref>.supabase.co/storage/v1/s3`.

Media is stored here in production and **persists across redeploys**. Locally
(no S3 env) uploads go to `./media`.

## 3. Configure environment variables

Set these on your host (see `.env.example` for the full annotated list). Minimum
for production:

| Variable | Required | Notes |
| --- | --- | --- |
| `PAYLOAD_SECRET` | ✅ | `openssl rand -hex 32`. App refuses to boot without it in prod. |
| `DATABASE_URI` | ✅ | Supabase pooler URI (step 1). |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | e.g. `https://www.naqijo.com`. |
| `S3_ENDPOINT` `S3_BUCKET` `S3_REGION` `S3_ACCESS_KEY_ID` `S3_SECRET_ACCESS_KEY` | ✅ | Supabase Storage (step 2). |
| `RESEND_API_KEY` **or** `SMTP_*` | ⬜ | Enables password-reset emails. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | ⬜ | First admin (seed only). |
| `LOG_LEVEL`, `SENTRY_DSN` | ⬜ | Observability. |

## 4. Run migrations

Production **never auto-creates tables** — the schema ships as a committed
migration in `src/migrations/`. Apply it against Supabase:

```bash
# with the production env loaded (DATABASE_URI etc.)
npm run migrate           # apply pending migrations
npm run migrate:status    # verify (should show the migration as "Ran: Yes")
```

- On **Vercel** this runs automatically (the build command is
  `npm run migrate && npm run build`, see `vercel.json`).
- On **Docker** it runs automatically at container start (`docker-entrypoint.sh`).
- Migrations are additive and idempotent — safe to run repeatedly.

> After changing collections/fields later, regenerate a migration with
> `npm run migrate:create <name>` (requires a Postgres connection), commit it,
> and deploy.

## 5. Seed content (first deploy only)

Populates the CMS from the bundled content (products, services, projects,
homepage, settings, testimonials, FAQs) and the brand images. **Idempotent** —
re-running skips existing records.

```bash
# with production env loaded
npm run seed
```

The seed creates the first admin. If `SEED_ADMIN_PASSWORD` is unset it prints a
generated password once — **save it and change it after first login** (Admin →
your user → change password).

## 6. Deploy

### Vercel (recommended)
1. Import the GitHub repo.
2. Add all env vars (step 3) for the Production environment.
3. Deploy. `vercel.json` already sets the build command to migrate-then-build.
4. Point your domain at the project; set `NEXT_PUBLIC_SERVER_URL` to it.

### Docker
```bash
docker build \
  --build-arg DATABASE_URI="$DATABASE_URI" \
  --build-arg PAYLOAD_SECRET="$PAYLOAD_SECRET" \
  --build-arg NEXT_PUBLIC_SERVER_URL="$NEXT_PUBLIC_SERVER_URL" \
  -t naqijo:latest .

docker run -p 3000:3000 --env-file .env naqijo:latest
```
The container migrates then starts. (The build queries the CMS, so build args
must reach the DB; they are not baked into the final image.)

### Self-hosted Node
```bash
npm ci
npm run migrate
npm run build
npm run start        # serves on $PORT (default 3000) behind your reverse proxy
```
For a minimal standalone server, build with `NEXT_OUTPUT=standalone` and run
`node .next/standalone/server.js` (copy `.next/static` + `public` alongside it).

## 7. Verify production

- `GET /health` → `{"status":"ok","database":"connected", ...}` (200).
- Visit `/` (ar) and `/en` — hero, products, projects, testimonials render.
- `/admin` — log in; confirm collections + dashboard load.
- Upload an image in the admin → confirm it appears and survives a redeploy.
- `robots.txt` and `sitemap.xml` resolve with the correct domain.
- Trigger a password reset → confirm the email arrives (if email configured).

## 8. Rollback

- **App:** redeploy the previous Git tag/commit (Vercel: "Promote" a prior
  deployment; Docker: run the previous image tag).
- **Database:** every content collection has **version history** in the admin
  (restore any document to a prior version). For schema, migrations are
  reversible: `npm run migrate:down` reverts the last batch.
- **Full reset (destructive, non-prod):** `npm run migrate:fresh` drops and
  re-applies all migrations.

## 9. Backup

- **Database:** Supabase takes automatic daily backups (Database → Backups).
  For manual/off-site: `pg_dump "$DATABASE_URI" > backup.sql`.
- **Media:** stored in the Supabase Storage bucket — include it in your Supabase
  backup routine, or sync it with any S3 client.
- **Content export:** the admin supports CSV/JSON export per collection
  (Products, Services, Projects, Testimonials, FAQs, Posts) for portable dumps.

---

## Security notes
- Security headers (HSTS, nosniff, frame-options, referrer, permissions-policy)
  are set in `next.config.ts`. A strict CSP is intentionally omitted (it needs
  per-deployment tuning for the admin bundle + analytics) — add one at your edge
  if desired.
- Admin auth locks accounts for 10 min after 5 failed logins; cookies are
  `Secure` + `SameSite=Lax` in production; CORS/CSRF are pinned to
  `NEXT_PUBLIC_SERVER_URL`.
- Keep `PAYLOAD_SECRET` and DB/S3 credentials in the host's secret store only.
