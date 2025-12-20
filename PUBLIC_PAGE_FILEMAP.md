# Buffalo Projects Public Project Page: Complete File Map

## Overview

This file map provides quick reference to all files involved in the public project page at `/p/[slug]`.

---

## Route Files

### Page Router & Entry Point
```
app/(public)/p/[slug]/page.tsx
├─ Purpose: Server-side page component, metadata generation, data fetching
├─ Key Functions:
│  ├─ generateMetadata() - OG tags, schema.org SEO
│  ├─ fetchWorkspaceBySlug() - Server-cached Firebase query
│  └─ serializeWorkspace() - Convert Firestore timestamps
└─ Exports: <ProjectDetailPage> (async server component)

app/(public)/p/[slug]/PublicProjectDetailScreen.tsx
├─ Purpose: Client-side controller for analytics, SEO, auth state
├─ Key Functions:
│  ├─ View count tracking (firebaseDatabase.incrementViewCount)
│  ├─ SEO structured data generation (schema.org CreativeWork)
│  └─ Auth state retrieval
├─ Renders: <ProjectDetailPageV2> with workspace data
└─ Note: Injects SEO schema into page head

app/(public)/p/[slug]/loading.tsx
├─ Purpose: Loading skeleton shown during page fetch
└─ Pattern: Suspense fallback
```

---

## Main Layout Component

### UI Orchestrator
```
src/components/projects/v2/ProjectDetailPageV2.tsx
├─ Purpose: Master layout component, conditional section rendering
├─ Key Logic:
│  ├─ Imports all 11 section components
│  ├─ Determines what sections to show based on workspace content
│  ├─ Handles share button callback
│  ├─ Manages comment count state
│  └─ Lazy loads CommentThread for performance
├─ Layout Order:
│  1. ProjectHeader
│  2. ProjectAbout (if hasDescription)
│  3. EvidenceDocuments (if hasEvidence)
│  4. ImpactMetrics (if hasImpact)
│  5. ProjectShowcase (if hasShowcase)
│  6. TechStack (if hasTechStack)
│  7. GitHubStats (if hasGitHub)
│  8. MilestonesTimeline (if hasMilestones)
│  9. ProjectCommunity (always)
│  10. CommentThread (if isPublic and not showMinimal)
│  11. Footer (always)
└─ Progressive Enhancement: Only renders sections with content
```

---

## Section Components

### 1. Header Section
```
src/components/projects/v2/ProjectHeader.tsx
├─ Purpose: Hero section with project name, stage, CTAs, appreciation
├─ Key Data:
│  ├─ workspace.projectName (h1 title)
│  ├─ workspace.oneLiner (subtitle)
│  ├─ workspace.stage (color-coded badge)
│  ├─ workspace.tags (max 4 + overflow)
│  ├─ workspace.creator (attribution)
│  ├─ workspace.buffaloAffiliated (badge)
│  ├─ workspace.isForTwentySix (badge)
│  ├─ workspace.assets.coverImage (gradient background)
│  ├─ workspace.embeds (demo, website, github links)
│  ├─ workspace.appreciations (heart counter)
│  └─ workspace.socialLinks (twitter, linkedin)
├─ Features:
│  ├─ Stage badge with color from getStageConfig()
│  ├─ Appreciation button with state management
│  ├─ Primary CTAs (demo, website, github)
│  ├─ Secondary CTAs (share, feedback, appreciate, social)
│  ├─ Gradient mesh background animation
│  └─ Framer motion animations
└─ Interactive: Share, appreciate, scroll to comments
```

### 2. About Section
```
src/components/projects/v2/ProjectAbout.tsx
├─ Purpose: Narrative story - problem, solution, why it matters
├─ Key Data:
│  ├─ workspace.description (main narrative)
│  ├─ workspace.projectDescription (fallback)
│  ├─ workspace.problemStatement (context)
│  └─ workspace.oneLiner (blockquote if unique)
├─ Design:
│  ├─ Narrow max-width container (4xl) for readability
│  ├─ Prose styling with whitespace preserved
│  └─ Optional blockquote for one-liner
└─ Conditional: Hidden if no description/problem statement
```

### 3. Evidence Documents Section
```
src/components/projects/v2/EvidenceDocuments.tsx
├─ Purpose: Supporting proof - PDFs, videos, research documents
├─ Key Data:
│  └─ workspace.documents (filtered: type !== "image")
├─ Layout:
│  ├─ Grid: 3 columns on desktop, responsive
│  ├─ Uses DocumentCard component for each item
│  └─ Shows document count
├─ Note: Images are shown in ProjectShowcase instead
└─ Conditional: Hidden if no non-image documents
```

### 4. Impact Metrics Section
```
src/components/projects/v2/ImpactMetrics.tsx
├─ Purpose: Traction metrics - prove success with numbers
├─ Key Data:
│  ├─ workspace.users (active users count)
│  ├─ workspace.revenue (dollar amount)
│  └─ workspace.waitlistCount (pre-launch demand)
├─ Layout:
│  ├─ Grid: 3 columns, stat cards
│  ├─ Icons with color coding (blue, green, purple)
│  ├─ Large formatted numbers (K/M abbreviations)
│  └─ Labels below
├─ Helpers:
│  ├─ formatNumber() - 1000 → "1K"
│  └─ formatCurrency() - 1000000 → "$1M"
└─ Conditional: Hidden if no metrics
```

### 5. Showcase Section
```
src/components/projects/v2/ProjectShowcase.tsx
├─ Purpose: Visual evidence - screenshots, demos, links
├─ Key Data:
│  ├─ workspace.embeds.demo (live demo link)
│  ├─ workspace.embeds.website (website link)
│  ├─ workspace.embeds.github.repoUrl (GitHub link)
│  ├─ workspace.embeds.pitch (pitch deck)
│  ├─ workspace.embeds.youtube.url (video)
│  ├─ workspace.assets.screenshots (screenshot URLs)
│  ├─ workspace.assets.coverImage (banner)
│  └─ workspace.documents (image documents)
├─ Layout:
│  ├─ Featured demos/links (2 columns, hover effects)
│  ├─ Image gallery (2 columns, zoom on hover)
│  └─ Count indicator
├─ Design:
│  ├─ Color-coded cards (primary, github, website, pitch, youtube)
│  ├─ Hover scale transform (1.02)
│  ├─ Icon badges per card type
│  └─ Image gallery with aspect-video ratio
└─ Conditional: Hidden if no visuals or demos
```

### 6. Tech Stack Section
```
src/components/projects/v2/TechStack.tsx
├─ Purpose: Show technologies and tools used
├─ Key Data:
│  └─ workspace.techStack (string[])
├─ Design: Simple badge list, scrollable
└─ Conditional: Hidden if no tech stack
```

### 7. GitHub Stats Section
```
src/components/projects/v2/GitHubStats.tsx
├─ Purpose: Showcase open-source credibility and activity
├─ Key Data:
│  └─ workspace.githubStats {
│      stars: number
│      forks: number
│      contributors: number
│      issues?: number
│      language?: string
│      topics?: string[]
│      license?: string
│      lastCommit?: string
│      totalCommits?: number
│    }
├─ Layout:
│  ├─ Stat cards (stars, forks, contributors, commits)
│  ├─ Language badge
│  ├─ Topics/tags
│  ├─ License info
│  └─ Last commit date
└─ Conditional: Hidden if no GitHub stats
```

### 8. Milestones Timeline Section
```
src/components/projects/v2/MilestonesTimeline.tsx
├─ Purpose: Show project progression over time
├─ Key Data:
│  └─ workspace.milestones: Array<{
│      date: string
│      title: string
│      description: string
│    }>
├─ Design:
│  ├─ Vertical timeline with connector lines
│  ├─ Date, title, description per milestone
│  └─ Visual progression indicator
└─ Conditional: Hidden if no milestones
```

### 9. Community Section
```
src/components/projects/v2/ProjectCommunity.tsx
├─ Purpose: Facilitate peer collaboration and exchange
├─ Key Data:
│  ├─ workspace.asks (string[]) - what creator needs
│  ├─ workspace.gives (string[]) - what creator offers
│  ├─ workspace.teamMembers: Array<{
│  │    name: string
│  │    role: string
│  │    linkedin?: string
│  │  }>
│  ├─ workspace.acknowledgments (string)
│  └─ Note: Supports backwards compat with workspace.lookingFor
├─ Layout:
│  ├─ Grid: 2 columns (asks/gives | team/acknowledgments)
│  ├─ Cards with colored icons (blue, green, purple, amber)
│  └─ Badges for asks/gives, list for team
├─ Cards:
│  ├─ "What I'm asking for" (asks)
│  ├─ "What I can offer" (gives)
│  ├─ "Team" (members)
│  └─ "Acknowledgments" (free text)
└─ Always Shown: Even if no community data (empty state guides owners)
```

### 10. Comments Section
```
src/components/comments/CommentThread.tsx
├─ Purpose: Peer feedback and discussion
├─ Key Functions:
│  ├─ Load comments on mount (via commentService.getCommentsByProject)
│  ├─ Subscribe to real-time updates
│  ├─ Create/update/delete comments
│  └─ Handle mentions
├─ Key Data:
│  ├─ workspace.code (project identifier)
│  ├─ currentUserId (for auth checking)
│  └─ workspace.isPublic (only show if public)
├─ Features:
│  ├─ Sign-in requirement (prompts if not authed)
│  ├─ Mention suggestions (@name)
│  ├─ Comment editing (own comments)
│  ├─ Comment deletion (owner or author)
│  ├─ Real-time updates (Firestore subscription)
│  └─ Max 2000 character limit
├─ UI:
│  ├─ CommentInput (with mention dropdown)
│  ├─ Comment list (CommentItem for each)
│  ├─ Empty state (no comments yet)
│  └─ Error state (with retry)
└─ Conditionally Rendered: Only if isPublic && !showMinimal
```

### 11. Footer
```
src/components/projects/v2/ProjectDetailPageV2.tsx (bottom)
├─ Purpose: Metadata and attribution
├─ Elements:
│  ├─ "Created [month] [year]"
│  ├─ "Updated [month] [year]"
│  ├─ Project code (monospace, faded): e.g., "BUF-X7K9"
│  └─ "Built with Buffalo Projects" link
└─ Design: Minimal, muted colors
```

---

## Helper Components

### Document Card
```
src/components/projects/v2/DocumentCard.tsx
├─ Purpose: Individual document display in EvidenceDocuments grid
├─ Props:
│  ├─ document: ProjectDocument
│  └─ index: number (for stagger animation)
├─ Displays:
│  ├─ Document icon (PDF, video, link)
│  ├─ Name
│  ├─ Type badge
│  └─ Download/view link
└─ Animation: Staggered entrance on scroll
```

### Empty State
```
src/components/projects/v2/EmptyState.tsx
├─ Purpose: Reusable component for sections with no content
├─ Props:
│  ├─ icon: ComponentType
│  ├─ title: string
│  ├─ description: string
│  ├─ ctaText?: string (owner-only action)
│  ├─ ctaHref?: string
│  └─ showCta?: boolean
├─ Design:
│  ├─ Centered icon, title, description
│  ├─ Optional CTA link (only for owners)
│  └─ Guidance messaging
└─ Used By: All conditional sections to guide owners
```

### Section Header
```
src/components/projects/v2/SectionHeader.tsx
├─ Purpose: Consistent section heading style
├─ Props:
│  ├─ icon?: IconComponent
│  ├─ title: string
│  └─ subtitle?: string
└─ Used By: Multiple sections for consistency
```

---

## Service & Data Layer

### Comment Service
```
src/services/commentService.ts
├─ Functions:
│  ├─ getCommentsByProject(projectId) - Fetch all comments
│  ├─ subscribeToProjectComments(projectId, callback) - Real-time subscription
│  ├─ createComment(data) - Create new comment with mentions
│  ├─ updateComment(data) - Edit comment
│  └─ deleteComment(commentId, projectId) - Remove comment
└─ Used By: CommentThread component
```

### Firebase Database Service
```
src/services/firebaseDatabase.ts
├─ Functions:
│  ├─ getPublicWorkspaceBySlug(slug) - Fetch project data (cached on server)
│  ├─ incrementViewCount(workspaceCode) - Track views
│  └─ incrementAppreciation(workspaceCode) - Track appreciations
└─ Used By: Page.tsx, ProjectHeader, analytics
```

### Auth Store
```
src/stores/authStore.ts
├─ State:
│  ├─ user: User | null
│  ├─ loading: boolean
│  └─ setUser(): void
├─ Usage:
│  ├─ Get current user for comment auth
│  ├─ Determine if user is project owner
│  └─ Show/hide auth-only features
└─ Used By: Multiple components for auth checking
```

---

## Type Definitions

### Workspace Type
```
src/types/index.ts (lines 143-396)
├─ Key Fields for Public Page:
│  ├─ code: string (BUF-XXXX identifier)
│  ├─ slug: string (URL slug for /p/[slug])
│  ├─ projectName: string
│  ├─ description: string
│  ├─ oneLiner: string
│  ├─ stage: ProjectStage (idea | research | ... | scaling)
│  ├─ creator: string
│  ├─ isPublic: boolean
│  ├─ views: number
│  ├─ appreciations: number
│  ├─ commentCount: number
│  ├─ users: number
│  ├─ revenue: number
│  ├─ waitlistCount: number
│  ├─ documents: ProjectDocument[]
│  ├─ embeds: { demo, website, github, pitch, youtube }
│  ├─ assets: { logo, screenshots, coverImage }
│  ├─ techStack: string[]
│  ├─ githubStats: GitHubStats
│  ├─ milestones: Milestone[]
│  ├─ teamMembers: TeamMember[]
│  ├─ asks: string[]
│  ├─ gives: string[]
│  ├─ acknowledgments: string
│  ├─ tags: string[]
│  ├─ socialLinks: { twitter, linkedin }
│  ├─ buffaloAffiliated: boolean
│  ├─ createdAt: string
│  └─ lastModified: string
└─ Full Type: ~250 lines
```

### Comment Type
```
src/types/index.ts (lines 398+)
├─ id: string
├─ projectId: string
├─ userId: string
├─ userDisplayName: string
├─ content: string
├─ mentions?: string[] (user IDs)
├─ createdAt: string
├─ updatedAt?: string
└─ Used By: CommentThread, CommentItem
```

---

## Configuration & Constants

### Stage Configuration
```
src/constants/stages.ts
├─ Stages (in progression):
│  1. idea (💡) → 2. research (🔍) → 3. planning (📋)
│  → 4. building (🏗️) → 5. testing (✅) → 6. launching (🚀)
│  → 7. scaling (📈)
├─ Each has: label, description, icon, colors
├─ Helper Functions:
│  ├─ getStageConfig(stage) - Get config for stage
│  ├─ getStageIndex(stage) - Get position (0-6)
│  ├─ isStageBefore/After() - Compare stages
│  ├─ getStageProgress(stage) - Calculate % (14%-100%)
│  └─ getCompletedStages/getRemainingStages()
└─ Used By: ProjectHeader for badge display
```

### Icons
```
src/icons/index.ts
├─ Lucide icon imports used throughout:
│  ├─ Stage icons: Lightbulb, Search, ClipboardList, Building, etc.
│  ├─ Action icons: Share2, ExternalLink, Github, Play, Heart, etc.
│  ├─ Section icons: FileText, Folder, TrendingUp, Users, etc.
│  └─ All re-exported from lucide-react
└─ Used By: ProjectHeader, all sections
```

---

## Design Tokens & Styling

### Design Tokens
```
src/tokens/semantic/components.ts
├─ STAGE_COLORS: Color configs for each stage badge
│  └─ Each stage: { background, text, border, className }
└─ Used By: getStageConfig() for consistent colors
```

### Utilities
```
src/lib/utils.ts
├─ cn() - classname merger (clsx + tailwind-merge)
└─ Used By: All components for conditional classes
```

---

## Environment & Configuration

### Environment Variables Used
```
.env.local required for public page:
├─ NEXT_PUBLIC_FIREBASE_API_KEY
├─ NEXT_PUBLIC_FIREBASE_PROJECT_ID
├─ NEXT_PUBLIC_GEMINI_API_KEY (for imports)
└─ Optional emulator flags
```

---

## Summary of Component Hierarchy

```
page.tsx (Server)
└─ ProjectErrorBoundary
   └─ PublicProjectDetailScreen (Client)
      └─ ProjectDetailPageV2 (Layout)
         ├─ ProjectHeader
         ├─ ProjectAbout
         ├─ EvidenceDocuments
         │  └─ DocumentCard (per document)
         ├─ ImpactMetrics
         ├─ ProjectShowcase
         ├─ TechStack
         ├─ GitHubStats
         ├─ MilestonesTimeline
         ├─ ProjectCommunity
         │  └─ EmptyState (if no data)
         ├─ CommentThread (lazy loaded)
         │  ├─ CommentInput
         │  └─ CommentItem (per comment)
         └─ Footer
```

---

## Key Data Flows

### 1. Page Load Flow
```
/p/[slug] request
  → page.tsx calls fetchWorkspaceBySlug(slug)
  → Firebase query returns workspace document
  → generateMetadata() creates OG tags
  → Server renders page with metadata
  → PublicProjectDetailScreen hydrates (client)
  → incrementViewCount() called
  → All sections conditionally render based on data
```

### 2. Appreciation Button Flow
```
User clicks heart icon
  → handleAppreciate() called
  → Check auth: toast error if not signed in
  → Check hasAppreciated: toast if already done
  → firebaseDatabase.incrementAppreciation(workspace.code)
  → Update local state: appreciation count increases
  → Heart color changes to red
  → Toast success message
```

### 3. Comment Submission Flow
```
User types comment + mentions
  → CommentInput.onSubmit() called
  → Validates auth, length
  → commentService.createComment({
      projectId, content, mentionIds, ...
    })
  → Firebase creates document
  → Subscription callback fires
  → Comments list updates in real-time
  → Toast success message
```

### 4. Share Flow
```
User clicks share button
  → handleShare() called
  → Try navigator.share() (if available)
  → Fallback: navigator.clipboard.writeText(url)
  → Toast success: "Link copied"
```

---

## Performance Considerations

### Code Splitting
- CommentThread lazy loaded with `dynamic()` (SSR: false)
- Reason: Comments are below fold, heavy component

### Progressive Enhancement
- Only render sections with content (conditional rendering)
- Prevents unnecessary DOM from cluttering the page

### Optimization Points
- Images use Next.js Image component (optimization)
- Animations use Framer Motion (GPU accelerated)
- Firestore uses cached queries (server-side)

---

## File Count Summary

- **Route Files:** 3
- **Layout Components:** 1
- **Section Components:** 10
- **Helper Components:** 3
- **Service Files:** 2 (commentService, firebaseDatabase)
- **Store Files:** 1 (authStore)
- **Type/Constant Files:** 3
- **Total Public Page Related:** ~23 files

