"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/ui/button";

/** Switches locale while preserving the current route. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const next = locale === "ar" ? "en" : "ar";
  const label = next === "en" ? "English" : "العربية";

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
        })
      }
    >
      {label}
    </Button>
  );
}
