/**
 * BuffaloSection - Reusable section component for consistent spacing
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BuffaloSectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const BuffaloSection = ({
  children,
  className,
  variant = "default",
  padding = "lg",
  maxWidth = "xl",
}: BuffaloSectionProps) => {
  return (
    <section
      className={cn(
        // Base styles
        "relative",

        // Variants
        variant === "default" && "bg-black",
        variant === "dark" && "bg-[#0a0a0a]",
        variant === "gradient" &&
          "bg-gradient-to-b from-black via-[#0a0a0a] to-black",

        // Padding
        padding === "sm" && "py-12 px-6",
        padding === "md" && "py-20 px-6",
        padding === "lg" && "py-32 px-6",
        padding === "xl" && "py-40 px-6",

        className,
      )}
    >
      <div
        className={cn(
          "mx-auto",
          maxWidth === "sm" && "max-w-2xl",
          maxWidth === "md" && "max-w-4xl",
          maxWidth === "lg" && "max-w-5xl",
          maxWidth === "xl" && "max-w-6xl",
          maxWidth === "2xl" && "max-w-7xl",
          maxWidth === "full" && "max-w-full",
        )}
      >
        {children}
      </div>
    </section>
  );
};
