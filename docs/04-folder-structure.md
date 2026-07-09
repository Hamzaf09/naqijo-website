# Naqi Al Rabia — Folder Structure & Architecture

**Document:** 04 · Folder Structure
**Status:** Draft for approval
**Last updated:** 2026-07-09

---

## 1. Architectural Principles

- **Next.js App Router**, RSC-first; Server Actions + route handlers as the backend (no separate Express).
- **Feature-based modules** + **Clean Architecture layering**: `domain` (types/entities) → `application` (use-cases/services) → `infrastructure` (Prisma/storage/email) → `presentation` (components/pages). UI never talks to Prisma directly.
- **Atomic Design** for UI: `ui` (atoms) → `components` (molecules/organisms) → `features` (feature compositions) → `app` (pages/routes).
- **Strict TypeScript**, path aliases (`@/…`), no cross-feature imports except via public `index.ts` barrels.
- **Localization-first**: `[locale]` segment wraps all routes; no hardcoded strings.

## 2. Top-Level Layout

```
naqi-al-rabia/
├── src/
│   ├── app/                      # App Router (routes only; thin)
│   ├── features/                 # feature modules (vertical slices)
│   ├── components/               # shared molecules/organisms (design system compositions)
│   ├── ui/                       # atoms (shadcn/ui-based primitives, extended)
│   ├── lib/                      # cross-cutting libs (db, auth, seo, i18n, utils)
│   ├── server/                   # application + infrastructure (use-cases, services, repos)
│   ├── styles/                   # globals, tokens, tailwind layers
│   ├── config/                   # site config, nav, feature flags, constants
│   ├── hooks/                    # shared reusable hooks
│   ├── types/                    # shared/domain types & zod schemas
│   └── messages/                 # next-intl catalogs (ar.json, en.json)  *(or per-namespace)*
├── prisma/                       # schema.prisma, migrations, seed.ts
├── public/                       # static assets (favicons, logo, fonts if self-hosted)
├── tests/                        # e2e (Playwright); unit/integration colocated
├── .storybook/                   # component workshop (optional but recommended)
├── docs/                         # these documents
├── messages.d.ts                 # typed i18n keys
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

## 3. `src/app` (routes — thin, compose features)

```
src/app/
├── layout.tsx                    # root (html lang/dir per locale, theme provider, fonts)
├── globals.css
├── [locale]/
│   ├── layout.tsx                # locale layout: intl provider, dir, header/footer
│   ├── page.tsx                  # Home
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── services/[slug]/page.tsx
│   ├── products/page.tsx
│   ├── products/[slug]/page.tsx
│   ├── products/compare/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── maintenance/page.tsx
│   ├── request/installation/page.tsx
│   ├── request/maintenance/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── blog/category/[category]/page.tsx
│   ├── blog/tag/[tag]/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx
│   ├── search/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── not-found.tsx             # localized 404
│   └── admin/                    # [P2] auth-gated, noindex
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── content/…             # pages/sections/menus/footer/seo
│       ├── products/…
│       ├── blog/…
│       ├── media/…
│       ├── crm/…                 # [P3]
│       ├── maintenance/…         # [P3]
│       ├── analytics/…           # [P3]
│       ├── users/…
│       ├── settings/…
│       └── audit/…
├── api/                          # route handlers (webhooks, uploads, health, og-image)
│   ├── health/route.ts
│   ├── uploads/route.ts
│   └── og/route.tsx
├── sitemap.ts                    # localized sitemap
├── robots.ts
└── manifest.ts
```

Server Actions live with their feature (`features/*/actions.ts`) and are imported by route/page components.

## 4. `src/features` (vertical slices)

Each feature is self-contained and exposes a barrel `index.ts`.

```
src/features/
├── home/            (sections: hero, intro, stats, ...)/  components/  actions.ts  index.ts
├── products/        components/  hooks/  actions.ts  schema.ts  queries.ts  index.ts
├── projects/
├── services/
├── blog/
├── faq/
├── contact/
├── requests/        (installation + maintenance forms, multi-step)  schema.ts  actions.ts
├── search/
├── navigation/      (header, mega-menu, footer, language-switcher, theme-toggle)
├── seo/             (metadata builders, JSON-LD components, breadcrumbs)
├── media/           [P2]
├── cms/             [P2]
├── auth/            [P2]
├── dashboard/       [P2]
├── crm/             [P3]
└── maintenance-ops/ [P3]
```

Feature module convention:
```
features/<name>/
├── components/          # feature-specific UI (organisms)
├── hooks/               # feature hooks
├── actions.ts           # 'use server' actions (mutations)
├── queries.ts           # server data fetchers (read)
├── schema.ts            # zod schemas (shared client/server)
├── types.ts
└── index.ts             # public surface
```

## 5. `src/ui` (atoms) & `src/components` (compositions)

```
src/ui/                  # shadcn/ui primitives, extended to our tokens
├── button.tsx  input.tsx  textarea.tsx  select.tsx  checkbox.tsx  radio.tsx
├── card.tsx  badge.tsx  alert.tsx  dialog.tsx  sheet.tsx  drawer.tsx
├── tabs.tsx  accordion.tsx  tooltip.tsx  popover.tsx  dropdown-menu.tsx
├── table.tsx  pagination.tsx  breadcrumb.tsx  avatar.tsx  skeleton.tsx
├── toast.tsx  switch.tsx  slider.tsx  progress.tsx  separator.tsx
└── typography.tsx        # Heading/Text/Display components (Thmanyah scale)

src/components/          # cross-feature organisms
├── section/             # Section shell, container, grid helpers
├── forms/               # FormField, FormError, StepWizard, FileDropzone
├── media/               # Image (next/image wrapper), Gallery, VideoPlayer
├── motion/              # Reveal, Stagger, Parallax (Framer Motion wrappers, reduced-motion aware)
├── theme/               # ThemeProvider, ThemeToggle
└── seo/                 # JsonLd, MetaImage
```

## 6. `src/server` (application + infrastructure)

```
src/server/
├── use-cases/           # orchestration (createServiceRequest, publishArticle, ...)
├── services/            # domain services (products, media, notifications, search)
├── repositories/        # Prisma access (only layer importing prisma client)
├── infrastructure/
│   ├── db.ts            # Prisma singleton
│   ├── storage.ts       # Supabase Storage (signed URLs, variants)
│   ├── email.ts         # transactional email adapter
│   └── ai/              # AI adapter seam (dormant): embeddings, assistant
├── auth/                # [P2] jwt, rbac guard, session, provider adapters (google/apple)
└── validation/          # shared server-side zod guards, rate-limit
```

## 7. `src/lib` & `src/config`

```
src/lib/
├── i18n/                # next-intl config, routing, getLocale, dir helper
├── seo/                 # buildMetadata(), hreflang, sitemap helpers
├── utils/               # cn(), formatters (date/number/currency per locale)
├── constants.ts
└── env.ts               # zod-validated environment variables

src/config/
├── site.ts              # name, defaults, socials, contact fallbacks
├── navigation.ts        # static nav fallback (before CMS)
├── features.ts          # feature flags (ai, oauth, portal)
└── theme.ts             # token references
```

## 8. Naming & Conventions

- Files/dirs: `kebab-case`; React components: `PascalCase`; hooks: `useX`; server actions: verbs.
- One component per file; colocate tests `*.test.tsx` and stories `*.stories.tsx`.
- Barrels only at module boundaries; no deep cross-feature imports.
- All user-facing text via `useTranslations`/`getTranslations` — **zero hardcoded strings**.
- Server-only code guarded with `import 'server-only'`; Server Actions marked `'use server'`.
- Zod schemas in `schema.ts` shared by client (RHF resolver) and server (action validation).

## 9. Testing & Quality Layout

```
tests/e2e/               # Playwright specs (ar + en, light + dark)
src/**/*.test.tsx        # Vitest + Testing Library (colocated)
.storybook/              # visual states, RTL/LTR, theme matrix
```
CI runs: typecheck → lint → unit → build → e2e (critical paths) → Lighthouse CI (perf/a11y/seo gates) → i18n completeness check.

## 10. Why This Scales

- New feature = new folder in `features/` with the same shape; nothing else changes.
- New locale/country = add catalog + locale enum + translation rows; routing already generic.
- New AI feature = implement adapter in `server/infrastructure/ai` + activate flag; models already have seams.
- CMS (P2) reads/writes the same models P1 seeds — additive, not a rewrite.
