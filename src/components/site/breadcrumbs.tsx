import { Link } from "@/i18n/navigation";

export interface Crumb {
  label: string;
  /** Locale-relative path (e.g. "/products"). Omit on the current (last) item. */
  href?: string;
}

/**
 * Visible breadcrumb trail, matching the product-detail markup. Pair it with
 * `breadcrumbSchema()` from `@/lib/schema` so the visible trail and the
 * BreadcrumbList JSON-LD stay in sync. The last item renders as plain text.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-fg-subtle">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href} className="transition-colors hover:text-fg">
                  {c.label}
                </Link>
              ) : (
                <span className="text-fg-muted">{c.label}</span>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
