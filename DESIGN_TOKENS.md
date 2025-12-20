# Buffalo Projects Design Token System

**Official design token system for Buffalo Projects brand identity.**

A comprehensive, industry-standard design token system featuring Buffalo blue (#0070f3) as the primary brand color across all interactive elements.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Token Categories](#token-categories)
- [Usage Examples](#usage-examples)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)
- [TypeScript Support](#typescript-support)

---

## Overview

This is the **official Buffalo Projects design token system**, defining our brand's visual language. Inspired by Vercel's refined approach, our system centers on **Buffalo blue (#0070f3)** as the primary interactive color, paired with a sophisticated dark theme.

The system follows **industry best practices** used by companies like Vercel, Shopify, and Adobe. It provides:

- ✅ **Two-tier architecture** (primitives + semantics)
- ✅ **Full TypeScript support**
- ✅ **Automatic CSS variable generation**
- ✅ **Tailwind CSS integration**
- ✅ **Component-specific tokens**
- ✅ **Accessibility-focused**

---

## Architecture

### Two-Tier System

```
┌─────────────────────────────────────────┐
│         PRIMITIVES (Foundation)         │
│  Raw values - DO NOT use directly      │
│  • Colors: #0070f3, #000000, etc.      │
│  • Spacing: 0.25rem, 1rem, etc.        │
│  • Typography: Geist Sans, 16px, etc.  │
└─────────────────┬───────────────────────┘
                  │
                  │ Maps to
                  ▼
┌─────────────────────────────────────────┐
│      SEMANTIC TOKENS (Use These!)       │
│  Context-aware mappings                │
│  • button.primary.background.default   │
│  • text.primary, text.secondary        │
│  • card.elevated.shadow                │
└─────────────────────────────────────────┘
```

### Directory Structure

```
src/tokens/
├── primitives/          # Raw values (DON'T use directly)
│   ├── colors.ts       # Color scales
│   ├── spacing.ts      # Spacing scale (8px grid)
│   ├── typography.ts   # Font families, sizes, weights
│   ├── effects.ts      # Shadows, radius, opacity
│   ├── motion.ts       # Durations, easing, transitions
│   └── index.ts        # Primitive exports
│
├── semantic/           # Context tokens (USE THESE!)
│   ├── colors.ts       # Background, text, border colors
│   ├── typography.ts   # Display, heading, body, label
│   ├── components.ts   # Button, card, input tokens
│   └── index.ts        # Semantic exports
│
└── index.ts            # Main token export
```

---

## Quick Start

### Installation

Tokens are already integrated into the project. Simply import and use:

```typescript
import { BACKGROUND, TEXT, BUTTON, HEADING } from "@/tokens";
```

### Basic Usage

```tsx
import { BACKGROUND, TEXT, BUTTON } from "@/tokens";

function MyComponent() {
  return (
    <div style={{ backgroundColor: BACKGROUND.surface.base }}>
      <h1 style={{ color: TEXT.primary }}>Hello World</h1>
      <button
        style={{
          backgroundColor: BUTTON.primary.background.default,
          color: BUTTON.primary.text.default,
        }}
      >
        Click Me
      </button>
    </div>
  );
}
```

### With Tailwind CSS

Tokens are automatically available as CSS variables in `globals.css`:

```tsx
function MyComponent() {
  return (
    <div className="bg-background">
      <h1 className="text-foreground">Hello World</h1>
      <button className="bg-primary text-primary-foreground">Click Me</button>
    </div>
  );
}
```

---

## Token Categories

### 1. Colors

#### Buffalo Brand Colors

**Primary Brand Color: Buffalo Blue (#0070f3)**

All primary interactive elements (buttons, links, focus states) use Buffalo blue for brand consistency.

```typescript
import { COLOR_PRIMITIVES } from "@/tokens/primitives";

// Buffalo Projects primary brand color
COLOR_PRIMITIVES.buffalo[500]; // #0070f3 - Main Buffalo blue
COLOR_PRIMITIVES.buffalo[600]; // #0061d5 - Buffalo blue hover
COLOR_PRIMITIVES.buffalo[700]; // #004fb7 - Buffalo blue active
```

#### Background Colors

```typescript
import { BACKGROUND } from "@/tokens";

BACKGROUND.canvas; // App background (#000000)
BACKGROUND.surface.base; // Base surface (#0a0a0a)
BACKGROUND.surface.elevated; // Elevated surface (#111111)
BACKGROUND.interactive.hover; // Interactive hover state
BACKGROUND.primary.default; // Buffalo blue (#0070f3)
```

#### Text Colors

```typescript
import { TEXT } from "@/tokens";

TEXT.primary; // Primary text (#ffffff)
TEXT.secondary; // Secondary text (#a3a3a3)
TEXT.tertiary; // Tertiary text (#737373)
TEXT.disabled; // Disabled text
TEXT.link.default; // Buffalo blue (#0070f3) - brand color
```

#### Border Colors

```typescript
import { BORDER } from "@/tokens";

BORDER.default; // Default border
BORDER.interactive.focus; // Buffalo blue (#0070f3) focus ring
BORDER.primary; // Buffalo blue (#0070f3) borders
BORDER.error; // Error border
```

### 2. Typography

```typescript
import { DISPLAY, HEADING, BODY, LABEL, CODE } from "@/tokens";

// Display text (hero sections)
DISPLAY.xl; // { fontSize: '3rem', lineHeight: '1', fontWeight: '700', ... }
DISPLAY.lg; // { fontSize: '2.25rem', ... }

// Headings
HEADING.xl; // { fontSize: '1.25rem', lineHeight: '1.75rem', ... }
HEADING.lg; // { fontSize: '1.125rem', ... }

// Body text
BODY.lg; // { fontSize: '1rem', lineHeight: '1.75rem', ... }
BODY.md; // { fontSize: '1rem', lineHeight: '1.5rem', ... }

// Labels
LABEL.uppercase; // { fontSize: '0.75rem', letterSpacing: '0.24em', ... }

// Code
CODE.md; // { fontSize: '0.875rem', fontFamily: 'monospace', ... }
```

### 3. Components

#### Buttons

**Buffalo branded buttons** feature Buffalo blue (#0070f3) for all primary CTAs:

```typescript
import { BUTTON } from "@/tokens";

// Primary button (Buffalo blue)
BUTTON.primary.background.default; // Buffalo blue (#0070f3)
BUTTON.primary.background.hover; // Buffalo blue hover (#0061d5)
BUTTON.primary.background.active; // Buffalo blue active (#004fb7)
BUTTON.primary.text.default; // White text on Buffalo blue

// Size variants
BUTTON.size.sm; // { padding: '0.5rem 0.75rem', height: '2rem', ... }
BUTTON.size.md; // { padding: '0.625rem 1rem', height: '2.5rem', ... }
```

#### Cards

```typescript
import { CARD } from "@/tokens";

CARD.default.background; // Card background
CARD.default.border; // Card border
CARD.default.shadow; // Card shadow
CARD.elevated.shadow; // Elevated card shadow
CARD.interactive.background.hover; // Interactive hover
```

#### Inputs

All inputs use **Buffalo blue focus states** for brand consistency:

```typescript
import { INPUT } from "@/tokens";

INPUT.default.background.default;
INPUT.default.border.focus; // Buffalo blue (#0070f3) focus ring
INPUT.default.shadow.focus; // Buffalo blue glow on focus
INPUT.default.shadow.error;
INPUT.size.md; // Size variant
```

### 4. Effects

```typescript
import { BORDER_RADIUS, BOX_SHADOW, Z_INDEX } from "@/tokens";

BORDER_RADIUS.lg; // 0.5rem (8px)
BORDER_RADIUS.xl; // 0.75rem (12px)

BOX_SHADOW.md; // Medium shadow
BOX_SHADOW["glow-blue"]; // Blue glow effect

Z_INDEX.modal; // 1050
Z_INDEX.tooltip; // 1070
```

### 5. Motion

```typescript
import { DURATION, EASING, TRANSITION } from "@/tokens";

DURATION.fast; // 150ms
DURATION.DEFAULT; // 200ms

EASING.out; // cubic-bezier(0, 0, 0.2, 1)
EASING.vercel; // Vercel-style easing

TRANSITION.colors.DEFAULT; // Complete color transition
TRANSITION.transform.bounce; // Bounce transform
```

---

## Usage Examples

### Example 1: Custom Button Component

```tsx
import { BUTTON } from "@/tokens";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

function Button({ variant = "primary", size = "md", children }: ButtonProps) {
  const styles = {
    backgroundColor: BUTTON[variant].background.default,
    color: BUTTON[variant].text.default,
    border: `1px solid ${BUTTON[variant].border}`,
    borderRadius: BUTTON[variant].radius,
    padding: BUTTON.size[size].padding,
    height: BUTTON.size[size].height,
  };

  return <button style={styles}>{children}</button>;
}
```

### Example 2: Card Component

```tsx
import { CARD, TEXT, HEADING } from "@/tokens";

function ProjectCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        backgroundColor: CARD.interactive.background.default,
        border: `1px solid ${CARD.interactive.border.default}`,
        borderRadius: CARD.interactive.radius,
        padding: CARD.interactive.padding,
        transition: "all 0.2s ease",
      }}
    >
      <h3
        style={{
          ...HEADING.lg,
          color: TEXT.primary,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          ...BODY.md,
          color: TEXT.secondary,
        }}
      >
        {description}
      </p>
    </div>
  );
}
```

### Example 3: Form Input

```tsx
import { INPUT, TEXT } from "@/tokens";
import { useState } from "react";

function TextInput({ placeholder }: { placeholder: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        backgroundColor: INPUT.default.background.default,
        border: `1px solid ${focused ? INPUT.default.border.focus : INPUT.default.border.default}`,
        borderRadius: INPUT.default.radius,
        padding: INPUT.default.padding,
        height: INPUT.default.height,
        color: TEXT.primary,
        outline: "none",
        boxShadow: focused ? INPUT.default.shadow.focus : "none",
      }}
    />
  );
}
```

---

## Migration Guide

### From Old System to New Tokens

#### Before (Old Way)

```tsx
// ❌ Using arbitrary values
<div style={{ color: '#ffffff', backgroundColor: '#0a0a0a' }}>

// ❌ Using Tailwind arbitrary values
<div className="text-[#ffffff] bg-[#0a0a0a]">

// ❌ Using old theme.ts
import { theme } from '@/styles/theme';
<div style={{ color: theme.colors.text.primary }}>
```

#### After (New Way)

```tsx
// ✅ Using semantic tokens
import { TEXT, BACKGROUND } from '@/tokens';
<div style={{ color: TEXT.primary, backgroundColor: BACKGROUND.surface.base }}>

// ✅ Using Tailwind semantic classes
<div className="text-foreground bg-background">

// ✅ Using component tokens
import { BUTTON } from '@/tokens';
<button style={{ backgroundColor: BUTTON.primary.background.default }}>
```

### Migration Steps

1. **Identify hardcoded values**

   ```bash
   # Find hardcoded colors
   grep -r "#[0-9a-f]\{6\}" src/
   ```

2. **Replace with semantic tokens**
   - Background colors → `BACKGROUND.*`
   - Text colors → `TEXT.*`
   - Buttons → `BUTTON.*`
   - Cards → `CARD.*`

3. **Update imports**

   ```typescript
   // Old
   import { theme } from "@/styles/theme";

   // New
   import { TEXT, BACKGROUND, BUTTON } from "@/tokens";
   ```

4. **Test thoroughly**
   - Visual regression testing
   - Check dark mode (if applicable)
   - Verify accessibility

---

## Best Practices

### ✅ DO

```typescript
// ✅ Use semantic tokens
import { TEXT, BUTTON } from '@/tokens';
const textColor = TEXT.primary;
const buttonBg = BUTTON.primary.background.default;

// ✅ Destructure for cleaner code
const { primary, secondary } = TEXT;

// ✅ Use component-specific tokens
import { CARD } from '@/tokens';
const cardShadow = CARD.elevated.shadow;

// ✅ Spread typography objects
<h1 style={{ ...HEADING.xl }}>Title</h1>
```

### ❌ DON'T

```typescript
// ❌ Don't use primitives directly
import { COLOR_PRIMITIVES } from "@/tokens/primitives";
const bad = COLOR_PRIMITIVES.blue[600];

// ❌ Don't hardcode values
const bad = "#0070f3";
const alsoBad = "16px";

// ❌ Don't bypass the token system
const bad = "rgba(0, 112, 243, 0.5)";
```

### When to Use Primitives

Only use primitives when:

1. Creating **new semantic tokens**
2. Building **theme variants**
3. **System-level utilities** (rare)

---

## TypeScript Support

All tokens are fully typed:

```typescript
import { ButtonVariant, ButtonSize, TextColor } from "@/tokens";

// Type-safe component props
interface ButtonProps {
  variant: ButtonVariant; // 'primary' | 'secondary' | 'ghost' | ...
  size: ButtonSize; // 'sm' | 'md' | 'lg' | ...
}

// Autocomplete for token paths
import { TEXT } from "@/tokens";
const color = TEXT.primary; // Full autocomplete support
```

---

## Resources

- [Style Dictionary](https://style-dictionary.web.app/) - Design token standard
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/) - W3C specification
- [Vercel Design](https://vercel.com/design) - Inspiration for our system
- [Tailwind CSS](https://tailwindcss.com/) - Integration documentation

---

## Questions?

If you have questions about the token system:

1. Check this documentation first
2. Look at usage examples in `/src/tokens/`
3. Review existing components for patterns
4. Ask the team in #design-system

---

**Last Updated:** 2025-01-07
**Version:** 1.0.0
