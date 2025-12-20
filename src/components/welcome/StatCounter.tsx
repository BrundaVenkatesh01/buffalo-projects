"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { AnimatedGlow } from "./AnimatedGlow";

import {
  countUp,
  prefersReducedMotion,
  createMagneticHover,
} from "@/lib/gsap-utils";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * StatCounter Component
 * Displays an animated counter that counts up when scrolled into view
 * Features magnetic hover effect and pulsing glow
 */
export function StatCounter({
  value,
  label,
  suffix = "",
  icon,
  delay = 0,
  className,
}: StatCounterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    const numberEl = numberRef.current;
    if (!cardEl || !numberEl) {
      return;
    }

    // Set initial value
    numberEl.textContent = "0" + suffix;

    if (prefersReducedMotion()) {
      // Skip animation, show final value
      numberEl.textContent = value + suffix;
      return;
    }

    // Count-up animation triggered by scroll
    const animation = countUp(numberEl, {
      to: value,
      suffix,
      duration: 2,
      scrollTrigger: {
        trigger: cardEl,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Magnetic hover effect
    const cleanup = createMagneticHover(cardEl, {
      strength: 0.1,
      speed: 0.3,
      rotation: 0.02,
    });

    return () => {
      animation.kill();
      cleanup();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === cardEl) {
          t.kill();
        }
      });
    };
  }, [value, suffix]);

  return (
    <AnimatedGlow intensity="low" speed="slow">
      <div
        ref={cardRef}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl transition-all duration-300",
          "hover:border-blue-500/30 hover:bg-[#0a0a0a]/90",
          className,
        )}
        style={{
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at top, rgba(59, 130, 246, 0.1), transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon */}
          {icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-300">
              {icon}
            </div>
          )}

          {/* Number */}
          <div className="mb-3">
            <span
              ref={numberRef}
              className="block bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tabular-nums text-transparent md:text-6xl"
            >
              0{suffix}
            </span>
          </div>

          {/* Label */}
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
            {label}
          </p>
        </div>

        {/* Animated border glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)",
          }}
          aria-hidden="true"
        />
      </div>
    </AnimatedGlow>
  );
}
