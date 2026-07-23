import { getLocale, getTranslations } from "next-intl/server";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { footerNav } from "@/config/navigation";
import { getSettings } from "@/data/settings";
import { Logo } from "@/components/brand/logo";
import type { Locale } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const settings = await getSettings();

  const columns = [
    { title: t("footer.solutions"), items: footerNav.solutions },
    { title: t("footer.company"), items: footerNav.company },
    { title: t("footer.support"), items: footerNav.support },
    { title: t("footer.legal"), items: footerNav.legal },
  ];

  // Social links from the CMS — rendered only when an admin has set them.
  const socials = [
    { key: "facebook", href: settings.social.facebook, Icon: Facebook },
    { key: "instagram", href: settings.social.instagram, Icon: Instagram },
    { key: "youtube", href: settings.social.youtube, Icon: Youtube },
    { key: "linkedin", href: settings.social.linkedin, Icon: Linkedin },
    { key: "twitter", href: settings.social.twitter, Icon: Twitter },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy text-white">
      {/* Gold flow hairline */}
      <div className="h-px w-full bg-gold/60" />
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="white" className="h-10 w-auto" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-white/65">
              {settings.footerTagline[locale] || t("footer.tagline")}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-[0.95rem] text-white/70 transition-colors hover:text-white"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              {t("footer.address")}
            </h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/70">
              {settings.address[locale]}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              {t("cta.callUs")}
            </h3>
            <ul className="mt-4 space-y-2 text-[0.95rem] text-white/70" dir="ltr">
              {settings.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p}`} className="hover:text-white">
                    {p.replace("+962", "+962 ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              {t("footer.email")}
            </h3>
            <p className="mt-4 text-[0.95rem] text-white/70" dir="ltr">
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              {t("footer.workingHours")}
            </h3>
            <p className="mt-4 text-[0.95rem] text-white/70">{settings.workingHours[locale]}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/55">{settings.copyright[locale] || t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            {socials.length > 0 ? (
              <div className="flex items-center gap-4">
                {socials.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="text-white/55 transition-colors hover:text-gold"
                  >
                    <Icon className="size-[1.05rem]" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
            <a href="#top" className="text-sm text-white/55 transition-colors hover:text-gold">
              {t("footer.backToTop")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
