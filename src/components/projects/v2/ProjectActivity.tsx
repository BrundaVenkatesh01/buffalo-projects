"use client";

import { m } from "framer-motion";

import { Badge } from "@/components/unified";
import { Calendar, TrendingUp, Flag, Zap } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectActivityProps {
  workspace: Workspace;
  maxItems?: number;
  className?: string;
}

type TimelineEvent = {
  type: "update" | "milestone" | "pivot" | "start";
  date: string;
  title: string;
  description?: string;
  icon: typeof Calendar;
  color: string;
};

/**
 * ProjectActivity - LinkedIn-style timeline
 *
 * Design: Chronological activity feed showing project evolution
 * Content: Updates, milestones, pivots (newest first)
 * Visual: Left timeline connector, right content cards
 */
export function ProjectActivity({
  workspace,
  maxItems = 10,
  className,
}: ProjectActivityProps) {
  // Combine all timeline events
  const events: TimelineEvent[] = [];

  // Add updates
  if (workspace.updates) {
    workspace.updates.forEach((update) => {
      events.push({
        type: "update",
        date: update.createdAt || "",
        title: update.kind || "Project Update",
        description: update.body,
        icon: Calendar,
        color: "text-blue-500",
      });
    });
  }

  // Add milestones
  if (workspace.milestones) {
    workspace.milestones.forEach((milestone) => {
      events.push({
        type: "milestone",
        date: milestone.date,
        title: milestone.title,
        description: milestone.description,
        icon: Flag,
        color: "text-green-500",
      });
    });
  }

  // Add pivots
  if (workspace.pivots) {
    workspace.pivots.forEach((pivot) => {
      events.push({
        type: "pivot",
        date: pivot.date,
        title: `${pivot.magnitude === "major" ? "Major" : "Minor"} Pivot`,
        description:
          pivot.userNotes ||
          pivot.aiAnalysis ||
          `Changed: ${pivot.fields.join(", ")}`,
        icon: Zap,
        color: "text-amber-500",
      });
    });
  }

  // Add project start
  if (workspace.createdAt) {
    events.push({
      type: "start",
      date: workspace.createdAt,
      title: "Project Started",
      description: `${workspace.projectName} was created`,
      icon: TrendingUp,
      color: "text-primary",
    });
  }

  // Sort by date (newest first)
  events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Limit items
  const displayEvents = events.slice(0, maxItems);

  if (displayEvents.length === 0) {
    return null;
  }

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "border-b border-border/40 bg-background py-12 md:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Activity & Progress
          </h2>
          <p className="text-muted-foreground">
            {events.length} {events.length === 1 ? "update" : "updates"} •{" "}
            {workspace.pivots?.length || 0}{" "}
            {workspace.pivots?.length === 1 ? "pivot" : "pivots"}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-[11px] top-0 h-full w-0.5 bg-border/40" />

          {/* Events */}
          <div className="space-y-8">
            {displayEvents.map((event, index) => {
              const Icon = event.icon;
              const formattedDate = new Date(event.date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );

              return (
                <m.div
                  key={`${event.type}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative flex gap-6"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-background bg-card",
                      event.color,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pb-8">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formattedDate}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* Show more indicator if truncated */}
        {events.length > maxItems && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {maxItems} of {events.length} updates
          </div>
        )}
      </div>
    </m.section>
  );
}
