"use client";

import React from "react";

import { ScrollReveal } from "@/components/motion";
import { Eye, Share2, Wrench } from "@/icons";
import { cn } from "@/lib/utils";
import { headingStyles, bodyStyles } from "@/styles/typography";

export function PurposeSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-8 border-t border-white/20">
      <div className="max-w-6xl mx-auto">
        {/* Main Purpose Statement */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <h2
              className={cn(
                headingStyles({
                  level: "h2",
                  weight: "medium",
                  align: "center",
                }),
                "text-neutral-100 mb-6",
              )}
            >
              Your work. Buffalo&apos;s gallery.
            </h2>
            <p
              className={cn(
                bodyStyles({ variant: "lead", align: "center" }),
                "text-neutral-300 mb-4",
              )}
            >
              You&apos;re building something. We built a place to share it.
            </p>
            <p
              className={cn(
                bodyStyles({ variant: "base", align: "center" }),
                "text-neutral-400 leading-relaxed",
              )}
            >
              Import from GitHub. Add screenshots. Write your story. Your
              project gets a page in Buffalo&apos;s startup gallery—discoverable
              by 43North, StartFast, mentors, and investors.
            </p>
            <p
              className={cn(
                bodyStyles({ variant: "base", align: "center" }),
                "text-neutral-500 mt-4",
              )}
            >
              Need structure? Our workspace tools are here when you want them.
              But getting public? That takes 2 minutes.
            </p>
          </div>
        </ScrollReveal>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <ScrollReveal delay={0}>
            <PillarCard
              icon={<Share2 className="w-6 h-6" />}
              title="Share"
              description="GitHub import, URL scraping, manual upload. Get your project public fast. No website required."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <PillarCard
              icon={<Eye className="w-6 h-6" />}
              title="Discover"
              description="Join Buffalo's startup gallery. 43North, StartFast, mentors—they're looking for projects like yours."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <PillarCard
              icon={<Wrench className="w-6 h-6" />}
              title="Organize"
              description="Need structure? Canvas planning, evidence tracking, pivot history. Power tools when you want them."
            />
          </ScrollReveal>
        </div>

        {/* Buffalo Pride Footer */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 md:mt-20 text-center">
            <p
              className={cn(
                bodyStyles({ variant: "base", align: "center" }),
                "text-neutral-500",
              )}
            >
              Built for Buffalo. Made for builders.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PillarCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center group cursor-default">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/15 bg-white/5 text-white mb-5 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:scale-110">
        {icon}
      </div>

      {/* Title */}
      <h3
        className={cn(
          headingStyles({ level: "h3", align: "center" }),
          "text-neutral-100 mb-3 transition-colors group-hover:text-white",
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          bodyStyles({ variant: "base", align: "center" }),
          "text-neutral-400 leading-relaxed transition-colors group-hover:text-neutral-300",
        )}
      >
        {description}
      </p>
    </div>
  );
}
