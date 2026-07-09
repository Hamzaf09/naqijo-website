# Naqi Al Rabia — Information Architecture

**Document:** 02 · Information Architecture
**Status:** Draft for approval
**Last updated:** 2026-07-09

---

## 1. Locale & URL Strategy

- Sub-path routing: `/{locale}/...`, `locale ∈ {ar, en}`, **default `ar`**.
- Root `/` → redirect to `/ar` (or stored preference).
- **Localized slugs**: e.g. Products = `/ar/المنتجات` ↔ `/en/products`; each page carries `canonical` + `hreflang` (`ar`, `en`, `x-default → ar`).
- Slugs stored per-locale in DB (products/projects/articles) so editors control them.

> Notation below shows the English path; the Arabic path is the localized equivalent.

## 2. Sitemap

```
/                         → redirect → /ar
/[locale]
├── /                     Home
├── /about                About
├── /services             Services (list)
│   └── /services/[slug]  Service Detail
├── /products             Products (catalog + filters)
│   ├── /products/[slug]  Product Detail
│   └── /products/compare Product Comparison
├── /projects             Projects (portfolio)
│   └── /projects/[slug]  Project Detail
├── /maintenance          Maintenance (info hub)
├── /request/installation Installation Request (form)
├── /request/maintenance  Maintenance Request (form)
├── /blog                 Blog (list)
│   ├── /blog/[slug]       Article
│   ├── /blog/category/[c] Category archive
│   └── /blog/tag/[t]      Tag archive
├── /faq                  FAQ
├── /contact              Contact
├── /search               Search
├── /privacy              Privacy Policy
├── /terms                Terms & Conditions
└── *                     404 (localized)

/[locale]/admin           Admin Panel (P2) — auth-gated, noindex
├── /dashboard
├── /content   (pages, sections, menus, footer, SEO)
├── /products  (+ categories, specs, downloads)
├── /blog      (+ categories, tags, authors)
├── /media     (media library)
├── /crm       (customers, leads)            [P3]
├── /maintenance (tickets, technicians)      [P3]
├── /analytics                               [P3]
├── /users     (RBAC)
├── /settings
└── /audit
```

## 3. Primary Navigation (Header)

**Left→right in LTR, mirrored in RTL.**

- Logo (→ Home)
- Home
- About
- Services (mega-menu: service categories + featured)
- Products (mega-menu: categories/subcategories + featured)
- Projects
- Blog
- Contact
- **Utilities:** Search (icon), Language switcher (ع / EN), Theme toggle, primary CTA **“Request Service”** (→ chooser: Installation / Maintenance)

Sticky, condenses on scroll; mobile → full-screen drawer with the same structure, RTL-aware.

## 4. Footer

Columns (RTL-first): 
1. **Company** — About, Projects, Blog, FAQ, Careers*(optional)*
2. **Solutions** — Filtration, Treatment, Solar, Infrastructure, Maintenance
3. **Support** — Installation Request, Maintenance Request, Contact, WhatsApp
4. **Legal** — Privacy, Terms
5. **Contact block** — address, phone, email, hours, socials
Bottom bar: logo, copyright, language switcher, theme toggle, back-to-top.

## 5. Page Content Blueprints

### Home (`/`)
1. **Hero** — narrative headline, sub-copy, primary + secondary CTA, ambient water/engineering motion, trust strip.
2. **Intro** — who Naqi Al Rabia is, in one confident paragraph + key differentiators.
3. **Services** — 4–6 cards, icon + short value, link to detail.
4. **Featured Products** — curated grid, quick specs.
5. **Statistics** — animated counters (installations, clients, years, cities).
6. **Projects** — showcase (asymmetric grid / horizontal scroll).
7. **Testimonials** — quotes + client/role, optional logos.
8. **Partners** — logo wall (grayscale → color on hover).
9. **Why Us** — pillars (quality, engineering, warranty, support).
10. **Latest Articles** — 3 posts.
11. **FAQ (condensed)** — top 4–6, link to full FAQ.
12. **Contact / CTA band** — request service, phone, WhatsApp.
13. **Footer.**

### About
Hero → Story → Mission/Vision/Values → Timeline → Certifications/Standards → Team → CTA.

### Services (list)
Intro → grid of services → “our process” → CTA.
**Service Detail:** hero → overview → process steps → benefits → related products → related projects → FAQ (scoped) → CTA.

### Products (catalog)
Intro → filters (category, subcategory, status, search) + sort → responsive grid (card: image, name, short spec, badges) → quick view → compare selection → pagination/infinite.
**Product Detail:** breadcrumb → gallery (zoomable) → title, category, badges → key specs → tabs {Specifications, Downloads, Warranty} → CTAs (Installation, Maintenance, WhatsApp) → comparison entry → related products → structured data (Product).

### Product Comparison
Select set → side-by-side spec table (sticky first column, RTL-aware) → per-column CTAs.

### Projects
Grid/portfolio → filters (sector, location) → **Project Detail:** hero gallery → scope/challenge/solution/outcome → specs → related services → CTA.

### Maintenance (hub)
What we cover → plans/SLAs → process → CTA to Maintenance Request → FAQ.

### Installation Request (form)
Multi-step: (1) Contact → (2) Location/Address → (3) Product/Service + preferred date → (4) Notes/attachments → Review → Submit → Confirmation. Progress indicator, save-safe, localized validation.

### Maintenance Request (form)
Steps: (1) Contact → (2) Product/serial (optional) + issue + urgency → (3) Location + attachments → Review → Submit → Confirmation.

### Blog / Article
List: featured + grid, category/tag filters, search.
Article: breadcrumb → title, author, date, reading time → featured image → body (rich, TOC for long reads) → share → tags → author card → related articles → Article structured data.

### FAQ
Search + categorized accordions; deep-linkable; FAQPage schema.

### Contact
Form (RHF+Zod) + map + contact facts + WhatsApp + socials; LocalBusiness schema.

### Search
Unified query across products/projects/articles/pages; grouped, localized results; keyboard + screen-reader friendly.

### Legal (Privacy / Terms)
CMS-editable long-form, localized, with in-page anchors.

### 404 / Error
Branded, calm, with search + top links + WhatsApp.

## 6. Breadcrumbs

Every non-home public page renders localized breadcrumbs with `BreadcrumbList` schema. RTL order mirrors correctly.

## 7. Navigation States & Global UI

- **Language switcher** keeps route context (maps slug ar↔en).
- **Theme toggle** persists; animated.
- **WhatsApp** floating button (contextual prefilled message).
- **Skip-to-content**, focus outlines, and landmark regions on every page.
- **Command-style search** (⌘K / mobile search) — optional enhancement.

## 8. Content ↔ CMS Mapping (P2 readiness)

Every block above maps to a DB-backed, editable entity from P1 (see `03-database-schema.md`): `Page`, `Section` (typed block + ordered), `MenuItem`, `SettingGroup`, `SeoMeta`, plus domain entities (`Product`, `Project`, `Service`, `Article`, `Faq`, `Testimonial`, `Partner`, `Stat`). P1 seeds these; P2 exposes editing — **no rework**.
