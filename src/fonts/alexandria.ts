import localFont from "next/font/local";

/**
 * Alexandria — global font for the whole site (Arabic + Latin), self-hosted
 * locally so production builds don't depend on network access. Hierarchy:
 *   Display titles  -> 800 (extrabold)
 *   Section titles  -> 700 (bold)
 *   Buttons         -> 600 (semibold)
 *   Body            -> 400 / 500
 * Exposed as `--font-alexandria` and mapped to --font-{sans,display,text} in
 * globals.css so every existing component picks it up with no edits.
 */
export const alexandria = localFont({
  src: "./alexandria/Alexandria[wght].ttf",
  weight: "400 900",
  variable: "--font-alexandria",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
