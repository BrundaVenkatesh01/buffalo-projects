"use client";

import { m } from "framer-motion";
import type { ComponentType } from "react";

import { EmptyState } from "./EmptyState";

import { Github, Star, GitFork, Users, AlertCircle, Code } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface GitHubStatsProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * GitHubStats - Display GitHub repository statistics
 *
 * Design: Stat cards with GitHub metrics
 * Content: Stars, forks, contributors, language, topics, license
 * Visual: Only renders if GitHub stats exist
 */
export function GitHubStats({
  workspace,
  isOwner = false,
  className,
}: GitHubStatsProps) {
  const { githubStats, embeds } = workspace;

  const hasGitHubStats = !!githubStats;
  const repoUrl = embeds?.github?.repoUrl;

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
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Github className="h-7 w-7 text-white" />
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              GitHub
            </h2>
          </div>

          {/* Repository Link */}
          {repoUrl && hasGitHubStats && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-white transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
            >
              View Repository
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

        {/* GitHub Stats or Empty State */}
        {hasGitHubStats ? (
          <>
            {(() => {
              const {
                stars,
                forks,
                contributors,
                issues,
                language,
                topics,
                license,
              } = githubStats;

              const mainStats = [
                stars !== undefined
                  ? {
                      icon: Star,
                      label: "Stars",
                      value: formatNumber(stars),
                      color: "text-yellow-500",
                    }
                  : null,
                forks !== undefined
                  ? {
                      icon: GitFork,
                      label: "Forks",
                      value: formatNumber(forks),
                      color: "text-blue-500",
                    }
                  : null,
                contributors !== undefined
                  ? {
                      icon: Users,
                      label: "Contributors",
                      value: formatNumber(contributors),
                      color: "text-green-500",
                    }
                  : null,
                issues !== undefined
                  ? {
                      icon: AlertCircle,
                      label: "Open Issues",
                      value: formatNumber(issues),
                      color: "text-red-500",
                    }
                  : null,
              ].filter(Boolean) as StatItem[];

              return (
                <>
                  {/* Main Stats Grid */}
                  {mainStats.length > 0 && (
                    <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                      {mainStats.map((stat, index) => (
                        <m.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-sm transition-all hover:border-white/[0.12]"
                        >
                          {/* Icon */}
                          <stat.icon
                            className={cn("mb-3 h-5 w-5", stat.color)}
                          />

                          {/* Value */}
                          <div className="mb-1 text-3xl font-bold tracking-tight text-white">
                            {stat.value}
                          </div>

                          {/* Label */}
                          <div className="text-xs font-medium text-neutral-400">
                            {stat.label}
                          </div>
                        </m.div>
                      ))}
                    </div>
                  )}

                  {/* Language & License */}
                  <div className="mb-8 flex flex-wrap gap-4">
                    {language && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2">
                        <Code className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-white">
                          {language}
                        </span>
                      </div>
                    )}

                    {license && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2">
                        <svg
                          className="h-4 w-4 text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-white">
                          {license}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Topics */}
                  {topics && topics.length > 0 && (
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                        Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic, index) => (
                          <m.div
                            key={topic}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.03,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                          >
                            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              {topic}
                            </span>
                          </m.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <EmptyState
            icon={Github}
            title="No GitHub repository connected"
            description="Connect your GitHub repository to display stats like stars, forks, contributors, and showcase your open-source project."
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
interface StatItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
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
