import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full border bg-white/[0.02] text-[15px] text-foreground transition-all duration-200",
    "placeholder:text-muted-foreground/70 placeholder:transition-opacity placeholder:duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:placeholder:opacity-80",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/[0.01]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-white/[0.08] rounded-lg",
          "hover:border-white/[0.12] hover:bg-white/[0.04]",
          "focus:border-primary/50 focus:bg-white/[0.03]",
        ].join(" "),
        error: [
          "border-destructive/50 rounded-lg",
          "focus:border-destructive focus:ring-destructive/20",
        ].join(" "),
      },
      inputSize: {
        sm: "h-9 px-3.5 py-2 text-sm",
        md: "h-11 px-4 py-2.5 text-[15px]",
        lg: "h-12 px-4 py-3 text-[15px]",
        xl: "h-[52px] px-5 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "lg",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, inputSize, type, error, prefix, suffix, ...props },
    ref,
  ) => {
    const hasError = !!error;
    const finalVariant = hasError ? "error" : variant;

    if (prefix || suffix) {
      return (
        <div className="w-full space-y-1.5">
          <div className="relative">
            {prefix && (
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                {prefix}
              </div>
            )}
            <input
              type={type}
              className={cn(
                inputVariants({ variant: finalVariant, inputSize }),
                prefix && "pl-10",
                suffix && "pr-10",
                className,
              )}
              ref={ref}
              {...props}
            />
            {suffix && (
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                {suffix}
              </div>
            )}
          </div>
          {hasError && (
            <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full space-y-1.5">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: finalVariant, inputSize, className }),
          )}
          ref={ref}
          {...props}
        />
        {hasError && (
          <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
