# Public Project Page - UX/UI Specification

## Design Philosophy

**Portfolio-First**: Showcase work beautifully, with workspace artifacts hidden by default
**Adaptive**: Show what exists, guide what's missing with helpful placeholders
**Encouraging**: Empty states motivate completion without being pushy
**Professional**: Maintain clean aesthetic, avoid clutter

---

## Visual Hierarchy & Layout

### Page Structure

```
┌─────────────────────────────────────────────────┐
│  HERO / HEADER                                  │
│  - Cover Image (40vh, gradient overlay)        │
│  - Project Name (huge, bold)                   │
│  - One-liner (subtle, light)                   │
│  - Creator Attribution (NEW)                   │
│  - Action Buttons (Share, Feedback, Appreciate)│
└─────────────────────────────────────────────────┘
│                                                 │
│  ABOUT SECTION                                 │
│  - Icon + "About" heading                      │
│  - Description (prose, ~800px max-width)       │
│  - Problem Statement (if exists, in callout)   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  IMPACT METRICS (if data OR show empty state)  │
│  - Icon + "Impact" heading                     │
│  - 3-column grid of stat cards                 │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  SHOWCASE (if data OR show empty state)        │
│  - Icon + "Showcase" heading                   │
│  - Screenshots grid + Demo embeds              │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  EVIDENCE (NEW - if data OR show empty state)  │
│  - Icon + "Evidence & Resources" heading       │
│  - Document cards grid                          │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  TECH STACK (if data OR show empty state)      │
│  - Icon + "Tech Stack" heading                 │
│  - Badge pills, wrap                           │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  GITHUB STATS (if data OR show empty state)    │
│  - Icon + "GitHub" heading                     │
│  - Stat grid + Topics                          │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MILESTONES (if data OR show empty state)      │
│  - Icon + "Milestones" heading                 │
│  - Vertical timeline                           │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  COMMUNITY (if data OR show empty state)       │
│  - Icon + "Community" heading                  │
│  - Asks/Gives, Team, Acknowledgments           │
│  - OR: Empty state placeholder                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FEEDBACK & DISCUSSION                         │
│  - Icon + "Feedback & Discussion" heading      │
│  - Comment thread                              │
│                                                 │
└─────────────────────────────────────────────────┘
│                                                 │
│  FOOTER                                        │
│  - Minimal metadata                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Section Specifications

### 1. HERO / HEADER (Enhanced)

**Current state**: Cover image, name, one-liner, badges, CTAs
**NEW**: Add creator attribution

```
┌─────────────────────────────────────────────────┐
│ [Cover Image - 40vh, dark gradient overlay]    │
│                                                 │
│   HIVE                         [Idea] [Buffalo]│
│   Platform for... (one-liner)                  │
│                                                 │
│   👤 Built by Jane Doe                         │  ← NEW
│      UB '26 • Buffalo, NY                      │  ← NEW
│                                                 │
│   [Try Demo] [Visit Site] [GitHub]             │
│   [Share] [Give Feedback] [❤️ Appreciate]      │
└─────────────────────────────────────────────────┘
```

**Creator Attribution Design:**

- **Position**: Below one-liner, above CTA buttons
- **Layout**: Horizontal, inline
- **Icon**: Small avatar circle OR first initial in circle
- **Text**: "Built by [Name]" • secondary details (school, location)
- **Link**: Clickable, goes to creator profile (when available)
- **Styling**:
  - Text: `text-sm` muted foreground
  - Icon: 32px circle, border, primary color
  - Hover: Underline name, scale avatar slightly
- **Conditional**: Only show if `workspace.creator` exists

---

### 2. EVIDENCE DOCUMENTS (NEW)

**Purpose**: Display PDFs, videos, links, and other non-image documents

```
┌─────────────────────────────────────────────────┐
│ 📄 Evidence & Resources                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 📄 PDF   │  │ 🎥 Video │  │ 🔗 Link  │     │
│  │ Pitch    │  │ Demo     │  │ Website  │     │
│  │ Deck.pdf │  │ Tour.mp4 │  │ docs.com │     │
│  │ 2.4 MB   │  │ 12.1 MB  │  │          │     │
│  │          │  │          │  │          │     │
│  │[Download]│  │ [View]   │  │ [Visit]  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  3 documents uploaded                           │
└─────────────────────────────────────────────────┘
```

**Document Card Design:**

- **Layout**: Grid, 3 columns on desktop, 2 on tablet, 1 on mobile
- **Card**:
  - Border: `border border-white/[0.08]`
  - Background: `bg-gradient-to-br from-white/[0.03] to-white/[0.01]`
  - Padding: `p-6`
  - Rounded: `rounded-xl`
  - Hover: `border-white/[0.12]`, lift slightly
- **Icon**: Large file type icon at top (64px)
  - PDF: 📄 document icon
  - Video: 🎥 video icon
  - Link: 🔗 link icon
  - Other: 📎 attachment icon
- **Title**: Document name, truncated, `font-semibold`
- **Meta**: File size (for downloads), date uploaded
- **Button**: Primary action (Download/View/Visit)
  - PDF/Docs: "Download" button
  - Videos: "Watch" button (or embed player)
  - Links: "Visit" button (external link icon)
- **Count**: Show total at bottom: "3 documents uploaded"

**Empty State:**

```
┌─────────────────────────────────────────────────┐
│ 📄 Evidence & Resources                        │
├─────────────────────────────────────────────────┤
│                                                 │
│          📂 (large, muted icon)                 │
│                                                 │
│      No supporting documents yet                │
│      Upload PDFs, videos, or links to          │
│      provide evidence and resources             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 3. EMPTY STATE DESIGN PATTERN

**Reusable component for all sections**

```
┌─────────────────────────────────────────────────┐
│ 🎯 Section Name                                │
├─────────────────────────────────────────────────┤
│                                                 │
│          [Icon] (large, muted, 48px)            │
│                                                 │
│       Primary message (heading)                 │
│       Secondary helpful text (subtext)          │
│                                                 │
│       [Optional: "Add in editor" CTA]           │  ← Only for owner
│                                                 │
└─────────────────────────────────────────────────┘
```

**Styling:**

- **Container**: Same border/background as filled sections
- **Min-height**: `min-h-[300px]` to maintain rhythm
- **Icon**: 48-64px, `text-muted-foreground/40`
- **Text**:
  - Primary: `text-lg font-medium text-muted-foreground`
  - Secondary: `text-sm text-muted-foreground/70`
- **Spacing**: Centered vertically and horizontally
- **CTA** (owner only):
  - Small button, `variant="ghost"`
  - Links to editor section
  - Only visible if current user is owner

**Examples:**

**Impact Metrics Empty:**

```
     📊

No impact metrics tracked yet
Add users, revenue, or waitlist count
to showcase your traction
```

**Tech Stack Empty:**

```
     💻

No technologies listed
Add your tech stack to help others
understand what you built with
```

**Milestones Empty:**

```
     🎯

No milestones added yet
Document your achievements and
key moments to show progress
```

---

## Responsive Behavior

### Desktop (>1024px)

- Max-width: `1400px` for full-bleed sections (header, showcase)
- Max-width: `1200px` for content sections
- Grids: 3-column for cards
- Typography: Full size hierarchy

### Tablet (768px - 1024px)

- Max-width: `100vw - 48px` padding
- Grids: 2-column for cards
- Typography: Slightly smaller (90%)

### Mobile (<768px)

- Max-width: `100vw - 32px` padding
- Grids: 1-column for cards
- Typography: Mobile-optimized
- Stack action buttons vertically
- Creator attribution: Stack name/details

---

## Spacing & Rhythm

### Section Spacing

- Between sections: `py-16 md:py-20` (64-80px)
- Section borders: `border-b border-white/[0.06]`
- Background alternation: Every other section `bg-white/[0.01]`

### Internal Spacing

- Section header to content: `mb-12` (48px)
- Grid gaps: `gap-6` (24px)
- Card padding: `p-6` to `p-8` (24-32px)
- Empty state padding: `py-16` (64px vertical)

### Typography Rhythm

- Section headings: `mb-12` (48px below)
- Paragraph spacing: `mb-6` (24px between paragraphs)
- List items: `gap-4` (16px)

---

## Color System

### Backgrounds

- Page: `bg-background` (black)
- Section alt: `bg-white/[0.01]`
- Cards: `bg-gradient-to-br from-white/[0.03] to-white/[0.01]`
- Hover cards: `from-white/[0.05]`

### Borders

- Default: `border-white/[0.08]`
- Hover: `border-white/[0.12]`
- Section dividers: `border-white/[0.06]`

### Text

- Headings: `text-foreground` (white)
- Body: `text-foreground/90` (slightly muted)
- Muted: `text-muted-foreground` (~60% opacity)
- Empty states: `text-muted-foreground/70`

### Accents

- Primary: Buffalo Blue `#0070f3`
- Icons: `text-primary`
- Links: `text-primary hover:underline`

---

## Interaction States

### Cards (Evidence, Metrics, etc.)

- **Default**: Subtle gradient, soft border
- **Hover**:
  - Border brightens: `border-white/[0.12]`
  - Background shifts: `from-white/[0.05]`
  - Lift: `transform translateY(-2px)`
  - Shadow: `shadow-lg shadow-primary/10`
- **Active/Click**: Slight scale down `scale-[0.98]`

### Buttons

- **Primary CTA** (Demo, GitHub):
  - Default: `bg-primary text-primary-foreground`
  - Hover: `bg-primary/90 scale-105`
  - Shadow: `shadow-2xl shadow-blue-500/40`
- **Secondary** (Share, Feedback):
  - Default: `bg-white/[0.03] border-white/[0.1]`
  - Hover: `bg-white/[0.06] border-white/[0.15]`
- **Appreciate** (Heart):
  - Default: `border-white/[0.1]`
  - Appreciated: `border-red-500/30 bg-red-500/5`
  - Icon fill: `fill-red-500 text-red-500`

### Creator Attribution

- **Default**: Muted text, small avatar
- **Hover**:
  - Name underlines
  - Avatar scales slightly: `scale-110`
  - Cursor: `cursor-pointer`

---

## Accessibility

### Keyboard Navigation

- All interactive elements tabbable
- Focus rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`
- Skip to main content link

### Screen Readers

- Semantic HTML: `<section>`, `<article>`, `<header>`
- ARIA labels for icons
- Alt text for images
- Hidden text for context ("Download", not just icon)

### Color Contrast

- All text meets WCAG AA standards
- Icon-only buttons have tooltips
- Empty states have sufficient contrast

---

## Animation & Motion

### Page Load

- Staggered entrance: Each section fades in with `0.1s` delay
- Scroll-triggered: `whileInView` for sections
- Duration: `400ms` with `ease-in-out`

### Micro-interactions

- Button hover: `200ms` scale transition
- Card hover: `300ms` all properties
- Empty state icon: Subtle `pulse` animation (optional)

### Performance

- Use `will-change: transform` sparingly
- Hardware-accelerated properties only (transform, opacity)
- Respect `prefers-reduced-motion`

---

## Component Architecture

### Shared Components

1. **EmptyState.tsx** - Reusable empty state
   - Props: `icon`, `title`, `description`, `ctaText`, `ctaHref`

2. **SectionHeader.tsx** - Reusable section heading
   - Props: `icon`, `title`, `subtitle`

3. **DocumentCard.tsx** - Evidence document card
   - Props: `document`, `onClick`

### Modified Components

1. **ProjectHeader.tsx** - Add creator attribution
2. **ImpactMetrics.tsx** - Add empty state support
3. **TechStack.tsx** - Add empty state support
4. **GitHubStats.tsx** - Add empty state support
5. **MilestonesTimeline.tsx** - Add empty state support
6. **ProjectCommunity.tsx** - Add empty state support
7. **ProjectShowcase.tsx** - Add empty state support

---

## Edge Cases & Considerations

### Creator Attribution

- **No creator**: Hide section entirely
- **Creator with no profile**: Show name only, no link
- **Creator left platform**: Show "(Former member)"

### Evidence Documents

- **Large files**: Show file size warning (>10MB)
- **External links**: Validate URL, show external link icon
- **Video embeds**: Use lazy loading, thumbnail previews
- **Too many docs**: Paginate after 12 items

### Empty States

- **Owner viewing**: Show "Add in editor" CTA
- **Public viewer**: Just show informative message
- **Incomplete profile**: Show completeness score (optional)

### Performance

- **Lazy load images**: Below the fold
- **Intersection observer**: For scroll animations
- **Document previews**: Generate thumbnails server-side
- **Video embeds**: Lazy load, use facades

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Create EmptyState component
- [ ] Create SectionHeader component
- [ ] Define shared styles/tokens

### Phase 2: Creator Attribution

- [ ] Add creator field to ProjectHeader
- [ ] Style creator card/inline attribution
- [ ] Add hover/link interactions
- [ ] Handle edge cases (no creator, no profile)

### Phase 3: Evidence Documents

- [ ] Create DocumentCard component
- [ ] Create EvidenceDocuments section
- [ ] Implement file type detection
- [ ] Add download/view/visit actions
- [ ] Style empty state

### Phase 4: Empty States

- [ ] Add to ImpactMetrics
- [ ] Add to TechStack
- [ ] Add to GitHubStats
- [ ] Add to MilestonesTimeline
- [ ] Add to ProjectCommunity
- [ ] Add to ProjectShowcase

### Phase 5: Integration

- [ ] Update ProjectDetailPage layout
- [ ] Test with fully complete project
- [ ] Test with minimal project
- [ ] Test with mid-completion project
- [ ] Responsive testing (mobile, tablet, desktop)

### Phase 6: Polish

- [ ] Animation timing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing

---

## Success Metrics

**User Experience:**

- Users understand what's missing from incomplete projects
- Empty states motivate completion (A/B test)
- Creator attribution increases profile clicks

**Technical:**

- Page load < 2s (LCP)
- No layout shift (CLS < 0.1)
- Smooth animations (60fps)
- Accessible (WCAG AA)

**Business:**

- Increased project completion rates
- More evidence documents uploaded
- Higher engagement with creator profiles
