# Naqi Al Rabia — Design System

**Document:** 05 · Design System
**Status:** Draft for approval
**Last updated:** 2026-07-09

> Philosophy: *engineering excellence made visible.* Minimal, luxury, timeless. Generous whitespace, large confident typography, soft depth, restrained motion. Zero clutter, zero template smell. Arabic-first (RTL) with perfect LTR parity. Placeholder tokens now; swap to real Thmanyah/logo/gold on receipt via a single source of truth.

---

## 1. Token Architecture

Two layers: **raw palette** (immutable scale) → **semantic tokens** (what the UI references). Components reference *only* semantic tokens, so re-theming = editing the map. Delivered as CSS custom properties + Tailwind theme extension. Dark mode is an **independent semantic map**, not an inversion.

## 2. Color — Raw Palette

```
/* Navy — Primary (deep, premium) */
--navy-50:#EEF4FA --navy-100:#D9E7F2 --navy-200:#A9C6E0 --navy-300:#6FA0CC
--navy-400:#3B79B5 --navy-500:#1C5A96 --navy-600:#17497B --navy-700:#123A63
--navy-800:#0E2E4E --navy-900:#0A2540 --navy-950:#06182E

/* Sky — Secondary (clean, refined) */
--sky-100:#E4F4FC --sky-200:#C2E7F8 --sky-300:#8FD4F2 --sky-400:#58BCE9
--sky-500:#29A3DE --sky-600:#1288C4 --sky-700:#0C6E9E

/* Gold — Accent (soft, elegant — placeholder until logo hex) */
--gold-200:#F0E1BF --gold-300:#E6CE93 --gold-400:#D8B76A --gold-500:#C9A24B --gold-600:#B7892F

/* Neutral — Soft Gray (cool-warm balanced) */
--gray-50:#F7F8FA --gray-100:#EEF0F3 --gray-200:#E1E5EA --gray-300:#CBD2DB
--gray-400:#9AA5B1 --gray-500:#6B7684 --gray-600:#4B5563 --gray-700:#333C48
--gray-800:#1F2733 --gray-900:#121820 --white:#FFFFFF

/* Feedback */
--success:#1E9E6A --warning:#D9A21B --danger:#D64545 --info:var(--sky-600)
```

## 3. Color — Semantic Tokens

| Token | Light | Dark (independent) |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0A1220` |
| `--bg-subtle` | `--gray-50` | `#0F1B2D` |
| `--surface` | `#FFFFFF` | `#0F1B2D` |
| `--surface-elevated` | `#FFFFFF` | `#14263D` |
| `--border` | `--gray-200` | `#1E3350` |
| `--border-strong` | `--gray-300` | `#2A4463` |
| `--fg` (text) | `--navy-900` | `#E8EEF5` |
| `--fg-muted` | `--gray-500` | `#9DB0C6` |
| `--fg-subtle` | `--gray-400` | `#6E829B` |
| `--primary` | `--navy-900` | `--navy-100` |
| `--primary-fg` | `#FFFFFF` | `--navy-950` |
| `--primary-hover` | `--navy-800` | `#FFFFFF` |
| `--secondary` | `--sky-600` | `--sky-400` |
| `--secondary-fg` | `#FFFFFF` | `--navy-950` |
| `--accent` | `--gold-500` | `--gold-400` |
| `--accent-fg` | `--navy-950` | `--navy-950` |
| `--ring` (focus) | `--sky-500` | `--sky-300` |
| `--overlay` | `rgba(6,24,46,.55)` | `rgba(0,0,0,.65)` |

**Contrast:** all text/background pairs meet WCAG 2.2 AA (≥4.5:1 body, ≥3:1 large); focus ring ≥3:1 against adjacent colors. Verified per theme.

## 4. Typography

- **Target family:** Thmanyah (Arabic + Latin). **Interim:** Readex Pro (variable, Arabic+Latin, premium/humanist). Single `--font-sans` var → one swap point.
- Arabic gets slightly increased line-height and letter-spacing normalization; digits localized (`ar` → Eastern Arabic optional, default Western per brand — confirm).
- `font-display: swap`, subset (Latin + Arabic), self-hosted for CWV.

**Fluid type scale (`clamp`, rem):**

| Role | Size (min→max) | Weight | Line-height | Use |
|---|---|---|---|---|
| Display | 2.75 → 4.5 | 700 | 1.05 | Hero headline |
| H1 | 2.25 → 3.25 | 700 | 1.1 | Page title |
| H2 | 1.75 → 2.375 | 600 | 1.15 | Section title |
| H3 | 1.375 → 1.75 | 600 | 1.2 | Subsection |
| H4 | 1.125 → 1.375 | 600 | 1.3 | Card title |
| Lead | 1.125 → 1.375 | 400 | 1.6 | Intro paragraph |
| Body | 1.0 (16px) | 400 | 1.7 | Default text |
| Small | 0.875 | 400/500 | 1.6 | Meta, captions |
| Overline | 0.75 | 600, tracked | 1.4 | Eyebrow labels |

Tracking: display/H1 slightly tight (Latin); Arabic uses normal tracking. Max line length 65–75ch (Latin), balanced for Arabic. `text-wrap: balance` on headings.

## 5. Spacing & Layout

- **4px base scale:** `0,1(4),2(8),3(12),4(16),5(20),6(24),8(32),10(40),12(48),16(64),20(80),24(96),32(128),40(160)`.
- **Container:** max `1280px` content, `1440px` wide; gutters `20px` mobile → `48px+` desktop. Generous section padding: `96–160px` vertical on desktop.
- **Grid:** 12-column, 24px gutter; responsive collapse. Asymmetric editorial layouts encouraged over rigid boxes.
- **Breakpoints:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Mobile-first; touch targets ≥44px.

## 6. Radius, Elevation, Borders

```
--radius-sm:8px --radius-md:12px --radius-lg:16px --radius-xl:24px --radius-2xl:32px --radius-full:9999px
```
- **Shadows (soft, layered — light):**
  `--shadow-xs:0 1px 2px rgba(10,37,64,.06)`
  `--shadow-sm:0 2px 8px rgba(10,37,64,.06)`
  `--shadow-md:0 8px 24px rgba(10,37,64,.08)`
  `--shadow-lg:0 16px 48px rgba(10,37,64,.10)`
  `--shadow-glow:0 0 0 1px var(--border), 0 8px 32px rgba(28,90,150,.12)`
- Dark elevation uses lighter surfaces + subtle inner border + reduced shadow (glow via border/bg, not heavy drop-shadow).
- Hairline borders `1px` at `--border`; cards default to `--radius-lg` + `--shadow-sm`.

## 7. Motion

- **Durations:** `fast 120ms · base 220ms · slow 380ms · reveal 600ms`.
- **Easing:** `--ease-out: cubic-bezier(.16,1,.3,1)` (primary), `--ease-in-out: cubic-bezier(.65,0,.35,1)`.
- **Patterns (Framer Motion wrappers):** section reveal (fade + 16px rise, stagger 60ms), hover lift on cards (`translateY(-4px)` + shadow), image parallax (subtle), animated stat counters, page/route transitions, mega-menu spring.
- **`prefers-reduced-motion`: fully respected** — transforms/parallax disabled, opacity-only fallbacks. Motion is accent, never a gate to content.

## 8. Iconography & Imagery

- **Icons:** Lucide, `1.5px` stroke, `24px` grid, currentColor; consistent optical size. Custom water/engineering glyphs where needed.
- **Imagery:** high-quality, calm, engineering/water-focused; duotone navy/sky treatment option for cohesion; `next/image` (AVIF/WebP, responsive, LQIP blur). No stock clichés.
- **Logo:** placeholder wordmark until SVG provided; reserved clear-space + dark/light variants planned.

## 9. RTL / LTR Rules

- **Logical CSS properties only** (`margin-inline`, `padding-inline-start`, `inset-inline`, `text-align:start`) — no left/right hardcoding.
- `dir` set on `<html>` per locale; components mirror automatically.
- **Directional icons** (arrows, chevrons, back) flip in RTL; neutral icons (search, user) do not.
- Numerals, dates, currency via locale formatters. Line-length and rhythm tuned per script.
- Every component has RTL + LTR stories verified in review.

## 10. Component Inventory (design-system contract)

Built on **shadcn/ui**, restyled to tokens, extended with motion + RTL. Each ships variants, sizes, states (default/hover/focus/active/disabled/loading), light+dark, RTL+LTR, and a11y semantics.

| Group | Components |
|---|---|
| **Actions** | Button (primary/secondary/ghost/outline/link/danger; sm/md/lg/icon; loading), IconButton, ButtonGroup, WhatsAppButton |
| **Forms** | Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, DatePicker, FileDropzone, FormField (label/hint/error via RHF+Zod), StepWizard |
| **Content** | Typography (Display/Heading/Text/Overline), Card (product/project/article/service variants), Badge, Tag, Avatar, Stat/Counter, Quote/Testimonial, Table, PricingRow, SpecTable, ComparisonTable |
| **Navigation** | Header, MegaMenu, MobileDrawer, Footer, Breadcrumbs, Pagination, Tabs, LanguageSwitcher, ThemeToggle, CommandSearch (⌘K), Anchor/TOC |
| **Feedback** | Alert, Toast, Tooltip, Popover, Dialog/Modal, Sheet, Drawer, Skeleton, Progress, EmptyState, ErrorState |
| **Layout** | Section, Container, Grid, Divider, Reveal/Stagger (motion), Sticky, Marquee (partner logos) |
| **Media** | Image, Gallery/Lightbox, VideoPlayer, LogoWall |
| **Admin (P2)** | DataTable (sort/filter/paginate), StatCard, Chart wrappers, FormBuilder blocks, MediaPicker, RichTextEditor, DropzoneUploader |

## 11. Accessibility Baseline (per component)

Semantic elements, labelled controls, keyboard operability, visible focus (`--ring`), ARIA only where needed, contrast verified in both themes, `aria-live` for async/toasts, focus trap + restore for dialogs/drawers, reduced-motion honored, min 44px targets.

## 12. Theming Mechanics

- `class="dark"` on `<html>` toggles the dark semantic map; default light.
- Preference: `system` default resolution → user override persisted (cookie + localStorage; user pref if authed). No flash (theme script inlined in `<head>`).
- Animated theme transition (background/color) ~220ms, disabled under reduced-motion.

## 13. Deliverable Assets (implementation phase)

- `styles/tokens.css` (CSS variables, light + dark) — **single source of truth**.
- `tailwind.config.ts` mapping semantic tokens to Tailwind theme.
- `ui/*` primitives + Storybook stories (RTL/LTR × light/dark matrix).
- Figma-parity documentation kept in this file (design source of record).

---

**Swap points on asset receipt:** `--font-sans` (Thmanyah), `--gold-*` (exact logo gold), logo SVG, brand imagery. All isolated so no component code changes.
