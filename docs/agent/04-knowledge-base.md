# Knowledge base & offers

The assistant's **only** source of company facts. Managed in the Payload admin (`/admin` → group **Assistant**,
also linked from the inbox header: «قاعدة المعرفة», «العروض»). Fields are bilingual (Arabic default + English).

## Approval workflow

1. Anyone with an authoring role (admin, editor, content-manager, sales, support) **creates or edits** an entry and saves it as **Draft**.
2. The assistant does **not** see drafts. Editing an already-approved entry creates a new draft; customers keep getting the previous approved text.
3. An **administrator** (`admin` / `super-admin`) reviews and clicks **Publish** — that is the approval. The server rejects publishing by anyone else.
4. Version history, `publishedBy` and `publishedAt` record who approved what and when. Roll back from the *Versions* tab.
5. To stop quoting something immediately: set the offer **Status** to *Paused/Inactive* (or unpublish an entry) and publish.

The assistant never infers missing policy: if a fact is absent it says it has no approved details, records the
question under **Knowledge gaps** and hands the customer to the team.

## Categories (field "Category")

`company` (identity, contact) · `product` (catalogue categories/products/specs) · `price` (prices, promotions) ·
`maintenance` (services & scope) · `installation` (policy, charges) · `warranty` · `coverage` (service/delivery
areas) · `faq` · `booking` (appointment procedure) · `escalation`.

Useful fields: **Keywords** (Arabic dialect words/synonyms customers actually type — improves retrieval),
**Availability** for products/services (*unconfirmed* means the assistant may never say it is available),
**Always include** (a few short entries given on every turn, e.g. contact details), **Source** (who verified it).

## Offers (collection "Offers")

| Field | Meaning |
| --- | --- |
| Key | Stable id (`filter-maintenance`, `traditional-seven-stage-filter`) |
| Price (JOD) | The only price the assistant may quote for the offer — it is never computed or changed automatically |
| Status | Active / Paused / Inactive (+ optional start/end dates) |
| Scope | **Approved** description of what's included. **Leave empty if unconfirmed** → the assistant answers "details not approved yet" and refers to sales |
| Installation included | Not included / Included / Unknown (Offer B is set to *Not included*) |
| Installation note, Warranty, Accessories, Installments | Empty = the assistant may **not** mention them |

### Seeded content (`npm run seed:agent`, idempotent)

| Entry | State |
| --- | --- |
| Company intro; verified contact details (from `siteConfig`); service-area statement; maintenance-booking procedure; escalation procedure | Published |
| Maintenance: filter maintenance & cartridge replacement (no prices/scope) | Published, availability *available* (named in the brief) |
| 11 product categories (7-stage RO, traditional/digital, tankless, whole-home, central/jumbo, softeners, coolers/dispensers, cartridges, booster pumps, RO+UV, air purifiers) | Published as **stubs with availability *unconfirmed*** — no specs/prices/stock claims |
| Offer A — Filter maintenance — **35 JOD** | Active; scope empty (unconfirmed) |
| Offer B — Traditional NAQI Seven-Stage Filter — **160 JOD** | Active; installation **not included**; scope empty |

Not seeded on purpose (requires NAQI's approval first): warranty terms, installation charges, delivery coverage,
product specs/prices, solar/kitchens/waterproofing, boilers/pools/heating. The public website's marketing claims
(e.g. "free assessment", "warranty up to five years") were **not** copied — add them only if NAQI approves the wording.
