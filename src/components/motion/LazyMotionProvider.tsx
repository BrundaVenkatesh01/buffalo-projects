/**
 * LazyMotionProvider - Optimized framer-motion wrapper
 * Reduces bundle size from 34KB to 4.6KB by using domAnimation features only
 * Wrap your app or specific sections with this provider
 */

"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

interface LazyMotionProviderProps {
  children: ReactNode;
}

export function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
