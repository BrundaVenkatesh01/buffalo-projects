# Buffalo Projects

Buffalo Projects is a **community-owned platform for builders to showcase their differentiation**—whether that's a startup idea, indie product, design system, research hypothesis, or any project you're building to stand out.

Document your work privately. Get feedback from the community. Publish when you're ready. **No gatekeepers.**

## What Buffalo Does

**Private Canvas** → Plan and build your project with a structured Business Model Canvas and evidence management.

**Public Gallery** → Share your work, get community validation, and discover what others are building.

**Peer Feedback** → Open comments from builders and mentors who care about your success.

**Community-Owned** → No company owns your data. Decisions are made transparently with community input.

## First Launch Features

- **Unified project editor** with Business Model Canvas + autosave + educational tooltips
- **Evidence management** - Upload and link documents to specific canvas blocks
- **Import tools** - Bring work from GitHub, URLs, PDFs, and pitch decks
- **Profile + Discovery** - Showcase your projects and find others
- **Community Gallery** - Auth-gated discovery with filters by stage/category/Give-Asks
- **Image cropping** - Interactive crop with aspect ratio selection for cover images
- **Publishing redesign** - Two-column layout with live preview and collapsible sections
- **Peer Feedback** - Comments and community validation (no formal mentorship required)
- **Onboarding system** - Welcome modals and canvas intro for new users
- **Offline-first** - Works without internet, syncs automatically
- **Open Data** - Export or delete your projects anytime

## What We're _Not_ Building

- Hosting or infrastructure
- Closed gatekeeping or approval workflows
- Founder-only exclusivity (anyone can build here)
- Monetization or B2B licensing (this is for the community)

---

## How It Works

```
1. Sign up (free, forever)
   ↓
2. Create private workspace (BUF-XXXX code)
   ↓
3. Build your project + upload evidence
   ↓
4. Publish to public gallery (when ready)
   ↓
5. Get feedback + connect with others
   ↓
6. Iterate + showcase your journey
```

---

## Tech Stack

| Area       | Tools                                                  |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 15 (App Router) + React 18                     |
| Language   | TypeScript, Zod for validation                         |
| Styling    | Tailwind CSS, custom design tokens, motion primitives  |
| Data       | Firebase Auth, Firestore, Storage with offline support |
| State      | Zustand stores with browser persistence                |
| AI & Email | Google Gemini, Resend-compatible email                 |
| Testing    | Vitest (unit), Playwright (E2E), axe-playwright (a11y) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy `.env.example` → `.env.local` and populate Firebase, Gemini, and email settings.

See [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for full details.

### 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign up to create your first workspace.

---

## Commands

### Development

```bash
npm run dev                # Start dev server (localhost:3000)
npm run build              # Production build
npm run preview            # Serve built app
```

### Quality

```bash
npm run typecheck          # TypeScript checking
npm run lint               # ESLint
npm run format             # Prettier
npm run test               # Vitest unit tests
npm run test:e2e           # Playwright E2E tests
npm run check:deep         # Full quality gate
```

### Deployment

```bash
npm run deploy             # Deploy to preview
npm run deploy:prod        # Deploy to production
```

---

## Community & Governance

This is a **community project**, not a company product. Here's what that means:

✅ **Your data is yours** - Download or delete anytime. See [PRIVACY_CHARTER.md](./PRIVACY_CHARTER.md).

✅ **Transparent decisions** - Community input shapes the roadmap. See [GOVERNANCE.md](./GOVERNANCE.md).

✅ **Open source** - Code is public. Anyone can audit, fork, or run their own instance.

✅ **No monetization** - We're funded by community members who believe in this.

For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Security & Privacy

- Input sanitized with DOMPurify
- Offline-first architecture means your canvas works without internet
- Firestore rules enforce data privacy (only you see private workspaces)
- All exports are available; deletion is permanent
- See [docs/SECURITY_VERIFICATION.md](./docs/SECURITY_VERIFICATION.md) for audit details

---

## Deployment

For production deployment, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

TL;DR:

1. Push to `main` to trigger Vercel build
2. Run `npm run build` locally first
3. Verify with `PRODUCTION_CHECKLIST.md`

---

## License & Attribution

Buffalo Projects is a **community-owned initiative**.

- Code: Open for audit and self-hosting
- Data: Owned by creators, managed by community governance
- Governance: Transparent, community-driven decisions

Contact the Buffalo Projects team for partnership inquiries.

---

## Questions?

- **Feature requests?** Use the in-app feedback tool
- **Found a bug?** Open an issue
- **Want to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Privacy concerns?** Read [PRIVACY_CHARTER.md](./PRIVACY_CHARTER.md)
- **How decisions get made?** See [GOVERNANCE.md](./GOVERNANCE.md)

We're building this with the community, not for it.
