"use client";

import { m, useReducedMotion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { TwentySixCountdown } from "@/components/common/TwentySixCountdown";
import { ScrollIndicator } from "@/components/motion";
import { TwentySixResourceButton } from "@/components/projects/v2/TwentySixResourceButton";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Button } from "@/components/ui-next";

/**
 * '26 Page - Minimal Mystery Teaser
 *
 * Single full-screen section with:
 * - Massive '26 with rainbow gradient + 3D layered shadow
 * - Countdown timer
 * - One mysterious tagline
 * - Single primary CTA
 *
 * Design: Pure mystery/intrigue, minimal visual noise
 */
export function TwentySixLockedScreen() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const countdownRef = useRef<HTMLDivElement>(null);
  const isCountdownInView = useInView(countdownRef, {
    once: true,
    margin: "-100px",
  });

  // Generate deterministic star positions to avoid hydration mismatch
  const starPositions = Array.from({ length: 18 }, (_, i) => {
    // Use index-based distribution for deterministic positions
    const angle = (i * 137.5) % 360; // Golden angle distribution
    const radius = 30 + ((i * 7) % 40); // Spread between 30-70%
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
    return { x: `${x}%`, y: `${y}%`, delay: (i * 0.5) % 5 };
  });

  return (
    <div className="relative min-h-screen bg-black text-foreground overflow-hidden">
      {/* Animated Gradient Background Layers - Calmer, Slower */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Softer purple orb top-left */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Softer pink orb bottom-right */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [180, 270, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Gentle center orb with slower pulsing animation */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Fewer, calmer particles (twinkling stars) */}
        {!shouldReduceMotion &&
          starPositions.map((pos, i) => (
            <m.div
              key={i}
              className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white/40"
              style={{
                top: pos.y,
                left: pos.x,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: pos.delay,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      {/* Hero Section - '26 Text */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-8 py-32 md:py-40">
        <div className="w-full max-w-6xl text-center flex flex-col items-center gap-20 md:gap-28">
          {/* Massive '26 Hero with Soft Glow + Float */}
          <div className="relative mb-16 md:mb-24 lg:mb-32">
            {/* Gentle radial spotlight behind '26 */}
            {!shouldReduceMotion && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <m.div
                  className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(216,180,254,0.1) 0%, rgba(244,114,182,0.06) 40%, transparent 70%)",
                    filter: "blur(60px)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}

            {/* Floating '26 typography with animated gradient + hover effect */}
            <m.div
              className="relative z-50"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "clamp(10rem, 30vw, 20rem)",
                }}
              >
                <TextHoverEffect text="'26" duration={0.3} />
              </m.div>
            </m.div>
          </div>

          {/* Scroll Indicator */}
          {!shouldReduceMotion && (
            <ScrollIndicator
              onClick={() => {
                countdownRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
            />
          )}
        </div>
      </section>

      {/* Countdown Section */}
      <section
        ref={countdownRef}
        className="relative z-10 flex min-h-screen items-center justify-center px-8 py-32 md:py-40"
      >
        <div className="w-full max-w-6xl text-center">
          {/* Grouped Content Container: Countdown + Tagline + CTA */}
          <m.div
            className="relative max-w-4xl mx-auto"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
            animate={
              shouldReduceMotion
                ? {}
                : isCountdownInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 40 }
            }
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle frosted glass container */}
            <div
              className="relative rounded-3xl border border-white/[0.06]
                            bg-gradient-to-b from-white/[0.02] to-transparent
                            backdrop-blur-sm
                            px-8 md:px-16 py-16 md:py-24
                            shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              {/* Countdown Timer */}
              <m.div
                className="mb-16 md:mb-24"
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : isCountdownInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.95 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <TwentySixCountdown
                  size="lg"
                  showSeconds
                  showLabels
                  rainbow={false}
                  onExpire="hide"
                />
              </m.div>

              {/* Mysterious Tagline */}
              <m.div
                className="relative max-w-2xl mx-auto mb-14 md:mb-20"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : isCountdownInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="text-lg md:text-2xl text-foreground/80 text-center leading-relaxed">
                  Something extraordinary is coming to Buffalo&apos;s builder
                  community
                </p>

                {/* Subtle gradient underline */}
                {!shouldReduceMotion && isCountdownInView && (
                  <m.div
                    className="mx-auto mt-8 h-[1px] bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "60%", opacity: 1 }}
                    transition={{
                      delay: 0.8,
                      duration: 1.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}
              </m.div>

              {/* Primary CTAs with Subtle Glow */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <m.div
                  className="relative inline-block"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : isCountdownInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Gentle pulsing glow */}
                  {!shouldReduceMotion && (
                    <m.div
                      className="absolute -inset-3 rounded-full blur-xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
                      }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Button with refined hover */}
                  <m.div
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.03,
                          }
                    }
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Button
                      size="lg"
                      className="relative h-12 md:h-14 rounded-full px-10 md:px-12 text-sm md:text-base font-semibold
                                 bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-blue-500/90
                                 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500
                                 border border-white/[0.15] hover:border-white/[0.25]
                                 transition-all duration-500
                                 shadow-lg hover:shadow-xl"
                      onClick={() => router.push("/join")}
                    >
                      <span className="relative z-10">Get Building</span>
                    </Button>
                  </m.div>
                </m.div>

                {/* Resource Button */}
                <m.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : isCountdownInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <TwentySixResourceButton />
                </m.div>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </div>
  );
}
