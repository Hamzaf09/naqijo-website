import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Typography — the brand's primary visual element.
 *   Display / H1 / H2 -> Thmanyah Serif Display, BOLD / BLACK (never thin).
 *   H3               -> Thmanyah Sans, Bold.
 *   Lead / Body      -> Thmanyah Sans, Regular/Medium (never Light).
 *   Prose            -> Thmanyah Serif Text (long-form reading).
 * Weights are deliberately heavy and leading tight so headings read as
 * monumental, architectural, confident — especially in Arabic.
 */

type As<T extends React.ElementType> = { as?: T };
type PolymorphicProps<T extends React.ElementType> = As<T> &
  Omit<React.ComponentPropsWithoutRef<T>, "as">;

export function Display<T extends React.ElementType = "h1">({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? "h1") as React.ElementType;
  return (
    <Tag
      className={cn(
        "font-display font-extrabold tracking-[-0.02em] leading-[0.98]",
        "text-[clamp(3rem,7.2vw,5.75rem)]",
        className,
      )}
      {...props}
    />
  );
}

export function H1<T extends React.ElementType = "h1">({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? "h1") as React.ElementType;
  return (
    <Tag
      className={cn(
        "font-display font-extrabold tracking-[-0.015em] leading-[1.02]",
        "text-[clamp(2.5rem,4.6vw,3.75rem)]",
        className,
      )}
      {...props}
    />
  );
}

export function H2<T extends React.ElementType = "h2">({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? "h2") as React.ElementType;
  return (
    <Tag
      className={cn(
        "font-display font-bold tracking-[-0.015em] leading-[1.04]",
        "text-[clamp(2rem,3.6vw,3rem)]",
        className,
      )}
      {...props}
    />
  );
}

export function H3<T extends React.ElementType = "h3">({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? "h3") as React.ElementType;
  return (
    <Tag
      className={cn(
        "font-sans font-bold leading-[1.2] tracking-[-0.01em]",
        "text-[clamp(1.3rem,1.9vw,1.6rem)]",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-sans font-normal text-fg-muted leading-[1.6]",
        "text-[clamp(1.15rem,1.5vw,1.4rem)]",
        className,
      )}
      {...props}
    />
  );
}

export function Body({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("font-sans text-base text-fg leading-[1.7]", className)}
      {...props}
    />
  );
}

/** Long-form reading paragraph (Thmanyah Serif Text). */
export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-text text-[1.15rem] leading-[1.85] text-fg max-w-[62ch]",
        className,
      )}
      {...props}
    />
  );
}

export function Overline({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "font-sans font-medium text-sm tracking-[0.14em] text-fg-muted",
        "inline-flex items-center gap-3 before:h-px before:w-8 before:bg-border-strong",
        className,
      )}
      {...props}
    />
  );
}
