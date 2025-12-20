# Buffalo Projects UI/UX - Quick Wins with Code Examples

This document provides specific code examples for the 8 quick wins that can be implemented immediately.

---

## Quick Win #1: Move WorkspaceSidebar to Navigation (30 mins)

**Current Location:** `src/components/workspace/WorkspaceSidebar.tsx`
**New Location:** `src/components/navigation/WorkspaceSidebar.tsx`

**Why:** WorkspaceSidebar is a navigation component (selects active section), not a workspace editor component. It belongs in navigation/.

**Steps:**
1. Move file to navigation directory
2. Update any imports in workspace components:
   ```typescript
   // Before
   import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
   
   // After
   import { WorkspaceSidebar } from "@/components/navigation/WorkspaceSidebar";
   ```
3. Run tests to ensure no breakage

---

## Quick Win #2: Extract EditorHeader Component (1 hour)

**Location:** `app/(app)/edit/[code]/UnifiedProjectEditor.tsx` lines 621-673

**Create new file:** `src/components/workspace/layout/EditorHeader.tsx`

```typescript
"use client";

import { Loader2, Check, Maximize2, Minimize2 } from "@/icons";
import { Button } from "@/components/unified";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  statusLabel: string;
  isSaving: boolean;
  isAutosaving: boolean;
  saveStatus: "idle" | "saved";
  isFullScreen: boolean;
  activeTab: string;
  onToggleFullScreen: () => void;
}

export function EditorHeader({
  statusLabel,
  isSaving,
  isAutosaving,
  saveStatus,
  isFullScreen,
  activeTab,
  onToggleFullScreen,
}: EditorHeaderProps) {
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
```

**Then in UnifiedProjectEditor.tsx:**
```typescript
import { EditorHeader } from "@/components/workspace/layout/EditorHeader";

// Inside component JSX:
{!showLoadingState && (
  <EditorHeader
    statusLabel={statusLabel}
    isSaving={isSaving}
    isAutosaving={isAutosaving}
    saveStatus={saveStatus}
    isFullScreen={isFullScreen}
    activeTab={activeTab}
    onToggleFullScreen={() => setIsFullScreen(prev => !prev)}
  />
)}
```

---

## Quick Win #3: Create useEditorShortcuts Hook (1 hour)

**Create new file:** `src/components/workspace/hooks/useEditorShortcuts.ts`

```typescript
import { useEffect } from "react";

interface EditorShortcutsConfig {
  onToggleSidebar?: () => void;
  onSave?: () => void;
  onSnapshot?: () => void;
  onToggleVersionHistory?: () => void;
  onToggleFullScreen?: () => void;
  onCanvasTab?: boolean; // Only process K shortcut on canvas tab
}

export function useEditorShortcuts({
  onToggleSidebar,
  onSave,
  onSnapshot,
  onToggleVersionHistory,
  onToggleFullScreen,
  onCanvasTab = false,
}: EditorShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B: Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        onToggleSidebar?.();
      }

      // Cmd/Ctrl + S: Manual save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }

      // Cmd/Ctrl + Shift + S: Create snapshot
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "s") {
        e.preventDefault();
        onSnapshot?.();
      }

      // Cmd/Ctrl + K: Toggle version history (canvas tab only)
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && onCanvasTab) {
        e.preventDefault();
        onToggleVersionHistory?.();
      }

      // F11 or Cmd/Ctrl + Shift + F: Toggle full-screen
      if (
        e.key === "F11" ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f")
      ) {
        e.preventDefault();
        onToggleFullScreen?.();
      }

      // Escape: Exit full-screen
      if (e.key === "Escape") {
        // Parent component handles this if in full-screen mode
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleSidebar, onSave, onSnapshot, onToggleVersionHistory, onToggleFullScreen, onCanvasTab]);
}
```

**Usage in UnifiedProjectEditor.tsx:**
```typescript
import { useEditorShortcuts } from "@/components/workspace/hooks/useEditorShortcuts";

export function WorkspaceEditor({ workspaceId }: WorkspaceEditorProps) {
  // ... existing state ...

  useEditorShortcuts({
    onToggleSidebar: () => setIsSidebarCollapsed(prev => !prev),
    onSave: handleManualSave,
    onSnapshot: () => setSnapshotDialogOpen(true),
    onToggleVersionHistory: () => setIsVersionHistoryCollapsed(prev => !prev),
    onToggleFullScreen: () => setIsFullScreen(prev => !prev),
    onCanvasTab: activeTab === "canvas",
  });

  // Remove the old useEffect (lines 373-417)
  // ...rest of component
}
```

---

## Quick Win #4: Create navRouteConfig.ts (30 mins)

**Create new file:** `src/components/navigation/config/navRouteConfig.ts`

```typescript
import type { Route } from "next";
import type React from "react";

export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  locked?: boolean;
  badge?: React.ReactNode;
  activePatterns?: string[]; // Patterns that count as "active"
}

export const NAV_ROUTES = {
  public: [
    {
      label: "Home",
      href: "/",
      activePatterns: ["/"],
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Resources",
      href: "/resources",
    },
  ] as NavItem[],

  authenticated: [
    {
      label: "Dashboard",
      href: "/dashboard",
      requiresAuth: true,
      activePatterns: ["/dashboard", "/edit/*"], // Dashboard includes editor
    },
    {
      label: "Discover",
      href: "/dashboard/discover",
      requiresAuth: true,
    },
    {
      label: "'26",
      href: "/26",
      requiresAuth: true,
    },
  ] as NavItem[],
};

/**
 * Check if a route is active based on current pathname
 */
export function isRouteActive(
  currentPath: string,
  navItem: NavItem
): boolean {
  // Exact match
  if (currentPath === navItem.href) return true;

  // Check custom patterns
  if (navItem.activePatterns) {
    return navItem.activePatterns.some((pattern) => {
      if (pattern === "/") {
        return currentPath === "/";
      }
      if (pattern.includes("*")) {
        const prefix = pattern.replace("/*", "");
        return currentPath.startsWith(prefix);
      }
      return currentPath === pattern;
    });
  }

  // Default: check if path starts with route (for nested routes)
  if (navItem.href !== "/" && currentPath.startsWith(`${navItem.href}/`)) {
    return true;
  }

  return false;
}
```

**Usage in PlatformNavNext.tsx:**
```typescript
import { NAV_ROUTES, isRouteActive } from "@/components/navigation/config/navRouteConfig";

function NavItems({
  items,
  closeOnSelect = false,
  shouldReduceMotion,
  pathname,
}: {
  items: NavItem[];
  closeOnSelect?: boolean;
  shouldReduceMotion: boolean;
  pathname: string;
}) {
  return (
    <m.ul className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
      {items.map((item) => {
        const isActive = isRouteActive(pathname, item); // SIMPLIFIED!
        // ... rest of component
      })}
    </m.ul>
  );
}

// In component:
const navItems = user ? NAV_ROUTES.authenticated : NAV_ROUTES.public;
```

---

## Quick Win #5: Add Component Subdirectories (30 mins)

**Current structure:**
```
src/components/workspace/
├── WorkspaceEditor.tsx
├── BusinessModelCanvas.tsx
├── CanvasField.tsx
├── BMCFieldDialog.tsx
├── DocumentManager.tsx
├── DocumentCard.tsx
├── DocumentGrid.tsx
├── ... 30+ more files
```

**New structure:**
```
src/components/workspace/
├── canvas/
│   ├── BusinessModelCanvas.tsx
│   ├── CanvasField.tsx
│   ├── BMCFieldDialog.tsx
│   └── index.ts (re-export)
├── documents/
│   ├── DocumentManager.tsx
│   ├── DocumentCard.tsx
│   ├── DocumentGrid.tsx
│   ├── DocumentDetailDrawer.tsx
│   └── index.ts (re-export)
├── publishing/
│   ├── WorkspaceSharePanel.tsx
│   ├── WorkspacePrivacyPanel.tsx
│   ├── PublishPreviewDialog.tsx
│   └── index.ts (re-export)
├── layout/
│   ├── WorkspaceEditor.tsx
│   ├── EditorLayout.tsx
│   ├── EditorHeader.tsx
│   └── index.ts
├── hooks/
│   ├── useEditorShortcuts.ts
│   ├── useEditorState.ts
│   └── useDocuments.ts
└── index.ts (main barrel export)
```

**Create index.ts files for re-exports:**
```typescript
// src/components/workspace/canvas/index.ts
export { BusinessModelCanvas } from "./BusinessModelCanvas";
export { CanvasField } from "./CanvasField";
export { BMCFieldDialog } from "./BMCFieldDialog";
```

**Update imports:**
```typescript
// Before
import { BusinessModelCanvas } from "@/components/workspace/BusinessModelCanvas";
import { CanvasField } from "@/components/workspace/CanvasField";

// After
import { BusinessModelCanvas, CanvasField } from "@/components/workspace/canvas";
```

---

## Quick Win #6: Export Motion Tokens in Semantic Layer (30 mins)

**Edit file:** `src/tokens/semantic/index.ts`

```typescript
// Add these lines at the end, before the type exports:

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTION TOKENS (Re-exported from primitives for convenience)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  DURATION,
  EASING,
  TRANSITION,
  DELAY,
  KEYFRAMES,
} from "../primitives/motion";
```

**Now developers can do:**
```typescript
// Before (had to dig into primitives)
import { DURATION } from "@/tokens/primitives/motion";

// After (everything in one place)
import { DURATION, BUTTON, CARD } from "@/tokens";
```

---

## Quick Win #7: Audit unified/ Imports (1 hour)

**Check file:** `src/components/unified/index.ts`

**Create a reference document:**

```typescript
// src/components/unified/EXPORTS.md
# Unified Component Exports

## All components available from @/components/unified:

### Buttons & Actions
- Button
- IconButton

### Layout
- Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
- Container
- Stack
- Grid

### Forms
- Input
- Textarea
- Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Checkbox
- RadioGroup
- Label

### Dialogs & Overlays
- Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
- Alert, AlertDescription, AlertTitle
- Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose
- Tooltip, TooltipContent, TooltipProvider, TooltipTrigger

### Navigation
- Tabs, TabsContent, TabsList, TabsTrigger
- Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
- Badge

### Status & Feedback
- Skeleton
- Spinner
- Progress

### NOT Available (use direct imports)
- Design tokens (use @/tokens instead)
- Motion components (use @/components/motion)
- Layout utilities (use @/components/layout)
```

**Then verify and document what's actually exported in the index.ts file.**

---

## Quick Win #8: Create Hooks Subdirectories (30 mins)

**Create structure:**
```
src/components/workspace/hooks/
├── useEditorShortcuts.ts (done in quick win #3)
├── useEditorState.ts (next)
├── useDocuments.ts (next)
└── index.ts (barrel export)
```

**Create barrel export:**
```typescript
// src/components/workspace/hooks/index.ts
export { useEditorShortcuts } from "./useEditorShortcuts";
export { useEditorState } from "./useEditorState";
export { useDocuments } from "./useDocuments";
// Add more as created
```

**Usage becomes cleaner:**
```typescript
// Before
import { useEditorShortcuts } from "@/components/workspace/hooks/useEditorShortcuts";
import { useEditorState } from "@/components/workspace/hooks/useEditorState";

// After
import { useEditorShortcuts, useEditorState } from "@/components/workspace/hooks";
```

---

## Summary: 6-Hour Impact

Implementing all 8 quick wins takes approximately 6 hours and delivers:

- Clearer directory structure
- Easier file discovery
- Better component organization
- More testable code (extracted hooks)
- Consolidated imports
- Foundation for larger refactors

Next steps after these wins:
1. Extract `useEditorState` hook for localStorage sync
2. Extract `useDocuments` hook for document CRUD
3. Create gallery filter hooks
4. Split DashboardScreen into sections

