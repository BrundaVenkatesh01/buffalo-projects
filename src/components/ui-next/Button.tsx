/**
 * Button - Unified Design System
 * YC/SF minimalism + OpenAI buttery smooth animations
 * Best of both worlds: Fast, clear, AND delightful
 */

"use client";

import { Slot } from "@radix-ui/react-slot";
import { m } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type React from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

type CoreButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonVariant = CoreButtonVariant | "default" | "outline" | "destructive";
type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "default"
  | "icon"
  | "icon-sm"
  | "icon-lg";

interface ButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  block?: boolean;
  /**
   * Render the button as a child element (e.g., <a>, <Link>)
   * Enables semantic HTML while maintaining button styles
   * @example
   * <Button asChild>
   *   <Link href="/dashboard">Dashboard</Link>
   * </Button>
   */
  asChild?: boolean;
}

const VARIANT_STYLES = {
  primary: `
    bg-white text-black
    hover:bg-white/90
    shadow-[0_1px_2px_rgba(0,0,0,0.25)]
    hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
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
  danger: `
    bg-red-500 text-white
    hover:bg-red-600
    shadow-[0_1px_2px_rgba(0,0,0,0.25)]
  `,
  link: `
    bg-transparent text-white/80 underline underline-offset-4 decoration-white/30
    hover:text-white hover:decoration-white/60
    shadow-none border-none px-0
  `,
} as const satisfies Record<CoreButtonVariant, string>;

const SIZE_STYLES: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 [&_svg]:size-3.5",
  sm: "h-8 px-3 text-xs gap-1.5 [&_svg]:size-4",
  md: "h-9 px-4 text-sm gap-2 [&_svg]:size-4",
  lg: "h-10 px-5 text-[0.9375rem] gap-2 [&_svg]:size-5",
  xl: "h-12 px-6 text-base gap-2.5 [&_svg]:size-5",
  default: "h-9 px-4 text-sm gap-2 [&_svg]:size-4",
  icon: "h-9 w-9 px-0 rounded-full [&_svg]:size-4",
  "icon-sm": "h-8 w-8 px-0 rounded-full [&_svg]:size-4",
  "icon-lg": "h-10 w-10 px-0 rounded-full [&_svg]:size-5",
};

const BUTTON_VARIANT_MAP: Record<ButtonVariant, CoreButtonVariant> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  danger: "danger",
  link: "link",
  default: "primary",
  outline: "secondary",
  destructive: "danger",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  block,
  asChild = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const resolvedVariant = BUTTON_VARIANT_MAP[variant];
  const isLinkVariant = resolvedVariant === "link";
  const sizeClasses = isLinkVariant
    ? "h-auto p-0 text-sm gap-1.5"
    : SIZE_STYLES[size];

  const motionProps =
    isDisabled || isLinkVariant
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: ANIMATIONS.transition.quick,
        };

  const baseClassName = cn(
    // Base styles - YC/SF minimalism
    "group relative inline-flex items-center justify-center whitespace-nowrap",
    "rounded-md font-medium",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // SVG handling - ensures icons stay inline
    "[&_svg]:shrink-0",
    "[&_svg]:inline-flex",
    "[&_svg]:items-center",
    "[&_svg]:justify-center",
    // Variant styles
    VARIANT_STYLES[resolvedVariant],
    // Size styles
    sizeClasses,
    // Block styles
    block && "w-full",
    className,
  );

  // When asChild is true, render children with Slot (polymorphic rendering)
  if (asChild) {
    return (
      <Slot className={baseClassName} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes for drag events
    <m.button
      className={baseClassName}
      disabled={isDisabled}
      {...motionProps}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <m.svg
          className="shrink-0"
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

      {/* Left icon */}
      {!isLoading && leftIcon && (
        <m.span
          className="inline-flex shrink-0"
          whileHover={{ scale: 1.1 }}
          transition={ANIMATIONS.transition.quick}
        >
          {leftIcon}
        </m.span>
      )}

      {/* Button text */}
      {children && <span className="inline-flex relative">{children}</span>}

      {/* Right icon */}
      {rightIcon && (
        <m.span
          className="inline-flex shrink-0"
          whileHover={{ scale: 1.1, x: 2 }}
          transition={ANIMATIONS.transition.quick}
        >
          {rightIcon}
        </m.span>
      )}

      {/* Shimmer on primary hover */}
      {resolvedVariant === "primary" && !isDisabled && (
        <m.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <m.div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </m.div>
      )}
    </m.button>
  );
}
