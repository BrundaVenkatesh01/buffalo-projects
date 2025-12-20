/**
 * GridPattern - Subtle dot grid background
 * Swiss design inspired architectural grid system
 */
"use client";

import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  /**
   * Grid spacing in pixels
   * @default 32
   */
  spacing?: number;
  /**
   * Dot size in pixels
   * @default 1
   */
  dotSize?: number;
  /**
   * Grid opacity
   * @default 0.02
   */
  opacity?: number;
}

export function GridPattern({
  className,
  spacing = 32,
  dotSize = 1,
  opacity = 0.02,
}: GridPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize}
              fill="currentColor"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

/**
 * LineGrid - Subtle line grid background
 * Alternative to dot grid with continuous lines
 */
interface LineGridProps {
  className?: string;
  spacing?: number;
  strokeWidth?: number;
  opacity?: number;
}

export function LineGrid({
  className,
  spacing = 32,
  strokeWidth = 1,
  opacity = 0.02,
}: LineGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="line-grid-pattern"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#line-grid-pattern)" />
      </svg>
    </div>
  );
}
