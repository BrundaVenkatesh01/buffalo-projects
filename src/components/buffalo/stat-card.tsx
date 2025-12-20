import type React from "react";

import { Card } from "@/components/ui-next";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={cn("", className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-bold leading-none tracking-tight text-foreground">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "font-medium",
                  change.trend === "up" && "text-green-500",
                  change.trend === "down" && "text-red-500",
                  change.trend === "neutral" && "text-muted-foreground",
                )}
              >
                {change.trend === "up" && "↑"}
                {change.trend === "down" && "↓"}
                {change.trend === "neutral" && "→"} {Math.abs(change.value)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
