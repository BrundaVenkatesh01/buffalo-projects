/**
 * BuffaloHero - Hero section component for landing pages
 * Clean and minimal design with subtle animations
 */
"use client";

import { FloatingShapes } from "@/components/graphics";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui-next";
import { cn } from "@/lib/utils";
import { bodyStyles, headingStyles } from "@/styles/typography";

interface BuffaloHeroProps {
  title: string;
  description: string;
  badge?: string;
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export const BuffaloHero = ({
  title,
  description,
  badge,
  primaryCTA,
  secondaryCTA,
  className,
}: BuffaloHeroProps) => {
  return (
    <section
      className={cn(
        "relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 overflow-hidden min-h-[85vh] flex items-center",
        className,
      )}
    >
      {/* Minimal background - single subtle gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        {/* Floating geometric shapes */}
        <FloatingShapes />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge (if provided) */}
          {badge && (
            <FadeIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <span className="text-sm text-neutral-300">{badge}</span>
              </div>
            </FadeIn>
          )}

          {/* Headline with fade-in */}
          <FadeIn delay={0.1}>
            <h1
              className={cn(
                headingStyles({
                  level: "display",
                  weight: "bold",
                  align: "center",
                }),
              )}
            >
              {title}
            </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.3}>
            <p
              className={cn(
                bodyStyles({ variant: "lead", align: "center" }),
                "max-w-3xl mx-auto text-neutral-400",
              )}
            >
              {description}
            </p>
          </FadeIn>

          {/* CTAs with fade-in */}
          {(primaryCTA || secondaryCTA) && (
            <FadeIn delay={0.5}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
                {primaryCTA && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      void primaryCTA.onClick();
                    }}
                    className="w-full sm:w-auto transition-transform hover:scale-105"
                  >
                    {primaryCTA.text}
                  </Button>
                )}
                {secondaryCTA && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      void secondaryCTA.onClick();
                    }}
                    className="w-full sm:w-auto"
                  >
                    {secondaryCTA.text}
                  </Button>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
};
