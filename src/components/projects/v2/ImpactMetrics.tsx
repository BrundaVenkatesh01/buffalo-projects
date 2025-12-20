"use client";

import { m } from "framer-motion";
import type { ComponentType } from "react";

import { EmptyState } from "./EmptyState";

import { TrendingUp, Users, DollarSign, UserPlus } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ImpactMetricsProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * ImpactMetrics - Display project success metrics
 *
 * Design: Grid of stat cards with icons
 * Content: Users, revenue, waitlist count
 * Visual: Shows empty state if no metrics exist
 */
export function ImpactMetrics({
  workspace,
  isOwner = false,
  className,
}: ImpactMetricsProps) {
  const { users, revenue, waitlistCount } = workspace;

  const hasMetrics = users || revenue || waitlistCount;

  const metrics = [
    users
      ? {
          icon: Users,
          label: "Active Users",
          value: formatNumber(users),
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        }
      : null,
    revenue
      ? {
          icon: DollarSign,
          label: "Revenue",
          value: formatCurrency(revenue),
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        }
      : null,
    waitlistCount
      ? {
          icon: UserPlus,
          label: "Waitlist",
          value: formatNumber(waitlistCount),
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        }
      : null,
  ].filter(Boolean) as MetricItem[];

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "border-b border-white/[0.06] bg-transparent py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-4">
          <TrendingUp className="h-7 w-7 text-green-500" />
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Impact
          </h2>
        </div>

        {/* Metrics Grid or Empty State */}
        {hasMetrics ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => (
              <m.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:shadow-lg"
              >
                {/* Icon */}
                <div
                  className={cn(
                    "mb-6 inline-flex rounded-xl p-3",
                    metric.bgColor,
                  )}
                >
                  <metric.icon className={cn("h-6 w-6", metric.color)} />
                </div>

                {/* Value */}
                <div className="mb-2 text-4xl font-bold tracking-tight text-white">
                  {metric.value}
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-neutral-400">
                  {metric.label}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </m.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No impact metrics tracked yet"
            description="Add users, revenue, or waitlist count to showcase your project's traction and success."
            ctaText={isOwner ? "Add in editor" : undefined}
            ctaHref={isOwner ? `/edit/${workspace.code}` : undefined}
            showCta={isOwner}
          />
        )}
      </div>
    </m.section>
  );
}

// Helper types
interface MetricItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

// Utility functions
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}
