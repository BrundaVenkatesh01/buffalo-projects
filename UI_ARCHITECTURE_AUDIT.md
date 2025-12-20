# Buffalo Projects UI/UX Architecture Audit

## Executive Summary

Buffalo Projects has a **functional but increasingly complex** UI/UX architecture with 30+ component directories and 38 workspace-specific components. The codebase shows good design system foundations but suffers from **component sprawl**, **unclear hierarchy**, and **nested component patterns** that make maintainability and feature development harder.

**Total Lines in Workspace Components:** 13,412 lines  
**Workspace Component Files:** 38 components  
**Design System Dirs:** 30+ component directories

---

## 1. DASHBOARD (app/(app)/dashboard/)

### Current Structure
- **File:** `/Users/laneyfraass/Buffalo-Projects/app/(app)/dashboard/page.tsx`
- **Imports:** `DashboardScreen` from `app/(studio)/profile/DashboardScreen`
- **Responsibility:** Router entry point only (minimal logic)

### Pain Points

1. **Cross-Directory Import Complexity**
   - Dashboard page delegates to legacy `(studio)` route, creating confusion
   - Route consolidation incomplete (both `/dashboard` and `/studio/profile` exist)
   - Should be direct but uses legacy re-export pattern

2. **DashboardScreen Component (260+ lines)**
   - Manages: user profile editing, project creation, import dialogs, filtering, sorting
   - Multiple state machines: `isEditing`, `showCreationModal`, `showURLImport`, `showBatchImport`, `showFileImport`, `twentySixDialogOpen`, GitHub connection
   - **Problem:** Single component managing too many concerns (profile, projects, imports)

3. **Missing Composition Pattern**
   - No clear separation between:
     - Profile section
     - Projects list section
     - Import controls
     - Filter/sort UI
   - All state lives in parent; child components receive props

### Opportunities for Simplification

- Extract `<ProfileSection>` (editing, stats, header)
- Extract `<ProjectsSection>` (list, grid toggle, empty state)
- Extract `<ImportToolbar>` (create, import buttons)
- Extract `<ProjectFilters>` (already exists but disconnected from state)
- Move dialog management to custom hooks (`useProfileEditor`, `useProjectCreation`)

**Recommended Pattern:**
```
DashboardScreen
├── ProfileSection (self-contained, own state)
├── ProjectsToolbar (filter, sort, view controls)
├── ProjectsList (infinite scroll, grid/list)
└── ImportModals (managed via context or custom hook)
```

---

## 2. EDITOR (app/(app)/edit/[code]/)

### Current Structure
- **File:** `/Users/laneyfraass/Buffalo-Projects/app/(app)/edit/[code]/UnifiedProjectEditor.tsx`
- **Lines:** 873 lines
- **Code-split Components:** 11 dynamic imports (ProjectOverview, BusinessModelCanvas, ProjectJourney, DocumentManager, VersionHistory, SharePanel, PrivacyPanel, QuickPublishPanel, WorkspaceContextPanel)

### Pain Points

1. **Massive State Management (18+ useState calls)**
   ```typescript
   - activeTab
   - saveStatus
   - isSnapshotDialogOpen
   - snapshotNote
   - isSnapshotSaving
   - isSidebarCollapsed
   - isVersionHistoryCollapsed
   - isFullScreen
   - isWorkspaceCollapsed
   - revealedSections
   - hasLoadedRevealState
   ```
   - Related state scattered across component
   - No cohesive state organization
   - localStorage syncing adds complexity

2. **Complex Keyboard Shortcut Handling**
   - Lines 373-417: 6 different keyboard shortcuts
   - Logic inline in useEffect
   - Hard to test, easy to break
   - No keyboard handler registry pattern

3. **Conditional Rendering Jungle**
   - Lines 707-758: 6 nested conditionals for tab content
   - Hard to trace which content renders when
   - Missing clear tab routing abstraction

4. **Dynamic Import Overhead**
   - 11 dynamic imports with custom loading states
   - Each has skeleton loader duplicated
   - If component loads slowly, UX suffers
   - No centralized dynamic import handler

5. **Mixed Concerns in Single Component**
   - Editor UI layout (sidebar, main, version history)
   - Autosave orchestration (useAutosave hook)
   - Snapshot management
   - Keyboard shortcuts
   - Full-screen mode
   - State persistence to localStorage

### Opportunities for Simplification

**Extract Core Modules:**

1. **EditorLayout Component** (layout, sidebars, responsive)
   ```
   EditorLayout
   ├── EditorSidebar (collapsed/expanded, sections)
   ├── EditorMain (active tab content)
   └── EditorVersionPanel (version history sidebar)
   ```

2. **EditorTabs System** (centralized tab routing)
   ```typescript
   const tabs: Record<WorkspaceTabId, TabConfig> = {
     basics: { component: ProjectOverview, label: "Overview" },
     canvas: { component: BusinessModelCanvas, label: "Canvas" },
     // ...
   };
   
   // In component:
   const TabComponent = tabs[activeTab].component;
   <TabComponent {...props} />
   ```

3. **EditorShortcuts Hook** (keyboard handling)
   ```typescript
   useEditorShortcuts({
     onToggleSidebar: () => setIsSidebarCollapsed(p => !p),
     onSave: handleManualSave,
     // ...
   });
   ```

4. **EditorState Hook** (localStorage syncing)
   ```typescript
   const [editorState, setEditorState] = useEditorState(workspaceId);
   // Handles: sidebar, tabs, fullscreen, revealed sections
   ```

5. **Create EditorHeader Component** (status bar, controls)
   - Move lines 621-673 out
   - Self-contained status display

**Recommended Structure:**
```
/edit/[code]/UnifiedProjectEditor.tsx (main orchestrator)
├── EditorLayout (layout structure)
│   ├── EditorSidebar
│   ├── EditorMain (renders current tab)
│   └── EditorVersionPanel
├── useEditorState (localStorage sync)
├── useEditorShortcuts (keyboard handling)
└── EditorTabs config

Plus new files:
- EditorLayout.tsx
- EditorSidebar.tsx
- EditorMain.tsx
- hooks/useEditorState.ts
- hooks/useEditorShortcuts.ts
- config/editorTabs.ts
```

---

## 3. GALLERY (app/(app)/dashboard/discover/)

### Current Structure
- **File:** `/Users/laneyfraass/Buffalo-Projects/app/(app)/dashboard/discover/components/GalleryScreen.tsx`
- **Lines:** 398 lines
- **Sub-components:** FilterBar, MatchesSection, ProjectCardGallery

### Pain Points

1. **Massive useCallback/useMemo Tree**
   - `fetchWorkspaces` callback (lines 45-109): 60+ lines
   - `filteredWorkspaces` memo (lines 185-277): 90+ lines  
   - `matches` memo (lines 280-285): Simple but creates dependency chasing
   - **Problem:** Hard to track what depends on what; filters feel tangled

2. **Client-Side Post-Processing of Server Data**
   - Fetches server-filtered results (category, location, pagination)
   - Then duplicates filters client-side (lines 185-250)
   - Search, stage, gives/asks filters run locally
   - **Problem:** Confusing dual-layer filtering; unclear which layer handles what

3. **Pagination Cursor Complexity**
   - `cursor` state + `hasMore` state + `loadingMore` state
   - IntersectionObserver pattern (lines 162-182)
   - Reset flow not obvious (lines 142-152)
   - **Problem:** Multiple state machines for pagination; easy to get into bad state

4. **Filter Sync Issues**
   - Gallery store filters not fully connected to local state
   - `prevFiltersRef` for change detection (not using Zustand effectively)
   - Risk of stale state between store and local

5. **No Clear Data Flow**
   - UI → Filters → Store → Server → Fetch → Merge → Filter → Memo → Render
   - Too many transformation steps
   - Hard to debug missing projects

### Opportunities for Simplification

**Create Clear Data Flow:**

1. **FilterConfig Hook** (centralize filter logic)
   ```typescript
   const {
     filters,
     setCategory,
     setLocation,
     setSearchQuery,
     // ...
   } = useGalleryFilters();
   ```

2. **PaginationState Hook** (encapsulate cursor + loading)
   ```typescript
   const {
     items: workspaces,
     loadMore,
     isLoading,
     hasMore,
     reset,
   } = usePaginatedFetch(serverFilters);
   ```

3. **FilteredResults Hook** (client-side filtering)
   ```typescript
   const filtered = useFilteredResults(workspaces, clientFilters);
   ```

4. **Separate Components**
   ```
   GalleryScreen
   ├── FilterBar (uses useGalleryFilters)
   ├── MatchesSection (memoized)
   ├── ProjectGrid (infinite scroll)
   │   └── uses usePaginatedFetch
   └── EmptyState
   ```

**Data Flow After Refactor:**
```
User Changes Filter → useGalleryFilters → Server Fetch → Reset Cursor
Server Returns Page → usePaginatedFetch → Append to List
User Scrolls Bottom → loadMore() → Fetch Next Page
Client-Side Filtering → useFilteredResults → Render Grid
```

---

## 4. NAVIGATION (src/components/navigation/)

### Current Structure
- **Files:**
  - `PlatformNavNext.tsx` (873 lines)
  - `MinimalNav.tsx`
  - `LandingNav.tsx`
  - `WorkspaceSidebar.tsx`
  - `Breadcrumbs.tsx`

### Pain Points

1. **PlatformNavNext is a Kitchen Sink (873 lines)**
   - Dynamic logo button (lines 173-183)
   - Desktop nav items (lines 185-191)
   - User menu area (lines 193-231)
   - Mobile sheet menu (lines 233-311)
   - Framer Motion animations (lines 3-47, 152-164)
   - Auth state logic (lines 125-149)

2. **Duplicated NavItems Rendering**
   - Separate `<NavItems>` component for desktop AND mobile
   - Same items rendered twice with different closeOnSelect prop
   - Props: `items`, `closeOnSelect`, `shouldReduceMotion`, `pathname`
   - Each item manually checks `isActive` state

3. **Fragile Route Matching**
   - Lines 81-86: Complex logic for "is dashboard active"
   - Special case: `/edit/*` routes count as dashboard
   - If routes change, must update three places
   - No centralized route configuration

4. **Motion Animation Complexity**
   - `listVariants` and `itemVariants` for stagger effect
   - `useReducedMotion` hook for accessibility
   - Conditional animation based on `shouldReduceMotion` (lines 75-76)
   - **Problem:** Animation logic scattered; hard to modify

5. **Auth State Mixed with UI**
   - Navigation changes based on `user` existence
   - Button render changes (lines 196-231)
   - User menu appears/disappears
   - No clear loading state

### Opportunities for Simplification

**Extract Components:**

1. **NavBrand Component** (logo + click handler)
2. **NavItems Component** (already exists, but keep it)
3. **NavUserSection Component** (user menu, notifications, signin button)
4. **NavMobileMenu Component** (sheet menu for mobile)
5. **NavDesktopMenu Component** (desktop nav items)

**Extract Utilities:**

1. **useNavRoutes Hook** (route matching logic)
   ```typescript
   const isActive = useNavRoutes(pathname);
   ```

2. **navRouteConfig** (centralized route list)
   ```typescript
   const NAV_ROUTES = {
     public: [
       { label: "Home", href: "/" },
       { label: "About", href: "/about" },
     ],
     authenticated: [
       { label: "Dashboard", href: "/dashboard", activePatterns: ["/dashboard", "/edit/*"] },
     ],
   };
   ```

**Refactored Structure:**
```
PlatformNavNext.tsx (simplified orchestrator, ~250 lines)
├── NavBrand.tsx (50 lines)
├── NavDesktopMenu.tsx (150 lines)
├── NavMobileMenu.tsx (150 lines)
├── NavUserSection.tsx (100 lines)
├── hooks/useNavRoutes.ts (50 lines)
└── config/navRouteConfig.ts (40 lines)
```

---

## 5. DESIGN TOKENS (src/tokens/)

### Current Structure
- **Files:**
  - `index.ts` - Main export hub
  - `brand.ts` - Buffalo brand colors
  - `primitives/` - Raw values (colors, spacing, typography, effects, motion)
  - `semantic/` - Context-aware tokens (colors, components, typography, project-page)

### Strengths

1. **Well-Organized Two-Tier Architecture**
   - Primitives: Raw values, not used directly
   - Semantic: Context-aware, for component usage
   - Clear distinction with documentation

2. **Comprehensive Coverage**
   - Colors, spacing, typography, effects
   - Component tokens (BUTTON, CARD, INPUT, BADGE, DIALOG)
   - Workspace-specific tokens (CANVAS_BLOCK, PIVOT, STAGE_COLORS)

3. **Buffalo Blue Consistent**
   - #0070f3 as primary throughout
   - Used in button hover, focus rings, canvas blocks

4. **Type Safety**
   - Exported types: ButtonVariant, ButtonSize, CardVariant, etc.
   - Full TypeScript support

### Pain Points

1. **Token Discovery Problem**
   - 13 primitive token files + 5 semantic files = many places to look
   - No token reference/documentation file
   - Developers unsure what tokens exist
   - Duplication risk when creating new tokens

2. **Component Tokens Not Comprehensive**
   - `BUTTON`, `CARD`, `INPUT`, `BADGE`, `DIALOG`, `TOOLTIP` defined
   - Missing: `SLIDER`, `PROGRESS`, `ACCORDION`, `TABS`, `SELECT`
   - Custom components fall back to hardcoded values

3. **Semantic Color Tokens Incomplete**
   - `TEXT.primary`, `TEXT.secondary` exist
   - Missing: `TEXT.success`, `TEXT.error`, `TEXT.warning` (exist in BADGE but not TEXT)
   - `BORDER.destructive`, `BORDER.success` missing
   - Developers invent their own color combos

4. **Motion Tokens Underutilized**
   - `DURATION`, `EASING`, `TRANSITION` defined in primitives
   - Not exported in semantic layer
   - Animation code uses hardcoded durations (e.g., "0.2s", "200ms")

5. **Token Value Duplication**
   - `COLOR_PRIMITIVES.buffalo[500]` used in multiple semantic tokens
   - If primary color changes, must update multiple places
   - No single source of truth for brand color

### Opportunities for Simplification

**1. Create Token Reference Documentation**
```typescript
// src/tokens/REFERENCE.md
# Token Reference

## Available Tokens
- BUTTON (primary, secondary, ghost, outline, destructive)
- CARD (default, elevated, interactive, glass)
- INPUT (default, sm, md, lg)
- BADGE (default, primary, success, warning, error)
- DIALOG, TOOLTIP
- TEXT, BACKGROUND, BORDER, ICON
- CANVAS_BLOCK, PIVOT, STAGE_COLORS, WORKSPACE_SURFACE

## Usage Examples
// ✅ Correct
import { BUTTON, CARD } from '@/tokens';

// ❌ Wrong
import { COLOR_PRIMITIVES } from '@/tokens/primitives';
```

**2. Extend Semantic Colors**
```typescript
// src/tokens/semantic/colors.ts
export const TEXT = {
  primary: ...,
  secondary: ...,
  muted: ...,
  success: COLOR_PRIMITIVES.green[400],
  warning: COLOR_PRIMITIVES.amber[400],
  error: COLOR_PRIMITIVES.red[400],
} as const;

export const BORDER = {
  default: ...,
  muted: ...,
  success: COLOR_PRIMITIVES.green[400],
  error: COLOR_PRIMITIVES.red[400],
} as const;
```

**3. Export Motion Tokens in Semantic Layer**
```typescript
// src/tokens/semantic/index.ts
export { DURATION, EASING, TRANSITION } from "../primitives/motion";
```

**4. Create Component Token Builder**
```typescript
// src/tokens/utils/componentTokenBuilder.ts
function createButtonToken(
  primaryColor: string,
  secondaryColor: string
) {
  return {
    primary: { background: { default: primaryColor } },
    secondary: { background: { default: secondaryColor } },
  };
}
```

---

## 6. WORKSPACE COMPONENTS (src/components/workspace/)

### Current Structure
- **38 Component Files, 13,412 Lines Total**

**Major Components:**
- WorkspaceEditor.tsx (873 lines) - Main orchestrator
- BusinessModelCanvas.tsx - Canvas grid
- DocumentManager.tsx - Document upload/management
- ProjectOverview.tsx - Project details overview
- ProjectJourney.tsx - Journey visualization
- VersionHistory.tsx - Version timeline
- WorkspaceContextPanel.tsx - Left sidebar (tabs, etc)
- WorkspaceSharePanel.tsx - Publishing controls
- WorkspacePrivacyPanel.tsx - Privacy settings

**Supporting Components (30+):**
- WorkspaceCard, WorkspaceList, WorkspaceTabs
- CanvasField, BMCFieldDialog
- DocumentCard, DocumentGrid, DocumentDetailDrawer
- EvidenceLinkingModal, ShareDialog
- StageProgressBar, WorkspaceProgress
- QuickAddProject, QuickPublishPanel
- Various smaller utilities

### Pain Points

1. **Component Count Explosion**
   - 38 workspace components in single directory
   - No clear organization (flat structure)
   - Hard to find specific component
   - No clear parent-child relationships
   - Test files mixed with component files

2. **Deep Nesting Issues**
   ```
   WorkspaceEditor
   └── WorkspaceContextPanel
       └── WorkspaceTabs (choosing active tab)
           └── [Tab Content] (Overview, Canvas, Journey, etc)
               └── Various nested dialogs/modals
   ```
   - Props drilling 3-4 levels deep
   - State updates require callback chains

3. **Missing Container/Presentational Pattern**
   - Most components handle their own state + rendering
   - Example: DocumentManager handles fetch, filter, display all together
   - Hard to test; hard to reuse

4. **Dialog/Modal Management Scattered**
   - `EvidenceLinkingModal`, `ShareDialog`, `BMCFieldDialog`
   - Each manages own open/close state
   - No centralized dialog registry
   - Multiple modals can interfere with each other

5. **Inconsistent Document Handling**
   - `DocumentManager` (upload + list)
   - `DocumentCard` (single doc card)
   - `DocumentGrid` (grid layout)
   - `DocumentDetailDrawer` (detail view)
   - `DocumentCard.test.tsx`, `DocumentManager.test.tsx`, `DocumentManager.online.test.tsx`
   - Unclear which components use which; test duplication

### Opportunities for Simplification

**1. Organize by Feature, Not Type**
```
src/components/workspace/
├── canvas/
│   ├── BusinessModelCanvas.tsx
│   ├── CanvasField.tsx
│   ├── BMCFieldDialog.tsx
│   └── useCanvasState.ts
├── documents/
│   ├── DocumentManager.tsx
│   ├── DocumentCard.tsx
│   ├── DocumentGrid.tsx
│   ├── DocumentDetailDrawer.tsx
│   └── hooks/useDocuments.ts
├── publishing/
│   ├── WorkspaceSharePanel.tsx
│   ├── WorkspacePrivacyPanel.tsx
│   ├── PublishPreviewDialog.tsx
│   └── hooks/usePublishing.ts
├── layout/
│   ├── WorkspaceEditor.tsx
│   ├── WorkspaceContextPanel.tsx
│   ├── WorkspaceSidebar.tsx (move here)
│   ├── WorkspaceTabs.tsx
│   └── EditorLayout.tsx (new)
├── details/
│   ├── ProjectOverview.tsx
│   ├── ProjectDetailView.tsx
│   ├── ProjectDetailHeader.tsx
│   └── ProjectJourney.tsx
├── common/
│   ├── WorkspaceCard.tsx
│   ├── WorkspaceList.tsx
│   ├── WorkspaceProgress.tsx
│   ├── StageProgressBar.tsx
│   └── PrivacyIndicator.tsx
└── hooks/
    ├── useWorkspaceState.ts
    ├── useAutosave.ts
    └── useDocuments.ts
```

**2. Extract Custom Hooks**
```typescript
// src/components/workspace/hooks/useCanvasState.ts
export function useCanvasState(workspaceId: string) {
  // Manage canvas-specific state
  // Return: {canvasData, updateBlock, addBlock, ...}
}

// src/components/workspace/hooks/useDocuments.ts
export function useDocuments(workspaceId: string) {
  // Manage documents, uploads, linking
  // Return: {documents, upload, delete, link, ...}
}

// src/components/workspace/hooks/usePublishingState.ts
export function usePublishingState(workspace: Workspace) {
  // Manage publishing workflow
  // Return: {isPublished, publish, unpublish, ...}
}
```

**3. Create Context for Deep Props Drilling**
```typescript
// src/components/workspace/WorkspaceContext.tsx
export const WorkspaceContext = createContext<{
  workspace: Workspace;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  saveWorkspace: () => Promise<void>;
  activeTab: WorkspaceTabId;
  setActiveTab: (tab: WorkspaceTabId) => void;
} | null>(null);

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("Must use inside WorkspaceProvider");
  return ctx;
}
```

**4. Centralize Dialog Management**
```typescript
// src/components/workspace/DialogManager.tsx
export function useDialogs() {
  const [openDialogs, setOpenDialogs] = useState<Set<DialogKey>>(new Set());
  
  return {
    open: (key: DialogKey) => setOpenDialogs(p => new Set([...p, key])),
    close: (key: DialogKey) => setOpenDialogs(p => new Set([...p].filter(k => k !== key))),
    isOpen: (key: DialogKey) => openDialogs.has(key),
  };
}
```

**5. Split DocumentManager into Concerns**
```
documents/
├── DocumentManager.tsx (orchestrator only)
├── DocumentUploadZone.tsx (upload UI)
├── DocumentList.tsx (list + filter)
├── DocumentDetailDrawer.tsx (detail view)
└── hooks/useDocuments.ts (logic)
```

---

## 7. COMPONENT DIRECTORIES ANALYSIS

### Current Structure (30+ directories)
```
src/components/
├── animations/ - Legacy animations
├── auth/ - Auth forms, sign in/up
├── buffalo/ - Custom Buffalo components (StatCard, etc)
├── comments/ - Comment threads
├── common/ - Shared utilities
├── design-system/ - Design system docs/demos
├── graphics/ - SVG graphics, illustrations
├── import/ - Import workflow UI
├── landing/ - Landing page components
├── layout/ - Layout wrappers (Stack, Grid)
├── mentor/ - Mentor features (deferred)
├── motion/ - Animation components
├── navigation/ - Navigation bars, menus
├── notifications/ - Notification UI
├── openai/ - OpenAI integration (legacy?)
├── pages/ - Page-level components
├── projects/ - Project display components
├── status/ - Status indicators
├── timeline/ - Timeline visualizations
├── tools/ - Tool components
├── ui/ - shadcn/ui base components
├── ui-next/ - Buffalo-styled UI components
├── unified/ - Single import point for UI
├── updates/ - Update notifications
├── waitlist/ - Waitlist forms
├── welcome/ - Onboarding flows
├── workspace/ - Workspace/editor components
└── yc/ - Y Combinator specific (deferred)
```

### Pain Points

1. **Too Many Directories**
   - Unclear organization taxonomy
   - `buffalo/`, `ui-next/`, `unified/` overlap in purpose
   - `animations/`, `motion/`, `graphics/` similar concepts
   - `tools/`, `pages/`, `common/` unclear distinctions

2. **Deferred Features Taking Up Space**
   - `mentor/` - Deferred to '26
   - `yc/` - Deferred/unused
   - `openai/` - Legacy/replaced by Gemini
   - `waitlist/` - No longer used
   - Total: ~4 directories worth of dead code

3. **Missing Organization by Feature**
   - Should have: `dashboard/`, `editor/`, `gallery/`, `auth/`
   - Currently scattered across workspace/, projects/, pages/, etc.

4. **Import Confusion**
   - Components available from: `unified/`, `ui/`, `ui-next/`, `buffalo/`
   - Which to import from? Documentation unclear
   - Leads to developers picking "wrong" barrel import

### Opportunities for Simplification

**Reorganize to Feature-First:**
```
src/components/
├── 🎯 Core Design System
│   ├── ui/ (shadcn/ui base components - keep as is)
│   ├── tokens.ts (design system exports)
│   └── unified.ts (single import point)
│
├── 🏠 Feature Modules
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx
│   │   ├── ProjectsList.tsx
│   │   ├── ProfileSection.tsx
│   │   ├── ImportToolbar.tsx
│   │   └── hooks/
│   ├── editor/
│   │   ├── UnifiedProjectEditor.tsx
│   │   ├── EditorLayout.tsx
│   │   ├── EditorSidebar.tsx
│   │   ├── canvas/
│   │   ├── documents/
│   │   ├── publishing/
│   │   └── hooks/
│   ├── gallery/
│   │   ├── GalleryScreen.tsx
│   │   ├── FilterBar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MatchesSection.tsx
│   │   └── hooks/
│   ├── auth/
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── JoinScreen.tsx
│   │   └── hooks/
│   └── public/
│       ├── LandingPage.tsx
│       ├── ProjectPage.tsx
│       ├── AboutPage.tsx
│       └── components/
│
├── 🎨 Shared UI Patterns
│   ├── layout/ (Stack, Grid, Container)
│   ├── motion/ (animated components)
│   ├── status/ (badges, indicators)
│   ├── common/ (generic utilities)
│   └── navigation/ (nav components)
│
└── 🚮 Remove / Defer
    ├── animations/ (move to motion/)
    ├── openai/ (remove - replaced by gemini)
    ├── mentor/ (defer to '26)
    ├── yc/ (remove or archive)
    └── waitlist/ (remove)
```

---

## 8. IMPORT ORGANIZATION

### Current State
- **Confusion Points:**
  - `@/components/unified` - Single import point (but what's actually there?)
  - `@/components/buffalo` - Buffalo-specific components
  - `@/components/ui-next` - Enhanced UI components
  - `@/components/ui` - shadcn/ui base
  - Developers unsure which to import from

### Unified Component Strategy
```typescript
// ❌ BAD - Scattered imports
import { Button } from "@/components/ui-next/Button";
import { Card } from "@/components/buffalo/Card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui-next/Input";

// ✅ GOOD - Single import point
import { Button, Card, Dialog, Input } from "@/components/unified";

// Should be one barrel export with clear organization:
// src/components/unified/index.ts
export { Button } from "@/components/ui-next/Button";
export { Card } from "@/components/buffalo/Card";
export { Dialog } from "@/components/ui/dialog";
export { Input } from "@/components/ui-next/Input";
export { Badge, Tooltip, Skeleton } from "@/components/ui/...";
```

---

## 9. STATE MANAGEMENT PATTERNS

### Current Approach
- **Zustand Stores:**
  - `authStore` - User auth state
  - `workspaceStore` - Workspace data, canvas, versions
  - `galleryStore` - Gallery filters, search
  - `groupStore` - Group membership (deferred)

- **Local State (useState):**
  - Heavy use in `DashboardScreen`, `UnifiedProjectEditor`, `GalleryScreen`
  - Mixed local + store patterns create confusion

### Pain Points
1. Zustand stores have complex multi-step operations (persist, middleware)
2. No clear pattern for when to use store vs. local state
3. localStorage sync logic scattered
4. No error boundary integration

### Simplification Opportunity
Create state management documentation:
```typescript
// When to use what:

// ✅ ZUSTAND (Global/Persistent)
- User profile (authStore)
- Workspace data (workspaceStore)
- Gallery filters (galleryStore)
- Feature flags

// ✅ REACT STATE (Local/Temporary)
- Form inputs
- Modal open/close states
- UI transient state (animations, tooltips)
- Component-specific view state

// ✅ CUSTOM HOOKS (Logic Encapsulation)
- useAutosave() - Orchestrate save logic
- useEditorShortcuts() - Keyboard handling
- useDocuments() - Document CRUD
- usePaginatedFetch() - Infinite scroll logic
```

---

## SUMMARY TABLE

| Area | Files | Lines | Pain Level | Complexity |
|------|-------|-------|------------|-----------|
| Dashboard | 1 root + 10 components | 260+ | 🔴 High | State sprawl |
| Editor | 1 root + 11 dynamic | 873 | 🔴 High | Massive component |
| Gallery | 1 root + 3 sub | 398 | 🟡 Medium | Filter/fetch logic |
| Navigation | 5 files | 873 | 🟡 Medium | PlatformNavNext bloated |
| Workspace | 38 components | 13,412 | 🔴 High | Component explosion |
| Design Tokens | 13 files | ~1,500 | 🟢 Low | Well organized |
| Component Dirs | 30+ directories | ~25,000 | 🔴 High | Too many, unclear taxonomy |

---

## RECOMMENDATIONS (Priority Order)

### Phase 1: High-Impact Simplifications (1-2 weeks)
1. **Refactor WorkspaceEditor** - Split into layout/tabs/hooks
2. **Reorganize workspace/ directory** - By feature, not type
3. **Extract custom hooks** - useEditorState, useEditorShortcuts, useDocuments
4. **Simplify PlatformNav** - Extract NavBrand, NavMobileMenu, NavUserSection
5. **Create navigation utilities** - useNavRoutes, navRouteConfig

### Phase 2: Design System & Patterns (1 week)
1. **Document design tokens** - Create REFERENCE.md
2. **Extend semantic tokens** - Add missing colors, motion, component tokens
3. **Fix unified imports** - Audit what's actually exported
4. **Create state management guide** - When to use store vs. local
5. **Add keyboard shortcut registry** - Pattern for all shortcuts

### Phase 3: Long-Term Cleanup (2-3 weeks)
1. **Reorganize component directories** - Feature-first structure
2. **Remove dead code** - mentor/, yc/, waitlist/, openai/
3. **Consolidate dashboard** - Extract ProfileSection, ProjectsSection
4. **Improve gallery filters** - Custom hooks for data flow
5. **Centralize dialog management** - useDialogs() pattern

### Phase 4: Testing & Documentation (ongoing)
1. Write tests for extracted hooks
2. Document component composition patterns
3. Create component library showcase
4. Update CLAUDE.md with new patterns

---

## Quick Wins (Can Do Immediately)

1. **Move Workspace Sidebar** to proper navigation/ directory
2. **Extract EditorHeader component** from WorkspaceEditor
3. **Create useEditorShortcuts hook** to replace inline keyboard handlers
4. **Create navRouteConfig.ts** to centralize route matching
5. **Add component subdirectories** (canvas/, documents/) in workspace/
6. **Export motion tokens** in semantic layer
7. **Audit unified/ imports** - Document what's exported
8. **Create hooks subdirectories** (workspace/hooks/, dashboard/hooks/)

---

## Files for Deep Dive (If Continuing Audit)

High-Priority for Understanding Current State:
- `/Users/laneyfraass/Buffalo-Projects/src/components/workspace/WorkspaceContextPanel.tsx` - Left sidebar logic
- `/Users/laneyfraass/Buffalo-Projects/src/components/workspace/BusinessModelCanvas.tsx` - Canvas implementation
- `/Users/laneyfraass/Buffalo-Projects/src/stores/workspaceStore.ts` - State management
- `/Users/laneyfraass/Buffalo-Projects/app/(studio)/profile/DashboardScreen.tsx` - Full dashboard code

