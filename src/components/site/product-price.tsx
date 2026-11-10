import type { ProductPrice as ProductPriceData } from "@/data/product-types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const unitLabel: Record<ProductPriceData["currency"], Record<Locale, string>> = {
  JOD: { ar: "د.أ", en: "JOD" },
  USD: { ar: "دولار", en: "USD" },
};

/**
 * Public product price. Renders nothing when no price is published, so every
 * surface (cards, featured, detail) can drop it in without extra checks.
 */
export function ProductPrice({
  price,
  locale,
  className,
  amountClassName,
}: {
  price: ProductPriceData | null;
  locale: Locale;
  className?: string;
  amountClassName?: string;
}) {
  if (!price) return null;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5", className)}>
      {price.startingFrom ? (
        <span className="text-sm text-fg-muted">
          {locale === "ar" ? "ابتداءً من" : "Starting from"}
        </span>
      ) : null}
      <span className={cn("text-xl font-bold leading-none text-fg", amountClassName)}>
        {price.amount.toLocaleString("en-US")}
      </span>
      <span className="text-sm font-medium text-fg-muted">
        {unitLabel[price.currency][locale]}
      </span>
    </p>
  );
}
