"use client";

import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  showCta?: boolean; // Only show CTA if user is owner
  className?: string;
}

/**
 * EmptyState - Reusable empty state component
 *
 * Design: Centered icon, title, description, optional CTA
 * Purpose: Guide users on what's missing, encourage completion
 * Usage: All conditional sections (metrics, tech, milestones, etc.)
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaText,
  ctaHref,
  showCta = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center",
        "rounded-xl border border-white/[0.08]",
        "bg-gradient-to-br from-white/[0.02] to-white/[0.01]",
        "px-8 py-16",
        className,
      )}
    >
      {/* Icon */}
      <Icon className="mb-6 h-12 w-12 text-neutral-500 md:h-16 md:w-16" />

      {/* Title */}
      <h3 className="mb-3 text-center text-lg font-medium text-neutral-400">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-md text-center text-sm leading-relaxed text-neutral-500">
        {description}
      </p>

      {/* Optional CTA (only for project owner) */}
      {showCta && ctaText && ctaHref && (
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-white transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
        >
          {ctaText}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
