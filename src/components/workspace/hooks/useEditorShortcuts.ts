import { useEffect } from "react";

import type { WorkspaceTabId } from "../layout/WorkspaceTabs";

interface EditorShortcutActions {
  onToggleSidebar: () => void;
  onManualSave: () => void;
  onOpenSnapshot: () => void;
  onToggleVersionHistory: () => void;
  onToggleFullScreen: () => void;
  onExitFullScreen: () => void;
}

interface UseEditorShortcutsOptions {
  activeTab: WorkspaceTabId;
  isFullScreen: boolean;
  actions: EditorShortcutActions;
}

/**
 * Custom hook to manage keyboard shortcuts for the workspace editor
 *
 * Shortcuts:
 * - Cmd/Ctrl + B: Toggle sidebar
 * - Cmd/Ctrl + S: Manual save
 * - Cmd/Ctrl + Shift + S: Create snapshot
 * - Cmd/Ctrl + K: Toggle version history (canvas tab only)
 * - F11 or Cmd/Ctrl + Shift + F: Toggle full-screen
 * - Escape: Exit full-screen
 */
export function useEditorShortcuts({
  activeTab,
  isFullScreen,
  actions,
}: UseEditorShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + B: Toggle sidebar
      if (isMod && e.key === "b") {
        e.preventDefault();
        actions.onToggleSidebar();
        return;
      }

      // Cmd/Ctrl + S: Manual save
      if (isMod && e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        actions.onManualSave();
        return;
      }

      // Cmd/Ctrl + Shift + S: Create snapshot
      if (isMod && e.shiftKey && e.key === "s") {
        e.preventDefault();
        actions.onOpenSnapshot();
        return;
      }

      // Cmd/Ctrl + K: Toggle version history (canvas tab only)
      if (isMod && e.key === "k" && activeTab === "canvas") {
        e.preventDefault();
        actions.onToggleVersionHistory();
        return;
      }

      // F11 or Cmd/Ctrl + Shift + F: Toggle full-screen
      if (e.key === "F11" || (isMod && e.shiftKey && e.key === "f")) {
        e.preventDefault();
        actions.onToggleFullScreen();
        return;
      }

      // Escape: Exit full-screen
      if (e.key === "Escape" && isFullScreen) {
        e.preventDefault();
        actions.onExitFullScreen();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, isFullScreen, actions]);
}

export default useEditorShortcuts;
