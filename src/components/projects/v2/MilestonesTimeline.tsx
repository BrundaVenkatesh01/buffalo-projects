"use client";

import { m } from "framer-motion";

import { EmptyState } from "./EmptyState";

import { Calendar, CheckCircle2 } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface MilestonesTimelineProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * MilestonesTimeline - Display project milestones chronologically
 *
 * Design: Vertical timeline with connected dots
 * Content: Milestone date, title, description
 * Visual: Only renders if milestones exist
 */
export function MilestonesTimeline({
  workspace,
  isOwner = false,
  className,
}: MilestonesTimelineProps) {
  const { milestones } = workspace;

  const hasMilestones = milestones && milestones.length > 0;

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "border-b border-white/[0.06] bg-background py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-4">
          <Calendar className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Milestones
          </h2>
        </div>

        {/* Timeline or Empty State */}
        {hasMilestones ? (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent md:left-[2.75rem]" />

              {/* Milestones */}
              <div className="space-y-8">
                {[...milestones]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((milestone, index) => (
                    <m.div
                      key={`${milestone.date}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="relative flex gap-6 md:gap-8"
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-background md:h-12 md:w-12">
                          <CheckCircle2 className="h-5 w-5 text-primary md:h-6 md:w-6" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        {/* Date */}
                        <time className="mb-2 block text-sm font-medium text-primary">
                          {formatDate(milestone.date)}
                        </time>

                        {/* Title */}
                        <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
                          {milestone.title}
                        </h3>

                        {/* Description */}
                        {milestone.description && (
                          <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground md:text-lg">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </m.div>
                  ))}
              </div>
            </div>

            {/* Milestone Count */}
            <div className="mt-10 text-center text-sm text-muted-foreground">
              {milestones.length}{" "}
              {milestones.length === 1 ? "milestone" : "milestones"} achieved
            </div>
          </>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No milestones documented yet"
            description="Track your journey by adding key milestones and achievements. Show how your project has evolved over time."
            ctaText={isOwner ? "Add in editor" : undefined}
            ctaHref={isOwner ? `/edit/${workspace.code}` : undefined}
            showCta={isOwner}
          />
        )}
      </div>
    </m.section>
  );
}

// Utility function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
