# Buffalo Projects Design Tokens - Quick Reference

**Quick lookup for Buffalo Projects branded design tokens**

Primary Brand Color: **Buffalo Blue (#0070f3)**

## 🎨 Buffalo Brand Colors

```typescript
import { BUFFALO_BRAND, BUFFALO_BLUE } from "@/tokens/brand";

// Buffalo Blue (Primary Brand Color)
BUFFALO_BLUE; // #0070f3 - Quick access
BUFFALO_BRAND.blue.primary; // #0070f3 - Main brand blue
BUFFALO_BRAND.blue.hover; // #0061d5 - Hover state
BUFFALO_BRAND.blue.active; // #004fb7 - Active state

// Buffalo Dark Theme
BUFFALO_BRAND.dark.canvas; // #000000 - Pure black background
BUFFALO_BRAND.dark.surface; // #0a0a0a - Cards, containers
BUFFALO_BRAND.dark.elevated; // #111111 - Elevated elements

// Buffalo Text
BUFFALO_BRAND.text.primary; // #ffffff - Main text
BUFFALO_BRAND.text.secondary; // #a3a3a3 - Supporting text
BUFFALO_BRAND.text.tertiary; // #737373 - De-emphasized text
```

## 🎨 Semantic Colors

```typescript
import { BACKGROUND, TEXT, BORDER } from "@/tokens";

// Backgrounds
BACKGROUND.canvas; // #000000 (pure black)
BACKGROUND.surface.base; // #0a0a0a (cards, containers)
BACKGROUND.surface.elevated; // #111111 (elevated cards)
BACKGROUND.interactive.hover; // rgba(255,255,255,0.05)
BACKGROUND.primary.default; // #0070f3 (Buffalo blue)

// Text
TEXT.primary; // #ffffff (main text)
TEXT.secondary; // #a3a3a3 (secondary text)
TEXT.tertiary; // #737373 (muted text)
TEXT.link.default; // #0070f3 (Buffalo blue links)

// Borders
BORDER.default; // rgba(255,255,255,0.08)
BORDER.interactive.focus; // #0070f3 (Buffalo blue focus)
BORDER.primary; // #0070f3 (Buffalo blue borders)
```

## 📝 Typography

```typescript
import { DISPLAY, HEADING, BODY, LABEL } from '@/tokens';

// Display (Hero text)
<h1 style={{ ...DISPLAY.xl }}>Hero Title</h1>

// Headings
<h2 style={{ ...HEADING.lg }}>Section Title</h2>
<h3 style={{ ...HEADING.md }}>Subsection</h3>

// Body
<p style={{ ...BODY.md }}>Regular paragraph text</p>

// Labels
<label style={{ ...LABEL.uppercase }}>Form Label</label>
```

## 🎯 Components

### Buttons

```typescript
import { BUTTON } from '@/tokens';

// Primary Button
{
  backgroundColor: BUTTON.primary.background.default,
  color: BUTTON.primary.text.default,
  borderRadius: BUTTON.primary.radius,
  boxShadow: BUTTON.primary.shadow,
  padding: BUTTON.size.md.padding,
  height: BUTTON.size.md.height,
}

// Sizes: BUTTON.size.sm | .md | .lg
```

### Cards

```typescript
import { CARD } from '@/tokens';

// Default Card
{
  backgroundColor: CARD.default.background,
  border: `1px solid ${CARD.default.border}`,
  borderRadius: CARD.default.radius,
  padding: CARD.default.padding,
}

// Variants: .default | .elevated | .interactive | .glass
```

### Inputs

```typescript
import { INPUT } from '@/tokens';

// Text Input
{
  backgroundColor: INPUT.default.background.default,
  border: `1px solid ${INPUT.default.border.default}`,
  borderRadius: INPUT.default.radius,
  padding: INPUT.default.padding,
  height: INPUT.default.height,
}

// Focus: INPUT.default.border.focus
// Error: INPUT.default.border.error
```

## 🎭 Effects

```typescript
import { BORDER_RADIUS, BOX_SHADOW, Z_INDEX } from "@/tokens";

// Border Radius
BORDER_RADIUS.sm; // 2px
BORDER_RADIUS.md; // 6px
BORDER_RADIUS.lg; // 8px
BORDER_RADIUS.xl; // 12px

// Shadows
BOX_SHADOW.sm; // Subtle shadow
BOX_SHADOW.md; // Medium shadow
BOX_SHADOW.lg; // Large shadow

// Z-Index
Z_INDEX.dropdown; // 1000
Z_INDEX.modal; // 1050
Z_INDEX.tooltip; // 1070
```

## ⚡ Motion

```typescript
import { DURATION, EASING, TRANSITION } from "@/tokens";

// Duration
DURATION.fast; // 150ms
DURATION.DEFAULT; // 200ms
DURATION.slow; // 300ms

// Easing
EASING.out; // Smooth out
EASING.inOut; // Both directions

// Transitions
transition: TRANSITION.colors.DEFAULT; // Color transitions
transition: TRANSITION.transform.DEFAULT; // Transform transitions
```

## 🔧 Tailwind Classes

Common semantic classes available in Tailwind:

```html
<!-- Colors -->
<div class="bg-background text-foreground">
  <div class="bg-card text-card-foreground">
    <div class="bg-primary text-primary-foreground">
      <!-- Borders -->
      <div class="border border-border">
        <div class="border border-primary">
          <!-- Shadows -->
          <div class="shadow-sm">
            <div class="shadow-md">
              <!-- Radius -->
              <div class="rounded-lg">
                <div class="rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 💡 Common Patterns

### Card with Hover

```typescript
{
  backgroundColor: CARD.interactive.background.default,
  border: `1px solid ${CARD.interactive.border.default}`,
  borderRadius: CARD.interactive.radius,
  padding: CARD.interactive.padding,
  transition: TRANSITION.all.DEFAULT,

  '&:hover': {
    backgroundColor: CARD.interactive.background.hover,
    border: `1px solid ${CARD.interactive.border.hover}`,
  }
}
```

### Primary CTA Button (Buffalo Branded)

```typescript
import { BUTTON, BUFFALO_BRAND } from '@/tokens';

// Using component tokens (recommended)
{
  backgroundColor: BUTTON.primary.background.default,  // Buffalo blue
  color: BUTTON.primary.text.default,
  padding: BUTTON.size.lg.padding,
  height: BUTTON.size.lg.height,
  borderRadius: BUTTON.primary.radius,
  boxShadow: BUTTON.primary.shadow,
  transition: TRANSITION.colors.DEFAULT,

  '&:hover': {
    backgroundColor: BUTTON.primary.background.hover,  // Buffalo blue hover
  }
}

// Or using brand tokens directly
{
  backgroundColor: BUFFALO_BRAND.blue.primary,  // #0070f3
  '&:hover': {
    backgroundColor: BUFFALO_BRAND.blue.hover,  // #0061d5
  }
}
```

### Form Input with Focus (Buffalo Blue Focus Ring)

```typescript
import { INPUT, BUFFALO_BRAND } from '@/tokens';
const [focused, setFocused] = useState(false);

{
  backgroundColor: INPUT.default.background.default,
  border: `1px solid ${focused ? INPUT.default.border.focus : INPUT.default.border.default}`,
  borderRadius: INPUT.default.radius,
  padding: INPUT.default.padding,
  height: INPUT.default.height,
  boxShadow: focused ? INPUT.default.shadow.focus : 'none',  // Buffalo blue glow
  transition: TRANSITION.all.fast,
}

// Focus state uses Buffalo blue (#0070f3) automatically
```

---

## 🎯 Buffalo Brand Quick Start

```typescript
// Import Buffalo brand tokens
import { BUFFALO_BLUE, BUFFALO_DARK, BUFFALO_TEXT } from '@/tokens/brand';

// Use in components
<div style={{ backgroundColor: BUFFALO_DARK }}>
  <h1 style={{ color: BUFFALO_TEXT.primary }}>Buffalo Projects</h1>
  <button style={{ backgroundColor: BUFFALO_BLUE }}>
    Get Started
  </button>
</div>
```

---

## 📚 Full Documentation

- [Complete Design Tokens Guide](../../DESIGN_TOKENS.md)
- [Buffalo Brand Identity Guide](./BUFFALO_BRAND_GUIDE.md)
- [Token System Overview](./index.ts)
