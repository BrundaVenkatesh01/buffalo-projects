"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/unified";
import { getStageConfig } from "@/constants/stages";
import {
  ExternalLink,
  Github,
  Play,
  Share2,
  Link as LinkIcon,
  Check,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectHeaderProps {
  workspace: Workspace;
  onShare?: () => void;
  className?: string;
}

/**
 * ProjectHeader - YC-style minimal header
 * No social features, just info and CTAs
 */
export function ProjectHeader({ workspace, className }: ProjectHeaderProps) {
  const [copied, setCopied] = useState(false);
  const stageConfig = workspace.stage ? getStageConfig(workspace.stage) : null;
  const coverImage = workspace.assets?.coverImage;

  // Generate share URLs
  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${workspace.slug || workspace.code}`
      : `/p/${workspace.slug || workspace.code}`;

  const shareText = `Check out ${workspace.projectName}${workspace.oneLiner ? ` - ${workspace.oneLiner}` : ""}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(projectUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Support both 'asks' (new) and 'lookingFor' (deprecated)
  const asks = workspace.asks || workspace.lookingFor;
  const gives = workspace.gives;

  // Deduplicate Demo/Website - only show Website if different
  const demoUrl = workspace.embeds?.demo;
  const websiteUrl = workspace.embeds?.website;
  const showWebsite = websiteUrl && websiteUrl !== demoUrl;

  // Traction metrics for inline display
  const hasUsers = Boolean(workspace.users && workspace.users > 0);
  const hasRevenue = Boolean(workspace.revenue && workspace.revenue > 0);
  const hasWaitlist = Boolean(
    workspace.waitlistCount && workspace.waitlistCount > 0,
  );
  const hasTraction = hasUsers || hasRevenue || hasWaitlist;

  const formatTraction = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <header className={cn("relative overflow-hidden", className)}>
      {/* Dynamic background - Always visually interesting */}
      <div className="absolute inset-0 z-0">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt=""
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </>
        ) : (
          <>
            {/* Abstract gradient background when no cover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </>
        )}
      </div>

      {/* Content - More generous padding */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-16">
        {/* Top row: Stage + Tags + Traction inline */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {stageConfig && (
            <Badge variant="outline" className="text-xs font-medium">
              {stageConfig.label}
            </Badge>
          )}
          {workspace.buffaloAffiliated && (
            <Badge variant="secondary" className="text-xs">
              🦬 Buffalo
            </Badge>
          )}
          {workspace.isForTwentySix && (
            <Badge className="bg-amber-500 text-white text-xs">26</Badge>
          )}
          {workspace.tags?.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}

          {/* Traction badges - Social proof at first glance */}
          {hasTraction && (
            <>
              <span className="text-border">•</span>
              {hasUsers && workspace.users && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {formatTraction(workspace.users)} users
                </Badge>
              )}
              {hasRevenue && workspace.revenue && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  ${formatTraction(workspace.revenue)} revenue
                </Badge>
              )}
              {hasWaitlist && workspace.waitlistCount && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  {formatTraction(workspace.waitlistCount)} waitlist
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Project Name - Bigger, bolder */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {workspace.projectName}
        </h1>

        {/* One-liner - More prominent */}
        {workspace.oneLiner && (
          <p className="mb-6 max-w-2xl text-lg text-neutral-300 md:text-xl leading-relaxed">
            {workspace.oneLiner}
          </p>
        )}

        {/* CTAs + Creator - Single row */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Play className="h-3 w-3" />
              Demo
            </a>
          )}

          {showWebsite && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3 text-xs font-medium text-white hover:bg-white/10"
            >
              <ExternalLink className="h-3 w-3" />
              Website
            </a>
          )}

          {workspace.embeds?.github?.repoUrl && (
            <a
              href={workspace.embeds.github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3 text-xs font-medium text-white hover:bg-white/10"
            >
              <Github className="h-3 w-3" />
              Code
            </a>
          )}

          {/* Separator */}
          {(demoUrl || showWebsite || workspace.embeds?.github?.repoUrl) &&
            workspace.creator && <span className="text-white/30">|</span>}

          {/* Creator */}
          {workspace.creator && (
            <span className="text-xs text-neutral-400">
              by{" "}
              <span className="font-medium text-white">
                {workspace.creator}
              </span>
            </span>
          )}
        </div>

        {/* Inline Asks/Gives */}
        {(asks?.length || gives?.length) && (
          <div className="mb-4 flex flex-wrap gap-4 text-xs">
            {asks && asks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Needs:</span>
                <div className="flex flex-wrap gap-1">
                  {asks.slice(0, 3).map((ask, i) => (
                    <span
                      key={i}
                      className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-400"
                    >
                      {ask}
                    </span>
                  ))}
                  {asks.length > 3 && (
                    <span className="text-neutral-500">+{asks.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            {gives && gives.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Offers:</span>
                <div className="flex flex-wrap gap-1">
                  {gives.slice(0, 3).map((give, i) => (
                    <span
                      key={i}
                      className="rounded bg-green-500/20 px-1.5 py-0.5 text-green-400"
                    >
                      {give}
                    </span>
                  ))}
                  {gives.length > 3 && (
                    <span className="text-neutral-500">
                      +{gives.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share buttons - Single user utility */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs text-neutral-400 mr-1">
            <Share2 className="h-3 w-3 inline mr-1" />
            Share:
          </span>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2 text-xs font-medium text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-colors"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2 text-xs font-medium text-white hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X
          </a>
          <button
            onClick={() => {
              void handleCopyLink();
            }}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors",
              copied
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "border-white/20 bg-white/5 text-white hover:bg-white/10",
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <LinkIcon className="h-3 w-3" />
                Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
