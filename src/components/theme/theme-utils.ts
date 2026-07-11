export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}
