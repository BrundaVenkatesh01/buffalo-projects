"use client";

import { m } from "framer-motion";
import Link from "next/link";

import { ProjectCardGallery } from "@/components/projects/ProjectCardGallery";
import { Button } from "@/components/unified";
import { Target, ChevronRight, CheckCircle } from "@/icons";
import { cn } from "@/lib/utils";
import type { Match } from "@/services/matchingService";
import { getMatchDescription } from "@/services/matchingService";

export interface MatchesSectionProps {
  matches: Match[];
  onSeeAll?: () => void;
  className?: string;
}

/**
 * MatchesSection - Display personalized project matches
 *
 * Shows projects where workspace.gives matches user.asks
 * Horizontal scrolling carousel with match quality indicators
 */
export function MatchesSection({
  matches,
  onSeeAll,
  className,
}: MatchesSectionProps) {
  if (matches.length === 0) {
    return null;
  }

  // Show top 5 matches in carousel
  const displayedMatches = matches.slice(0, 5);

  return (
    <section
      className={cn(
        "border-b border-white/[0.06] bg-background py-12",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Matched For You
              </h2>
              <p className="text-sm text-muted-foreground">
                {matches.length} {matches.length === 1 ? "project" : "projects"}{" "}
                offering what you&apos;re looking for
              </p>
            </div>
          </div>

          {onSeeAll && matches.length > 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSeeAll}
              className="gap-2"
            >
              See all {matches.length}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {displayedMatches.map((match, index) => (
              <m.div
                key={match.workspace.code}
                className="flex-shrink-0 w-[340px] snap-start"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* Match Quality Badge */}
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                      match.matchType === "perfect" &&
                        "bg-green-500/20 text-green-400 border border-green-500/30",
                      match.matchType === "good" &&
                        "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                      match.matchType === "potential" &&
                        "bg-purple-500/20 text-purple-400 border border-purple-500/30",
                    )}
                  >
                    <CheckCircle className="h-3 w-3" />
                    {match.matchType === "perfect" && "Perfect Match"}
                    {match.matchType === "good" && "Good Match"}
                    {match.matchType === "potential" && "Potential Match"}
                  </div>
                </div>

                {/* Project Card */}
                <ProjectCardGallery
                  workspace={match.workspace}
                  showMatch={true}
                  matchScore={match.matchScore}
                />

                {/* Match Description */}
                <p className="mt-2 text-xs text-muted-foreground">
                  {getMatchDescription(match)}
                </p>
              </m.div>
            ))}
          </div>

          {/* Scroll Gradient Hints */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* CTA for no asks */}
        {matches.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
            <Target className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Get Personalized Matches
            </h3>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Tell us what you&apos;re looking for in your profile, and
              we&apos;ll find projects that can help.
            </p>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                Update Your Asks
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles provided via global utility class */}
    </section>
  );
}
