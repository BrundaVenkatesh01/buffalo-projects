/**
 * Card - Unified Design System
 * YC/SF minimalism + OpenAI smooth animations
 * Clean borders, glass effects, buttery interactions
 */

"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface CardProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?:
    | "default"
    | "elevated"
    | "interactive"
    | "minimal"
    | "ghost"
    | "outline"
    | "feature"
    | "light";
  animated?: boolean;
  padding?: "none" | "xs" | "sm" | "md" | "lg";
}

const VARIANT_STYLES = {
  default: `
    bg-black
    border border-white/10
  `,
  elevated: `
    bg-[#0A0A0A]
    border border-white/10
    shadow-lg
  `,
  interactive: `
    bg-black
    border border-white/10
    cursor-pointer
    hover:bg-[#0A0A0A]
    hover:border-white/20
    hover:shadow-lg
  `,
  minimal: `
    bg-transparent
    border border-white/5
    hover:border-white/10
  `,
  ghost: `
    bg-transparent
    border border-transparent
    hover:border-white/10
  `,
  outline: `
    bg-transparent
    border border-white/15
  `,
  feature: `
    border border-purple-500/30
    bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent
    hover:border-purple-500/50
  `,
  light: `
    border border-white/10
    bg-white/5
    text-white
  `,
} as const;

const PADDING_STYLES = {
  none: "p-0",
  xs: "p-3",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({
  variant = "default",
  animated = true,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const Component = animated ? m.div : "div";

  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: ANIMATIONS.transition.butter,
        ...(variant === "interactive" && {
          whileHover: { y: -2, scale: 1.005 },
        }),
      }
    : {};

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes for drag events
    <Component
      className={cn(
        "group relative rounded-lg",
        "transition-all duration-200",
        VARIANT_STYLES[variant],
        PADDING_STYLES[padding],
        className,
      )}
      {...animationProps}
      {...props}
    >
      {/* Glass overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}

// Sub-components with staggered animations
export function CardHeader({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    // @ts-expect-error - Framer Motion type conflict
    <m.div
      className={cn("mb-4", className)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.05 }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-white",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("text-sm text-white/60 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
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
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.1 }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    // @ts-expect-error - Framer Motion type conflict
    <m.div
      className={cn("mt-6 flex items-center gap-2", className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ANIMATIONS.transition.butter, delay: 0.15 }}
      {...props}
    >
      {children}
    </m.div>
  );
}
