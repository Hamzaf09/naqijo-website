import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Slot label, e.g. "Team Image" / "صورة فريق العمل". */
  label: string;
  /** CSS aspect-ratio, e.g. "16/9", "4/3", "3/2", "1/1". */
  ratio?: string;
  className?: string;
}

/**
 * On-brand placeholder for image slots without an approved photo.
 * Honest and quiet: a "blueprint" dot-grid on a dew-blue field, a single gold
 * hairline signature, and the slot label. No stock imagery, no icons, no fake
 * photography — swapped for real approved photos later.
 */
export function ImagePlaceholder({
  label,
  ratio = "16/9",
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-blue",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {/* Engineering blueprint dot-grid */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(var(--border-strong) 1.1px, transparent 1.1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Label */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-fg-subtle">
          {label}
        </span>
      </span>
      {/* Gold "flow" signature */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] bg-gold/80"
      />
    </div>
  );
}
