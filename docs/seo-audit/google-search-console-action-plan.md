# Google Search Console action plan

**Access:** none. No Search Console connector or authenticated session was available. Nothing below is observed GSC data.

## What the site side shows (local build)
All 92 sitemap URLs, including all 52 historical URLs, are crawlable and eligible for indexing (200, self-canonical, no noindex, not blocked by robots.txt, in sitemap, reciprocal hreflang). That proves *technical eligibility only*. It does not prove Google discovered, crawled or indexed them. "92 discovered" in the sitemap report means Google read 92 URLs from the file, not that 92 are indexed.

## The label "غير متوفرة" — not diagnosable from the site
Possible origins (cannot choose between them without the screen): a "Last crawled" cell showing *N/A/unavailable* for URLs Google has not crawled yet; a URL Inspection "data unavailable" state; a Page Indexing row for URLs Google only knows from the sitemap. Each is *not* by itself a defect, and none can be inferred from the label alone.

## Owner checklist (property `naqijo.com`, Domain)
1. **Sitemaps** → confirm `https://www.naqijo.com/sitemap.xml` status "Success", note last read date and "Discovered pages". (After deploying this branch the sitemap drops `lastmod` for non-guide URLs; Google re-reads automatically.)
2. **Pages (Page indexing)** → send: total Indexed / Not indexed counts and the *reason table* (exact reasons: e.g. "Discovered – currently not indexed", "Crawled – currently not indexed", "Alternate page with proper canonical", "Page with redirect", "Excluded by noindex", "Blocked by robots.txt", "Soft 404", "Server error 5xx").
3. Open the row/screen that shows "غير متوفرة" and send a screenshot including the report name and column header.
4. **URL Inspection** (Inspect first, in order): `/ar`, `/ar/products`, `/ar/products/ro-bn01`, `/ar/water-filters-amman`, `/ar/contact`, `/ar/guides/central-vs-drinking-water-filter`, `/ar/services/solar`, `/ar/projects/apartment-abdoun`, then `/en/` equivalents. Record: "Indexing allowed", "User-declared vs Google-selected canonical", "Last crawl", "Page fetch".
5. Use **Request indexing** only on a handful of priority pages after inspection says "URL is not on Google" and the live test passes. Do not mass-submit.
6. **Security & Manual actions** → confirm "No issues".
7. **Settings → Crawl stats** → send host status and response-time trend (also checks apex vs www).
8. If `GOOGLE_SITE_VERIFICATION` is needed (URL-prefix property), set it in the host env; DNS-verified Domain property needs nothing.

## Interpreting results
- "Discovered/Crawled – currently not indexed" on many pages with short or unverified content (see CNT-01) is a quality/priority signal, fixed by content and internal-link improvements, not by resubmission.
- "Alternate page with proper canonical" on an `/en` page would be a real problem only if Google selected `/ar` as canonical; compare user vs Google canonical.
- Redirect rows for `/` or the apex host are expected.
