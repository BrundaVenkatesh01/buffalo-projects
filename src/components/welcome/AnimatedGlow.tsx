"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { pulseGlow, prefersReducedMotion } from "@/lib/gsap-utils";
import { cn } from "@/lib/utils";

// Intensity and speed presets (module scope to keep stable references)
const OPACITY_RANGES: Record<"low" | "medium" | "high", [number, number]> = {
  low: [0.1, 0.2],
  medium: [0.2, 0.4],
  high: [0.3, 0.5],
};

const DURATIONS: Record<"slow" | "medium" | "fast", number> = {
  slow: 4,
  medium: 3,
  fast: 2,
};

interface AnimatedGlowProps {
  children?: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  blur?: number;
  enabled?: boolean;
}

/**
 * AnimatedGlow Component
 * Wraps content with an animated pulsing glow effect
 * Automatically respects prefers-reduced-motion
 */
export function AnimatedGlow({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.3)",
  intensity = "medium",
  speed = "medium",
  blur = 60,
  enabled = true,
}: AnimatedGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !glowRef.current || prefersReducedMotion()) {
      return;
    }

    const animation = pulseGlow(glowRef.current, {
      duration: DURATIONS[speed],
      opacityRange: OPACITY_RANGES[intensity],
      scaleRange: [1, 1.1],
    });

    return () => {
      animation.kill();
    };
  }, [enabled, intensity, speed]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Animated glow layer */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          filter: `blur(${blur}px)`,
          opacity: OPACITY_RANGES[intensity][0],
        }}
        aria-hidden="true"
      />

      {/* Content */}
      {children}
    </div>
  );
}
