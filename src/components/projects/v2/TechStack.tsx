"use client";

import { m } from "framer-motion";

import { EmptyState } from "./EmptyState";

import { Code } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface TechStackProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * TechStack - Display technologies and tools used
 *
 * Design: Badge pills with hover effects
 * Content: Tech stack array from workspace
 * Visual: Only renders if tech stack exists
 */
export function TechStack({
  workspace,
  isOwner = false,
  className,
}: TechStackProps) {
  const { techStack } = workspace;

  const hasTechStack = techStack && techStack.length > 0;

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
          <Code className="h-7 w-7 text-purple-500" />
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Tech Stack
          </h2>
        </div>

        {/* Tech Stack Badges or Empty State */}
        {hasTechStack ? (
          <>
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, index) => (
                <m.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div
                    className={cn(
                      "group relative inline-flex items-center gap-2 rounded-full",
                      "border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
                      "px-5 py-2.5 backdrop-blur-sm transition-all",
                      "hover:border-white/[0.15] hover:shadow-md hover:shadow-primary/10",
                    )}
                  >
                    {/* Tech Name */}
                    <span className="text-sm font-medium text-white">
                      {tech}
                    </span>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </m.div>
              ))}
            </div>

            {/* Count Indicator */}
            <div className="mt-8 text-sm text-neutral-400">
              Built with {techStack.length}{" "}
              {techStack.length === 1 ? "technology" : "technologies"}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Code}
            title="No technologies listed yet"
            description="Add your tech stack to help others understand what you built with and learn from your technology choices."
            ctaText={isOwner ? "Add in editor" : undefined}
            ctaHref={isOwner ? `/edit/${workspace.code}` : undefined}
            showCta={isOwner}
          />
        )}
      </div>
    </m.section>
  );
}
