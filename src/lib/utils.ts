import { clsx, type ClassValue } from "clsx";
import { twMerge } from "@/lib/tw-merge";

/** Merge conditional class names and de-duplicate Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
