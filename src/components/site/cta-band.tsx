import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandImage } from "@/components/media/brand-image";
import { Eyebrow } from "@/components/site/eyebrow";
import { buttonVariants } from "@/ui/button";
import { siteConfig } from "@/config/site";
import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  locale: Locale;
  image?: ApprovedImageKey;
  whatsappText?: string;
}

/** Full-bleed navy consultation CTA. The single gold action lives here. */
export async function CtaBand({
  eyebrow,
  title,
  subtitle,
  locale,
  image = "brandClosing",
  whatsappText,
}: CtaBandProps) {
  const t = await getTranslations("cta");
  const wa = `https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, "")}${
    whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""
  }`;

  return (
    <section className="bg-navy text-white">
      <div className="mx-auto grid max-w-[1320px] items-stretch gap-0 px-0 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-16 lg:py-28">
          <Eyebrow tone="onDark">{eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.1rem,3.6vw,3.1rem)] font-extrabold leading-[1.08]">
            {title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-white/70">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
            >
              {t("bookConsultation")}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 text-white hover:bg-white/10",
              )}
            >
              {t("continueWhatsapp")}
            </a>
          </div>
        </div>
        <div className="relative min-h-[440px] lg:min-h-[580px]">
          <BrandImage
            image={image}
            locale={locale}
            ratio="auto"
            className="absolute inset-0 h-full w-full rounded-none bg-navy"
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </div>
      </div>
    </section>
  );
}
