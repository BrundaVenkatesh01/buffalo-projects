"use client";

import { m } from "framer-motion";
import { useState } from "react";

import type { WorkspaceTabId } from "../layout/WorkspaceTabs";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Badge,
  Button,
  LAYOUT,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/components/unified";
import { Lightbulb, History, Link2, FileText, Info, X } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

interface WorkspaceAssistPanelProps {
  workspace: Workspace;
  activeTab: WorkspaceTabId;
  className?: string;
}

/**
 * Assist Panel - Right sidebar showing context-aware help and tools
 *
 * Adapts content based on the active workspace tab:
 * - Canvas: Version history, evidence links, AI suggestions
 * - Journal: Writing tips, customer interview templates
 * - Pivots: Timeline visualization, pivot analysis
 * - Documents: Linked fields, organization tips
 * - Share: Publishing checklist, preview
 */
export function WorkspaceAssistPanel({
  workspace,
  activeTab,
  className,
}: WorkspaceAssistPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderCanvasAssist = () => {
    const recentVersions = workspace.versions?.slice(-5).reverse() || [];
    const evidenceCount = workspace.documents?.length || 0;

    return (
      <div className={cn("flex flex-col", SPACING.lg)}>
        {/* Version History */}
        <div>
          <h3
            className={cn(
              TYPOGRAPHY.heading.sm,
              "mb-3 flex items-center gap-2",
            )}
          >
            <History className="h-4 w-4" />
            Version History
          </h3>
          {recentVersions.length > 0 ? (
            <div className="space-y-2">
              {recentVersions.map((version, idx) => (
                <m.div
                  key={version.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: -3 }}
                  className={cn(
                    "rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition-colors hover:border-primary/30 hover:bg-white/10 cursor-pointer",
                    RADIUS.md,
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(TYPOGRAPHY.body.sm)}>
                        {version.snapshot || "Auto-save"}
                      </p>
                      <p className={cn(TYPOGRAPHY.muted.sm, "mt-1")}>
                        {new Date(version.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <m.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 + 0.1 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        v{workspace.versions?.indexOf(version) + 1}
                      </Badge>
                    </m.div>
                  </div>
                </m.div>
              ))}
            </div>
          ) : (
            <p className={cn(TYPOGRAPHY.muted.sm, "italic")}>
              No versions yet. Create a snapshot to save your progress.
            </p>
          )}
        </div>

        {/* Evidence Links */}
        <div>
          <h3
            className={cn(
              TYPOGRAPHY.heading.sm,
              "mb-3 flex items-center gap-2",
            )}
          >
            <Link2 className="h-4 w-4" />
            Evidence & Documents
          </h3>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(TYPOGRAPHY.muted.sm)}
          >
            {evidenceCount > 0
              ? `${evidenceCount} ${evidenceCount === 1 ? "document" : "documents"} uploaded`
              : "No documents yet"}
          </m.p>
          <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="ghost" size="sm" className="mt-2 gap-2">
              <m.div whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                <FileText className="h-3 w-3" />
              </m.div>
              View Documents
            </Button>
          </m.div>
        </div>

        {/* AI Suggestions */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative overflow-hidden rounded-lg border border-primary/20 bg-primary/10 p-4"
        >
          {/* Shimmer effect */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <h3
            className={cn(
              TYPOGRAPHY.heading.sm,
              "relative mb-2 flex items-center gap-2",
            )}
          >
            <m.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Lightbulb className="h-4 w-4 text-primary" />
            </m.div>
            AI Tip
          </h3>
          <p className={cn(TYPOGRAPHY.muted.sm, "relative")}>
            Consider adding specific metrics to your value proposition. Quantify
            the problem you&rsquo;re solving with data from customer interviews.
          </p>
        </m.div>
      </div>
    );
  };

  const renderDocumentsAssist = () => {
    return (
      <div className={cn("flex flex-col", SPACING.lg)}>
        <div>
          <h3 className={cn(TYPOGRAPHY.heading.sm, "mb-3")}>
            Organization Tips
          </h3>
          <ul className={cn("space-y-2", TYPOGRAPHY.muted.sm)}>
            <li>• Link documents to specific BMC fields</li>
            <li>• Use descriptive file names</li>
            <li>• Tag documents by type (research, demo, pitch)</li>
            <li>• Keep your most important evidence at the top</li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <h3
            className={cn(
              TYPOGRAPHY.heading.sm,
              "mb-2 flex items-center gap-2",
            )}
          >
            <Info className="h-4 w-4" />
            Supported Files
          </h3>
          <p className={cn(TYPOGRAPHY.muted.sm)}>
            Upload PDFs, images, videos, and documents up to 10MB each. These
            can be linked to canvas fields as evidence.
          </p>
        </div>
      </div>
    );
  };

  const renderShareAssist = () => {
    const isPublic = workspace.isPublic;
    const hasSlug = !!workspace.slug;

    return (
      <div className={cn("flex flex-col", SPACING.lg)}>
        <div>
          <h3 className={cn(TYPOGRAPHY.heading.sm, "mb-3")}>
            Publishing Checklist
          </h3>
          <ul className="space-y-2">
            <ChecklistItem
              label="Project name & description"
              complete={!!workspace.projectName && !!workspace.description}
            />
            <ChecklistItem
              label="Value proposition clear"
              complete={!!workspace.bmcData?.valuePropositions}
            />
            <ChecklistItem
              label="Target audience defined"
              complete={!!workspace.bmcData?.customerSegments}
            />
            <ChecklistItem
              label="At least 3 canvas fields"
              complete={
                Object.values(workspace.bmcData || {}).filter((v) => v)
                  .length >= 3
              }
            />
          </ul>
        </div>

        {isPublic && hasSlug && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <h3 className={cn(TYPOGRAPHY.heading.sm, "mb-2 text-green-400")}>
              Your project is live!
            </h3>
            <p className={cn(TYPOGRAPHY.muted.sm)}>
              Anyone can view your project at:
            </p>
            <code className="mt-2 block overflow-hidden text-ellipsis rounded bg-black/30 px-2 py-1 text-xs">
              {`/p/${workspace.slug}`}
            </code>
          </div>
        )}
      </div>
    );
  };

  const renderOverviewAssist = () => {
    return (
      <div className={cn("flex flex-col", SPACING.lg)}>
        <div>
          <h3 className={cn(TYPOGRAPHY.heading.sm, "mb-3")}>Getting Started</h3>
          <p className={cn(TYPOGRAPHY.muted.sm, "mb-4")}>
            Your workspace has everything you need to develop and validate your
            business idea.
          </p>
          <ul className={cn("space-y-2", TYPOGRAPHY.muted.sm)}>
            <li>
              • <strong>Canvas:</strong> Map your business model
            </li>
            <li>
              • <strong>Journal:</strong> Document learnings
            </li>
            <li>
              • <strong>Documents:</strong> Upload evidence
            </li>
            <li>
              • <strong>Share:</strong> Get feedback
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <h3
            className={cn(
              TYPOGRAPHY.heading.sm,
              "mb-2 flex items-center gap-2",
            )}
          >
            <Lightbulb className="h-4 w-4 text-primary" />
            Next Step
          </h3>
          <p className={cn(TYPOGRAPHY.muted.sm)}>
            Start by filling out your Business Model Canvas. Focus on value
            proposition and customer segments first.
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "canvas":
        return renderCanvasAssist();
      case "journey":
        // Journey uses canvas assist for version history and context
        return renderCanvasAssist();
      case "documents":
        return renderDocumentsAssist();
      case "share":
        return renderShareAssist();
      default:
        // overview and any other tab
        return renderOverviewAssist();
    }
  };

  if (isCollapsed) {
    return null; // Could show a collapsed state, but for now just hide
  }

  return (
    <aside
      className={cn(
        "fixed right-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-l border-white/10 bg-[#0a0a0a]",
        LAYOUT.panel.aside,
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <m.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(TYPOGRAPHY.heading.sm)}
        >
          Assistant
        </m.h2>
        <m.div
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(true)}
            aria-label="Close assistant panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </m.div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">{renderContent()}</ScrollArea>
    </aside>
  );
}

function ChecklistItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <m.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 text-sm"
    >
      <m.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
          complete
            ? "border-green-500 bg-green-500/20 text-green-500"
            : "border-muted-foreground/30 text-muted-foreground",
        )}
      >
        {complete && (
          <m.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            ✓
          </m.span>
        )}
      </m.div>
      <span className={complete ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </m.li>
  );
}
