"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PulseGlowProps {
  children: ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  intensity?: number;
  duration?: number;
  enabled?: boolean;
  className?: string;
}

const colorMap = {
  blue: "rgba(59, 130, 246, INTENSITY)",
  green: "rgba(34, 197, 94, INTENSITY)",
  yellow: "rgba(234, 179, 8, INTENSITY)",
  red: "rgba(239, 68, 68, INTENSITY)",
  purple: "rgba(168, 85, 247, INTENSITY)",
};

/**
 * PulseGlow - Pulsing glow animation for emphasis
 * Perfect for "next step" indicators, unsaved changes, new content
 */
export function PulseGlow({
  children,
  color = "blue",
  intensity = 0.3,
  duration = 2000,
  enabled = true,
  className,
}: PulseGlowProps) {
  const baseColor = colorMap[color].replace("INTENSITY", "0");
  const glowColor = colorMap[color].replace("INTENSITY", String(intensity));

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={cn("relative", className)}
      animate={{
        boxShadow: [
          `0 0 0 0 ${baseColor}`,
          `0 0 20px 5px ${glowColor}`,
          `0 0 0 0 ${baseColor}`,
        ],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * PulseBorder - Pulsing border animation
 * Subtle alternative to glow, better for dark backgrounds
 */
interface PulseBorderProps {
  children: ReactNode;
  color?: string;
  duration?: number;
  enabled?: boolean;
  className?: string;
}

export function PulseBorder({
  children,
  color = "border-blue-500",
  duration = 2000,
  enabled = true,
  className,
}: PulseBorderProps) {
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={cn("relative border-2 rounded-lg", color, className)}
      animate={{
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * PulseScale - Subtle scale pulsing
 * For badges, notification dots, status indicators
 */
interface PulseScaleProps {
  children: ReactNode;
  scale?: [number, number];
  duration?: number;
  enabled?: boolean;
  className?: string;
}

export function PulseScale({
  children,
  scale = [1, 1.1],
  duration = 2000,
  enabled = true,
  className,
}: PulseScaleProps) {
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      animate={{
        scale: [scale[0], scale[1], scale[0]],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * PulseOpacity - Breathing opacity animation
 * For loading states, subtle emphasis
 */
interface PulseOpacityProps {
  children: ReactNode;
  opacity?: [number, number];
  duration?: number;
  enabled?: boolean;
  className?: string;
}

export function PulseOpacity({
  children,
  opacity = [1, 0.5],
  duration = 2000,
  enabled = true,
  className,
}: PulseOpacityProps) {
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      animate={{
        opacity: [opacity[0], opacity[1], opacity[0]],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}
