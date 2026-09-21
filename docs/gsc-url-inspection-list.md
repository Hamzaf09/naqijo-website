# Search Console — Initial URL Inspection List (NaqiJo)

Prioritized list for **manual URL Inspection** in Google Search Console after
the property is verified and the sitemap is submitted. All URLs are on the
canonical host `https://www.naqijo.com`.

**Per-URL workflow** (same for every URL below):
1. Paste into the URL-inspection bar.
2. **Test Live URL** → crawl allowed + fetch successful.
3. Confirm indexing allowed (no `noindex`).
4. Confirm **user-declared canonical == Google-selected canonical** (the self `www` URL).
5. **Request indexing** — for Priority 1–2 and a few Priority-3 pages only.

> Do **not** bulk-request every URL. Google recommends the sitemap
> (`https://www.naqijo.com/sitemap.xml`) for multi-URL discovery; manual requests
> are for a small set of important or newly changed pages.

## Priority 1 — entry points
- https://www.naqijo.com/
- https://www.naqijo.com/ar
- https://www.naqijo.com/en

*(The apex `https://naqijo.com/` 308-redirects to `www`; inspect the `www` URLs.)*

## Priority 2 — primary sections (both locales)
| Page | Arabic | English |
|---|---|---|
| Products hub | /ar/products | /en/products |
| Services | /ar/services | /en/services |
| Projects | /ar/projects | /en/projects |
| Guides hub | /ar/guides | /en/guides |
| Amman local landing | /ar/water-filters-amman | /en/water-filters-amman |
| Commercial | /ar/commercial-water-treatment | /en/commercial-water-treatment |
| Contact | /ar/contact | /en/contact |
| About | /ar/about | /en/about |

## Priority 3 — key detail pages (representative, both locales)
Product categories:
- /{ar,en}/products/category/drinking-water
- /{ar,en}/products/category/water-softening
- /{ar,en}/products/category/central-filtration

Guides (cornerstone):
- /{ar,en}/guides/choosing-a-water-filter
- /{ar,en}/guides/reverse-osmosis-vs-filtration
- /{ar,en}/guides/hard-water-and-water-softeners
- /{ar,en}/guides/seven-stage-water-filters
- /{ar,en}/guides/central-vs-drinking-water-filter
- /{ar,en}/guides/water-filter-maintenance-signs

Representative products / services:
- a few top product detail pages under /{ar,en}/products/<slug>
- /{ar,en}/services/water and other /{ar,en}/services/<slug>

Inspect one or two of each type to confirm the template indexes correctly; the
sitemap covers the remaining detail pages.

## After inspection
- Watch **Pages (Indexing)** over the following days for indexed status.
- Re-inspect a page only after a meaningful content/canonical change.
- Never claim a page is "indexed" until Search Console shows "URL is on Google".
