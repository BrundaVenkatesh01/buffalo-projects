/**
 * Input - Unified Design System
 * YC/SF clean borders + OpenAI smooth focus
 * Perfect balance of minimal and delightful
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type React from "react";
import { forwardRef, useState } from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, helperText, error, leftIcon, rightIcon, className, id, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <m.label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-foreground"
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATIONS.transition.butter}
          >
            {label}
          </m.label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                isFocused ? "text-foreground/80" : "text-muted-foreground",
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input field - YC/SF style base */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              "w-full rounded-md px-4 py-2.5",
              "bg-background text-foreground",
              "text-[0.9375rem]", // 15px - YC standard
              "placeholder:text-muted-foreground/40",
              "transition-all duration-200",
              // Border - YC/SF minimal using design tokens
              "border border-border",
              "hover:border-border/60",
              // Focus - OpenAI smooth
              "focus:border-primary/50 focus:outline-none",
              // Error state
              hasError && "border-red-600/50 focus:border-red-600",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                isFocused ? "text-foreground/80" : "text-muted-foreground",
              )}
            >
              {rightIcon}
            </div>
          )}

          {/* Animated focus ring */}
          <AnimatePresence>
            {isFocused && !hasError && (
              <m.div
                className="pointer-events-none absolute inset-0 rounded-md"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={ANIMATIONS.transition.butter}
              >
                <div className="absolute inset-0 rounded-md ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Helper text or error */}
        <AnimatePresence mode="wait">
          {(helperText || error) && (
            <m.p
              key={error ? "error" : "helper"}
              className={cn(
                "mt-1.5 text-xs",
                error ? "text-red-400" : "text-muted-foreground",
              )}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={ANIMATIONS.transition.butter}
            >
              {error || helperText}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <m.label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-foreground"
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATIONS.transition.butter}
          >
            {label}
          </m.label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "w-full rounded-md px-4 py-3",
              "bg-background text-foreground",
              "text-[0.9375rem]",
              "placeholder:text-muted-foreground/40",
              "resize-none",
              "transition-all duration-200",
              "border border-border",
              "hover:border-border/60",
              "focus:border-primary/50 focus:outline-none",
              hasError && "border-red-600/50 focus:border-red-600",
              className,
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          <AnimatePresence>
            {isFocused && !hasError && (
              <m.div
                className="pointer-events-none absolute inset-0 rounded-md"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={ANIMATIONS.transition.butter}
              >
                <div className="absolute inset-0 rounded-md ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {(helperText || error) && (
            <m.p
              key={error ? "error" : "helper"}
              className={cn(
                "mt-1.5 text-xs",
                error ? "text-red-400" : "text-muted-foreground",
              )}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={ANIMATIONS.transition.butter}
            >
              {error || helperText}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
