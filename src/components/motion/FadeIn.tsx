/**
 * FadeIn - Simple fade-in animation component
 * Supports different directions and delays
 * Optimized with LazyMotion for minimal bundle size
 */

"use client";

import { m } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { fadeIn, fadeInUp, fadeInDown } from "@/lib/motion";

type Direction = "up" | "down" | "none";

interface FadeInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate"> {
  direction?: Direction;
  delay?: number;
  duration?: number;
}

const variantMap = {
  up: fadeInUp,
  down: fadeInDown,
  none: fadeIn,
};

export function FadeIn({
  direction = "up",
  delay = 0,
  duration,
  children,
  ...props
}: FadeInProps) {
  const variant = variantMap[direction];

  const customVariant = {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate.transition,
        ...(delay && { delay }),
        ...(duration && { duration }),
      },
    },
  };

  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={customVariant}
      {...props}
    >
      {children}
    </m.div>
  );
}
