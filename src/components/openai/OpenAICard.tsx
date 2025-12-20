/**
 * OpenAICard - Smooth, polished card with hover effects
 * Features: Magnetic hover, blur backdrop, smooth transitions
 */

"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type React from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface OpenAICardProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?: "default" | "elevated" | "interactive";
  animated?: boolean;
}

const VARIANT_STYLES = {
  default: `
    bg-black/40
    border border-white/10
    backdrop-blur-md
  `,
  elevated: `
    bg-black/60
    border border-white/15
    backdrop-blur-lg
    shadow-[0_8px_24px_rgba(0,0,0,0.5)]
  `,
  interactive: `
    bg-black/40
    border border-white/10
    backdrop-blur-md
    cursor-pointer
    hover:bg-black/60
    hover:border-white/20
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
  `,
} as const;

export function OpenAICard({
  variant = "default",
  animated = true,
  className,
  children,
  ...props
}: OpenAICardProps) {
  const Component = animated ? m.div : "div";

  const animationProps = animated
    ? {
        ...ANIMATIONS.presets.card,
        whileHover:
          variant === "interactive" ? { y: -4, scale: 1.01 } : undefined,
        transition: ANIMATIONS.transition.butter,
      }
    : {};

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes for drag events
    <Component
      className={cn(
        "group relative rounded-xl p-6",
        "transition-all duration-300",
        VARIANT_STYLES[variant],
        className,
      )}
      {...animationProps}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Animated border glow on hover */}
      {variant === "interactive" && (
        <m.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={ANIMATIONS.transition.smooth}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
        </m.div>
      )}
    </Component>
  );
}

// Sub-components with animations
export function OpenAICardHeader({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    // @ts-expect-error - Framer Motion type conflict
    <m.div
      className={cn("mb-4", className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.1 }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function OpenAICardTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-white",
        "tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function OpenAICardDescription({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "text-[0.875rem] text-white/60",
        "leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function OpenAICardContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    // @ts-expect-error - Framer Motion type conflict
    <m.div
      className={cn("space-y-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.2 }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function OpenAICardFooter({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    // @ts-expect-error - Framer Motion type conflict
    <m.div
      className={cn("mt-6 flex items-center gap-2", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.3 }}
      {...props}
    >
      {children}
    </m.div>
  );
}
