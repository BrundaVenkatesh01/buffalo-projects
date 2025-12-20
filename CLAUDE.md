# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Buffalo Projects?

**Buffalo Projects is a community-owned peer validation platform** for builders of all kinds—not just startups. Designers, researchers, indie hackers, open-source maintainers, and creators can document their work privately, publish to a curated community gallery, and receive authentic feedback from fellow builders.

### The Core Loop

```
Private Canvas → Community Gallery → Peer Comments → Iterate
```

1. **Private Canvas**: Iterate safely using the Business Model Canvas editor
2. **Community Gallery**: Publish to a curated, auth-only showcase
3. **Peer Comments**: Get validation from fellow builders
4. **Iterate**: Refine based on feedback

### Key Differentiators

- **Dashboard-First**: Users join the community, access their dashboard, then discover projects (gallery is auth-gated)
- **Community-Owned**: Open governance, transparent decisions, no company extracting value
- **Privacy-First**: Workspaces private by default; publishing is an explicit user action
- **No Algorithms**: Gallery discovery is human-curated, not ML-driven
- **Peer Exchange**: Give/Ask matching connects builders who can help each other

**See:** `MISSION.md`, `PRIVACY_CHARTER.md`, `GOVERNANCE.md` for full philosophy.

## Current Platform Status (December 2025)

### What's Live

- **Unified Project Editor**: Single editor at `/edit/[code]` for all project types
- **Business Model Canvas**: 9 blocks with inline editing, expand dialogs, BMC tooltips/hints
- **Evidence Management**: Document uploads linked to canvas blocks with AI analysis
- **Image Cropping**: Interactive crop modal with aspect ratio selection (16:9, 3:2, 4:3, 1:1, Free)
- **Redesigned Publishing**: Two-column layout with collapsible sections and live preview
- **Community Gallery**: Auth-gated discovery at `/dashboard/discover`
- **Give & Asks**: Peer exchange mechanism with gallery filtering
- **Import Tools**: GitHub repos, URLs, PDFs with AI-powered extraction
- **Onboarding System**: Welcome modal, canvas intro modal, toggleable BMC hints
- **Unified Navigation**: Single dark-theme nav component with auth-aware items
- **Profile & Showcase**: Creator profiles with published projects
- **Peer Comments**: Comment threads on public projects
- **Offline-First**: All workspace operations work without network
- **Version History**: Automatic snapshots with pivot detection

### Recent Updates (December 2025)

- Unified navigation replacing separate landing/platform nav components
- Compressed workspace hero sections with standardized spacing
- Full publish page redesign with 6 collapsible sections
- `PublishFormContext` with `useReducer` for centralized form state
- `LivePreviewCard` showing real-time project preview during editing
- `FullPagePreviewModal` for full preview before publishing
- Onboarding store with localStorage persistence
- BMC block tooltips with educational content
- Simplified Firebase Storage rules for uploads

### Deferred to '26

- Formal mentor system
- Groups/collaboration
- Advanced notifications (currently disabled to avoid Firestore index errors)
- Interview logging
- Validation scoring
- Self-hosted option

**See:** `FIRST_LAUNCH.md` for launch documentation

## Commands

### Development

```bash
npm run dev                # Start Next.js dev server (localhost:3000)
npm run build              # Production build (includes env verification)
npm run build:skip-verify  # Build without env checks
npm start                  # Start production server
```

### Code Quality

```bash
npm run typecheck          # TypeScript type checking
npm run lint               # ESLint (max 150 warnings)
npm run lint:fix           # Auto-fix linting issues
npm test                   # Vitest unit tests with coverage
npm run test:watch         # Watch mode for tests
npm run check              # Quick check (typecheck + lint)
npm run check:deep         # Full quality gate (knip, cycles, depcheck, tests)
```

### Testing

```bash
npm test                   # Vitest (≥70% lines/statements, ≥60% branches/functions)
npm run test:watch         # Watch mode
vitest run path/to/test    # Single test file
npm run test:e2e           # Playwright E2E (requires E2E_EMAIL, E2E_PASSWORD)
npm run test:e2e:ui        # E2E with Playwright UI
npm run test:e2e:headed    # E2E in headed mode
npm run test:e2e:next      # E2E tests tagged @next (chromium only)
```

### Firebase & Emulators

```bash
npm run emulators          # Start Firebase emulators (firestore, storage, auth)
npm run seed:emulator      # Seed emulator with test data
# Set NEXT_PUBLIC_FIREBASE_EMULATOR=1 in .env.local to use emulators
```

### Deployment

```bash
npm run deploy             # Deploy to Vercel preview
npm run deploy:prod        # Deploy to Vercel production
```

### Analysis

```bash
npm run analyze            # Bundle analyzer (ANALYZE=true)
npm run format             # Prettier formatting
npm run knip               # Dead code detection
npm run depcheck           # Unused dependencies
npm run cycles             # Circular dependency detection
```

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 18 |
| Language | TypeScript with Zod validation |
| Styling | Tailwind CSS + custom design tokens |
| State | Zustand with browser persistence |
| Database | Firebase (Auth, Firestore, Storage) |
| AI | Google Gemini 2.5 Flash (server-side) |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deployment | Vercel (standalone output) |

### App Router Structure

```
app/
├── (public)/              # Public routes (no auth)
│   ├── home/             # Landing page
│   ├── p/[slug]/         # Public project detail (SEO, sharable)
│   ├── members/          # Creator directory
│   ├── about/, support/  # Info pages
│   ├── collections/      # Curated collections
│   └── field-guide/      # Educational content
│
├── (app)/                # Authenticated routes
│   ├── dashboard/        # Main hub
│   │   ├── discover/     # Community gallery (auth-only)
│   │   ├── activity/     # Activity feed
│   │   └── settings/     # User preferences
│   ├── edit/[code]/      # Unified project editor
│   └── workspace/new     # Create new project
│
├── (auth)/               # Authentication
│   ├── signin/
│   ├── signup/
│   └── password-reset/
│
├── (studio)/             # Legacy routes (phasing out)
│
├── 26/                   # TwentySix program
│
└── api/                  # Server-side API routes
    ├── ai/               # Gemini endpoints
    │   ├── suggest/      # Canvas block suggestions
    │   └── analyze-image/
    ├── auth/             # OAuth flows
    ├── import/           # GitHub, URL, PDF imports
    ├── og/               # Open Graph images
    └── twenty-six/       # Program endpoints
```

### Key Routes

**Public (No Auth):**
- `/` → Landing page
- `/p/[slug]` → Public project detail (SEO-friendly)
- `/about`, `/support` → Info pages

**Authenticated:**
- `/dashboard` → User's main hub
- `/dashboard/discover` → **Auth-only community gallery**
- `/edit/[code]` → **Unified project editor**
- `/workspace/new` → Create new project
- `/members` → Creator directory

**Legacy Redirects (301):**
- `/profile` → `/dashboard`
- `/gallery` → `/dashboard/discover`
- `/workspace/[code]` → `/edit/[code]`
- `/showcase/[code]` → `/edit/[code]`

## Core Features

### Business Model Canvas

The 9-block Business Model Canvas is the core editor:

```typescript
type CanvasBlockId =
  | "keyPartners"      | "keyActivities"
  | "valuePropositions"| "customerRelationships"
  | "customerSegments" | "keyResources"
  | "channels"         | "costStructure"
  | "revenueStreams"
```

**Features:**
- Inline editing with expand dialogs
- Evidence linking (documents per block)
- Auto-save every 3 seconds
- Offline-first with queue sync
- Version snapshots
- AI-powered pivot detection

**Location:** `src/components/workspace/canvas/BusinessModelCanvas.tsx`

### Evidence Management

Upload and link documents to validate canvas blocks:

```typescript
type ProjectDocumentKind = "pdf" | "txt" | "md" | "doc" | "iframe_embed" | "image" | "video"
```

- Server-side PDF extraction
- AI summarization via Gemini
- Auto-tagging
- Link to specific canvas blocks

**Location:** `src/components/workspace/documents/`

### Publishing System (December 2025 Redesign)

Two-track publishing with image cropping support and live preview:

**Quick Publish:** Minimal fields (name, description, category, stage)

**Full Publish:** Two-column layout with:
- **Left Column**: Scrollable form with collapsible sections
- **Right Column**: Sticky live preview card

**6 Collapsible Sections:**
1. **Basics**: Name, pitch, description, category, stage, tags
2. **Visual Media**: Cover image (with cropping), screenshots, demo video
3. **Links**: GitHub, demo, website URLs
4. **Community Exchange**: Gives and asks with explainer tooltips
5. **Team**: Collaborators management
6. **Acknowledgments**

**Key Files:**
```
src/components/workspace/publishing/
├── PublishPage.tsx           # Two-column layout orchestrator
├── PublishFormContext.tsx    # Centralized useReducer state
├── PublishActions.tsx        # Publish/unpublish buttons
├── LivePreviewCard.tsx       # Real-time preview during editing
├── FullPagePreviewModal.tsx  # Full preview before publishing
├── ImageCropModal.tsx        # Interactive cropping (react-easy-crop)
├── GivesAsksExplainer.tsx    # Educational tooltip for peer exchange
├── VisibilityExplainer.tsx   # Privacy options explainer
└── sections/
    ├── BasicsSection.tsx
    ├── VisualMediaSection.tsx
    ├── LinksSection.tsx
    ├── CommunitySection.tsx
    ├── TeamSection.tsx
    └── SectionWrapper.tsx    # Collapsible section pattern
```

**Image Processing:** `src/utils/imageUtils.ts`
- Canvas-based cropping and compression
- Aspect ratio options: 16:9, 3:2, 4:3, 1:1, Free
- Max dimensions and quality optimization

### Gives & Asks (Peer Exchange)

Match builders who need help with builders who can provide it:

```typescript
// Example
workspace.gives = ["code review", "design feedback", "user research"]
workspace.asks = ["beta testers", "funding intro", "marketing help"]
```

**Matching Logic:** `src/stores/galleryStore.ts:calculateMatches()`

### Import Tools

**GitHub Import** (Server-side via `/api/import/github`):
- Repository stats (stars, forks, contributors)
- README extraction
- Language/topic analysis

**URL Import** (`/api/import/url`):
- Metadata extraction
- Content scraping
- AI analysis

**PDF Import** (`/api/import/pdf`):
- Text extraction
- AI summarization

## State Management

### Zustand Stores (`src/stores/`)

**authStore.ts** - Authentication
```typescript
interface AuthState {
  user: User | null
  loading: boolean
  signIn, signUp, signOut, updateProfile
}
```

**workspaceStore.ts** - Workspace & Canvas
```typescript
interface WorkspaceStore {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  loadWorkspace, createWorkspace, updateWorkspace
  saveWorkspace, publishWorkspace, unpublishWorkspace
  linkEvidence, unlinkEvidence
  enableEncryption, disableEncryption
}
```

**galleryStore.ts** - Gallery & Discovery
```typescript
interface GalleryStore {
  filters: GalleryFilters
  sortBy: SortOption
  userAsks, userGives, matchedProjects
  calculateMatches(allProjects)
}
```

**onboardingStore.ts** - User Onboarding (NEW)
```typescript
interface OnboardingState {
  hasSeenWelcomeModal: boolean
  hasSeenCanvasIntro: boolean
  showBMCHints: boolean              // Toggle for canvas tooltips
  markWelcomeModalSeen, markCanvasIntroSeen
  toggleBMCHints, setBMCHints
}
```

**updatesStore.ts** - Platform Updates
```typescript
interface UpdatesStore {
  hasUnreadUpdates: boolean
  lastViewedUpdate: string | null
}
```

## Services Layer (`src/services/`)

### Firebase Services

| Service | Purpose |
|---------|---------|
| `firebase.ts` | Core initialization (emulator support) |
| `firebaseAuth.ts` | Authentication |
| `firebaseDatabase.ts` | Firestore operations (600+ lines) |
| `storageService.ts` | File uploads |

### AI & Import Services

| Service | Purpose |
|---------|---------|
| `geminiService.ts` | Gemini AI integration (rate-limited) |
| `importService.ts` | Document import (PDF, DOCX) |
| `githubImportService.ts` | GitHub repo analysis |
| `urlAnalyzerService.ts` | URL content extraction |

### Utility Services

| Service | Purpose |
|---------|---------|
| `localWorkspaceService.ts` | Offline persistence |
| `syncService.ts` | Firebase ↔ LocalStorage sync |
| `encryptionService.ts` | Password-based encryption |
| `analyticsService.ts` | PostHog/GA (consent-gated) |

## Data Models (`src/types/index.ts`)

### Core Workspace Type

```typescript
interface Workspace {
  // Identity
  id: string
  code: string                        // BUF-X7K9
  slug?: string                       // URL slug
  projectName: string
  description: string
  oneLiner?: string                   // Short pitch

  // Canvas
  bmcData: Record<CanvasBlockId, string>
  evidenceLinks?: Record<CanvasBlockId, string[]>
  documents: ProjectDocument[]

  // Visibility
  isPublic: boolean
  visibility?: "private" | "unlisted" | "public"
  publishedAt?: number
  publishTrack?: "quick" | "full"

  // Metadata
  category?: ProjectCategory          // startup|design|indie|research|open-source|creative|other
  stage?: ProjectStage                // idea|research|planning|building|testing|launching|scaling
  tags?: string[]

  // Peer Exchange
  gives?: string[]
  asks?: string[]

  // Visual Assets
  assets?: {
    logo?: string
    screenshots?: string[]
    coverImage?: string
  }

  // External Links
  embeds?: {
    github?: { repoUrl: string }
    website?: string
    demo?: string
    youtube?: { videoId: string }
  }

  // Metrics
  views?: number
  appreciations?: number
  commentCount?: number

  // Versions
  versions: Version[]
  pivots: Pivot[]
}
```

### Project Categories & Stages

```typescript
type ProjectCategory = "startup" | "design" | "research" | "indie" | "open-source" | "creative" | "other"
type ProjectStage = "idea" | "research" | "planning" | "building" | "testing" | "launching" | "scaling"
```

## Design System

### Design Tokens (`src/tokens/`)

```typescript
// Brand colors
BUFFALO_BLUE = "#0070f3"
BUFFALO_DARK = "#000000"

// Import pattern
import { BUFFALO_BLUE, CANVAS_BLOCK, WORKSPACE_SURFACE } from "@/tokens"
```

### Component Layers

```
src/components/
├── ui/           # shadcn/ui base
├── ui-next/      # Buffalo-enhanced
├── buffalo/      # Custom patterns (StatCard, EmptyState)
├── unified/      # Single import point ← USE THIS
└── motion/       # Animations (framer-motion, GSAP)
```

**Always import from unified:**
```typescript
import { Button, Card, StatCard } from "@/components/unified"
```

## Security

### Middleware (`middleware.ts`)

- Auth guard for protected routes
- Legacy route redirects (301)
- Coming Soon mode option
- Cookie-based validation (actual security in Firestore rules)

### Security Features

- Input sanitization (DOMPurify)
- Rate limiting (Upstash Redis)
- CSRF protection (configurable)
- Security headers (CSP, HSTS, X-Frame-Options)
- Firestore & Storage rules

## Development Patterns

### Server-Side API Pattern

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ error: "Error message" }, { status: 500 })
  }
}
```

### Component Pattern

```typescript
"use client"

import { Button, Card } from "@/components/unified"
import { BUFFALO_BLUE } from "@/tokens"

interface Props {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: Props) {
  return (
    <Card>
      <h1>{title}</h1>
      <Button onClick={onAction}>Click</Button>
    </Card>
  )
}
```

### Store Pattern (Zustand)

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      data: "",
      setData: (data) => set({ data }),
    }),
    {
      name: "my-store",
      storage: typeof window !== "undefined" ? localStorage : undefined,
    },
  ),
)
```

### Error Handling

```typescript
import { toast } from "sonner"

try {
  await riskyOperation()
  toast.success("Operation completed")
} catch (error) {
  console.error("Operation failed:", error)
  toast.error("Failed to complete operation. Please try again.")
}
```

## Project Structure

```
app/                    # Next.js App Router
  (auth)/              # Auth pages (signin, signup, join)
  (public)/            # Public pages (home, p/[slug], members, about)
  (app)/               # Authenticated routes
    dashboard/         # Main hub, discover, activity, settings
    edit/[code]/       # Unified project editor
  (studio)/            # Legacy routes (being phased out → redirects)
  26/                  # TwentySix program
  api/                 # Server-side API routes
src/
  components/
    ui/                # shadcn/ui base components
    ui-next/           # Buffalo-enhanced components
    buffalo/           # Custom patterns (StatCard, EmptyState)
    unified/           # Single import point ← USE THIS
    motion/            # Animations (framer-motion, GSAP)
    onboarding/        # Welcome & canvas intro modals (NEW)
    workspace/         # Workspace editor
      canvas/          # Business Model Canvas + BMC tooltips
      documents/       # Evidence management
      publishing/      # Publish flow with sections (redesigned)
      layout/          # WorkspaceEditor container
      project/         # ProjectOverview, ProjectJourney
    projects/          # ProjectCard, project display
    navigation/        # Unified Navigation component
    landing/           # Landing page components
  constants/           # BMC fields, tooltips, stages
  services/            # Business logic (Firebase, AI, imports)
  stores/              # Zustand state (auth, workspace, gallery, onboarding)
  tokens/              # Design tokens (colors, spacing)
  hooks/               # React hooks (useNotifications, etc.)
  utils/               # Utilities (imageUtils, cn, etc.)
  types/               # TypeScript types
  middleware/          # Rate limiting
  test/                # Test setup
```

## Important Notes

### Requirements
- **Node ≥20.0.0** required
- **Next.js 15 + React 18** with App Router
- **Turbopack** in dev, Webpack in production
- **Standalone output** for Vercel

### Key Behaviors
- **Offline-first**: All workspace operations work without network
- **Auto-save**: Every 3 seconds with version snapshots
- **Auth-only gallery**: Community discovery requires login
- **GitHub imports**: Must use server-side API (`/api/import/github`)
- **No algorithms**: Gallery is human-curated

### Brand Guidelines
- **Buffalo Blue (#0070f3)** is the primary brand color
- Always use design tokens from `@/tokens`, not hardcoded values
- Import components from `@/components/unified`

### Environment Variables

**Required (.env.local):**
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI
NEXT_PUBLIC_GEMINI_API_KEY=

# Email
EMAIL_PROVIDER=resend
EMAIL_API_KEY=
EMAIL_FROM_ADDRESS=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Development
NEXT_PUBLIC_FIREBASE_EMULATOR=1  # Use local emulators
```

See `.env.example` for complete list.
