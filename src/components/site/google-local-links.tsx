import { buttonVariants } from "@/ui/button";
import { googleConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Renders Google Maps / Directions / Review actions — but ONLY for the values
 * that are actually configured (via the NEXT_PUBLIC_GOOGLE_* env vars). If none
 * are set, it renders nothing, so the site never shows a placeholder or fake
 * Google link. Reuses the existing button styles; no new design language.
 */
export function GoogleLocalLinks({
  locale,
  variant = "outline",
  className,
}: {
  locale: Locale;
  variant?: "gold" | "outline" | "primary";
  className?: string;
}) {
  const { mapsUrl, reviewUrl } = googleConfig;
  if (!mapsUrl && !reviewUrl) return null;

  const t =
    locale === "ar"
      ? { maps: "عرض على خرائط Google", directions: "الاتجاهات", review: "أضف تقييمك على Google" }
      : { maps: "View on Google Maps", directions: "Get directions", review: "Review us on Google" };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant, size: "md" }))}
        >
          {t.maps}
        </a>
      ) : null}
      {reviewUrl ? (
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "md" }))}
        >
          {t.review}
        </a>
      ) : null}
    </div>
  );
}
