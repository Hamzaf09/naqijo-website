"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/ui/button";

/**
 * Light/dark toggle backed by the local theme provider.
 *
 * Both icons are always rendered; which one is visible is decided purely by
 * the `.dark` class on <html> (via Tailwind's `dark:` variant). That class is
 * set before first paint by /theme-init.js, so the server and client emit
 * byte-identical markup — no hydration mismatch, no flash, and no need to
 * suppress the warning or gate on a `mounted` flag.
 */
export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </Button>
  );
}
