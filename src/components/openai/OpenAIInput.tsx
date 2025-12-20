/**
 * OpenAIInput - Polished input with smooth focus transitions
 * Features: Floating label, smooth border animations, glass effect
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type React from "react";
import { forwardRef, useState } from "react";

import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface OpenAIInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const OpenAIInput = forwardRef<HTMLInputElement, OpenAIInputProps>(
  (
    { label, helperText, error, leftIcon, rightIcon, className, id, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {/* Label with smooth animation */}
        {label && (
          <m.label
            htmlFor={inputId}
            className="mb-2 block text-[0.875rem] font-medium text-white/90"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATIONS.transition.butter}
          >
            {label}
          </m.label>
        )}

        {/* Input container with glass effect */}
        <m.div
          className="relative"
          whileHover={{ scale: 1.005 }}
          transition={ANIMATIONS.transition.quick}
        >
          {/* Left icon */}
          {leftIcon && (
            <m.div
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              animate={{
                color: isFocused
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.4)",
              }}
              transition={ANIMATIONS.transition.smooth}
            >
              {leftIcon}
            </m.div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              "w-full rounded-lg px-4 py-2.5",
              "bg-black/40 backdrop-blur-md",
              "text-[0.875rem] text-white",
              "placeholder:text-white/40",
              "transition-all duration-300",
              // Border
              "border border-white/10",
              // Focus state
              "focus:border-white/30 focus:bg-black/60 focus:outline-none",
              // Error state
              hasError &&
                "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
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
            <m.div
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              animate={{
                color: isFocused
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.4)",
              }}
              transition={ANIMATIONS.transition.smooth}
            >
              {rightIcon}
            </m.div>
          )}

          {/* Animated focus ring */}
          <AnimatePresence>
            {isFocused && !hasError && (
              <m.div
                className="pointer-events-none absolute inset-0 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={ANIMATIONS.transition.butter}
              >
                <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 ring-offset-2 ring-offset-black/50" />
              </m.div>
            )}
          </AnimatePresence>

          {/* Glass reflection effect */}
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
        </m.div>

        {/* Helper text or error */}
        <AnimatePresence mode="wait">
          {(helperText || error) && (
            <m.p
              key={error ? "error" : "helper"}
              className={cn(
                "mt-1.5 text-xs",
                error ? "text-red-400" : "text-white/50",
              )}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
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

OpenAIInput.displayName = "OpenAIInput";

// Textarea variant
interface OpenAITextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const OpenAITextarea = forwardRef<
  HTMLTextAreaElement,
  OpenAITextareaProps
>(({ label, helperText, error, className, id, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label && (
        <m.label
          htmlFor={textareaId}
          className="mb-2 block text-[0.875rem] font-medium text-white/90"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={ANIMATIONS.transition.butter}
        >
          {label}
        </m.label>
      )}

      <m.div
        className="relative"
        whileHover={{ scale: 1.005 }}
        transition={ANIMATIONS.transition.quick}
      >
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg px-4 py-3",
            "bg-black/40 backdrop-blur-md",
            "text-[0.875rem] text-white",
            "placeholder:text-white/40",
            "resize-none",
            "transition-all duration-300",
            "border border-white/10",
            "focus:border-white/30 focus:bg-black/60 focus:outline-none",
            hasError &&
              "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
            className,
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        <AnimatePresence>
          {isFocused && !hasError && (
            <m.div
              className="pointer-events-none absolute inset-0 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={ANIMATIONS.transition.butter}
            >
              <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 ring-offset-2 ring-offset-black/50" />
            </m.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
      </m.div>

      <AnimatePresence mode="wait">
        {(helperText || error) && (
          <m.p
            key={error ? "error" : "helper"}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-400" : "text-white/50",
            )}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={ANIMATIONS.transition.butter}
          >
            {error || helperText}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
});

OpenAITextarea.displayName = "OpenAITextarea";
