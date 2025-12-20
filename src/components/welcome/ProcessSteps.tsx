"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { AnimatedGlow } from "./AnimatedGlow";

import {
  DURATIONS,
  EASINGS,
  prefersReducedMotion,
  staggerReveal,
} from "@/lib/gsap-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
}

interface ProcessStepsProps {
  steps: Step[];
  title?: string;
  description?: string;
}

/**
 * ProcessSteps Component
 * Displays a sequence of steps with animated entrance and connecting lines
 * Steps reveal sequentially on scroll with floating effect
 */
export function ProcessSteps({ steps, title, description }: ProcessStepsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stepsRef.current || prefersReducedMotion()) {
      // Show all content immediately
      if (stepsRef.current) {
        gsap.set(stepsRef.current.querySelectorAll(".process-step"), {
          opacity: 1,
          y: 0,
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Staggered reveal of step cards
      const stepsEl = stepsRef.current;
      if (!stepsEl) {
        return;
      }
      staggerReveal(stepsEl, ".process-step", {
        duration: DURATIONS.slow,
        stagger: 0.2,
        y: 40,
        ease: EASINGS.default,
        scrollTrigger: {
          trigger: stepsEl,
          start: "top 75%",
        },
      });

      // Animate connecting lines
      const lines = stepsEl.querySelectorAll(".process-line");
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: DURATIONS.medium,
            ease: EASINGS.default,
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
            },
            delay: i * 0.2,
          },
        );
      });
    }, containerRef);

    const containerEl = containerRef.current;
    const stepsElCleanup = stepsRef.current;
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (
          t.vars.trigger === containerEl ||
          t.vars.trigger === stepsElCleanup
        ) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative px-4 py-20">
      {/* Header */}
      {(title || description) && (
        <div className="mx-auto mb-16 max-w-2xl text-center">
          {title && (
            <AnimatedGlow intensity="medium" speed="slow">
              <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {title}
              </h2>
            </AnimatedGlow>
          )}
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Steps */}
      <div ref={stepsRef} className="relative mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step card */}
              <AnimatedGlow intensity="low" speed="medium">
                <div className="process-step group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0a0a0a]/90">
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
                  <div className="relative z-10">
                    {/* Step number */}
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-5xl font-bold text-blue-500/20">
                        {step.number.toString().padStart(2, "0")}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedGlow>

              {/* Connecting line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
                  <div
                    className="process-line h-[2px] w-8 origin-left bg-gradient-to-r from-blue-500/50 to-blue-500/20"
                    style={{
                      transform: "translateX(100%) scaleX(0)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
