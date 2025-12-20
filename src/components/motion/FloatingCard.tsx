/**
 * FloatingCard - Cards with subtle floating animation
 * Creates depth and premium feel with parallax-like movement
 */

"use client";

import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, type MouseEvent, useRef } from "react";

import { MOTION } from "@/config/motion";

interface FloatingCardProps {
  children: ReactNode;
  /**
   * Enable 3D tilt effect on hover
   */
  enableTilt?: boolean;
  /**
   * Tilt intensity (0-1)
   */
  tiltIntensity?: number;
  /**
   * Enable subtle float animation
   */
  enableFloat?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Card that responds to mouse movement with 3D tilt
 * Creates premium, interactive feel
 */
export function FloatingCard({
  children,
  enableTilt = true,
  tiltIntensity = 0.15,
  enableFloat = true,
  className = "",
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to rotation
  const rotateX = useTransform(
    mouseY,
    [-0.5, 0.5],
    [10 * tiltIntensity, -10 * tiltIntensity],
  );
  const rotateY = useTransform(
    mouseX,
    [-0.5, 0.5],
    [-10 * tiltIntensity, 10 * tiltIntensity],
  );

  // Apply spring physics for smooth movement
  const springRotateX = useSpring(rotateX, MOTION.spring.gentle);
  const springRotateY = useSpring(rotateY, MOTION.spring.gentle);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !enableTilt) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Check for reduced motion
  const shouldAnimate = !MOTION.prefersReducedMotion();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? springRotateX : 0,
        rotateY: enableTilt ? springRotateY : 0,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      animate={
        enableFloat
          ? {
              y: [0, -8, 0],
            }
          : {}
      }
      transition={
        enableFloat
          ? {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
      whileHover={{
        scale: 1.02,
        transition: {
          duration: MOTION.duration.base / 1000,
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/**
 * Simple floating animation without tilt
 */
export function FloatingElement({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
