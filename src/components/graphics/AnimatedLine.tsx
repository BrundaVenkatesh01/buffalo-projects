/**
 * AnimatedLine - Minimal line that draws on scroll
 * Swiss design inspired accent element
 */
"use client";

import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface AnimatedLineProps {
  className?: string;
  /**
   * Line color
   * @default "bg-blue-500"
   */
  color?: string;
  /**
   * Line height/thickness
   * @default "h-px"
   */
  thickness?: string;
  /**
   * Animation direction
   * @default "horizontal"
   */
  direction?: "horizontal" | "vertical";
  /**
   * Animation delay in seconds
   * @default 0
   */
  delay?: number;
}

export function AnimatedLine({
  className,
  color = "bg-blue-500",
  thickness = "h-px",
  direction = "horizontal",
  delay = 0,
}: AnimatedLineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn("w-full", thickness, color, className)} />;
  }

  return (
    <m.div
      className={cn(
        direction === "horizontal" ? "w-full" : "h-full w-px",
        thickness,
        color,
        className,
      )}
      initial={{
        scaleX: direction === "horizontal" ? 0 : 1,
        scaleY: direction === "vertical" ? 0 : 1,
      }}
      whileInView={{
        scaleX: 1,
        scaleY: 1,
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        transformOrigin: direction === "horizontal" ? "left" : "top",
      }}
    />
  );
}

/**
 * AccentLine - Static decorative line
 * For immediate visual hierarchy without animation
 */
interface AccentLineProps {
  className?: string;
  color?: string;
  thickness?: string;
  width?: string;
}

export function AccentLine({
  className,
  color = "bg-blue-500",
  thickness = "h-px",
  width = "w-12",
}: AccentLineProps) {
  return <div className={cn(width, thickness, color, className)} />;
}
