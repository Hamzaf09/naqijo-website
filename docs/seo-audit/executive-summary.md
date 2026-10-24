# Executive summary — 2026-10-24 (round 2: live verification)

## Status

| Area | Verified? |
|---|---|
| Live production site | **Yes**: 93 URLs, redirects, robots, sitemap, rendering, JSON-LD, assets (09:20–09:45 UTC) |
| Google Search Console | **No**: no account access in this session |
| Google Business Profile / Maps | **No**: no account access; Maps not reachable |
| Public search | Partly, via a third-party web-search tool (not Google) |
| Deployment of audit fixes | **No**: production still runs `main` @ `0c68c1c` |

## Findings

1. **Indexing:** every sitemap URL (92), including all 52 historical "غير متوفرة" URLs, is **technically indexable on the live site**. All return 200, are self-canonical, have reciprocal hreflang, and carry no noindex or robots block. Nothing on the site explains a site-wide indexing failure. What "غير متوفرة" means can only be established from the Search Console screen it came from.
2. **Production CMS is down (P1).** `/health`, `/admin` and `/api/*` return 500 live. A local reproduction points to a missing or invalid `DATABASE_URI` (or `PAYLOAD_SECRET`) in Vercel's Production runtime. Because of it, ISR regeneration fails and pages have been frozen since about 22 Sep. Public pages still work and lead capture (WhatsApp) is unaffected.
3. **Homepage metadata was weak (P2):** brand + tagline title, a 26/37-character description, no `og:image`. Fixed on the branch.
4. **Business data needing the owner:** secondary phone conflict; homepage testimonials shown as "verified" with unknown provenance; project case studies unverified; GBP links not configured.
5. **Brand collision:** in search, "نقي"/"Naqi" is dominated by Saudi companies.

## Fixed on branch `claude/naqijo-seo-indexing-audit-b0h2dv` (verified locally, not deployed)

| Commit | Fix |
|---|---|
| `7915bf5` | Sitemap `lastmod` only where truthful; sitemap `x-default`; footer link to the Amman page |
| `7c267eb` | Home title/description/og; phone display per NAP standard; removed unsupported Product `manufacturer` |
| `179323c` | Security patches: next 16.2.12 (9 advisories closed), sharp 0.35.5 |

## Next steps, in priority order

1. **Vercel:** fix the Production runtime env (`DATABASE_URI`, `PAYLOAD_SECRET`), check Runtime Logs, then merge the audit branch and deploy. Re-run the post-deploy checks in `final-verification.md`.
2. **Search Console:** send the screenshots listed in `google-search-console-action-plan.md`, starting with the "غير متوفرة" screen, the Page-indexing reasons table, and URL Inspection of `/ar` and `/en`.
3. **Business Profile:** confirm you are claiming the existing "Naqi jo" listing, not creating a new one. Finish verification, then set the three `NEXT_PUBLIC_GOOGLE_*` env vars. See `google-business-profile-action-plan.md`.
4. **Business facts:** answer the 8 questions in the GBP plan (secondary phone, hours, public name, services, socials, testimonials, projects).
5. **Security follow-up:** tested upgrade to next ≥16.4.3 and Payload ≥3.90, with a migration check against a staging DB.

Details: `issue-register.md` · `technical-seo-audit.md` · `structured-data-validation.md` · `performance-and-accessibility.md` · `indexing-url-inventory.csv/.json` · `evidence/`.
