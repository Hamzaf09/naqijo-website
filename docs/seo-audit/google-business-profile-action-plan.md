# Google Business Profile action plan

## Access status (2026-10-24)

**Google Business Profile and Google Maps were not accessed.** The session had no browser and no Google account. The network was opened only for `naqijo.com`, and the web-search tool cannot read Google Maps. The ownership request, postcard state, and whether the "Add business description" screen belongs to the existing listing or to a new one are all **unknown**.

Historical facts reported by the owner (not re-verified): listing "Naqi jo", 4.6★ / 31 reviews, "Wasfi At-Tall St., Khilda". A request to manage it was sent; Google's response date was 24 Sep 2026, which has now passed.

## Public search observations (SEARCH tool, not Google Maps)

- Queries "Naqi jo" + Khalda/Wasfi Al Tal/reviews, "نقي الرابية", "Naqi Al Rabia": **no Maps/GBP listing surfaced** in this engine. That is not evidence that the listing doesn't exist.
- Name collision: "نقي"/"Naqi" results are dominated by Saudi companies (naqi.sa water filters; Naqi Water Co., Tadawul 2282). "عمان" also matches Oman (عُمان). Use the full name and "عمّان، الأردن" everywhere.
- No official Facebook/Instagram profile for the business was found.

## Critical warning: don't create a duplicate

If the "verify by mail → Add business description" flow started from **"Add your business"** rather than from the existing "Naqi jo" listing, it is creating a **new** profile. Check before completing it:
- In business.google.com → **Businesses**, does the profile shown have the 31 reviews? If it has 0 reviews, it is a new profile.
- If it is new and unverified, don't verify it. Go back to the existing listing on Maps → **"Own this business?" / "Claim this business"** and follow Google's ownership flow from there. If both end up existing, ask Google support to merge them (the 31 reviews stay on the old one).

## Steps for the owner, in order

1. **Status check** (business.google.com, the account used for the request): screenshot the profile list and any "Request access" status for "Naqi jo". Possible states: pending, approved (you're a manager/owner), denied, or expired with a **"Claim"** option after the 24 Sep 2026 deadline.
2. **Verification**: if Google asks for a postcard/video/phone check, complete it only on the existing listing and only with the real code. The mailing address must be where mail is actually received (Fahed Jarissat Complex, Ground Floor, Khalda). Don't share codes with anyone, including AI assistants.
3. **NAP alignment** (after access). The listing must match the website exactly:

| Field | Website value (LIVE, verified on the site 2026-10-24) | Owner decision needed |
|---|---|---|
| Name | Site entity: "Naqi Al Rabia Water & Energy / نقي الرابية للمياه والطاقة"; brand "NaqiJo / نقي الرابية". GBP currently shows "Naqi jo" | Choose the real-world name used on signage/invoices. Google requires the real name, no added keywords |
| Address | Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor, Amman | Confirm; place the pin on the actual entrance |
| Primary phone | +962 79 290 0008 | — |
| Secondary phone | +962 79 320 0007 on site (repo + commit `0810c9c`); `+962792300005` in the audit brief | **Confirm which is real** |
| Website | `https://www.naqijo.com/ar` (or `/en`) | — |
| Hours | Site: "Available 7 days a week" (no times) | Give real opening hours; the site will add them to schema only once confirmed |
| Categories | e.g. Water filter supplier; Water treatment supplier; Water purification company | Only categories actually offered. Bottled-water, solar, kitchen and insulation categories only if those services are really sold from this location |
| Service area | Site schema: Jordan, KSA, Qatar, UAE | GBP service area = areas actually served from Amman |

4. **Description**. Drafts in `docs/google-business-profile.md` are 627 (EN) / 488 (AR) characters, under the 750 limit. Before pasting, confirm or remove the last sentence (energy, residential solutions and water bottling). No "#1/best" claims, no URLs, no phone numbers in the description.
5. **Photos**. Only real photos (storefront, team, real installations), per `docs/google-business-profile-photo-guide.md`.
6. **Reviews**. Reply to the existing 31. Ask real customers via the review link. No incentives, gating or fake reviews. The homepage testimonials (TRUST-01) should be real or replaced with real reviews.
7. **Connect the website** (no code change needed; Vercel env, Production, then redeploy):
   - `NEXT_PUBLIC_GOOGLE_MAPS_URL`: Google Maps → open the listing → Share → Copy link.
   - `NEXT_PUBLIC_GOOGLE_REVIEW_URL`: Business Profile → "Ask for reviews" → copy link.
   - `NEXT_PUBLIC_GOOGLE_PLACE_ID`: Google's Place ID Finder (developers.google.com/maps/documentation/places/web-service/place-id) → search the listing. Note: the code currently reads this value but nothing uses it (CFG-01). It is optional.
   - After redeploy, expect "View on Google Maps" / "Review us on Google" buttons on contact and Amman pages and `hasMap` in LocalBusiness JSON-LD.
   - Do not use the CMS Settings "Google Maps link" field; it is not rendered anywhere today (CFG-01).
8. **Other platforms** (only with the owner's authority, after GBP is settled): Bing Places (can import from GBP), Apple Business Connect, official Facebook/Instagram pages. Then add their URLs to CMS Settings social fields → they become `sameAs`.

## Questions for the owner

1. Current state of the "Naqi jo" ownership request (screenshot)?
2. Was the postcard actually ordered, and for which profile (one with reviews, or a new one)?
3. Which secondary phone is current: `+962793200007` or `+962792300005`?
4. Real opening hours?
5. Official public name for Google: "Naqi Al Rabia Water & Energy", "نقي الرابية", "NaqiJo", or "Naqi jo"?
6. Which services are sold from the Khalda location (water only, or also solar/kitchens/insulation/bottled water)?
7. Do official Facebook/Instagram pages exist? URLs?
8. Are the 3 homepage testimonials and 4 project case studies real?
