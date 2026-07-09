# Naqi Al Rabia — Design & Architecture Review

**Document:** DESIGN_REVIEW.md
**Author:** Lead Architecture / Design
**Date:** 2026-07-09
**Verdict:** v1 is a **solid foundation, not a world-class experience yet.** It would not, as-is, earn an Awwwards nomination or pass an Apple/Stripe bar. This document says exactly why, and defines the redesign that will.

---

## 0. How this review was conducted

- **Reviewed artifacts:** the v1 homepage mockup (archived — superseded by the rebuilt app), the design-system spec ([docs/05-design-system.md](docs/05-design-system.md)), IA ([docs/02-information-architecture.md](docs/02-information-architecture.md)), DB schema, folder structure, SRS, scope.
- **Rendered & screenshotted** every homepage section at 1280px (hero, services, stats, products, CTA, footer).
- **Ingested the real brand assets:** the genuine **Thmanyah** family (Sans + Serif Display + Serif Text, 5 weights each) and rendered a live type specimen (now integrated directly into the app via `next/font/local`; see FONTS.md).
- **Extracted real business content** from the old site `naqijo.com` (About, Services, Products) — used as a **content source only**, never for layout/UI.
- **Benchmarked** each decision against Apple, Stripe, Linear, Airbnb, Notion, Vercel, Dyson, Tesla — for *attention to detail*, not imitation.

The five-second test: *Does the homepage impress in the first 5 seconds?* Today: **it looks clean and competent, but "AI-generated corporate."** That is the gap we close.

---

## 1. Everything reviewed (scope of audit)

Homepage · Header/nav · Hero · Section system · Service cards · Stats band · Product cards · CTA band · Footer · Buttons · Iconography · Color system · Typography · Spacing/grid · Motion (planned) · Light/Dark strategy · Responsive strategy · Accessibility baseline · Performance strategy · SEO/IA · Content · Brand system.

---

## 2. Strengths (what to keep)

1. **Token architecture is right** — raw palette → semantic tokens → components, with an independent dark map. This is the correct enterprise backbone and stays.
2. **RTL-first is genuinely correct** — logical properties, `dir` handling, Arabic-default. The Arabic mockup mirrors properly; this is often done wrong and we did it right.
3. **Architecture is sound** — unified Next.js, feature-based, translation-table i18n, CMS-ready models, AI seams. No rework needed at the foundation.
4. **Spacing discipline** — generous vertical rhythm, sensible container widths. The bones of good whitespace exist.
5. **Color palette is a good starting point** — the navy/sky/gold relationship is coherent and on-brand.
6. **Documentation-first process** — scope/SRS/IA/DB/design-system before code is exactly how a premium build should start.

---

## 3. Weak points (honest critique of v1)

> This is where v1 fails the "would Apple/Stripe ship this?" test. Each item is a real defect, ranked by impact.

### Critical (kills the premium feel)
1. **Typography was placeholder (Readex Pro).** The single biggest miss. A luxury brand lives or dies on type, and v1 used a stand-in sans for *everything* — no display voice, no editorial contrast. **The real Thmanyah family — especially Serif Display — transforms this** (see specimen). This was the #1 reason it read "generic."
2. **The hero is a template cliché.** Left-text / right-gradient-box with a fake SVG wave and a floating "99.9%" card. This exact composition appears on thousands of AI/template sites. It is *competent* and *forgettable*. It has **no art direction, no concept, no photography, no signature idea.** Apple/Dyson would never ship a gradient rectangle as the hero of a *product* company.
3. **Over-reliance on blue gradients** (hero box, stats band, CTA band, logo mark, gradient text on stats). Gradients-as-decoration is the tell of an AI-generated site. Premium work uses **flat, confident color + typographic hierarchy + real imagery + light**, not gradient fills to create interest.
4. **Placeholder icon tiles instead of product imagery.** A water-solutions company's homepage with *zero real product/installation photography* cannot feel premium. Line-icon tiles in a 4:3 box read as wireframe, not product.
5. **The logo mark is generic** — a rounded-square gradient with "نق" initials is a default-template move. The brand deserves a real mark (pending the actual logo/gold hex from you).

### High
6. **Repetitive, rigid layout rhythm.** Everything is a centered container with a 3-column card grid. Hero grid, services grid, products grid — same cadence three times. **No asymmetry, no editorial breaks, no full-bleed moments, no scale contrast.** World-class pages vary rhythm deliberately.
7. **Gradient text on the stats** (`-webkit-background-clip`) is a dated 2019 trick and hurts legibility/contrast.
8. **Icon system is inconsistent** — hand-drawn inline SVGs with varying stroke logic. Needs one coherent set (Lucide, 1.5px) or a commissioned custom set.
9. **Cards are flat and interchangeable** — same padding, same radius, same hover lift. No hierarchy between a hero product and a secondary one.
10. **Dark mode was never designed** — only specified in tokens. For a brand that demands "dark mode designed separately," this is a gap.
11. **No motion or micro-interaction was actually demonstrated** — the premium feel lives in transitions, reveals, magnetic hovers, cursor detail. v1 is static.

### Medium
12. **Dev scaffolding leaked into the design** (the fixed "معاينة تصميم" pill). Minor but signals unfinished.
13. **Number/plus rendering in RTL** (`+15`, `+3,200`) needs locale-aware treatment; the `+` placement is ambiguous.
14. **Trust strip is weak** ("ضمان معتمد" dots) — generic, unsubstantiated, no logos/certifications.
15. **Content is invented placeholder marketing**, not the real, stronger story available from the business (17 years, 456+ clients, 5-yr warranty, 6 service lines).

---

## 4. Design improvements (the redesign direction)

### 4.1 Typography — the biggest single upgrade
Adopt the real **Thmanyah three-family system** (now installed at `assets/fonts/thmanyah/`, verified rendering):

| Family | Role | Usage |
|---|---|---|
| **Thmanyah Serif Display** | Editorial voice | Hero headline, section titles, big pull-quotes, numbers. This is the luxury signature. |
| **Thmanyah Sans** | Interface & body | Nav, buttons, labels, cards, forms, most paragraphs. |
| **Thmanyah Serif Text** | Long-form reading | Blog articles, About story, legal — optimized for sustained reading. |

Direction: **large, confident serif-display headlines** (weights 300–500 for elegance, not always bold), tight leading on display, generous leading on body. Let the Arabic serif breathe — it is inherently premium. Pair with restrained sans for everything functional. This alone moves us from "template" to "editorial."

### 4.2 Art direction & concept
Give the site **one idea**: *"Clarity — engineered."* Water = light, refraction, purity, precision.
- **Hero:** replace the gradient box with a **full-bleed, art-directed moment** — real water/light macro photography or a restrained signature visual (refraction, ripple, a precision-engineered product render), with a large serif headline overlaid and enormous whitespace. Consider a near-white hero with one hero image and towering type — the Apple/Dyson move — rather than a dark gradient panel.
- **Kill decorative gradients.** Use flat navy, flat white, soft gray, and gold **as a hairline/detail accent only** (rules, underlines, small marks) — gold is jewelry, used sparingly, never as a fill slab.
- **Introduce editorial layout variety:** asymmetric hero, offset image/text pairs, one full-bleed statement section, a horizontal-scroll projects rail, oversized section numbers, thin dividing rules. Break the 3-column monotony.

### 4.3 Color & surface
- Reduce saturation of large fills; let **white and space** carry the luxury.
- Dark mode = a **designed, warm-navy environment** (deep desaturated navy `#0A1220` base, elevated surfaces, gold/sky as accents, serif headlines in near-white) — composed independently, not inverted.
- Elevation via **soft, low-spread shadows + hairline borders**, not glows or gradients.

### 4.4 Components
- **Cards:** introduce a hierarchy — a "feature" card (large, image-led) vs. compact cards; hover = subtle image scale + rule reveal, not just translateY.
- **Buttons:** refine to two primary variants max; add a signature underline/hover-fill micro-interaction; ensure ≥44px targets.
- **Icons:** one coherent line set; consider custom water/engineering glyphs for the 6 service lines.
- **Product imagery:** real renders on clean backgrounds (or duotone treatment for cohesion) — never icon placeholders in production.

### 4.5 Motion & micro-interaction
- Section reveals (opacity + 12–16px rise, staggered), respecting `prefers-reduced-motion`.
- Magnetic/hover-intent on primary CTAs; animated counters on stats (no gradient text).
- Page/route transitions; mega-menu spring; image parallax used *once or twice*, not everywhere.
- Motion is seasoning — restraint is the premium signal.

---

## 5. UX improvements
1. **Clarify the primary action.** "اطلب الخدمة" should lead to a crisp chooser (Installation vs Maintenance) — reduce cognitive load at the CTA.
2. **Reflect the real 6 service lines** (filtration, solar/renewable, smart home, kitchens, storage, after-sales) in nav + services — v1 under-represented the business.
3. **Add a sticky, condensing header** with an obvious language + theme switch and a persistent WhatsApp path (business is 24/7).
4. **Progressive disclosure on product detail** — specs/downloads/warranty in a calm tabbed rhythm, with clear install/maintenance CTAs.
5. **Search should be command-style (⌘K)** and reachable on mobile.
6. **Trust, made concrete** — surface "17 years," "5-year warranty," "quarterly maintenance," certifications, and real testimonials near decision points, not vague dots.
7. **Forms:** multi-step with save-safety, inline localized validation, and a confirmation state that feels considered.

---

## 6. Performance improvements
1. **Self-host Thmanyah WOFF2** (done — ~76–84KB/weight) with `font-display: swap`; **subset** to Arabic+Latin and preload only the 2–3 weights used above the fold (Display Medium, Sans Regular/Medium). 15 weights exist — ship only what's used per route.
2. **RSC-first**; keep client JS minimal (motion islands only).
3. **next/image** with AVIF/WebP, responsive `sizes`, LQIP blur for all real photography (which we're adding).
4. **Do not ship decorative gradients/large background images** without art-direction budget; prefer CSS + one optimized hero asset.
5. **Route-level code-splitting**; Lighthouse CI budget gate (LCP < 2.0s, INP < 200ms, CLS < 0.1) as defined in SRS.
6. Watch **CLS from web fonts** — size-adjust/fallback metrics for Thmanyah to avoid layout shift on swap.

---

## 7. Accessibility improvements
1. **Icon buttons currently use text glyphs** (⌕, ☾) — replace with real SVG icons + `aria-label`; ensure visible focus rings (`--ring`) on every interactive element.
2. **Verify contrast in both themes** — muted gray text on white and any text over navy must meet ≥4.5:1; gold text must be the `gold-600` shade on light, never light gold.
3. **Kill gradient text** — it's a contrast/readability liability.
4. Semantic landmarks, skip-to-content, keyboard-operable mega-menu & drawer, focus trap/restore on dialogs, `aria-live` for toasts.
5. Respect `prefers-reduced-motion` for every animation, including the theme transition.
6. Confirm RTL/LTR parity per component (Storybook matrix).

---

## 8. Mobile & tablet improvements
1. **Design mobile-first, not desktop-shrunk.** The hero must be composed for a tall, narrow canvas — big serif headline, one strong image, thumb-reachable CTA — not a scaled-down two-column.
2. **Real mobile nav** — full-screen RTL drawer with the 6 services, language/theme, and a prominent WhatsApp/Request action.
3. Touch targets ≥44px; generous tap spacing; sticky bottom action bar on product/detail pages (Request / WhatsApp).
4. Fluid type via `clamp()` tuned per breakpoint; verify Arabic line-length and wrapping on small screens.
5. Test tablet as a first-class layout (2-col rhythm), not an in-between.

---

## 9. Content improvements (from the real business)
Use the old site as **content source only**. Corrections and upgrades:

- **Brand name discrepancy to resolve:** your brief says **"Naqi Al Rabia"**; the live site brands as **نقي / NaqiJo**. Confirm the canonical Arabic + English name before launch. *(Flagged as blocking for brand/SEO.)*
- **Six real service lines** (replace my 5 placeholders): فلاتر المياه · الطاقة المتجددة (شمسية) · المنزل الذكي · المطابخ · خزانات المياه · خدمات ما بعد البيع.
- **Real products:** Aquatec Smart RO (6-stage), Smart 4-stage RO, Undersink RO with TDS & mineral control — need real specs/photos from you.
- **Real proof:** 17+ years, 456+ clients, 53+ employees, 513+ operations, 5-year warranties, quarterly maintenance, international certifications, 24/7, service centers "in all regions."
- **Real contact:** Khalda, Wasfi Al-Tal St., Fahid Greissat Complex, ground floor · +962 79 230 0005 · +962 79 666 0888 · info@naqijo.com · Facebook/YouTube/Instagram/LinkedIn.
- **Rewrite the story, don't copy it.** The real About line — *"في عالمٍ تتسارع فيه التكنولوجيا… وُلدت نقي برؤيةٍ واضحة: أن نصنع فرقًا حقيقيًا في حياة الناس"* — is genuinely good; elevate it with Thmanyah Serif and sharper marketing copy, bilingual, SEO-tuned.
- Improve readability, storytelling, and keyword coverage (water filtration, RO, solar, smart home, kitchens, Jordan/Amman) — never keyword-stuff.

---

## 10. SEO improvements
1. Per-page localized metadata, canonical + `hreflang` (ar / en / x-default→ar), localized slugs (already in schema).
2. Structured data: `Organization` + `LocalBusiness` (with the real address, geo, hours, phones), `Product`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`.
3. Localized `sitemap.xml`, `robots.txt`, OG/Twitter cards with branded, per-locale images (generated via `/api/og`).
4. Migrate valuable old-site content (services, products, any blog) with 1:1 redirects from old URLs (`/service`, `/product`, `/about`, `/blog`) to new localized routes to preserve equity.
5. Real, keyword-rich, human copy in Thmanyah — content quality *is* SEO.

---

## 11. Brand improvements
1. **Typography is now the brand anchor** — Thmanyah Serif Display is distinctive and ownable; make it the recognizable voice across hero, section titles, and numbers.
2. **Gold as jewelry** — hairline rules, small marks, underlines, focus details; never a fill. This reads luxury; gold slabs read cheap.
3. **A signature motif** — a single, restrained "clarity/refraction" visual language (light through water, precision lines) used consistently but sparingly.
4. **Real logo + exact gold hex needed** from you to finalize the mark, favicon, and gold token.
5. **Photography art-direction guide** — clean, calm, engineering-forward, consistent duotone/treatment — so every image feels like one brand.
6. **Tone of voice** — confident, precise, warm; bilingual parity; "trusted partner," not "vendor."

---

## 12. Scorecard (v1, honest)

| Dimension | v1 | Target |
|---|---|---|
| Typography | 3/10 (placeholder) | 9/10 with Thmanyah system |
| Art direction / concept | 2/10 | 9/10 |
| Layout originality | 4/10 | 9/10 |
| Color/surface restraint | 5/10 | 9/10 |
| Motion / micro-interaction | 1/10 (none) | 8/10 |
| Component hierarchy | 5/10 | 9/10 |
| Dark mode | 0/10 (undesigned) | 9/10 |
| Accessibility | 6/10 | 9/10 (AA) |
| Content authenticity | 2/10 (placeholder) | 9/10 (real) |
| Performance readiness | 7/10 | 9/10 |
| **"Would Apple ship this?"** | **No** | **Yes** |

---

## 13. Final recommendations & redesign roadmap

**Do not iterate on the v1 homepage. Re-establish the design language first, then rebuild.**

1. **Lock the brand inputs** (blocking): confirm canonical name (Naqi Al Rabia vs نقي), provide the **logo SVG + exact gold hex**, and any brand photography. *(I can proceed with refined placeholders if you prefer speed.)*
2. **Rebuild the design system around Thmanyah** — update `docs/05-design-system.md`: 3-family type scale, reduced-gradient color, gold-as-detail, designed dark mode, motion spec, refined components. Self-host + subset fonts.
3. **Design 2–3 hero concepts** (art-directed) and pick a direction *before* building pages — I'll render them for your sign-off.
4. **Rebuild the homepage** with editorial layout variety, real content, real/duotone imagery, and motion — then hold it to the 5-second and Awwwards bar.
5. **Design light + dark** side by side for every new component.
6. **Update the content model** to the real 6 services + real products; seed with authentic copy (rewritten, not copied).
7. **Then proceed** page-by-page per the Phase-1 plan, each page reviewed against this bar.

**Guiding principle:** restraint, type, space, and real content — not gradients and effects — are what make this world-class. Every section must justify its existence.

---

### Immediate next step (awaiting your go-ahead)
Per your instruction, I paused after this review. On approval, my first move is **(a)** rewrite the design system doc around Thmanyah + reduced-gradient direction, and **(b)** render **2–3 art-directed hero concepts** in the real font for you to choose from — before rebuilding any pages. Tell me whether to wait for the logo/gold hex or proceed with refined placeholders.
