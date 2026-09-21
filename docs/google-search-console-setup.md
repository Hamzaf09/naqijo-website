# Google Search Console — Setup & Indexing Playbook (NaqiJo)

Step-by-step setup for `https://www.naqijo.com`. **Procedure only — this repo
holds no Search Console access or token.** For the ongoing local-SEO monitoring
procedures see `docs/google-search-console-local-seo.md`; this document is the
first-time **setup + verification + indexing** guide.

> **Verified live at audit time (Phase 7):**
> `https://www.naqijo.com/robots.txt` → 200, references the sitemap.
> `https://www.naqijo.com/sitemap.xml` → 200, valid XML, all URLs on the
> canonical `https://www.naqijo.com` host (no localhost / preview / http / admin
> / api). `https://naqijo.com/*` **308-redirects to `https://www.naqijo.com/*`**.
> Pages emit self-referential canonicals and `ar` / `en` / `x-default` hreflang.

## 1. Property to create

Create a property for the business site in Search Console (search.google.com/search-console).

## 2. Domain property vs URL-prefix

- **Recommended: Domain property `naqijo.com`.** It covers every subdomain and
  protocol — `naqijo.com`, `www.naqijo.com`, `http`/`https` — in one property, so
  the apex→www 308 redirect and both hosts are all reported together. Requires
  **DNS TXT** verification (below).
- **Alternative: URL-prefix property `https://www.naqijo.com`.** Narrower (this
  exact origin only), but supports the HTML-meta-tag verification the site
  already wires up. Use this if DNS access is unavailable.

Given the apex→www redirect, the domain property is the cleaner choice.

## 3. Verification method

**Option A — DNS TXT (for the domain property, preferred):**
Add the TXT record Google shows to the `naqijo.com` DNS zone (registrar/DNS host),
then click Verify. No code change needed.

**Option B — HTML meta tag (for the URL-prefix property):**
The site already supports this — do **not** hardcode a token:
1. In the hosting env (Vercel → Project → Settings → Environment Variables), set
   `GOOGLE_SITE_VERIFICATION` to the token Google gives (the raw token only, not
   the full tag).
2. Redeploy. The layout then renders
   `<meta name="google-site-verification" content="…">` on every page
   (see `src/app/[locale]/layout.tsx`; it renders **only** when the env var is set).
3. Click Verify.
> Audit note: this meta tag is **not** currently present in production, i.e.
> `GOOGLE_SITE_VERIFICATION` is not yet set. Setting it is a required manual step
> for Option B. (`BING_SITE_VERIFICATION` works the same way for Bing.)

Never commit the token to the repository — it stays in the environment.

## 4. Sitemap URL

Submit exactly:

```
https://www.naqijo.com/sitemap.xml
```

Under **Indexing → Sitemaps**. It lists every canonical page (both locales) with
`xhtml:link` hreflang alternates and is regenerated on each deploy.

## 5. Initial URL Inspection workflow

For a URL (see the priority list in §14 and `docs/gsc-url-inspection-list.md`):
1. Paste it into the top **URL inspection** bar.
2. **Test Live URL** → confirm "URL is available to Google" (crawl allowed, fetch OK).
3. Confirm **User-declared canonical** matches **Google-selected canonical**
   (both should be the `https://www.naqijo.com/...` self URL).
4. Confirm no `noindex` and that indexing is allowed.
5. **Request indexing** for a small set of important pages only (see §14) — not
   in bulk; the sitemap handles discovery of the rest.

## 6. Important pages to inspect

See §14 and `docs/gsc-url-inspection-list.md` for the prioritized list.

## 7. Reports to monitor

- **Pages (Indexing):** indexed vs not-indexed, with reasons.
- **Sitemaps:** read status + discovered URL count.
- **Performance:** clicks/impressions/position by query and page.
- **Enhancements / Rich results:** structured-data validity.
- **Core Web Vitals** and **Mobile Usability** (via the Experience/CWV report).
- **Removals / Manual actions / Security issues:** should stay clean.

## 8. Indexing troubleshooting

- **"Discovered – currently not indexed" / "Crawled – not indexed":** normal for
  new/low-signal pages; ensure internal links point to them and give it time.
  Don't spam re-index requests.
- **"Duplicate, Google chose different canonical":** confirm the page's canonical
  is the self `www` URL (it is) and that it's linked/among sitemap entries.
- **"Blocked by robots.txt":** only `/admin` and `/api` are disallowed by design;
  a public page showing this means a wrong path — check the URL.
- **"Page with redirect":** expected for `naqijo.com` (apex) → `www`. Index the
  `www` URLs.
- **404 in sitemap:** should not happen (sitemap is generated from real routes);
  if seen, a slug was removed — redeploy regenerates the sitemap.

## 9. Core Web Vitals monitoring

Watch the CWV report (field data) for LCP / INP / CLS on mobile and desktop.
Investigate any "Poor"/"Needs improvement" URL groups. Do not chase synthetic
scores over real field data.

## 10. Rich result monitoring

Validate and monitor the structured data the site emits: **Organization,
LocalBusiness, WebSite, Product, Service, BreadcrumbList, Article, FAQPage.**
Use the Rich Results Test on representative URLs and watch the Enhancements
reports for errors/warnings. There must remain exactly **one** LocalBusiness /
Organization entity (the site-wide `@graph`).

## 11. Search performance monitoring

Track three query groups (observe trends; never promise rankings):
- **Branded/entity:** NaqiJo, Naqi Al Rabia, نقي الرابية.
- **Local-intent:** water filters Amman, فلاتر مياه عمان, سوفتنر عمان, فلتر RO الأردن.
- **Informational:** the guide topics (RO vs filtration, 7-stage, hard water, maintenance).

## 12. Recommended weekly workflow

1. Check **Pages (Indexing)** for new errors.
2. Check **Sitemaps** status.
3. Skim **Performance** (queries + top pages) for movement.
4. Inspect any newly published page and request indexing for it.
5. Confirm no Manual actions / Security issues.
6. Monthly: revalidate structured data and NAP/GBP consistency
   (`docs/local-nap-standard.md`).

## 13. Production sitemap

```
https://www.naqijo.com/sitemap.xml
```

## 14. Initial URL-inspection priority list

The full annotated list lives in `docs/gsc-url-inspection-list.md`. Summary:

- **Priority 1:** `/`, `/ar`, `/en`
- **Priority 2:** `/products`, `/services`, `/projects`, `/guides`,
  `/water-filters-amman`, `/commercial-water-treatment`, `/contact`, `/about`
- **Priority 3:** key product / category / service / guide detail pages.

Request indexing only for Priority 1–2 and a few Priority-3 pages; let the
sitemap carry the rest (Google recommends the sitemap over bulk manual requests).
