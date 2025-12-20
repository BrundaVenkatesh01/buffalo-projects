# Buffalo Projects Terminology Guide

**Version:** 2.0
**Last Updated:** November 12, 2025
**Status:** Active

This document defines the official terminology for Buffalo Projects to ensure consistency across code, UI, documentation, and user communication.

---

## Core Concepts

### Project (User-Facing Term)

**Definition:** The primary user-facing term for what users create, edit, and publish on Buffalo Projects.

**Usage:**

- ✅ **Correct:** "Create a new project", "Your projects", "Edit project", "Project settings"
- ❌ **Avoid:** "Create a new workspace", "Your workspaces", "Edit workspace"

**Examples:**

```tsx
// UI Copy
<Button>Create Project</Button>
<h1>My Projects</h1>
<p>Edit your project details</p>

// Page Titles
"Dashboard | Buffalo Projects"
"Edit Project | Buffalo Projects"
```

---

### Workspace (Internal Term)

**Definition:** The technical TypeScript type and database entity that represents a project.

**Usage:**

- ✅ **Correct:** `Workspace` type, `workspaceStore`, `loadWorkspace()`, Firestore collection
- ❌ **Avoid:** Using "workspace" in user-facing copy, buttons, or UI text

**Examples:**

```typescript
// Types & Code
interface Workspace { ... }
const workspace: Workspace = ...;
useWorkspaceStore()
loadWorkspace(code)

// Firestore
workspaces/BUF-XXXX
```

**Why the separation?**

- Internal: "Workspace" is technical and descriptive of the data structure
- External: "Project" is friendly and familiar to users from other platforms

---

### Project Types

**Two flavors of projects exist:**

#### 1. Showcase Project

- **Purpose:** Profile-style project page with links, images, description
- **Editor:** Form-based editor at `/edit/[code]`
- **Best for:** Showcasing completed projects, portfolios, public demos
- **Database field:** `projectType: "showcase"`

#### 2. Business Model Project

- **Purpose:** Full Business Model Canvas with 9 blocks and evidence management
- **Editor:** Canvas grid editor at `/edit/[code]`
- **Best for:** Active projects in development, validation work, structured planning
- **Database field:** `projectType: "workspace"` or `undefined` (legacy)

**Terminology in UI:**

- When differentiating types for users, use:
  - "Showcase Project" (not just "showcase")
  - "Business Model Project" (not "workspace project")
- Example: "Create a Showcase Project or Business Model Project"

---

## URL Structure

### Current (v2.0)

| Path                  | Purpose                                                                 | Auth Required |
| --------------------- | ----------------------------------------------------------------------- | ------------- |
| `/`                   | Public landing page                                                     | No            |
| `/dashboard`          | User's project hub (was `/profile`)                                     | Yes           |
| `/dashboard/discover` | Browse community (was `/gallery`)                                       | Yes           |
| `/dashboard/activity` | Notifications & updates                                                 | Yes           |
| `/dashboard/settings` | User settings                                                           | Yes           |
| `/edit/[code]`        | Unified project editor (was `/workspace/[code]` and `/showcase/[code]`) | Yes           |
| `/p/[slug]`           | Public project showcase page                                            | No            |

### Legacy (Deprecated, redirects active)

| Old Path            | New Path              | Redirect Status       |
| ------------------- | --------------------- | --------------------- |
| `/profile`          | `/dashboard`          | 301 Permanent         |
| `/gallery`          | `/dashboard/discover` | 301 Permanent         |
| `/workspace/[code]` | `/edit/[code]`        | 301 Permanent         |
| `/showcase/[code]`  | `/edit/[code]`        | 301 Permanent         |
| `/project/[id]`     | `/edit/[id]`          | Active (smart router) |

**When to use which:**

- **Code:** Use `const url = getProjectEditUrl(code)` from `projectUrls.ts`
- **Links:** Always link to `/edit/[code]` for editing, `/p/[slug]` for public view
- **Never:** Hardcode `/workspace/` or `/showcase/` URLs

---

## Navigation Labels

### Authenticated Users

| Label         | Destination           | Notes                            |
| ------------- | --------------------- | -------------------------------- |
| **Dashboard** | `/dashboard`          | Primary hub (was "Profile")      |
| **Discover**  | `/dashboard/discover` | Browse community (was "Gallery") |
| **'26**       | `/26`                 | TwentySix program                |

**Logo click behavior:**

- Logged in → `/dashboard`
- Logged out → `/`

### Public Users

| Label         | Destination  | Notes         |
| ------------- | ------------ | ------------- |
| **Home**      | `/`          | Landing page  |
| **About**     | `/about`     | Platform info |
| **Resources** | `/resources` | Guides & docs |

---

## Button & CTA Language

### Creation Flow

```tsx
// ✅ Correct
<Button>Create Project</Button>
<Button>New Project</Button>
<Dialog title="Create New Project">
  <Option>Showcase Project</Option>
  <Option>Business Model Project</Option>
</Dialog>

// ❌ Avoid
<Button>Create Workspace</Button>
<Button>New Studio</Button>
<Dialog title="Create Workspace">
```

### Actions

| Action      | Correct Label      | Avoid               |
| ----------- | ------------------ | ------------------- |
| Edit        | "Edit Project"     | "Edit Workspace"    |
| Delete      | "Delete Project"   | "Delete Workspace"  |
| Publish     | "Publish Project"  | "Publish Workspace" |
| Share       | "Share Project"    | "Share Workspace"   |
| View Public | "View Public Page" | "View Showcase"     |

---

## Code Naming Conventions

### Components

```tsx
// ✅ Correct
DashboardScreen; // (was ProfileScreen)
ProjectCard; // (not WorkspaceCard)
ProjectDetailPage; // (not WorkspaceDetailPage)
UnifiedProjectEditor; // (not WorkspaceEditor)

// ❌ Avoid
ProfileScreen; // Use DashboardScreen
WorkspaceCard; // Use ProjectCard
ShowcaseCard; // Use ProjectCard with type handling
```

### URLs & Routing

```typescript
// ✅ Correct
/dashboard               // User hub
/edit/[code]             // Unified editor
/dashboard/discover      // Browse community

// ❌ Deprecated (redirects active)
/profile
/workspace/[code]
/showcase/[code]
/gallery
```

### Stores & Services

```typescript
// Keep existing names (internal consistency)
useWorkspaceStore(); // ✅ OK - internal code
workspaceStore.ts; // ✅ OK - internal code
loadWorkspace(code); // ✅ OK - internal function

// But UI strings should say "project"
toast.success("Project saved"); // ✅ Correct
toast.error("Failed to load project"); // ✅ Correct
```

---

## Migration Checklist

When adding new features or updating existing ones:

- [ ] User-facing strings use "Project" (not "Workspace")
- [ ] Navigation uses "Dashboard" and "Discover" (not "Profile" and "Gallery")
- [ ] Edit URLs use `/edit/[code]` (not `/workspace/` or `/showcase/`)
- [ ] Public view URLs use `/p/[slug]`
- [ ] Internal code can use `Workspace` type
- [ ] Import URLs from `projectUrls.ts` utilities
- [ ] Button CTAs follow the patterns above
- [ ] Page titles/metadata use "Project" terminology

---

## Common Mistakes & Fixes

### ❌ Mistake 1: Mixing terminology

```tsx
// Bad
<h1>Your Workspaces</h1>
<Button>Create New Project</Button>
```

```tsx
// Good
<h1>Your Projects</h1>
<Button>Create New Project</Button>
```

### ❌ Mistake 2: Hardcoded URLs

```tsx
// Bad
<Link href={`/workspace/${code}`}>Edit</Link>
```

```tsx
// Good
import { getProjectEditUrl } from "@/utils/projectUrls";
<Link href={getProjectEditUrl(code)}>Edit</Link>;
```

### ❌ Mistake 3: Legacy route group references

```tsx
// Bad
import { ProfileScreen } from "@/app/(studio)/profile/ProfileScreen";
```

```tsx
// Good
import { DashboardScreen } from "@/app/(app)/dashboard/DashboardScreen";
```

---

## Special Cases

### When to use "Workspace"

Only in these contexts:

1. TypeScript types: `Workspace`, `WorkspaceStore`
2. Database references: Firestore `workspaces` collection
3. Internal function names: `loadWorkspace()`, `saveWorkspace()`
4. Store names: `workspaceStore.ts`, `useWorkspaceStore()`
5. Comments/docs explaining internal architecture

### When to distinguish project types

Only when users need to choose or understand the difference:

1. **Creation modal:** "Choose project type: Showcase or Business Model"
2. **Feature availability:** "BMC Canvas is only available for Business Model Projects"
3. **Import flows:** "Imported projects are created as Showcase Projects"

Otherwise, just say "project" generically.

---

## Questions?

**When in doubt:**

- User sees it → "Project"
- Code/internal → "Workspace" is OK
- URLs → Use `/edit/` and `/dashboard/`
- Navigation → "Dashboard" and "Discover"

**For clarification or updates to this guide:**

- File an issue or create a PR with the proposed change
- Tag with `documentation` label

---

**Last Audit:** November 12, 2025
**Next Review:** March 2026 or when new major features are added
