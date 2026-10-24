# Final verification

Round 1 (local only) → round 2, 2026-10-24 ≈09:05–09:45 UTC (live production + fixes).

## Access obtained in round 2

| Resource | Result |
|---|---|
| `https://www.naqijo.com`, `https://naqijo.com` | **Reachable** after the owner opened the environment's network allowlist (was 403 at the proxy) |
| Other hosts (google.com, bing.com, validator.schema.org, Rich Results Test, facebook.com, maps.app.goo.gl) | Blocked (only `naqijo.com` allowed) |
| WebFetch tool | Not usable (DNS failure even for example.com) |
| Web-search tool | Works; US third-party engine, **not Google** |
| PageSpeed Insights API | Reachable, `429` daily quota exhausted |
| Search Console API | Reachable, `401` (no OAuth). No Google account in `gcloud`; no browser; no Google connector |
| Vercel connector | Configured, but failed to connect in this session ("CLIENT_HTTP_NOT_IMPLEMENTED"). Deployment state was inferred from the live site, not read from Vercel |
| GitHub | Works (repo, branches, PRs). No open PR for the audit branch |

## Commands and results

| # | Command / test | Result |
|---|---|---|
| 1 | `git status`, `git fetch`, `merge-base` | Branch clean at `68dc975`; audit commits **not** in `origin/main` (HEAD `0c68c1c`) |
| 2 | `curl` host/redirect matrix (09:22Z) | apex 308→www; `/` 307→`/ar`; `/ar/` 308; `/AR` 307; `/fr` → 404 |
| 3 | Live `robots.txt`, `sitemap.xml` | 200; 92 URLs, well-formed, identical to local set; all `lastmod` = `2026-09-21T00:46:56.822Z`; no `x-default` |
| 4 | Live crawl, 93 URLs + 92 internal links + 45 assets (09:24:36Z) | 92×200 + 1×307; canonical 92/92; hreflang + reciprocity 92/92; H1=1 92/92; 0 noindex; 0 JSON-LD errors; 0 broken links; 45/45 assets; footer Amman link 0/92 |
| 5 | Live vs local field diff | No differences in title/description/canonical/H1/JSON-LD types/hreflang → live = `0c68c1c` |
| 6 | Playwright mobile render, 12 pages | 0 JS errors, 0 failed requests, CLS 0, no overflow (see performance report) |
| 7 | Live JSON-LD validation, 92 pages + 98 referenced URLs | 0 issues; 98/98 URLs 200; Product has no offers/review (no product rich results expected); `manufacturer` on 22 products |
| 8 | Live `/health`, `/admin`, `/api/*` | **500** |
| 9 | Local repro: `/health` with unreachable DB vs unset `DATABASE_URI` | 503 JSON vs 500 + guard error → production matches "unset/invalid env" |
| 10 | ISR test: 3 requests × 2 pages, 6 s apart | Always `STALE`, `age` ≈31.7 days and rising → revalidation failing |
| 11 | Web searches (`site:naqijo.com`, `site:www.naqijo.com/ar`, `"naqijo.com"`, brand AR/EN, "Naqi jo" Maps, socials) | Engine shows `/ar`, `/en/about`, and the apex with an old title; no GBP/social results; Saudi "Naqi" brand dominates |
| 12 | `npm run lint` / `npm run typecheck` (after `7c267eb`, after `179323c`) | pass / pass |
| 13 | `npm run build` (NODE_ENV=production, DB unreachable) after each commit | pass; Next 16.2.12 after `179323c` |
| 14 | Local crawl + JSON-LD checks on final branch build | 92×200; canonical/hreflang 92/92; 0 broken; 45/45 assets; 0 SD issues; 0 dup titles/descriptions; footer Amman 92/92; home og:image/og:url/og:locale present; phones "+962 79 290 0008"; no `manufacturer` |
| 15 | `npm audit --omit=dev` | before: next 20 advisories; after: next 11. Package totals unchanged (36: 3 critical, 16 high, 17 moderate) because Payload, next's nested sharp 0.34.5 and zod remain |
| — | Automated unit tests | none exist in the repo (no `test` script) |
| — | Rich Results Test, Lighthouse, field CWV, GSC, GBP | **not run**, blocked as above |

## Git

| Item | Value |
|---|---|
| Branch | `claude/naqijo-seo-indexing-audit-b0h2dv` |
| Round-1 commits | `7915bf5`, `68dc975` |
| Round-2 commits | `7c267eb` (SEO fixes), `179323c` (deps), plus the report commit that contains this file |
| Push | see final response; no force-push |
| Pull request | not created |
| **Deployed?** | **No.** Production = `main` @ `0c68c1c` (inferred from the sitemap build stamp and content parity) |

## Post-deploy checks (run after merge + Vercel deploy)

```bash
curl -s https://www.naqijo.com/sitemap.xml | grep -c '<lastmod>'          # expect 12
curl -s https://www.naqijo.com/sitemap.xml | grep -c 'hreflang="x-default"' # expect 92
curl -s https://www.naqijo.com/en | grep -o '<title>[^<]*'                  # expect "NaqiJo — Water Filtration & Treatment in Jordan Since 2005"
curl -s https://www.naqijo.com/ar | grep -c 'og:image'                      # expect ≥1
curl -s https://www.naqijo.com/ar | grep -c '/ar/water-filters-amman'       # expect ≥1 (footer)
curl -s https://www.naqijo.com/ar/products/ro-bn01 | grep -c '"manufacturer"' # expect 0
curl -s -o /dev/null -w '%{http_code}\n' https://www.naqijo.com/health      # expect 200 once OPS-01 is fixed (503 = DB unreachable, 500 = env missing)
curl -sI https://www.naqijo.com/en/faq | grep -i x-vercel-cache             # a second request shortly after should be HIT once OPS-01 is fixed
```

## Remaining owner-only actions

1. Fix Vercel Production runtime env (`DATABASE_URI`, `PAYLOAD_SECRET`); check Runtime Logs; confirm the Supabase project is active.
2. Review and merge the audit branch; deploy; run the post-deploy checks.
3. Search Console screenshots per `google-search-console-action-plan.md`.
4. GBP: confirm the existing listing is being claimed (not a new one); finish verification; set the `NEXT_PUBLIC_GOOGLE_*` env vars.
5. Answer the business-fact questions in `google-business-profile-action-plan.md`.
6. Plan the next ≥16.4.3 / Payload ≥3.90 upgrade on a staging deployment.
7. To enable a future live session: allow `search.google.com`, `validator.schema.org` and `pagespeedonline.googleapis.com` (with an API key) in the environment, and reconnect the Vercel connector.
