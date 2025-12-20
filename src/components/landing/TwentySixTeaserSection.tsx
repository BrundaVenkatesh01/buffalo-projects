/**
 * TwentySixTeaserSection - Enhanced '26 mystery feature teaser
 * Subtle gradient effects + countdown create intrigue
 */
"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { TwentySixCountdown } from "@/components/common/TwentySixCountdown";
import { cn } from "@/lib/utils";
import { bodyStyles } from "@/styles/typography";
import { headingStyles } from "@/styles/typography";

interface TwentySixTeaserSectionProps {
  className?: string;
}

export function TwentySixTeaserSection({
  className,
}: TwentySixTeaserSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative py-20 md:py-32 px-6 md:px-8 border-y border-white/5 overflow-hidden",
        className,
      )}
    >
      {/* Subtle Animated Gradient Orbs - Mystery Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft purple orb top-left */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute -top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Soft pink orb bottom-right */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute -bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Content Container - clean and minimal */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center space-y-10 md:space-y-12">
          {/* Headline with improved hierarchy */}
          <div className="space-y-4">
            <h2
              className={cn(
                headingStyles({
                  level: "h2",
                  weight: "medium",
                  align: "center",
                }),
                "text-neutral-200",
              )}
            >
              What we&apos;re building for &apos;26
            </h2>
            <p
              className={cn(
                bodyStyles({ variant: "lead", align: "center" }),
                "text-neutral-400 max-w-2xl mx-auto",
              )}
            >
              Gallery. Community. Collaboration. The next chapter unfolds.
            </p>
          </div>

          {/* Countdown - enhanced version */}
          <TwentySixCountdown
            size="lg"
            showLabels={true}
            minimal={false}
            showSeconds={false}
          />

          {/* Enhanced CTA */}
          <Link href="/26" className="inline-block group">
            <span className="text-base text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-2 justify-center">
              Learn about the &apos;26 program
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
