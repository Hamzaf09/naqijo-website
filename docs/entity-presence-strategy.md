# External Entity Presence & NAP Consistency (NaqiJo)

Internal strategy. **Not published on the website.** The goal is for Google,
Bing, Apple, and AI answer engines to recognize **NaqiJo = Naqi Al Rabia =
نقي الرابية** as one real business with one consistent identity.

The website already declares this entity in structured data (Organization,
LocalBusiness, WebSite with stable `@id`s and `alternateName` covering every
brand variant). External profiles must match it **exactly** — inconsistent Name,
Address, or Phone (NAP) is the most common thing that weakens local authority.

---

## 1. Canonical NAP block — copy/paste identically everywhere

```
Name (EN):     Naqi Al Rabia Water & Energy
Name (AR):     نقي الرابية للمياه والطاقة
Brand:         NaqiJo
Address (EN):  Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor, Amman, Jordan
Address (AR):  خلدا، شارع وصفي التل، مجمع فهد جريصات، الطابق الأرضي، عمّان، الأردن
Phone:         +962 7 9290 0008   (primary / WhatsApp)
Phone (alt):   +962 7 9230 0005   (office)
Email:         info@naqijo.com
Website:       https://www.naqijo.com
Founded:       2005
```

Rules: always the international `+962` format; same address wording and order;
website always with `https://www.` (matches the site's canonical origin).

## 2. Platforms

Mark each as **CREATE** (no official profile known — the repo's social config is
empty) or **CONFIRM** (if the owner already has one, get the exact URL). **Do not
invent profile URLs.**

| Platform | Priority | Status | Notes |
|---|---|---|---|
| Google Business Profile | Critical | CREATE/CONFIRM | See `docs/google-business-profile.md` |
| Bing Places for Business | High | CREATE/CONFIRM | Feeds Bing + Copilot; can import from GBP |
| Apple Business Connect (Maps) | Medium | CREATE/CONFIRM | Apple Maps / Siri visibility |
| Facebook Page | High | CONFIRM | Most Jordan competitors live here; keep NAP identical |
| Instagram (business) | High | CONFIRM | Link to website; consistent name/handle |
| LinkedIn Company Page | Medium | CREATE/CONFIRM | B2B / commercial credibility |
| YouTube channel | Low | Optional | Only if real video content exists |

## 3. Reputable Jordan directories (quality over quantity — never spam)

Add the business to a small number of credible local directories with identical
NAP. Candidates observed in market research (verify each is reputable and still
active before listing):

- directoryjordan.com
- halabazaar.com
- Jordan Chamber of Commerce / Amman Chamber listings (if eligible)
- Well-known Jordan business listing portals with real editorial standards

Avoid low-quality link farms and mass-submission services — they add no
authority and can look spammy.

## 4. sameAs wiring (site ↔ profiles)

Once official profile URLs are confirmed, add them to
`src/config/site.ts → siteConfig.social` (currently empty strings). The schema
builder in `src/lib/schema.ts` automatically emits any non-empty social URLs as
the Organization's `sameAs` array — the explicit link that tells search/AI these
profiles are the same entity as the website. Until then, `sameAs` is correctly
omitted (better than pointing at guesses).

Recommended order once known: Google Business Profile URL, Facebook, Instagram,
LinkedIn, YouTube.

## 5. Recommended fields per profile

- Exact NAP (Section 1)
- Category: **Water treatment supplier** (primary) + relevant secondaries
- Short description: reuse the GBP description (EN/AR) from the GBP doc
- Hours: the **real** opening hours **[CONFIRM]** — consistent across all profiles
- Website link: `https://www.naqijo.com`
- Logo + cover image: the real brand assets
- Founded: 2005

## 6. Maintenance

- Re-check NAP consistency whenever a phone/address/hours changes — update **all**
  profiles and the site together.
- Keep the website's `Settings.mapUrl` and the GBP map pin in sync.
- Do not create duplicate GBP listings or duplicate profiles per platform.
