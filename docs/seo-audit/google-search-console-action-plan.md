# Google Search Console action plan

## Access status (2026-10-24)

**Search Console was not accessed.** This session had no browser, no Google connector, and no Google credentials (`gcloud auth list` → no accounts). The Search Console API endpoint was reachable but answered `401` without OAuth. Signing in would have required pasting a one-time authorization code into the chat, which this audit does not do. **Nothing here is Google account data.** The previously reported "~92 discovered pages" is historical and was not re-checked.

## What the live site proves, and what it does not

| Question | Answer | Basis |
|---|---|---|
| Are the 92 sitemap URLs crawlable and eligible for indexing? | **Yes** — 200, self-canonical, no noindex/X-Robots-Tag, not blocked by robots.txt, reciprocal hreflang, valid HTML/JSON-LD | LIVE crawl 2026-10-24T09:24Z |
| Do the 52 historical "غير متوفرة" URLs have a technical defect? | **No.** All exist, return 200 and are in the sitemap | LIVE |
| Has Google discovered / crawled / indexed them? | **Unknown** | needs GSC |
| What does "غير متوفرة" mean? | **Unknown — not diagnosable from the label** | needs the screen it came from |

Likely places the label comes from, **to be confirmed on screen**:
- The "Last crawled" column of a sitemap or Page-indexing drill-down showing "N/A / غير متوفر" for URLs Google has never crawled.
- A URL Inspection result whose data is not available yet.

Neither is a site defect. If Page indexing shows reasons such as "Discovered – currently not indexed" or "Crawled – currently not indexed", that is Google deprioritising pages (often thin or unverified content, few links), not a blocking error.

## Before inspecting: deploy

Production runs `main` @ `0c68c1c` and its CMS runtime is failing (see `issue-register.md` OPS-01/REL-01). Merge the audit branch and fix the runtime env first. Then run the post-deploy checks in `final-verification.md`. Otherwise URL Inspection will test the old homepage metadata and sitemap.

## Owner checklist (property: Domain `naqijo.com`)

1. **Confirm the property.** The property selector shows `naqijo.com` (Domain), not only a `https://www.naqijo.com/` URL-prefix property. Screenshot it.
2. **Sitemaps.** Confirm `https://www.naqijo.com/sitemap.xml`: status, "Last read", "Discovered pages". After deploying, click the sitemap → "Resubmit" once. The count should stay 92, and only guide URLs should carry `lastmod`.
3. **Pages (Page indexing).** Send screenshots of:
   - the chart with **Indexed** / **Not indexed** totals
   - the full **"Why pages aren't indexed"** table (every reason + count + validation status)
   - for each reason, the example URL list.
4. **The "غير متوفرة" screen.** Open the exact report/column where it appears and screenshot it with the report title and column header visible.
5. **URL Inspection**, in this order: `/ar`, `/en`, `/ar/products`, `/en/products`, `/ar/water-filters-amman`, `/ar/products/ro-bn01`, `/ar/products/category/drinking-water`, `/ar/services`, `/ar/guides/central-vs-drinking-water-filter`, `/ar/contact`, `/ar/faq`, `/ar/about`, `/ar/commercial-water-treatment`, `/ar/maintenance`. Then 1–2 URLs from each "not indexed" reason group. For each, record: verdict, discovery (sitemaps / referring page), last crawl, crawl allowed, page fetch, indexing allowed, user-declared vs Google-selected canonical.
6. **Request indexing — sparingly.** Only after a successful live test, only for priority pages that say "URL is not on Google": `/ar`, `/en`, `/ar/water-filters-amman`, `/ar/products`, `/ar/products/category/drinking-water`. Don't resubmit pages already "Discovered" or recently requested. Do **not** request the 4 project pages until their content is confirmed (CNT-01).
7. **Security & Manual actions.** Confirm "No issues detected" for both.
8. **HTTPS report** (if shown) and **Core Web Vitals** (field data, if any). Screenshot both.
9. **Settings → Crawl stats.** Screenshot host status (robots.txt fetch, DNS, server connectivity) and the response-code breakdown. Expect some 5xx if Googlebot touched `/api` or `/health`; robots.txt disallows `/api`.

## How to read the results

| You see | It means | Action |
|---|---|---|
| Indexed | Done | none |
| Discovered – currently not indexed | Google knows the URL and has not crawled it yet | Internal links + better content; wait; inspect a couple |
| Crawled – currently not indexed | Crawled, judged not worth indexing yet | Improve content (projects, thin categories); don't spam requests |
| Alternate page with proper canonical | Expected only for redirecting/duplicate URLs. **Not** expected for `/en/*` (each locale is self-canonical) | If on `/en`, send the inspection screenshot |
| Page with redirect | Expected for `naqijo.com/*`, `/`, trailing-slash URLs | none |
| Excluded by noindex / Blocked by robots.txt / Soft 404 / Server error (5xx) | **Not** expected for any sitemap URL (none reproduced live) | Send the URL + inspection |
