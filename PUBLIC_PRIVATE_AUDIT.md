# BUFFALO PROJECTS: PUBLIC VS PRIVATE WORKSPACE AUDIT REPORT

## Executive Summary

Buffalo Projects implements a **publish/unpublish architecture** for workspace visibility with:
- Private-by-default workspaces (isPublic: false at creation)
- One-way publish flow with URL-friendly slugs for public projects  
- Auth-gated community gallery (/dashboard/discover) for published projects
- SEO-optimized public project pages (/p/[slug]) 
- Peer exchange features (gives/asks) for community matching
- Class/student functionality infrastructure (defined but minimal implementation)

---

## 1. WORKSPACE VISIBILITY MODEL

### Current Architecture

**Privacy State Fields:**
```typescript
isPublic: boolean                  // Primary visibility flag
publishedAt?: number              // Timestamp when published (milliseconds)
slug?: string                      // URL-friendly identifier (auto-generated on publish)
```

**Location:** `/src/types/index.ts` (lines 143-388)

### Private Workspaces (isPublic: false)
- **Default state** for all new projects
- **Access:** Only owner can view/edit
- **Database:** Stored in `workspaces` collection
- **URLs:** `/edit/[code]` (authenticated editor only)
- **Visibility:** Not searchable, not discoverable

**Creation Flow:**
```typescript
// src/services/firebaseDatabase.ts:193
isPublic: false,  // Always false on creation
```

### Published Workspaces (isPublic: true)
- **Visibility:** Public within authenticated community
- **Access:** All authenticated users can view
- **Database:** Same `workspaces` collection + indexed by `isPublic`
- **URLs:** `/p/[slug]` (public but requires auth to comment)
- **Gallery:** Discoverable in `/dashboard/discover` with filtering
- **Analytics:** Tracked via views, appreciations, commentCount

**Publish Flow:**
```typescript
// src/services/firebaseDatabase.ts:525-599
async publishWorkspace(code: string): Promise<Workspace> {
  // 1. Generate slug from projectName (if not exists)
  const slug = previousSlug || withRandomSuffix(createSlug(projectName))
  
  // 2. Update workspace
  await updateDoc(workspaceRef, {
    isPublic: true,
    slug,
    publishedAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  })
  
  // 3. Return updated workspace
}
```

**Unpublish Flow:**
```typescript
// src/services/firebaseDatabase.ts:601-669
async unpublishWorkspace(code: string): Promise<Workspace> {
  transaction.update(workspaceRef, {
    isPublic: false,
    publishedAt: null,  // Clear timestamp
    lastModified: serverTimestamp(),
  })
}
```

### Key Differences

| Aspect | Private | Public |
|--------|---------|--------|
| **Visibility** | Owner only | All authenticated users |
| **URL** | `/edit/[code]` | `/p/[slug]` |
| **isPublic** | false | true |
| **slug** | undefined | auto-generated |
| **publishedAt** | undefined | number (milliseconds) |
| **Gallery** | Hidden | Discoverable |
| **Comments** | None | Enabled |
| **SEO** | None | Full schema.org |
| **Analytics** | None | views, appreciations, commentCount |

---

## 2. FIRESTORE SECURITY RULES

**Location:** `/firestore.rules` (lines 56-81)

### Access Control

```firestore
match /workspaces/{workspaceCode} {
  // Read: owner, collaborators, or public workspaces
  allow read: if hasWorkspaceAccess(resource.data);
  
  // List: anyone can query (filtered by isPublic in client)
  allow list: if request.query.limit <= 100;
  
  // Create: authenticated users only, must set themselves as owner
  allow create: if isAuthenticated() && 
                    request.auth.uid == request.resource.data.ownerId;
  
  // Update: only owner can modify
  allow update: if isAuthenticated() && 
                    resource.data.ownerId == request.auth.uid;
  
  // Delete: only owner
  allow delete: if isOwner(resource.data.ownerId);
}
```

**Helper Functions:**
```firestore
function hasWorkspaceAccess(workspace) {
  return isOwner(workspace.ownerId) ||
         workspace.isPublic == true ||
         isCollaborator(workspace.collaborators);
}

function isOwner(ownerId) {
  return isAuthenticated() && request.auth.uid == ownerId;
}
```

**Key Points:**
- Unauthenticated users can **read** public workspaces but **cannot create** or **update**
- All users can **list** workspaces (limit 100 per query)
- Only owner can update (publish/unpublish via `isPublic` field)
- Collaborators not yet implemented in rules (structure exists but commented)

---

## 3. PUBLISH/UNPUBLISH FLOW

### User-Facing Publish Flow

**Location:** `/src/components/workspace/QuickPublishPanel.tsx` (lines 1394-1428)

```typescript
const handlePublish = async () => {
  // 1. Save all form changes (basics, media, links, community, team)
  await handleSave(false)
  
  // 2. Call publishWorkspace from store
  await publishWorkspace(workspace.code)
  
  // 3. Show success toast
  toast.success("Project is now public!")
  
  // 4. Redirect to gallery
  window.location.href = "/gallery"
}
```

**Unpublish Flow (lines 1529-1567):**
```typescript
const handleUnpublish = async () => {
  try {
    await unpublishWorkspace(workspace.code)
    setIsPublic(false)
    toast.success("Project is now private")
  } catch (error) {
    toast.error("Failed to make project private")
  }
}
```

### Store-Level Publish/Unpublish

**Location:** `/src/stores/workspaceStore.ts` (lines 403-513)

```typescript
publishWorkspace: async (workspaceCode) => {
  // 1. Firebase update
  if (canUseFirebase) {
    updatedWorkspace = await firebaseDatabase.publishWorkspace(workspaceCode)
    localWorkspaceService.saveWorkspace(updatedWorkspace, { markForSync: false })
  } else {
    // Offline mode: manually set isPublic and slug
    const slug = generateLocalSlug(target)
    updatedWorkspace = {
      ...target,
      slug,
      isPublic: true,
      publishedAt: Date.now(),
      lastModified: now,
    }
  }
  
  // 2. Update store state
  set((state) => ({
    currentWorkspace: updatedWorkspace,
    workspaces: state.workspaces.map(w => 
      w.code === workspaceCode ? updatedWorkspace : w
    ),
  }))
}

unpublishWorkspace: async (workspaceCode) => {
  // Mirror logic but set isPublic: false and publishedAt: undefined
}
```

### Firebase Service Layer

**Location:** `/src/services/firebaseDatabase.ts` (lines 525-669)

- Uses **transaction** for unpublish (atomic updates)
- Uses **simple updateDoc** for publish (transaction not needed)
- Logs success/failure to console
- Reports failures to notificationService
- Validates ownership before publishing/unpublishing

---

## 4. GALLERY & DISCOVERY

### Community Gallery Screen

**Location:** `/app/(app)/dashboard/discover/components/GalleryScreen.tsx` (lines 1-150)

**Features:**
- Fetches public projects only: `isPublic: true`
- Server-side filtering: category, stage, location, tags
- Pagination with cursor support
- Sorting: recent, trending, popular, comments
- Matches calculation: user.asks → project.gives

**API Calls:**
```typescript
const result = await firebaseDatabase.getPublicWorkspacesPage({
  limit: 20,
  orderBy: sortBy === "recent" ? "publishedAt" : "lastModified",
  orderDirection: "desc",
  category: filters.category !== "all" ? filters.category : undefined,
  location: filters.location !== "all" ? filters.location : undefined,
  buffaloAffiliated: filters.location === "buffalo",
  startAfter: cursor,
})
```

**Stage Counts:**
```typescript
await firebaseDatabase.getPublicWorkspaceStageCounts([
  'idea', 'research', 'prototype', 'testing', 'launch-ready', 'launched'
])
```

### Gallery Store

**Location:** `/src/stores/galleryStore.ts` (lines 1-188)

```typescript
interface GalleryFilters {
  searchQuery: string
  category: ProjectCategory | "all"
  stages: ProjectStage[]
  location: "all" | "buffalo" | "remote"
  gives: string[]
  asks: string[]
}

type SortOption = "recent" | "trending" | "popular" | "comments"
```

**Matching Logic:**
```typescript
calculateMatches: (allProjects) => {
  const matches = allProjects
    .map((workspace) => {
      const matchedGives = (workspace.gives || []).filter((give) =>
        userAsks.some(
          (ask) => ask.toLowerCase().trim() === give.toLowerCase().trim(),
        ),
      )
      return {
        workspace,
        matchScore: matchedGives.length,
        matchedGives,
      }
    })
    .filter((match) => match.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}
```

### Public Project Page

**Location:** `/app/(public)/p/[slug]/page.tsx` + `PublicProjectDetailScreen.tsx`

**Features:**
- Server-side rendering (SSR) with cache
- SEO metadata generation
- Open Graph images
- Structured data (schema.org)
- View count tracking
- Comment section (auth-required)

**Metadata Generation:**
```typescript
const ogImageUrl = `${baseUrl}/api/og/${projectSlug}`

return {
  title: `${projectTitle} • Buffalo Projects`,
  description,
  openGraph: {
    title, description, url: projectUrl,
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
}
```

---

## 5. SHOWCASE FEATURES FOR PUBLIC PROJECTS

### Data Fields Available (from Workspace type)

**Media & Presentation:**
- `assets.coverImage` - Main hero image
- `assets.screenshots[]` - Up to 10 project images
- `embeds.youtube` - Demo video
- `embeds.demo` - Live site URL
- `embeds.github` - Repository link
- `embeds.website` - Marketing site
- `embeds.framer/figma/codepen` - Design embeds

**Project Information:**
- `projectName` - Title
- `oneLiner` - 120-char pitch
- `projectDescription` - Full description (rendered on public page)
- `problemStatement` - Problem being solved
- `stage` - Current phase (idea → launched)
- `category` - Classification (startup, design, research, indie, open-source, creative, other)
- `tags` - Topic tags for discovery
- `techStack` - Technologies used (structure exists but not used)

**Social & Team:**
- `creator` - Name from user profile
- `teamMembers[]` - { name, role, linkedin? }
- `socialLinks.twitter` - Project Twitter
- `socialLinks.linkedin` - Project LinkedIn
- `acknowledgments` - Free-form credits

**Community Exchange:**
- `gives[]` - What creator offers (e.g., "Product strategy", "Frontend dev")
- `asks[]` - What creator needs (e.g., "Feedback", "Beta testers")
- `lookingFor[]` - Legacy field (same as asks)

**Analytics:**
- `views` - Page view count
- `appreciations` - Like/heart count
- `commentCount` - Total comments

**Impact Metrics (currently unused):**
```typescript
users?: number           // Active users
revenue?: number         // Revenue in dollars
waitlistCount?: number   // Waitlist signups
```

### Published Project Indicators

**On Gallery Card:**
- Publish badge
- One-liner pitch
- Category badge
- Stage indicator
- Creator attribution
- Cover image
- Comment count
- View count (optional)

**On Public Detail Page:**
- Full description
- Problem statement
- Screenshots grid
- Video embeds
- Gives/asks badges
- Team members
- External links (demo, GitHub, website)
- Comment thread
- Share options

---

## 6. CLASS/STUDENT FUNCTIONALITY

### Current State: INFRASTRUCTURE ONLY

**Database Structure:**
```typescript
interface Workspace {
  classCode?: string  // Class this project belongs to
}
```

**Firestore Schema (firestore.rules, lines 83-115):**
```firestore
match /classes/{classCode} {
  allow read: if isAuthenticated() && (
    resource.data.ownerId == request.auth.uid ||
    request.auth.uid in resource.data.studentIds ||
    isTeacher(resource.data.teacherCode)
  )
  allow create, update, delete: if isAuthenticated() &&
    request.auth.uid == request.resource.data.ownerId
}

match /classes/{classCode}/assignments/{assignmentId} {
  // Students can read assignments in their class
  // Teacher can create/update/delete
}

match /submissions/{submissionId} {
  // Students can create own submissions
  // Teachers can grade
}

match /teachers/{teacherId} {
  allow read, write: if isAuthenticated() && 
    request.auth.uid == teacherId
}
```

**What EXISTS:**
- Database rules for classes, teachers, students, assignments, submissions
- `classCode` field in Workspace type
- `assignClassCode()` function in workspaceStore
- Type definitions for student/teacher relationships

**What's MISSING:**
- UI for assigning workspaces to classes
- Dashboard for teachers to view student submissions
- Student submission workflow
- Class management screens
- Assignment creation/grading UI
- Any client-side implementation

**Location:** 
- Rules: `/firestore.rules` (lines 83-142)
- Types: `/src/types/index.ts` (lines 191)
- Store: `/src/stores/workspaceStore.ts` (lines 776-816)

**Status:** DEFERRED TO '26 LAUNCH (per CLAUDE.md)

---

## 7. KEY FINDINGS & GAPS

### What Works Well

1. **Privacy Model:**
   - Simple, clear private-by-default approach
   - Proper ownership validation in Firestore rules
   - Atomic publish/unpublish with transactions

2. **Public Discovery:**
   - Auth-gated gallery prevents anonymous browsing
   - Comprehensive filtering (category, stage, location, gives/asks)
   - Paginated queries with cursor support

3. **SEO & Analytics:**
   - Structured data for search engines
   - View/comment/appreciation tracking
   - Public URLs with slugs instead of codes

4. **Peer Exchange:**
   - Gives/asks matching algorithm
   - Community-focused language
   - Foundation for peer collaboration

### Issues & Missing Features

1. **CRITICAL - Public Project Page (PARTIALLY BROKEN):**
   - Page exists (`/p/[slug]`) but renders with v2 components
   - Missing proper display of:
     - Gives/asks badges
     - Team members
     - Acknowledgments
     - All showcase metadata
   - See: `/app/(public)/p/[slug]/PublicProjectDetailScreen.tsx`
   - **Impact:** Published projects not showcasing full information

2. **Class/Student Features:**
   - Database rules defined but **zero UI implementation**
   - `classCode` field exists but never displayed/assigned
   - No teacher dashboard
   - No assignment submission workflow
   - Marked as deferred to '26 launch

3. **Give/Ask Matching:**
   - Calculated but **not displayed in results**
   - Only used for filtering, not ranking
   - No visual indication of "matches"
   - See: `/src/stores/galleryStore.ts:160-186`

4. **Incomplete Gallery Store:**
   - Has `give/asks` filters defined but client components don't expose them
   - Matching calculation exists but unused UI layer
   - See: `/src/stores/galleryStore.ts:13-14`

5. **Analytics Gaps:**
   - `users`, `revenue`, `waitlistCount` fields defined but never used
   - No dashboard to view own project analytics
   - View/comment/appreciation tracked but not displayed to creator

6. **Comments & Collaboration:**
   - Comments implemented but:
     - No mention notifications
     - No reply threads
     - No edit history
   - Structured but minimal

7. **Legacy Code:**
   - `projectType` field deprecated (showcase vs workspace distinction)
   - Still referenced in some places
   - Migration incomplete

---

## 8. DETAILED FILE LOCATIONS

### Core Publish/Unpublish Logic

| File | Lines | Purpose |
|------|-------|---------|
| `/src/services/firebaseDatabase.ts` | 525-669 | Firebase publish/unpublish methods |
| `/src/stores/workspaceStore.ts` | 403-513 | Store-level publish/unpublish actions |
| `/src/components/workspace/QuickPublishPanel.tsx` | 1394-1567 | UI for publish/unpublish flow |

### Visibility & Access Control

| File | Lines | Purpose |
|------|-------|---------|
| `/firestore.rules` | 56-81 | Read/write access rules |
| `/src/services/firebaseDatabase.ts` | 1890-1904 | `hasWorkspaceAccess()` helper |
| `/src/types/index.ts` | 166-305 | Workspace type definition |

### Gallery & Discovery

| File | Lines | Purpose |
|------|-------|---------|
| `/app/(app)/dashboard/discover/components/GalleryScreen.tsx` | 1-150 | Gallery UI and fetch logic |
| `/src/stores/galleryStore.ts` | 1-188 | Gallery state management |
| `/src/services/firebaseDatabase.ts` | 875-984 | `getPublicWorkspaces()` queries |

### Public Project Pages

| File | Lines | Purpose |
|------|-------|---------|
| `/app/(public)/p/[slug]/page.tsx` | 1-120 | Server-side rendering & metadata |
| `/app/(public)/p/[slug]/PublicProjectDetailScreen.tsx` | 1-141 | View tracking & SEO |
| `/src/components/projects/v2/ProjectDetailPage.tsx` | ? | Actual public page UI |
| `/app/api/og/[slug]` | ? | Open Graph image generation |

### Class/Student Infrastructure

| File | Lines | Purpose |
|------|-------|---------|
| `/firestore.rules` | 83-142 | Classes, teachers, students, assignments |
| `/src/types/index.ts` | 191 | `classCode?: string` |
| `/src/stores/workspaceStore.ts` | 776-816 | `assignClassCode()` action |

### Peer Exchange (Gives/Asks)

| File | Lines | Purpose |
|------|-------|---------|
| `/src/types/index.ts` | 231-372 | `gives[]`, `asks[]` definitions |
| `/src/stores/galleryStore.ts` | 160-186 | `calculateMatches()` algorithm |
| `/src/components/workspace/QuickPublishPanel.tsx` | 1022-1227 | UI for editing gives/asks |

---

## 9. RECOMMENDATIONS

### High Priority
1. **Fix public project page rendering** - Complete v2 component to show all fields
2. **Implement gallery matching UI** - Display matched projects prominently
3. **Add creator analytics dashboard** - Views, comments, appreciations per project

### Medium Priority  
4. **Class/student UI** - Wait for '26 launch but define requirements now
5. **Give/ask filtering** - Enable "find projects offering X" searches
6. **Comment notifications** - Ping creators when comments arrive
7. **Legacy migration** - Remove deprecated projectType field

### Low Priority
8. **Impact metrics** - Implement users/revenue/waitlist tracking
9. **Advanced SEO** - Breadcrumbs, FAQ schema, social sharing
10. **Accessibility** - Add ARIA labels to publish/unpublish controls

---

## 10. RELATED DOCUMENTATION

- `/CLAUDE.md` - Project vision and architecture
- `/FIRST_LAUNCH.md` - First launch scope (classes deferred to '26)
- `/PRIVACY_CHARTER.md` - Privacy-first principles
- `/MISSION.md` - Community ownership philosophy

---

**Report Generated:** 2025-11-20  
**Audit Scope:** Public/private workspace visibility, publish flow, gallery, showcase features, class functionality  
**Status:** Comprehensive audit complete
