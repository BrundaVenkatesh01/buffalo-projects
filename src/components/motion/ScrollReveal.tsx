/**
 * ScrollReveal - Scroll-triggered reveal animations
 * Content appears as user scrolls, creating engaging flow
 * Optimized with LazyMotion for minimal bundle size
 */

"use client";

import { m, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { MOTION } from "@/config/motion";

interface ScrollRevealProps {
  children: ReactNode;
  /**
   * Animation variant
   */
  variant?:
    | "fade"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "scale"
    | "flip";
  /**
   * Delay before animation (in seconds)
   */
  delay?: number;
  /**
   * Duration of animation (in seconds, overrides default)
   */
  duration?: number;
  /**
   * Margin around viewport for triggering (negative = trigger before visible)
   */
  margin?:
    | `${number}px`
    | `${number}%`
    | `${number}px ${number}px`
    | `${number}px ${number}px ${number}px ${number}px`;
  /**
   * Amount of element that must be visible (0-1)
   */
  amount?: number;
  /**
   * Only animate once (default true)
   */
  once?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { opacity: 1, rotateX: 0 },
  },
};

/**
 * Reveal content when scrolled into view
 * Respects reduced motion preferences
 */
export function ScrollReveal({
  children,
  variant = "slide-up",
  delay = 0,
  duration,
  margin = "-100px",
  amount = 0.3,
  once = true,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin, amount });

  const shouldAnimate = !MOTION.prefersReducedMotion();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration: duration || MOTION.duration.slow / 1000,
        delay,
        ease: MOTION.easing.smooth,
      }}
      style={{
        willChange: "transform, opacity",
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/**
 * Staggered scroll reveal for lists
 */
export function ScrollRevealList({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/**
 * Individual item for ScrollRevealList
 */
export function ScrollRevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION.duration.base / 1000,
            ease: MOTION.easing.smooth,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
