# Project Status — 2025-10-07

This is the current, source-of-truth snapshot of Buffalo Projects.

## What’s True Now

- Stack: React 19 + TypeScript + Vite, Tailwind CSS v3, Zustand.
- Data: Firebase (Auth, Firestore, Storage) when env is present; localStorage fallback otherwise.
- AI: Google Gemini service wired via `src/services/geminiService.ts`.
- Analytics: GA + PostHog initializers present in `src/services/analyticsService.ts` (optional via env).
- Error tracking: Sentry dependencies present, not initialized yet.
- Build: Type-checking and linting pass; production build configured to drop console in prod.
- Routes: No `/test` route (prior docs referenced it incorrectly).

## Recently Fixed/Improved

- Removed all console.log usage in favor of production-safe logger.
- ESLint + TypeScript rules added and passing.
- Environment validation added around Firebase config.
- Removed references to hardcoded Firebase fallback values in code and docs.
- Cleaned up production status doc and security guidance.
- Offline-first onboarding implemented (`Start a workspace` now works without auth; class/group codes captured in hero flow).
- Group dashboards shipped: `/groups` route lets facilitators create cohorts, share codes, and track linked student workspaces.
- Workspace canvas upgraded with AI helper + document manager (uploads persist locally with Firebase sync when available).

## Gaps / Inconsistencies

- Sentry not yet initialized (docs previously implied it was).
- Some older docs reference Supabase; code uses Firebase.
- `LAUNCH_READY.md` references a non-existent `/test` route; keep for historical context, but not authoritative.
- Accessibility coverage is partial; ARIA and keyboard support need expansion.
- Large components and some duplicated patterns called out in `UX_AUDIT_FINDINGS.md` remain to be refactored.
- Document deletions are local-only right now; Firebase Storage cleanup still needs wiring.

## Priorities (P0 → P2)

- P0 Security & Correctness
  - Finalize input sanitization at ingress points (prefer DOMPurify where rendering HTML).
  - Ensure no secrets are hardcoded; keep all runtime config in env.
  - Verify Firebase security rules against current data model.

- P0 UX Consistency
  - Unify navigation across public, authenticated, and workspace views.
  - Fix routing inconsistencies and dead-ends identified in `UX_AUDIT_FINDINGS.md`.

- P1 Observability
  - Initialize Sentry at app entry; wire `logger` reporter.
  - Standardize analytics events; verify GA + PostHog IDs behind env flags.

- P1 Performance
  - Revisit Firebase timeout/fallback strategy (progressive backoff vs fixed 1s).
  - Audit bundle split; lazy-load heavy tool subtrees where sensible.

- P2 Quality & Accessibility
  - Add focused integration tests for auth + workspace flows.
  - Add a11y checks (axe) to CI and address top issues.
  - Begin refactor of oversized components (see audit doc recommendations).

## Metrics & How To Measure

- Build time and bundle size: `npm run build` then inspect `dist/`.
- Lighthouse: Chrome DevTools Lighthouse or https://web.dev/measure/.
- Quality gates: `npm run type-check`, `npm run lint`, `npm run test`.

Record latest measurements here with date, environment, and notes.

## Environment

See `.env.example` for required keys. Minimum recommended for production:

- Firebase: `VITE_FIREBASE_*` keys per `src/services/firebase.ts`.
- AI (optional): `VITE_GEMINI_API_KEY`.
- Analytics (optional): `VITE_ANALYTICS_ID`, `VITE_POSTHOG_KEY`.
- Error tracking (optional): `VITE_SENTRY_DSN`.

## Roadmap

Near-term execution plan lives in:

- `docs/IA_PRODUCTION_PLAN.md` (IA + product design to production)
- `docs/ROADMAP_Q4_2025.md` (delivery timeline)
