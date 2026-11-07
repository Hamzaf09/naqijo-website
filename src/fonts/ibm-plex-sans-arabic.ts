import localFont from "next/font/local";

/**
 * IBM Plex Sans Arabic — global font for the whole site (Arabic + Latin),
 * self-hosted so production builds don't depend on network access. Files are
 * the "complete" WOFF2 set from IBM's official `@ibm/plex-sans-arabic` v1.1.0
 * package (SIL Open Font License 1.1 — see ./ibm-plex-sans-arabic/OFL.txt).
 *
 * The family stops at Bold (700). Bold is declared for 700–900 so the
 * existing `font-extrabold` / `font-black` headings use the real Bold face
 * instead of a browser-synthesised one.
 *   Display / section titles -> 700
 *   Buttons                  -> 600
 *   Body                     -> 400 / 500
 * Exposed as `--font-plex-arabic` and mapped to --font-{sans,display,text} in
 * globals.css so every existing component picks it up with no edits.
 */
export const plexSansArabic = localFont({
  src: [
    { path: "./ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-sans-arabic/IBMPlexSansArabic-Medium.woff2", weight: "500", style: "normal" },
    { path: "./ibm-plex-sans-arabic/IBMPlexSansArabic-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.woff2", weight: "700 900", style: "normal" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
