"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import type React from "react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPEntranceProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
  from?: "bottom" | "top" | "left" | "right" | "scale" | "fade";
  className?: string;
  triggerOnScroll?: boolean;
  triggerStart?: string;
}

/**
 * GSAP-powered entrance animation component
 * Inspired by Resend's subtle, purposeful motion design
 *
 * @example
 * <GSAPEntrance from="bottom" stagger={0.1}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </GSAPEntrance>
 */
export function GSAPEntrance({
  children,
  delay = 0,
  duration = 0.6,
  stagger = 0,
  from = "bottom",
  className = "",
  triggerOnScroll = false,
  triggerStart = "top 80%",
}: GSAPEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const children = containerRef.current?.children;
      if (!children || children.length === 0) {
        return;
      }

      // Define entrance states based on direction
      const fromStates: Record<typeof from, gsap.TweenVars> = {
        bottom: { y: 24, opacity: 0 },
        top: { y: -24, opacity: 0 },
        left: { x: -24, opacity: 0 },
        right: { x: 24, opacity: 0 },
        scale: { scale: 0.95, opacity: 0 },
        fade: { opacity: 0 },
      };

      // Resend-style easing: smooth and natural
      const ease = "power2.out";

      const animation = gsap.fromTo(children, fromStates[from], {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease,
        clearProps: "all", // Clean up inline styles after animation
      });

      // Optional scroll trigger
      if (triggerOnScroll) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: triggerStart,
          onEnter: () => animation.restart(),
          once: true,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, stagger, from, triggerOnScroll, triggerStart]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
