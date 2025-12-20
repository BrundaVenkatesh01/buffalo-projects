"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

import { MOTION } from "@/config/motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  ringClassName?: string;
  labelClassName?: string;
  label?: string;
}

export function ProgressRing({
  value: targetValue,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  showPercentage = true,
  animated = true,
  className,
  ringClassName,
  labelClassName,
  label,
}: ProgressRingProps) {
  const [value, setValue] = useState(0);
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Animate value changes
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setValue(targetValue);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setValue(targetValue);
      return undefined;
    }
  }, [targetValue, animated]);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/20"
        />

        {/* Progress circle with glow */}
        {(() => {
          const animProps = animated
            ? {
                initial: { strokeDashoffset: circumference },
                animate: { strokeDashoffset: offset },
                transition: {
                  duration: 1,
                  ease: MOTION.easing.smooth,
                  delay: 0.2,
                },
              }
            : {};

          // Determine color based on progress
          const getProgressColor = () => {
            if (value < 30) {
              return {
                color: "text-red-500",
                glow: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))",
              };
            }
            if (value < 70) {
              return {
                color: "text-yellow-500",
                glow: "drop-shadow(0 0 4px rgba(234, 179, 8, 0.6))",
              };
            }
            return {
              color: "text-green-500",
              glow: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))",
            };
          };

          const { color, glow } = getProgressColor();

          return (
            <m.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                "transition-colors duration-300",
                color,
                ringClassName,
              )}
              style={{ filter: glow }}
              {...animProps}
            />
          );
        })()}
      </svg>

      {/* Label */}
      {(showLabel || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage &&
            (() => {
              const animProps = animated
                ? {
                    initial: { opacity: 0, scale: 0.5 },
                    animate: { opacity: 1, scale: 1 },
                    transition: {
                      duration: MOTION.duration.base / 1000,
                      delay: 0.5,
                    },
                  }
                : {};
              return (
                <m.span
                  className={cn(
                    "font-bold tabular-nums",
                    size > 80 ? "text-2xl" : "text-lg",
                    labelClassName,
                  )}
                  {...animProps}
                >
                  {Math.round(value)}%
                </m.span>
              );
            })()}
          {label && (
            <span
              className={cn(
                "text-xs text-muted-foreground mt-1",
                labelClassName,
              )}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Mini version for inline use
export function ProgressRingMini({
  value,
  size = 24,
  strokeWidth = 3,
  className,
  animated = true,
}: Pick<
  ProgressRingProps,
  "value" | "size" | "className" | "strokeWidth" | "animated"
>) {
  return (
    <ProgressRing
      value={value}
      size={size}
      strokeWidth={strokeWidth}
      showLabel={false}
      animated={animated}
      {...(className ? { className } : {})}
    />
  );
}
