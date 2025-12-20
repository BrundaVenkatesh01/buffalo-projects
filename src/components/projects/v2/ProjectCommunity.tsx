"use client";

import { m } from "framer-motion";

import { EmptyState } from "./EmptyState";

import { Badge } from "@/components/unified";
import { Users, Heart, MessageSquare, Linkedin } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectCommunityProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * ProjectCommunity - Get Involved Early Section
 *
 * Design: Displays asks, gives, team members, and acknowledgments
 * Purpose: Facilitate peer collaboration and early supporter engagement
 * Position: NOW #1 in content order for "get in early" focus
 */
export function ProjectCommunity({
  workspace,
  isOwner = false,
  className,
}: ProjectCommunityProps) {
  // Support both 'asks' (new) and 'lookingFor' (deprecated) for backwards compatibility
  const asks = workspace.asks || workspace.lookingFor;
  const { gives, teamMembers, acknowledgments } = workspace;

  const hasAsks = asks && asks.length > 0;
  const hasGives = gives && gives.length > 0;
  const hasTeam = teamMembers && teamMembers.length > 0;
  const hasAcknowledgments = acknowledgments && acknowledgments.trim();

  const hasCommunityData = hasAsks || hasGives || hasTeam || hasAcknowledgments;

  // Early stage indicator for urgency (research/planning are the earliest public stages)
  const isEarlyStage = workspace.stage === 'research' || workspace.stage === 'planning';

  return (
    <m.section
      id="community"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "border-b border-white/[0.06] bg-background py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header - Action-oriented for early supporters */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Get Involved Early
            </h2>
            {isEarlyStage && (
              <Badge className="bg-amber-500/90 text-white font-medium animate-pulse">
                Now accepting early supporters
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            {isEarlyStage
              ? "This project is in its early stages. Your support now shapes what it becomes."
              : "Join the community, contribute your skills, or connect with the builder."
            }
          </p>
        </div>

        {hasCommunityData ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Asks & Gives Section */}
            {(hasAsks || hasGives) && (
              <div className="space-y-8">
                {/* What I'm Asking For - Framed as opportunity */}
                {hasAsks && (
                  <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/[0.02] backdrop-blur-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full" />
                    <div className="mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Ways you can help
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Can you contribute any of these? Reach out!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {asks.map((ask, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25 cursor-pointer transition-colors"
                        >
                          {ask}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* What I Can Offer - Framed as value exchange */}
                {hasGives && (
                  <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/[0.02] backdrop-blur-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full" />
                    <div className="mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-foreground">
                        In return, I offer
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Early supporters get exclusive benefits
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gives.map((give, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-green-500/15 text-green-300 border-green-500/30"
                        >
                          {give}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Team & Acknowledgments Section */}
            {(hasTeam || hasAcknowledgments) && (
              <div className="space-y-8">
                {/* Team Members */}
                {hasTeam && (
                  <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-purple-500/5 to-purple-500/[0.02] backdrop-blur-sm p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Team
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 rounded-lg bg-white/[0.02] p-3"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.role}
                            </p>
                          </div>
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] transition-colors hover:bg-white/[0.1]"
                              aria-label={`${member.name} on LinkedIn`}
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acknowledgments */}
                {hasAcknowledgments && (
                  <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-amber-500/5 to-amber-500/[0.02] backdrop-blur-sm p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Acknowledgments
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {acknowledgments}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No community information yet"
            description="Add what you're asking for, what you can offer, team members, or acknowledgments to connect with the community."
            ctaText={isOwner ? "Add in editor" : undefined}
            ctaHref={isOwner ? `/edit/${workspace.code}` : undefined}
            showCta={isOwner}
          />
        )}
      </div>
    </m.section>
  );
}
