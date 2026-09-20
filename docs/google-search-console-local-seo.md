# Google Search Console — Local SEO Procedures (NaqiJo)

Procedure only. **No Search Console data or access is claimed here** — this
session has none. When the owner has GSC access, follow these steps. The site's
verification hook already exists: set `GOOGLE_SITE_VERIFICATION` (and optionally
`BING_SITE_VERIFICATION`) in the host env and the layout emits the meta tag (see
`src/app/[locale]/layout.tsx`).

## 1. Verify the property
- Prefer a **domain property** (`naqijo.com`) via DNS TXT — covers http/https,
  www/non-www, and all subpaths.
- Or a URL-prefix property for `https://www.naqijo.com` using the
  `GOOGLE_SITE_VERIFICATION` meta tag already wired into the site.

## 2. Submit the sitemap
- Submit `https://www.naqijo.com/sitemap.xml` under Sitemaps.
- Confirm it's read without errors and the discovered-URL count is sensible
  (static routes + product/category/service/project/guide URLs, ar + en).

## 3. URL inspection (spot-check the local-critical pages)
Inspect and request indexing for both locales of:
- `/` , `/ar` and `/en`
- `/water-filters-amman`
- `/commercial-water-treatment`
- `/contact`, `/about`
- `/products` and the 7 `/products/category/*`
- `/guides` and each guide
Check: "URL is on Google", the **user-declared canonical** matches the
**Google-selected canonical**, and the correct locale is indexed.

## 4. Canonical checks
- Each page's canonical is self-referential (verified in build output).
- No page canonicalizes to the locale home by accident (fixed in Phase 1).

## 5. hreflang checks
- Use the International Targeting / URL inspection to confirm `ar` / `en` /
  `x-default` alternates resolve and reciprocate.
- Sitemap carries `xhtml:link` alternates for every URL.

## 6. Local landing-page checks
- Confirm `/water-filters-amman` (ar + en) is indexed and shows the intended
  title/description; watch its impressions for local-intent queries.
- Confirm it is **not** duplicated by any near-identical city page (none exist —
  see `docs/local-nap-standard.md` and Phase 6 duplicate-safety audit).

## 7. Structured-data monitoring
- In GSC "Enhancements" and the Rich Results Test, validate: Organization,
  LocalBusiness, WebSite, Product, Service, BreadcrumbList, Article, FAQPage.
- Confirm exactly **one** LocalBusiness/Organization entity (site-wide `@graph`).
- Re-test after any schema change.

## 8. Query monitoring (Performance report)
- **Branded / entity queries:** "NaqiJo", "Naqi Al Rabia", "نقي الرابية" — track
  impressions/clicks and that the site owns them.
- **Local-intent queries:** "water filters Amman", "فلاتر مياه عمان", "سوفتنر
  عمان", "فلتر RO الأردن", "water treatment Amman" — track which page ranks and
  its position trend (observe, don't promise).
- **Informational queries:** guide topics (RO vs filtration, 7-stage, hard water,
  maintenance) — confirm the guides are the landing pages.

## 9. GBP ↔ website consistency checks (recurring)
- NAP on the site matches the GBP and `docs/local-nap-standard.md`.
- The website URL in GBP is exactly `https://www.naqijo.com`.
- Categories/services in GBP mirror the site's real offerings.
- If `NEXT_PUBLIC_GOOGLE_MAPS_URL` is set, the site's Maps link points to the same
  place as the GBP.

## Cadence
- **Weekly (first month):** coverage errors, new impressions, indexing of new pages.
- **Monthly (ongoing):** query trends, structured-data status, NAP/GBP consistency.
