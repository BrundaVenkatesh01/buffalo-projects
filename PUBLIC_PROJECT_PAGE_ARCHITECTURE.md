# Buffalo Projects: Public Project Page Architecture

## Route & File Structure

**Route Path:** `/p/[slug]` (public, no authentication required)

**Files:**
- `/Users/laneyfraass/Buffalo-Projects/app/(public)/p/[slug]/page.tsx` - Server component with metadata generation and fetching
- `/Users/laneyfraass/Buffalo-Projects/app/(public)/p/[slug]/PublicProjectDetailScreen.tsx` - Controller component (handles analytics, SEO, auth state)
- `/Users/laneyfraass/Buffalo-Projects/src/components/projects/v2/ProjectDetailPageV2.tsx` - Main UI layout orchestrator

**Key Feature:** SEO-optimized with Open Graph metadata, schema.org structured data, and view count tracking

---

## Current UI Architecture (Portfolio-First Design)

### Layout Flow (Top to Bottom)

```
ProjectHeader (with badges, CTAs, appreciation button)
    ↓
ProjectAbout (narrative: problem → solution → why it matters)
    ↓
EvidenceDocuments (supporting PDFs, videos, links)
    ↓
ImpactMetrics (users, revenue, waitlist - if populated)
    ↓
ProjectShowcase (visual gallery: screenshots, demos, GitHub, pitch)
    ↓
TechStack (technology list)
    ↓
GitHubStats (stars, forks, commits, language - if connected)
    ↓
MilestonesTimeline (project progression)
    ↓
ProjectCommunity (asks/gives, team members, acknowledgments)
    ↓
CommentThread (feedback & discussion)
    ↓
Footer (creation/update dates, project code)
```

**Design Philosophy:** "Check out what I built!" - Story-driven, portfolio-style, not resume-focused

---

## UI Components (v2 Portfolio Components)

### 1. **ProjectHeader** (`/src/components/projects/v2/ProjectHeader.tsx`)
**Purpose:** First impression - project name, stage, creator, CTAs

**Elements Displayed:**
- Stage badge (color-coded: idea → scaling) - uses `getStageConfig()`
- Buffalo affiliation badge (🦬 icon)
- TwentySix '25 program badge
- Topic tags (max 4 + overflow indicator)
- Project name (h1, large typography)
- One-liner (short pitch)
- Creator attribution (avatar initial + name)

**Primary CTAs (Action Buttons):**
- **Try Live Demo** (if `embeds.demo` exists) - primary action (blue button)
- **Visit Website** (if `embeds.website` exists)
- **View Code** (if `embeds.github.repoUrl` exists)

**Secondary CTAs (Icon Buttons):**
- **Share** - native share API or clipboard copy
- **Give Feedback** - scroll to comments section
- **Appreciation Button** (❤️ Heart) - increment appreciation counter (requires sign-in)
- **Social Links** - Twitter, LinkedIn icons

**Key Data Used:**
```typescript
workspace.stage // "idea" | "research" | "planning" | "building" | "testing" | "launching" | "scaling"
workspace.projectName
workspace.oneLiner
workspace.creator
workspace.embeds.demo, .website, .github.repoUrl
workspace.appreciations // counter
workspace.tags
workspace.buffaloAffiliated
workspace.isForTwentySix
workspace.assets.coverImage
workspace.socialLinks
```

---

### 2. **ProjectAbout** (`/src/components/projects/v2/ProjectAbout.tsx`)
**Purpose:** Narrative story - help readers understand the why

**Elements:**
- Section header with FileText icon
- Full description text (whitespace preserved, readable prose style)
- Optional one-liner as blockquote (if differs from description)

**Key Data Used:**
```typescript
workspace.description || workspace.projectDescription
workspace.problemStatement
workspace.oneLiner
```

---

### 3. **EvidenceDocuments** (`/src/components/projects/v2/EvidenceDocuments.tsx`)
**Purpose:** Supporting proof - PDFs, videos, research documents

**Elements:**
- Grid of document cards (3 columns on desktop)
- Each card shows: document icon, name, type badge, download/open link
- Document count footer
- Empty state if no documents

**Document Types Shown:**
- PDF documents
- Videos
- Links
- (Images filtered out - shown in ProjectShowcase instead)

**Key Data Used:**
```typescript
workspace.documents // filtered: type !== "image"
```

---

### 4. **ImpactMetrics** (`/src/components/projects/v2/ImpactMetrics.tsx`)
**Purpose:** Prove traction with key success numbers

**Elements Displayed** (stat cards):
- 👥 **Active Users** (if `workspace.users` exists)
- 💰 **Revenue** (if `workspace.revenue` exists) - formatted as currency
- 📧 **Waitlist** (if `workspace.waitlistCount` exists)

**Design:**
- Grid layout (3 columns on desktop, stacks on mobile)
- Colored icon backgrounds (blue, green, purple)
- Large formatted numbers with K/M abbreviations
- Empty state guides owners to add metrics

**Key Data Used:**
```typescript
workspace.users // number of active users
workspace.revenue // dollar amount
workspace.waitlistCount // people waiting
```

---

### 5. **ProjectShowcase** (`/src/components/projects/v2/ProjectShowcase.tsx`)
**Purpose:** Visual evidence - bring the project to life

**Elements:**

**Featured Demos/Links (Grid, 2 columns):**
- 🎬 **Try It Live** (if `embeds.demo`)
- 📝 **Pitch Deck** (if `embeds.pitch`)
- 🔗 **Visit Website** (if `embeds.website`)
- 🐙 **View on GitHub** (if `embeds.github.repoUrl`)
- 🎥 **Watch Video** (if `embeds.youtube.url`)

**Image Gallery:**
- Screenshots from `assets.screenshots`
- Images uploaded to documents
- Aspect ratio: video (16:9)
- Hover: zoom effect + overlay with image name

**Key Data Used:**
```typescript
workspace.assets.screenshots
workspace.assets.coverImage
workspace.embeds.demo, .website, .github.repoUrl, .pitch, .youtube.url
workspace.documents.filter(d => d.type === "image")
```

---

### 6. **TechStack** (`/src/components/projects/v2/TechStack.tsx`)
**Purpose:** Show technical capabilities

**Elements:**
- Horizontal scrollable or wrapping list of tech tags
- Simple badge style
- Optional icon associations

**Key Data Used:**
```typescript
workspace.techStack // string[]
```

---

### 7. **GitHubStats** (`/src/components/projects/v2/GitHubStats.tsx`)
**Purpose:** Showcase open-source credibility

**Elements Displayed** (if GitHub connected):
- ⭐ Stars
- 🍴 Forks
- 👥 Contributors
- 📝 Total Commits (shows sustained effort)
- 🏷️ Programming Language
- 📚 Topics/Tags
- 📜 License
- 📅 Last Commit Date

**Key Data Used:**
```typescript
workspace.githubStats {
  stars: number
  forks: number
  contributors: number
  issues?: number
  language?: string
  topics?: string[]
  license?: string
  lastCommit?: string
  totalCommits?: number
}
```

---

### 8. **MilestonesTimeline** (`/src/components/projects/v2/MilestonesTimeline.tsx`)
**Purpose:** Show project progression over time

**Elements:**
- Vertical timeline (or horizontal on mobile)
- Date, title, description for each milestone
- Visual connector lines

**Key Data Used:**
```typescript
workspace.milestones // Array<{ date: string, title: string, description: string }>
```

---

### 9. **ProjectCommunity** (`/src/components/projects/v2/ProjectCommunity.tsx`)
**Purpose:** Facilitate peer collaboration and exchange

**Elements:**

**"What I'm asking for" (if `asks` exist):**
- MessageSquare icon, blue-tinted card
- List of ask badges (feedback, collaborators, funding, mentors, beta users, etc.)

**"What I can offer" (if `gives` exist):**
- Heart icon, green-tinted card
- List of give badges (product strategy, frontend dev, design feedback, etc.)

**"Team" (if `teamMembers` exist):**
- Users icon, purple-tinted card
- Name, role, LinkedIn link for each member

**"Acknowledgments" (if `acknowledgments` exist):**
- Heart icon, amber-tinted card
- Free-form text: thanks, credits, inspirations

**Data Structure:**
```typescript
workspace.asks // string[] - what creator needs
workspace.gives // string[] - what creator offers
workspace.teamMembers // Array<{ name, role, linkedin }>
workspace.acknowledgments // string
```

---

### 10. **CommentThread** (`/src/components/comments/CommentThread.tsx`)
**Purpose:** Peer feedback and discussion

**Elements:**

**If Signed In:**
- Comment input box (with mention suggestions)
- Existing comments thread (list of comments)
- Edit/delete options (on own comments or if owner)
- Reply mentions

**If Not Signed In:**
- Sign-in prompt: "Sign in to leave feedback"
- Messaging: "Authentic feedback builds trust. Join the Buffalo community..."

**Comment Display:**
- User avatar, name, timestamp
- Comment content (with mention links)
- Edit/delete buttons (conditional)
- Reply count (if implemented)

**Key Features:**
- Real-time subscription to comments
- Mention suggestions (owner + other commenters)
- Max 2000 character limit
- Error handling with retry

**Key Data Used:**
```typescript
workspace.code // project identifier
currentUserId // for auth checking
workspace.isPublic // show comments only if public
```

---

### 11. **Footer**
**Purpose:** Metadata and attribution

**Elements:**
- Creation date: "Created [month] [year]"
- Last modified date: "Updated [month] [year]"
- Project code (monospace, faded): e.g., "BUF-X7K9"
- "Built with Buffalo Projects" link to home

---

## Engagement Features (CTAs & Interactions)

### View-Level Engagement
- **View Count Tracking** - incremented on page load (Firebase)
  - `firebaseDatabase.incrementViewCount(workspace.code)`
  - Not displayed to users (analytics only)

### Appreciation/Likes
- **Heart Button** (❤️)
- **Counter:** Shows appreciation count
- **Behavior:**
  - Requires sign-in (toast error if not signed in)
  - One-time only per user (state: `hasAppreciated`)
  - Color changes: red heart + red text on appreciated state
  - Increments counter: `firebaseDatabase.incrementAppreciation(workspace.code)`
  
### Comments/Feedback
- **"Give Feedback" Button** - Scrolls to comments section
- **Comment Thread:**
  - Public projects only (`workspace.isPublic`)
  - Sign-in required to post
  - Real-time updates via subscription
  - Mentions (@ feature) for other users
  - Edit/delete comments (owner or comment author)

### Sharing
- **Share Button:**
  - Native Web Share API if available
  - Fallback: Copy link to clipboard
  - Shares: Project URL + project name

### Direct Actions
- **Try Live Demo** - External link to demo
- **Visit Website** - External link to website
- **View Code** - External link to GitHub repo
- **Watch Video** - External link to YouTube

### Social Links
- **Twitter** - Icon button linking to creator's Twitter
- **LinkedIn** - Icon button linking to creator's LinkedIn

---

## Early-Stage Indicators Currently Displayed

### 1. **Project Stage Badge** (Top of page)
Shows development maturity:
- 💡 **Idea** - Just a concept
- 🔍 **Research** - Validating assumptions
- 📋 **Planning** - Defining scope
- 🏗️ **Building** - Active development
- ✅ **Testing** - User feedback phase
- 🚀 **Launching** - Going live
- 📈 **Scaling** - Growth phase

**Design:** Color-coded badge, positioned prominently in header

### 2. **Project Timeline** (Footer)
- "Created [date]" - Shows how early the project is
- "Updated [date]" - Shows active development/updates

### 3. **Milestones Timeline** (Section)
- Visual progression of what's been achieved
- Helps readers see momentum

### 4. **Give/Asks Section**
- "Looking for feedback" signals early validation stage
- "Looking for collaborators" signals needs help
- "Looking for beta users" signals pre-launch
- Positions creators as open to community input

### 5. **Waitlist Count** (Impact Metrics)
- "X people on waitlist" - signals pre-launch demand
- Shows unshipped projects with interest

### 6. **Comment Count** (Not yet visible but tracked)
- `workspace.commentCount` exists
- Could show community engagement level

---

## Key Workspace Data Fields Used

```typescript
interface Workspace {
  // Public Display
  code: string // Project identifier (BUF-XXXX)
  slug: string // URL slug for /p/[slug]
  projectName: string // Title
  description: string // Full narrative
  oneLiner: string // Short pitch
  
  // Engagement Metrics
  views: number // View count (analytics)
  appreciations: number // Like count
  commentCount: number // Number of comments
  
  // Early-Stage Signals
  stage: ProjectStage // Maturity indicator
  createdAt: string // Creation timestamp
  lastModified: string // Update timestamp
  
  // Creator Info
  creator: string // Name
  userId: string // Owner identifier
  buffaloAffiliated: boolean // Buffalo connection
  isForTwentySix: boolean // Program participation
  location: "buffalo" | "remote"
  
  // Call-to-Actions
  embeds: {
    demo: string // Live demo URL
    website: string // Project website
    github: { repoUrl: string } // GitHub repo
    pitch: string // Pitch deck URL
    youtube: { url: string } // Video
  }
  socialLinks: {
    twitter: string
    linkedin: string
  }
  
  // Visual Assets
  assets: {
    coverImage: string
    screenshots: string[]
    logo: string
  }
  
  // Community/Collaboration
  asks: string[] // What creator needs
  gives: string[] // What creator offers
  teamMembers: Array<{ name, role, linkedin }>
  acknowledgments: string
  tags: string[]
  
  // Impact/Traction
  users: number // Active user count
  revenue: number // Revenue in dollars
  waitlistCount: number // Waitlist size
  
  // Evidence
  documents: ProjectDocument[] // PDFs, videos, links
  
  // Technical
  techStack: string[] // Technologies used
  githubStats: GitHubStats // GitHub metrics
  
  // Milestones
  milestones: Array<{ date, title, description }>
  
  // Visibility
  isPublic: boolean // Published to gallery
}
```

---

## Page Flow (Desktop User Journey)

1. **Land on `/p/[slug]`** → Page loads with metadata, view count incremented
2. **See ProjectHeader** → Read title, one-liner, badges, see stage badge
3. **Appreciate** (optional) → Click heart, sign in if needed, counter increments
4. **Share** (optional) → Copy link or native share
5. **Scroll: ProjectAbout** → Read the story of what's being built
6. **Scroll: EvidenceDocuments** → See supporting PDFs/videos
7. **Scroll: ImpactMetrics** → See users/revenue/waitlist (traction signals)
8. **Scroll: ProjectShowcase** → See demo videos, GitHub link, screenshots
9. **Scroll: TechStack** → Understand technical approach
10. **Scroll: GitHubStats** → Check open-source credentials (if applicable)
11. **Scroll: MilestonesTimeline** → See project progression
12. **Scroll: ProjectCommunity** → See what creator needs/offers, team, acknowledgments
13. **Scroll: CommentThread** → Read feedback from community
14. **Post Comment** (optional) → Sign in, leave feedback, mention creator

---

## Stage Constants & Configuration

**File:** `/Users/laneyfraass/Buffalo-Projects/src/constants/stages.ts`

**Stages (in progression order):**
```typescript
"idea" → "research" → "planning" → "building" → "testing" → "launching" → "scaling"
```

**Each Stage Has:**
- Label (display text)
- Description (tooltip)
- Icon (Lucide icon)
- Colors (background, text, border from design tokens)

**Helper Functions:**
- `getStageConfig(stage)` - Get full config for a stage
- `getStageIndex(stage)` - Get position (0-6)
- `isStageBefore(stage1, stage2)` - Compare stages
- `getStageProgress(stage)` - Calculate progress % (14%, 28%, etc.)

---

## Opportunities for "Get In Early" Positioning

### Current Implementation Gaps

The public page currently shows:
- ✅ Stage badge (maturity indicator)
- ✅ Creation/update dates (freshness)
- ✅ Asks/gives (collaboration signals)
- ✅ Waitlist count (demand signal)
- ✅ Comments (social proof)
- ✅ Appreciation count (interest signal)

### What's Missing (Opportunities for Enhancement)

#### 1. **Early Supporter Badge/Recognition**
Currently **NOT IMPLEMENTED**
- Could show: "Early supporters: 5" or list first N commenters
- Rationale: Network effects - people want to be early
- Implementation point: Header or Comments section

#### 2. **"Founder Connect" CTA**
Currently **NOT IMPLEMENTED**
- Could add: "Direct message creator" or "Schedule intro"
- Rationale: Early adopters often want direct founder access
- Implementation point: Header or ProjectCommunity section

#### 3. **Supporter/Backer Tier System**
Currently **NOT IMPLEMENTED**
- Could show: Levels of support (beta tester, advisor, investor inquiry)
- Rationale: Clarity on how to help
- Implementation point: ProjectCommunity section

#### 4. **Public Roadmap/Upcoming Features**
Currently **NOT IMPLEMENTED** but partially supported
- Could add: Upcoming milestones or next-stage goals
- Rationale: Clarity on what's coming - helps early supporters see trajectory
- Data exists: `milestones` field ready for display
- Implementation point: New section after Milestones

#### 5. **Early Backer Contributions Displayed**
Currently **NOT IMPLEMENTED**
- Could show: "Featured by [publication]" or "Mentioned in [media]"
- Rationale: Social proof for credibility
- Implementation point: Could add `media` field to Workspace type

#### 6. **Progress Bar/Completion Indicator**
Currently **PARTIALLY IMPLEMENTED** (can be derived)
- Could add: "Building for 3 months" or "25% to Series A"
- Rationale: Timeline urgency - "get in while it's still early"
- Implementation point: Header or after stage badge

#### 7. **Join Our Community CTA (Sticky)**
Currently **NOT IMPLEMENTED**
- Could add: Sticky button on scroll: "Join [X] early supporters"
- Rationale: Convert interested viewers to community members
- Implementation point: Sticky header or sidebar

#### 8. **Early Bird Benefits Modal/Section**
Currently **NOT IMPLEMENTED**
- Could add: "Get in early: First 100 users get [benefit]"
- Rationale: Create FOMO around being early
- Implementation point: Hero section or dedicated modal

#### 9. **Time Since Launch Signal**
Currently **PARTIAL** (dates shown in footer)
- Could add: "Launched 2 weeks ago" (friendly format)
- Rationale: Recency bias - newer = fresher opportunity
- Implementation point: Header timeline or stage section

#### 10. **Validation Score/Early Traction Meter**
Currently **NOT IMPLEMENTED**
- Could calculate: Score based on comments, appreciations, stage, dates
- Rationale: "This project is heating up" social signal
- Implementation point: Header or ImpactMetrics

---

## File Map Summary

| File Path | Purpose | Key Elements |
|-----------|---------|--------------|
| `app/(public)/p/[slug]/page.tsx` | Server metadata, SEO, fetching | SSR, OG tags, schema.org |
| `app/(public)/p/[slug]/PublicProjectDetailScreen.tsx` | Analytics controller, SEO injection | View tracking, structured data |
| `src/components/projects/v2/ProjectDetailPageV2.tsx` | Layout orchestrator | Section visibility logic |
| `src/components/projects/v2/ProjectHeader.tsx` | Hero section, CTAs, appreciation | Badges, buttons, stage display |
| `src/components/projects/v2/ProjectAbout.tsx` | Narrative/story | Description, problem statement |
| `src/components/projects/v2/EvidenceDocuments.tsx` | Supporting documents grid | PDFs, videos, document cards |
| `src/components/projects/v2/ImpactMetrics.tsx` | Traction metrics | Users, revenue, waitlist |
| `src/components/projects/v2/ProjectShowcase.tsx` | Visual gallery & demos | Screenshots, demo links, GitHub |
| `src/components/projects/v2/TechStack.tsx` | Technology list | Tags, tech badges |
| `src/components/projects/v2/GitHubStats.tsx` | GitHub credentials | Stars, forks, commits, language |
| `src/components/projects/v2/MilestonesTimeline.tsx` | Project timeline | Date-ordered milestones |
| `src/components/projects/v2/ProjectCommunity.tsx` | Collaboration signals | Asks/gives, team, acknowledgments |
| `src/components/comments/CommentThread.tsx` | Discussion thread | Comments, mentions, real-time |
| `src/constants/stages.ts` | Stage configuration | Stage progression, colors, icons |
| `src/types/index.ts` | TypeScript types | Workspace, Comment interfaces |

