# Final verification

## Commands run and results (2026-10-24)
| Command | Result |
|---|---|
| `npm ci` | OK |
| `npm run lint` (before and after changes) | pass, no output |
| `npm run typecheck` (before and after) | pass |
| `npm run build` with `NEXT_PUBLIC_SERVER_URL=https://www.naqijo.com`, `DATABASE_URI` pointing at an unresolvable host (DB unavailable) | pass (before and after changes); all 92 pages prerendered |
| `next start -p 3100` + crawler over 93 URLs (before.json / after.json) | After: 92 × 200, 1 × 307 (`/`→`/ar`, expected); canonical OK 92/92; hreflang ar/en/x-default OK 92/92; h1=1 on all; 0 JSON-LD parse errors; 0 imgs without alt; 0 broken internal links; sitemap 92 URLs, 0 duplicates |
| `npm audit --omit=dev` | 36 advisories (3 critical, 16 high, 17 moderate) — not remediated, see SEC-01 |
| `curl https://www.naqijo.com/...` | **blocked**: 403 from sandbox proxy (network policy), also for example.com |

## Not run
Live production verification (redirect chain, apex→www, headers), Rich Results Test, Lighthouse/PageSpeed/CrUX, automated tests (the repo has no test script), Search Console, Business Profile.

## Git
- Work commit: `7915bf522f928b76f29c7be8e4b8a2da1e0eb69d` on `claude/naqijo-seo-indexing-audit-b0h2dv` (this report is committed after it).
- Push status: see the final response; no force-push used. No pull request created.
- Live deployment: **not confirmed** (nothing can be reached); verify the new sitemap after the Vercel deploy: 12 `<lastmod>` entries and `x-default` alternates.

## Remaining owner-only actions
See `issue-register.md` section B, `google-search-console-action-plan.md`, `google-business-profile-action-plan.md`.
