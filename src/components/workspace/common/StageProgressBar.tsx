"use client";

import { useMemo } from "react";

import { STAGE_PROGRESSION } from "@/constants/stages";
import { CheckCircle, Circle } from "@/icons";
import { cn } from "@/lib/utils";
import type { ProjectStage } from "@/types";

interface StageProgressBarProps {
  currentStage?: ProjectStage;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

/**
 * StageProgressBar Component
 *
 * Displays a visual timeline of project stages with progress indication.
 * Shows where the project currently is in its lifecycle and what stages remain.
 *
 * Features:
 * - Completed stages shown with checkmark
 * - Current stage highlighted with primary color
 * - Future stages shown as empty circles
 * - Responsive design with optional labels
 * - Three size variants (sm, md, lg)
 */
export function StageProgressBar({
  currentStage = "idea",
  className,
  size = "md",
  showLabels = true,
}: StageProgressBarProps) {
  const currentIndex = useMemo(
    () => STAGE_PROGRESSION.findIndex((stage) => stage.value === currentStage),
    [currentStage],
  );

  const sizeClasses = {
    sm: {
      icon: "h-4 w-4",
      dot: "h-2 w-2",
      line: "h-px",
      text: "text-xs",
      gap: "gap-1",
    },
    md: {
      icon: "h-5 w-5",
      dot: "h-2.5 w-2.5",
      line: "h-0.5",
      text: "text-sm",
      gap: "gap-2",
    },
    lg: {
      icon: "h-6 w-6",
      dot: "h-3 w-3",
      line: "h-1",
      text: "text-base",
      gap: "gap-3",
    },
  }[size];

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="relative flex items-center justify-between">
        {STAGE_PROGRESSION.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div
              key={stage.value}
              className="relative flex flex-1 items-center"
            >
              {/* Stage Node */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full border-2 bg-background transition-all duration-300",
                  isCompleted && "border-primary bg-primary",
                  isCurrent &&
                    "border-primary bg-background ring-4 ring-primary/20",
                  isFuture && "border-muted-foreground/30 bg-background",
                )}
                aria-label={`${stage.label} - ${isCurrent ? "current stage" : isCompleted ? "completed" : "upcoming"}`}
              >
                {isCompleted ? (
                  <CheckCircle
                    className={cn(sizeClasses.icon, "text-primary-foreground")}
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className={cn(
                      sizeClasses.icon,
                      isCurrent && "fill-primary text-primary",
                      isFuture && "text-muted-foreground/30",
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Connecting Line */}
              {index < STAGE_PROGRESSION.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 w-full -translate-y-1/2",
                    sizeClasses.line,
                  )}
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      index < currentIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/20",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage Labels */}
      {showLabels && (
        <div
          className={cn(
            "mt-4 flex items-start justify-between",
            sizeClasses.gap,
          )}
        >
          {STAGE_PROGRESSION.map((stage, index) => {
            const isCurrent = index === currentIndex;

            return (
              <div
                key={stage.value}
                className={cn(
                  "flex flex-1 flex-col items-center text-center",
                  sizeClasses.gap,
                )}
              >
                <p
                  className={cn(
                    "font-medium transition-colors",
                    sizeClasses.text,
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </p>
                {size !== "sm" && (
                  <p
                    className={cn(
                      "text-xs text-muted-foreground/70",
                      !isCurrent && "hidden sm:block",
                    )}
                  >
                    {stage.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Screen Reader Progress */}
      <p className="sr-only">
        Project stage: {currentStage}. Progress: {currentIndex + 1} of{" "}
        {STAGE_PROGRESSION.length}.
      </p>
    </div>
  );
}
