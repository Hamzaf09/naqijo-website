import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge configured for Tailwind v4.
 *
 * By default tailwind-merge treats a font-size class (`text-lg`, `text-[…]`)
 * as overriding any earlier `leading-*`, because in Tailwind v3 `text-lg`
 * also set a line-height. In Tailwind v4 an explicit `leading-*` always wins
 * over a size's default line-height, so dropping it is wrong — it silently
 * stripped `leading-[…]` from the typography components (English headings
 * fell back to the body's 1.7 line-height).
 */
export const twMerge = extendTailwindMerge({
  override: {
    conflictingClassGroups: {
      "font-size": [],
    },
  },
});
