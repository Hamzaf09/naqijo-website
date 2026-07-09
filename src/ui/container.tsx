import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered content container with responsive inline padding. */
export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12",
        className,
      )}
      {...props}
    />
  );
}

/** Vertical section rhythm wrapper with generous, premium spacing. */
export function Section({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn("py-16 sm:py-20 lg:py-24", className)}
      {...props}
    />
  );
}
