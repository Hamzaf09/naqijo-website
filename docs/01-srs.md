# Naqi Al Rabia — Software Requirements Specification (SRS)

**Document:** 01 · SRS
**Status:** Draft for approval
**Last updated:** 2026-07-09

---

## 1. Purpose & Scope

Defines functional (FR) and non-functional (NFR) requirements for the Naqi Al Rabia platform across Phases 1–3. Requirements are IDs (`FR-x`, `NFR-x`) for traceability. Phase tags: **[P1] [P2] [P3]**.

## 2. Personas

| Persona | Needs | Key journeys |
|---|---|---|
| **Homeowner (Amal)** | Clean water, trust, easy request | Browse products → request installation / maintenance |
| **Contractor / Developer (Khaled)** | Specs, capacity, projects proof | Services → Projects → Contact sales / bulk inquiry |
| **Facility Manager (Rana)** | Reliability, maintenance SLAs | Maintenance → schedule → track status |
| **Content Editor (staff)** | Edit everything without a developer | CMS: pages, products, blog, media, SEO |
| **Sales/CRM Agent (staff)** | Manage leads & customers | CRM: profile, orders, history, notes |
| **Technician (staff/field)** | Job list, update status, upload photos | Maintenance: assigned jobs → before/after → report |
| **Administrator** | Control, roles, analytics, config | Dashboard, RBAC, settings, audit |

## 3. Roles & RBAC Matrix

Roles: `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `CRM_AGENT`, `TECHNICIAN`, `CUSTOMER` (future auth’d portal), `GUEST` (public).

| Capability | SUPER_ADMIN | ADMIN | EDITOR | CRM_AGENT | TECHNICIAN | CUSTOMER | GUEST |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| View public site | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Submit requests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage CMS content | ✓ | ✓ | ✓ | — | — | — | — |
| Manage products | ✓ | ✓ | ✓ | — | — | — | — |
| Manage blog | ✓ | ✓ | ✓ | — | — | — | — |
| Media library | ✓ | ✓ | ✓ | — | — | — | — |
| CRM (customers/leads) | ✓ | ✓ | — | ✓ | — | own | — |
| Assign maintenance | ✓ | ✓ | — | ✓ | — | — | — |
| Update maintenance job | ✓ | ✓ | — | ✓ | own jobs | — | — |
| Manage users/roles | ✓ | ✓ | — | — | — | — | — |
| System settings | ✓ | — | — | — | — | — | — |
| View analytics | ✓ | ✓ | scoped | scoped | own | — | — |
| Audit log | ✓ | ✓ | — | — | — | — | — |

## 4. Functional Requirements

### 4.1 Localization & Theming (foundation) [P1]
- **FR-1** Default locale is Arabic; first visit resolves to `/ar` with RTL. Locale detected from stored preference → cookie → `Accept-Language`, but **defaulting to `ar`** when ambiguous.
- **FR-2** Language switcher on every page; switching preserves the current route and persists (cookie + user pref if authed).
- **FR-3** All routes exist per locale with **localized slugs**; a canonical + hreflang pair links the two.
- **FR-4** Theme toggle: Light (default) / Dark / System. Preference persists; transition is animated; respects `prefers-reduced-motion`.
- **FR-5** Numerals, dates, and units format per locale.

### 4.2 Public Website [P1]
- **FR-10 Home** — narrative hero, intro, services, products, statistics (animated counters), projects, testimonials, partners, why-us, latest articles, FAQ, contact, footer. Every block CMS-driven (P2).
- **FR-11 About** — story, mission/vision/values, timeline, team, certifications.
- **FR-12 Services** — list + **Service Detail** (overview, process, benefits, related products/projects, CTA).
- **FR-13 Products** — catalog with filter/sort (category, subcategory, status), grid, quick view.
- **FR-14 Product Detail** — large gallery, specifications table, downloads (datasheets), warranty, related products, comparison entry, installation & maintenance request CTAs, WhatsApp button.
- **FR-15 Product Comparison** — compare ≥2 products across specs in a table.
- **FR-16 Projects** — portfolio grid + **Project Detail** (gallery, scope, location, outcome, related services).
- **FR-17 Maintenance** — service explainer + entry to Maintenance Request.
- **FR-18 Installation Request** — multi-step form (contact, address/location, product/service, preferred date, notes). Validated, localized, spam-protected, confirmation + notification.
- **FR-19 Maintenance Request** — form (customer, product/serial optional, issue, urgency, attachments, location). Same guarantees as FR-18.
- **FR-20 Blog** — list with categories/tags, featured posts, pagination; **Article** with author, reading time, featured image, share buttons, related articles, structured content.
- **FR-21 FAQ** — categorized, searchable accordion; FAQ structured data.
- **FR-22 Contact** — form + map, address, phones, WhatsApp, hours, socials.
- **FR-23 Search** — site-wide search across products, projects, articles, pages; localized results; keyboard-accessible.
- **FR-24 Legal** — Privacy Policy, Terms & Conditions (CMS-editable, localized).
- **FR-25 404 / error** — branded, helpful, localized.
- **FR-26 WhatsApp** — floating/contextual deep-link with prefilled localized message.

### 4.3 Forms & Notifications [P1 → P2]
- **FR-30** All forms use React Hook Form + Zod; inline localized errors; accessible labeling; honeypot + rate limiting + optional CAPTCHA.
- **FR-31** On submit: persist to DB, send confirmation to user (email) and notification to staff (email + in-app in P2).
- **FR-32** Requests appear in admin (P2) and become CRM records (P3).

### 4.4 Admin Panel & CMS [P2]
- **FR-40 Dashboard** — analytics widgets: revenue, traffic, orders, maintenance, customers; charts; recent activity; notifications; quick actions.
- **FR-41 CMS** — edit homepage & all sections, images/videos, texts, buttons/CTAs, menus, footer, per-page SEO. Draft/publish + preview + version history.
- **FR-42 Page builder (constrained)** — reorder/toggle predefined section blocks per page (not a freeform builder — protects the design system).
- **FR-43 Product management** — CRUD products, categories, subcategories; pricing, specifications (typed key/value groups), warranty, downloads, images/videos, related products, status (draft/active/archived), per-product SEO.
- **FR-44 Blog management** — CRUD posts, categories, tags, authors; featured image, scheduling, SEO, related; markdown/rich content.
- **FR-45 Media Library** — folders, drag-drop upload, automatic WebP/AVIF conversion + responsive variants, alt text per locale, search, usage references.
- **FR-46 Menus/Navigation** — manage header/footer menus and ordering per locale.
- **FR-47 Users & roles** — invite users, assign roles (RBAC §3), deactivate.
- **FR-48 Settings** — site identity, contact facts, socials, integrations, feature flags, locale defaults.
- **FR-49 Audit log** — who changed what, when (content + config + auth events).

### 4.5 Auth [P2]
- **FR-50** JWT-based auth (access + refresh, httpOnly cookies), password hashing (argon2/bcrypt), RBAC enforcement server-side on every mutation.
- **FR-51** Session management, lockout on brute force, password reset.
- **FR-52** Architected for future Google + Apple OAuth (provider adapter seam; no rework required).

### 4.6 CRM [P3]
- **FR-60** Customer profile: identity, orders, maintenance history, installation history, invoices, notes, tags, **future AI history** field/relation.
- **FR-61** Leads from public requests convert to customers; dedupe by phone/email.
- **FR-62** Timeline/activity view per customer.

### 4.7 Maintenance System [P3]
- **FR-70** Customer submits request (from FR-19) → ticket created.
- **FR-71** Admin/CRM assigns technician; schedule set.
- **FR-72** Technician updates status (`NEW → ASSIGNED → IN_PROGRESS → COMPLETED → CANCELLED`), uploads **before** and **after** photos.
- **FR-73** Maintenance report generated (findings, parts, actions).
- **FR-74** Next maintenance schedule recorded and surfaced (reminders).

### 4.8 Analytics [P3]
- **FR-80** Aggregate dashboards: revenue, traffic, orders, maintenance load, customer growth; date-range filters; export.

### 4.9 AI-Ready Seams [architectural, all phases]
- **FR-90** Content structured for retrieval (clean models, embeddings-ready fields) to enable: AI customer assistant, AI content writer, AI product recommendations, AI maintenance assistant — addable without schema/architecture rework.

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-1** Lighthouse ≥ 95 (Performance, Accessibility, Best Practices, SEO) on key pages.
- **NFR-2** Core Web Vitals: LCP < 2.0s, INP < 200ms, CLS < 0.1 (field + lab).
- **NFR-3** RSC-first; code-splitting; route-level lazy loading; image optimization (next/image, WebP/AVIF, responsive); font subsetting + `swap`.
- **NFR-4** Performance budget enforced in CI (bundle size, LCP).

### 5.2 Accessibility
- **NFR-10** WCAG 2.2 AA: semantic HTML, focus management, keyboard nav, ARIA where needed, contrast ratios met in both themes, visible focus, reduced-motion support.
- **NFR-11** RTL and LTR fully verified; logical CSS properties only.

### 5.3 SEO
- **NFR-20** Per-page localized meta title/description/keywords, canonical, Open Graph, Twitter cards.
- **NFR-21** Schema.org: Organization, LocalBusiness, Product, Article, BreadcrumbList, FAQPage, Service.
- **NFR-22** `robots.txt`, localized `sitemap.xml`, `hreflang`, clean localized URLs, breadcrumbs.

### 5.4 Security
- **NFR-30** OWASP Top 10 hardening; server-side authz on all mutations; input validation (Zod) on client + server.
- **NFR-31** CSRF protection, secure httpOnly cookies, security headers/CSP, rate limiting, secrets in env/vault.
- **NFR-32** File-upload validation (type/size/scan), signed URLs for storage.
- **NFR-33** PII protection; audit trail; least-privilege RBAC.

### 5.5 Reliability & Observability
- **NFR-40** Error monitoring (e.g., Sentry), structured logging, uptime health checks.
- **NFR-41** Automated DB backups; migration-based schema changes (Prisma Migrate).

### 5.6 Maintainability & Quality
- **NFR-50** Strict TypeScript; ESLint + Prettier; feature-based, layered architecture; no duplicated code.
- **NFR-51** Reusable components/hooks/services; documented design system.
- **NFR-52** Tests: unit (Vitest), component (Testing Library), e2e (Playwright), critical-path coverage; CI gates.

### 5.7 Internationalization
- **NFR-60** Full ar/en parity, RTL-first; translation completeness checks in CI; no hardcoded strings.

### 5.8 Responsiveness
- **NFR-70** Fully responsive: mobile, tablet, laptop, desktop; defined breakpoints; touch targets ≥ 44px.

### 5.9 Compliance & Privacy
- **NFR-80** Cookie/consent handling; privacy-friendly analytics; data retention policy for leads/PII.

## 6. Constraints

- Stack fixed: Next.js (latest, App Router), React, TypeScript, Tailwind, shadcn/ui, Framer Motion, RHF, Zod, next-intl; Prisma + PostgreSQL; Supabase Storage; JWT + RBAC.
- Backend runs **inside Next.js** (route handlers + Server Actions) — no separate Express service.
- Thmanyah is the target typeface (interim fallback until files provided).

## 7. Acceptance (phase gates)

Each phase is accepted when: all in-scope FRs demoable, NFR targets met on the phase’s pages (Lighthouse/CWV/a11y/i18n checks green), and stakeholder sign-off recorded.

## 8. Open Questions

1. Are products purchasable (checkout) or **inquiry-only**? (Assumed inquiry-only.)
2. Email provider preference (Resend / SES / SMTP)?
3. Analytics: GA4, Plausible, or Vercel Analytics?
4. Deployment host confirmation (Vercel + managed PG + Supabase)?
5. Invoices in CRM: record-keeping only, or generate PDFs?
6. Do you want a future authenticated **customer portal** in P3, or staff-only CRM?
