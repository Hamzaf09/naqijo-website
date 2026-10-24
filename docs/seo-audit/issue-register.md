# Issue register — NaqiJo SEO / indexing / local audit (2026-10-24)

Evidence basis: local production build (`next start`, DB unreachable) crawled by a script; code review; docs review. **The live site (`naqijo.com`) could not be reached** — the sandbox network policy returns 403 on CONNECT for every external host. No Google Search Console or Google Business Profile access was available.

## A. Confirmed defects

| ID | Sev | Component | Evidence | Root cause | Impact | Fix | Implemented | Verification |
|---|---|---|---|---|---|---|---|---|
| SEO-01 | P2 | `src/app/sitemap.ts` `lastmod` | All 92 `<lastmod>` equal the build timestamp (`2026-10-24T09:05:19Z`) | `lastModified: new Date()` for every URL | Crawlers learn that every page changes on every deploy, so the signal gets ignored | `lastmod` only emitted for the 12 guide URLs (real authored `dateModified`); omitted elsewhere | Yes | Rebuilt sitemap: 12 `<lastmod>`, all `2026-09-08` |
| SEO-02 | P3 | sitemap hreflang | Page `<head>` had `x-default`, sitemap alternates did not | Sitemap built with only `ar`/`en` | Minor inconsistency between two hreflang sources | Added `x-default` → `/ar…` to sitemap alternates | Yes | Crawler: hreflang (ar, en, x-default) matches on 92/92 pages |
| SEO-03 | P3 | Internal linking | `/…/water-filters-amman` had 1 inbound link (contact page only) | Page not in nav/footer | Weak discoverability of the main local-intent page | Footer "Water filters in Amman" link (AR + EN) | Yes | Link renders on `/ar`, `/en` |

## B. Likely defects / risks needing owner evidence

| ID | Sev | Item | Why it matters | Needed |
|---|---|---|---|---|
| CNT-01 | P2 | 4 project pages (`villa-amman`, `apartment-abdoun`, `commercial-tower`, `restaurant-jabal`) read as illustrative case studies with unverifiable outcomes ("lighter electricity bill", etc.); `docs/00-project-scope.md` says project data started as placeholders; images are generic brand images | Unverified claims on indexable pages are a trust/quality risk and may explain weak indexing of `/projects*` | Owner confirms each is a real project and supplies verified facts/photos, or tells us to remove or noindex them. **Not changed**: deleting or noindexing needs owner decision |
| NAP-01 | P1 | Secondary phone conflict: repo and docs use `+962793200007` (commit `0810c9c` "correct secondary phone"); the audit brief lists `+962792300005` | Inconsistent phone data across site, GBP and citations hurts local trust | Owner states the correct secondary number. JSON-LD emits only the primary `+962792900008`, so structured data is not affected either way |
| NAP-02 | P2 | Footer/contact use CMS Settings phones when the DB is reachable; JSON-LD uses `siteConfig` constants | CMS values could diverge from schema | Owner checks CMS Settings → phones/address match `siteConfig` (run `npm run sync:contact` only after confirming values) |
| GBP-01 | P1 | `NEXT_PUBLIC_GOOGLE_MAPS_URL / PLACE_ID / REVIEW_URL` unset (repo contains no values; production env not readable) so no Maps/Review CTAs and no `hasMap` | Missing local signals | Obtain from the verified GBP after ownership is granted (see GBP plan) |
| GBP-02 | P2 | No official `sameAs` social URLs (`siteConfig.social` all empty) | Weaker entity linking | Owner supplies real profile URLs |
| SEC-01 | P2 | `npm audit --omit=dev`: 36 advisories (3 critical, 16 high) incl. `next`, `payload`, `@payloadcms/*`, `sharp`, `zod` | Dependency exposure | Plan a tested dependency upgrade; **not done here** (breaking-change risk, out of SEO scope) |
| GSC-01 | P1 (unknown) | The "غير متوفرة" label could not be diagnosed — no screenshot/report context | See `google-search-console-action-plan.md` | Owner provides the report/column/screenshot |
| LIVE-01 | — | Live production audit (redirect chains, apex→www, headers, CWV) not performed | Blocked by network policy | Re-run `scripts`-less crawl after allowing `naqijo.com` |

## C. Recommendations (P3)

- `/` → `/ar` returns 307 (temporary). Fine for crawlers, but 308 would signal permanence; next-intl default, left unchanged.
- Category pages `water-dispensers`, `water-pumps`, `air-purification` have a single inbound link; consider linking them from related guides/products.
- Contact, About, Privacy, Terms have no BreadcrumbList (acceptable for top-level pages).
- Terms/privacy/consultation are in the sitemap (indexable); acceptable, optional to drop.

## D. Not problems

- 92 sitemap URLs: 0 duplicates, all 200, no noindex, no `X-Robots-Tag`, self-canonical, reciprocal hreflang.
- All 52 historical GSC URLs exist, return 200, are in the sitemap.
- `/` redirect is intentional (REDIRECT_EXPECTED).
- JSON-LD: 0 parse errors on 93 pages; no fabricated `offers`, ratings, reviews, hours, geo.
- Build succeeds with the DB unreachable (graceful fallback).
- `robots.txt` blocks only `/admin` and `/api`; no page images load from `/api/media` (0 matches), so image crawling is not blocked.
