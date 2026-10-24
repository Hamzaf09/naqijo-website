# Google Business Profile action plan

**Access:** none. Current ownership/verification state is **unknown**. The brief says: existing profile "Naqi jo" (4.6★, 31 reviews at that time, Wasfi At-Tall St., Khilda), an ownership request was submitted, and Google indicated a possible next ownership step after **24 Sep 2026** (that date has passed as of this audit). Whether it succeeded is unverified. The postcard/description step reported by the owner is also unverified.

## Rules
- Do **not** create a duplicate profile; claim/manage the existing one. Codes/approvals must be completed by the authorized representative.

## Checklist (owner, in order)
1. Open business.google.com (signed-in account used for the request) → check the status of the ownership request / "Manage" access. If access was granted, skip to 3. If not, follow Google's next-step prompt shown after 24 Sep 2026.
2. If verification is requested (postcard or other): complete only with the real code; the postcard goes to the registered address — confirm someone can receive mail at "Fahed Jarissat Complex, Ground Floor".
3. **NAP match** — profile must equal the site: Name *Naqi Al Rabia Water & Energy / نقي الرابية للمياه والطاقة* (the listing currently shows "Naqi jo"; decide the one public name and keep it identical everywhere); Address *Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor, Amman*; Phone primary `+962 79 290 0008`; **confirm the secondary number** (`+962793200007` in repo vs `+962792300005` in the brief) before adding it.
4. **Description** (≤750 chars; the drafts in `docs/google-business-profile.md` are 627 EN / 488 AR characters). Before submitting, the owner must confirm the last sentence ("also operate in energy and residential solutions and in water bottling") and remove any service not truly offered. Submit only with authorized access.
5. Categories/services/hours/photos: follow `docs/google-business-profile.md`, `google-business-profile-photo-guide.md`; only real photos; set hours only when verified.
6. **Reviews:** ask real customers; never gate/incentivize/fake. See `docs/google-reviews-playbook.md`.
7. **Site integration values** (set in Vercel env, then redeploy; the code already renders nothing until set):
   - `NEXT_PUBLIC_GOOGLE_MAPS_URL` — Google Maps → search the business → Share → Copy link (long `google.com/maps/place/...` or `maps.app.goo.gl` link).
   - `NEXT_PUBLIC_GOOGLE_PLACE_ID` — Google Place ID Finder (developers.google.com/maps/documentation/places/web-service/place-id) for the verified listing.
   - `NEXT_PUBLIC_GOOGLE_REVIEW_URL` — GBP dashboard → "Ask for reviews" / Share review form short link (`g.page/r/.../review`).
   These activate Maps/review buttons and JSON-LD `hasMap`. No fake values were added.
8. Add real social profile URLs to CMS Settings / `siteConfig.social` for `sameAs`.
9. Posts and citations: `docs/google-posts-playbook.md`, `docs/local-citations-roadmap.md`.

## Site-side status (verified in code/build)
Footer, contact page and LocalBusiness JSON-LD show the same address and primary phone. Secondary phone appears on the contact page and footer only. No hours, geo or ratings are published (none verified).
