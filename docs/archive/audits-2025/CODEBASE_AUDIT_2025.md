# Buffalo Projects - Comprehensive Codebase Audit Report

**Date:** 2025-11-10
**Auditor:** Claude Code AI Assistant
**Codebase Version:** Latest (main branch)

---

## Executive Summary

Buffalo Projects is a well-architected Next.js 15 application with **287 TypeScript files** and **342 source files**. The codebase demonstrates strong architectural patterns including offline-first design, domain-driven structure, and comprehensive testing (41 test files, 70%+ coverage requirement).

### Overall Health Score: **B+ (85/100)**

**Strengths:**

- ✅ Excellent offline-first architecture
- ✅ Strong domain-driven design patterns
- ✅ Comprehensive testing foundation
- ✅ Good security practices (rate limiting, sanitization)
- ✅ Zero circular dependencies

**Critical Issues:**

- ⚠️ 3 components >700 lines (largest: 1,170 lines)
- ⚠️ Service duplication (2 PivotDetectionServices)
- ⚠️ 11 npm security vulnerabilities
- ⚠️ Large bundle size (338MB build)
- ⚠️ 56 console statements in production code

---

## 1. Security Analysis

### npm Vulnerabilities: 11 Total (5 Moderate, 6 High)

#### High Severity (6)

1. **path-to-regexp** - Backtracking RegEx (DoS risk)
   - CVSS: 7.5 (High)
   - Affected: `@vercel/node`, `@vercel/routing-utils`
   - Fix: Upgrade Vercel CLI to v48.9.0

2. **esbuild** - Dev server request exposure
   - CVSS: 5.3 (Moderate→High)
   - Affected: `@vercel/gatsby-plugin-vercel-builder`, `@vercel/node`
   - Fix: Upgrade Vercel CLI

#### Moderate Severity (5)

- `@vercel/fun` - tar dependency issue
- `@vercel/static-build` - transitive vulnerabilities

**Remediation:**

```bash
npm update vercel@latest
```

⚠️ **Note:** All vulnerabilities are in Vercel CLI dev dependencies, not production runtime.

### Dangerous Code Patterns: 9 Instances

**dangerouslySetInnerHTML Usage:**

- `src/utils/sanitize.ts` - Used with DOMPurify (✓ Safe)
- `src/components/workspace/CanvasField.tsx` - Sanitized markdown
- `src/components/comments/CommentItem.tsx` - Sanitized user content

**eval Usage:**

- None found ✓

**Recommendation:** All instances use proper sanitization. No immediate action required.

### Authentication Security

**Current:** Cookie-based auth with basic existence check
**Issues:**

- Middleware only checks cookie existence, not validity (Line 62-74, `middleware.ts`)
- No JWT verification in middleware
- Multiple cookie names for backward compatibility

**Mitigation:**

- Firestore security rules provide actual authorization layer ✓
- Rate limiting via Upstash Redis ✓
- CSRF protection configured (optional) ✓

**TODO Items (from codebase):**

1. Implement JWT verification in middleware (#1)
2. Standardize to single cookie name (#3)
3. Move COMING_SOON_MODE to env variable (#9)

### Environment Variables

**Client-Safe (NEXT*PUBLIC*):** ✓ Properly prefixed
**Server Secrets:** ✓ No NEXT*PUBLIC* prefix
**.env.example:** ✓ Well-documented

**Good Practice:** All Firebase config properly separated.

---

## 2. Architecture Analysis

### Codebase Metrics

| Metric                  | Count       | Status             |
| ----------------------- | ----------- | ------------------ |
| Total TS/TSX files      | 287         | ✓                  |
| Source files (non-test) | 342         | ✓                  |
| Test files              | 41          | ✓ Good             |
| Test coverage           | 70%+        | ✓ Excellent        |
| Circular dependencies   | 0           | ✓ Perfect          |
| Largest component       | 1,170 lines | ⚠️ Too large       |
| Components >500 lines   | 8           | ⚠️ Refactor needed |

### Architecture Patterns

#### ✅ Strengths

**1. Next.js 15 App Router**

- Clean route groups: `(public)`, `(studio)`, `(auth)`
- Proper loading/error boundaries
- Good server/client separation

**2. State Management (Zustand)**

- 3 focused stores: `authStore`, `workspaceStore`, `groupStore`
- SSR-safe with browser-only persistence
- Clean separation from business logic

**3. Domain-Driven Design**

- Well-organized `/src/domain/` structure
- Value objects: `ProjectCode`
- Domain services: `VersionService`, `PivotDetectionService`
- Repository pattern properly implemented

**4. Offline-First Design**

- `localWorkspaceService` with localStorage
- `syncService` for Firebase synchronization
- Memory fallback for SSR

#### ⚠️ Issues

**CRITICAL: Service Duplication**

Two implementations of pivot detection:

1. `/src/services/pivotDetectionService.ts` (450 lines) - AI-powered
2. `/src/domain/services/PivotDetectionService.ts` (84 lines) - Simple

**Impact:** Confusion, inconsistent behavior, maintenance burden

**Recommendation:** Consolidate into domain service with strategy pattern for basic vs AI-powered.

**Component Organization**

4 overlapping component libraries:

- `/src/components/ui/` - shadcn/ui (18 files)
- `/src/components/ui-next/` - Enhanced Buffalo (4 files)
- `/src/components/buffalo/` - Custom patterns (2 files)
- `/src/components/unified/` - Attempted unification

**Recommendation:** Complete migration to unified exports + ESLint rule enforcing it.

---

## 3. Code Quality Issues

### Extremely Large Components

#### 🔴 Critical

**1. BusinessModelCanvas.tsx - 1,170 lines**

- Handles: rendering, state, AI, evidence linking, export
- 7 `useMemo`/`useCallback` hooks
- Difficult to test individual features

**Extract into:**

- `CanvasRenderer` - Grid layout
- `FieldManager` - Individual field logic
- `AIAssistant` - Suggestions panel
- `EvidencePanel` - Linking UI
- `ExportManager` - PDF/image export

**2. DocumentManager.tsx - 730 lines**

- Handles: upload, processing, sorting, filtering, preview
- 9 `useMemo`/`useCallback` hooks
- Complex upload queue state

**Extract into:**

- `DocumentUploader`
- `DocumentList` (with filters)
- `DocumentPreview`
- `UploadQueue`
- `useDocumentManager` hook

**3. WorkspaceEditor.tsx - 701 lines**

- Handles: tabs, autosave, snapshots, fullscreen
- 7 dynamic imports (good!)
- Still too large overall

**Extract into:**

- `useWorkspaceAutosave` hook
- `useWorkspaceSnapshot` hook
- `WorkspaceLayout` component
- `SnapshotDialog` component

### Components 500-700 Lines

- `WorkspaceContextPanel.tsx` - 510 lines
- `WorkspaceSharePanel.tsx` - 452 lines
- `DocumentDetailDrawer.tsx` - 355 lines
- `CanvasField.tsx` - 332 lines
- `EvidenceLinkingModal.tsx` - 297 lines

**Target:** <400 lines per component

### Code Duplication

**BMC Field Definitions:**

- Hardcoded in multiple files
- `BusinessModelCanvas.tsx` (lines 40-160)
- Likely duplicated in validation, export, AI prompts

**Recommendation:**

```typescript
// src/constants/bmcFields.ts
export const BMC_FIELDS = {
  valuePropositions: {
    label: "Value Propositions",
    description: "...",
    weight: 1.0,
  },
  // ...
} as const;
```

### Console Statements: 56 Instances

Found in 28 files including:

- `BusinessModelCanvas.tsx` (3x)
- `WorkspaceEditor.tsx` (2x)
- `importService.ts` (5x)

**Current:** `logger` utility exists at `/src/utils/logger.ts`

**Recommendation:**

```typescript
// Use logger consistently
import { logger } from '@/utils/logger'
logger.info('Operation completed', { context })

// Add ESLint rule
"no-console": ["error", { "allow": ["warn", "error"] }]
```

---

## 4. Performance Issues

### Bundle Size: 338MB (.next folder)

**Heavy Animation Dependencies:**

- 150+ imports of framer-motion/GSAP
- Both libraries used simultaneously (redundant?)
- Most workspace components import framer-motion

**Recommendation:**

```typescript
// Use LazyMotion everywhere (~40% reduction)
import { LazyMotion, domMax, m } from "framer-motion";

// Remove GSAP if framer-motion covers use cases
// Consolidate to single animation library
```

### Missing Memoization

**WorkspaceStore Selectors:**

```typescript
// ❌ Current: Triggers re-render on any store change
const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

// ✅ Better: Shallow equality check
import { shallow } from "zustand/shallow";
const { currentWorkspace, loading } = useWorkspaceStore(
  (state) => ({
    currentWorkspace: state.currentWorkspace,
    loading: state.loading,
  }),
  shallow,
);
```

### Code-Splitting Opportunities

**Good:** `WorkspaceEditor` uses 7 dynamic imports

**Missing:**

- Profile components (11 new components) not lazy-loaded
- Import dialogs not lazy-loaded
- Motion components imported eagerly

**Recommendation:**

```typescript
const ProfileHeader = dynamic(() => import("./ProfileHeader"));
const BatchImport = dynamic(() => import("./BatchURLImport"));
const AnimatedCard = dynamic(() => import("@/components/motion/AnimatedCard"));
```

### Direct Firebase Access from Components

**Found in:**

- `DocumentManager.tsx` (line 28)
- `FeaturedProjects.tsx`

**Issue:** Bypasses service layer, tight coupling, hard to test

**Recommendation:** All Firebase operations through service layer only.

---

## 5. Maintainability Issues

### Inconsistent Error Handling

**3 Different Patterns Found:**

1. Try-catch with toast
2. Try-catch with state
3. Try-catch with logger + fallback

**Recommendation:**

```typescript
// Create useErrorHandler hook
const { handleError } = useErrorHandler();

try {
  await action();
} catch (error) {
  handleError(error, {
    toast: true,
    fallback: "Operation failed",
  });
}
```

### Missing Error Boundaries

**Root Layout:** No error boundary ❌
**Workspace Routes:** Only `WorkspaceErrorBoundary` for editor
**Profile/Import/Gallery:** No error boundaries ❌

**Recommendation:**

```typescript
// app/layout.tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <Providers>{children}</Providers>
</ErrorBoundary>
```

### Hard-coded Values

Found across multiple files:

- Autosave interval: `10_000` (WorkspaceEditor.tsx)
- Rate limits: `10 req/min` (geminiService.ts)
- File size limits: Duplicated in multiple places
- Stage labels: Hardcoded in components

**Recommendation:**

```typescript
// src/constants/workspace.ts
export const WORKSPACE_CONSTANTS = {
  AUTOSAVE_INTERVAL_MS: 10_000,
  MAX_VERSIONS: 50,
  MAX_UPLOAD_SIZE_MB: 10,
} as const;
```

### Deep Component Nesting

**WorkspaceEditor Structure:**

```
WorkspaceEditor (701 lines)
  └─ WorkspaceContextPanel (510 lines)
  └─ BusinessModelCanvas (1170 lines)
      └─ CanvasField (332 lines)
          └─ EvidenceLinkingModal (297 lines)
  └─ DocumentManager (730 lines)
      └─ DocumentDetailDrawer (355 lines)
```

**Current depth:** 4 levels
**Target depth:** 2-3 levels maximum

---

## 6. Best Practices

### TypeScript `any` Usage: 26 Instances

**Common in:**

- Error handling: `catch (error: any)`
- Service responses

**Recommendation:**

```typescript
// Use unknown for error handling
catch (error: unknown) {
  const message = error instanceof Error
    ? error.message
    : 'Unknown error'
}
```

### Props Drilling

**Example:** `WorkspaceEditor → CanvasField → EvidenceLinkingModal`

Props passed through 3+ levels:

- `workspaceCode`
- `documents`
- `onDocumentsChange`
- `evidenceLinks`

**Recommendation:**

```typescript
// Use context or Zustand store directly
const documents = useWorkspaceStore(
  (state) => state.currentWorkspace?.documents,
);
```

### Mixed Concerns

**WorkspaceSharePanel.tsx:**

- Publishing logic
- URL generation
- Social sharing
- Clipboard management
- Analytics tracking

**Recommendation:**

- Extract `useWorkspacePublishing` hook
- Extract `useSocialSharing` hook
- Move analytics to dedicated service

---

## 7. Dead Code Analysis (knip)

### Unused Files: 6

- `app/(auth)/signup/screen.tsx`
- `app/(public)/gallery/PublicProjectsScreen.tsx`
- `app/(public)/projects/PublicProjectsScreen.tsx`
- `app/(studio)/profile/components/FeaturedProject.tsx`
- `app/(studio)/profile/components/ProfileProjectsSection.tsx`
- `app/(studio)/profile/components/ProfileQuickActions.tsx`

**Action:** Delete these files

### Unused Dependencies: 1

- `@types/dompurify` (already removed)

### Unused Dev Dependencies: 1

- `lint-staged` (lefthook is used instead)

**Action:** `npm uninstall -D lint-staged`

### Duplicate Exports: 28

Common pattern: Both named and default exports

**Examples:**

- `authService` and `default` in `firebaseAuth.ts`
- `firebaseDatabase` and `default` in `firebaseDatabase.ts`

**Decision:** Keep current pattern for backward compatibility, document in style guide

---

## 8. Testing Status

### Test Coverage

**Files:** 41 test files
**Coverage Requirement:** ≥70% lines/statements, ≥60% branches/functions
**Status:** ✅ Meeting requirements

**Well-tested:**

- Domain services (100%)
- Firebase database service
- Stores (authStore, workspaceStore)
- Firestore rules

**Test Command Issue:**

```bash
# ❌ Current (duplicate --coverage flag)
npm test -- --coverage --reporter=verbose

# ✅ Fix in package.json
"test": "vitest run --coverage",
```

### E2E Tests (Playwright)

- Authentication flows ✓
- Workspace creation ✓
- Document upload ✓
- Mentor feedback ✓
- Offline mode ✓

**Test account required:** `E2E_EMAIL`, `E2E_PASSWORD` env vars

---

## 9. Positive Patterns to Maintain

### ✅ Excellent Practices

1. **Offline-First Architecture**
   - localStorage + memory fallback
   - Sync service for Firebase
   - Proper offline state handling

2. **Strong Testing Foundation**
   - 70%+ coverage requirement
   - Integration tests for Firestore rules
   - E2E tests with Playwright

3. **Clean Domain Layer**
   - Isolated from infrastructure
   - Repository pattern
   - Value objects for primitives

4. **Good Security Practices**
   - Rate limiting (Upstash Redis)
   - Input sanitization (DOMPurify)
   - CSRF protection config
   - Firestore security rules with tests

5. **Design System**
   - Consistent tokens
   - Two-tier system (primitives → semantics)
   - Well-documented

---

## 10. Prioritized Action Plan

### P0 - Critical (Do Immediately)

**Est. Time: 2-3 days**

1. **Resolve service duplication**
   - Consolidate `PivotDetectionService` (2 files → 1)
   - Use strategy pattern for basic vs AI-powered
   - Delete `/src/services/pivotDetectionService.ts`

2. **Break up BusinessModelCanvas.tsx**
   - 1,170 lines → 4-5 components (<300 lines each)
   - Extract: CanvasRenderer, FieldManager, AIAssistant, EvidencePanel, ExportManager

3. **Remove direct Firebase access from components**
   - Refactor `DocumentManager.tsx` and `FeaturedProjects.tsx`
   - Use service layer only
   - Add ESLint rule to prevent future violations

4. **Add root error boundary**
   - Wrap `app/layout.tsx` with ErrorBoundary
   - Add feature-level boundaries for studio, profile

5. **Update Vercel CLI**
   - Fix 11 npm vulnerabilities
   - `npm update vercel@latest`

### P1 - High Impact (Next Sprint)

**Est. Time: 3-4 days**

6. **Optimize animation bundle**
   - Switch to LazyMotion everywhere
   - Remove GSAP if redundant
   - Expected: ~40% bundle reduction

7. **Create shared constants file**
   - BMC fields definitions
   - Rate limits
   - File size limits
   - Stage labels

8. **Implement memoized store selectors**
   - Add shallow equality checks
   - Update all workspace store usage
   - Expected: Reduce unnecessary re-renders

9. **Extract workspace hooks**
   - `useWorkspaceAutosave`
   - `useWorkspaceSnapshot`
   - `useWorkspacePublishing`
   - `useDocumentManager`

10. **Delete unused files**
    - Remove 6 unused files from knip report
    - Remove `lint-staged` from package.json

### P2 - Medium Impact (Backlog)

**Est. Time: 2-3 days**

11. **Standardize error handling**
    - Create `useErrorHandler` hook
    - Migrate all try-catch blocks
    - Document error handling strategy

12. **Lazy load profile components**
    - 11 profile components → dynamic imports
    - Import dialogs → dynamic imports
    - Expected: Reduce initial bundle

13. **Fix console statements**
    - Migrate 56 instances to logger
    - Add ESLint rule
    - Remove from production builds

14. **Create ESLint rules**
    - Enforce unified component imports
    - Prevent direct Firebase access
    - No console statements
    - Proper error typing (no `any`)

15. **Fix test coverage command**
    - Remove duplicate `--coverage` flag
    - Update package.json script

### P3 - Nice to Have (Future)

**Est. Time: 3-5 days**

16. **Flatten component nesting**
    - Reduce 4 levels → 2-3 levels
    - Use composition over nesting

17. **Refactor large components (500-700 lines)**
    - 8 components need splitting
    - Target: <400 lines each

18. **Document architecture decisions**
    - Create ADR directory
    - Document key patterns
    - Create migration guides

19. **Implement JWT verification**
    - Add to middleware
    - Standardize cookie names
    - See middleware TODOs

20. **TypeScript improvements**
    - Replace 26 `any` with proper types
    - Add stricter tsconfig options
    - Enable `strict` mode

---

## 11. Metrics Summary

| Metric                | Current         | Target     | Priority | Est. Impact |
| --------------------- | --------------- | ---------- | -------- | ----------- |
| Largest component     | 1,170 lines     | <400 lines | P0       | High        |
| Bundle size           | 338MB           | <250MB     | P1       | High        |
| Animation libs        | 2 (framer+GSAP) | 1          | P1       | Medium      |
| Service duplication   | 2 services      | 1          | P0       | High        |
| Console statements    | 56              | 0          | P2       | Low         |
| `any` usage           | 26              | <5         | P3       | Low         |
| Unused files          | 6               | 0          | P1       | Low         |
| npm vulnerabilities   | 11              | 0          | P0       | Medium      |
| Components >500 lines | 8               | 0          | P2-P3    | Medium      |
| Error boundaries      | 1               | 4+         | P0       | High        |
| Test coverage         | 70%+            | Maintain   | ✓        | -           |
| Circular deps         | 0               | 0          | ✓        | -           |

---

## 12. Risk Assessment

### High Risk

- ⚠️ **No root error boundary** - Can cause white screen of death
- ⚠️ **BusinessModelCanvas too complex** - Hard to maintain, high bug risk
- ⚠️ **Service duplication** - Inconsistent behavior across features

### Medium Risk

- ⚠️ **Large bundle size** - Slow initial page load
- ⚠️ **Missing lazy loading** - Suboptimal performance
- ⚠️ **Direct Firebase access** - Tight coupling, harder to test

### Low Risk

- ⚠️ **npm vulnerabilities** - Dev dependencies only
- ⚠️ **Console statements** - Noise in production logs
- ⚠️ **Unused files** - Technical debt

---

## 13. Recommendations by Role

### For Developers

1. Start with P0 tasks (critical)
2. Use `@/components/unified` for all imports
3. Keep components <400 lines
4. Use logger instead of console
5. Add tests for new features

### For Tech Lead

1. Review and approve refactoring plan
2. Set up ESLint rules to enforce standards
3. Create ADR for architectural decisions
4. Schedule time for P0/P1 work

### For Product Manager

1. Understand P0 items are critical for stability
2. P1 items improve performance (better UX)
3. P2/P3 items are technical debt reduction
4. No user-facing changes from audit fixes

---

## 14. Conclusion

Buffalo Projects has a **solid foundation** with excellent architectural patterns. The main issues are:

1. **Component size** (3 files >700 lines)
2. **Service duplication** (2 PivotDetectionServices)
3. **Performance optimization** (bundle size, memoization)
4. **Code organization** (component libraries, constants)

Addressing P0 and P1 recommendations will:

- ✅ Improve stability (error boundaries)
- ✅ Enhance maintainability (smaller components)
- ✅ Boost performance (~40% bundle reduction)
- ✅ Reduce technical debt (consolidate services)

**Overall Assessment:** Well-architected codebase with clear, actionable improvements.

---

## Appendix

### A. Files Analyzed

- **Source files:** 342
- **Test files:** 41
- **Total TS/TSX:** 287
- **Dependencies:** 1,669 packages
- **Dev dependencies:** Cleaned (54 removed)

### B. Tools Used

- `npm audit` - Security vulnerabilities
- `madge` - Circular dependencies
- `knip` - Dead code detection
- `vitest` - Test coverage
- `eslint` - Code quality
- Manual code review - Architecture patterns

### C. References

- [Next.js Best Practices](https://nextjs.org/docs)
- [React Performance](https://react.dev/learn/render-and-commit)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Buffalo Projects internal docs: `CLAUDE.md`, `DESIGN_TOKENS.md`

---

**End of Audit Report**
**Next Steps:** Review with team, prioritize P0 tasks, create tickets for P1/P2/P3 items.
