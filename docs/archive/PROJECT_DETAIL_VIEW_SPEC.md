# Project Detail View - Technical Specification

**Last Updated**: January 2025
**Status**: Design Spec - Ready for Implementation
**Priority**: Critical (Missing piece for import flow)

---

## Problem Statement

**Current Gap:**

- Users import GitHub repos or URLs → creates project data
- Clicking imported project card → goes nowhere (no detail view)
- Only option is workspace editor (too heavyweight for portfolio items)

**User Confusion:**

- "I imported 5 projects, now what?"
- "How do I view my GitHub project details?"
- "Can I share this without making a full workspace?"

**Solution:**
Create a dedicated Project Detail View that serves as:

1. Landing page for imported projects (portfolio items)
2. Overview page for workspace projects (quick preview)
3. Decision point: "Upgrade to workspace" or "Keep as portfolio item"
4. Shareable page (pre-gallery, can share link to friends)

---

## User Flows

### Flow 1: View Imported GitHub Project

```
Profile → Click GitHub project card →
Project Detail View (read-only) →
Options: [Upgrade to Workspace] [Edit Metadata] [View on GitHub]
```

### Flow 2: View Workspace Project

```
Profile → Click workspace project card →
Project Detail View (overview) →
Options: [Open Workspace] [Mark Public] [Share Link]
```

### Flow 3: Upgrade Imported Project

```
Project Detail View (imported) →
Click "Upgrade to Workspace" →
Confirmation modal →
Creates workspace with pre-filled data →
Redirects to workspace editor
```

### Flow 4: Share Project (Pre-Gallery)

```
Project Detail View →
Click "Share Link" →
Copy unlisted URL: /profile/project/[id]?preview=true →
Recipient views (no auth required) →
"Join Buffalo to create your own" CTA
```

---

## Route Structure

### Primary Route

```
/profile/project/[id]
```

**When to use:**

- Owner viewing their own project (authenticated)
- Determines project type (imported vs workspace) automatically
- Shows appropriate actions based on type

### Unlisted Preview (Pre-Gallery)

```
/profile/project/[id]?preview=true
```

**When to use:**

- Shareable link before gallery launches
- No authentication required
- Limited actions (can't edit, just view)
- CTA to "Create your own project on Buffalo"

### Future Public Route (Post-'26)

```
/p/[slug]
```

**When gallery launches:**

- Public, SEO-indexed project pages
- Replaces unlisted preview links
- Full community features (comments, likes, etc.)

---

## Data Model

### Project Types

**Type 1: Imported Project**

```typescript
{
  id: string;
  type: "imported";
  source: "github" | "url" | "manual";

  // Basic metadata
  name: string;
  description: string;
  oneLiner?: string;

  // Source-specific data
  githubUrl?: string;
  githubStats?: {
    stars: number;
    forks: number;
    language: string;
    lastUpdated: string;
  };
  liveUrl?: string;

  // Portfolio metadata
  techStack: string[];
  category?: string;
  stage?: ProjectStage;
  createdAt: string;
  lastModified: string;

  // Workspace upgrade tracking
  canUpgradeToWorkspace: boolean;
  workspaceId?: string; // If already upgraded
}
```

**Type 2: Workspace Project**

```typescript
{
  id: string;
  type: "workspace";
  workspaceCode: string; // BUF-XXXX

  // Full workspace data
  // (extends existing Workspace type)

  // Computed stats for overview
  completion: {
    canvasBlocks: number; // 7/9
    evidenceDocuments: number;
    versionsCount: number;
    lastEdited: string;
  }

  publishStatus: "private" | "public-when-available" | "public";
}
```

---

## Component Hierarchy

```
app/profile/project/[id]/
├── page.tsx                    // Server component, fetches project
└── ProjectDetailScreen.tsx     // Client component, renders based on type
    ├── ImportedProjectView.tsx
    │   ├── ProjectHeader.tsx
    │   ├── SourceMetadata.tsx  // GitHub stats, URL info
    │   ├── TechStackDisplay.tsx
    │   ├── ProjectActions.tsx  // Upgrade, Edit, Delete
    │   └── UpgradePrompt.tsx   // CTA to workspace
    └── WorkspaceProjectView.tsx
        ├── ProjectHeader.tsx
        ├── WorkspaceOverview.tsx  // Canvas completion, evidence count
        ├── CanvasPreview.tsx      // Read-only canvas snapshot
        ├── EvidenceGallery.tsx    // Document thumbnails
        └── WorkspaceActions.tsx   // Open editor, Mark public
```

---

## UI Designs

### Layout A: Imported GitHub Project

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Profile                    [Share] [•••]       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [GitHub Icon]                                            │
│  my-saas-app                                              │
│  ────────────────────────────────────────────             │
│  Imported from GitHub · Added 3 days ago                  │
│                                                           │
│  A full-stack SaaS boilerplate with auth, payments,      │
│  and analytics built-in. Next.js 15 + Stripe + PostHog.  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 🔧 Tech Stack                                     │   │
│  │ [Next.js] [TypeScript] [Tailwind] [PostgreSQL]   │   │
│  │                                                   │   │
│  │ ⭐ GitHub Stats                                   │   │
│  │ 147 stars · 23 forks · Updated 2 hours ago       │   │
│  │                                                   │   │
│  │ 🔗 Links                                          │   │
│  │ • GitHub: github.com/username/my-saas-app        │   │
│  │ • Live Site: https://mysaas.com                  │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 💡 Want to document this project deeper?         │    │
│  │                                                   │    │
│  │ Upgrade to a workspace to add:                   │    │
│  │ • Business Model Canvas                          │    │
│  │ • Evidence documents                             │    │
│  │ • Version history & pivots                       │    │
│  │ • Get featured in '26 gallery                    │    │
│  │                                                   │    │
│  │ [Upgrade to Workspace]                           │    │
│  └──────────────────────────────────────────────────┘    │
│                                                           │
│  [Edit Metadata]  [View on GitHub]  [Delete Project]     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Layout B: Workspace Project

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Profile                    [Share] [•••]       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Workspace Icon] BUF-X7K9                                │
│  Buffalo Carbon Marketplace                               │
│  ────────────────────────────────────────────             │
│  Documented Workspace · Last edited 2 hours ago           │
│  [🔒 Private] [⏳ Public When Available]                  │
│                                                           │
│  A peer-to-peer carbon credit marketplace connecting     │
│  Buffalo businesses with local sustainability projects.   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 📊 Documentation Progress                         │   │
│  │                                                   │   │
│  │ Canvas: ████████░ 8/9 blocks complete            │   │
│  │ Evidence: 12 documents linked                    │   │
│  │ Versions: 5 snapshots saved                      │   │
│  │ Stage: Customer Validation                       │   │
│  │                                                   │   │
│  │ ✅ Ready for '26 Gallery                          │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 🎯 Business Model Canvas Preview                  │   │
│  │                                                   │   │
│  │ [Problem]          [Solution]     [Value Prop]   │   │
│  │ • High carbon      Next-gen peer  Simple carbon  │   │
│  │   footprint in     to peer...     offsetting...  │   │
│  │   Buffalo...                                      │   │
│  │                                                   │   │
│  │ [View Full Canvas in Workspace →]                │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 📁 Evidence Documents (12)                        │   │
│  │                                                   │   │
│  │ [📄 Customer Interview 1.pdf]                     │   │
│  │ [📊 Market Research.xlsx]                         │   │
│  │ [🎨 Figma Mockups] +9 more                        │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  [Open Workspace]  [Mark Public Now]  [Share Preview]    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. ProjectHeader Component

**Props:**

```typescript
interface ProjectHeaderProps {
  type: "imported" | "workspace";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badges: Array<{ label: string; variant: string }>;
  onShare: () => void;
  onMore: () => void;
}
```

**Features:**

- Icon badge (GitHub, Workspace, URL)
- Project name with edit inline (if owner)
- Source/status subtitle
- Badge array (Private, Public When Available, Imported, etc.)
- Share and more actions buttons

### 2. SourceMetadata Component

**For GitHub Projects:**

```typescript
interface GitHubMetadataProps {
  stats: {
    stars: number;
    forks: number;
    language: string;
    lastUpdated: string;
  };
  repoUrl: string;
  liveUrl?: string;
  techStack: string[];
}
```

**Features:**

- Star/fork counts with icons
- Last updated timestamp
- Primary language badge
- Tech stack chips
- Links to GitHub and live site

**For URL Projects:**

```typescript
interface URLMetadataProps {
  sourceUrl: string;
  screenshotUrl?: string;
  extractedTech?: string[];
  lastScraped: string;
}
```

### 3. UpgradePrompt Component

**Props:**

```typescript
interface UpgradePromptProps {
  projectId: string;
  projectName: string;
  previewData?: {
    description: string;
    techStack: string[];
    githubReadme?: string;
  };
  onUpgrade: (workspaceId: string) => void;
}
```

**Features:**

- Benefit list (canvas, evidence, history, gallery)
- Preview of what will be pre-filled
- Primary CTA button
- Dismissible (don't show again)

### 4. CanvasPreview Component

**Props:**

```typescript
interface CanvasPreviewProps {
  canvas: BusinessModelCanvas;
  compact?: boolean;
  maxBlocksToShow?: number;
}
```

**Features:**

- Read-only 3-block preview (Problem, Solution, Value Prop)
- Truncated text with "..." if too long
- "View Full Canvas" CTA
- Completion indicator

### 5. WorkspaceOverview Component

**Props:**

```typescript
interface WorkspaceOverviewProps {
  completion: {
    canvasBlocks: number;
    totalBlocks: number;
    evidenceCount: number;
    versionCount: number;
  };
  stage: ProjectStage;
  lastEdited: string;
  isReadyForGallery: boolean;
}
```

**Features:**

- Progress bars for canvas completion
- Evidence and version counts
- Stage badge with icon
- "Ready for '26" badge if complete
- Last edited timestamp

### 6. ProjectActions Component

**For Imported Projects:**

```typescript
<ProjectActions>
  <Button primary onClick={handleUpgrade}>
    Upgrade to Workspace
  </Button>
  <Button variant="outline" onClick={handleEdit}>
    Edit Metadata
  </Button>
  <Button variant="ghost" onClick={handleViewSource}>
    View on GitHub
  </Button>
  <DropdownMenu>
    <DropdownMenuItem onClick={handleArchive}>Archive</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenu>
</ProjectActions>
```

**For Workspace Projects:**

```typescript
<ProjectActions>
  <Button primary onClick={handleOpenWorkspace}>
    Open Workspace
  </Button>
  <Button variant="outline" onClick={handleMarkPublic}>
    Mark Public
  </Button>
  <Button variant="ghost" onClick={handleShare}>
    Share Preview
  </Button>
  <DropdownMenu>
    <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
    <DropdownMenuItem onClick={handleArchive}>Archive</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenu>
</ProjectActions>
```

---

## State Management

### Profile Store Enhancement

Add to `useProfileStore`:

```typescript
interface ProfileStore {
  // ... existing state

  // Project detail
  currentProjectDetail: Project | null;
  setCurrentProjectDetail: (project: Project | null) => void;

  // Upgrade flow
  upgradeToWorkspace: (projectId: string) => Promise<Workspace>;
  isUpgrading: boolean;

  // Share preview
  generateShareLink: (projectId: string) => string;
}
```

### Upgrade Flow State Machine

```typescript
type UpgradeState =
  | { status: "idle" }
  | { status: "confirming"; project: ImportedProject }
  | { status: "creating"; progress: number }
  | { status: "success"; workspaceId: string }
  | { status: "error"; message: string };
```

---

## API Routes

### GET `/api/profile/project/[id]`

**Purpose:** Fetch project details (either imported or workspace)

**Auth:** Required (unless preview=true query param)

**Response:**

```typescript
{
  project: ImportedProject | WorkspaceProject;
  canEdit: boolean;
  canUpgrade: boolean; // Only true for imported projects
  shareUrl?: string; // If preview mode enabled
}
```

### POST `/api/profile/project/[id]/upgrade`

**Purpose:** Convert imported project to workspace

**Auth:** Required (must be owner)

**Request:**

```typescript
{
  projectId: string;
  prefillOptions?: {
    includeReadme: boolean;
    includeTechStack: boolean;
  };
}
```

**Response:**

```typescript
{
  workspaceId: string;
  workspaceCode: string;
  redirectUrl: string; // /workspace/BUF-XXXX
}
```

**Logic:**

1. Validate user owns project
2. Create new workspace with generated code
3. Pre-fill canvas blocks from imported data:
   - Name → projectName
   - Description → Problem statement
   - Tech stack → Key Resources
   - GitHub URL → Evidence document
4. Update imported project with `workspaceId` reference
5. Return workspace details

### POST `/api/profile/project/[id]/share`

**Purpose:** Generate shareable preview link

**Auth:** Required (must be owner)

**Request:**

```typescript
{
  projectId: string;
  expiresIn?: number; // Optional expiry in days
}
```

**Response:**

```typescript
{
  shareUrl: string; // /profile/project/[id]?preview=TOKEN
  expiresAt?: string;
}
```

---

## Database Schema

### Firestore Collection: `projects`

**Document Structure:**

```typescript
{
  id: string;
  userId: string;
  type: "imported" | "workspace";

  // Common fields
  name: string;
  description: string;
  createdAt: Timestamp;
  lastModified: Timestamp;

  // Imported project fields (type === "imported")
  source?: "github" | "url" | "manual";
  githubData?: {
    repoUrl: string;
    stars: number;
    forks: number;
    language: string;
    lastUpdated: Timestamp;
  };
  urlData?: {
    sourceUrl: string;
    screenshotUrl?: string;
  };
  techStack?: string[];

  // Workspace reference (if upgraded)
  workspaceId?: string;
  workspaceCode?: string;

  // Sharing
  isShareable: boolean;
  shareToken?: string;
  shareTokenExpiry?: Timestamp;
}
```

**Indexes:**

```typescript
// Query user's projects
userId + type + lastModified(DESC);

// Query shareable projects
shareToken + shareTokenExpiry;
```

---

## User Experience Details

### Loading States

**Initial Load:**

```
[Skeleton Header]
[Skeleton Content Blocks]
[Skeleton Actions]
```

**Upgrade Progress:**

```
┌────────────────────────────────┐
│ Upgrading to Workspace...      │
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░ 75%           │
│                                │
│ ✓ Creating workspace           │
│ ✓ Pre-filling canvas           │
│ ⏳ Linking evidence documents  │
│                                │
└────────────────────────────────┘
```

### Empty States

**No Evidence Documents (Workspace):**

```
┌─────────────────────────────────┐
│ 📁 No evidence documents yet    │
│                                 │
│ Add documents in the workspace  │
│ to show your validation work.   │
│                                 │
│ [Open Workspace]                │
└─────────────────────────────────┘
```

**No Tech Stack (Imported):**

```
┌─────────────────────────────────┐
│ 🔧 Tech stack not detected      │
│                                 │
│ [Add Tech Stack Manually]       │
└─────────────────────────────────┘
```

### Error States

**Project Not Found:**

```
┌─────────────────────────────────┐
│ ⚠️ Project not found             │
│                                 │
│ This project may have been      │
│ deleted or you don't have       │
│ permission to view it.          │
│                                 │
│ [← Back to Profile]             │
└─────────────────────────────────┘
```

**Upgrade Failed:**

```
┌─────────────────────────────────┐
│ ❌ Upgrade failed                │
│                                 │
│ We couldn't create the          │
│ workspace. Please try again.    │
│                                 │
│ Error: [Technical details]      │
│                                 │
│ [Try Again]  [Cancel]           │
└─────────────────────────────────┘
```

---

## Mobile Responsive Design

### Breakpoints

**Desktop (>= 1024px):**

- Two-column layout: metadata | preview
- Full canvas preview (3-block grid)
- All actions visible

**Tablet (768px - 1023px):**

- Single column, stacked sections
- Condensed canvas preview (list view)
- Actions in horizontal row

**Mobile (<= 767px):**

- Full-width single column
- Minimal canvas preview (2 blocks max)
- Actions in dropdown menu
- Fixed bottom action bar

### Mobile Optimizations

**Header:**

- Collapsible metadata
- Floating share button (bottom-right)
- Back button (top-left)

**Canvas Preview:**

- Swipeable carousel for blocks
- "View more" expands inline
- No modal on mobile (inline expansion)

**Actions:**

- Sticky bottom bar: [Primary Action] [More]
- Full-screen action sheet for secondary actions
- Swipe-to-dismiss modals

---

## Accessibility

### Keyboard Navigation

- Tab order: Header → Content → Actions
- Enter on "Upgrade" triggers confirmation modal
- Escape closes modals
- Arrow keys navigate canvas preview carousel

### Screen Reader Support

```html
<article aria-label="Project details for {projectName}">
  <header>
    <h1>{projectName}</h1>
    <p aria-label="Project type">{Imported from GitHub}</p>
  </header>

  <section aria-label="Project metadata">
    <!-- GitHub stats, tech stack -->
  </section>

  <aside aria-label="Upgrade prompt" role="complementary">
    <!-- Upgrade CTA -->
  </aside>

  <footer aria-label="Project actions">
    <button aria-label="Upgrade {projectName} to workspace">
      Upgrade to Workspace
    </button>
  </footer>
</article>
```

### ARIA Live Regions

```html
<div aria-live="polite" aria-atomic="true">
  {upgradeStatus === "creating" && "Creating workspace..."} {upgradeStatus ===
  "success" && "Workspace created! Redirecting..."}
</div>
```

---

## Analytics Events

### Page View

```typescript
analytics.track("project_detail_viewed", {
  projectId: string;
  projectType: "imported" | "workspace";
  source?: "github" | "url";
  isOwner: boolean;
  isPreview: boolean;
});
```

### Upgrade Initiated

```typescript
analytics.track("project_upgrade_started", {
  projectId: string;
  projectType: "imported";
  source: "github" | "url";
  hasReadme: boolean;
  techStackCount: number;
});
```

### Upgrade Completed

```typescript
analytics.track("project_upgrade_completed", {
  projectId: string;
  workspaceId: string;
  workspaceCode: string;
  duration: number; // milliseconds
  prefillSuccess: boolean;
});
```

### Share Link Generated

```typescript
analytics.track("project_share_link_created", {
  projectId: string;
  projectType: "imported" | "workspace";
  expiresIn?: number;
});
```

---

## Testing Strategy

### Unit Tests

**Component Tests:**

- `ProjectHeader.test.tsx` - Badge rendering, actions
- `UpgradePrompt.test.tsx` - CTA behavior, dismissal
- `CanvasPreview.test.tsx` - Block truncation, layout
- `WorkspaceOverview.test.tsx` - Progress calculations

**Utility Tests:**

- `projectTypeDetection.test.ts` - Type guards
- `shareUrlGeneration.test.ts` - Token security
- `canvasPrefill.test.ts` - Data mapping logic

### Integration Tests

**User Flows:**

```typescript
describe("Imported Project Detail Flow", () => {
  it("displays GitHub project with upgrade prompt", async () => {
    // Navigate to imported project
    // Verify metadata displays
    // Check upgrade prompt visible
    // Click upgrade → verify modal
  });

  it("upgrades imported project to workspace", async () => {
    // Click upgrade button
    // Confirm in modal
    // Wait for creation
    // Verify redirect to workspace
    // Check canvas pre-filled
  });
});

describe("Workspace Project Detail Flow", () => {
  it("displays workspace overview with actions", async () => {
    // Navigate to workspace project
    // Verify canvas preview
    // Check evidence gallery
    // Verify "Open Workspace" CTA
  });
});
```

### E2E Tests (Playwright)

```typescript
test("Full upgrade flow from GitHub import to workspace", async ({ page }) => {
  // Login
  await page.goto("/profile");

  // Import GitHub project
  await page.click('text="Import from GitHub"');
  await page.fill('input[name="url"]', "https://github.com/test/repo");
  await page.click('text="Import"');
  await page.waitForSelector('text="Import successful"');

  // Navigate to project detail
  await page.click('text="test/repo"');
  await expect(page).toHaveURL(/\/profile\/project\/.+/);

  // Verify imported project view
  await expect(page.locator('text="Imported from GitHub"')).toBeVisible();
  await expect(page.locator('text="Upgrade to Workspace"')).toBeVisible();

  // Upgrade to workspace
  await page.click('text="Upgrade to Workspace"');
  await page.click('text="Confirm"');
  await page.waitForURL(/\/workspace\/BUF-.+/);

  // Verify workspace created and pre-filled
  await expect(page.locator('input[value="test/repo"]')).toBeVisible();
  await expect(page.locator('textarea:has-text("README")')).toBeVisible();
});
```

---

## Performance Considerations

### Lazy Loading

- Canvas preview only loads when in viewport
- Evidence gallery loads thumbnails progressively
- GitHub stats fetched on-demand (not SSR)

### Caching

```typescript
// SWR for project data
const { data: project } = useSWR(`/api/profile/project/${id}`, fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 30000, // 30 seconds
});

// Cache GitHub stats for 5 minutes
const { data: githubStats } = useSWR(
  project?.githubUrl ? `/api/github/stats?url=${project.githubUrl}` : null,
  fetcher,
  {
    revalidateOnMount: true,
    refreshInterval: 300000, // 5 minutes
  },
);
```

### Image Optimization

```typescript
// Evidence thumbnails
<Image
  src={document.thumbnailUrl}
  alt={document.name}
  width={200}
  height={150}
  loading="lazy"
  placeholder="blur"
/>

// GitHub avatar
<Image
  src={project.owner.avatarUrl}
  alt={project.owner.name}
  width={40}
  height={40}
  loading="eager"
  unoptimized={project.owner.avatarUrl.includes("githubusercontent")}
/>
```

---

## Implementation Checklist

### Phase 1: Core View (Week 1)

- [ ] Create route: `app/profile/project/[id]/page.tsx`
- [ ] Fetch project data (imported vs workspace)
- [ ] Implement ProjectDetailScreen component
- [ ] Build ImportedProjectView layout
- [ ] Build WorkspaceProjectView layout
- [ ] Add ProjectHeader component
- [ ] Add SourceMetadata component (GitHub)
- [ ] Add WorkspaceOverview component
- [ ] Add ProjectActions component
- [ ] Mobile responsive styles

### Phase 2: Upgrade Flow (Week 1)

- [ ] Create API route: `/api/profile/project/[id]/upgrade`
- [ ] Implement upgrade logic (workspace creation)
- [ ] Build UpgradePrompt component
- [ ] Build upgrade confirmation modal
- [ ] Add canvas pre-fill logic from imported data
- [ ] Add progress indicator during upgrade
- [ ] Handle errors and rollback
- [ ] Add success redirect to workspace

### Phase 3: Share Preview (Week 2)

- [ ] Create API route: `/api/profile/project/[id]/share`
- [ ] Generate share tokens (secure, expirable)
- [ ] Add `?preview=true` query param handling
- [ ] Build unauthenticated preview view
- [ ] Add "Join Buffalo" CTA for viewers
- [ ] Copy-to-clipboard share button
- [ ] Share link management in profile

### Phase 4: Polish & Testing (Week 2)

- [ ] Canvas preview component (read-only)
- [ ] Evidence gallery component
- [ ] Loading states for all sections
- [ ] Error states (not found, permission denied)
- [ ] Empty states (no evidence, no tech stack)
- [ ] Unit tests for all components
- [ ] Integration tests for upgrade flow
- [ ] E2E test for full user journey
- [ ] Accessibility audit (keyboard, screen reader)
- [ ] Performance optimization (lazy loading, caching)

---

## Future Enhancements (Post-Launch)

### Version 1.1 (Post-'26)

- Public project pages at `/p/[slug]`
- SEO optimization with dynamic OG images
- Social sharing with rich previews
- Project analytics (views, shares)

### Version 1.2

- Inline editing on detail page (no modal)
- Duplicate project (create template)
- Export project as PDF/JSON
- Project tags and filtering

### Version 1.3

- Comparison view (compare 2 projects side-by-side)
- Project history timeline
- Embed widget for external sites
- API access for project data

---

## Open Questions

1. **Upgrade Reversibility**: Can users "downgrade" workspace back to imported project?
   - **Recommendation**: No, upgrade is one-way to avoid data loss

2. **Share Link Expiry**: Default expiration for preview links?
   - **Recommendation**: 30 days, renewable

3. **Multiple Upgrades**: Can one imported project create multiple workspaces?
   - **Recommendation**: No, 1:1 mapping to prevent confusion

4. **Workspace Link**: Should imported project with workspace show "View Workspace" instead of "Upgrade"?
   - **Recommendation**: Yes, show "View Workspace" + "View Portfolio Version"

5. **Public Preview Before Gallery**: Allow sharing preview links before gallery launches?
   - **Recommendation**: Yes, builds hype and collects feedback

---

## Success Metrics

### Week 1 Post-Launch

- 50% of imported projects viewed at least once
- 20% upgrade rate (imported → workspace)
- 5+ share links generated per day

### Month 1

- 70% of users view project detail before opening workspace
- 30% upgrade rate
- Average 2 minutes time-on-page (high engagement)

### Month 3 (Pre-Gallery)

- 100+ workspaces created from imported projects
- 50+ active share preview links
- Users cite "portfolio + workspace" as key value prop

---

## Conclusion

The Project Detail View is the **missing bridge** between portfolio (breadth) and workspace (depth). It solves:

1. **Import flow completion** - Gives imported projects a home
2. **Upgrade discovery** - Clear path from portfolio to documentation
3. **Pre-gallery sharing** - Users can showcase work before public launch
4. **Value proposition clarity** - Shows difference between types of projects

**Priority**: Critical for first launch. Import flow is incomplete without this view.

**Effort**: ~2 weeks (1 week core implementation, 1 week polish/testing)

**Impact**: Unlocks the full portfolio platform vision and enables viral sharing pre-gallery.

---

# ADDENDUM: Showcase-Focused Redesign (January 2025)

## Current Issues with ProjectDetailView Component

The existing `src/components/workspace/ProjectDetailView.tsx` has several showcase problems:

### ❌ Problem 1: Overwhelming Canvas Display

- Shows **ALL 9 BMC blocks** in a grid, even empty ones
- Takes up massive vertical space (~60% of page)
- Feels like admin dashboard, not portfolio piece
- Empty blocks say "Not yet filled" - not impressive

### ❌ Problem 2: Buried Value

- GitHub stats (stars, forks) are hidden in small badges
- Live demo link not prominent (no primary CTA)
- Tech stack not showcased visually
- Project description limited to `oneLiner` (1 sentence max)

### ❌ Problem 3: Missing Visual Impact

- No cover image support
- No screenshots gallery
- No README preview for GitHub imports
- Generic card-based layout (not hero-driven)

### ❌ Problem 4: Poor Information Hierarchy

- Stats grid at top (admin-focused)
- Business model canvas dominates
- Social proof buried
- Call-to-action buttons are secondary

## ✅ Showcase-Focused Redesign

### New Information Hierarchy

```
1. HERO SECTION (Above fold)
   ├─ Cover image (if available)
   ├─ Project name + compelling one-liner
   ├─ PRIMARY CTAs: [🎯 Live Demo] [💻 View Code]
   └─ Social proof bar: ⭐ 147 stars · 👁️ 1.2k views

2. ABOUT & STORY (Full description)
   ├─ Full projectDescription (not just one-liner)
   ├─ README preview (if GitHub import)
   └─ Project journey/milestones

3. TECH STACK (Visual showcase)
   ├─ Primary language (large badge)
   ├─ Technologies (visual chips)
   └─ License info

4. BUSINESS MODEL HIGHLIGHTS (Selective)
   ├─ Show ONLY completed blocks (or top 3-4 key blocks)
   ├─ Completion percentage badge
   └─ "View Full Canvas" expandable button

5. EVIDENCE & PROOF
   ├─ Screenshots gallery
   ├─ Document list with thumbnails
   └─ Linked evidence indicators

6. QUICK STATS (Secondary, compact)
   └─ Versions, pivots, engagement metrics
```

### Key Design Principles

1. **Visual-First**: Lead with cover image and hero CTAs
2. **Selective Display**: Show only what's impressive (completed blocks, not empty ones)
3. **Social Proof Up Front**: GitHub stars, views, engagement prominent
4. **Story-Driven**: Full description and README, not just one-liner
5. **Action-Oriented**: Clear CTAs for demo, code, editing

---

## Component Redesign Specification

### 1. Hero Section Component

**Visual Structure:**

```tsx
<Hero>
  <CoverImage src={workspace.assets?.coverImage} fallback={<GradientBg />} />

  <HeroContent>
    <Badges>
      {workspace.stage && <StageBadge stage={workspace.stage} />}
      {isForTwentySix && <TwentySixBadge />}
      {isPublic && <PublicBadge onClick={handleViewPublic} />}
    </Badges>

    <Title>{workspace.projectName}</Title>
    <Subtitle>{workspace.oneLiner}</Subtitle>

    <PrimaryCTAs>
      {hasDemo && (
        <Button size="lg" variant="primary" icon={<ExternalLink />}>
          Try Live Demo
        </Button>
      )}
      {hasGitHub && (
        <Button size="lg" variant="outline" icon={<Github />}>
          View Code
        </Button>
      )}
      {isOwner && (
        <Button size="lg" variant="default" icon={<Edit />}>
          Edit Workspace
        </Button>
      )}
    </PrimaryCTAs>

    <SocialProofBar>
      {githubStats?.stars > 0 && (
        <Stat icon={<Star />} value={githubStats.stars} label="stars" />
      )}
      {workspace.views > 0 && (
        <Stat icon={<Eye />} value={workspace.views} label="views" />
      )}
      {workspace.commentCount > 0 && (
        <Stat
          icon={<MessageCircle />}
          value={workspace.commentCount}
          label="comments"
        />
      )}
    </SocialProofBar>
  </HeroContent>
</Hero>
```

**Responsive Behavior:**

- **Desktop**: Cover image full-width with overlay text
- **Tablet**: Side-by-side image + content
- **Mobile**: Stacked, image as banner

---

### 2. About Section Component

**Problem**: Current implementation only shows `oneLiner` (1 sentence)

**Solution**: Show full project story

```tsx
<AboutSection>
  <SectionTitle>About This Project</SectionTitle>

  {/* Full description with markdown support */}
  <Description>
    {workspace.projectDescription || workspace.description}
  </Description>

  {/* README preview for GitHub imports */}
  {workspace.embeds?.github?.readmeUrl && (
    <ReadmePreview>
      <ReadmeHeader>
        <GithubIcon /> README.md
      </ReadmeHeader>
      <ReadmeContent>
        {/* First 300-500 words of README */}
        <TruncatedMarkdown content={readmeContent} maxWords={500} />
        <Button variant="link" onClick={handleViewFullReadme}>
          Read full README on GitHub →
        </Button>
      </ReadmeContent>
    </ReadmePreview>
  )}

  {/* Project milestones if available */}
  {workspace.milestones && workspace.milestones.length > 0 && (
    <MilestonesTimeline milestones={workspace.milestones} />
  )}
</AboutSection>
```

---

### 3. Tech Stack Section Component

**For GitHub Imports**: Prominent display of technical credentials

```tsx
<TechStackSection>
  <SectionTitle>Built With</SectionTitle>

  {/* Primary Language - Large, prominent */}
  {githubStats?.language && (
    <PrimaryLanguage>
      <LanguageIcon language={githubStats.language} size="large" />
      <LanguageName>{githubStats.language}</LanguageName>
    </PrimaryLanguage>
  )}

  {/* Technology Badges */}
  {githubStats?.topics && githubStats.topics.length > 0 && (
    <TechGrid>
      {githubStats.topics.slice(0, 8).map((topic) => (
        <TechBadge key={topic}>{topic}</TechBadge>
      ))}
      {githubStats.topics.length > 8 && (
        <ShowMoreBadge>+{githubStats.topics.length - 8} more</ShowMoreBadge>
      )}
    </TechGrid>
  )}

  {/* License */}
  {githubStats?.license && <LicenseBadge>{githubStats.license}</LicenseBadge>}
</TechStackSection>
```

---

### 4. Business Model Highlights Component (Redesigned)

**Current Problem**: Shows all 9 blocks, even empty ones

**Solution A: Completed Blocks Only**

```tsx
<BusinessModelSection>
  <SectionHeader>
    <SectionTitle>Business Model Highlights</SectionTitle>
    <CompletionBadge>{canvasCompletion.percentage}% Complete</CompletionBadge>
  </SectionHeader>

  {canvasCompletion.completed > 0 ? (
    <>
      <BlocksGrid cols={3}>
        {/* Show ONLY completed blocks */}
        {BMC_FIELDS.filter((field) => {
          const value = workspace.bmcData?.[field.id];
          return value && value.trim().length > 0;
        }).map((field) => (
          <CompletedBlockCard key={field.id}>
            <BlockHeader>
              <BlockTitle>{field.title}</BlockTitle>
              <CheckCircle2 className="text-emerald-500" />
            </BlockHeader>
            <BlockContent>{workspace.bmcData[field.id]}</BlockContent>
            {/* Show linked evidence count */}
            {getLinkedEvidence(field.id).length > 0 && (
              <EvidenceTag>
                {getLinkedEvidence(field.id).length} evidence linked
              </EvidenceTag>
            )}
          </CompletedBlockCard>
        ))}
      </BlocksGrid>

      <Button variant="outline" onClick={handleExpandCanvas}>
        View Full Business Model Canvas →
      </Button>
    </>
  ) : (
    <EmptyState>
      <EmptyIcon />
      <EmptyTitle>Business model not yet documented</EmptyTitle>
      <EmptyDescription>
        Fill in the canvas blocks to showcase your business thinking
      </EmptyDescription>
      {isOwner && (
        <Button onClick={() => router.push(`/project/${workspace.code}/edit`)}>
          Start Filling Canvas
        </Button>
      )}
    </EmptyState>
  )}
</BusinessModelSection>
```

**Solution B: Key Blocks Preview** (Alternative)

```tsx
{
  /* Show top 3-4 most important blocks regardless of completion */
}
const keyBlocks = [
  "valuePropositions", // Center of BMC
  "customerSegments", // Who we serve
  "revenueStreams", // How we make money
  getFirstCompletedBlock(), // One additional completed block
];

<KeyBlocksGrid>
  {keyBlocks.map((blockId) => (
    <KeyBlockCard
      key={blockId}
      block={BMC_FIELDS.find((f) => f.id === blockId)}
      value={workspace.bmcData?.[blockId]}
      isComplete={hasValue(blockId)}
    />
  ))}
</KeyBlocksGrid>;
```

---

### 5. Evidence Gallery Component

**Visual showcase of supporting documents**

```tsx
<EvidenceSection>
  <SectionTitle>
    Supporting Evidence
    <Badge variant="secondary">{evidenceCount} documents</Badge>
  </SectionTitle>

  {/* Screenshots Gallery */}
  {workspace.assets?.screenshots && workspace.assets.screenshots.length > 0 && (
    <ScreenshotsGallery>
      <GalleryTitle>Screenshots</GalleryTitle>
      <ImageGrid>
        {workspace.assets.screenshots.map((url, idx) => (
          <ScreenshotThumbnail
            key={idx}
            src={url}
            alt={`Screenshot ${idx + 1}`}
            onClick={() => openLightbox(idx)}
          />
        ))}
      </ImageGrid>
    </ScreenshotsGallery>
  )}

  {/* Document List */}
  {workspace.documents && workspace.documents.length > 0 && (
    <DocumentList>
      {workspace.documents.slice(0, 6).map((doc) => (
        <DocumentCard key={doc.id}>
          <FileIcon type={doc.fileType} />
          <DocumentInfo>
            <DocumentName>{doc.title}</DocumentName>
            {doc.linkedFields && doc.linkedFields.length > 0 && (
              <LinkedBlocks>
                Linked to {doc.linkedFields.length} canvas blocks
              </LinkedBlocks>
            )}
          </DocumentInfo>
          <Button size="sm" variant="ghost">
            Preview
          </Button>
        </DocumentCard>
      ))}
      {workspace.documents.length > 6 && (
        <Button variant="link">
          View all {workspace.documents.length} documents →
        </Button>
      )}
    </DocumentList>
  )}
</EvidenceSection>
```

---

### 6. Quick Stats Section (Compact)

**Move to bottom, make compact and secondary**

```tsx
<QuickStatsSection>
  <StatRow>
    <QuickStat
      icon={<GitBranch />}
      value={workspace.versions?.length ?? 0}
      label="versions"
    />
    <QuickStat
      icon={<FileText />}
      value={workspace.pivots?.length ?? 0}
      label="pivots"
    />
    <QuickStat
      icon={<Calendar />}
      value={formatDate(workspace.lastModified)}
      label="last updated"
    />
    {createdDate && (
      <QuickStat
        icon={<Calendar />}
        value={formatDate(workspace.createdAt)}
        label="created"
      />
    )}
  </StatRow>
</QuickStatsSection>
```

---

## Implementation Priority

### 🔴 P0 - Critical for Showcase (Implement First)

1. **Hero Section with Primary CTAs**
   - Cover image support (with fallback gradient)
   - Prominent "Live Demo" and "View Code" buttons
   - Social proof bar (stars, views)
   - Estimated effort: 4 hours

2. **Selective BMC Display**
   - Show only completed blocks (not all 9)
   - Or show top 3-4 key blocks with completion status
   - "View Full Canvas" expandable button
   - Estimated effort: 3 hours

3. **Full Description Section**
   - Show full `projectDescription` (not just `oneLiner`)
   - Support markdown rendering
   - Expandable if very long
   - Estimated effort: 2 hours

4. **Tech Stack Section**
   - Primary language prominent display
   - Topics/technologies as visual badges
   - License badge
   - Estimated effort: 2 hours

**Total P0 Effort**: ~11 hours (1.5 days)

### 🟡 P1 - Important for Polish

5. **Evidence Gallery**
   - Screenshots grid with lightbox
   - Document list with thumbnails
   - "View all" expansion
   - Estimated effort: 4 hours

6. **README Preview**
   - Fetch and render GitHub README
   - Truncate with "Read full" link
   - Estimated effort: 3 hours

7. **Milestones Timeline**
   - Visual timeline component
   - Display key project milestones
   - Estimated effort: 3 hours

**Total P1 Effort**: ~10 hours (1.5 days)

### 🟢 P2 - Nice to Have

8. **Live Demo Embed**
   - iframe preview of demo site
   - Sandboxed for security
   - Estimated effort: 4 hours

9. **GitHub Activity Widget**
   - Recent commits
   - Contributor list
   - Estimated effort: 3 hours

**Total P2 Effort**: ~7 hours (1 day)

---

## Mobile Responsive Considerations

### Hero Section

- **Desktop**: Full-width cover image with overlay content
- **Mobile**: Stack cover image (50vh) above content

### BMC Blocks Display

- **Desktop**: 3-column grid for completed blocks
- **Tablet**: 2-column grid
- **Mobile**: 1-column list

### Evidence Gallery

- **Desktop**: 4-column grid for screenshots
- **Mobile**: 2-column grid, swipeable carousel

---

## Before & After Comparison

### Before (Current Implementation)

```
1. Header (name, code, badges)
2. 4-column stats grid (canvas %, evidence, versions, engagement)
3. Description card (small)
4. Stage progress bar
5. ❌ ALL 9 BMC blocks in grid (even empty ones) - OVERWHELMING
6. Scroll indicator
```

**Problems:**

- Admin-focused layout
- Overwhelming canvas display
- No visual impact
- Buried CTAs

### After (Showcase-Focused)

```
1. ✨ HERO: Cover image + Primary CTAs + Social proof
2. Full description + README preview
3. ✨ TECH STACK: Visual showcase
4. ✨ BUSINESS MODEL: Only completed blocks (selective)
5. Evidence gallery (screenshots + documents)
6. Quick stats (compact, bottom)
7. Project journey (milestones, stage progress)
```

**Benefits:**

- Portfolio-ready
- Visual impact
- Selective, not overwhelming
- Clear CTAs
- Story-driven

---

## Success Metrics

### Engagement

- **Time on page**: Increase from 30s → 2 minutes (showcase value)
- **Click-through to demo**: 40%+ of viewers try demo
- **Click-through to code**: 30%+ of viewers view GitHub

### Sharing

- **Share rate**: 15%+ of owners share their project
- **Public conversion**: 25%+ of workspaces marked public

### Conversion (Imported → Workspace)

- **Upgrade rate**: 30%+ of imported projects upgraded
- **Canvas completion**: 70%+ of workspaces have 5+ blocks filled

---

## Next Steps

1. ✅ Review this redesign spec
2. 🔄 Implement P0 changes to ProjectDetailView component
3. Test with real imported GitHub projects
4. Gather feedback from beta users
5. Iterate based on showcase effectiveness

**Timeline**: 3-4 days for complete P0+P1 implementation
