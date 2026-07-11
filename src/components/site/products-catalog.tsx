"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import type { Product, ProductCategory } from "@/data/product-types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const copy = {
  ar: {
    searchPlaceholder: "ابحث عن منتج…",
    all: "الكل",
    clear: "مسح البحث",
    count: (n: number) => `${n} ${n === 1 ? "منتج" : "منتجات"}`,
    emptyTitle: "لا توجد منتجات مطابقة",
    emptyBody: "جرّب كلمة بحث أخرى أو اختر فئة مختلفة.",
  },
  en: {
    searchPlaceholder: "Search products…",
    all: "All",
    clear: "Clear search",
    count: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
    emptyTitle: "No matching products",
    emptyBody: "Try a different search term or category.",
  },
} as const;

/**
 * Client catalog: search + category filters + responsive grid, all driven by
 * the single product source passed in from the server. No e-commerce actions —
 * every card links to the product detail page.
 */
export function ProductsCatalog({
  products,
  categories,
  locale,
}: {
  products: Product[];
  categories: ProductCategory[];
  locale: Locale;
}) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.categoryKey !== category) return false;
      if (!q) return true;
      const haystack = [
        p.name[locale],
        p.shortDescription[locale],
        p.categoryLabel?.[locale] ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, category, query, locale]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div className="relative max-w-xl">
          <Search
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-fg-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-13 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface ps-12 pe-11 text-[1.05rem] text-fg outline-none transition-colors placeholder:text-fg-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t.clear}
              className="absolute inset-y-0 end-3 my-auto inline-flex size-8 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-bg-subtle hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {[{ key: "all", label: { ar: t.all, en: t.all } }, ...categories].map(
            (c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-5 py-2 text-[0.95rem] font-medium transition-colors duration-200",
                    active
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-border-strong text-fg-muted hover:border-primary hover:text-fg",
                  )}
                >
                  {c.label[locale]}
                </button>
              );
            },
          )}
        </div>

        <p className="text-sm text-fg-subtle" aria-live="polite">
          {t.count(filtered.length)}
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              locale={locale}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-[var(--radius-xl)] border border-dashed border-border-strong bg-bg-subtle p-14 text-center">
          <p className="font-display text-xl font-bold text-fg">{t.emptyTitle}</p>
          <p className="mt-3 text-fg-muted">{t.emptyBody}</p>
        </div>
      )}
    </div>
  );
}
