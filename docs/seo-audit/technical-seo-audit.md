# Technical SEO audit (local production build)

Method: `npm run build` with `NEXT_PUBLIC_SERVER_URL=https://www.naqijo.com`, an unreachable `DATABASE_URI`, then `next start -p 3100` and a crawler (`fetch`, no redirect following) over 93 URLs: the 92 sitemap URLs, the 52 historical GSC URLs (all inside the sitemap), plus `/`. Machine-readable results: `indexing-url-inventory.csv/.json`.

## Findings
- **Routes:** per locale: 14 static routes + 7 category pages + 11 products + 4 projects + 4 services + 6 guides = 46, × 2 locales = 92. `localePrefix: always`; `/` → 307 `/ar`; unknown route → 404.
- **Canonical:** 92/92 self-referential, absolute `https://www.naqijo.com/...`.
- **Hreflang:** `ar`, `en`, `x-default`(→`/ar`) in page head on 92/92; each target exists and returns 200 (reciprocal). Sitemap alternates now include `x-default` too.
- **Robots:** no `<meta name="robots">`, no `X-Robots-Tag` on any page. `robots.txt`: `Allow: /`, `Disallow: /admin`, `/api`, sitemap line.
- **Titles/descriptions:** present on all 92 pages; no duplicate titles or descriptions. **H1:** exactly one on all pages.
- **Sitemap:** valid XML, 92 URLs, 0 duplicates, absolute www URLs, no redirects/404s. `lastmod` fixed (SEO-01).
- **Rendering:** content is server-rendered in the initial HTML (crawler read it without JS). Browser-based rendering/CWV not run (no Lighthouse available).
- **Internal links:** 0 broken internal links; no orphans (min 1 inbound). Weakest: category pages `water-dispensers`, `water-pumps`, `air-purification`, `/water-filters-amman` (now footer-linked).
- **Images:** 0 `<img>` without `alt` on crawled pages.
- **Content depth:** word counts are approximate (crude HTML text extraction, header/footer excluded): products ~200–240, categories ~110–240, projects ~90–125 (short and unverified — CNT-01), contact/legal short (appropriate).
- **Resilience:** build and runtime pages succeed with the DB unreachable (products/services/projects/guides are static repo data; settings fall back to `siteConfig`). `vercel.json` build is `npm run build` (no `payload migrate`).
- **Security headers:** HSTS, nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy present locally. `npm audit` → SEC-01.
- **Language:** `<html lang dir>` correct (`ar`/`rtl`, `en`/`ltr`) per locale.

## Not verified (blocked)
Apex→www redirect chain, live status codes, compression/caching at the CDN, production env vars, Search Console state.
