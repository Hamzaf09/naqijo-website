# Issue register — NaqiJo SEO, indexing and local audit

Round 1 (2026-10-24, early): local build only. Round 2 (2026-10-24, 09:20–09:45 UTC): **live production verified**, public search observed, fixes added.

Evidence labels: **LIVE** = observed on `https://www.naqijo.com`. **LOCAL** = local production build of the audit branch. **SEARCH** = third-party web-search tool (not Google). **CODE** = repository. **OWNER** = only the business can supply it.
Google Search Console and Google Business Profile were **not** accessible (see `final-verification.md`).

Status values: `FIXED-BRANCH` (fixed and verified locally, waiting for deployment) · `OPEN-OWNER` · `OPEN-REC` (recommendation) · `NOT-A-PROBLEM`.

## P1

| ID | Component | Evidence | Root cause | Impact | Action | Status |
|---|---|---|---|---|---|---|
| OPS-01 | Payload runtime (CMS, admin, API, `/health`) | LIVE: `/health`, `/admin`, `/admin/login`, `/api/*` all **500**. LOCAL repro: with `DATABASE_URI` unset the same routes 500 and the log shows the production guard in `src/payload.config.ts:61`; with an unreachable DB `/health` returns 503 JSON instead. See `evidence/live-runtime-cms-2026-10-24.md` | Most likely `DATABASE_URI` (or `PAYLOAD_SECRET`) missing/not Postgres in the Vercel **Production runtime** env. Inferred from behaviour, not read from Vercel | CMS/admin unusable; content edits cannot publish; health monitoring red. Public pages still 200 (prerendered). Lead capture unaffected (WhatsApp/email links) | Owner: Vercel → Settings → Environment Variables (Production): confirm `DATABASE_URI` (Supabase pooler, `postgres…`) and `PAYLOAD_SECRET` exist; check Runtime Logs for `/health`; redeploy. Supabase connector in claude.ai shows "needs reconnect" — also check the Supabase project is not paused | OPEN-OWNER |
| OPS-02 | ISR regeneration | LIVE: 80/93 responses `x-vercel-cache: STALE`; repeated requests stay STALE with `age` ≈ 31.7 days and growing | Revalidation imports the Payload config → same failure as OPS-01 | Site content frozen at the ~2026-09-22 render; only a redeploy updates pages. No indexing harm today | Resolves with OPS-01 | OPEN-OWNER |
| REL-01 | Deployment | LIVE sitemap `lastmod` = `2026-09-21T00:46:56.822Z` (96 s after `main` HEAD `0c68c1c`); live HTML = build of `0c68c1c`; branch fixes absent | Audit branch not merged/deployed (correct — no deploy authority here) | Fixes below are not live | Owner reviews and merges `claude/naqijo-seo-indexing-audit-b0h2dv` → Vercel production deploy; then run the post-deploy checks in `final-verification.md` | OPEN-OWNER |
| GSC-01 | "غير متوفرة" label in Search Console | No report/screenshot context; no GSC access | Unknown | Cannot be diagnosed from the site (all 92 URLs are technically indexable — see below) | Owner sends the screenshots listed in `google-search-console-action-plan.md` | OPEN-OWNER |
| NAP-01 | Secondary phone | LIVE footer/contact: `+962793200007` (matches repo + commit `0810c9c` "correct secondary phone"). Audit brief listed `+962792300005` | Conflicting sources | Wrong number on GBP/citations would hurt local trust | Owner confirms which secondary number is current; JSON-LD only uses the primary `+962792900008` | OPEN-OWNER |
| TRUST-01 | Homepage testimonials | LIVE `/ar`, `/en`: 3 testimonials ("أم أحمد / Um Ahmad", "م. خالد / Eng. Khaled", "السيدة رنا / Mrs. Rana") with 5 stars and a "عميل موثّق / verified" badge. CODE: from the initial template commit `bca3411`; `docs/00-project-scope.md` says testimonial data started as placeholders | Provenance unknown | If not real customers with consent, presenting them as verified is misleading (and conflicts with Google's review policies if ever reused). No review/rating markup is emitted | Owner confirms they are real (with consent) or replaces them with real reviews (e.g. from the Google profile once owned). Not changed by the audit | OPEN-OWNER |
| GBP-01 | Maps / Place ID / review link | LIVE: 0 Maps/review links on 92 pages, no `hasMap` in JSON-LD → `NEXT_PUBLIC_GOOGLE_MAPS_URL`/`REVIEW_URL` were empty at the build that is live | GBP ownership not obtained | Missing local signals and review CTA | See `google-business-profile-action-plan.md` | OPEN-OWNER |

## P2

| ID | Component | Evidence | Fix | Status / verification |
|---|---|---|---|---|
| HOME-01 | Home metadata `/ar`, `/en` | LIVE: title "نقي الرابية — حلولٌ هندسية متكاملة للبيت" / "NaqiJo — Integrated home engineering solutions"; description = tagline (26 / 37 chars); no `og:image`, no `og:url`, `og:locale` "ar"/"en". Cause: home page had no `generateMetadata` | `src/app/[locale]/page.tsx` `generateMetadata` via `pageMetadata` (CMS default SEO still wins); copy uses facts already on the site | FIXED-BRANCH (`7c267eb`). LOCAL: title/description/og:url/og:image/og:locale `ar_JO`/`en_US` present, canonical + hreflang unchanged, 0 duplicate titles/descriptions |
| SEO-01 | Sitemap `lastmod` | LIVE: all 92 = `2026-09-21T00:46:56.822Z` (build time) | Emit only truthful guide `dateModified` | FIXED-BRANCH (`7915bf5`). LOCAL: 12 `lastmod` (`2026-09-08`) |
| SEC-01 | Dependencies | `npm audit --omit=dev`: next 16.2.10 had 20 advisories (critical RCEs in image optimizer/`use cache`/next-og ranges); payload 3.86 (SQLi, API-key disclosure, S3 overwrite, import-export prototype pollution); sharp 0.35.3 | Patch bump: next + eslint-config-next 16.2.12, sharp 0.35.5 (separate commit) | PARTIAL, FIXED-BRANCH (`179323c`): next advisories 20 → 11. Remaining: next ≥16.4.3 (minor upgrade; 16.4.3 published 2026-10-23), Payload ≥3.90 (needs a migration check against a real DB), next's nested sharp 0.34.5, zod 4 (major). This app uses no `use cache`, no next/og, no optimized SVG |
| CNT-01 | 4 project pages | LIVE: ~90–125 words; meta descriptions 42–49 chars; generic brand images; outcomes not verifiable | — | OPEN-OWNER: confirm real projects + facts/photos, or decide remove/noindex |
| BRAND-01 | Entity disambiguation | SEARCH: "نقي"/"Naqi" results are dominated by Saudi companies (naqi.sa filters; Naqi Water Co., Tadawul 2282); "عمان" also matches Oman (عُمان). A search result points to an NSF public notice (nsf.org/about-nsf/public-notices/naqi) saying a "Naqi" brand has no NSF-certified products — page not opened (host blocked), relevance to this company not established; the site makes no NSF claim | Brand-name collision | Searchers/AI may conflate entities | Keep using the full name "نقي الرابية" + "عمّان، الأردن" (site already does); pick one GBP name and use it everywhere (see GBP plan). No code change | OPEN-REC |

## P3

| ID | Component | Evidence | Fix | Status |
|---|---|---|---|---|
| SEO-02 | Sitemap `x-default` | LIVE: 0 `x-default` in sitemap (page heads have it) | Added | FIXED-BRANCH (`7915bf5`) |
| SEO-03 | Internal links to `/water-filters-amman` | LIVE: 1 inbound link; footer link on 0/92 pages | Footer link AR/EN | FIXED-BRANCH (`7915bf5`); LOCAL: on 92/92 pages |
| NAP-03 | Phone display | LIVE: "+962 792900008"; NAP standard says "+962 79 290 0008" (meta description already uses it) | `formatPhone()` in footer, contact, Amman page; `tel:` unchanged | FIXED-BRANCH (`7c267eb`) |
| SD-01 | Product JSON-LD `manufacturer` | LIVE: all 22 products claim `manufacturer` = the company; no page text says it manufactures | Removed | FIXED-BRANCH (`7c267eb`) |
| CFG-01 | Google config | CODE: `NEXT_PUBLIC_GOOGLE_PLACE_ID` read but never used; CMS Settings field `mapUrl` ("Google Maps link") is never rendered | — | OPEN-REC: use one source (env vars) or wire `mapUrl`; tell editors the CMS field does nothing today |
| BRAND-02 | English spelling | CODE/LIVE: "Naqi Al Rabia" (standard, 28×), "Naqi Al-Rabia" (11×), "Naqi Al Rabieh" (founder title, "exactly as provided") | — | OPEN-OWNER: confirm spelling; GBP shows "Naqi jo" |
| CLAIM-01 | RO-BN01 "CE and ISO 9001" | CODE: added in `6463ae4` "from the product/box/kit" | — | OPEN-OWNER: keep proof on file |
| SEO-04 | `/` → `/ar` is 307 | LIVE | — | OPEN-REC (next-intl default; harmless) |
| SEO-05 | Long titles | LIVE: guide titles up to 95 chars | — | OPEN-REC (Google may truncate/rewrite) |
| SD-02 | FAQPage on 14 pages | LIVE: valid | — | NOT-A-PROBLEM: valid markup; Google limits FAQ rich results to authoritative government/health sites (Aug 2023), so expect no FAQ rich result |

## Verified not to be problems (LIVE unless noted)

- 92/92 sitemap URLs: 200, self-canonical, hreflang ar/en/x-default reciprocal, no `noindex`, no `X-Robots-Tag`, one H1, valid JSON-LD; live URL set = local URL set.
- All 52 historical GSC URLs exist and are in the sitemap; none is broken, redirected or blocked.
- `https://naqijo.com/*` → 308 → `https://www.naqijo.com/*`; `/` → 307 `/ar`; `/ar/` → 308 `/ar`; `/AR` → 307 `/ar`; unknown `/fr` → `/ar/fr` 404.
- `robots.txt` allows everything except `/admin`, `/api`; sitemap declared.
- 0 broken internal links (92 checked); 45 static/image assets all 200; 98 URLs referenced in JSON-LD all 200.
- Mobile render (Playwright Pixel 7, 12 pages): no JS errors, no failed requests, CLS 0, no horizontal scroll, correct `dir`.
- Footer links 19 px tall with 12 px gaps — meets WCAG 2.5.8 spacing exception.
- NAP on site is consistent AR/EN/footer/contact/JSON-LD.
