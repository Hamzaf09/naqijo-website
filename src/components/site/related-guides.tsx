import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/site/eyebrow";
import { getAllGuides } from "@/data/guides";
import type { Locale } from "@/i18n/routing";

/**
 * "Related guides" block — links relevant knowledge-base guides from a product,
 * category, or landing page. Purely static (guides come from repo content), so
 * it is safe during a database-less build. Renders nothing when no slug matches.
 */
export async function RelatedGuides({
  slugs,
  locale,
  heading,
}: {
  slugs: string[];
  locale: Locale;
  heading?: string;
}) {
  if (slugs.length === 0) return null;
  const all = await getAllGuides();
  const guides = slugs
    .map((s) => all.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  if (guides.length === 0) return null;

  return (
    <div>
      <Eyebrow>{heading ?? (locale === "ar" ? "أدلة ذات صلة" : "Related guides")}</Eyebrow>
      <ul className="mt-5 space-y-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="group inline-flex items-baseline gap-2 font-medium text-primary hover:text-[var(--primary-hover)]"
            >
              <span>{g.title[locale]}</span>
              <span aria-hidden className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                {locale === "ar" ? "←" : "→"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Product category → relevant guide slugs (shared by product & category pages). */
export const guidesForCategory: Record<string, string[]> = {
  "drinking-water": [
    "choosing-a-water-filter",
    "reverse-osmosis-vs-filtration",
    "seven-stage-water-filters",
  ],
  "water-softening": ["hard-water-and-water-softeners"],
  "central-filtration": ["central-vs-drinking-water-filter", "choosing-a-water-filter"],
  "filter-cartridges": ["water-filter-maintenance-signs"],
};
