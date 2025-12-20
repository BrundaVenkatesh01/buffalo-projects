"use client";
/* eslint-disable react/no-unescaped-entities */

import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { AnimatedGlow } from "./AnimatedGlow";

import { Button } from "@/components/ui-next";
import {
  DURATIONS,
  EASINGS,
  flowingGradient,
  prefersReducedMotion,
} from "@/lib/gsap-utils";

/**
 * HeroGradient Component
 * Full-height hero section with animated gradient background,
 * sequenced text entrance, and pulsing glow effects
 */
export function HeroGradient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) {
      // Show all content immediately if reduced motion is preferred
      if (containerRef.current) {
        gsap.set(containerRef.current.querySelectorAll(".hero-animate"), {
          opacity: 1,
          y: 0,
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASINGS.default } });

      // Animate gradient background in
      if (gradientRef.current) {
        flowingGradient(gradientRef.current, { duration: 12 });
      }

      // Sequence: Fade in tagline → Main heading → Description → CTA
      tl.fromTo(
        ".hero-tagline",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: DURATIONS.slow },
      )
        .fromTo(
          ".hero-heading-line-1",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: DURATIONS.slow },
          "-=0.3",
        )
        .fromTo(
          ".hero-heading-line-2",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: DURATIONS.slow },
          "-=0.4",
        )
        .fromTo(
          ".hero-gradient-text",
          { backgroundPosition: "200% 0" },
          { backgroundPosition: "0% 0", duration: 1.2 },
          "-=0.6",
        )
        .fromTo(
          ".hero-description",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: DURATIONS.medium },
          "-=0.3",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: DURATIONS.medium,
          },
          "-=0.2",
        );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20"
    >
      {/* Animated gradient background */}
      <div
        ref={gradientRef}
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)",
          backgroundSize: "200% 200%",
        }}
        aria-hidden="true"
      />

      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Tagline */}
        <AnimatedGlow intensity="low" speed="slow" className="mb-6">
          <p className="hero-tagline hero-animate text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Buffalo's Builder Platform
          </p>
        </AnimatedGlow>

        {/* Main heading */}
        <h1 className="mb-8 font-display text-6xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          <span className="hero-heading-line-1 hero-animate inline-block">
            Show your work,
          </span>
          <br />
          <span className="hero-heading-line-2 hero-animate inline-block">
            <AnimatedGlow intensity="medium" speed="medium">
              <span
                className="hero-gradient-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 100%" }}
              >
                not just promises
              </span>
            </AnimatedGlow>
          </span>
        </h1>

        {/* Description */}
        <p className="hero-description hero-animate mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Buffalo Projects helps Buffalo builders develop their ideas in public,
          track pivots, and connect with the local entrepreneurial community.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="hero-cta hero-animate group relative h-14 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
            onClick={() => router.push("/join")}
          >
            <AnimatedGlow
              intensity="medium"
              speed="fast"
              className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            />
            <span className="relative z-10">Start Building</span>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="hero-cta hero-animate h-14 rounded-full px-8 text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => router.push("/26")}
          >
            Learn about '26
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="hero-cta hero-animate mt-20">
          <div className="mx-auto flex h-8 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/30">
            <div
              className="mt-2 h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50"
              style={{ animationDuration: "2s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
