import { defineRouting } from "next-intl/routing";

/**
 * Locale routing for NaqiJo.
 * - Arabic (`ar`) is the DEFAULT locale and is RTL.
 * - `localePrefix: "always"` means `/` resolves to the default locale (`/ar`),
 *   guaranteeing the first visit opens Arabic.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};
