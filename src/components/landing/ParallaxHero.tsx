/**
 * ParallaxHero - Premium parallax scroll effect for hero section
 * Creates depth by moving content slower than page scroll
 * Inspired by Apple, Stripe, Linear landing pages
 */

"use client";

import { useScroll, useTransform, m } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

interface ParallaxHeroProps {
  children: ReactNode;
  /**
   * How much parallax movement (0-1)
   * 0 = no parallax, 1 = maximum parallax
   * @default 0.5
   */
  strength?: number;
  /**
   * Whether to fade out on scroll
   * @default true
   */
  fadeOnScroll?: boolean;
}

export function ParallaxHero({
  children,
  strength = 0.5,
  fadeOnScroll = true,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // From when it enters to when it leaves viewport
  });

  // Transform scroll into parallax movement
  // The higher the strength, the slower the content moves
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${strength * 50}%`], // Max 50% movement at full strength
  );

  // Optional fade effect
  const opacityMotion = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  // Scale effect for extra depth
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - strength * 0.1], // Subtle scale reduction
  );

  return (
    <m.div
      ref={ref}
      style={{
        y,
        opacity: fadeOnScroll ? opacityMotion : 1,
        scale,
        willChange: "transform, opacity", // Performance hint
      }}
      className="relative"
    >
      {children}
    </m.div>
  );
}
