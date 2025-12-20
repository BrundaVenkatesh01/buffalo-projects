"use client";

/**
 * BackgroundComposer - Layered dark theme background system
 *
 * Composes multiple layers for depth and visual interest:
 * 1. Base layer - Solid black foundation
 * 2. Gradient layer - Animated gradient orbs
 * 3. Grid layer - Subtle dot pattern
 *
 * Intensity presets control opacity and complexity:
 * - bold: Full gradient mesh + grid + multiple orbs (landing page)
 * - medium: Subtle gradient + light grid (dashboard, portfolio)
 * - subtle: Solid dark + minimal accent (workspace, editor)
 * - none: Just solid background
 *
 * Performance optimized:
 * - CSS animations (GPU accelerated)
 * - Fixed positioning (no scroll repaints)
 * - will-change hints
 * - Reduced motion support
 */

import { cn } from "@/lib/utils";

export type BackgroundIntensity = "bold" | "medium" | "subtle" | "none";

interface BackgroundComposerProps {
  /** Background intensity preset */
  intensity?: BackgroundIntensity;
  /** Additional classes */
  className?: string;
}

// Intensity configuration
const INTENSITY_CONFIG = {
  bold: {
    baseGradient: true,
    orbs: [
      {
        position: "top-[10%] left-[15%]",
        size: "w-[500px] h-[500px]",
        color: "rgba(59, 130, 246, 0.4)", // blue
        opacity: "opacity-20",
        animation: "animate-float-slow",
        blur: "blur-[40px]",
      },
      {
        position: "top-[40%] right-[10%]",
        size: "w-[600px] h-[600px]",
        color: "rgba(139, 92, 246, 0.3)", // purple
        opacity: "opacity-15",
        animation: "animate-float-slower",
        blur: "blur-[40px]",
      },
      {
        position: "bottom-[15%] left-[40%]",
        size: "w-[450px] h-[450px]",
        color: "rgba(14, 165, 233, 0.3)", // cyan
        opacity: "opacity-10",
        animation: "animate-float-medium",
        blur: "blur-[40px]",
      },
    ],
    gridOpacity: 0.015,
    showGrid: true,
  },
  medium: {
    baseGradient: true,
    orbs: [
      {
        position: "top-[5%] right-[20%]",
        size: "w-[400px] h-[400px]",
        color: "rgba(59, 130, 246, 0.25)", // blue, less saturated
        opacity: "opacity-10",
        animation: "animate-float-slow",
        blur: "blur-[60px]",
      },
      {
        position: "bottom-[20%] left-[10%]",
        size: "w-[350px] h-[350px]",
        color: "rgba(139, 92, 246, 0.2)", // purple
        opacity: "opacity-8",
        animation: "animate-float-slower",
        blur: "blur-[60px]",
      },
    ],
    gridOpacity: 0.01,
    showGrid: true,
  },
  subtle: {
    baseGradient: false,
    orbs: [
      {
        position: "top-0 right-0",
        size: "w-[300px] h-[300px]",
        color: "rgba(59, 130, 246, 0.15)",
        opacity: "opacity-5",
        animation: "",
        blur: "blur-[80px]",
      },
    ],
    gridOpacity: 0.005,
    showGrid: false,
  },
  none: {
    baseGradient: false,
    orbs: [],
    gridOpacity: 0,
    showGrid: false,
  },
};

export function BackgroundComposer({
  intensity = "medium",
  className,
}: BackgroundComposerProps) {
  const config = INTENSITY_CONFIG[intensity];

  if (intensity === "none") {
    return (
      <div
        className={cn("fixed inset-0 bg-black -z-10", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn("fixed inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Layer 1: Base gradient */}
      {config.baseGradient ? (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-950" />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Layer 2: Gradient orbs */}
      {config.orbs.map((orb, index) => (
        <div
          key={index}
          className={cn(
            "absolute rounded-full",
            orb.position,
            orb.size,
            orb.opacity,
            orb.animation,
            // Reduced motion: disable animations
            "motion-reduce:animate-none",
          )}
          style={{
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: orb.blur,
            willChange: orb.animation ? "transform" : undefined,
          }}
        />
      ))}

      {/* Layer 3: Grid pattern */}
      {config.showGrid && config.gridOpacity > 0 && (
        <GridPatternLayer opacity={config.gridOpacity} />
      )}
    </div>
  );
}

/**
 * GridPatternLayer - SVG-based dot grid
 * Extracted to keep main component clean
 */
function GridPatternLayer({ opacity }: { opacity: number }) {
  const spacing = 32;
  const dotSize = 1;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 h-full w-full text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg-grid-pattern"
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
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>
    </div>
  );
}
