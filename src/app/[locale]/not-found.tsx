import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { Display, Lead } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const locale = await getLocale();
  const ar = locale === "ar";
  return (
    <Section className="pt-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">404</Eyebrow>
          <Display className="mt-6">{ar ? "الصفحة غير موجودة" : "Page not found"}</Display>
          <Lead className="mx-auto mt-6 max-w-[42ch]">
            {ar
              ? "يبدو أن الصفحة التي تبحث عنها انتقلت أو لم تعد موجودة."
              : "The page you're looking for has moved or no longer exists."}
          </Lead>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              {ar ? "العودة إلى الرئيسية" : "Back to home"}
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              {ar ? "تواصل معنا" : "Contact us"}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
