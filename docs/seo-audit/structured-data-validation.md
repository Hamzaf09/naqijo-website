# Structured data validation

## What was run

| Test | Where | When (UTC) | Result |
|---|---|---|---|
| Parse every `application/ld+json` block, walk `@graph` | LIVE, 92 pages | 2026-10-24 ≈09:27 | 0 parse errors |
| Required/recommended-property checks (Google's documented fields per type), visible-content match, canonical match, `@id` consistency | LIVE, 92 pages | same | 0 issues |
| Fetch every URL used in `url`/`image`/`logo`/`item` | LIVE | same | 98 URLs, 98 × 200 |
| Same checks after the branch fixes | LOCAL build | ≈09:38 | 0 issues; `manufacturer` gone |
| Google Rich Results Test / validator.schema.org | — | — | **Not run**: both hosts blocked by this environment's network policy (only `naqijo.com` was opened). No rich-result eligibility is claimed |

Raw output: `evidence/live-structured-data-2026-10-24.json`.

## Live node counts (92 pages)

| Type | Pages | Notes |
|---|---|---|
| Organization (`/#organization`) | 92 | name, alternateName, url, logo, foundingDate 2005, email, telephone, contactPoint |
| LocalBusiness (`/#localbusiness`) | 92 | name, address (Khalda, Wasfi Al Tal St., Fahed Jarissat Complex, Amman, JO), telephone `+962792900008`, url, image, `parentOrganization` → Organization |
| WebSite (`/#website`) | 92 | publisher → Organization |
| BreadcrumbList | 76 | ≥2 items, positions 1…n, last item = canonical |
| Product | 22 | name, description, image, brand "Naqi Al Rabia", sku, url = canonical; name visible on page |
| Service | 10 | provider → Organization, url = canonical |
| Article | 12 | headline, datePublished `2026-09-08`, author/publisher → Organization, image |
| FAQPage | 14 | every question text visible on the page |

## Findings

| ID | Finding | Status |
|---|---|---|
| SD-01 | Product `manufacturer: {@id: organization}` on all 22 products. The site never says the company manufactures them (brand "Naqi Al Rabia" stays) | Removed on branch (`7c267eb`) |
| SD-03 | No `offers`, `review` or `aggregateRating` on any Product. Google's product rich results need at least one of these, so **no Product rich results are expected**. Intentional: there are no verified prices, and self-serving reviews are not allowed | No change. Add `offers` only when real prices/availability are published on the page |
| SD-02 | FAQPage markup is valid. Google shows FAQ rich results only for well-known government/health sites (since Aug 2023) | No change; harmless |
| — | LocalBusiness deliberately omits `openingHoursSpecification`, `geo`, `priceRange`, `hasMap`, `sameAs`, ratings — none verified | Correct. Add `hasMap` automatically once `NEXT_PUBLIC_GOOGLE_MAPS_URL` is set; add `sameAs` once official profiles exist |
| — | `areaServed` = Jordan, Saudi Arabia, Qatar, UAE (from the About page text "branches across…") | OWNER: confirm; the GBP should list only real service areas |
| — | Organization and LocalBusiness are separate nodes with linked `@id`s, no conflicting values | OK |
| — | Arabic pages use Arabic names/addresses, English pages English; URLs are locale-specific | OK |
| — | No review/rating markup anywhere (the homepage testimonials are not marked up) | OK — see TRUST-01 |

## After deployment

Run Google's Rich Results Test on `/ar/products/ro-bn01`, `/ar/guides/central-vs-drinking-water-filter`, `/ar/services/water`, `/ar`. Expect Breadcrumb (and possibly Article) detections. Treat "eligible" as eligibility only, not a guarantee of display.
