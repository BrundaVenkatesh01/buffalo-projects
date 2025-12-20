# UI/UX Testing Guide

**Best practices for testing UI and UX in Buffalo Projects**

## Testing Strategy Overview

Buffalo Projects uses a **multi-layered testing approach** combining automated and manual testing:

```
┌─────────────────────────────────────┐
│   Manual Testing (User Flows)       │  ← Real user feedback
├─────────────────────────────────────┤
│   E2E Tests (Playwright)           │  ← Full user journeys
├─────────────────────────────────────┤
│   Visual Regression (Screenshots)   │  ← Visual consistency
├─────────────────────────────────────┤
│   Accessibility (axe-playwright)    │  ← WCAG compliance
├─────────────────────────────────────┤
│   Component Tests (Vitest)          │  ← Unit-level validation
└─────────────────────────────────────┘
```

---

## 1. Component-Level Testing (Vitest)

**When to use**: Testing individual components in isolation

**Best for**:

- Component props and state
- Event handlers
- Conditional rendering
- Form validation logic

**Example**:

```typescript
// src/components/ui-next/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders with correct variant styles', () => {
  render(<Button variant="primary">Click me</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-primary');
});

test('handles click events', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  screen.getByRole('button').click();
  expect(handleClick).toHaveBeenCalledOnce();
});
```

**Run**: `npm run test:watch`

---

## 2. Storybook for Component Development

**When to use**: Visual component development and documentation

**Best for**:

- Isolated component development
- Visual testing of variants/states
- Design system documentation
- Accessibility checks in isolation

**Setup**: Already configured with `@storybook/addon-a11y`

**Run**: `npm run storybook`

**Best Practices**:

- Create stories for all component variants
- Use `@storybook/addon-a11y` to catch accessibility issues early
- Document component props and usage in MDX
- Test edge cases (empty states, loading states, error states)

**Example Story**:

```typescript
// src/components/ui-next/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

---

## 3. E2E Testing with Playwright

**When to use**: Testing complete user flows end-to-end

**Best for**:

- Critical user journeys (signup, workspace creation, publishing)
- Cross-browser compatibility
- Mobile responsiveness
- Integration testing

**Current Setup**:

- ✅ Multi-browser testing (Chromium, Firefox, WebKit)
- ✅ Mobile device emulation
- ✅ Screenshot on failure
- ✅ Trace on retry

**Run**:

- `npm run test:e2e` - Full suite
- `npm run test:e2e:ui` - Interactive UI mode
- `npm run test:e2e:headed` - Watch tests run
- `npm run test:e2e:next` - Only Next.js routes

**Best Practices**:

### 3.1 User Flow Testing

Test complete journeys, not isolated actions:

```typescript
// tests/critical-next-flows.spec.ts
test("complete workspace creation flow", async ({ page }) => {
  // 1. Navigate to workspace creation
  await page.goto("/workspace/new");

  // 2. Fill form
  await page.fill('input[name="title"]', "My Startup");
  await page.fill('textarea[name="description"]', "Description");

  // 3. Submit and verify redirect
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/workspace\/[a-z0-9-]+/);

  // 4. Verify workspace loaded
  await expect(page.locator("h1")).toContainText("My Startup");
});
```

### 3.2 Visual Regression Testing

Capture screenshots at key points:

```typescript
test("workspace editor renders correctly", async ({ page }) => {
  await page.goto("/workspace/test-id");
  await page.waitForLoadState("networkidle");

  // Full page screenshot
  await page.screenshot({
    path: "tests/screenshots/workspace-editor.png",
    fullPage: true,
  });

  // Component-specific screenshot
  const canvas = page.locator('[data-testid="business-model-canvas"]');
  await canvas.screenshot({
    path: "tests/screenshots/bmc-canvas.png",
  });
});
```

**Tip**: Use `.gitignore` for screenshots, commit only baseline images.

### 3.3 Responsive Testing

Test multiple viewports:

```typescript
const viewports = [
  { width: 375, height: 667, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1440, height: 900, name: "desktop" },
];

for (const viewport of viewports) {
  test(`homepage renders on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.screenshot({
      path: `tests/screenshots/homepage-${viewport.name}.png`,
      fullPage: true,
    });
  });
}
```

---

## 4. Accessibility Testing

**When to use**: Ensure WCAG compliance on every page

**Current Setup**: `axe-playwright` integrated

**Run**: Part of E2E suite (`tests/accessibility.next.spec.ts`)

**Best Practices**:

```typescript
import { injectAxe, checkA11y } from "axe-playwright";

test("gallery page is accessible", async ({ page }) => {
  await page.goto("/gallery");
  await injectAxe(page);

  await checkA11y(page, undefined, {
    axeOptions: {
      runOnly: ["wcag2a", "wcag2aa"], // Level A & AA
    },
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

**Common Issues to Test**:

- ✅ Color contrast ratios (4.5:1 for text, 3:1 for UI)
- ✅ Keyboard navigation (Tab order, focus indicators)
- ✅ Screen reader compatibility (ARIA labels, semantic HTML)
- ✅ Touch target sizes (minimum 44x44px on mobile)

**Manual Checks**:

- Navigate entire site with keyboard only
- Test with screen reader (VoiceOver, NVDA)
- Check color contrast with browser extensions

---

## 5. Performance Testing

**When to use**: Ensure fast load times and smooth interactions

**Metrics to Track**:

- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **TTI** (Time to Interactive) < 3.8s

**Playwright Performance Test**:

```typescript
test("homepage performance metrics", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const loadTime = Date.now() - startTime;

  // Measure LCP
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });
    });
  });

  expect(loadTime).toBeLessThan(3000);
  expect(lcp).toBeLessThan(2500);
});
```

**Web Vitals Integration**:

- Already using `web-vitals` package
- Consider adding to analytics service
- Monitor in production with PostHog/Vercel Analytics

---

## 6. UX Flow Testing

**When to use**: Validate user experience matches design intent

**Test These Flows**:

### 6.1 Onboarding Flow

```typescript
test("new user onboarding journey", async ({ page }) => {
  // 1. Sign up
  await page.goto("/signup");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // 2. Should redirect to workspace creation
  await expect(page).toHaveURL(/\/workspace\/new/);

  // 3. Complete onboarding
  await page.fill('[name="title"]', "My First Project");
  await page.click('button:has-text("Create")');

  // 4. Should see success state
  await expect(
    page.locator('[data-testid="onboarding-complete"]'),
  ).toBeVisible();
});
```

### 6.2 Error States

```typescript
test("handles form validation errors gracefully", async ({ page }) => {
  await page.goto("/workspace/new");

  // Submit empty form
  await page.click('button[type="submit"]');

  // Should show inline errors, not crash
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator("input:invalid")).toHaveCount(1);
});
```

### 6.3 Loading States

```typescript
test("shows loading feedback during async operations", async ({ page }) => {
  await page.goto("/workspace/test-id");

  // Trigger save
  await page.fill("textarea", "Updated content");
  await page.click('button:has-text("Save")');

  // Should show loading indicator
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();

  // Should clear after save completes
  await expect(page.locator('[aria-busy="true"]')).not.toBeVisible({
    timeout: 5000,
  });
});
```

---

## 7. Visual Design System Testing

**When to use**: Ensure design system consistency

**Current Test**: `tests/design-system-validation.next.spec.ts`

**Test These**:

- ✅ All component variants render correctly
- ✅ Spacing/padding matches design tokens
- ✅ Typography hierarchy is consistent
- ✅ Color usage follows design system
- ✅ Motion/animation timing matches spec

**Example**:

```typescript
test("button sizes match design tokens", async ({ page }) => {
  await page.goto("/design-system");

  const smButton = page.locator('button[data-size="sm"]').first();
  const mdButton = page.locator('button[data-size="md"]').first();

  const smBox = await smButton.boundingBox();
  const mdBox = await mdButton.boundingBox();

  // Small should be 32px height
  expect(smBox?.height).toBe(32);

  // Medium should be 40px height
  expect(mdBox?.height).toBe(40);
});
```

---

## 8. Manual Testing Checklist

**Run before every release**:

### Critical Paths

- [ ] Sign up → Create workspace → Publish project
- [ ] Sign in → View workspace → Edit BMC → Save
- [ ] Browse gallery → Filter → View project → Comment
- [ ] Mobile: All above flows on iPhone/Android

### Edge Cases

- [ ] Empty states (no projects, no comments)
- [ ] Error states (network failure, validation errors)
- [ ] Loading states (slow network simulation)
- [ ] Offline mode (Firebase offline persistence)

### Cross-Browser

- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

### Accessibility

- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader (VoiceOver/NVDA)
- [ ] Color contrast (use browser extension)
- [ ] Focus indicators visible

---

## 9. Testing Workflow

### During Development

1. **Component**: Write Storybook stories first
2. **Unit**: Add Vitest tests for logic
3. **E2E**: Add Playwright test for user flow
4. **Visual**: Capture screenshots for key states

### Before PR

```bash
# Run full test suite
npm run check:deep

# Run E2E tests
npm run test:e2e

# Check accessibility
npm run test:e2e -- tests/accessibility.next.spec.ts
```

### CI/CD Integration

- Run all tests on PR
- Block merge if tests fail
- Generate coverage reports
- Upload Playwright reports as artifacts

---

## 10. Tools & Commands Reference

| Task        | Command                   |
| ----------- | ------------------------- |
| Unit tests  | `npm run test`            |
| Watch mode  | `npm run test:watch`      |
| Coverage    | `npm run test:coverage`   |
| E2E tests   | `npm run test:e2e`        |
| E2E UI mode | `npm run test:e2e:ui`     |
| E2E headed  | `npm run test:e2e:headed` |
| Storybook   | `npm run storybook`       |
| Type check  | `npm run typecheck`       |
| Lint        | `npm run lint`            |
| Full check  | `npm run check:deep`      |

---

## 11. Best Practices Summary

✅ **DO**:

- Test user flows, not implementation details
- Use semantic selectors (`getByRole`, `getByLabelText`)
- Test accessibility on every page
- Capture screenshots for visual regression
- Test on multiple viewports
- Write tests that fail fast with clear errors

❌ **DON'T**:

- Test third-party libraries (test your usage)
- Rely solely on automated tests (manual testing matters)
- Skip accessibility testing
- Commit test artifacts (screenshots, reports) unless baselines
- Write flaky tests (avoid `waitForTimeout`, use proper waits)

---

## 12. Troubleshooting

### Tests are flaky

- Use `waitForLoadState('networkidle')` instead of `waitForTimeout`
- Wait for specific elements, not arbitrary delays
- Use `page.waitForSelector()` with proper selectors

### Screenshots differ between runs

- Ensure consistent viewport sizes
- Wait for animations to complete
- Use `fullPage: true` for consistent captures

### Accessibility tests failing

- Run `axe-playwright` in headed mode to see violations
- Check detailed HTML reports
- Fix issues incrementally (start with critical)

---

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
