import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

/**
 * Trailing arrow for "view details / read more" links. Points in the reading
 * direction (← in Arabic, → in English) and nudges that way when the parent
 * `.group` is hovered. Decorative only.
 */
export function LinkArrow({ locale, className }: { locale: Locale; className?: string }) {
  const rtl = locale === "ar";
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block transition-transform",
        rtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1",
        className,
      )}
    >
      {rtl ? "←" : "→"}
    </span>
  );
}
