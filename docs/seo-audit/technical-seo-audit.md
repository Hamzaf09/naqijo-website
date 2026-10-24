# Technical SEO audit — live production + audit branch

Date: 2026-10-24. Live crawl `2026-10-24T09:24:36Z` (UTC).

## How it was tested

| Layer | Method | Scope |
|---|---|---|
| Live HTTP | Scripted `fetch` from the audit container (US egress via HTTPS proxy; Vercel edge `iad1`), `redirect: manual`, sequential, 150 ms spacing, UA `NaqiJo-SEO-audit/1.0` | `/` + 52 historical GSC URLs + every live sitemap URL = 93 URLs; every internal link (92); every `/_next/static`, `/images`, `/brand`, `/_next/image` asset (45) |
| Live host behaviour | `curl -I` / `curl -L` | apex, www, trailing slash, case, unknown locale |
| Live rendering | Playwright Chromium, Pixel 7 emulation, `networkidle` + 1.5 s | 12 key pages (AR/EN home, products, product, category, service, guide, contact, Amman, commercial, project, FAQ) |
| Local | `npm run build` (DB unreachable) + `next start` + same crawler | audit branch HEAD |

Raw outputs: `evidence/live-crawl-2026-10-24.json`, `evidence/live-render-mobile-2026-10-24.json`, `evidence/live-structured-data-2026-10-24.json`, `evidence/live-robots-2026-10-24.txt`, `evidence/live-sitemap-headers-2026-10-24.txt`, `evidence/live-runtime-cms-2026-10-24.md`, screenshots `evidence/mobile-ar-*.webp`.

Not testable from here: plain `http://` (port 80) — the proxy only tunnels HTTPS.

## Host and redirects (LIVE, 09:22Z)

| Request | Result |
|---|---|
| `https://naqijo.com/` | 308 → `https://www.naqijo.com/` → 307 → `/ar` (200) |
| `https://naqijo.com/ar/products` | 308 → `https://www.naqijo.com/ar/products` (200) |
| `https://www.naqijo.com/` | 307 → `/ar` |
| `/ar/` | 308 → `/ar` |
| `/AR` | 307 → `/ar` |
| `/fr` | 307 → `/ar/fr` → 404 |

Apex→www is permanent (308) and path-preserving. No redirect loops. The 307 on `/` is next-intl's default and does not hurt indexing (the target `/ar` is the canonical).

## robots.txt and sitemap (LIVE)

- `robots.txt`: `Allow: /`, `Disallow: /admin`, `Disallow: /api`, `Sitemap: https://www.naqijo.com/sitemap.xml` (and a `Host:` line, ignored by Google).
- `sitemap.xml`: well-formed XML, 92 `<loc>`, 0 duplicates, all `https://www.naqijo.com/…`, all return 200 (no redirects, no 404, no noindex). The URL set is identical to the local build.
- Every `<lastmod>` = `2026-09-21T00:46:56.822Z` (deploy build time) → **SEO-01** (fixed on branch: only real guide dates).
- No `x-default` alternates in the sitemap → **SEO-02** (fixed on branch).
- Served `x-vercel-cache: HIT`, `age` 730 828 s.

## Page-level results (LIVE, 92 sitemap URLs)

| Check | Result |
|---|---|
| HTTP status | 92 × 200 |
| Canonical | 92/92 self-referential, absolute www |
| `meta robots` / `X-Robots-Tag` | none on any page (indexable) |
| hreflang | 92/92 have ar + en + x-default(→/ar…); 92/92 reciprocal (the other language page links back) |
| `<html lang dir>` | correct for both locales |
| H1 | exactly 1 on 92/92 |
| Titles / descriptions | present on 92/92; 0 duplicates. Home description only 26 (AR) / 37 (EN) chars → **HOME-01** (fixed on branch). Project descriptions 42–49 chars (CNT-01). Guide titles up to 95 chars (SEO-05) |
| Open Graph | `og:image` missing only on `/ar`, `/en` → HOME-01 |
| JSON-LD | 0 parse errors; see `structured-data-validation.md` |
| Error / fallback content | none detected |
| Images without `alt` | 0 |
| Internal links | 92 unique internal targets, 0 broken, 0 un-localized |
| Assets | 45 checked, 45 × 200 |
| Response time (from US) | p50 237 ms, p90 278 ms, max 493 ms |
| Edge cache | 80 STALE, 12 HIT, 1 none → ISR regeneration failing (**OPS-02**) |
| `google-site-verification` meta | absent on all pages (normal for a DNS-verified Domain property) |

The 52 URLs from the historical "غير متوفرة" list are all in this set and all pass. **Nothing on the site blocks or misdirects indexing.** Whether Google has indexed them is unknown (no GSC access).

## Live = `main` @ `0c68c1c`; branch not deployed

Live titles, descriptions, canonicals, H1s, JSON-LD types, hreflang and approximate word counts were compared with the local build. They differ nowhere except for the branch changes. The sitemap build timestamp is 96 s after `0c68c1c` was committed. Footer Amman link: live 0/92 pages, branch 92/92. → **REL-01**.

## Rendering (LIVE, mobile emulation, lab)

All 12 pages: HTTP 200, content present in the initial HTML and after render, no JS errors, no failed requests, CLS 0, no horizontal scroll, correct RTL/LTR. Screenshot `evidence/mobile-ar-home.webp` shows the hero H1, subtitle and CTAs above the fold. Numbers are in `performance-and-accessibility.md`.

## CMS / runtime (LIVE)

`/health`, `/admin`, `/api/*` return 500. Public pages keep working because they are prerendered, but ISR cannot refresh them. This is a production env issue, not a code defect. Details: **OPS-01/OPS-02** and `evidence/live-runtime-cms-2026-10-24.md`.

## Third-party search index (SEARCH, not Google)

The web-search tool (US engine) returned `https://www.naqijo.com/ar` (current title), `https://www.naqijo.com/en/about` (current title), and `https://naqijo.com/` with an **old** title "NaqiJo - Water Solutionنقي - حلول المياه النقية" and text ("sustainable hydration") that does not exist in the current code. That copy is most likely left over from an earlier site. The apex now 308-redirects, so it will update on recrawl. `site:naqijo.com` returned nothing in that engine. None of this shows Google's index.

## Changes made on the branch (all verified locally, none deployed)

| Commit | Change |
|---|---|
| `7915bf5` | sitemap `lastmod` only for real guide dates; sitemap `x-default`; footer link to `/water-filters-amman` |
| `7c267eb` | home `generateMetadata` (title, description, og:url/og:image/og:locale); `formatPhone` display per NAP standard; removed Product `manufacturer` |
| `179323c` | next/eslint-config-next 16.2.12, sharp 0.35.5 |

Local re-verification after all three: build OK (Next 16.2.12), 92 × 200, canonical/hreflang 92/92, 0 broken links, 45/45 assets, JSON-LD 0 issues, 0 duplicate titles/descriptions, footer Amman link 92/92.
