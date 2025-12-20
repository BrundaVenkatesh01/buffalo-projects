# Animation System Documentation

## Overview

Buffalo Projects uses a comprehensive motion and animation system built on **Framer Motion** with Vercel-inspired animation patterns. The system is designed to be accessible, performant, and easy to use.

## Architecture

### Core Files

- **[src/lib/motion.ts](../src/lib/motion.ts)** - Motion configuration, easings, and preset variants
- **[src/components/motion/](../src/components/motion/)** - Reusable motion components
- **[app/providers.tsx](../app/providers.tsx)** - Global MotionProvider setup

### Key Principles

1. **Reduced Motion Support** - Respects user's `prefers-reduced-motion` setting
2. **Scroll-Based Animations** - Elements animate when scrolling into view
3. **Performance** - Uses GPU-accelerated properties (opacity, transform)
4. **Consistency** - Vercel-inspired timing and easings throughout

## Motion Components

### MotionProvider

Wraps the entire app and provides global motion configuration. Automatically detects and respects reduced-motion preferences.

```tsx
// Already configured in app/providers.tsx
<MotionProvider>{children}</MotionProvider>
```

### FadeIn

Fades in elements when they scroll into view. Supports different directions.

```tsx
import { FadeIn } from "@/components/motion";

// Fade up (default)
<FadeIn>
  <h1>Content here</h1>
</FadeIn>

// Fade down
<FadeIn direction="down">
  <p>More content</p>
</FadeIn>

// With delay
<FadeIn delay={0.3}>
  <div>Delayed content</div>
</FadeIn>
```

**Props:**

- `direction?: "up" | "down" | "none"` - Animation direction (default: "up")
- `delay?: number` - Delay in seconds (default: 0)
- `duration?: number` - Duration in seconds (overrides default)

### StaggerContainer & StaggerItem

Creates staggered animations for lists and grids.

```tsx
import { StaggerContainer, StaggerItem } from "@/components/motion";

<StaggerContainer>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.name}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>

// Custom stagger timing
<StaggerContainer staggerDelay={0.1} delayChildren={0.2}>
  {/* children */}
</StaggerContainer>
```

**Props:**

- `staggerDelay?: number` - Delay between children (default: 0.05)
- `delayChildren?: number` - Delay before starting (default: 0.1)

### AnimatedCard

Card with hover and tap animations.

```tsx
import { AnimatedCard } from "@/components/motion";

<AnimatedCard>
  <CardContent>Interactive card</CardContent>
</AnimatedCard>

// Disable hover/tap
<AnimatedCard enableHover={false} enableTap={false}>
  <CardContent>Static card</CardContent>
</AnimatedCard>
```

**Props:**

- `enableHover?: boolean` - Enable hover animation (default: true)
- `enableTap?: boolean` - Enable tap animation (default: true)

### ScaleIn

Scales in elements with optional bounce effect.

```tsx
import { ScaleIn } from "@/components/motion";

// Smooth scale
<ScaleIn>
  <Badge>New</Badge>
</ScaleIn>

// Bouncy pop effect
<ScaleIn type="pop">
  <Button>Click me!</Button>
</ScaleIn>
```

**Props:**

- `type?: "smooth" | "pop"` - Animation type (default: "smooth")
- `delay?: number` - Delay in seconds (default: 0)

### SlideIn

Slides in content from left or right.

```tsx
import { SlideIn } from "@/components/motion";

<SlideIn direction="left">
  <Sidebar />
</SlideIn>

<SlideIn direction="right">
  <Panel />
</SlideIn>
```

**Props:**

- `direction?: "left" | "right"` - Slide direction (default: "left")
- `delay?: number` - Delay in seconds (default: 0)

### AnimatedPage

Page-level animation wrapper (for route transitions).

```tsx
import { AnimatedPage } from "@/components/motion";

export function MyPage() {
  return (
    <AnimatedPage>
      <h1>Page Content</h1>
    </AnimatedPage>
  );
}
```

## Motion Library (Advanced)

For custom animations, use the motion library directly:

```tsx
import { motion } from "framer-motion";
import { fadeInUp, easings, durations } from "@/lib/motion";

<motion.div
  initial="initial"
  whileInView="animate"
  variants={fadeInUp}
  viewport={{ once: true }}
>
  Custom animation
</motion.div>;
```

### Available Variants

**Page Transitions:**

- `pageVariants` - Standard page enter/exit

**Stagger Patterns:**

- `staggerContainer` - Container for staggered children
- `staggerItem` - Individual stagger item

**Card Animations:**

- `cardVariants` - Hover and tap states for cards

**Button Animations:**

- `buttonVariants` - Hover and tap states for buttons
- `magneticButton` - Magnetic hover effect

**Fade Animations:**

- `fadeIn` - Simple opacity fade
- `fadeInUp` - Fade up from below
- `fadeInDown` - Fade down from above

**Scale Animations:**

- `scaleIn` - Smooth scale in
- `popIn` - Bouncy scale in

**Slide Animations:**

- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right

**Reveal Animations:**

- `revealVariants` - Combined opacity, y, and scale

**Modal/Overlay:**

- `overlayVariants` - Backdrop fade
- `modalVariants` - Modal scale and fade

### Timing Functions

```tsx
import { easings, durations } from "@/lib/motion";

// Easings
easings.easeOut; // [0.16, 1, 0.3, 1] - Default, smooth deceleration
easings.easeIn; // [0.6, 0, 0.84, 0] - Acceleration
easings.easeInOut; // [0.45, 0, 0.55, 1] - Smooth both ends
easings.smooth; // [0.43, 0.13, 0.23, 0.96] - Premium feel
easings.snappy; // [0.68, -0.6, 0.32, 1.6] - Overshoot
easings.elastic; // [0.68, -0.55, 0.265, 1.55] - Bouncy

// Spring configs
easings.springGentle; // Gentle spring
easings.springMedium; // Medium spring (default for interactions)
easings.springSnappy; // Fast, snappy spring
easings.springBouncy; // Bouncy spring

// Durations (seconds)
durations.instant; // 0.1
durations.fast; // 0.15
durations.quick; // 0.2
durations.normal; // 0.3 (default)
durations.smooth; // 0.4
durations.slow; // 0.5
durations.deliberate; // 0.6
durations.dramatic; // 0.8
```

### Utility Functions

```tsx
import { createTransition, createStagger } from "@/lib/motion";

// Custom transition
const customTransition = createTransition(
  durations.smooth,
  easings.easeOut,
  0.2, // delay
);

// Custom stagger
const customStagger = createStagger(
  0.08, // stagger delay
  0.1, // initial delay
);
```

## Best Practices

### 1. Use Semantic Components

Prefer semantic motion components over raw framer-motion:

```tsx
// ✅ Good
<FadeIn>
  <h1>Title</h1>
</FadeIn>

// ❌ Avoid (unless custom animation needed)
<motion.h1
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Title
</motion.h1>
```

### 2. Respect Reduced Motion

All motion components automatically respect `prefers-reduced-motion`. No additional work needed!

### 3. Animate Performance-Friendly Properties

Stick to GPU-accelerated properties:

```tsx
// ✅ Good - GPU accelerated
(opacity, transform, scale, rotate, translateX / Y);

// ❌ Avoid - Causes reflow
(width, height, top, left, margin, padding);
```

### 4. Use whileInView for Scroll Animations

For elements below the fold, use viewport detection:

```tsx
<FadeIn>
  {" "}
  {/* Already uses whileInView */}
  <Content />
</FadeIn>
```

### 5. Stagger Lists and Grids

Use StaggerContainer for better visual hierarchy:

```tsx
<StaggerContainer>
  {items.map((item) => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### 6. Keep Delays Short

Delays >0.5s feel sluggish. Use 0.1-0.3s for sequenced animations.

```tsx
// ✅ Good
<FadeIn delay={0.2}>...</FadeIn>

// ❌ Too long
<FadeIn delay={1.5}>...</FadeIn>
```

## Examples

### Hero Section

```tsx
<section>
  <FadeIn delay={0.1}>
    <h1>Welcome to Buffalo Projects</h1>
  </FadeIn>
  <FadeIn delay={0.2}>
    <p>Build in public, ship with confidence</p>
  </FadeIn>
  <FadeIn delay={0.3}>
    <Button>Get Started</Button>
  </FadeIn>
</section>
```

### Stats Grid

```tsx
<StaggerContainer className="grid grid-cols-3 gap-4">
  <StaggerItem>
    <StatCard label="Projects" value="1.2K" />
  </StaggerItem>
  <StaggerItem>
    <StatCard label="Builders" value="320+" />
  </StaggerItem>
  <StaggerItem>
    <StatCard label="Pivots" value="450" />
  </StaggerItem>
</StaggerContainer>
```

### Project Cards

```tsx
<StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project) => (
    <StaggerItem key={project.id}>
      <Card>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Modal

```tsx
import { motion } from "framer-motion";
import { modalVariants, overlayVariants } from "@/lib/motion";

<motion.div
  variants={overlayVariants}
  initial="hidden"
  animate="visible"
  className="fixed inset-0 bg-black/50"
>
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="modal-content"
  >
    <h2>Modal Title</h2>
  </motion.div>
</motion.div>;
```

## Accessibility

### Reduced Motion

The system automatically detects `prefers-reduced-motion: reduce` and:

- Disables all animations
- Instant transitions (0s duration)
- Maintains layout shifts for accessibility

Users can enable this in:

- **macOS**: System Preferences → Accessibility → Display → Reduce Motion
- **Windows**: Settings → Ease of Access → Display → Show animations
- **iOS**: Settings → Accessibility → Motion → Reduce Motion

### Focus Management

Animations don't interfere with keyboard navigation or screen readers. Focus states remain visible during animations.

### Testing Reduced Motion

```javascript
// In browser console
matchMedia("(prefers-reduced-motion: reduce)").matches;
```

## Performance

### Optimization Tips

1. **Use `layout` prop sparingly** - Only when necessary (expensive)
2. **Prefer `whileInView` over `animate`** - Better performance for off-screen elements
3. **Set `viewport={{ once: true }}`** - Animate only on first view
4. **Batch animations** - Use StaggerContainer instead of individual delays

### Performance Monitoring

Check animation performance:

```tsx
import { useEffect } from "react";

useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry);
    }
  });

  observer.observe({ entryTypes: ["measure"] });

  return () => observer.disconnect();
}, []);
```

## Migration from Old Vite Codebase

If you have components in `.archive/` using the old motion system:

1. Replace `import { motion } from "framer-motion"` with semantic components
2. Replace custom variants with `FadeIn`, `StaggerContainer`, etc.
3. Remove manual `useReducedMotion()` hooks (handled automatically)

## Future Enhancements

- [ ] Route transition animations (Next.js App Router support)
- [ ] Shared layout animations for morphing elements
- [ ] Custom cursor animations for desktop
- [ ] Parallax scroll effects for marketing pages
- [ ] Loading skeleton animations

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Timing Functions](https://easings.net/)
- [Vercel Design System](https://vercel.com/design)
- [Web Animation Best Practices](https://web.dev/animations/)
