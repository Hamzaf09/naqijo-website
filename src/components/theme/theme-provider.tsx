"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return isTheme(stored) ? stored : "system";
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolve(theme: Theme): Resolved {
  return theme === "system" ? (prefersDark() ? "dark" : "light") : theme;
}

/**
 * Minimal theme provider (replaces next-themes to avoid its client-rendered
 * <script>, which triggers a React 19 dev warning). The no-flash init runs from
 * `themeInitScript` in the server layout; this only manages state + the class.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<Resolved>(() =>
    resolve(getStoredTheme()),
  );

  const applyResolvedTheme = React.useCallback((next: Resolved) => {
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
      localStorage.setItem(STORAGE_KEY, next);
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

/**
 * Runs before paint from the server layout to keep the initial HTML and
 * hydration state aligned without a flash.
 */
export const themeInitScript = `(function(){try{var e=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=e==='dark'||((!e||e==='system')&&m);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
