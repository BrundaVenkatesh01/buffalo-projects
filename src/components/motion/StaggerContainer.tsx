/**
 * StaggerContainer - Container for staggered child animations
 * Children will animate in sequence with configurable delay
 * Optimized with LazyMotion for minimal bundle size
 */

"use client";

import { m } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { staggerContainer, staggerItem } from "@/lib/motion";

interface StaggerContainerProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  staggerDelay = 0.05,
  delayChildren = 0.1,
  children,
  ...props
}: StaggerContainerProps) {
  const customVariants = {
    hidden: staggerContainer.hidden,
    show: {
      ...staggerContainer.show,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={customVariants}
      {...props}
    >
      {children}
    </m.div>
  );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children?: ReactNode;
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <m.div variants={staggerItem} {...props}>
      {children}
    </m.div>
  );
}
