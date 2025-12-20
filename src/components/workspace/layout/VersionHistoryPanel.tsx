"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/unified";
import { ChevronRight, History } from "@/icons";
import { cn } from "@/lib/utils";

const VersionHistory = dynamic(
  () => import("../common/VersionHistory").then((mod) => mod.VersionHistory),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
    ssr: false,
  },
);

interface VersionHistoryPanelProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onRestoreComplete: () => void;
}

/**
 * Right sidebar panel showing version history
 * Only visible on canvas tab
 */
export function VersionHistoryPanel({
  isCollapsed,
  onToggleCollapsed,
  onRestoreComplete,
}: VersionHistoryPanelProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 border-l border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent transition-all duration-300",
        isCollapsed ? "w-12" : "w-80",
      )}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header with toggle */}
        <button
          onClick={onToggleCollapsed}
          className="flex items-center justify-between gap-2 border-b border-white/10 p-4 text-left transition-colors hover:bg-white/[0.03]"
          title={
            isCollapsed
              ? "Show version history (⌘K)"
              : "Hide version history (⌘K)"
          }
        >
          {!isCollapsed ? (
            <>
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <History className="h-4 w-4" />
                Version History
              </h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 rotate-180" />
            </>
          ) : (
            <History className="h-4 w-4 mx-auto text-muted-foreground" />
          )}
        </button>

        {/* Version history content */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <VersionHistory onRestoreComplete={onRestoreComplete} />
          </div>
        )}
      </div>
    </div>
  );
}

export default VersionHistoryPanel;
