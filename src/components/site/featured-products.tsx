"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H2 } from "@/ui/typography";
import { buttonVariants } from "@/ui/button";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, RevealImage } from "@/components/motion/reveal";
import { shuffle } from "@/lib/shuffle";
import type { Product } from "@/data/product-types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Section chrome copy — resolved for the active locale by the server page. */
export interface FeaturedProductsCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  viewAll: string;
}

/** How many products the home showcase features at most (spec: 4–6). */
const FEATURED_COUNT = 4;

/**
 * Featured Products — Apple-style showcase, NOT an e-commerce grid.
 * Shows a RANDOM selection from the single product source on every load, one
 * product per full editorial row, plus a "View all products" link to /products.
 * All product data comes from `@/data/products` (no duplication).
 */
export function FeaturedProducts({
  products,
  copy,
  locale,
}: {
  products: Product[];
  copy: FeaturedProductsCopy;
  locale: Locale;
}) {
  const s = copy;

  // Client-mounted flag (false on server / first hydration render) so the
  // server output is deterministic and matches, then the selection re-shuffles
  // client-side — a fresh random set on every page load, no hydration mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const items = useMemo(
    () => (mounted ? shuffle(products) : products).slice(0, FEATURED_COUNT),
    [mounted, products],
  );

  return (
    <Section className="bg-bg-subtle">
      <Container>
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{s.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <H2 className="mt-6">{s.title}</H2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-[56ch] text-[clamp(1.25rem,1.9vw,1.6rem)] font-normal leading-[1.6] text-fg-muted">
              {s.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Products */}
        <div className="mt-24 space-y-28 lg:mt-32 lg:space-y-40">
          {items.map((p, i) => {
            const flip = i % 2 === 1;
            const category = p.categoryLabel;
            return (
              <div
                key={p.slug}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24"
              >
                {/* Product photograph on a quiet floating stage */}
                <RevealImage className={cn(flip && "lg:order-2")}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group block"
                    aria-label={p.name[locale]}
                  >
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-2xl)] bg-surface shadow-[var(--shadow-md)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lg)]">
                      <Image
                        src={p.image.src}
                        alt={p.image.alt[locale]}
                        fill
                        sizes="(max-width: 1024px) 100vw, 620px"
                        className="object-contain p-10 transition-transform duration-500 group-hover:scale-[1.03] lg:p-16"
                      />
                    </div>
                  </Link>
                </RevealImage>

                {/* Editorial copy */}
                <Reveal delay={0.05} className={cn(flip && "lg:order-1")}>
                  {category ? (
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                      {category[locale]}
                    </span>
                  ) : null}
                  <h3 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.01em] text-fg">
                    {p.name[locale]}
                  </h3>
                  <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-fg-muted">
                    {p.shortDescription[locale]}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {p.features.map((b) => (
                      <li key={b[locale]} className="flex items-start gap-3 text-fg">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                        />
                        <span className="text-[1.1rem] leading-relaxed">{b[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group mt-9 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-[var(--primary-hover)]"
                  >
                    {s.cta}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
                    >
                      ←
                    </span>
                  </Link>
                </Reveal>
              </div>
            );
          })}
        </div>

        {/* View all products */}
        <div className="mt-24 flex justify-center lg:mt-32">
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {s.viewAll}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
