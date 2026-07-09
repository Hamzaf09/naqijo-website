# Naqi Al Rabia — Platform Documentation

Planning deliverables for the Naqi Al Rabia digital platform. **Status: awaiting approval (workflow step 10).** No application code is written until these are approved.

| # | Document | Purpose |
|---|---|---|
| 00 | [Project Scope](./00-project-scope.md) | Vision, goals, phases, in/out of scope, required inputs, risks |
| 01 | [SRS](./01-srs.md) | Personas, RBAC, functional & non-functional requirements |
| 02 | [Information Architecture](./02-information-architecture.md) | Sitemap, URLs, navigation, page blueprints, i18n routing |
| 03 | [Database Schema](./03-database-schema.md) | Full Prisma schema (all phases), i18n via translation tables |
| 04 | [Folder Structure](./04-folder-structure.md) | App Router + feature-based + clean architecture layout |
| 05 | [Design System](./05-design-system.md) | Tokens, color (light/dark), typography, motion, components, RTL |

## Decisions locked
- **Backend:** Unified Next.js (route handlers + Server Actions, Prisma, PostgreSQL) — no separate Express.
- **Sequencing:** Phase 1 design system + public site → Phase 2 admin + CMS → Phase 3 CRM + maintenance + media.
- **Assets:** Placeholder tokens/content now (interim font **Readex Pro**); swap real Thmanyah/logo/content later via single source of truth.

## Stack
Next.js (latest, App Router), React, TypeScript, Tailwind, shadcn/ui, Framer Motion, React Hook Form, Zod, next-intl · Prisma + PostgreSQL · Supabase Storage · JWT + RBAC.

## Open questions (see SRS §8)
Checkout vs inquiry-only · email provider · analytics choice · host confirmation · invoices scope · customer portal.
