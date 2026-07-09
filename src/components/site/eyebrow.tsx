import { cn } from "@/lib/utils";

/** Small brand eyebrow: a gold tick + tracked label (blue on light, gold on dark bands). */
export function Eyebrow({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "onDark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.2em]",
        tone === "onDark" ? "text-gold" : "text-primary",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-gold" />
      {children}
    </span>
  );
}
