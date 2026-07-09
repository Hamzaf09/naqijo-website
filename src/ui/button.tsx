import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — token-driven, RTL-safe, accessible.
 * Variants and sizes only; colors resolve from design tokens, so the button
 * re-skins automatically when the brand palette lands.
 */
const buttonVariants = cva(
  [
    "group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap",
    "font-sans font-semibold tracking-[0.01em] select-none [&_svg]:size-[1.15em] [&_svg]:shrink-0",
    "rounded-[var(--radius-md)] will-change-transform",
    "transition-[transform,background-color,box-shadow,border-color] duration-300 ease-[var(--ease-out)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:-translate-y-0.5 active:translate-y-0 active:duration-100",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        gold:
          "bg-accent text-[var(--accent-fg)] hover:bg-[var(--accent-strong)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        outline:
          "border border-border-strong text-fg bg-transparent hover:border-primary hover:bg-bg-subtle",
        ghost: "text-fg bg-transparent hover:bg-bg-subtle hover:-translate-y-0",
        link: "text-fg underline-offset-4 hover:underline p-0 h-auto hover:-translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-13 px-8 text-[1.02rem]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
