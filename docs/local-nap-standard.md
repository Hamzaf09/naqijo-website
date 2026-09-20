# Local NAP Standard (NaqiJo)

Internal source of truth for **Name, Address, Phone** and identity. Every
website surface, Google Business Profile, and external citation must match this
**byte-for-byte**. Inconsistent NAP is the single most common thing that weakens
local trust. All values below are taken directly from `src/config/site.ts` and
`src/lib/schema.ts` — nothing here is invented.

## Canonical NAP

| Field | Value |
|---|---|
| Business name (EN) | **Naqi Al Rabia Water & Energy** |
| Business name (AR) | **نقي الرابية للمياه والطاقة** |
| Brand (EN) | NaqiJo |
| Brand (AR) | نقي الرابية |
| Address (EN) | Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor, Amman, Jordan |
| Address (AR) | خلدا، شارع وصفي التل، مجمع فهد جريصات، الطابق الأرضي، عمّان، الأردن |
| Locality | Amman (عمّان) |
| Country | Jordan (JO) |
| Phone — primary / WhatsApp | +962 79 290 0008 (stored `+962792900008`) |
| Phone — secondary / office | +962 79 320 0007 (stored `+962793200007`) |
| Email | info@naqijo.com |
| Website | https://www.naqijo.com |
| Founded | 2005 |

**Phone format:** always international `+962`. Display grouping `+962 79 290 0008`;
machine/`tel:` value `+962792900008`. Never a local `07…` format in citations.

## Approved brand variants (aliases — all point to ONE entity)

These are the only accepted variants, and they are already declared as
`alternateName` in the Organization/LocalBusiness schema:

- نقي الرابية للمياه والطاقة (full Aradic name)
- نقي الرابية (Arabic brand)
- Naqi Al Rabia Water & Energy (full English name)
- Naqi Al Rabia (English short)
- NaqiJo (web brand)

**Approved English spelling of the name:** **Naqi Al Rabia**.

## Prohibited / inaccurate variants (do NOT use in citations or the GBP name)

- "Naqi Al Rabieh" / "Naqi Al Rabiah" — alternate transliterations. *(Note: the
  founder's title string in the repo reads "Founder of Naqi Al Rabieh"; it is
  kept verbatim as provided, but this spelling must NOT be used for the business
  name in GBP or citations.)*
- Any name with appended keywords, e.g. "Naqi Al Rabia Water Filters Amman" —
  keyword-stuffing the business name violates Google's guidelines.
- Local `07…` phone format; `http://` or non-`www` origin.

## Where each canonical value is used (in the repo)

| Value | Source of truth | Consumers |
|---|---|---|
| Names / brand | `siteConfig.brand`, `schema.ts names` | metadata, footer, schema `name`/`alternateName`, docs |
| Address | `siteConfig.address`, `schema.ts postalAddress()` | contact page, Amman page, LocalBusiness `address` |
| Phones | `siteConfig.phones` | contact/Amman pages, `tel:` links, Organization `telephone`/`contactPoint` |
| Website | `getServerURL()` / `siteConfig.url` | `metadataBase`, canonicals, schema `url`, `@id` |
| Email | `siteConfig.email` | contact page, schema `email` |

To change any canonical value, edit `src/config/site.ts` (and `schema.ts`
`postalAddress()` / `names` if the wording changes) — then propagate to every
external profile listed in `docs/local-citations-roadmap.md`.

## External citation requirements

- Use the **full business name** (EN or AR as the platform expects), the
  canonical address, the primary phone, and the `https://www.naqijo.com` website.
- Keep it identical across Google, Bing, Apple, Facebook, Instagram, LinkedIn and
  every directory. When one changes, update all + the repo together.
