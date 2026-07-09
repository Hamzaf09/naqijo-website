import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H2 } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, RevealImage } from "@/components/motion/reveal";
import { products, productsSection } from "@/content/products";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Featured Products — Apple-style showcase, NOT an e-commerce grid.
 * Huge product photography on quiet white stages, alternating sides, large type,
 * generous breathing room. One product per full editorial row.
 */
export function FeaturedProducts({ locale }: { locale: Locale }) {
  const s = productsSection[locale];

  return (
    <Section id="products" className="bg-bg-subtle">
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
          {products.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={p.slug}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24"
              >
                {/* Product photograph on a quiet floating stage */}
                <RevealImage className={cn(flip && "lg:order-2")}>
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-2xl)] bg-surface shadow-[var(--shadow-md)]">
                    <Image
                      src={p.image}
                      alt={p.alt[locale]}
                      fill
                      sizes="(max-width: 1024px) 100vw, 620px"
                      className="object-contain p-10 lg:p-16"
                    />
                  </div>
                </RevealImage>

                {/* Editorial copy */}
                <Reveal delay={0.05} className={cn(flip && "lg:order-1")}>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {p.category[locale]}
                  </span>
                  <h3 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.01em] text-fg">
                    {p.title[locale]}
                  </h3>
                  <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-fg-muted">
                    {p.description[locale]}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {p.bullets[locale].map((b) => (
                      <li key={b} className="flex items-start gap-3 text-fg">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                        />
                        <span className="text-[1.1rem] leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
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
      </Container>
    </Section>
  );
}
