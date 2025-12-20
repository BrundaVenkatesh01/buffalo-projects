/**
 * BuffaloCard - Premium card component with Buffalo branding
 */
import type { ReactNode } from "react";

import { Card } from "../ui/card";

import { cn } from "@/lib/utils";

interface BuffaloCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass" | "bordered";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export const BuffaloCard = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
}: BuffaloCardProps) => {
  return (
    <Card
      className={cn(
        // Base styles
        "rounded-xl transition-all duration-300",

        // Variants
        variant === "default" && "bg-[#111111] border border-[#262626]",
        variant === "elevated" &&
          "bg-[#111111] border border-[#262626] shadow-xl",
        variant === "glass" &&
          "bg-white/5 backdrop-blur-md border border-white/10",
        variant === "bordered" && "bg-transparent border-2 border-[#404040]",

        // Padding
        padding === "none" && "p-0",
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        padding === "xl" && "p-12",

        // Hover effect
        hover && "hover:border-[#404040] hover:shadow-2xl cursor-pointer",

        className,
      )}
    >
      {children}
    </Card>
  );
};
