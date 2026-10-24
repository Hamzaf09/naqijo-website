# Live runtime / CMS evidence — 2026-10-24 (UTC)

All requests: unauthenticated `GET`/`HEAD` from the audit container (HTTPS proxy, egress region US; Vercel edge `iad1`). No forms submitted, no logins.

## Payload routes (≈09:28Z)

| URL | Status | Body |
|---|---|---|
| `/health` | **500** | Next global error page "500: This page couldn’t load" (`x-vercel-cache: MISS`) |
| `/admin` | **500** | HTML error |
| `/admin/login` | **500** | HTML error |
| `/api/users/me` | **500** | HTML error |
| `/api/globals/settings` | **500** | HTML error |
| `/api/products?limit=1` | **500** | HTML error |
| `/api/graphql` | **500** | HTML error |

`src/app/health/route.ts` catches database errors and answers `503` JSON. A `500` therefore means the route failed before its `try` block, i.e. while importing the Payload config.

## Local reproduction (same code, `next start`, NODE_ENV=production)

| Runtime env | `/health` | `/admin` | `/ar` |
|---|---|---|---|
| `DATABASE_URI=postgres://…@nonexistent.invalid` (DB unreachable) | **503** JSON `{"status":"degraded","database":"unreachable"}` | 500 | 200 |
| `DATABASE_URI` **unset** | **500** "Internal Server Error"; log: `Error: DATABASE_URI is missing or not a Postgres URL in production` (guard in `src/payload.config.ts:61`) | 500 | 200 |

Production behaves like the second row. The same module-level class of failure also happens if `PAYLOAD_SECRET` is missing (`src/payload.config.ts:81`). Which variable is at fault can only be confirmed in Vercel → Project → Settings → Environment Variables (Production) and Runtime Logs.

## ISR regeneration (09:30:30Z–09:31:02Z)

| Page | Request 1 | Request 2 (+6 s) | Request 3 (+12 s) |
|---|---|---|---|
| `/en/faq` | STALE, age 2 737 305 s | STALE, age 2 737 312 s | STALE, age 2 737 318 s |
| `/ar/products/softener` | STALE, age 2 780 786 s | STALE, age 2 780 792 s | STALE, age 2 780 799 s |

A successful background revalidation would reset `age` and turn the next response into `HIT`. Both pages stay `STALE` and keep ageing (~31.7–32.2 days), so revalidation fails every time. Public pages are served from the copy generated around 2026-09-22. Crawl-wide: 80/93 responses `STALE`, 12 `HIT`.

## Deployed version

- Live `sitemap.xml`: every `<lastmod>` is `2026-09-21T00:46:56.822Z`. That is the build time stamp of the deployment, which is 96 s after `main` HEAD `0c68c1c` was committed (`2026-09-21T00:45:20Z`).
- Live HTML is identical to a local build of `0c68c1c` in titles, descriptions, canonicals, H1s, JSON-LD types and hreflang. It has neither of the audit-branch fixes (sitemap `x-default`, footer Amman link).
- Conclusion (inferred, not read from Vercel): production serves `main` @ `0c68c1c`. The audit branch is **not deployed**.
