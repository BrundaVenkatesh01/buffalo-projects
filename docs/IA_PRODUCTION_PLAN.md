# Buffalo Projects — IA + Product Design Plan to Production

Last updated: 2025-10-07

## 1) Product Goals & Success

- North Star: Weekly Active Workspaces (WAW) completing a guided step
- Activation: % of new users creating a workspace and making a first Canvas entry in session 1
- Retention: 7-day return rate; % groups with weekly progress
- Satisfaction: Task completion success, AI suggestion helpfulness rating
- Readiness: A11y AA checks, perf budgets met, zero known P0 bugs

## 2) Information Architecture (IA)

- Global Navigation (top): Explore | My Work | Resources | Groups | Profile
- Workspace Navigation (left): Hub | Canvas | Lean | MVP | Interviews | Journal | Documents | Share
- Site Map (routes)
  - `/` (Landing)
  - `/explore` (Public Projects: filterable gallery)
  - `/resources` (Resource hub)
  - `/signin`, `/signup` (Auth)
  - `/dashboard` (My Work overview)
  - `/group` (Group dashboard for leaders)
  - `/group/new`, `/group/:id` (Create/manage group)
  - `/workspace/new` (Create workspace)
  - `/workspace/:code` (Workspace Hub)
  - `/p/:code` (Public profile)
- Content Model
  - User, Group (id, name, code, members), Workspace (code, ownerId, groupId?, visibility)
  - Tool Data (canvas entries, interviews, mvp items), JournalEntry, Document
- Labeling & Copy
  - Use “Group,” “Group leader,” “Participants” consistently
  - Primary actions use verb-first labels (e.g., “Create Group”, “Start Workspace”)
  - Secondary/helper copy stays under two short sentences, active voice
  - Breadcrumb labels mirror navigation names; final crumb is current view
- Search & Discovery
  - Explore filters: category, stage, tags; sort by recency/popularity
  - Resources: category taxonomy + keyword search

## 3) Page Templates & States

- Templates
  - Landing: value prop, Start a Project, Join with Group Code
  - Dashboard: recent workspaces, quick actions, join/create group
  - Explore: filters, cards, pagination
  - Group: stats, roster, progress, assignments/templates
  - Workspace Hub: tool cards, progress checklist, next best step
  - Tools: Canvas, Lean, MVP, Interviews — consistent layout + help
  - Resources: directory grid + details drawer
  - Public Profile: shareable read-only view
- Required States (every page)
  - Loading (skeletons), Empty (guided CTA), Error (recovery), Success
  - Offline indicator with retry + local save

## 4) Component Inventory (Design System)

- Navigation: PlatformNav (desktop/mobile), WorkspaceSidebar, Breadcrumbs
- Actions: Primary/Secondary/Ghost Buttons, Icon Buttons, Split Buttons
- Inputs: Text/Area, Select, Switch, Slider, Tags, Date, File Upload
- Content: Cards (project/resource/tool), Tables (progress), Badges, Tabs
- Feedback: Toasts, Banners, Dialogs/Sheets, Progress, Skeletons
- Accessibility
  - Keyboard: focus order, skip links, esc/enter/space semantics
  - ARIA: roles/labels for nav, dialogs, tabs, alerts
  - Color contrast AA, motion-reduced variants

## 5) Flows to Complete (End-to-End)

- Onboarding
  - Start a Project → workspace created (BUF-XXXX) → checklist shown
  - Join Group (code) → associate workspace → show group context chip
- Workspace Core
  - Checklist of 5 steps (Canvas first entry, Interview added, MVP item added, Journal entry, Publish preview)
  - “Next best step” based on missing items; contextual help
- Group Leader
  - Create Group → share code → see roster & progress -> export snapshot
  - Templates: assignment overview with links to tools
- Publish
  - Configure profile fields → preview → toggle public → copy link
- Documents
  - Upload (Storage if signed-in; local if not) → preview/summary if supported
- AI Assistance
  - Inline “Ask for help” in text areas; accept/insert suggestions with change highlighting

## 6) Analytics & Observability

- Events (name, props)
  - workspace_created {source}
  - canvas_first_edit {tool, length}
  - interview_added {count}
  - mvp_item_added {priority}
  - journal_entry_added {length}
  - workspace_published {visibility}
  - group_created {size}
  - participant_joined {method}
  - ai_used {tool}
  - ai_feedback_rated {score}
- Sentry
  - Initialize at app entry; scrub PII; tag route, user role (anonymous/auth)
  - Error categories: network, firebase, storage, ai, UI

## 7) Delivery Plan (4–6 Weeks)

- Week 1 — Foundation & IA Lock (P0)
  - Confirm nav labels/routes and site map; finalize copy guidelines
  - Build PlatformNav + WorkspaceSidebar + Breadcrumbs
  - Instrument core events; Sentry initialization behind env flag
  - DOD: A11y keyboard/ARIA for nav components, responsive
- Week 2 — Workspace Hub & Checklist (P0)
  - Hub template with tool cards, progress checklist, next-step logic
  - Empty/error/offline states; skeletons
  - DOD: Activation measured; a11y pass; tests for checklist logic
- Week 3 — Group Dashboard (P0)
  - Create group, share code, roster, progress table, exports
  - DOD: Group events tracked; empty/error states; a11y
- Week 4 — Tools Polish & AI (P1)
  - Consistent layouts for Canvas/Lean/MVP/Interviews + inline AI
  - DOD: Perf budget page < 200KB gzipped per route; lazy-load heavy bits
- Week 5 — Publish & Explore (P1)
  - Publish flow; public profile; Explore filters and cards
  - DOD: Indexable metadata; social preview; a11y and perf checks
- Week 6 — Quality & Launch Prep (P2)
  - a11y (axe) suite, integration tests for key flows
  - Docs: Help content, getting started, support/contact
  - DOD: All P0/P1 bugs closed; docs complete; go/no-go checklist green

## 8) Acceptance Criteria (Go/No-Go)

- Navigation consistent and accessible on all pages
- Onboarding to first Canvas edit < 2 minutes
- Group creation-to-roster visible flow works end-to-end
- Publish and share public profile without errors
- Core analytics events visible; Sentry receiving reports
- Performance: initial route TTI < 3s, route transitions < 1s
- A11y: No critical issues (axe) on key pages

## 9) Risks & Mitigations

- Terminology drift (Class vs Group) → Standardize labels; code rename via alias + migration
- Offline vs Firebase sync conflicts → clear fallback + sync queue messages
- Heavy libraries → split/lazy-load; avoid loading AI libs on non-AI pages
- Privacy/PII in analytics → minimal properties; opt-in flags; DSN/IDs via env

## 10) Launch Plan

- Feature flags for publish, groups, AI usage limits
- Domain/DNS, SEO basics, analytics dashboards
- Support: feedback link, issue templates, status doc
- Post-launch: weekly UX reviews, bug triage, roadmap iteration
