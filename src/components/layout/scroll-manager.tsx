"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

/**
 * Guarantees every page load, hard refresh, navigation and locale switch starts
 * at the top (Hero), never at a restored scroll position or a stale section.
 *
 * - Disables the browser's automatic scroll restoration (the cause of a refresh
 *   landing mid-page, e.g. on the Products section).
 * - Scrolls to the top on the initial render and on every route/locale change,
 *   while still honoring intentional in-page anchors (e.g. "#top").
 */
export function ScrollManager() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, locale]);

  return null;
}
