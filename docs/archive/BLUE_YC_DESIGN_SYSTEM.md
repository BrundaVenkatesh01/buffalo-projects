# Buffalo Projects Design System - Blue YC Aesthetic

## 🎯 Design Philosophy

Buffalo Projects combines:

- **YC/SF directness** - No fluff, just facts
- **Buffalo blue branding** - Trust, community, tech credibility
- **Information density** - Builder-focused, scannable
- **Monospaced accents** - Technical credibility

**Tagline**: "Simple tools for Buffalo builders. No gatekeepers."

---

## 🎨 Color System

### Primary Palette (Blue)

```css
/* Primary - Buffalo Blue (trust, interaction) */
--primary: 213 100% 50%; /* #0070F3 - Vercel blue */
--primary-hover: 213 100% 45%; /* Darker on hover */
--primary-foreground: 0 0% 100%; /* White text on blue */

/* Blue Accents for YC Style */
--blue-400: #60a5fa; /* Arrows, badges, highlights */
--blue-500: #3b82f6; /* Primary actions */
--blue-600: #2563eb; /* Hover states */
```

### Neutrals (YC-inspired)

```css
/* Canvas - Pure black for YC aesthetic */
--background: 0 0% 0%; /* #000000 */
--foreground: 0 0% 98%; /* #FAFAFA */

/* Text Hierarchy */
--text-primary: #ffffff; /* Headlines, emphasis */
--text-secondary: #cbd5e1; /* Body copy (slate-300) */
--text-tertiary: #94a3b8; /* De-emphasized (slate-400) */
--text-muted: #64748b; /* Footer, helper (slate-500) */

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.1); /* Dividers */
--border-emphasis: rgba(255, 255, 255, 0.2); /* Focus states */
```

### Status Colors

```css
--success: #10b981; /* Green-500 */
--error: #ef4444; /* Red-500 */
--warning: #f59e0b; /* Amber-500 */
--info: #3b82f6; /* Blue-500 */
```

---

## 📝 Typography

### Font Stack

```css
/* Sans (Geist Sans) - Default */
font-family:
  var(--font-geist-sans),
  system-ui,
  -apple-system,
  sans-serif;

/* Mono (Geist Mono) - Technical elements */
font-family:
  var(--font-geist-mono), "SF Mono", Monaco, "Cascadia Code", monospace;
```

### Type Scale

| Level          | Size               | Weight           | Font | Line Height | Use Case          |
| -------------- | ------------------ | ---------------- | ---- | ----------- | ----------------- |
| **H1**         | `text-5xl` (48px)  | `bold` (700)     | Sans | `1.1`       | Page titles       |
| **H2**         | `text-2xl` (24px)  | `semibold` (600) | Sans | `1.3`       | Section headers   |
| **H3**         | `text-xl` (20px)   | `semibold` (600) | Sans | `1.4`       | Subsections       |
| **Body L**     | `text-lg` (18px)   | `normal` (400)   | Sans | `1.6`       | Intro paragraphs  |
| **Body**       | `text-base` (16px) | `normal` (400)   | Sans | `1.6`       | Default text      |
| **Body S**     | `text-sm` (14px)   | `normal` (400)   | Sans | `1.5`       | Helper text       |
| **Caption**    | `text-xs` (12px)   | `medium` (500)   | Mono | `1.4`       | Labels, badges    |
| **CLI Prompt** | `text-lg` (18px)   | `normal` (400)   | Mono | `1.5`       | `> Command` style |
| **Code**       | `text-sm` (14px)   | `normal` (400)   | Mono | `1.5`       | Inline code       |

### Typography Rules

```tsx
// Headlines - Bold, tight tracking
<h1 className="text-5xl font-bold text-white tracking-tight">

// Section headers - Semibold
<h2 className="text-2xl font-semibold text-white">

// Body copy - Relaxed leading
<p className="text-base text-slate-300 leading-relaxed">

// De-emphasized text
<p className="text-sm text-slate-400">

// CLI-style prompts
<p className="text-lg text-slate-400 font-mono">
  {'>'} Command here
</p>

// Badges
<span className="text-xs font-mono font-semibold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
  BETA
</span>
```

---

## 🧩 Component Patterns

### 1. Badges (Status Indicators)

```tsx
// BETA badge
<span className="px-2 py-0.5 text-xs font-mono font-semibold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
  BETA
</span>

// Coming Soon badge
<span className="px-2 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-slate-400 rounded border border-white/10">
  SOON
</span>

// Live badge
<span className="px-2 py-0.5 text-xs font-mono font-semibold bg-green-500/20 text-green-400 rounded border border-green-500/30">
  LIVE
</span>
```

### 2. Bullet Lists (Arrow Style)

```tsx
<ul className="space-y-3">
  <li className="flex gap-3">
    <span className="text-blue-400 font-mono shrink-0">→</span>
    <span className="text-slate-300">
      <strong className="text-white">Key point</strong> explanation here
    </span>
  </li>
</ul>
```

### 3. CLI-Style Prompts

```tsx
<p className="text-lg text-slate-400 font-mono">
  {">"} Decentralized platform for Buffalo entrepreneurs
</p>
```

### 4. Stats/Metrics Section

```tsx
<div className="grid grid-cols-2 gap-6">
  <div>
    <div className="text-2xl font-bold text-white font-mono">Q1 2026</div>
    <div className="text-sm text-slate-400">Target Launch</div>
  </div>
  <div>
    <div className="text-2xl font-bold text-white font-mono">100%</div>
    <div className="text-sm text-slate-400">Free Forever</div>
  </div>
</div>
```

### 5. Dividers

```tsx
// Subtle horizontal divider
<div className="border-t border-white/10 pt-8" />

// Section break with padding
<div className="border-t border-white/10 py-12" />
```

### 6. Buttons (YC Style)

```tsx
// Primary action
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors">
  Get Started
</button>

// Secondary action
<button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded border border-white/10 transition-colors">
  Learn More
</button>

// Inline link
<a className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline">
  Read docs →
</a>
```

### 7. Input Fields

```tsx
<input
  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="your@email.com"
/>
```

---

## 📐 Spacing System

### Vertical Rhythm

```css
/* Section gaps (major divisions) */
space-y-12  /* 48px - Between major sections */
space-y-16  /* 64px - Between page sections */

/* Content gaps (within sections) */
space-y-3   /* 12px - Tight grouping */
space-y-4   /* 16px - Related content */
space-y-6   /* 24px - Subsections */
space-y-8   /* 32px - Major content blocks */

/* Inline gaps (horizontal) */
gap-2       /* 8px - Icon + text */
gap-3       /* 12px - List items */
gap-4       /* 16px - Button groups */
gap-6       /* 24px - Cards */
```

### Padding

```css
/* Containers */
p-4    /* 16px - Mobile */
p-6    /* 24px - Tablet */
p-8    /* 32px - Desktop */

/* Cards/Sections */
p-6    /* 24px - Default */
p-8    /* 32px - Spacious */
```

### Max Widths

```css
max-w-2xl   /* 672px - Coming soon, forms */
max-w-3xl   /* 768px - Article width */
max-w-4xl   /* 896px - Landing pages */
max-w-6xl   /* 1152px - App layout */
max-w-7xl   /* 1280px - Wide layouts */
```

---

## 🎬 Animation Principles

### YC-Style: Minimal & Fast

```tsx
// Simple fade (0.4s)
gsap.from(elements, {
  opacity: 0,
  y: 8,
  duration: 0.4,
  stagger: 0.08,
  ease: 'power1.out',
});

// Button hover (instant)
transition-colors duration-200

// Focus states (instant)
transition-all duration-150
```

**Rules:**

- No complex choreography
- Fast load, fast interactions (200-400ms max)
- Stagger only for lists (80ms delay)
- Respect `prefers-reduced-motion`

---

## 📱 Responsive Breakpoints

```css
/* Mobile-first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Layout Patterns

```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Responsive text
<h1 className="text-4xl md:text-5xl lg:text-6xl">
```

---

## 🎯 Content Guidelines

### Voice & Tone

**DO:**

- ✅ "Build in public with workspace tools"
- ✅ "No gatekeepers. Just builders."
- ✅ "Free forever"
- ✅ Use → for bullets
- ✅ Include metrics/stats
- ✅ State problems plainly

**DON'T:**

- ❌ "The best platform for..."
- ❌ "Revolutionary solution..."
- ❌ Marketing superlatives
- ❌ Emoji overuse
- ❌ Center-aligned paragraphs
- ❌ Vague value props

### Writing Style

1. **Headlines**: Direct, factual
   - ❌ "Where Buffalo Builders Ship" (clever)
   - ✅ "Decentralized platform for Buffalo entrepreneurs" (clear)

2. **Features**: Lead with benefit
   - ✅ "Promote your project without gatekeepers"
   - ❌ "Project promotion feature"

3. **Stats**: Be specific
   - ✅ "Q1 2026 - Target Launch"
   - ❌ "Coming very soon"

---

## 🏗️ Site-Wide Integration Plan

### Phase 1: Core Pages (Priority)

1. ✅ **Coming Soon** (`/coming-soon`) - DONE
2. **Homepage** (`/`) - Apply YC layout
3. **Projects Gallery** (`/projects`) - Left-aligned list view
4. **Resources** (`/resources`) - Simple table/list
5. **About** (`/about`) - Text-first story

### Phase 2: App Pages

1. **Workspace** (`/studio`) - Minimal chrome
2. **Project Detail** (`/p/[slug]`) - Clean reading experience
3. **Profile** (`/profile`) - Simple settings
4. **Sign In/Up** (`/signin`, `/signup`) - Stripped forms

### Phase 3: Components

1. **Navigation** - Simpler, left-aligned
2. **Buttons** - YC style variants
3. **Forms** - Clean inputs
4. **Cards** - Minimal borders
5. **Modals** - Less decoration

---

## 📦 Component Library Updates

### Button Variants

```tsx
// button-variants.ts updates
yc: 'bg-blue-500 hover:bg-blue-600 text-white font-medium',
ycSecondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white',
ycGhost: 'text-blue-400 hover:text-blue-300 hover:underline',
```

### Card Variants

```tsx
// Minimal YC card
<div className="border border-white/10 rounded p-6">

// With subtle hover
<div className="border border-white/10 hover:border-white/20 rounded p-6 transition-colors">
```

---

## 🎨 Before & After Examples

### Homepage Hero

**Before (Premium):**

```tsx
<div className="text-center">
  <h1 className="text-8xl bg-gradient-to-r from-blue-300 to-cyan-300">
    Buffalo Projects
  </h1>
  {/* Glassmorphism cards */}
</div>
```

**After (Blue YC):**

```tsx
<div className="text-left max-w-2xl">
  <div className="flex items-baseline gap-3">
    <h1 className="text-5xl font-bold text-white tracking-tight">
      Buffalo Projects
    </h1>
    <span className="text-xs font-mono bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
      BETA
    </span>
  </div>
  <p className="text-lg font-mono text-slate-400">
    {">"} Decentralized platform for Buffalo entrepreneurs
  </p>
</div>
```

### Project Cards

**Before:**

```tsx
<div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
  {/* Glassmorphism */}
</div>
```

**After:**

```tsx
<div className="border border-white/10 rounded p-6 hover:border-white/20 transition-colors">
  <div className="flex items-baseline gap-2">
    <h3 className="text-lg font-semibold text-white">Project Name</h3>
    <span className="text-xs font-mono text-blue-400">LIVE</span>
  </div>
  <p className="text-sm text-slate-400 mt-2">Description...</p>
</div>
```

---

## ✅ Implementation Checklist

### Design Tokens

- [ ] Update `tailwind.config.ts` with blue YC colors
- [ ] Add mono font utilities
- [ ] Define spacing system

### Components

- [ ] Create `Badge` component (BETA, LIVE, SOON)
- [ ] Create `ArrowList` component
- [ ] Create `StatCard` component
- [ ] Update `Button` variants
- [ ] Update `Input` styles

### Pages

- [x] Coming Soon - DONE
- [ ] Homepage
- [ ] Projects Gallery
- [ ] Resources
- [ ] About
- [ ] Workspace
- [ ] Sign In/Up

### Documentation

- [x] Design system doc - DONE
- [ ] Component usage examples
- [ ] Migration guide for existing pages

---

## 🚀 Next Steps

1. **Test Coming Soon** - Verify blue YC aesthetic works
2. **Update Homepage** - Apply patterns to `/`
3. **Roll out to Projects** - Simplify gallery view
4. **Component Library** - Create reusable YC components
5. **Documentation** - Add Storybook/examples

---

**Status**: Blue YC Design System Defined ✅
**Brand**: Buffalo Blue + YC Directness
**Ready for**: Site-wide rollout

Simple tools for Buffalo builders. No gatekeepers. 🦬
