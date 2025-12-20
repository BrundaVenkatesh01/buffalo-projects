/**
 * Badge - Unified Design System
 * YC/SF minimal + OpenAI smooth entrance
 */

"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

type CoreBadgeVariant =
  | "default"
  | "secondary"
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "purple"
  | "pink";
type BadgeVariant = CoreBadgeVariant | "destructive" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps
  extends Omit<
    ComponentPropsWithoutRef<"span">,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  variant?: BadgeVariant;
  size?: BadgeSize;
  animated?: boolean;
}

const VARIANT_STYLES: Record<CoreBadgeVariant, string> = {
  default: "bg-white/10 text-white/80 border-white/10",
  secondary: "bg-white/5 text-white/60 border-white/5",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const resolveVariant = (variant: BadgeVariant): CoreBadgeVariant => {
  if (variant === "destructive") {
    return "red";
  }
  if (variant === "outline") {
    return "secondary";
  }
  return variant;
};

const SIZE_STYLES = {
  sm: "px-1.5 py-0.5 text-[0.6875rem]", // 11px
  md: "px-2 py-0.5 text-xs", // 12px
} as const;

export function Badge({
  variant = "default",
  size = "md",
  animated = true,
  className,
  children,
  ...props
}: BadgeProps) {
  const Component = animated ? m.span : "span";

  const animationProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: ANIMATIONS.transition.butter,
      }
    : {};

  return (
    <Component
      className={cn(
        "inline-flex items-center",
        "rounded border font-medium",
        "transition-all duration-150",
        VARIANT_STYLES[resolveVariant(variant)],
        SIZE_STYLES[size],
        className,
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

// Dot indicator
interface DotProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
  animated?: boolean;
}

export function Dot({
  variant = "default",
  animated = true,
  className,
  ...props
}: DotProps) {
  const DOT_COLORS: Record<CoreBadgeVariant, string> = {
    default: "bg-white/60",
    secondary: "bg-white/40",
    blue: "bg-blue-400",
    green: "bg-green-400",
    red: "bg-red-400",
    amber: "bg-amber-400",
    purple: "bg-purple-400",
    pink: "bg-pink-400",
  };

  const resolvedVariant = resolveVariant(variant);
  const Component = animated ? m.span : "span";

  const animationProps = animated
    ? {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { ...ANIMATIONS.spring.bounce, delay: 0.1 },
      }
    : {};

  return (
    // @ts-expect-error - Framer Motion type conflict
    <Component
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        DOT_COLORS[resolvedVariant],
        className,
      )}
      {...animationProps}
      {...props}
    />
  );
}
