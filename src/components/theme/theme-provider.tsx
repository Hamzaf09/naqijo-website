"use client";

import * as React from "react";
import {
  isTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/components/theme/theme-utils";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getCookieTheme(): Theme | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${THEME_STORAGE_KEY}=`));
  const value = match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
  return isTheme(value) ? value : null;
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const cookieTheme = getCookieTheme();
  if (cookieTheme) {
    return cookieTheme;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : "system";
}

function persistTheme(next: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, next);
  document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolve(theme: Theme): ResolvedTheme {
  return theme === "system" ? (prefersDark() ? "dark" : "light") : theme;
}

/**
 * Minimal theme provider (replaces next-themes to avoid its client-rendered
 * script element warning in React 19). First paint is handled by the server
 * layout cookie + CSS media query; this only manages state + class afterwards.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(() =>
    resolve(getStoredTheme()),
  );

  const applyResolvedTheme = React.useCallback((next: ResolvedTheme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
  }, []);

  React.useEffect(() => {
    applyResolvedTheme(resolvedTheme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === "system") {
        const nextResolvedTheme = resolve("system");
        applyResolvedTheme(nextResolvedTheme);
        setResolvedTheme(nextResolvedTheme);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [applyResolvedTheme, resolvedTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      const nextResolvedTheme = resolve(next);
      persistTheme(next);
      setThemeState(next);
      setResolvedTheme(nextResolvedTheme);
      applyResolvedTheme(nextResolvedTheme);
    },
    [applyResolvedTheme],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
