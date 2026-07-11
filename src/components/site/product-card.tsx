import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/product-types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Compact, premium product card — image on a quiet stage, category, name, short
 * description and a "View details" affordance. The whole card links to the
 * product detail page. Used by the catalog grid, related products and search.
 */
export function ProductCard({
  product,
  locale,
  className,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  className?: string;
  priority?: boolean;
}) {
  const category = product.categoryLabel;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-subtle">
        <Image
          src={product.image.src}
          alt={product.image.alt[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          priority={priority}
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03] lg:p-8"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        {category ? (
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
            {category[locale]}
          </span>
        ) : null}
        <h3 className="mt-3 font-display text-xl font-bold leading-snug text-fg transition-colors group-hover:text-primary">
          {product.name[locale]}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-[1.02rem] leading-relaxed text-fg-muted">
          {product.shortDescription[locale]}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
          {locale === "ar" ? "عرض التفاصيل" : "View details"}
          <span aria-hidden className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
            ←
          </span>
        </span>
      </div>
    </Link>
  );
}
