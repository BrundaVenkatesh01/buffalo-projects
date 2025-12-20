# Buffalo Projects - New Features Implementation Guide

**Created:** November 7, 2025
**Status:** Ready for Integration
**Components:** Import Dialog, Three-Panel Workspace Layout, Design Tokens

---

## 🎉 What We Built

### ✅ Phase 1: Design System Foundation

- **Design Tokens** (`src/lib/tokens.ts`)
  - Comprehensive spacing, typography, layout, border, shadow, and color tokens
  - Exported through unified design system (`@/components/unified`)
  - Eliminates magic numbers and ensures visual consistency

### ✅ Phase 2: Project Import System

- **Import Service** (`src/services/importService.ts`)
  - Import from images (JPG, PNG), text files, JSON
  - AI-powered extraction using Gemini Vision API
  - Confidence scoring and validation

- **API Routes**
  - `/api/ai/analyze-image` - Gemini Vision integration
  - Rate limiting: 5 requests/minute for images
  - Proper error handling and safety filters

- **UI Components** (`src/components/import/`)
  - `ImportDialog` - Main orchestrator
  - `ImportUploadStep` - Drag-and-drop file upload
  - `ImportProcessingStep` - AI extraction progress
  - `ImportReviewStep` - Edit extracted data

### ✅ Phase 3: Three-Panel Workspace Layout

- **WorkspaceContextPanel** - Left sidebar with project info and navigation
- **WorkspaceAssistPanel** - Right sidebar with context-aware help
- Modern, collapsible design using new design tokens

---

## 🚀 Quick Start Integration

### 1. Add Import to Workspace Shelf

Update `/app/(studio)/studio/screen.tsx`:

```typescript
"use client";

import { useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import { ImportDialog } from "@/components/import";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { ImportResult } from "@/services/importService";

export function StudioShelfScreen() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);

  const handleImportComplete = async (result: ImportResult) => {
    try {
      // Create workspace with imported data
      const workspace = await createWorkspace({
        projectName: result.projectName,
        description: result.description,
        oneLiner: result.oneLiner,
        stage: result.stage,
        tags: result.tags,
        bmcData: result.bmcData,
      });

      if (workspace?.code) {
        router.push(`/workspace/${workspace.code}`);
      }
    } catch (error) {
      console.error("Failed to create workspace from import:", error);
      toast.error("Failed to create workspace");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16">
      {/* Header with Import Button */}
      <header className="flex items-center justify-between">
        <h1>Personal Shelf</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowImportDialog(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Project
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </header>

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />

      {/* Rest of component... */}
    </div>
  );
}
```

### 2. Enable New Workspace Layout (Optional)

You can switch to the new three-panel layout or keep both as an option:

**Option A: Feature Flag Approach**

Add to `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_NEW_WORKSPACE_LAYOUT=true
```

Then in `WorkspaceEditor.tsx`:

```typescript
import { WorkspaceContextPanel } from "@/components/workspace/WorkspaceContextPanel";
import { WorkspaceAssistPanel } from "@/components/workspace/WorkspaceAssistPanel";

const useNewLayout = process.env.NEXT_PUBLIC_ENABLE_NEW_WORKSPACE_LAYOUT === "true";

export function WorkspaceEditor({ workspaceId }: WorkspaceEditorProps) {
  // ... existing code ...

  return (
    <div className="flex min-h-screen">
      {/* Context Panel (Left) */}
      {currentWorkspace && !showLoadingState && (
        <>
          {useNewLayout ? (
            <WorkspaceContextPanel
              workspace={currentWorkspace}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSnapshotClick={() => setSnapshotDialogOpen(true)}
              onSaveClick={handleManualSave}
              isSaving={isSaving}
            />
          ) : (
            <WorkspaceSidebar /* existing sidebar */ />
          )}
        </>
      )}

      {/* Main Content Area */}
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: currentWorkspace && !showLoadingState ? "18rem" : "0",
          marginRight: useNewLayout ? "24rem" : "0", // Make room for assist panel
        }}
      >
        {/* Existing content... */}
      </div>

      {/* Assist Panel (Right) - New Layout Only */}
      {useNewLayout && currentWorkspace && !showLoadingState && (
        <WorkspaceAssistPanel
          workspace={currentWorkspace}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
```

**Option B: Replace Immediately**

Simply replace `WorkspaceSidebar` with `WorkspaceContextPanel` and add `WorkspaceAssistPanel`.

---

## 📚 Using Design Tokens

### Before (Magic Numbers):

```typescript
<div className="gap-6 p-4 rounded-xl border border-white/10 bg-white/5">
  <h2 className="text-xl font-semibold text-foreground mb-2">
    Title
  </h2>
  <p className="text-sm text-muted-foreground leading-6">
    Content
  </p>
</div>
```

### After (Design Tokens):

```typescript
import { SPACING, PADDING, RADIUS, BORDER, BACKGROUND, TYPOGRAPHY } from "@/components/unified";

<div className={cn(SPACING.lg, PADDING.md, RADIUS.lg, BORDER.default, BACKGROUND.elevated)}>
  <h2 className={cn(TYPOGRAPHY.heading.lg, "mb-2")}>
    Title
  </h2>
  <p className={cn(TYPOGRAPHY.muted.md)}>
    Content
  </p>
</div>
```

**Benefits:**

- Consistent spacing across all components
- Easy to update globally
- Self-documenting code
- TypeScript autocomplete support

---

## 🎨 Component Examples

### Using Import Dialog Standalone

```typescript
import { ImportDialog } from "@/components/import";

function MyComponent() {
  const [open, setOpen] = useState(false);

  const handleImport = (result: ImportResult) => {
    console.log("Imported project:", result);
    // Do something with the imported data
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Import Project</Button>
      <ImportDialog
        open={open}
        onOpenChange={setOpen}
        onImportComplete={handleImport}
      />
    </>
  );
}
```

### Using Design Tokens for Custom Cards

```typescript
import { PATTERNS, TYPOGRAPHY } from "@/components/unified";

function CustomCard() {
  return (
    <div className={PATTERNS.cardInteractive}>
      <h3 className={TYPOGRAPHY.heading.md}>Card Title</h3>
      <p className={TYPOGRAPHY.muted.md}>Card description</p>
    </div>
  );
}
```

---

## 🔧 Configuration

### Required Environment Variables

Already configured in your project:

```bash
# Gemini AI (for import feature)
NEXT_PUBLIC_GEMINI_API_KEY=your_key

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

### Optional Configuration

```bash
# Enable new workspace layout
NEXT_PUBLIC_ENABLE_NEW_WORKSPACE_LAYOUT=true

# Disable import feature temporarily
NEXT_PUBLIC_ENABLE_IMPORT=false
```

---

## 🧪 Testing

### Test Import Flow

1. **Upload an Image**:
   - Use a Business Model Canvas screenshot
   - Test drag-and-drop
   - Test file picker

2. **Paste Text**:
   - Copy a pitch or business description
   - Test AI extraction quality
   - Review confidence scores

3. **Edit Extracted Data**:
   - Modify project name, description
   - Edit BMC fields
   - Add/remove tags

4. **Create Workspace**:
   - Verify all data transfers correctly
   - Check that workspace opens with pre-filled data

### Test New Layout

1. **Collapse/Expand Panels**:
   - Test context panel collapse
   - Verify icons show in collapsed state
   - Check tooltips

2. **Context-Aware Assist**:
   - Navigate between tabs
   - Verify assist panel content changes
   - Test checklist items

3. **Responsive Behavior**:
   - Test on different screen sizes
   - Verify mobile/tablet experience

---

## 📝 Type Definitions

### ImportResult

```typescript
interface ImportResult {
  projectName: string;
  description?: string;
  oneLiner?: string;
  stage?: "idea" | "building" | "testing" | "launched";
  tags: string[];
  bmcData: Partial<CanvasState>;
  confidence: number; // 0-1
  extractedFields: string[];
  warnings: string[];
  suggestions: string[];
  originalFile?: File;
  originalText?: string;
}
```

### ProcessingStage

```typescript
interface ProcessingStage {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete" | "error";
  message?: string;
}
```

---

## 🐛 Troubleshooting

### Import Not Working

**Problem**: "AI service not configured" error
**Solution**: Verify `NEXT_PUBLIC_GEMINI_API_KEY` or `GEMINI_API_KEY` is set

**Problem**: Rate limit errors
**Solution**: Check Upstash Redis credentials, or wait 1 minute

**Problem**: Image analysis fails
**Solution**: Ensure image is < 4MB and supported format (JPG, PNG, WEBP)

### Layout Issues

**Problem**: Panels overlap on small screens
**Solution**: Add responsive classes to hide assist panel on mobile:

```typescript
<WorkspaceAssistPanel
  className="hidden lg:flex" // Hide on mobile/tablet
  workspace={workspace}
  activeTab={activeTab}
/>
```

**Problem**: Content pushed off-screen
**Solution**: Adjust `marginLeft` and `marginRight` based on panel widths

---

## 🎯 Next Steps

### Immediate (Ready to Use):

1. ✅ Add Import button to workspace shelf
2. ✅ Test import flow with real data
3. ✅ Enable new layout with feature flag

### Short-term (1-2 weeks):

1. Gather user feedback on import quality
2. A/B test new layout vs. old layout
3. Add import analytics tracking

### Long-term (Future):

1. PDF import support (requires pdf.js integration)
2. URL import (Miro boards, Google Docs)
3. Bulk import for educators
4. Import from competitors (Lean Canvas tools, etc.)

---

## 📖 Additional Resources

- **Design Tokens Reference**: `src/lib/tokens.ts`
- **Import Service API**: `src/services/importService.ts`
- **Gemini Service**: `src/services/geminiService.ts`
- **Component Examples**: `src/components/import/` and `src/components/workspace/`

---

## 🙋 Support

If you encounter issues:

1. Check this guide first
2. Review error messages in browser console
3. Check API route responses in Network tab
4. Verify environment variables are set

**Created with ❤️ for Buffalo entrepreneurs** 🦬

---

**Version**: 1.0.0
**Last Updated**: November 7, 2025
**Compatibility**: Next.js 15.1.3, React 18.3.1
