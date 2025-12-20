# Buffalo Projects: Public/Private Architecture Diagram

## 1. DATA MODEL

```
WORKSPACE (Firestore Document)
├── Core Fields
│   ├── code: string (e.g., "BUF-X7K9")
│   ├── projectName: string
│   ├── createdAt: Timestamp
│   ├── lastModified: Timestamp
│   └── ownerId: string (Firebase UID)
│
├── VISIBILITY FIELDS
│   ├── isPublic: boolean (false = private, true = published)
│   ├── publishedAt?: number (milliseconds since epoch)
│   └── slug?: string (e.g., "my-cool-project", auto-generated)
│
├── Canvas & Content
│   ├── bmcData: CanvasState (9 BMC blocks)
│   ├── documents: ProjectDocument[] (evidence)
│   ├── versions: Version[] (snapshots)
│   └── journal: JournalEntry[]
│
├── SHOWCASE FIELDS (displayed on public page)
│   ├── assets: { coverImage?, screenshots[] }
│   ├── embeds: { youtube?, demo?, github?, website?, ... }
│   ├── creator: string (from user profile)
│   ├── teamMembers: { name, role, linkedin? }[]
│   ├── acknowledgments: string
│   └── socialLinks: { twitter?, linkedin? }
│
├── COMMUNITY EXCHANGE
│   ├── gives: string[] (e.g., ["Product strategy", "Frontend dev"])
│   ├── asks: string[] (e.g., ["Beta testers", "Design help"])
│   └── lookingFor: string[] (legacy, same as asks)
│
├── DISCOVERY FIELDS
│   ├── category: ProjectCategory (startup|design|research|indie|...)
│   ├── stage: ProjectStage (idea|research|prototype|testing|...)
│   ├── tags: string[] (e.g., ["AI", "SaaS"])
│   ├── location: "buffalo" | "remote"
│   └── buffaloAffiliated: boolean
│
├── ANALYTICS
│   ├── views: number
│   ├── appreciations: number
│   └── commentCount: number
│
├── CLASS INTEGRATION (Deferred to '26)
│   └── classCode?: string
│
└── ENCRYPTION (Advanced Feature)
    ├── isEncrypted: boolean
    └── encryptionKeyHint: string
```

---

## 2. VISIBILITY FLOW

```
                            USER CREATES PROJECT
                                    |
                                    v
                    ┌─────────────────────────────┐
                    │   PRIVATE WORKSPACE         │
                    │ isPublic: false             │
                    │ publishedAt: undefined      │
                    │ slug: undefined             │
                    │ Access: Owner only          │
                    └─────────────────────────────┘
                                    |
                                    | (User clicks "Get Public")
                                    |
                                    v
                    ┌─────────────────────────────┐
                    │ PUBLISH OPERATION           │
                    │ 1. Validate ownership       │
                    │ 2. Generate slug            │
                    │ 3. Set isPublic = true      │
                    │ 4. Set publishedAt = now    │
                    │ 5. Update lastModified      │
                    └─────────────────────────────┘
                                    |
                                    v
                    ┌─────────────────────────────┐
                    │   PUBLISHED WORKSPACE       │
                    │ isPublic: true              │
                    │ publishedAt: 1731234567890  │
                    │ slug: "my-cool-project"     │
                    │ Access: All auth users      │
                    └─────────────────────────────┘
                      |                         |
                      |                         |
         Gallery:     v                         v      Public Page:
    /dashboard/       Indexed                  /p/[slug]
    /discover?        by isPublic              (Requires auth)
    isPublic=true     (with filters)

                                    |
                                    | (User clicks "Make Private")
                                    |
                                    v
                    ┌─────────────────────────────┐
                    │ UNPUBLISH OPERATION         │
                    │ 1. Validate ownership       │
                    │ 2. Set isPublic = false     │
                    │ 3. Clear publishedAt        │
                    │ 4. Keep slug (for history)  │
                    │ 5. Update lastModified      │
                    └─────────────────────────────┘
                                    |
                                    v
                    ┌─────────────────────────────┐
                    │   PRIVATE WORKSPACE         │
                    │ (cycle back to start)       │
                    └─────────────────────────────┘
```

---

## 3. ACCESS CONTROL MATRIX

```
OPERATION       | UNAUTHENTICATED | OWNER | OTHER AUTH | RULES
────────────────┼─────────────────┼───────┼────────────┼─────────────────────
READ PRIVATE    | ✗               | ✓     | ✗          | owner only
READ PUBLIC     | ✓               | ✓     | ✓          | isPublic=true
LIST            | ✗ (needs auth)  | ✓     | ✓          | limit≤100
CREATE          | ✗               | ✓*    | ✗          | *must set self as owner
UPDATE          | ✗               | ✓     | ✗          | owner only
DELETE          | ✗               | ✓     | ✗          | owner only
PUBLISH/        | ✗               | ✓     | ✗          | update operation
UNPUBLISH       |                 |       |            | owner only
COMMENT         | ✗               | ✓**   | ✓**        | **project must be public
```

---

## 4. PUBLISH WIZARD FLOW

```
User Flow: /edit/[code] → QuickPublishPanel (5 steps)

Step 1: BASICS                Step 2: MEDIA
┌──────────────────┐          ┌──────────────────┐
│ Project Name *   │          │ Cover Image      │
│ One-Liner        │          │ Screenshots      │
│ Description      │          │ Demo Video       │
│ Category         │          └──────────────────┘
│ Stage            │                   |
│ Tags             │                   v
└──────────────────┘          Step 3: LINKS
        |                      ┌──────────────────┐
        v                      │ Demo URL         │
     [Continue] ────────────→  │ GitHub Repo      │
                               │ Website          │
                               │ Twitter/LinkedIn │
                               └──────────────────┘
                                      |
     ┌────────────────────────────────┴────────────────┐
     v                                                 v
Step 4: COMMUNITY               Step 5: PUBLISH
┌──────────────────┐           ┌──────────────────┐
│ Gives (Offers)   │           │ Live Preview     │
│ Asks (Needs)     │           │ Public URL       │
│ Examples:        │           │ [Publish Button] │
│ - Feedback       │           │ [Keep Private]   │
│ - Beta testers   │           └──────────────────┘
│ - Design help    │                   |
└──────────────────┘          ┌────────┴────────────┐
        |                     |                     |
        v                     v                     v
     [Continue]        [Get Public]        [Keep Private]
                             |                     |
                       ┌─────────────────┐        |
                       │ Save all changes │        |
                       │ Publish project  │        |
                       │ Redirect to      │        │
                       │ /gallery         │        │
                       └─────────────────┘        │
                                                  │
                                            Return to workspace
```

---

## 5. GALLERY DISCOVERY FLOW

```
User at: /dashboard/discover

1. FETCH PHASE
   ├── Server query: isPublic=true
   ├── Apply filters:
   │   ├── category (startup|design|research|...)
   │   ├── stage (idea|prototype|launched)
   │   ├── location (buffalo|remote)
   │   └── tags (free-form user tags)
   └── Pagination: cursor-based, 20 per page

2. MATCHING PHASE (Optional)
   ├── Get user's workspaces
   ├── Extract user's asks (e.g., ["Beta testers", "Funding"])
   ├── Match against project gives
   ├── Score by matched count
   └── Display "Matched for you" section

3. SORTING PHASE
   ├── recent (default) → by publishedAt DESC
   ├── trending → by appreciations DESC
   ├── popular → by views DESC
   └── comments → by commentCount DESC

4. DISPLAY PHASE
   ├── Project Card shows:
   │   ├── Cover image
   │   ├── Project name + one-liner
   │   ├── Creator name
   │   ├── Category badge
   │   ├── Stage indicator
   │   ├── View/comment counts
   │   └── [Click] → /p/[slug]
   └── Pagination controls for next page

Legend:
isPublic=true     = Published
Firestore query   = Efficient server-side filtering
cursor-based      = Infinite scroll (no offset)
```

---

## 6. PUBLIC PROJECT PAGE FLOW

```
URL: /p/[slug]

1. SERVER SIDE (Next.js)
   ├── fetch workspace by slug (from Firestore)
   ├── if not found → 404
   ├── generate metadata:
   │   ├── title: "Project Name • Buffalo Projects"
   │   ├── og:image → /api/og/[slug]
   │   └── schema.org structured data
   └── pass workspace to client

2. CLIENT SIDE (React)
   ├── Track view count (incrementViewCount)
   ├── Render ProjectDetailPageV2:
   │   ├── Hero section
   │   │   ├── Cover image
   │   │   ├── Project name + one-liner
   │   │   ├── Creator name
   │   │   └── Stage badge
   │   ├── Description section
   │   ├── Screenshots grid
   │   ├── Demo video (if embedded)
   │   ├── External links (demo, GitHub, website)
   │   ├── Team members (if defined)
   │   ├── Gives/Asks (MISSING - critical gap)
   │   ├── Acknowledgments (MISSING)
   │   ├── Comments section (auth-required)
   │   │   ├── Add comment button (if auth)
   │   │   ├── Existing comments
   │   │   └── Pagination for comments
   │   └── Share options (copy link, social)
   └── Footer with related projects

3. FEATURES
   ├── SEO: Full metadata for search engines
   ├── Social: Open Graph for Twitter/Facebook
   ├── Analytics: View count on each visit
   ├── Auth: Comments require login
   └── Mobile: Responsive design
```

---

## 7. DATABASE QUERY PATTERNS

### Getting All Public Projects (Gallery)

```typescript
// Location: firebaseDatabase.ts:940-984

const result = await queryWorkspaces({
  isPublic: true,                    // Filter: only published
  orderBy: "publishedAt",            // Sort: newest first
  orderDirection: "desc",
  category: "startup",               // Optional filter
  stage: "launch-ready",             // Optional filter
  location: "buffalo",               // Optional filter
  buffaloAffiliated: true,           // Optional filter
  tagsAny: ["AI", "SaaS"],          // Optional filter (OR logic)
  limit: 20,                         // Pagination
  startAfter: cursor,                // Cursor for next page
})
```

### Getting a Single Public Project by Slug

```typescript
// Location: firebaseDatabase.ts:340-373

const workspace = await getPublicWorkspaceBySlug("my-cool-project")
// Returns: Workspace if isPublic=true, null otherwise
```

### Getting User's Own Workspaces (All, Any Visibility)

```typescript
// Location: firebaseDatabase.ts:781-795

const workspaces = await getUserWorkspaces(userId)
// Returns: Only workspaces where ownerId === userId
// (regardless of isPublic value)
```

---

## 8. FIRESTORE RULES SIMPLIFIED

```firestore
// A workspace is readable if:
// - You own it (ownerId === request.auth.uid), OR
// - It's public (isPublic === true), OR
// - You're a collaborator (not yet implemented)

allow read: if 
  (resource.data.ownerId == request.auth.uid) ||
  (resource.data.isPublic == true) ||
  (request.auth.uid in resource.data.collaborators)

// Only owner can update (including publish/unpublish)
allow update: if 
  isAuthenticated() && 
  resource.data.ownerId == request.auth.uid
```

---

## 9. CLASS/STUDENT INFRASTRUCTURE (Deferred to '26)

```
CLASSROOM SYSTEM (Database Rules Defined, Zero UI)

Teacher                          Student
   |                               |
   └─→ Create class               |
       └─→ Define assignments      |
           └─→ Students enroll     |
               └─→ Submit work     |
                   └─→ Teacher grades

Database Collections:
├── /classes/{classCode}
│   ├── ownerId (teacher)
│   ├── teacherCode
│   ├── studentIds[]
│   └── [access rules defined]
│
├── /classes/{classCode}/assignments/{assignmentId}
│   ├── title, description
│   ├── dueDate
│   └── [students can view]
│
├── /submissions/{submissionId}
│   ├── studentId
│   ├── classCode
│   ├── assignmentId
│   ├── workspaceCode
│   ├── status (draft|submitted|graded)
│   └── grade, feedback
│
└── /teachers/{teacherId}
    ├── name, email
    └── classList[]

Current Status: INFRASTRUCTURE ONLY
- All Firestore rules written
- No UI components
- classCode field in workspace (unused)
- assignClassCode() function in store (unused)
- Marked as deferred to '26 launch
```

---

## 10. CRITICAL GAPS VISUAL

```
IMPLEMENTED ✓              MISSING ✗
════════════════════════  ════════════════════════

✓ Privacy model           ✗ Public page showcase
✓ Publish/unpublish       ✗ Give/ask display
✓ Gallery filtering       ✗ Matching UI
✓ Comment section         ✗ Mentions/notifications
✓ View tracking           ✗ Creator analytics dashboard
✓ SEO metadata            ✗ Impact metrics display
✓ Slug generation         ✗ Team member display
✓ Profile attribution     ✗ Class assignment UI
                          ✗ Acknowledgments display
```

---

**Architecture Last Updated:** November 20, 2025
**Scope:** Public/Private Workspace System
**Status:** Functional core, incomplete showcase features
