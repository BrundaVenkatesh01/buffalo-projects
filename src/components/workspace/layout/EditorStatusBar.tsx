"use client";

import type { WorkspaceTabId } from "./WorkspaceTabs";

import { Button } from "@/components/unified";
import { Check, Loader2, Maximize2, Minimize2 } from "@/icons";

interface EditorStatusBarProps {
  activeTab: WorkspaceTabId;
  isFullScreen: boolean;
  isSaving: boolean;
  isAutosaving: boolean;
  saveStatus: "idle" | "saved";
  statusLabel: string;
  onToggleFullScreen: () => void;
}

/**
 * Compact status bar showing save status and full-screen toggle
 */
export function EditorStatusBar({
  activeTab,
  isFullScreen,
  isSaving,
  isAutosaving,
  saveStatus,
  statusLabel,
  onToggleFullScreen,
}: EditorStatusBarProps) {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
        <div className="flex items-center gap-2">
          {activeTab === "canvas" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className="flex h-6 items-center gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              title={
                isFullScreen
                  ? "Exit full-screen (F11)"
                  : "Enter full-screen (F11)"
              }
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="h-3 w-3 shrink-0" />
                  <span className="whitespace-nowrap">Exit Full-Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 shrink-0" />
                  <span className="whitespace-nowrap">Full-Screen</span>
                </>
              )}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {(isSaving || isAutosaving) && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {!isSaving && !isAutosaving && saveStatus === "saved" && (
            <Check className="h-3 w-3 text-green-500" />
          )}
          <span className="text-xs">{statusLabel}</span>
        </div>
      </div>
      {/* Screen reader live region for save status */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusLabel}
      </div>
    </>
  );
}

export default EditorStatusBar;
