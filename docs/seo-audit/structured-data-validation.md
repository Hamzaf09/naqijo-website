# Structured data validation

Method: every JSON-LD block on 93 locally-built pages was extracted and `JSON.parse`d; `@type`s walked. Google Rich Results Test was **not** run (network blocked).

| Page group | Types found | Parse errors |
|---|---|---|
| All 93 pages (layout) | Organization, ContactPoint, LocalBusiness, PostalAddress, WebSite | 0 |
| Home, about, contact, consultation, maintenance, privacy, terms (14) | layout graph only | 0 |
| Products (22) | + Product, Brand, BreadcrumbList | 0 |
| Categories, list pages, water-filters-amman, projects (32) | + BreadcrumbList | 0 |
| Services + commercial-water-treatment (10) | + Service, BreadcrumbList | 0 |
| Guides (12) | + Article, BreadcrumbList, FAQPage | 0 |
| FAQ (2) | + FAQPage | 0 |

Review of `src/lib/schema.ts`:
- Stable `@id`s (`/#organization`, `/#localbusiness`, `/#website`); provider/publisher/parentOrganization reference them. Locale-aware URLs.
- Telephone: only primary `+962792900008`. Address matches the NAP standard (Khalda, Wasfi Al Tal St., Fahed Jarissat Complex).
- Deliberately **absent** (unverified): `offers`/price, `aggregateRating`, `review`, `openingHours`, `geo`, `sameAs` (no official profiles), `hasMap` (env var unset).
- Open point: `areaServed` lists Saudi Arabia, Qatar, UAE (comment says taken from the company description). The owner should confirm this claim.
- Open point: Organization and LocalBusiness are two entities with the same details; acceptable, and linked via `parentOrganization`.
- Rich-result eligibility ≠ display; Product without offers is not eligible for merchant snippets (intended).
