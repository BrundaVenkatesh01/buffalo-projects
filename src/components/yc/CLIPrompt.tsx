import type React from "react";
import { type ComponentProps } from "react";

import { cn } from "@/utils/cn";

interface CLIPromptProps extends Omit<ComponentProps<"p">, "className"> {
  children: React.ReactNode;
  size?: "sm" | "base" | "lg";
}

const sizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

/**
 * YC-style CLI prompt
 * `> Command` aesthetic for technical credibility
 */
export function CLIPrompt({ children, size = "lg", ...props }: CLIPromptProps) {
  return (
    <p className={cn("font-mono text-slate-400", sizes[size])} {...props}>
      {">"} {children}
    </p>
  );
}
