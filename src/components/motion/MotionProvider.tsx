/**
 * MotionProvider - Global motion configuration for the app
 * Provides reduced-motion support and consistent animation behavior
 */

"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { easings } from "@/lib/motion";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <MotionConfig
      reducedMotion={shouldReduceMotion ? "always" : "never"}
      transition={{
        duration: 0.3,
        ease: easings.easeOut as [number, number, number, number],
      }}
    >
      {children}
    </MotionConfig>
  );
}
