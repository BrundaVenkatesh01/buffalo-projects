/**
 * OpenAIButton - Buttery smooth, polished button
 * Features: Spring physics, magnetic hover, perfect Geist Sans typography
 */

"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type React from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface OpenAIButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "onDrag" | "onDragStart" | "onDragEnd"
  > {
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
    shadow-[0_1px_2px_rgba(0,0,0,0.3)]
    hover:shadow-[0_2px_8px_rgba(0,0,0,0.4)]
  `,
  secondary: `
    bg-white/10 text-white
    border border-white/10
    hover:bg-white/15 hover:border-white/20
    backdrop-blur-sm
  `,
  ghost: `
    text-white/60
    hover:text-white hover:bg-white/5
  `,
} as const;

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-[0.8125rem]", // 13px
  md: "px-4 py-2 text-[0.875rem]", // 14px
  lg: "px-5 py-2.5 text-[0.9375rem]", // 15px
} as const;

export function OpenAIButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: OpenAIButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes for drag events
    <m.button
      className={cn(
        // Base styles
        "group relative inline-flex items-center justify-center gap-2",
        "rounded-lg font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Variant styles
        VARIANT_STYLES[variant],
        // Size styles
        SIZE_STYLES[size],
        className,
      )}
      disabled={isDisabled}
      // Buttery smooth hover & tap
      {...ANIMATIONS.hover.magnetic}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {/* Loading spinner */}
      {isLoading && (
        <m.svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          {...ANIMATIONS.variants.spin}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </m.svg>
      )}

      {/* Left icon with scale animation */}
      {!isLoading && leftIcon && (
        <m.span
          className="inline-flex"
          whileHover={{ scale: 1.1 }}
          transition={ANIMATIONS.transition.quick}
        >
          {leftIcon}
        </m.span>
      )}

      {/* Button text */}
      <span className="relative">{children}</span>

      {/* Right icon with scale animation */}
      {rightIcon && (
        <m.span
          className="inline-flex"
          whileHover={{ scale: 1.1, x: 2 }}
          transition={ANIMATIONS.transition.quick}
        >
          {rightIcon}
        </m.span>
      )}

      {/* Shimmer effect on hover */}
      {variant === "primary" && (
        <m.div
          className="pointer-events-none absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "200% 0",
          }}
          animate={{
            backgroundPosition: ["-200% 0", "200% 0"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </m.button>
  );
}
