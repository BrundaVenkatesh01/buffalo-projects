/**
 * YCInput - Y Combinator / San Francisco style input
 * Clean, minimal, high contrast
 */

"use client";

import type React from "react";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface YCInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const YCInput = forwardRef<HTMLInputElement, YCInputProps>(
  (
    { label, helperText, error, leftIcon, rightIcon, className, id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-white/90"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              "w-full rounded-md px-4 py-2.5",
              "bg-black text-white",
              "text-[0.9375rem]", // 15px - YC standard
              "placeholder:text-white/40",
              "transition-all duration-150",
              // Border states
              "border border-white/10",
              "hover:border-white/20",
              "focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20",
              // Error state
              hasError &&
                "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-400" : "text-white/50",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

YCInput.displayName = "YCInput";

// Textarea variant
interface YCTextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const YCTextarea = forwardRef<HTMLTextAreaElement, YCTextareaProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-white/90"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            // Base styles
            "w-full rounded-md px-4 py-3",
            "bg-black text-white",
            "text-[0.9375rem]", // 15px
            "placeholder:text-white/40",
            "resize-none",
            "transition-all duration-150",
            // Border states
            "border border-white/10",
            "hover:border-white/20",
            "focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20",
            // Error state
            hasError &&
              "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />

        {(helperText || error) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-400" : "text-white/50",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

YCTextarea.displayName = "YCTextarea";
