# UX Audit: First-Time Skeptical User Walkthrough

**Date:** December 9, 2025
**Method:** Playwright MCP browser automation
**Perspective:** Hesitant first-time user, skeptical of new platforms

---

## Executive Summary

Buffalo Projects has a solid foundation but presents several friction points that could cause skeptical users to abandon the platform. The most critical issues are:

1. **Modals that won't close** - Critical bug blocking users
2. **Overwhelming terminology** - "Business Model Canvas" intimidates non-startup users
3. **Too many options** - Sidebar cognitive overload
4. **Cryptic IDs visible** - Technical implementation leaking into UI

---

## Critical Bugs (Must Fix)

### 1. Modal Dismissal Failure
**Severity: CRITICAL**

Both the Welcome Modal and Canvas Intro Modal cannot be dismissed through any standard method:
- ❌ Close (X) button doesn't work
- ❌ "Get Started" / "Start Building" buttons don't close modal
- ❌ Escape key doesn't work
- ❌ Clicking outside doesn't work

**Impact:** Users are trapped. The only way past these modals is JavaScript DOM manipulation.

**Root Cause:** The `onboardingStore` Zustand state isn't being updated when buttons are clicked, OR the modal component isn't reacting to state changes.

**Files to investigate:**
- `src/stores/onboardingStore.ts`
- `src/components/onboarding/WelcomeModal.tsx`
- `src/components/onboarding/CanvasIntroModal.tsx`

### 2. Onboarding State Not Persisting
**Severity: HIGH**

Even after attempting to dismiss modals, they reappear on page refresh/navigation. The `hasSeenWelcome` and `hasSeenCanvasIntro` flags in localStorage aren't being set.

---

## UX Friction Points

### Landing Page (Logged Out)

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| GitHub-centric messaging | Medium | Add visual examples of non-code projects (design, research, art) |
| No social proof | High | Add testimonials, project count, or community stats |
| "Import from GitHub" as primary CTA | Medium | Balance with "Start from scratch" or other entry points |

### Sign Up Flow

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| "Buffalo connection" field is confusing | High | Remove or clarify - feels like gatekeeping |
| No explanation of what you're signing up for | Medium | Add brief value prop below signup form |

### Dashboard

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| "'26" in navigation is cryptic | Low | Rename to "TwentySix" or add tooltip |
| Welcome modal blocks immediate action | High | Fix modal dismissal; consider inline onboarding instead |
| Too many action buttons (Create, Import, Groups, Settings) | Medium | Consolidate or progressive disclosure |

### Project Editor

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| **Sidebar has 9 clickable items** | High | Reduce to 3-4 primary tabs; hide advanced options |
| Cryptic ID shown (HGBVGXdumuPwijCyBeMW) | Medium | Hide or use human-readable slugs |
| "Business Model Canvas" terminology | High | Rename to "Project Canvas" or "Idea Canvas" |
| "Value Proposition", "Customer Segments" | Medium | Use simpler language for non-startup users |
| Progress feels like homework (15%, 0%, 0) | Medium | Focus on "next step" not completion metrics |
| "Request a Tool" and "Join a Group" buttons | Low | Remove if not implemented; dead ends frustrate users |
| Canvas Intro Modal blocks access | Critical | Fix modal dismissal |

---

## Simplification Recommendations

### Tier 1: Essential Fixes (Before Any Launch)

1. **Fix modal dismissal bug** - Users literally cannot proceed
2. **Persist onboarding state** - Don't show same modal every visit
3. **Hide cryptic IDs** - Replace with project names or slugs

### Tier 2: Reduce Cognitive Load

4. **Simplify sidebar to 3 tabs:**
   - "Overview" (current Project tab)
   - "Build" (combines Canvas + Documents)
   - "Share" (combines Publish + visibility settings)

5. **Rename intimidating terminology:**
   - "Business Model Canvas" → "Project Canvas" or "Your Idea"
   - "Value Proposition" → "What makes it special"
   - "Customer Segments" → "Who it's for"
   - "Key Partners" → "Who you're working with"

6. **Remove or hide unused features:**
   - "Request a Tool" - if not functional, remove
   - "Join a Group" - if not functional, remove
   - "Create Snapshot" - move to overflow menu
   - Progress percentages - replace with "Next step" guidance

### Tier 3: Improve First-Time Experience

7. **Replace modal onboarding with inline hints:**
   - Show tooltips on first interaction with each feature
   - Let users explore naturally

8. **Add "Quick Start" path:**
   - "Just want to share your project? Fill these 3 fields and publish"
   - Skip Canvas entirely for showcase-only users

9. **Show example projects:**
   - "See how others document their work"
   - Reduce fear of "doing it wrong"

---

## User Mindset Analysis

### What a Skeptical User is Thinking:

**Landing Page:**
> "Is this just for startups? I'm a designer/researcher/artist..."

**Sign Up:**
> "Buffalo connection? Do I need to know someone? Is this exclusive?"

**Dashboard Welcome Modal:**
> "I just want to look around. Let me click around first."

**Project Editor:**
> "There are so many tabs. What's a Business Model Canvas? I don't have a business model..."

**Canvas Intro Modal:**
> "Another popup? Just let me use the thing."

**Progress Stats:**
> "Great, I'm already failing at 0%..."

---

## Recommendation: Consider "Projects Won't Be Public For Now"

Based on user's note that projects won't be public initially, consider:

1. **Remove "Publish" tab entirely** for now - reduces complexity
2. **Rename "Community Gallery"** to "Coming Soon: Share with Community"
3. **Focus editor on private documentation** - remove public-facing fields
4. **Simplify to 2 tabs:** Overview and Canvas

This reduces the editor from 9 options to 2, dramatically lowering cognitive load.

---

## Screenshots Captured

| Screenshot | Description |
|------------|-------------|
| `landing-page-logged-out.png` | Public landing page |
| `signup-page.png` | Sign up form with "Buffalo connection" field |
| `dashboard-welcome-modal.png` | Dashboard with stuck Welcome modal |
| `dashboard-clean-no-modal.png` | Dashboard after JS modal removal |
| `project-editor-overview.png` | Editor with Canvas Intro modal |
| `project-editor-clean.png` | Editor without modal overlays |

---

## Next Steps

1. **Immediate:** Fix modal dismissal bug (blocks all users)
2. **This week:** Hide cryptic IDs, simplify terminology
3. **Before launch:** Consolidate sidebar, improve onboarding flow
4. **Post-launch:** Add social proof, example projects

---

**Auditor:** Claude Code
**Method:** Playwright MCP first-time user simulation
