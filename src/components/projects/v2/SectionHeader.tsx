"use client";

import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * SectionHeader - Reusable section heading component
 *
 * Design: Icon + Title (+ optional subtitle)
 * Purpose: Consistent section headers across project page
 * Usage: All major sections (About, Impact, Showcase, etc.)
 */
export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 flex items-center gap-4", className)}>
      <Icon className="h-7 w-7 flex-shrink-0 text-primary" />
      <div className="flex-1">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
