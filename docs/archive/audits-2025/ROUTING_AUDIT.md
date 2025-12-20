# Routing Audit - Showcase vs Workspace

## Current State Analysis

### Entry Points to Project Creation

1. **Profile Page - "Create Project" button**
   - ✅ Opens `ProjectCreationModal`
   - ✅ Routes to `/showcase/new` or `/workspace/new` based on choice

2. **Navigation - "New Project" button** (`PlatformNavNext.tsx:188, 258`)
   - ⚠️ Routes directly to `/workspace/new`
   - **FIX NEEDED**: Should route to `/profile` or open modal

3. **Empty State - "Create your first project"** (`WorkspaceList.tsx:238`)
   - ⚠️ Routes directly to `/workspace/new`
   - **FIX NEEDED**: Should route to `/profile` or open modal

### Import Flows

4. **URL/GitHub Import** (`ProfileScreen.tsx:277-311`)
   - ⚠️ Creates workspace with `createWorkspace()` (no projectType set)
   - ⚠️ Routes to `/workspace/${workspace.code}`
   - **FIX NEEDED**: Should set `projectType: "showcase"` and route to `/showcase/${code}`

5. **File Import** (PDF/DOCX)
   - ⚠️ Same issue as URL import
   - **FIX NEEDED**: Same fix needed

6. **Batch Import** (`ProfileScreen.tsx:313+`)
   - ⚠️ Same issue - no projectType set
   - **FIX NEEDED**: Set `projectType: "showcase"`

### Project Navigation

7. **ProjectCard click** (`ProjectCard.tsx:79`)
   - Routes to `/project/${workspace.code}`
   - **DECISION NEEDED**: Should this check `projectType` and route accordingly?

8. **Direct workspace access**
   - `/project/[id]` → `ProjectWorkspaceScreen`
   - **FIX NEEDED**: Add smart routing based on projectType

## Recommended Routing Strategy

### Smart Routing Pattern

```
/project/[code] → Checks projectType:
  - If "showcase" → Redirect to /showcase/[code]
  - If "workspace" or undefined → Show ProjectWorkspaceScreen
```

### Routes Structure

```
/showcase/new           → ShowcaseNewScreen (simple form)
/showcase/[code]        → ShowcaseEditorScreen (profile editor) [TODO]
/workspace/new          → StudioNewScreen (full BMC form)
/project/[code]         → Smart router (redirects based on type)
/workspace/[code]       → Alias for /project/[code]? Or separate?
```

## Implementation Plan

### Phase 1: Fix Import Flows ✅ COMPLETE

- [x] Update `handleSingleImport` to set `projectType: "showcase"`
- [x] Update routing to `/showcase/${code}` after import
- [x] Update `handleBatchImport` similarly

### Phase 2: Create Showcase Editor ✅ COMPLETE

- [x] Create `/app/(studio)/showcase/[code]/page.tsx`
- [x] Create `ShowcaseEditorScreen` component
- [x] Build editable profile form with:
  - Pre-populated fields from workspace
  - Save functionality (updateWorkspace)
  - Publish/unpublish buttons
  - Gallery card preview sidebar

### Phase 3: Smart Routing ✅ COMPLETE

- [x] Update `ProjectWorkspaceScreen` to check projectType
- [x] Redirect showcase types to `/showcase/[code]` using router.replace
- [x] Keep workspace types in place (full BMC editor)

### Phase 4: Fix Navigation Entry Points ✅ COMPLETE

- [x] Update "New Project" in nav (desktop & mobile) to route to `/profile`
  - Updated PlatformNavNext.tsx lines 188 and 258
- [x] Update empty state to route to `/profile`
  - Updated WorkspaceList.tsx line 238

### Phase 5: Update ProjectCard ✅ DECIDED

- [x] Keep routing to `/project/${code}` (let smart router handle it)
  - ProjectCard.tsx:79 already routes to `/project/${code}`
  - Smart router in ProjectWorkspaceScreen redirects showcases automatically
  - No changes needed - clean separation of concerns

## Testing Checklist

- [ ] Manual showcase creation → `/showcase/new` → creates showcase → routes to editor
- [ ] Manual workspace creation → `/workspace/new` → creates workspace → routes to BMC
- [ ] URL import → creates showcase → routes to showcase editor
- [ ] GitHub import → creates showcase → routes to showcase editor
- [ ] File import → creates showcase → routes to showcase editor
- [ ] Batch import → creates showcases → stays on profile
- [ ] Click showcase card → routes to showcase editor
- [ ] Click workspace card → routes to BMC workspace
- [ ] Nav "New Project" → opens modal or routes to profile
- [ ] Empty state button → opens modal or routes to profile
