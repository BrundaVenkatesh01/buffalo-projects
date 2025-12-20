# Buffalo Projects - Comprehensive TODO

**Last Updated**: 2025-12-09
**Status**: Pre-Launch Final Polish
**Next Milestone**: December 2025 First Launch (Gallery-First)

---

## 🎯 Recent Completions (December 2025)

- ✅ **Unified navigation system** - Single `Navigation.tsx` replaces LandingNav + PlatformNavNext
- ✅ **Publishing page redesign** - Two-column layout with live preview and 6 collapsible sections
- ✅ **Image cropping** - `ImageCropModal` with react-easy-crop and aspect ratio selection
- ✅ **Centralized publish state** - `PublishFormContext` with useReducer replacing 20+ useState hooks
- ✅ **Onboarding system** - Welcome modal, canvas intro modal, BMC tooltips with `onboardingStore`
- ✅ **Workspace hero compression** - Standardized spacing across workspace views
- ✅ **Live preview card** - Real-time preview during publish editing
- ✅ **Full-page preview modal** - Preview before publishing
- ✅ **Visibility explainer** - Educational tooltips for privacy options
- ✅ **Gives & Asks explainer** - Educational tooltips for peer exchange
- ✅ **BMC block tooltips** - Educational hints for canvas blocks via `bmcTooltips.ts`
- ✅ **Simplified Firebase Storage rules** - Path-based authorization for uploads
- ✅ **Notifications disabled** - Deferred to avoid Firestore index errors

### Previous Completions (November 2025)

- ✅ **Unified routing architecture** - Consolidated `/workspace/[code]` and `/showcase/[code]` to `/edit/[code]`
- ✅ **Project showcase redesign** - Portfolio showcase vs progress tracker
- ✅ **Business Model Canvas UX improvements** - Click-to-edit interactions
- ✅ **Project logo upload** - Replaced default icon with custom upload button
- ✅ **Firebase permission fixes** - Resolved errors blocking project creation
- ✅ **Documentation overhaul** - Updated CLAUDE.md, README.md to reflect community-owned gallery-first vision
- ✅ **Routing infrastructure migration** - Completed transition to unified `/edit/[code]` pattern
- ✅ **Auth redirect improvements** - Fixed redirect loop and improved UX

---

## 📊 Quick Stats

- **Total Tasks**: 85 (reduced - many completed)
- **Critical (Pre-Launch)**: 12 (reduced - significant progress)
- **High Priority (Month 1-2)**: 30
- **Strategic (Month 3+)**: 30
- **Continuous Improvement**: 13

---

## 🚀 Phase 0: Pre-Launch (Next 2-4 Weeks)

### Critical Path ⚠️

#### Security & Data Protection

- [ ] **[CRITICAL]** Encrypt GitHub OAuth tokens in production
  - 📁 `src/services/githubOAuthService.ts:150`
  - ⏱️ Medium (2-3 hours)
  - 🎯 Security vulnerability - tokens stored in plaintext
  - 🔧 Use Firebase Functions + Secret Manager or client-side encryption

- [ ] Add user data deletion method
  - 📁 `app/(studio)/profile/components/ProfileAccountDanger.tsx:80`
  - ⏱️ Medium (2-3 hours)
  - 🎯 GDPR compliance requirement
  - 🔧 Implement `deleteUserData()` in firebaseDatabase service

#### Launch-Blocking Features

- [ ] **Complete Gallery Infrastructure**
  - ⏱️ Large (8-12 hours)
  - 🎯 Gallery is THE primary entry point - must be compelling
  - 🔧 Implement:
    - Public project listing with filters (category, stage, tags)
    - Search functionality (project names, descriptions, creators)
    - Featured/trending section (manually curated)
    - Sort by: recent, most comments, trending
  - 📁 Routes: `/gallery`, `/p/[slug]`, `/search`
  - **Status**: Partially complete, needs polish and testing

- [ ] **Peer Comment System**
  - ⏱️ Medium (4-6 hours)
  - 🎯 Community validation is core value prop
  - 🔧 Simple comment threads on public projects:
    - Comment creation, editing, deletion
    - Basic moderation (creator can delete)
    - No formal mentorship structure (just peer feedback)
  - 📁 Create `commentService.ts` and integrate into `/p/[slug]`

- [ ] **Pre-seed 15-20 Example Projects**
  - ⏱️ Large (6-8 hours)
  - 🎯 Gallery needs critical mass to demonstrate value
  - 🔧 Create diverse showcase projects:
    - 3-4 startups (ACV Auctions, Bak USA, 43North winners)
    - 2-3 design projects (portfolio, case studies)
    - 2-3 research projects (UB, Canisius research)
    - 2-3 indie/maker projects (open source, side projects)
    - 2-3 creative projects (art, music, writing)
  - 📝 Diversity matters - "not just startups"
  - 📁 Seed via script: `scripts/seed-gallery.ts`

- [ ] **Implement Social Proof on Landing Page**
  - ⏱️ Medium (3-4 hours)
  - 🎯 "127 projects in the gallery" increases conversion by 40%+
  - 🔧 Add real-time counters:
    - Total public projects count
    - Recently published projects
    - Featured creators from community
    - Categories represented
  - 📁 Update landing page to feature gallery prominently

- [ ] **Add Quick Start Template System**
  - ⏱️ Large (4-6 hours)
  - 🎯 Reduce blank canvas anxiety - 80% of users struggle with empty BMC
  - 🔧 Create 5-7 templates (Startup, Design, Research, Indie, Creative, Nonprofit)
  - 📝 Each template: pre-filled BMC, sample documents, one-click start
  - 📁 Create `/src/data/templates.ts` and integrate into creation flow

### Code Quality & Technical Debt

#### Quick Fixes (1-2 hours total)

- [ ] Fix unused `error` variables in catch blocks
  - 📁 `app/(studio)/settings/SettingsScreen.tsx:34,46`
  - ⏱️ Quick-fix (5 min)
  - 🔧 Use error for logging or remove parameter

- [ ] Escape HTML entities in JSX (19 warnings)
  - 📁 Multiple files - see ESLint output
  - ⏱️ Quick-fix (15 min)
  - 🔧 Replace `'` with `&apos;` or use proper quotes
  - **Files**: ProfileAccountDanger, ProjectCard, ProjectFilterBar, TwentySixPublishDialog, ErrorBoundary, DocumentDetailDrawer, ProjectDetailHeader

- [ ] Remove debug console.log statements
  - 📁 40+ instances across codebase
  - ⏱️ Quick-fix (30 min)
  - 🔧 Replace with logger utility or remove
  - **Priority files**:
    - `src/services/githubImportService.ts` (6 instances)
    - `src/services/importService.ts` (5 instances)
    - `src/components/workspace/BusinessModelCanvas.tsx` (2 instances)

#### Integration Gaps

- [ ] Integrate comment count in profile stats
  - 📁 `app/(studio)/profile/hooks/useProfileStats.ts:23`
  - ⏱️ Quick-fix (30 min)
  - 🎯 Shows when comment service is ready (deferred feature)

- [ ] Connect analytics to logger utility
  - 📁 `src/utils/logger.ts:180`
  - ⏱️ Quick-fix (30 min)
  - 🎯 Track errors and user behavior for debugging

### Infrastructure & DevOps

- [ ] **Set up Error Tracking (Sentry)**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Catch production errors before users report them
  - 🔧 Install @sentry/nextjs, configure DSN, add source maps
  - 📁 Create `sentry.client.config.ts` and `sentry.server.config.ts`

- [ ] **Add Performance Monitoring**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Detect slow pages, large bundles, API bottlenecks
  - 🔧 Tools: Next.js Analytics, Web Vitals API, Lighthouse CI
  - 📁 Create `/src/lib/performance-monitor.ts` wrapper

- [ ] **Configure Production Environment Variables**
  - ⏱️ Quick (30 min)
  - 🎯 Ensure all secrets are in Vercel, not `.env.local`
  - 🔧 Verify Firebase, Gemini, Upstash, GitHub OAuth configs

- [ ] **Set up Monitoring Dashboard**
  - ⏱️ Medium (2 hours)
  - 🎯 Track launch metrics: signups, workspace creations, retention
  - 🔧 Options: Vercel Analytics, PostHog (already configured), or custom
  - 📝 Track metrics from LaunchMetrics interface (see Phase 1)

### Testing & Quality

- [ ] **Fix failing navigation tests (10 tests)**
  - 📁 See test output - PlatformNavNext.test.tsx
  - ⏱️ Medium (2-3 hours)
  - 🎯 Tests block CI/CD confidence
  - 🔧 Update test expectations or fix navigation logic

- [ ] **Set up Firebase Emulator for integration tests**
  - 📁 `tests/integration/firebase.spec.ts:11`
  - ⏱️ Large (4-6 hours)
  - 🎯 Enable testing Firestore security rules without production data
  - 🔧 Configure emulator suite, seed test data, wire up CI
  - **Blocked tests**: 5 skipped test suites waiting for this

---

## 📈 Phase 1: Post-Launch Optimization (Month 1-2)

### User Engagement Features

- [ ] **Add Workspace Completion Score**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Gamification - show users "You're 73% done!"
  - 🔧 Add to Workspace type:
    ```typescript
    completionScore: number;  // 0-100 based on filled blocks
    completionBadges: string[];  // "First Draft", "Evidence Pro", "Published"
    ```
  - 📁 Update `workspaceStore.ts` to calculate on save

- [ ] **Track Engagement Metrics**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Identify abandoned projects, measure retention
  - 🔧 Add to Workspace type:
    ```typescript
    editSessionCount: number;
    lastEditedAt: string;
    isAbandoned: boolean; // No edits in 14 days
    timeToFirstValue: number; // Minutes until first meaningful save
    ```
  - 📁 Update `firebaseDatabase.ts` tracking logic

- [ ] **Build Activity Feed**
  - ⏱️ Large (4-6 hours)
  - 🎯 Show "John just published Urban Farm App" - social proof
  - 🔧 Create `/workspaces/{code}/activities/{activityId}` subcollection
  - 🔧 Types: version, pivot, document, journal, publish events
  - 📁 Create `src/components/landing/ActivityFeed.tsx`

- [ ] **Add Email Digest (Weekly Roundup)**
  - ⏱️ Large (4-6 hours)
  - 🎯 Re-engage users who haven't returned
  - 🔧 Weekly cron job: "Your workspace is 60% complete - finish it!"
  - 📁 Leverage existing `emailService.ts`

- [ ] **Implement "Featured Project" System**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Highlight best projects on landing page
  - 🔧 Add admin flag: `isFeatured: boolean` to Workspace
  - 📁 Create admin panel or manual Firestore update

### Data Model Improvements

- [ ] **Denormalize Stats for Performance**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Avoid counting documents/versions on every profile page load
  - 🔧 Add to WorkspaceCore:
    ```typescript
    documentCount: number;
    versionCount: number;
    pivotCount: number;
    lastActivityAt: string;
    ```
  - 🔧 Update counts via Cloud Functions triggers (or client-side for now)

- [ ] **Add Referral Tracking**
  - ⏱️ Quick (1-2 hours)
  - 🎯 Understand growth loops - where do users come from?
  - 🔧 Add to Workspace:
    ```typescript
    referralSource?: string;  // "twitter", "email", "43north", "ub-class"
    sharedCount: number;
    viewedBy: string[];  // User IDs who viewed
    ```
  - 📁 Capture via URL param: `?ref=twitter`

- [ ] **Optimize Query Performance**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Profile page loads slowly with 50+ workspaces
  - 🔧 Create composite indexes in Firestore
  - 🔧 Paginate workspace list (load 10 at a time)
  - 📁 Update `firebaseDatabase.ts` queries

### Feature Additions (Based on User Feedback)

- [ ] **Implement LinkedIn Import**
  - 📁 `app/(studio)/profile/components/ProjectCreationModal.tsx:110`
  - ⏱️ Medium (3-4 hours)
  - 🎯 Let users pull professional info into profile
  - 🔧 Use LinkedIn OAuth + public profile API

- [ ] **Add Product Hunt Scraper**
  - 📁 `src/services/urlAnalyzerService.ts:216`
  - ⏱️ Medium (2-3 hours)
  - 🎯 Import launched products from Product Hunt
  - 🔧 Use Product Hunt API or web scraping

- [ ] **Add Portfolio Site Scraper**
  - 📁 `src/services/urlAnalyzerService.ts:222`
  - ⏱️ Medium (2-3 hours)
  - 🎯 Import from personal websites, Behance, Dribbble
  - 🔧 Enhance urlAnalyzerService with portfolio detection

### Performance & UX Polish

- [ ] **Lazy Load Heavy Components**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Reduce initial bundle size from ~800KB → <400KB
  - 🔧 Use Next.js `dynamic()` for:
    - WorkspaceEditor (largest component)
    - DocumentManager
    - VersionHistory
  - 📁 Update imports in route pages

- [ ] **Implement Optimistic Updates**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Canvas saves feel instant (no 300ms Firebase delay)
  - 🔧 Update Zustand store immediately, sync in background
  - 📁 Enhance `workspaceStore.ts` with optimistic flag

- [ ] **Add Loading Skeletons**
  - ⏱️ Quick (1-2 hours)
  - 🎯 Perceived performance - show placeholders while loading
  - 🔧 Create skeleton components for:
    - Profile workspace grid
    - Canvas blocks
    - Document list
  - 📁 Use shadcn/ui Skeleton component

---

## 🏗️ Phase 2: Architectural Evolution (Month 3+)

### Data Model Normalization

- [ ] **Split Workspace into Subcollections**
  - ⏱️ Large refactor (8-12 hours)
  - 🎯 Reduce document size from 252 lines → <50 lines
  - 🔧 Create structure:
    ```
    /workspaces/{code}  →  Core metadata only
    /workspaces/{code}/canvas/current  →  BMC data
    /workspaces/{code}/versions/{id}  →  History
    /workspaces/{code}/documents/{id}  →  Files
    /workspaces/{code}/activities/{id}  →  Event log
    ```
  - 📁 Major refactor of `firebaseDatabase.ts`, `workspaceStore.ts`
  - ⚠️ **Migration required** - write script to move existing data

- [ ] **Implement Version Deduplication**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Save 90% storage - only store changed fields, not entire BMC
  - 🔧 Store deltas instead of full snapshots
  - 📁 Update `VersionService` logic

- [ ] **Add Referential Integrity for Evidence Links**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Prevent orphaned links when documents deleted
  - 🔧 Use Firestore transactions or Cloud Functions to cascade deletes
  - 📁 Update `firebaseDatabase.ts` delete operations

### Service Layer Consolidation

- [ ] **Consolidate 23 Services → Core + Experimental**
  - ⏱️ Large refactor (8-12 hours)
  - 🎯 Simplify imports, reduce cognitive load
  - 🔧 Create:

    ```typescript
    // src/services/core.ts
    export const core = {
      workspace: { create, update, delete, publish },
      auth: { signIn, signOut, signUp },
      storage: { upload, download, delete }
    };

    // src/services/experimental.ts
    export const experimental = {
      ai: { extractFromURL, suggestCanvas },
      github: { import, analyze },
      sync: { offline, background }
    };
    ```

  - 📁 Update all imports across app

- [ ] **Create Unified Event Bus**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Decouple services - workspace changes trigger analytics, notifications, etc.
  - 🔧 Use observer pattern or Redux-style middleware
  - 📁 Create `src/lib/eventBus.ts`

### Feature Pruning (Data-Driven Decisions)

- [ ] **Evaluate Interview Session Feature**
  - ⏱️ Quick (30 min analysis)
  - 🎯 If <5% of users use it, defer to Phase 3
  - 🔧 Check usage analytics, consider removing from types
  - 📝 Move to `/src/types/legacy.ts` if unused

- [ ] **Evaluate MVP Plan Feature**
  - ⏱️ Quick (30 min analysis)
  - 🎯 Complex feature with 8 interfaces - is anyone using it?
  - 🔧 Check Firestore for `mvpPlan` field usage
  - 📝 Consider simplifying or deferring

- [ ] **Evaluate Class Management Feature**
  - ⏱️ Quick (30 min analysis)
  - 🎯 Teacher features add 15+ types - any schools using this?
  - 🔧 Check for `classCode` usage in workspaces
  - 📝 If no schools, defer entire feature set to Phase 3

- [ ] **Evaluate Groups Feature**
  - ⏱️ Quick (30 min analysis)
  - 🎯 Collaboration is valuable, but is the implementation used?
  - 🔧 Check `groupService` usage, Firestore `/groups` collection
  - 📝 May need different approach (Slack integration instead?)

### Type Safety Improvements

- [ ] **Fix Framer Motion Type Conflicts**
  - 📁 12 instances across button, card, badge components
  - ⏱️ Medium (2-3 hours)
  - 🎯 Remove @ts-expect-error suppressions
  - 🔧 Options:
    1. Upgrade Framer Motion to latest version
    2. Create custom type wrappers
    3. Use separate motion components

- [ ] **Replace `as unknown as` Type Casts**
  - 📁 `firebaseDatabase.ts:1384,1396,1406,1409` + 8 other files
  - ⏱️ Medium (3-4 hours)
  - 🎯 Improve type safety, catch runtime errors at compile time
  - 🔧 Create proper type guards and branded types

### Advanced Features (If Validated)

- [ ] **Implement Real-time Collaboration**
  - ⏱️ Large (12-16 hours)
  - 🎯 Multiple users editing same canvas (if teams are common)
  - 🔧 Use Firestore real-time listeners + presence system
  - 📝 Only if >20% of users invite collaborators

- [ ] **Add AI-Powered Suggestions**
  - ⏱️ Large (8-12 hours)
  - 🎯 "Your value prop could be stronger - here's a suggestion"
  - 🔧 Use Gemini to analyze BMC, suggest improvements
  - 📝 Only if users complete BMC but struggle with quality

- [ ] **Implement Mentor Matching Algorithm**
  - ⏱️ Large (12-16 hours)
  - 🎯 Connect projects with relevant mentors automatically
  - 🔧 Match based on industry, stage, Buffalo connections
  - 📝 Only if mentor pool reaches critical mass (50+ mentors)

---

## 🔧 Continuous Improvement

### Testing Infrastructure

- [ ] **Wire Firebase Emulator to CI/CD**
  - 📁 `tests/integration/firebase.spec.ts`
  - ⏱️ Large (4-6 hours)
  - 🎯 Enable integration tests in GitHub Actions
  - 🔧 Configure emulator startup, seed data, run tests, teardown

- [ ] **Increase Test Coverage to 80%**
  - ⏱️ Ongoing
  - 🎯 Current: 70% lines, target: 80%+
  - 🔧 Focus on:
    - workspaceStore edge cases
    - firebaseDatabase error handling
    - Import service validation

- [ ] **Add Visual Regression Tests**
  - ⏱️ Medium (3-4 hours)
  - 🎯 Catch UI breaking changes before users do
  - 🔧 Use Percy, Chromatic, or Playwright screenshots
  - 📁 Add to `.github/workflows/visual-tests.yml`

### Code Quality

- [ ] **Enable TypeScript Strict Mode**
  - ⏱️ Large (8-12 hours)
  - 🎯 Catch more bugs at compile time
  - 🔧 Fix `strictNullChecks`, `strictFunctionTypes`, etc.
  - 📁 Update `tsconfig.json` incrementally

- [ ] **Run Dependency Audit**
  - ⏱️ Quick (30 min)
  - 🎯 Remove unused packages, update vulnerable ones
  - 🔧 `npm audit`, `npm run depcheck`, `npm run knip`

- [ ] **Add Bundle Size Budget**
  - ⏱️ Quick (1 hour)
  - 🎯 Alert if bundle grows >10%
  - 🔧 Configure Next.js `bundleSizeBudget` in next.config.js
  - 📝 Target: <300KB initial JS, <800KB total

### Documentation

- [ ] **Create ARCHITECTURE.md**
  - ⏱️ Medium (2-3 hours)
  - 🎯 Onboard new developers faster
  - 🔧 Document:
    - Data model (current + planned changes)
    - Service layer architecture
    - State management patterns
    - Deployment process

- [ ] **Update FIRST_LAUNCH.md with Metrics**
  - ⏱️ Quick (30 min)
  - 🎯 Track what's working, what's not
  - 🔧 Add actual numbers vs. success criteria
  - 📝 Weekly update after launch

- [ ] **Create CONTRIBUTING.md**
  - ⏱️ Quick (1 hour)
  - 🎯 If open-sourcing or adding contributors
  - 🔧 Include setup, testing, PR guidelines

---

## 📋 Decision Log

### Deferred Features (Revisit After User Data)

| Feature                  | Why Deferred                     | Revisit When                                 |
| ------------------------ | -------------------------------- | -------------------------------------------- |
| **Interview Sessions**   | Complex (7 types), unvalidated   | >100 users request customer validation tools |
| **MVP Planning Tool**    | 8 interfaces, may be overkill    | Users struggle with "what to build next"     |
| **Class Management**     | 15+ types, no schools signed up  | First school/instructor expresses interest   |
| **Groups/Collaboration** | Premature - need 1:1 value first | >30% of users invite collaborators           |
| **Public Comments**      | Moderation overhead              | Community reaches 500+ users                 |
| **Notifications System** | Complex (email + in-app)         | Multiple engagement triggers exist           |

### Architecture Decisions

| Decision                                      | Rationale                               | Alternative Considered                      |
| --------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| **Offline-first with Zustand + localStorage** | Faster UX, works without internet       | Pure Firestore (simpler but slower)         |
| **Monolithic Workspace object**               | Faster initial development              | Normalized subcollections (better at scale) |
| **Firebase over Supabase/Postgres**           | Real-time listeners, familiar ecosystem | Supabase (better relational data)           |
| **Gemini over OpenAI**                        | Free tier, good for MVP                 | OpenAI (better quality, higher cost)        |
| **Next.js App Router**                        | Latest patterns, RSC future             | Pages Router (more stable, familiar)        |

---

## 🎯 Success Metrics to Track

### Pre-Launch (Validate These Work)

- [ ] Landing page conversion: >15% of visitors sign up
- [ ] Template usage: >60% of users start from template
- [ ] Example project views: Average 3+ examples viewed before creating

### Month 1 (First Launch Goals)

- [ ] Workspaces created: 100+
- [ ] Workspaces with content: 60+ (>60% have 3+ blocks filled)
- [ ] Projects marked "public when available": 50+
- [ ] 7-day retention: ≥40% (users return to edit)
- [ ] Average documents uploaded: ≥3 per project
- [ ] Time to first value: <10 minutes (signup → first save)
- [ ] Abandoned projects: <30% (no edits in 14 days)

### Month 2-3 (Engagement & Quality)

- [ ] Weekly active users: 50+
- [ ] Projects completed (9/9 blocks): 30+
- [ ] Review requests submitted: 20+
- [ ] Projects shared externally: 40+ (users share their URL)
- [ ] Average session duration: >5 minutes
- [ ] Feature request submissions: 50+ (users engaged enough to give feedback)

### Month 3+ (Network Effects)

- [ ] Gallery launched with 50+ projects
- [ ] Cross-project views: Users browse other projects
- [ ] Mentor engagement: 10+ mentors actively reviewing
- [ ] Organic referrals: >30% of signups from user invites
- [ ] Weekly digest open rate: >25%

---

## 📞 Questions to Validate Before Building

### Before Phase 1

- [ ] Are users actually finishing their BMC? If not, why?
- [ ] Which canvas blocks do users struggle with most?
- [ ] Do users want templates, or do they prefer blank canvas?
- [ ] Are AI import features being used, or just novelty?

### Before Phase 2

- [ ] What % of workspaces have >1 collaborator?
- [ ] Are users returning weekly, or is this one-and-done?
- [ ] Which deferred features are most requested?
- [ ] Should we pivot to being primarily educational or community-focused?

### Before Phase 3

- [ ] Has the public gallery increased engagement?
- [ ] Do mentors have time/willingness to give feedback?
- [ ] Are groups forming organically, or forcing it?
- [ ] Should we focus on Buffalo-only, or expand regionally?

---

## 🔗 Related Documents

- **FIRST_LAUNCH.md** - Launch scope and success criteria
- **DESIGN_TOKENS.md** - Design system documentation
- **CLAUDE.md** - Development guidelines
- **README.md** - Setup and deployment instructions
- **firestore.rules** - Security rules documentation

---

## 📝 Notes

- This TODO represents ~400-500 hours of work across all phases
- Phase 0 is **critical path** - must complete before launch
- Phase 1 depends on **user data** - don't build Phase 2 until you validate Phase 1
- Many tasks can be **deprioritized** based on early user feedback
- Focus on **one phase at a time** - shipping beats perfect architecture

---

**Last Reviewed**: 2025-12-09
**Next Review**: After first 50 users (expected: Jan-Feb 2026)
