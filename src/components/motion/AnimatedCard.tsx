/**
 * AnimatedCard - Card with hover and interaction animations
 * Provides lift effect on hover with smooth transitions
 */

"use client";

import { m } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { cardVariants } from "@/lib/motion";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  enableHover?: boolean;
  enableTap?: boolean;
}

export function AnimatedCard({
  enableHover = true,
  enableTap = true,
  children,
  ...props
}: AnimatedCardProps) {
  const hoverProps = enableHover ? { whileHover: "hover" as const } : {};
  const tapProps = enableTap ? { whileTap: "tap" as const } : {};

  return (
    <m.div
      initial="rest"
      {...hoverProps}
      {...tapProps}
      variants={cardVariants}
      {...props}
    >
      {children}
    </m.div>
  );
}
