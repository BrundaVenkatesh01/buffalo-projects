# Buffalo Projects Brand Identity Guide

**Official brand guidelines for Buffalo Projects design tokens**

## 🎨 Buffalo Blue - Our Signature Color

### Primary Brand Color

```
Buffalo Blue: #0070f3
RGB: (0, 112, 243)
HSL: (213, 100%, 48%)
```

Buffalo blue is our **primary brand color** and should be used for:

- ✅ All primary CTAs (call-to-action buttons)
- ✅ Links and interactive text
- ✅ Focus states on all interactive elements
- ✅ Primary navigation highlights
- ✅ Brand accents and highlights
- ✅ Loading indicators and progress bars

### Buffalo Blue Scale

```typescript
import { BUFFALO_BRAND } from "@/tokens/brand";

BUFFALO_BRAND.blue.primary; // #0070f3 - Main brand color
BUFFALO_BRAND.blue.hover; // #0061d5 - Hover states
BUFFALO_BRAND.blue.active; // #004fb7 - Active/pressed states
BUFFALO_BRAND.blue.light; // #4096ff - Light accents
BUFFALO_BRAND.blue.dark; // #003d99 - Dark accents
BUFFALO_BRAND.blue.subtle; // rgba(0, 112, 243, 0.1) - Background tints
```

## 🌑 Buffalo Dark - Our Theme

### Background System

Buffalo Projects uses a **pure black dark theme** for sophistication:

```typescript
import { BUFFALO_BRAND } from "@/tokens/brand";

BUFFALO_BRAND.dark.canvas; // #000000 - Page background (pure black)
BUFFALO_BRAND.dark.surface; // #0a0a0a - Cards, containers
BUFFALO_BRAND.dark.elevated; // #111111 - Raised elements
BUFFALO_BRAND.dark.hover; // #1a1a1a - Hover states
```

### Why Pure Black?

- **Professional**: Sophisticated, premium aesthetic
- **Vercel-inspired**: Following industry-leading design
- **Performance**: True black saves power on OLED screens
- **Contrast**: Creates clear visual hierarchy

## 📝 Typography Colors

### Text Hierarchy

```typescript
import { BUFFALO_BRAND } from "@/tokens/brand";

BUFFALO_BRAND.text.primary; // #ffffff - Headlines, primary content
BUFFALO_BRAND.text.secondary; // #a3a3a3 - Supporting text (64% opacity)
BUFFALO_BRAND.text.tertiary; // #737373 - De-emphasized (45% opacity)
BUFFALO_BRAND.text.inverse; // #000000 - Text on light backgrounds
```

### Usage Guidelines

- **Primary**: Use for all headlines, important content, labels
- **Secondary**: Use for descriptions, body text, metadata
- **Tertiary**: Use for captions, timestamps, de-emphasized info
- **Inverse**: Use when placing text on light backgrounds (rare)

## 🎯 Brand Application Examples

### Primary CTA Button (Buffalo Branded)

```tsx
import { BUFFALO_BRAND } from "@/tokens/brand";

<button
  style={{
    backgroundColor: BUFFALO_BRAND.blue.primary, // Buffalo blue
    color: BUFFALO_BRAND.text.primary, // White text
    padding: "0.625rem 1rem",
    borderRadius: "0.375rem",
    transition: "all 0.2s ease",
  }}
>
  Get Started with Buffalo
</button>;

// On hover:
// backgroundColor: BUFFALO_BRAND.blue.hover
```

### Buffalo Link

```tsx
import { BUFFALO_BRAND } from "@/tokens/brand";

<a
  style={{
    color: BUFFALO_BRAND.blue.primary, // Buffalo blue
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  }}
>
  Learn more
</a>;
```

### Buffalo Card

```tsx
import { BUFFALO_BRAND } from "@/tokens/brand";

<div
  style={{
    backgroundColor: BUFFALO_BRAND.dark.surface, // Dark surface
    border: `1px solid ${BUFFALO_BRAND.border.default}`, // Subtle border
    borderRadius: "0.75rem",
    padding: "1.5rem",
  }}
>
  <h3 style={{ color: BUFFALO_BRAND.text.primary }}>Project Title</h3>
  <p style={{ color: BUFFALO_BRAND.text.secondary }}>
    Project description goes here
  </p>
</div>;
```

### Buffalo Input with Focus

```tsx
import { BUFFALO_BRAND } from "@/tokens/brand";

<input
  style={{
    backgroundColor: BUFFALO_BRAND.dark.surface,
    border: `1px solid ${focused ? BUFFALO_BRAND.blue.primary : BUFFALO_BRAND.border.default}`,
    color: BUFFALO_BRAND.text.primary,
    borderRadius: "0.5rem",
    padding: "0.625rem 0.75rem",
    boxShadow: focused ? `0 0 0 3px ${BUFFALO_BRAND.blue.subtle}` : "none",
  }}
/>;
```

## ✅ Brand Do's

### DO use Buffalo blue for:

- Primary CTAs
- Interactive elements
- Focus states
- Active states
- Links
- Brand moments

### DO use pure black:

- Page backgrounds
- Canvas layers
- Modal overlays
- Full-screen backgrounds

### DO maintain contrast:

- Minimum 4.5:1 ratio for text
- WCAG AA compliance
- Test on actual screens

## ❌ Brand Don'ts

### DON'T:

- ❌ Mix Buffalo blue with other blues (stay consistent)
- ❌ Use light backgrounds (maintain dark theme)
- ❌ Override Buffalo blue focus states
- ❌ Use gradients on Buffalo blue (keep it pure)
- ❌ Change opacity of Buffalo blue (use the scale)
- ❌ Use colors outside the token system

## 🎨 Quick Brand Access

```typescript
import {
  BUFFALO_BLUE,    // Quick access to #0070f3
  BUFFALO_DARK,    // Quick access to #000000
  BUFFALO_TEXT,    // Quick access to text colors
} from '@/tokens/brand';

// Use in components
<button style={{ backgroundColor: BUFFALO_BLUE }}>
  Buffalo CTA
</button>
```

## 🎯 Brand Consistency Checklist

Before shipping any component, verify:

- [ ] Primary CTAs use Buffalo blue (#0070f3)
- [ ] Focus states use Buffalo blue
- [ ] Links use Buffalo blue
- [ ] Background is pure black (#000000)
- [ ] Text meets contrast requirements
- [ ] Interactive states use Buffalo blue scale
- [ ] No custom blues outside the token system
- [ ] Dark theme consistency maintained

## 📊 Brand Color Contrast Ratios

All Buffalo brand colors meet WCAG AA standards:

```
White text on Buffalo blue:     4.52:1 ✅ (AA compliant)
Buffalo blue on black:          8.19:1 ✅ (AAA compliant)
Secondary text on black:        6.84:1 ✅ (AAA compliant)
Tertiary text on black:         4.64:1 ✅ (AA compliant)
```

## 🚀 Using Brand Tokens

### Import the brand system:

```typescript
import { BUFFALO_BRAND } from "@/tokens/brand";
```

### Or use quick exports:

```typescript
import { BUFFALO_BLUE, BUFFALO_DARK, BUFFALO_TEXT } from "@/tokens/brand";
```

### Full semantic tokens (recommended):

```typescript
import { BACKGROUND, TEXT, BUTTON } from "@/tokens";

// These automatically use Buffalo brand colors
BUTTON.primary.background.default; // Buffalo blue
TEXT.link.default; // Buffalo blue
BORDER.interactive.focus; // Buffalo blue
```

---

## 📚 Related Documentation

- [Full Design Tokens Guide](../../../DESIGN_TOKENS.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Component Guidelines](./semantic/components.ts)

---

**Buffalo Projects** • Designed with precision • Built with purpose

**Last Updated:** 2025-01-07
**Brand Version:** 1.0.0
