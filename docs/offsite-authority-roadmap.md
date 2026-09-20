# Off-Site Authority Roadmap (NaqiJo)

Internal roadmap. **Not published on the website.** Uses only facts verified in
the repository; **no profile URLs are invented**. It complements
`docs/entity-presence-strategy.md` (NAP block + `sameAs` wiring) and
`docs/google-business-profile.md` (GBP setup detail). Read those alongside this.

**Current verified footprint (from `src/config/site.ts`):**
`siteConfig.social` is empty (facebook / instagram / youtube / linkedin all `""`),
so the site currently emits **no `sameAs`** — correct, since no official profile
is confirmed. The single job of this roadmap is to establish real profiles, keep
their NAP identical, then feed the confirmed URLs back into `siteConfig.social`
so `sameAs` starts linking the entity.

## Status legend
- **VERIFIED** — official profile confirmed and matches NAP.
- **NEEDS CONFIRMATION** — a profile may exist; get the exact URL and check NAP.
- **NEEDS CREATION** — no profile known; create one.
- **NOT RECOMMENDED (yet)** — skip until there's real reason/content.

## Platform roadmap

| # | Platform | Status | Priority | Action |
|---|----------|--------|----------|--------|
| 1 | Google Business Profile | NEEDS CONFIRMATION | Critical | Claim/verify the Amman location; complete per `docs/google-business-profile.md`. Biggest lever for Maps + local + AI local answers. |
| 2 | Bing Places for Business | NEEDS CREATION | High | Create and import details from GBP; feeds Bing + Copilot. |
| 3 | Apple Business Connect (Apple Maps) | NEEDS CREATION | Medium | Register the business for Apple Maps / Siri visibility. |
| 4 | Facebook Page | NEEDS CONFIRMATION | High | Most Jordan competitors live here; confirm the official page URL, align NAP. |
| 5 | Instagram (business) | NEEDS CONFIRMATION | High | Confirm official handle; link website in bio; consistent name. |
| 6 | LinkedIn Company Page | NEEDS CONFIRMATION | Medium | Confirm/create; supports B2B / commercial credibility. |
| 7 | YouTube channel | NOT RECOMMENDED (yet) | Low | Only if real video content (installations, explainers) will be produced. |
| 8 | Reputable Jordan directories | NEEDS CREATION | Medium | A small number of credible local listings (below), identical NAP. |
| 9 | Industry-relevant directories | NEEDS CONFIRMATION | Low | Only legitimate water/construction-sector listings; never link farms. |

## Reputable Jordan directories (verify each is still active & credible first)
- directoryjordan.com
- halabazaar.com
- Amman Chamber of Commerce / Jordan Chamber listings (if eligible)
Avoid mass-submission services and low-quality link farms — they add no authority.

## Sequencing
1. **GBP first** (Critical) — everything else references its NAP and can import from it.
2. **Bing Places + Facebook/Instagram confirmation** (High).
3. **Apple + LinkedIn + directories** (Medium).
4. **YouTube** only when real video exists.

## Feedback loop into the site
As each official URL is **VERIFIED**, add it to `siteConfig.social` in
`src/config/site.ts`. The schema builder (`src/lib/schema.ts`) already turns any
non-empty social URL into the Organization's `sameAs` array automatically — so
this is the only code change needed, and it stays safe/no-op until real URLs
exist. Recommended order once known: GBP, Facebook, Instagram, LinkedIn, YouTube.

## Guardrails
- Never buy or incentivize reviews; never create fake profiles or duplicate GBP listings.
- Never keyword-stuff a profile business name — use the real name only.
- Keep NAP byte-identical everywhere (see `docs/entity-presence-strategy.md`).
