# FilterBar Refinement & Polish Guide

**For:** Buffalo Projects Gallery Discovery Interface
**Component:** `app/(app)/dashboard/discover/components/FilterBar.tsx`
**Status:** Foundation Enhancement Plan
**Date:** November 2025

---

## Executive Summary

This document outlines comprehensive refinements to elevate the FilterBar from functional to foundation-grade, focusing on accessibility, micro-interactions, performance, and visual polish.

## Current State Analysis

### ✅ What's Already Good

- Clean visual design with rounded-xl borders
- Proper color contrast with neutral palette
- Responsive flexbox layout
- Active filter pill system
- Category dropdown with selection state
- Location and advanced filter toggles

### ⚠️ Areas for Enhancement

1. **Accessibility** - Missing ARIA labels and keyboard navigation
2. **Interactions** - No click-outside-to-close, missing animations
3. **Visual Feedback** - No active filter count badge
4. **Performance** - Re-renders could be optimized
5. **Mobile UX** - Layout could adapt better on small screens

---

## Refinement Roadmap

### 1. Accessibility Enhancements (WCAG 2.1 AA)

#### **Search Input**

```tsx
<input
  ref={searchInputRef}
  type="search" // Semantic HTML5
  placeholder="Search projects..."
  aria-label="Search projects by name, description, or creator"
  className="... focus:ring-2 focus:ring-blue-500/20" // Visible focus
/>
```

**Why:** Screen readers need context. Visible focus rings help keyboard users.

#### **Category Dropdown**

```tsx
<Button
  aria-haspopup="listbox"
  aria-expanded={categoryDropdownOpen}
  aria-label={`Filter by category: ${selectedCategoryLabel}`}
>
  {selectedCategoryLabel}
  <ChevronDown className={cn(
    "transition-transform duration-200",
    categoryDropdownOpen && "rotate-180"  // Visual affordance
  )} />
</Button>

<div role="listbox" aria-label="Project categories">
  {CATEGORIES.map((cat) => (
    <button
      role="option"
      aria-selected={filters.category === cat.value}
      tabIndex={categoryDropdownOpen ? 0 : -1}  // Tab trap management
    >
      {cat.label}
    </button>
  ))}
</div>
```

**Why:** Proper ARIA roles enable screen readers. TabIndex management prevents focus traps.

#### **Location Badges (Toggle Buttons)**

```tsx
<Badge
  role="button"
  aria-pressed={filters.location === "all"}
  aria-label="Show all locations"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setLocation("all");
    }
  }}
>
  All
</Badge>
```

**Why:** Badges acting as buttons need `role="button"` and keyboard support.

#### **Advanced Filter Toggle**

```tsx
<Button
  aria-label={`${showAdvanced ? "Hide" : "Show"} advanced filters${
    activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""
  }`}
  aria-expanded={showAdvanced}
>
  <Filter /> Advanced
  {activeFilterCount > 0 && (
    <span className="... bg-blue-500 text-white">{activeFilterCount}</span>
  )}
</Button>
```

**Why:** Dynamic aria-label announces filter count. Badge provides visual feedback.

---

### 2. Micro-Interactions & Animations

#### **Dropdown Animations (Framer Motion)**

```tsx
import { m, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {categoryDropdownOpen && (
    <m.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="dropdown-menu"
    >
      {CATEGORIES.map(...)}
    </m.div>
  )}
</AnimatePresence>
```

**Why:** Smooth entrance/exit reduces cognitive load and feels polished.

#### **Advanced Section Expansion**

```tsx
<AnimatePresence>
  {showAdvanced && (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      {/* Advanced filters content */}
    </m.div>
  )}
</AnimatePresence>
```

**Why:** Height animation provides spatial awareness of where content appears.

#### **Active Filter Pills**

```tsx
<AnimatePresence>
  {hasActiveFilters && (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="status"
      aria-live="polite"
    >
      {/* Filter pills */}
    </m.div>
  )}
</AnimatePresence>
```

**Why:** Smooth entry/exit. `aria-live="polite"` announces filter changes to screen readers.

---

### 3. Click Outside to Close

#### **useEffect Hook Pattern**

```tsx
const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setCategoryDropdownOpen(false);
    }
  }

  if (categoryDropdownOpen) {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [categoryDropdownOpen]);
```

**Why:** Industry-standard pattern. Cleanup prevents memory leaks.

#### **Escape Key Support**

```tsx
useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (categoryDropdownOpen && event.key === "Escape") {
      setCategoryDropdownOpen(false);
    }
  }

  if (categoryDropdownOpen) {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }
}, [categoryDropdownOpen]);
```

**Why:** Expected keyboard UX. Escape closes modals/dropdowns universally.

---

### 4. Results Count Display

#### **Live Region for Accessibility**

```tsx
{
  resultsCount !== undefined && (
    <div
      className="ml-auto hidden sm:block text-sm text-neutral-500"
      aria-live="polite"
      aria-atomic="true"
    >
      {resultsCount} {resultsCount === 1 ? "project" : "projects"}
    </div>
  );
}
```

**Why:** `aria-live` announces filter result changes. Hidden on mobile to save space.

---

### 5. Visual Polish Details

#### **Focus States**

```tsx
className =
  "... focus:border-white/[0.20] focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-blue-500/20";
```

**Why:** Visible focus ring (2px blue glow) meets WCAG 2.1 AA. Subtle bg change adds depth.

#### **Hover States**

```tsx
className =
  "... hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white transition-all duration-200";
```

**Why:** Progressive enhancement - border brightens, background lifts, text highlights. Smooth 200ms transition.

#### **Active States (Selected Filters)**

```tsx
className={cn(
  "transition-all duration-200",
  isActive
    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"  // Active state
    : "border-white/[0.08] bg-white/[0.02] text-neutral-400"  // Default
)}
```

**Why:** Clear visual distinction. Blue theme signals "selected" state.

#### **Active Filter Count Badge**

```tsx
{
  activeFilterCount > 0 && (
    <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-medium text-white">
      {activeFilterCount}
    </span>
  );
}
```

**Why:** At-a-glance feedback. Circular badge is universal pattern for counts.

---

### 6. Mobile Responsiveness

#### **Responsive Padding**

```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">{/* Filters */}</div>
```

**Why:** 4px padding on mobile (touch-friendly), 6px on desktop (mouse precision).

#### **Search Input Sizing**

```tsx
<div className="relative flex-1 min-w-[200px] max-w-xl">
  {/* Search input */}
</div>
```

**Why:** `min-w-[200px]` prevents crushing on mobile. `max-w-xl` caps width on ultrawide.

#### **Results Count Visibility**

```tsx
<div className="ml-auto hidden sm:block">{resultsCount} projects</div>
```

**Why:** Hidden on mobile (`< 640px`) to prioritize filters. Visible on tablet+.

---

### 7. Color System Refinements

#### **Current Implementation**

- Background: `bg-white/[0.02]` - Ultra-subtle lift
- Border: `border-white/[0.08]` - Visible but subtle
- Text: `text-neutral-400` - Readable secondary
- Active: `bg-blue-500/10 text-blue-400` - Buffalo Blue theme

#### **Why This Works**

- **Contrast:** Meets WCAG AA (4.5:1 for text)
- **Hierarchy:** Opacity levels create depth (2% → 4% → 6% → 10%)
- **Consistency:** Buffalo Blue (#0070f3) as primary accent
- **Dark Mode Native:** Design assumes dark background

#### **Potential Design Token Usage**

```tsx
import { BUFFALO_BLUE, BORDER, BACKGROUND, TEXT } from "@/tokens";

// Replace hardcoded values:
className = "bg-blue-500/10"; // Current
className = "bg-[--buffalo-blue-10]"; // With design tokens (future)
```

**Why:** Centralized tokens enable theme switching and global consistency.

---

### 8. Performance Optimizations

#### **Memoization for Toggle Handlers**

```tsx
const handleStageToggle = useCallback(
  (stage: ProjectStage) => {
    if (filters.stages.includes(stage)) {
      setStages(filters.stages.filter((s) => s !== stage));
    } else {
      setStages([...filters.stages, stage]);
    }
  },
  [filters.stages, setStages],
);
```

**Why:** Prevents recreation on every render, reducing Badge re-renders.

#### **Active Filter Count Calculation**

```tsx
const activeFilterCount = useMemo(
  () =>
    (filters.category !== "all" ? 1 : 0) +
    filters.stages.length +
    filters.gives.length +
    filters.asks.length,
  [filters],
);
```

**Why:** Cached computation, only recalculates when filters change.

---

## Implementation Checklist

### Phase 1: Accessibility (Critical)

- [x] Add ARIA labels to all interactive elements
- [x] Implement keyboard navigation (Enter, Space, Escape, Tab)
- [x] Add visible focus rings (2px blue glow)
- [x] Use semantic HTML (`<search>` wrapper, `role="button"`)
- [x] Add `aria-live` regions for dynamic content

### Phase 2: Interactions (High Priority)

- [x] Click-outside-to-close for dropdown
- [x] Escape key to close dropdown
- [x] Framer Motion animations for dropdown
- [x] Height animations for advanced section
- [x] Active filter count badge on Advanced button

### Phase 3: Visual Polish (Medium Priority)

- [x] Refine hover/focus/active states
- [x] Add chevron rotation on dropdown open
- [x] Improve active filter pill styling
- [x] Add results count display
- [x] Mobile responsive adjustments

### Phase 4: Performance (Nice-to-Have)

- [ ] Memoize toggle handlers with `useCallback`
- [ ] Memoize active filter count calculation
- [ ] Debounce search input (300ms)
- [ ] Virtual scrolling for dropdown (if >50 categories)

---

## Code Comparison: Before & After

### Before (Current State)

```tsx
<Button onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
  {selectedCategoryLabel}
  <ChevronDown />
</Button>;

{
  categoryDropdownOpen && (
    <div className="dropdown">
      {CATEGORIES.map((cat) => (
        <button onClick={() => setCategory(cat.value)}>{cat.label}</button>
      ))}
    </div>
  );
}
```

### After (Refined)

```tsx
<Button
  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
  aria-haspopup="listbox"
  aria-expanded={categoryDropdownOpen}
  aria-label={`Filter by category: ${selectedCategoryLabel}`}
>
  {selectedCategoryLabel}
  <ChevronDown
    className={cn(
      "transition-transform duration-200",
      categoryDropdownOpen && "rotate-180"
    )}
    aria-hidden="true"
  />
</Button>

<AnimatePresence>
  {categoryDropdownOpen && (
    <m.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      role="listbox"
      aria-label="Project categories"
    >
      {CATEGORIES.map((cat) => (
        <button
          onClick={() => {
            setCategory(cat.value);
            setCategoryDropdownOpen(false);
          }}
          role="option"
          aria-selected={filters.category === cat.value}
          tabIndex={categoryDropdownOpen ? 0 : -1}
        >
          {cat.label}
        </button>
      ))}
    </m.div>
  )}
</AnimatePresence>
```

**Key Differences:**

1. ✅ ARIA attributes for screen readers
2. ✅ Chevron rotation animation
3. ✅ Framer Motion entrance/exit
4. ✅ Proper listbox semantics
5. ✅ Tab index management
6. ✅ Close dropdown after selection

---

## Testing Strategy

### Accessibility Testing

```bash
# Lighthouse CI (automated)
npm run test:a11y

# Manual testing
- Tab through all interactive elements
- Use screen reader (VoiceOver on Mac, NVDA on Windows)
- Test with keyboard only (no mouse)
- Verify WCAG 2.1 AA contrast ratios
```

### Visual Regression Testing

```bash
# Playwright visual snapshots
npx playwright test --update-snapshots
```

### Manual QA Checklist

- [ ] Search input has visible focus ring
- [ ] Dropdown closes on click outside
- [ ] Dropdown closes on Escape key
- [ ] Advanced section animates smoothly
- [ ] Active filter count badge appears
- [ ] Results count updates live
- [ ] All badges support keyboard activation
- [ ] Mobile layout stacks properly
- [ ] Hover states are consistent

---

## Design Principles Applied

### 1. Progressive Disclosure

- Start with simple search + location filters
- Reveal advanced filters on demand
- Show active filters as removable pills

### 2. Immediate Feedback

- Results count updates in real-time
- Active filter count badge
- Smooth animations signal state changes

### 3. Accessibility First

- ARIA labels for context
- Keyboard navigation for power users
- Live regions announce changes

### 4. Performance Conscious

- Memoized calculations
- Efficient re-render strategy
- Debounced search input

### 5. Mobile-First Responsive

- Touch-friendly 44px tap targets
- Collapsible advanced filters
- Hidden elements on small screens

---

## Future Enhancements (Post-Foundation)

1. **Saved Filters** - Allow users to save/load filter presets
2. **URL State Sync** - Persist filters in URL query params
3. **Filter Analytics** - Track most-used filters for UX insights
4. **Smart Suggestions** - Autocomplete in search input
5. **Bulk Actions** - Select multiple filters at once
6. **Filter History** - "Back" button to undo filter changes

---

## Implementation Notes for Developers

### Import Additions Needed

```tsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
```

### Props Interface

```tsx
interface FilterBarProps {
  resultsCount?: number; // Pass from parent (GalleryScreen)
}
```

### Parent Component Update (GalleryScreen)

```tsx
<FilterBar resultsCount={filteredWorkspaces.length} />
```

---

## Success Metrics

### Quantitative

- **Accessibility Score:** Target 100/100 in Lighthouse
- **Keyboard Navigation:** 100% of interactive elements accessible
- **Performance:** < 50ms interaction-to-paint
- **Mobile Usability:** 95+ Google Mobile-Friendly score

### Qualitative

- **User Feedback:** "Filters feel responsive and intuitive"
- **A11y Audit:** Zero critical WCAG violations
- **Design Review:** Approved by design team

---

## Resources & References

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Buffalo Projects Design Tokens](/src/tokens/README.md)

---

## Conclusion

These refinements transform the FilterBar from functional to foundation-grade by prioritizing:

1. **Accessibility** - Universal design for all users
2. **Interactions** - Polished micro-interactions and feedback
3. **Performance** - Optimized rendering and calculations
4. **Visual Design** - Consistent, cohesive styling

The result is a gallery filter experience worthy of Buffalo Projects' community-first mission.

---

**Next Steps:**

1. Review this guide with team
2. Prioritize Phase 1 (Accessibility) for immediate implementation
3. Test with real users (especially keyboard/screen reader users)
4. Iterate based on feedback
5. Document learnings for future component refinements

_Generated for Buffalo Projects Foundation - November 2025_
