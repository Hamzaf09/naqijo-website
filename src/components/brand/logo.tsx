import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoTone = "auto" | "color" | "white";

interface LogoProps {
  /** auto = color on light, white on dark; white = force white (navy/photo bgs). */
  tone?: LogoTone;
  className?: string;
  priority?: boolean;
}

/**
 * NaqiJo logo (official SVG). The color mark carries Naqi Blue + Laurel Gold;
 * the white treatment (guideline: white logo on navy/photography) is produced
 * from the same file via a filter, so there is one source of truth.
 * Respect clear space — do not crowd; do not recolor beyond these tones.
 */
export function Logo({ tone = "auto", className, priority }: LogoProps) {
  const toneClass =
    tone === "white"
      ? "[filter:brightness(0)_invert(1)]"
      : tone === "auto"
        ? "dark:[filter:brightness(0)_invert(1)]"
        : "";

  return (
    <Image
      src="/brand/logo-color.svg"
      alt="NaqiJo — نقي الرابية"
      width={100}
      height={50}
      priority={priority}
      unoptimized
      className={cn("block h-9 w-auto select-none", toneClass, className)}
    />
  );
}
