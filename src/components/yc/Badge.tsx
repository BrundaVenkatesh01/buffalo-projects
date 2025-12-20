import type React from "react";
import { type ComponentProps } from "react";

import { cn } from "@/utils/cn";

type BadgeVariant = "beta" | "live" | "soon" | "alpha";

interface BadgeProps extends Omit<ComponentProps<"span">, "className"> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  live: "bg-green-500/20 text-green-400 border-green-500/30",
  soon: "bg-slate-800 text-slate-400 border-white/10",
  alpha: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

/**
 * YC-style status badge
 * Monospaced, uppercase, with subtle background
 */
export function Badge({ variant = "beta", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-mono font-semibold rounded border",
        badgeVariants[variant],
      )}
      {...props}
    >
      {children}
    </span>
  );
}
