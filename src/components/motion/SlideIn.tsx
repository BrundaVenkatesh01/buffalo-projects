/**
 * SlideIn - Slide-in animation from different directions
 * Useful for sidebars, notifications, directional content, and tab transitions
 * Enhanced with comprehensive motion system
 */

"use client";

import { m } from "framer-motion";
import type { HTMLMotionProps, Transition } from "framer-motion";
import type { ReactNode } from "react";

import { MOTION } from "@/config/motion";

type Direction = "up" | "down" | "left" | "right";

interface SlideInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit"> {
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  spring?: boolean;
  children: ReactNode;
}

export function SlideIn({
  direction = "up",
  distance = MOTION.distance.lg,
  delay = 0,
  duration = MOTION.duration.slow,
  spring = false,
  children,
  ...props
}: SlideInProps) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const transition: Transition = spring
    ? {
        ...MOTION.spring.gentle,
        delay,
      }
    : {
        duration: duration / 1000,
        delay,
        ease: MOTION.easing.smooth,
      };

  return (
    <m.div
      initial={{ ...directions[direction], opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...directions[direction], opacity: 0 }}
      transition={MOTION.getTransition(transition, { duration: 0 })}
      {...props}
    >
      {children}
    </m.div>
  );
}
