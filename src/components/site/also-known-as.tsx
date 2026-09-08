import type { Locale } from "@/i18n/routing";

/**
 * Compact, contextual "Also known as" note — surfaces the common market names
 * for a concept (e.g. RO / سوفتنر / سنترال فلتر) so search engines and AI answer
 * engines connect the page to how people actually search. Purely additive and
 * subtle; it is not a keyword dictionary. Render it only on the page a concept
 * genuinely belongs to, and pass the alternative names already excluding the
 * page's own H1.
 */
export function AlsoKnownAs({ terms, locale }: { terms: string[]; locale: Locale }) {
  if (terms.length === 0) return null;
  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] text-fg-muted">
      <span className="font-medium text-fg-subtle">
        {locale === "ar" ? "يُعرف أيضاً باسم:" : "Also known as:"}
      </span>
      {terms.map((t) => (
        <span
          key={t}
          className="inline-flex rounded-full border border-border bg-bg-subtle px-3 py-1 text-fg"
        >
          {t}
        </span>
      ))}
    </p>
  );
}
