# Performance and accessibility

**No field data.** PageSpeed Insights API answered `429 RESOURCE_EXHAUSTED` (shared anonymous daily quota) on 2026-10-24; CrUX and Search Console Core Web Vitals were not accessible. Everything below is **lab** data from one location and must not be read as real-user Core Web Vitals.

## Lab render — LIVE, Playwright Chromium, Pixel 7 emulation, via US proxy (2026-10-24 ≈09:26Z)

| Page | TTFB ms | LCP ms (element) | CLS | Transfer KB | JS errors | Failed requests |
|---|---|---|---|---|---|---|
| `/ar` (first, cold) | 952 | 3520 (hero `img`) | 0 | 764 | 0 | 0 |
| `/en` (warm cache) | 255 | 520 (hero `img`) | 0 | 54 | 0 | 0 |
| `/ar/products` | 345 | 1472 (H1) | 0 | 614 | 0 | 0 |
| `/ar/products/ro-bn01` | 282 | 668 (product `img`) | 0 | 78 | 0 | 0 |
| `/ar/products/category/drinking-water` | 300 | 680 | 0 | 94 | 0 | 0 |
| `/ar/services/water` | 275 | 1200 | 0 | 34 | 0 | 0 |
| `/ar/guides/central-vs-drinking-water-filter` | 250 | 464 (H1) | 0 | 128 | 0 | 0 |
| `/ar/contact` | 133 | 1148 | 0 | 54 | 0 | 0 |
| `/ar/water-filters-amman` | 266 | 1176 (H1) | 0 | 35 | 0 | 0 |
| `/en/commercial-water-treatment` | 268 | 1180 (H1) | 0 | 75 | 0 | 0 |
| `/ar/projects/apartment-abdoun` | 284 | 540 | 0 | 34 | 0 | 0 |
| `/ar/faq` | 266 | 1192 (H1) | 0 | 35 | 0 | 0 |

Pages were loaded in sequence in one browser context, so later pages reuse cached fonts/JS. Only the first `/ar` load is a cold load (3.5 s LCP, 764 KB). Raw: `evidence/live-render-mobile-2026-10-24.json`.

Scripted HTTP crawl latency (HTML only, 93 URLs): p50 237 ms, p90 278 ms, max 493 ms.

## Observations

- CLS 0 on every page; no horizontal overflow at 412 px; RTL/LTR correct.
- Images are WebP via `next/image` with long cache TTL; 45/45 assets load; 0 images without `alt`.
- No third-party scripts loaded (GA/GTM only render when configured in the CMS).
- Text-heavy pages (H1 as LCP) reach LCP in about 0.5–1.5 s on warm cache.
- Cold home load is the heaviest: hero image + fonts + JS. Worth a field-data check before optimizing. No change made without measurements.

## Accessibility spot checks

- One H1 per page; landmark `main`; footer navs have `aria-label`; the WhatsApp button has an `aria-label`.
- Tap targets: 18 elements under 24 px tall, all footer text links (19 px) separated by 12 px. This meets the WCAG 2.5.8 spacing exception.
- Not run: a full axe/Lighthouse accessibility audit (Lighthouse not installed; PSI quota exhausted).

## To do (owner or next session)

Run PageSpeed Insights (mobile) for `/ar`, `/ar/products`, `/ar/products/ro-bn01`, `/ar/contact`, and record the **field** section (if CrUX has data) separately from the lab section.
