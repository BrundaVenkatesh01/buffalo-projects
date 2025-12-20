/**
 * AnimatedPage - Wrapper for page-level animations
 * Provides consistent enter/exit animations across routes
 */

"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

import { pageVariants } from "@/lib/motion";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <m.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </m.div>
  );
}
