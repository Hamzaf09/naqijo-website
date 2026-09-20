# Local Citations Roadmap (NaqiJo)

Legitimate citation targets for Jordan / Amman, focused on **NAP consistency**
(not backlink quantity). Every listing must use the canonical values in
`docs/local-nap-standard.md`, byte-for-byte. Complements
`docs/offsite-authority-roadmap.md` (broader entity presence) and
`docs/entity-presence-strategy.md`.

**Required NAP for every listing:** Naqi Al Rabia Water & Energy / نقي الرابية
للمياه والطاقة · Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground
Floor, Amman, Jordan · +962 79 290 0008 · https://www.naqijo.com

## Status legend
- **VERIFIED** — official listing confirmed, NAP matches.
- **NEEDS CONFIRMATION** — a listing may exist; get the URL and check NAP.
- **NEEDS CREATION** — no listing known; create it.
- **NOT RECOMMENDED** — skip (low quality or no reason yet).

## Core maps / local platforms

| Platform | Status | Official URL | Priority | Notes |
|---|---|---|---|---|
| Google Business Profile | NEEDS CONFIRMATION | — (do not invent) | Critical | Foundation for Maps + Local Pack. Full setup: `docs/google-business-profile.md`. Once live, set `NEXT_PUBLIC_GOOGLE_MAPS_URL` / `NEXT_PUBLIC_GOOGLE_REVIEW_URL`. |
| Bing Places for Business | NEEDS CREATION | — | High | See "Bing setup" below; can import from GBP. Feeds Bing + Copilot. |
| Apple Business Connect | NEEDS CREATION | — | Medium | See "Apple setup" below. Apple Maps / Siri. |

## Social citations (also `sameAs` candidates)

| Platform | Status | Official URL | Priority | Notes |
|---|---|---|---|---|
| Facebook | NEEDS CONFIRMATION | — | High | Jordan competitors are FB-heavy; confirm official page. |
| Instagram | NEEDS CONFIRMATION | — | High | Confirm official handle. |
| LinkedIn | NEEDS CONFIRMATION | — | Medium | B2B credibility. |
| YouTube | NOT RECOMMENDED (yet) | — | Low | Only with real video content. |

When any is VERIFIED, add the URL to `siteConfig.social` — it flows into schema
`sameAs` automatically (see `docs/offsite-authority-roadmap.md`).

## Jordan / regional directories (verify each is reputable & active first)

| Directory | Status | Priority | Notes |
|---|---|---|---|
| directoryjordan.com | NEEDS CONFIRMATION | Medium | General Jordan business directory. |
| halabazaar.com | NEEDS CONFIRMATION | Medium | Local marketplace/listings. |
| Amman / Jordan Chamber of Commerce listing | NEEDS CONFIRMATION | Medium | If the business is a member/eligible. |

**Do not** submit to mass low-quality link farms or auto-submission services —
they add no authority and can look spammy.

## Industry-relevant directories

| Type | Status | Notes |
|---|---|---|
| Water-treatment / construction sector directories (Jordan) | NEEDS CONFIRMATION | Only legitimate, editorially-curated ones. |

## Bing Places — setup requirements
- Business name, canonical address, primary phone, website, category (Water
  treatment supplier), hours **[CONFIRM real hours]**, real photos.
- Easiest path: "Import from Google Business Profile" once GBP is live, then
  verify NAP matches this standard.

## Apple Business Connect — setup requirements
- Register/claim the place; set the same NAP, category, hours **[CONFIRM]**, and
  real photos. Add the website. Keep the pin on the real entrance.

## Maintenance
- When any NAP value changes, update **every** VERIFIED listing + the repo
  together. Keep a running list of live listing URLs here as they are confirmed.
- Never create duplicate listings on the same platform.
