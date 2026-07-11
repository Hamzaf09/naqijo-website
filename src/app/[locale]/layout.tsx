import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, requireLocale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollManager } from "@/components/layout/scroll-manager";
import { alexandria } from "@/fonts/alexandria";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/data/settings";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "brand" }),
    getSettings(),
  ]);

  // CMS-first metadata: Settings global → translation fallbacks.
  const name = settings.siteName[locale] || t("name");
  const defaultTitle = settings.defaultSeo.metaTitle[locale] || `${name} — ${t("tagline")}`;
  const description = settings.defaultSeo.metaDescription[locale] || t("tagline");
  const ogImage = settings.defaultSeo.ogImage?.src;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: defaultTitle, template: `%s — ${name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    ...(settings.favicon?.src ? { icons: { icon: settings.favicon.src } } : {}),
    openGraph: {
      siteName: name,
      title: defaultTitle,
      description,
      locale,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const dir = localeDirection[locale];
  const [messages, settings] = await Promise.all([getMessages(), getSettings()]);
  const gaId = settings.googleAnalyticsId;
  const gtmId = settings.gtmId;

  return (
    <html
      lang={locale}
      dir={dir}
      className={alexandria.variable}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme init. `async` keeps React 19 happy (hoistable script
            resource — no dev warning); `blocking="render"` makes supporting
            browsers hold first paint until it runs, so no theme flash. */}
        <script src="/theme-init.js" async blocking="render" />
      </head>
      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ScrollManager />
            <span id="top" className="sr-only" />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        {gtmId ? (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
