# Google Local Readiness — Scorecard (NaqiJo)

A **readiness checklist, not a ranking score.** No number is assigned and no
ranking is promised. Each item is one of:

- **READY** — done in the repository / no external action needed.
- **NEEDS CONFIRMATION** — a real-world value must be confirmed before finalizing.
- **NEEDS EXTERNAL ACTION** — requires GBP ownership / an external account the
  repo cannot create.
- **NOT APPLICABLE** — not relevant to this business right now.

| Item | Status | Where / what |
|---|---|---|
| Business name | READY | Canonical in `siteConfig` + schema `name`/`alternateName`; see `docs/local-nap-standard.md`. |
| Address | READY | `siteConfig.address` + `schema.ts postalAddress()`; on contact & Amman pages. |
| Phone | READY | `+962 79 290 0008` / `+962 79 230 0005`, international format. |
| Website | READY | `https://www.naqijo.com` (`metadataBase`, canonicals, schema). |
| GBP URL | NEEDS EXTERNAL ACTION | Owner must claim/verify the profile. |
| Maps URL | NEEDS EXTERNAL ACTION | Architecture READY: set `NEXT_PUBLIC_GOOGLE_MAPS_URL` → renders CTA + schema `hasMap`. |
| Place ID | NEEDS EXTERNAL ACTION | Architecture READY: `NEXT_PUBLIC_GOOGLE_PLACE_ID`. |
| Primary category | NEEDS CONFIRMATION | Recommended **Water treatment supplier** — confirm in the GBP picker. |
| Secondary categories | NEEDS CONFIRMATION | Water filter supplier / Water purification company / Water softening equipment supplier / Bottled water supplier — confirm availability. |
| Services | READY | Documented in `docs/google-business-profile.md`; all on the website. |
| Products | READY | 7 categories + products on site; product list in GBP doc. |
| Description | READY | AR/EN drafts (≤750 chars) in the GBP doc. |
| Hours | NEEDS CONFIRMATION | Site states "Available 7 days a week" (slogan); enter real daily hours in GBP. Not added to schema until confirmed. |
| Photos | NEEDS EXTERNAL ACTION | Real business photography required — see `docs/google-business-profile-photo-guide.md`. |
| Reviews | NEEDS EXTERNAL ACTION | Needs GBP + official review link; strategy in `docs/google-reviews-playbook.md`. |
| Q&A | READY | Seed Q&A (AR/EN) prepared in the GBP doc; **posting** needs GBP access. |
| Google Posts | READY | 12 concepts in `docs/google-posts-playbook.md`; **posting** needs GBP access. |
| Search Console | NEEDS EXTERNAL ACTION | Procedure in `docs/google-search-console-local-seo.md`; verification meta hook already in the layout. |
| Bing Places | NEEDS EXTERNAL ACTION | Setup in `docs/local-citations-roadmap.md`. |
| Apple Business Connect | NEEDS EXTERNAL ACTION | Setup in `docs/local-citations-roadmap.md`. |
| Social profiles | NEEDS CONFIRMATION | `siteConfig.social` empty; confirm official URLs. |
| sameAs | NEEDS CONFIRMATION | Auto-emitted once social URLs are set (schema already wired). |
| NAP consistency | READY | `docs/local-nap-standard.md`; site audited consistent in Phase 6. |
| LocalBusiness schema | READY | Single canonical entity; verified fields only; `hasMap`/`sameAs` conditional. |
| Amman landing page | READY | `/water-filters-amman` (ar+en) with local intent + internal links. |
| Contact page | READY | NAP consistent; consultation/services/Amman links; Maps CTA when configured. |

## What unlocks the "NEEDS EXTERNAL ACTION" items (owner)
1. Claim & verify the **Google Business Profile** (biggest single step).
2. From it, capture the **Maps URL**, **Place ID**, and **review link** → set the
   three `NEXT_PUBLIC_GOOGLE_*` env vars; the site then renders Maps/Review CTAs
   and schema `hasMap` automatically.
3. Confirm **real opening hours**, add **real photos**, seed **Q&A** and **Posts**.
4. Verify **Search Console** (set `GOOGLE_SITE_VERIFICATION`), submit the sitemap.
5. Create **Bing Places** + **Apple Business Connect**; confirm **social profiles**
   and add their URLs to `siteConfig.social`.
