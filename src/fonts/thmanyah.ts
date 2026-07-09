import localFont from "next/font/local";

/**
 * Thmanyah — official licensed font family, self-hosted via `next/font/local`.
 *
 * LICENSE SAFETY (why it is configured this way):
 *  - Files live in `src/fonts/thmanyah/` (NOT in `public/`), so there is no
 *    predictable, directly downloadable URL. Next.js serves them from hashed,
 *    fingerprinted paths under `/_next/static/media/<hash>.woff2`.
 *  - Only WOFF2 (web-optimized) is shipped — never the OTF/TTF source files.
 *  - The `.woff2` files are gitignored (see `.gitignore`) so they are never
 *    committed to a public repository. See `FONTS.md` for provisioning.
 *  - `next/font` inlines an @font-face and preloads only what is needed.
 *
 * Three families:
 *   Sans    -> UI & body (preloaded; present above the fold on every page)
 *   Display -> editorial headlines (swap; keeps initial payload lean)
 *   Text    -> long-form reading / articles (swap; below the fold)
 */

export const thmanyahSans = localFont({
  src: [
    { path: "./thmanyah/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "./thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "./thmanyah/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const thmanyahDisplay = localFont({
  src: [
    { path: "./thmanyah/thmanyahserifdisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "./thmanyah/thmanyahserifdisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "./thmanyah/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "./thmanyah/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "./thmanyah/thmanyahserifdisplay-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-display",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

export const thmanyahText = localFont({
  src: [
    { path: "./thmanyah/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },
    { path: "./thmanyah/thmanyahseriftext-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-thmanyah-text",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

/** Combined CSS-variable classes to apply on <html>. */
export const fontVariables = [
  thmanyahSans.variable,
  thmanyahDisplay.variable,
  thmanyahText.variable,
].join(" ");
