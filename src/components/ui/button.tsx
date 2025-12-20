import { Slot } from "@radix-ui/react-slot";
import { m } from "framer-motion";
import * as React from "react";

import { Loader2 } from "@/icons";
import { cn } from "@/lib/utils";
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@/styles/button-variants";

type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariantProps & {
    asChild?: boolean;
    /**
     * Enable micro-interactions (scale on hover/tap)
     * @default true
     */
    animated?: boolean;
    /**
     * Show loading spinner and disable button
     */
    loading?: boolean;
    /**
     * Icon to display before button text
     */
    leftIcon?: React.ReactNode;
    /**
     * Icon to display after button text
     */
    rightIcon?: React.ReactNode;
  };

function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  animated = true,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // Enhanced micro-interactions using Framer Motion
  // Different animations based on variant for premium feel
  const isPrimary = variant === "primary" || variant === "default";
  const isSecondary = variant === "secondary" || variant === "outline";

  const motionProps = animated
    ? {
        whileHover: isPrimary
          ? { scale: 1.02, y: -2 } // Lift effect for primary
          : isSecondary
            ? { scale: 1.01, y: -1 } // Subtle lift for secondary
            : { scale: 1.03 }, // Default for others
        whileTap: { scale: 0.98, y: 0 },
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }
    : {};

  const content = (
    <>
      {loading && <Loader2 className="shrink-0" />}
      {!loading && leftIcon && (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children && <span className="inline-flex">{children}</span>}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </>
  );

  if (asChild) {
    // Can't wrap Slot with motion, so just use regular button
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, block, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes for drag events
    <m.button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, block, className }))}
      style={{ willChange: "transform, opacity" }}
      disabled={disabled || loading}
      {...motionProps}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </m.button>
  );
}

export { Button, buttonVariants };
