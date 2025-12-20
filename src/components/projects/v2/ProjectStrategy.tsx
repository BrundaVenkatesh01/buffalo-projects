"use client";

import { m } from "framer-motion";

import { Badge } from "@/components/unified";
import { Briefcase, FileText, Link as LinkIcon } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace, CanvasBlockId } from "@/types";

export interface ProjectStrategyProps {
  workspace: Workspace;
  className?: string;
}

const BLOCK_CONFIG: Record<
  CanvasBlockId,
  { label: string; description: string; color: string }
> = {
  keyPartners: {
    label: "Key Partners",
    description: "Who do we work with?",
    color: "border-blue-500/20 bg-blue-500/5",
  },
  keyActivities: {
    label: "Key Activities",
    description: "What do we do?",
    color: "border-purple-500/20 bg-purple-500/5",
  },
  keyResources: {
    label: "Key Resources",
    description: "What do we need?",
    color: "border-green-500/20 bg-green-500/5",
  },
  valuePropositions: {
    label: "Value Proposition",
    description: "What do we offer?",
    color: "border-primary/30 bg-primary/10",
  },
  customerRelationships: {
    label: "Customer Relationships",
    description: "How do we interact?",
    color: "border-pink-500/20 bg-pink-500/5",
  },
  channels: {
    label: "Channels",
    description: "How do we reach them?",
    color: "border-orange-500/20 bg-orange-500/5",
  },
  customerSegments: {
    label: "Customer Segments",
    description: "Who do we serve?",
    color: "border-red-500/20 bg-red-500/5",
  },
  costStructure: {
    label: "Cost Structure",
    description: "What are our costs?",
    color: "border-amber-500/20 bg-amber-500/5",
  },
  revenueStreams: {
    label: "Revenue Streams",
    description: "How do we make money?",
    color: "border-emerald-500/20 bg-emerald-500/5",
  },
};

/**
 * ProjectStrategy - Expanded Business Model Canvas
 *
 * Design: Show BMC prominently (not collapsed)
 * Content: All 9 blocks with evidence links
 * Visual: Grid layout with color-coded blocks
 */
export function ProjectStrategy({
  workspace,
  className,
}: ProjectStrategyProps) {
  const { bmcData, evidenceLinks, documents } = workspace;

  if (!bmcData) {
    return null;
  }

  // Count filled blocks
  const filledBlocks = (Object.keys(bmcData) as CanvasBlockId[]).filter(
    (key) => bmcData[key] && String(bmcData[key]).trim().length > 0,
  ).length;

  if (filledBlocks === 0) {
    return null;
  }

  // Get evidence count for a block
  const getEvidenceCount = (blockId: CanvasBlockId): number => {
    if (!evidenceLinks || !evidenceLinks[blockId]) {
      return 0;
    }
    return evidenceLinks[blockId]?.length || 0;
  };

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "border-b border-white/[0.06] bg-white/[0.01] py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Briefcase className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Business Model Canvas
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-light">
            {filledBlocks} of 9 blocks completed • {documents?.length || 0}{" "}
            evidence documents
          </p>
        </div>

        {/* BMC Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(BLOCK_CONFIG) as CanvasBlockId[]).map(
            (blockId, index) => {
              const config = BLOCK_CONFIG[blockId];
              const content = bmcData[blockId];
              const hasContent = content && String(content).trim().length > 0;
              const evidenceCount = getEvidenceCount(blockId);

              return (
                <m.div
                  key={blockId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className={cn(
                    "rounded-2xl border-2 p-6 backdrop-blur-sm",
                    hasContent
                      ? config.color
                      : "border-white/[0.08] bg-white/[0.02]",
                    "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                  )}
                  style={{ willChange: "transform" }}
                >
                  {/* Block Header */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground">
                        {config.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                    {evidenceCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-1 text-xs"
                      >
                        <FileText className="h-3 w-3" />
                        {evidenceCount}
                      </Badge>
                    )}
                  </div>

                  {/* Block Content */}
                  {hasContent ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {String(content)}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Not specified
                    </p>
                  )}

                  {/* Evidence Links */}
                  {evidenceCount > 0 && evidenceLinks?.[blockId] && (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <LinkIcon className="h-3 w-3" />
                        <span>
                          {evidenceCount}{" "}
                          {evidenceCount === 1 ? "document" : "documents"}{" "}
                          support this
                        </span>
                      </div>
                    </div>
                  )}
                </m.div>
              );
            },
          )}
        </div>

        {/* Help Text for Low Completion */}
        {filledBlocks < 5 && (
          <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-6 text-center">
            <p className="text-base text-muted-foreground font-light">
              💡 Complete more blocks to show a comprehensive business strategy
            </p>
          </div>
        )}
      </div>
    </m.section>
  );
}
