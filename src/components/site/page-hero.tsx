import { Container } from "@/ui/container";
import { Display, Lead } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { BrandImage } from "@/components/media/brand-image";
import { Reveal } from "@/components/motion/reveal";
import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: ApprovedImageKey;
  locale: Locale;
}

/** Consistent, calm interior-page hero: eyebrow + large title + optional lead + hero photo. */
export function PageHero({ eyebrow, title, lead, image, locale }: PageHeroProps) {
  return (
    <section className="pt-16 sm:pt-20">
      <Container>
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <Display className="mt-7">{title}</Display>
          </Reveal>
          {lead ? (
            <Reveal delay={0.1}>
              <Lead className="mt-8 max-w-[54ch]">{lead}</Lead>
            </Reveal>
          ) : null}
        </div>
      </Container>
      {image ? (
        <Reveal delay={0.1} className="mt-14">
          <Container>
            <BrandImage
              image={image}
              locale={locale}
              ratio="21/9"
              priority
              signature
              sizes="(max-width: 1320px) 100vw, 1320px"
              className="shadow-[var(--shadow-lg)]"
            />
          </Container>
        </Reveal>
      ) : null}
    </section>
  );
}
