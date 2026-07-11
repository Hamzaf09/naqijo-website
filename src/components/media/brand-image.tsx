import Image from "next/image";
import { approvedImages, type ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** A resolved image source (e.g. from the CMS media library). */
export interface BrandMedia {
  src: string;
  alt: string;
}

interface BrandImageProps {
  /** Approved brand-photography key (static). */
  image?: ApprovedImageKey;
  /** CMS-sourced image; takes precedence over `image` when provided. */
  media?: BrandMedia | null;
  locale: Locale;
  /** CSS aspect-ratio, e.g. "16/9", "4/3", "3/2", "1/1", "4/5". */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  /** Adds the brand gold "flow" strip beneath the image. */
  signature?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Approved photography — or any CMS media — framed to the brand system: rounded
 * corners, cover fit, cloud fallback, optional gold "flow" signature strip.
 * Pass `media` for CMS-sourced images; otherwise `image` uses the static set.
 */
export function BrandImage({
  image,
  media,
  locale,
  ratio = "16/9",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px",
  priority = false,
  signature = false,
  className,
  imgClassName,
}: BrandImageProps) {
  const resolved: BrandMedia | null =
    media ??
    (image
      ? { src: approvedImages[image].src, alt: approvedImages[image].alt[locale] }
      : null);

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-cloud",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {resolved?.src ? (
        <Image
          src={resolved.src}
          alt={resolved.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : null}
      {signature ? (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-gold"
        />
      ) : null}
    </figure>
  );
}
