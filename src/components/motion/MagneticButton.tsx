/**
 * MagneticButton - Subtle magnetic hover effect inspired by Vercel
 * Creates engaging micro-interactions that feel premium
 */

"use client";

import {
  m,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import type React from "react";
import { useRef, type ReactNode, type MouseEvent } from "react";

import { MOTION } from "@/config/motion";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  /** Strength of magnetic effect (0-1) */
  strength?: number;
  /** Enable rotation on hover */
  enableRotation?: boolean;
}

/**
 * Button with magnetic hover effect
 * Subtly follows the cursor, creating a premium interactive feel
 */
export function MagneticButton({
  children,
  strength = 0.3,
  enableRotation = false,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Motion values for smooth magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth, natural movement
  const springX = useSpring(x, MOTION.spring.gentle);
  const springY = useSpring(y, MOTION.spring.gentle);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Check for reduced motion
  const shouldAnimate = !MOTION.prefersReducedMotion();

  if (!shouldAnimate) {
    return (
      <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }

  return (
    <m.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        willChange: "transform",
      }}
      whileHover={
        enableRotation
          ? {
              scale: 1.05,
              rotate: 2,
            }
          : { scale: 1.05 }
      }
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: MOTION.duration.fast / 1000,
        ease: MOTION.easing.smooth,
      }}
      {...props}
    >
      {children}
    </m.button>
  );
}
