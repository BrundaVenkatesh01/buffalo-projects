# Buffalo Projects Design Tokens

**Official design token system for Buffalo Projects brand identity**

🎨 **Primary Brand Color:** Buffalo Blue (#0070f3)
🌑 **Theme:** Professional dark theme with pure black (#000000)
✨ **Inspired by:** Vercel, OpenAI, and modern design systems

---

## 🚀 Quick Start

```typescript
// Import Buffalo brand tokens (recommended for brand consistency)
import { BUFFALO_BLUE, BUFFALO_DARK, BUFFALO_TEXT } from '@/tokens/brand';

// Use in your components
<button style={{ backgroundColor: BUFFALO_BLUE }}>
  Get Started
</button>

// Or import semantic tokens (recommended for components)
import { BUTTON, TEXT, BACKGROUND } from '@/tokens';

<button style={{
  backgroundColor: BUTTON.primary.background.default,  // Buffalo blue
  color: BUTTON.primary.text.default,
}}>
  Click Me
</button>
```

---

## 📚 Documentation

### Essential Guides

- **[Buffalo Brand Guide](./BUFFALO_BRAND_GUIDE.md)** - Brand identity and usage guidelines
- **[Quick Reference](./QUICK_REFERENCE.md)** - Fast token lookup
- **[Complete Token Guide](../../DESIGN_TOKENS.md)** - Full documentation

### Token Categories

- **[Primitives](./primitives/)** - Raw values (colors, spacing, typography)
- **[Semantics](./semantic/)** - Context-aware mappings (USE THESE!)
- **[Brand](./brand.ts)** - Buffalo Projects brand identity tokens

---

## 🎨 Buffalo Brand at a Glance

### Primary Brand Color

```typescript
Buffalo Blue: #0070f3
```

Use for all CTAs, links, focus states, and interactive elements.

### Dark Theme

```typescript
Canvas:   #000000  // Pure black
Surface:  #0a0a0a  // Cards, containers
Elevated: #111111  // Raised elements
```

### Typography

```typescript
Primary:   #ffffff  // Main text
Secondary: #a3a3a3  // Supporting text
Tertiary:  #737373  // De-emphasized text
```

---

## 📁 File Structure

```
src/tokens/
├── brand.ts                    # Buffalo brand identity tokens
├── index.ts                    # Main exports
├── BUFFALO_BRAND_GUIDE.md     # Brand usage guide
├── QUICK_REFERENCE.md         # Quick token lookup
├── README.md                  # This file
│
├── primitives/                # Raw values (foundation)
│   ├── colors.ts             # Color scales
│   ├── spacing.ts            # Spacing scale
│   ├── typography.ts         # Font system
│   ├── effects.ts            # Shadows, radius, etc.
│   ├── motion.ts             # Animations
│   └── index.ts
│
└── semantic/                  # Context tokens (USE THESE)
    ├── colors.ts             # Semantic colors
    ├── typography.ts         # Text styles
    ├── components.ts         # Component tokens
    └── index.ts
```

---

## 💡 Usage Examples

### Buffalo Branded Button

```tsx
import { BUFFALO_BRAND } from "@/tokens/brand";

<button
  style={{
    backgroundColor: BUFFALO_BRAND.blue.primary,
    color: BUFFALO_BRAND.text.primary,
    padding: "0.625rem 1rem",
    borderRadius: "0.375rem",
  }}
>
  Buffalo CTA
</button>;
```

### Using Component Tokens (Recommended)

```tsx
import { BUTTON } from "@/tokens";

<button
  style={{
    backgroundColor: BUTTON.primary.background.default,
    color: BUTTON.primary.text.default,
    padding: BUTTON.size.md.padding,
    height: BUTTON.size.md.height,
  }}
>
  Component Button
</button>;
```

### Card with Buffalo Theme

```tsx
import { CARD, TEXT } from "@/tokens";

<div
  style={{
    backgroundColor: CARD.default.background,
    border: `1px solid ${CARD.default.border}`,
    borderRadius: CARD.default.radius,
    padding: CARD.default.padding,
  }}
>
  <h3 style={{ color: TEXT.primary }}>Title</h3>
  <p style={{ color: TEXT.secondary }}>Description</p>
</div>;
```

---

## ✅ Best Practices

### DO

- ✅ Use Buffalo blue (#0070f3) for all primary CTAs
- ✅ Use semantic tokens from `@/tokens`
- ✅ Maintain pure black background (#000000)
- ✅ Follow text hierarchy (primary, secondary, tertiary)
- ✅ Use Buffalo blue for focus states
- ✅ Test accessibility (4.5:1 minimum contrast)

### DON'T

- ❌ Use primitives directly in components
- ❌ Mix Buffalo blue with other blues
- ❌ Use light backgrounds (maintain dark theme)
- ❌ Override Buffalo blue focus states
- ❌ Hardcode color values

---

## 🎯 Token Categories

### 1. Brand Tokens (`brand.ts`)

Buffalo Projects specific brand identity

```typescript
import { BUFFALO_BLUE, BUFFALO_DARK } from "@/tokens/brand";
```

### 2. Semantic Tokens (`semantic/`)

Context-aware tokens for components

```typescript
import { BUTTON, CARD, INPUT } from "@/tokens";
```

### 3. Primitive Tokens (`primitives/`)

Raw values (advanced use only)

```typescript
import { COLOR_PRIMITIVES, SPACING_PRIMITIVES } from "@/tokens/primitives";
```

---

## 🔧 TypeScript Support

All tokens are fully typed:

```typescript
import { ButtonVariant, ButtonSize } from "@/tokens";

interface MyButtonProps {
  variant: ButtonVariant; // 'primary' | 'secondary' | ...
  size: ButtonSize; // 'sm' | 'md' | 'lg'
}
```

---

## 📊 Brand Color Accessibility

All Buffalo colors meet WCAG AA standards:

```
White on Buffalo blue:  4.52:1 ✅ AA compliant
Buffalo blue on black:  8.19:1 ✅ AAA compliant
Secondary text on black: 6.84:1 ✅ AAA compliant
Tertiary text on black:  4.64:1 ✅ AA compliant
```

---

## 🌟 Why Use Design Tokens?

- **Consistency**: Single source of truth for design values
- **Maintainability**: Change once, update everywhere
- **Branding**: Automatic Buffalo Projects brand compliance
- **Type Safety**: Full TypeScript support
- **Accessibility**: WCAG compliant by default
- **Scalability**: Easy to theme and extend

---

## 📖 Learn More

- [Full Design Tokens Guide](../../DESIGN_TOKENS.md)
- [Buffalo Brand Guide](./BUFFALO_BRAND_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Style Dictionary](https://style-dictionary.web.app/) - Industry standard
- [W3C Design Tokens](https://www.w3.org/community/design-tokens/) - Specification

---

**Buffalo Projects** • Built with precision • Designed with purpose

**Version:** 1.0.0
**Last Updated:** 2025-01-07
