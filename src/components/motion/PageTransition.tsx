/**
 * PageTransition - Smooth page transitions with OpenAI/Vercel-like feel
 * Creates a welcoming, fluid transition between pages
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { MOTION } from "@/config/motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition wrapper with fade + subtle slide
 * Creates a polished, premium feel
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -8,
        }}
        transition={{
          duration: MOTION.duration.slow / 1000,
          ease: MOTION.easing.smooth,
        }}
        style={{
          willChange: "transform, opacity",
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

/**
 * Lighter version for nested transitions
 */
export function SubPageTransition({ children }: PageTransitionProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: MOTION.duration.base / 1000,
      }}
    >
      {children}
    </m.div>
  );
}
