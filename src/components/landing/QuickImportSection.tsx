"use client";

import React from "react";

import { ScrollReveal } from "@/components/motion";
import { Eye, Share2, Wrench, Upload } from "@/icons";
import { cn } from "@/lib/utils";
import { headingStyles } from "@/styles/typography";

export function QuickImportSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-8 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Headline - Minimal */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h2
              className={cn(
                headingStyles({
                  level: "h2",
                  weight: "semibold",
                  align: "center",
                }),
                "text-white mb-3",
              )}
            >
              How it works
            </h2>
            <p className="text-neutral-500 text-base">
              GitHub, URL, or manual. Takes 2 minutes.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Step Flow - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <ScrollReveal delay={0}>
            <ImportStepCard
              stepNumber={1}
              icon={<Upload className="w-6 h-6" />}
              title="Import"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ImportStepCard
              stepNumber={2}
              icon={<Wrench className="w-6 h-6" />}
              title="Build"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <ImportStepCard
              stepNumber={3}
              icon={<Eye className="w-6 h-6" />}
              title="Review"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <ImportStepCard
              stepNumber={4}
              icon={<Share2 className="w-6 h-6" />}
              title="Publish"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ImportStepCard({
  stepNumber,
  icon,
  title,
}: {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Step Number */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm font-semibold text-neutral-400">
        {stepNumber}
      </div>

      {/* Icon */}
      <div className="text-blue-400">{icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );
}
