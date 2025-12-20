# Next.js Migration Checklist – Buffalo Projects

> Goal: Move Buffalo Projects from the current Vite + React Router stack to a production-ready Next.js (App Router) implementation that matches the MVP wedge (public project pages → mentor triage → qualified intros).

## 0. Decision & Readiness

- [ ] Confirm tech direction: Next.js App Router + Turbopack dev, Tailwind, shadcn.
- [ ] Assign owners for client migration, API routes, Firebase adapters, and QA.
- [ ] Freeze/new work on legacy React Router pages except hotfixes.
- [ ] Capture current env vars and secrets; plan rotation post-migration.
- [ ] Snapshot Lighthouse/perf budgets for baseline comparison.

## 1. Repository & Tooling Setup

- [ ] Install Next.js dependencies (`next`, `react`, `react-dom`) and update scripts (`dev`, `build`, `start`, `lint`, `test`).
- [ ] Configure `next.config.js` with:
  - [ ] Experimental App Router features needed (if any).
  - [ ] Image domains / remotePatterns for evidence assets.
  - [ ] `headers()`/`rewrites()` stubs for Firebase / API forwarding.
- [ ] Update `tsconfig.json` path aliases (`@/*`) to match Next.js resolution; remove Vite-specific config.
- [ ] Replace `vite.config.ts` + `vitest.config.ts` with Next.js CLI equivalents (use `next lint`, `next test` or keep Vitest where valuable).
- [ ] Wire ESLint with `next/core-web-vitals` rules; ensure Prettier integration still works.
- [ ] Update `package-lock.json` / `pnpm-lock.yaml` accordingly.

## 2. Directory & Routing Structure

- [ ] Create `/app` directory with:
  - [ ] `layout.tsx` for global shell (font, theme, analytics, Toaster).
  - [ ] `page.tsx` redirecting `/` → `/projects`.
  - [ ] Shared route groups for `/(public)` and `/(auth)` flows to handle nav variants.
- [ ] Implement top-level surfaces as App Router routes:
  - [ ] `/projects/page.tsx` – public gallery (SSR).
  - [ ] `/p/[slug]/page.tsx` – public project profile (SSR, copy-protected).
  - [ ] `/collections/[slug]/page.tsx`.
  - [ ] `/digest/[id]/page.tsx`.
  - [ ] `/studio/page.tsx` (dashboard).
  - [ ] `/studio/new/page.tsx` (instant canvas).
  - [ ] `/project/[id]/page.tsx` + `/project/[id]/review/page.tsx`.
  - [ ] `/groups/page.tsx`, `/groups/[id]/page.tsx`, `/groups/[id]/overview/page.tsx`, `/groups/[id]/digest/page.tsx`.
  - [ ] `/mentor/page.tsx`.
  - [ ] `/search/page.tsx`.
  - [ ] `/settings/*`.
  - [ ] `/signin`, `/signup`.
  - [ ] Static `/about`, `/support`, `/coc`.
- [ ] Add `loading.tsx`, `error.tsx` states per critical route.
- [ ] Ensure `metadata` export provides SEO/OG tags for public pages.

## 3. Layout Shell & Navigation

- [ ] Build shared `TopNav` component (Logo • Search • Create menu • Notifications • Profile).
- [ ] Add left rail navigation for authenticated builders (My Projects, Groups, Collections, Mentor Mode).
- [ ] Implement responsive variants (drawer for mobile).
- [ ] Wire `next/link`, `usePathname`, and `useRouter` replacements.
- [ ] Introduce `Create` modal with quick actions (Project/Collection/Group).

## 4. Data & State Layer Migration

- [ ] Replace direct `React Router` navigation with `next/navigation` hooks.
- [ ] Refactor Zustand stores to be `use client` safe modules; extract server interactions into dedicated services/adapters.
- [ ] Introduce data-fetching utilities using `@tanstack/react-query` or Next.js `fetch` caching (decide single strategy).
- [ ] Define API adapter layer that maps between new `Project`/`Group` domain types and Firestore collections.
- [ ] Implement Firestore dual-write strategy (legacy `workspaces` + new `projects` collection) or migration script.
- [ ] Update `firebaseDatabase` service into composable modules (client vs server usage).
- [ ] Ensure server components never import `firebase/app`; use server-side admin SDK if needed or proxy through API routes.

## 5. API Routes (pages → server)

- [ ] Scaffold Next.js route handlers under `/app/api/*`:
  - [ ] `POST /api/projects` (create draft).
  - [ ] `PATCH /api/projects/[id]` (update canvas).
  - [ ] `POST /api/projects/[id]/publish`.
  - [ ] `POST /api/comments` and nested actions.
  - [ ] `POST /api/offers`, `/api/offers/[id]/accept`.
  - [ ] `GET /api/mentor/feed`.
  - [ ] `POST /api/groups`, `/api/groups/[id]/nudge`, `/api/digests`.
- [ ] Connect route handlers to Firebase Admin SDK (using service account) or call existing Cloud Functions.
- [ ] Implement RBAC guard middleware (owner, mentor, lead checks).
- [ ] Add API validation layer (zod/io-ts) to enforce payload shapes.

## 6. UI Feature Parity & Enhancements

- [ ] Builder Canvas:
  - [ ] Rebuild canvas page with `use client` sections, autosave (React Query mutations or custom hooks).
  - [ ] Publish gate sidebar, AI summary (placeholder ok), evidence uploader connecting to Storage.
  - [ ] Snapshot/PDF export integration (e.g., `@react-pdf/renderer` or serverless print).
- [ ] Public Project Profile:
  - [ ] Copy-blocked layout, featured evidence, proof chips, updates timeline.
  - [ ] Intro request form hitting new API route.
  - [ ] Blueprint badge gating.
- [ ] Mentor Mode:
  - [ ] Server-rendered filters + cards, shortlist + note actions.
  - [ ] Saved filters hooking into digests.
- [ ] Groups / Lead Overview:
  - [ ] Data table with checklists, private instructor notes, pass/needs toggles.
  - [ ] Bulk nudge drawer, digest composer with drag-and-drop.
- [ ] Search & Collections:
  - [ ] Global search modal (Cmd+K), server route for fuzzy results.
  - [ ] Collection builder and public view.
- [ ] Auth:
  - [ ] Protect routes using Next.js middleware; guard by session cookie.
  - [ ] Implement Magic Link / Google sign-in UI flows.

## 7. Firestore & Security Updates

- [ ] Define new Firestore collections (`projects`, `groups`, `comments`, `offers`, `digests`, etc.) consistent with domain types.
- [ ] Write migration script to move existing `workspaces` data → `projects` (backfill slug, stage, asks, etc.).
- [ ] Update Firestore security rules for new collections: enforce role-based access, visibility, comment scopes, blueprint flag.
- [ ] Configure Storage rules for evidence uploads (size/type limits, path scoping).
- [ ] Update `firestore.indexes.json` for new query patterns (mentor filters, group overview).

## 8. Feature Flags & Config

- [ ] Move feature flag logic into server-configurable source (Firebase Remote Config or Config document).
- [ ] Ensure Mentor Mode, blueprinting, digest toggles are controlled via flags.
- [ ] Add server utilities to read flags both server-side and client-side.

## 9. Observability & Analytics

- [ ] Re-initialize Sentry using Next.js edge/server instrumentation.
- [ ] Update PostHog/GA tracking to use Next.js analytics pattern; gate behind consent banner.
- [ ] Emit KPI events (TTFN, mentor actions, nudge effectiveness) from new components and API routes.
- [ ] Add structured logging in API handlers (request id, user id, payload summary).

## 10. Testing & QA

- [ ] Update Vitest or adopt Jest via `next/jest` for unit tests (publish gate, ranking, API validators, stores).
- [ ] Rebuild Playwright suite targeting new routes:
  - [ ] Builder create → publish → public view.
  - [ ] Mentor filter + note.
  - [ ] Intro offer end-to-end.
  - [ ] Lead overview triage + digest send.
  - [ ] Collections & search flows.
- [ ] Add integration tests for API routes using Next.js request utilities + Firebase emulator.
- [ ] Accessibility: run axe against key pages, ensure keyboard nav, skip links, live regions.
- [ ] Performance: run Lighthouse CI on `/projects`, `/p/[slug]`, `/mentor`.

## 11. DevOps & Deployment

- [ ] Update deployment scripts (`deploy.sh`, Vercel config) for Next.js build/output.
- [ ] Ensure Firebase emulators (Auth/Firestore/Storage) work with Next dev environment.
- [ ] Configure Vercel preview/staging environments with correct env vars.
- [ ] Update CI to run `next lint`, `next build`, tests, and Playwright on PRs.
- [ ] Document rollback steps (revert to Vite build if necessary).

## 12. Documentation & Handoff

- [ ] Update `README.md` quickstart (Next.js commands, environment setup).
- [ ] Refresh `docs/ARCHITECTURE.md` to reflect App Router patterns.
- [ ] Extend `docs/DEVELOPMENT_GUIDE.md` with migration notes, emulator usage, SSR gotchas.
- [ ] Keep `docs/MVP_BUILD_BOARD.md` in sync with checklist progress.
- [ ] Announce migration status and testing plan to stakeholders.

---

Use this checklist as the living source of truth during the migration sprint; mark items complete in PR descriptions or project board issues. Prioritize Tracks 0–4 in `docs/MVP_BUILD_BOARD.md` while laying the Next.js foundation to hit the 10-day MVP acceptance criteria.
