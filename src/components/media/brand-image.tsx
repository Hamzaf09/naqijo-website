import Image from "next/image";
import { approvedImages, type ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface BrandImageProps {
  image: ApprovedImageKey;
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
 * Approved photography, framed to the brand system: rounded corners, cover fit,
 * cloud fallback, optional gold "flow" signature strip. Uses next/image for
 * responsive AVIF/WebP optimization + lazy loading.
 */
export function BrandImage({
  image,
  locale,
  ratio = "16/9",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px",
  priority = false,
  signature = false,
  className,
  imgClassName,
}: BrandImageProps) {
  const img = approvedImages[image];
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-cloud",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={img.src}
        alt={img.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imgClassName)}
      />
      {signature ? (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-gold"
        />
      ) : null}
    </figure>
  );
}
