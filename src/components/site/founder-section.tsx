import { Container, Section } from "@/ui/container";
import { H3 } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { BrandImage } from "@/components/media/brand-image";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

const dict = {
  ar: { eyebrow: "القيادة" },
  en: { eyebrow: "Leadership" },
} as const;

/**
 * Founder highlight — the last section before the footer. Horizontal on
 * desktop, stacked on mobile; the grid follows the document direction, so it
 * flips correctly for RTL/LTR. Name, title and photo come from siteConfig.
 */
export function FounderSection({ locale }: { locale: Locale }) {
  const f = siteConfig.founder;
  const d = dict[locale as keyof typeof dict] ?? dict.en;
  const name = f.name[locale as keyof typeof f.name];
  const title = f.title[locale as keyof typeof f.title];

  return (
    <Section className="border-t border-border bg-bg-subtle">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
          <Reveal>
            <BrandImage
              media={{ src: f.photo, alt: `${name} — ${title}` }}
              locale={locale}
              ratio="16/10"
              sizes="(max-width: 768px) 100vw, 46vw"
              className="shadow-[var(--shadow-md)]"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <Eyebrow>{d.eyebrow}</Eyebrow>
              <H3 className="mt-6">{name}</H3>
              <p className="mt-3 text-lg text-fg-muted">{title}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
