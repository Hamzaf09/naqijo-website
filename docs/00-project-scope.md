# Naqi Al Rabia — Project Scope

**Document:** 00 · Project Scope & Vision
**Status:** Draft for approval
**Owner:** Lead Architecture
**Last updated:** 2026-07-09

---

## 1. Vision

Build the definitive digital platform for **Naqi Al Rabia (نقي الربيع)** — an integrated water-solutions company in Jordan expanding across the Middle East. The platform must read as *engineering excellence made visible*: minimal, premium, timeless, and unmistakably custom — the standard set by Apple, Stripe, Linear, and Dyson, adapted for a bilingual Arabic-first audience.

This is a **greenfield build**. Nothing is inherited from the old website except **business content** (services, products, projects, contact facts). No templates, no WordPress, no legacy markup.

## 2. Business Domain

| Area | Description |
|---|---|
| Industry | Integrated water solutions: filtration, treatment, solar energy, residential infrastructure, maintenance services |
| HQ | Jordan |
| Expansion | Middle East (multi-country ready) |
| Audience | Homeowners, developers/contractors, facility managers, government/commercial buyers |
| Primary actions | Request installation, request maintenance, browse/compare products, contact sales, read expertise (blog) |

## 3. Goals & Success Metrics

| Goal | Metric / Target |
|---|---|
| Premium brand perception | Custom design system; zero generic sections |
| Performance | Lighthouse ≥ 95 (all categories); LCP < 2.0s, INP < 200ms, CLS < 0.1 |
| Reach | Full Arabic (default, RTL) + English (LTR) parity |
| Discoverability | Enterprise SEO, structured data, localized sitemaps |
| Lead generation | Installation & maintenance request conversion |
| Operability | Non-technical staff edit all content via CMS |
| Accessibility | WCAG 2.2 AA |
| Scalability | Multi-country, AI-feature-ready architecture |

## 4. Language & Localization (foundational constraint)

- **Arabic is the default.** First visit **always** opens Arabic, RTL.
- English is fully supported; user can switch at any time and the choice persists.
- **Everything localizes:** UI, content, URLs (localized slugs), metadata, structured data, images with locale-specific alt text, dates, numerals.
- Routing: sub-path strategy `/{ar|en}/...` via `next-intl`; `ar` is the default locale and the canonical root redirects to Arabic.

## 5. Phased Delivery

Approved sequencing — each phase ends in a review gate.

### Phase 1 — Foundation + Public Website
Design system, theming (light default + independent dark), i18n/RTL infra, and **all public pages**:
Home, About, Services, Service Detail, Products, Product Detail, Projects, Project Detail, Maintenance, Installation Request, Maintenance Request, Blog, Article, FAQ, Contact, Search, Privacy Policy, Terms, 404.
Includes SEO, forms (RHF + Zod), animations (Framer Motion), full responsiveness, and a headless content layer (DB-backed) so P2 CMS plugs in cleanly.

### Phase 2 — Admin Panel + CMS
Modern dashboard (analytics, charts, notifications, quick actions). Full CMS: every homepage section, page, menu, footer, media, text, button, and SEO field editable. Product management (categories/subcategories, pricing, specs, warranty, downloads, media, related, status). Blog CMS (categories, tags, authors, SEO, scheduling). Media Library (folders, drag-drop, WebP optimization). Auth: JWT + RBAC. Google/Apple login architected for later.

### Phase 3 — CRM + Maintenance + Operations
Customer profiles (orders, maintenance & installation history, invoices, notes, future AI history). Maintenance workflow: request → technician assignment → status updates → before/after photos → report → next-service scheduling. Analytics: revenue, traffic, orders, maintenance, customers.

## 6. In Scope

- Bilingual, RTL-first, responsive public website with premium motion.
- DB-backed content model designed for CMS from day one.
- Custom design system + component library (shadcn/ui base, extended).
- Enterprise SEO, structured data, sitemaps, performance budget.
- Admin/CMS/CRM/maintenance/media (Phases 2–3).
- RBAC, secure auth, audit trail.
- AI-ready seams (assistant, content, recommendations, maintenance).

## 7. Out of Scope (this engagement, unless requested)

- Native mobile apps (PWA optional later).
- Payment gateway / e-commerce checkout (products are lead-gen, not cart-based) — **please confirm**.
- Live chat vendor integration (WhatsApp deep-link only for now).
- Data migration scripting from the old site beyond content re-entry — **please confirm volume**.
- Multi-currency billing engine (invoices are records in P3, not a billing processor).

## 8. Assumptions

1. Products are **inquiry/lead-gen**, not online-purchasable (no checkout in P1–P3).
2. Content volume is moderate at launch (tens of products, projects, articles).
3. Deployment target is Vercel (frontend/SSR) + managed PostgreSQL + Supabase Storage — **confirm host**.
4. One primary Jordan locale for Arabic at launch; per-country content variants deferred to expansion.
5. Staff editors are non-technical; CMS must be forgiving and preview-capable.

## 9. Required Inputs From You (blocking for later phases, not for planning)

| Input | Needed by | Interim handling |
|---|---|---|
| Thmanyah font files (+ license) | Design implementation | Interim: **Readex Pro** (variable, Arabic+Latin) |
| Logo (SVG) + brand kit + exact gold hex | Design implementation | Placeholder gold token; refine on receipt |
| Old-site business content (URL or export) | Content population | Neutral placeholder copy, clearly marked |
| Real product/project/testimonial data | Content population | Structured placeholders in DB seed |
| Contact facts (address, phones, WhatsApp, hours, socials) | Contact/Footer | Placeholder values |
| Deployment/host + domain | Go-live | Assume Vercel + managed PG |
| Analytics choice (GA4 / Plausible / Vercel) | SEO/analytics | Assume privacy-friendly + GA4 optional |

## 10. Non-Goals for Design

No generic hero-stock clutter, no carousels-as-crutch, no boxed 2010-era layouts, no color-inverted dark mode, no template smell. Every page is custom-composed with intentional whitespace and typographic hierarchy.

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Font licensing delay (Thmanyah) | Fallback family + `font-display: swap`; single swap point in tokens |
| Scope breadth | Strict phase gates; DB & components built CMS-ready from P1 |
| RTL/LTR regressions | Logical CSS properties only; RTL-first Storybook/visual checks |
| Performance vs. rich motion | Motion budget, `prefers-reduced-motion`, code-splitting, RSC-first |
| Content readiness | Placeholder seed; CMS lets staff populate without redeploys (P2) |

---

**Next documents:** `01-srs.md`, `02-information-architecture.md`, `03-database-schema.md`, `04-folder-structure.md`, `05-design-system.md`.
