"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "@/config/navigation";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Client-mounted flag (false on server) so the portal only renders client-side.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent bg-bg/40 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label={t("brand.name")} className="flex shrink-0 items-center">
          <Logo priority className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-7 lg:flex" aria-label={t("nav.home")}>
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap py-1 text-[0.95rem] font-medium text-fg-muted transition-colors duration-200 hover:text-fg",
                isActive(item.href) && "text-fg",
              )}
            >
              {t(`nav.${item.key}`)}
              {isActive(item.href) ? (
                <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-5 rounded-full bg-gold" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-0.5 sm:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            {t("header.bookConsultation")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("header.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-site-menu"
            className="-me-2 inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-fg lg:hidden"
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="mobile-menu"
                  id="mobile-site-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("header.openMenu")}
                  className="fixed inset-0 z-[100] flex flex-col bg-navy/95 text-white backdrop-blur-xl lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                <div className="flex h-20 shrink-0 items-center justify-between px-5 sm:px-8">
                  <Logo tone="white" className="h-11 w-auto" />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("header.closeMenu")}
                    className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-white transition-colors hover:bg-white/10"
                  >
                    <X className="size-6" aria-hidden />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4 sm:px-8">
                  {mainNav.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block border-b border-white/10 py-4 font-display text-2xl font-bold text-white"
                      >
                        {t(`nav.${item.key}`)}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <div className="flex shrink-0 items-center justify-between gap-4 px-5 pb-8 pt-6 sm:px-8">
                  <div className="flex items-center gap-2 [&_button]:text-white [&_svg]:text-white">
                    <LocaleSwitcher />
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "gold", size: "md" }))}
                  >
                    {t("header.bookConsultation")}
                  </Link>
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </header>
  );
}
