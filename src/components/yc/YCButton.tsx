/**
 * YCButton - Y Combinator / San Francisco style button
 * Monochrome, high contrast, minimal design
 */

"use client";

import type React from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface YCButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_STYLES = {
  primary: `
    bg-white text-black
    hover:bg-white/90
    active:bg-white/80
    disabled:bg-white/40 disabled:text-black/40
  `,
  secondary: `
    bg-white/10 text-white
    border border-white/10
    hover:bg-white/15 hover:border-white/20
    active:bg-white/20
    disabled:bg-white/5 disabled:text-white/40 disabled:border-white/5
  `,
  ghost: `
    text-white/60
    hover:text-white hover:bg-white/5
    active:bg-white/10
    disabled:text-white/30
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600
    active:bg-red-700
    disabled:bg-red-500/40
  `,
} as const;

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export function YCButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: YCButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2",
        "rounded-md font-medium",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        // Variant styles
        VARIANT_STYLES[variant],
        // Size styles
        SIZE_STYLES[size],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
