"use client";

import React from "react";

import { ScrollReveal } from "@/components/motion";
import { FileText, GitBranch, Layers, Download } from "@/icons";
import { cn } from "@/lib/utils";
import { headingStyles, bodyStyles } from "@/styles/typography";

export function WorkspaceFeatureSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Headline - De-emphasized */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
            <p
              className={cn(
                bodyStyles({ variant: "caption", align: "center" }),
                "text-neutral-500 uppercase tracking-wider mb-3",
              )}
            >
              Power tools when you need them
            </p>
            <h2
              className={cn(
                headingStyles({
                  level: "h3",
                  weight: "medium",
                  align: "center",
                }),
                "text-neutral-300 mb-4",
              )}
            >
              Want to go deeper?
            </h2>
            <p
              className={cn(
                bodyStyles({ variant: "base", align: "center" }),
                "text-neutral-500",
              )}
            >
              Our workspace helps you organize, validate, and track your
              project&apos;s evolution. Optional. Always free.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Features Grid - Subtle presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ScrollReveal delay={0}>
            <WorkspaceFeatureCard
              icon={<Layers className="w-5 h-5" />}
              title="Business Model Canvas"
              description="9-block framework to map your idea. Evidence-backed. Version tracked."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <WorkspaceFeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Evidence Management"
              description="Upload documents, PDFs, images. Link them to specific canvas blocks."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <WorkspaceFeatureCard
              icon={<GitBranch className="w-5 h-5" />}
              title="Pivot History"
              description="Track how your idea evolves. Version snapshots. Compare changes."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <WorkspaceFeatureCard
              icon={<Download className="w-5 h-5" />}
              title="Smart Import"
              description="Import GitHub repos or URLs. Project details extracted automatically."
            />
          </ScrollReveal>
        </div>

        {/* Footer - Reinforce it's optional */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 md:mt-16 text-center">
            <p
              className={cn(
                bodyStyles({ variant: "caption", align: "center" }),
                "text-neutral-600",
              )}
            >
              Perfect for founders who want structure. But getting public?{" "}
              <span className="text-neutral-400">
                That&apos;s the main event.
              </span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function WorkspaceFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="relative rounded-2xl border border-white/[0.05]
                 bg-gradient-to-b from-white/[0.015] to-transparent
                 backdrop-blur-sm
                 p-6 md:p-8
                 shadow-[0_4px_16px_rgba(0,0,0,0.08)]
                 transition-all duration-300
                 hover:border-white/[0.1]
                 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                 cursor-default
                 group"
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 mb-4 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-neutral-300">
        {icon}
      </div>

      {/* Title */}
      <h3
        className={cn(
          headingStyles({ level: "h4" }),
          "text-neutral-300 mb-2 transition-colors group-hover:text-neutral-200",
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          bodyStyles({ variant: "secondary" }),
          "text-neutral-500 leading-relaxed transition-colors group-hover:text-neutral-400",
        )}
      >
        {description}
      </p>
    </div>
  );
}
