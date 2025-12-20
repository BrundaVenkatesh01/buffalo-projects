/**
 * Privacy Indicator Component
 *
 * Shows current visibility state of workspace - no decorative elements,
 * purely functional state communication.
 */

"use client";

import { Globe, Lock } from "@/icons";
import { cn } from "@/lib/utils";

interface PrivacyIndicatorProps {
  isPublic: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PrivacyIndicator({
  isPublic,
  className,
  size = "md",
}: PrivacyIndicatorProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        isPublic
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
          : "bg-white/5 text-muted-foreground border border-white/10",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label={isPublic ? "Project is public" : "Project is private"}
    >
      {isPublic ? (
        <>
          <Globe className={iconSizes[size]} aria-hidden="true" />
          <span>Public</span>
        </>
      ) : (
        <>
          <Lock className={iconSizes[size]} aria-hidden="true" />
          <span>Private</span>
        </>
      )}
    </div>
  );
}
