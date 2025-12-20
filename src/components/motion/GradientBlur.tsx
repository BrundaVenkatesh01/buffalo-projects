/**
 * GradientBlur - Animated gradient blur effects
 * OpenAI-inspired ambient background animations
 */

"use client";

import { m } from "framer-motion";
import { type CSSProperties } from "react";

interface GradientBlurProps {
  /**
   * Position preset for the blur
   */
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  /**
   * Color preset
   */
  color?: "blue" | "purple" | "pink" | "green" | "amber";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Animation speed (slower = more subtle)
   */
  speed?: "slow" | "medium" | "fast";
}

const colorMap: Record<string, string> = {
  blue: "rgba(59, 130, 246, 0.15)", // blue-500
  purple: "rgba(168, 85, 247, 0.15)", // purple-500
  pink: "rgba(236, 72, 153, 0.15)", // pink-500
  green: "rgba(34, 197, 94, 0.15)", // green-500
  amber: "rgba(251, 191, 36, 0.15)", // amber-500
};

const positionMap: Record<string, CSSProperties> = {
  "top-left": { top: "-10%", left: "-10%" },
  "top-right": { top: "-10%", right: "-10%" },
  "bottom-left": { bottom: "-10%", left: "-10%" },
  "bottom-right": { bottom: "-10%", right: "-10%" },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
};

const speedMap = {
  slow: 20,
  medium: 15,
  fast: 10,
};

/**
 * Ambient gradient blur that slowly animates in the background
 * Creates OpenAI-like premium atmosphere
 */
export function GradientBlur({
  position = "top-right",
  color = "blue",
  className = "",
  speed = "slow",
}: GradientBlurProps) {
  const duration = speedMap[speed];

  return (
    <m.div
      className={`pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-40 blur-3xl ${className}`}
      style={{
        ...positionMap[position],
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        willChange: "transform",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Hero section with multiple animated gradient blurs
 * Creates depth and visual interest
 */
export function HeroGradients() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <GradientBlur position="top-left" color="purple" speed="slow" />
      <GradientBlur position="top-right" color="blue" speed="medium" />
      <GradientBlur position="bottom-left" color="pink" speed="medium" />
      <GradientBlur
        position="center"
        color="amber"
        speed="slow"
        className="opacity-20"
      />
    </div>
  );
}
