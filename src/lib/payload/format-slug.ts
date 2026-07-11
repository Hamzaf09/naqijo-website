import type { FieldHook } from "payload";

/** Normalize any string into a URL-safe slug (lowercase, hyphenated, ASCII). */
export const slugify = (val: string): string =>
  val
    .toString()
    .replace(/&/g, "-and-")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

/**
 * Field hook that auto-fills a slug from a fallback field (e.g. the English
 * name) when the admin leaves it blank, and normalizes whatever is typed.
 */
export const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === "string" && value.length > 0) return slugify(value);

    const fallback = data?.[fallbackField];
    if (
      (operation === "create" || !value) &&
      typeof fallback === "string" &&
      fallback.length > 0
    ) {
      return slugify(fallback);
    }
    return value;
  };
