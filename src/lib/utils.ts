import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and de-duplicate Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Display grouping for a stored E.164 number, per docs/local-nap-standard.md:
 * Jordanian mobiles `+9627XXXXXXXX` render as `+962 7X XXX XXXX`. Anything
 * else falls back to a space after the country code. `tel:` links keep the
 * raw stored value.
 */
export function formatPhone(phone: string): string {
  const jo = phone.match(/^\+962(7\d)(\d{3})(\d{4})$/);
  return jo ? `+962 ${jo[1]} ${jo[2]} ${jo[3]}` : phone.replace(/^\+962/, "+962 ");
}
