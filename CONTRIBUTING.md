# Contributing to Buffalo Projects

Thanks for being part of this community! We're building Buffalo **with** builders, not for them.

Whether you code, design, write, organize, or just have good ideas—we need you.

---

## Ways to Contribute

### 🏗️ Code

**Good first issues:** Look for `[good-first-issue]` label in GitHub issues

**Getting started:**

1. Fork the repo
2. `npm install`
3. `npm run dev`
4. Pick an issue or propose a feature
5. Submit a pull request
6. We'll review within 1 week

**Standards:**

- Tests required for new features (Vitest, >70% coverage)
- ESLint + Prettier pass (`npm run lint:fix`, `npm run format`)
- Conventional Commits (e.g., `feat: add gallery search`)
- Assign related GitHub issues to your PR

### 🎨 Design

**Help with:**

- UX/UI improvements
- Accessibility (a11y) audits
- Design system consistency
- Icon and visual asset creation

**How:**

- Open an issue with your idea
- Screenshot/prototype the improvement
- Design discussion in the issue
- Implement with developer support

### ✍️ Documentation

**What needs help:**

- User guides and tutorials
- API documentation
- Security audits and write-ups
- Community stories and case studies
- Translation to other languages

**How:**

- Edit directly in `docs/` or this repo
- Submit a PR with your changes
- We'll review and merge

### 🐛 Bug Reports & Testing

**Found a bug?**

1. Check existing issues (search first)
2. Create new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser/OS and Buffalo version
   - Screenshots/videos if helpful

**Testing:**

- Try new features before they ship
- Run E2E tests (`npm run test:e2e`)
- Test on different devices/browsers
- Report issues

### 💡 Feedback & Ideas

**No coding? No problem.**

- Use the in-app feedback tool
- Comment on GitHub issues and discussions
- Participate in monthly prioritization
- Vote on features you care about
- Share what you built and what worked

### 🤝 Community

**Help with:**

- Welcoming new members
- Organizing virtual events or local meetups
- Moderating discussions
- Creating tutorial videos
- Writing case studies
- Connecting builders who should know each other

---

## Development Setup

### Prerequisites

- Node.js ≥20.0.0
- npm (comes with Node)
- A Firebase project (free tier works)
- A text editor (we like VS Code)

### Quick Start

```bash
# Clone the repo
git clone https://github.com/buffaloproject/buffalo.git
cd buffalo

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Fill in the blanks (see docs/DEVELOPMENT_GUIDE.md for details)
# Minimal setup: Firebase config + Gemini key

# Start dev server
npm run dev

# Visit http://localhost:3000
```

### Key Commands

```bash
npm run dev              # Start dev server (hot reload)
npm run build            # Production build
npm run typecheck        # Type checking
npm run lint             # ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier formatting
npm test                 # Run Vitest unit tests
npm test:watch           # Watch mode for tests
npm run test:e2e         # Playwright E2E tests
npm run check:deep       # Full quality gate
```

### Environment Variables

See `.env.example` for the full list. For development, you need:

**Firebase:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**AI (optional, but nice to have):**

```
NEXT_PUBLIC_GEMINI_API_KEY=
```

See [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for full setup details and Firebase emulator instructions.

---

## Code Standards

### Style & Formatting

- **Indent:** 2 spaces (not tabs)
- **Quotes:** Double quotes for strings
- **Semicolons:** Yes, always
- **Prettier:** Runs automatically on save (if you set up ESLint extension)

**Run formatting before committing:**

```bash
npm run format
npm run lint:fix
```

### TypeScript

- All new code must be TypeScript (no `.js` files)
- Use `type` for type-only imports
- Enable strict mode (`strict: true` in tsconfig)
- Avoid `any` unless absolutely necessary (ask reviewers)

### Component Structure

```typescript
// ✅ Good structure
import { FC, ReactNode } from "react";
import { Button } from "@/components/unified";
import { BUFFALO_BLUE } from "@/tokens";

interface MyComponentProps {
  title: string;
  children?: ReactNode;
}

export const MyComponent: FC<MyComponentProps> = ({ title, children }) => {
  return <div className="p-4">{title}</div>;
};
```

**Naming:**

- Components: `PascalCase` (e.g., `MyComponent.tsx`)
- Hooks: `camelCase` starting with `use` (e.g., `useMyHook.ts`)
- Utilities: `camelCase` (e.g., `helpers.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `BUFFER_SIZE`)

### Import Order

Use the ESLint `import/order` rule. General order:

```typescript
// React
import { FC } from "react";

// Third-party
import { useQuery } from "@tanstack/react-query";

// Internal (aliased imports)
import { Button } from "@/components/unified";
import { authStore } from "@/stores/authStore";

// Relative
import { utils } from "../utils";
```

### Tests

- Write tests for new features (required for PR merge)
- Use Vitest syntax (similar to Jest)
- Aim for >70% line coverage, >60% branch coverage
- Test files in `src/**/__tests__/` or alongside code as `*.test.ts`

```typescript
// Example: src/utils/__tests__/sanitize.test.ts
import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "../sanitize";

describe("sanitizeHtml", () => {
  it("removes script tags", () => {
    const input = '<p>Hello <script>alert("xss")</script></p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
  });
});
```

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add gallery search
fix: prevent workspace autosave on error
docs: update contributing guide
style: reformat component imports
refactor: simplify evidence linking logic
test: add tests for privacy charter validation
chore: update dependencies
```

**Don't use emojis in commit messages.** (They're fun but make parsing harder.)

---

## Pull Request Process

### Before Submitting

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Write tests (if applicable)
4. Run quality checks:
   ```bash
   npm run check:deep
   ```
5. Format your code:
   ```bash
   npm run format
   npm run lint:fix
   ```

### Submitting

1. Push to your fork
2. Open a PR with:
   - Clear title (follows Conventional Commits)
   - Description of what changed and why
   - Link to related GitHub issue (if applicable)
   - Screenshots/videos if UI changed
3. Wait for review

### Review

- At least 1 maintainer review required
- CI checks must pass (tests, lint, type-checking)
- Requested changes must be addressed
- We aim to review within 1 week

### Merge

- Squash commits to keep history clean
- Delete branch after merge
- Your contribution is now live! 🎉

---

## Community Standards

### Be Respectful

- Assume good intent
- Disagree on ideas, not people
- Use welcoming language
- Welcome diverse perspectives

### Be Honest

- If you don't understand something, ask
- If you disagree, say so
- If you found a bug or flaw, report it
- No gatekeeping knowledge

### Be Accountable

- Own your mistakes
- Help others fix theirs
- Credit people who help you
- Follow through on commitments

### Be Inclusive

- Avoid jargon; explain terms
- Help newer contributors
- Review from beginners' perspective
- Celebrate all types of contributions

---

## Code of Conduct

Buffalo Projects is committed to fostering a welcoming, respectful community.

**We don't tolerate:**

- Harassment, discrimination, or hate speech
- Unwelcome sexual advances or comments
- Threats or intimidation
- Doxxing or privacy violations
- Spam or bad-faith disruption

**Report incidents to:** conduct@buffaloproject.io

All reports are confidential. We take them seriously and respond within 48 hours.

---

## Questions?

- **Setup problems?** Post in GitHub Discussions
- **Want to contribute but unsure how?** Pick an issue and comment—we'll help
- **Have an idea?** Open an issue or email hello@buffaloproject.io
- **Found a security issue?** Email security@buffaloproject.io (don't post publicly)

---

## Getting Recognized

**Contributors are the heart of this project.** Here's how we recognize you:

- Your name in [`CONTRIBUTORS.md`](./CONTRIBUTORS.md)
- Credit in commit messages
- Spotlight in monthly transparency reports
- Community member status in GitHub discussions
- Priority voting on features you care about
- Opportunity to become a maintainer (if interested)

**No monetary rewards (we're not-for-profit).** But you're building something real, with real people who care. That's worth something.

---

Buffalo Projects: **Built by the community, for the community.**

Ready to get started? Pick an issue or come chat in GitHub Discussions. We're excited to build with you.
