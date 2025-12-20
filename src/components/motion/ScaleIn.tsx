/**
 * ScaleIn - Scale-in animation with optional bounce
 * Great for modals, tooltips, and attention-grabbing elements
 */

"use client";

import { m } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { scaleIn, popIn } from "@/lib/motion";

type ScaleType = "smooth" | "pop";

interface ScaleInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate"> {
  type?: ScaleType;
  delay?: number;
}

const variantMap = {
  smooth: scaleIn,
  pop: popIn,
};

export function ScaleIn({
  type = "smooth",
  delay = 0,
  children,
  ...props
}: ScaleInProps) {
  const variant = variantMap[type];

  const customVariant = {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate.transition,
        ...(delay && { delay }),
      },
    },
  };

  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={customVariant}
      {...props}
    >
      {children}
    </m.div>
  );
}
