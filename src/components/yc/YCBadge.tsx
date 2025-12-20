/**
 * YCBadge - Y Combinator / San Francisco style badge
 * Minimal, high contrast, subtle emphasis
 */

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "blue" | "green" | "red" | "amber";
type BadgeSize = "sm" | "md";

interface YCBadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const VARIANT_STYLES = {
  default: `
    bg-white/10
    text-white/80
    border border-white/10
  `,
  blue: `
    bg-blue-500/10
    text-blue-400
    border border-blue-500/20
  `,
  green: `
    bg-green-500/10
    text-green-400
    border border-green-500/20
  `,
  red: `
    bg-red-500/10
    text-red-400
    border border-red-500/20
  `,
  amber: `
    bg-amber-500/10
    text-amber-400
    border border-amber-500/20
  `,
} as const;

const SIZE_STYLES = {
  sm: "px-1.5 py-0.5 text-[0.6875rem]", // 11px
  md: "px-2 py-0.5 text-xs", // 12px
} as const;

export function YCBadge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: YCBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded font-medium",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Dot indicator for status
interface DotProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

export function YCDot({ variant = "default", className, ...props }: DotProps) {
  const DOT_COLORS = {
    default: "bg-white/60",
    blue: "bg-blue-400",
    green: "bg-green-400",
    red: "bg-red-400",
    amber: "bg-amber-400",
  } as const;

  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        DOT_COLORS[variant],
        className,
      )}
      {...props}
    />
  );
}
