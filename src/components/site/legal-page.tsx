import { Container, Section } from "@/ui/container";
import { Display } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";

/** Calm editorial layout for legal/long-form pages. */
export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <Section className="pt-16 sm:pt-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Display className="mt-7 text-[clamp(2rem,4vw,3.25rem)]">{title}</Display>
          <p className="mt-6 text-sm text-fg-subtle">{updated}</p>
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <section key={s.h}>
                <h2 className="font-display text-xl font-bold text-fg">{s.h}</h2>
                <p className="mt-3 font-text text-[1.1rem] leading-[1.85] text-fg-muted">{s.p}</p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
