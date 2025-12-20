"use client";

import { m } from "framer-motion";

import { Award, Star, TrendingUp, Users } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectCredibilityProps {
  workspace: Workspace;
  className?: string;
}

/**
 * ProjectCredibility - Social proof section
 *
 * Design: LinkedIn-style endorsements/recommendations
 * Content: TwentySix status, achievements, GitHub stars, team
 * Visual: Badge grid + stat cards
 */
export function ProjectCredibility({
  workspace,
  className,
}: ProjectCredibilityProps) {
  const hasTwentySix = workspace.isForTwentySix;
  const hasGitHubStars =
    workspace.githubStats?.stars && workspace.githubStats.stars > 10;
  const hasTeam = workspace.teamMembers && workspace.teamMembers.length > 0;
  const hasBuffalo = workspace.buffaloAffiliated;

  // Don't render if no credibility signals
  if (!hasTwentySix && !hasGitHubStars && !hasTeam && !hasBuffalo) {
    return null;
  }

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "border-b border-border/40 bg-card py-12 md:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Recognition & Community
          </h2>
          <p className="text-muted-foreground">Validation and support</p>
        </div>

        <div className="space-y-6">
          {/* TwentySix Badge */}
          {hasTwentySix && (
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 rounded-lg border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="mb-1 font-semibold text-foreground">
                  TwentySix 2025 Participant
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected for Buffalo&apos;s premier startup accelerator
                  program
                </p>
              </div>
            </m.div>
          )}

          {/* Buffalo Affiliation */}
          {hasBuffalo && (
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="mb-1 font-semibold text-foreground">
                  Buffalo Ecosystem
                </div>
                <p className="text-sm text-muted-foreground">
                  Part of Buffalo&apos;s growing innovation community
                </p>
              </div>
            </m.div>
          )}

          {/* GitHub Stars */}
          {hasGitHubStars && (
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="mb-1 font-semibold text-foreground">
                  {workspace.githubStats!.stars.toLocaleString()} GitHub Stars
                </div>
                <p className="text-sm text-muted-foreground">
                  Developer community support
                </p>
              </div>
            </m.div>
          )}

          {/* Team */}
          {hasTeam && (
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-lg border border-border bg-muted/30 p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Team</h3>
              </div>
              <div className="space-y-3">
                {workspace.teamMembers!.slice(0, 3).map((member, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {member.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {workspace.teamMembers!.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{workspace.teamMembers!.length - 3} more team{" "}
                    {workspace.teamMembers!.length - 3 === 1
                      ? "member"
                      : "members"}
                  </p>
                )}
              </div>
            </m.div>
          )}
        </div>
      </div>
    </m.section>
  );
}
