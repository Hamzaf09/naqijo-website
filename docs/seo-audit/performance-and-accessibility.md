# Performance and accessibility

**Not measured:** Lighthouse, PageSpeed Insights and CrUX field data were unavailable (no browser-driven run was done and external hosts are blocked). No field data is claimed.

Observed from the build/code (lab-free, static inspection):
- Images use `next/image`, WebP only, 1-year cache TTL; 0 `<img>` missing `alt` on crawled pages.
- Pages are statically generated (`●` SSG, ISR 5m); `Cache-Control: s-maxage=300, stale-while-revalidate`.
- Fonts: self-hosted Alexandria variable font via `next/font`.
- Third-party scripts: GA/GTM only if configured in CMS Settings (not loaded otherwise).
- `<html lang/dir>` correct; header/footer use `<nav aria-label>`.
- No performance changes were made (no measurements to justify them).

To do when allowed: run PageSpeed Insights on `/ar`, `/ar/products`, `/ar/products/ro-bn01`, `/ar/contact` (mobile) and record LCP/INP/CLS lab and field values.
