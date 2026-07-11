import { Link } from "@/i18n/navigation";
import { BrandImage, type BrandMedia } from "@/components/media/brand-image";
import { Eyebrow } from "@/components/site/eyebrow";
import { H2, Lead } from "@/ui/typography";
import { Reveal, RevealImage } from "@/components/motion/reveal";
import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface SolutionRowProps {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  image?: ApprovedImageKey;
  media?: BrandMedia | null;
  href: string;
  ctaLabel: string;
  locale: Locale;
  /** Flip image to the opposite side for editorial alternating rhythm. */
  flip?: boolean;
}

/**
 * Editorial split section: large photography one side, engineering story the
 * other. Alternate `flip` down the page for a flowing, non-repetitive rhythm.
 */
export function SolutionRow({
  index,
  eyebrow,
  title,
  description,
  bullets,
  image,
  media,
  href,
  ctaLabel,
  locale,
  flip = false,
}: SolutionRowProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <RevealImage className={cn(flip && "lg:order-2")}>
        <BrandImage
          image={image}
          media={media}
          locale={locale}
          ratio="4/3"
          signature
          sizes="(max-width: 1024px) 100vw, 600px"
        />
      </RevealImage>

      <Reveal delay={0.05} className={cn(flip && "lg:order-1")}>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-2xl font-bold text-gold">{index}</span>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <H2 className="mt-5 max-w-[16ch]">{title}</H2>
        <Lead className="mt-5 max-w-[46ch]">{description}</Lead>
        {bullets?.length ? (
          <ul className="mt-7 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-fg">
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                />
                <span className="text-[1.075rem] leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={href}
          className="group mt-8 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-[var(--primary-hover)]"
        >
          {ctaLabel}
          <span aria-hidden className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
            ←
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
