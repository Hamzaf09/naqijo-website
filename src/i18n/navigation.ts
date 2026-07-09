import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. Always import `Link`, `useRouter`,
 * `usePathname`, and `redirect` from here (never from `next/*`) so that
 * locale prefixes and localized pathnames are handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
