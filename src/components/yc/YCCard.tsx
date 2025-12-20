/**
 * YCCard - Y Combinator / San Francisco style card
 * Minimal borders, subtle hover states, high information density
 */

"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "interactive";

interface YCCardProps extends ComponentPropsWithoutRef<"div"> {
  variant?: CardVariant;
  asChild?: boolean;
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
    hover:border-white/20 hover:bg-[#0A0A0A]
    active:scale-[0.99]
    transition-all duration-200
  `,
} as const;

export function YCCard({
  variant = "default",
  className,
  children,
  ...props
}: YCCardProps) {
  return (
    <div
      className={cn("rounded-lg p-6", VARIANT_STYLES[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Card sub-components for common patterns
export function YCCardHeader({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function YCCardTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn("text-lg font-semibold text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function YCCardDescription({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-sm text-white/60", className)} {...props}>
      {children}
    </p>
  );
}

export function YCCardContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function YCCardFooter({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mt-6 flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}
