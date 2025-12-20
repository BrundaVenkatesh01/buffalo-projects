# Buffalo Projects - First Launch

**Last Updated:** December 2025
**Status:** Product Ready for Launch
**Mission:** Community-owned peer validation platform

---

## What We're Launching

Buffalo Projects is a **decentralized gallery + workspace platform** where builders document their projects and get authentic peer feedback.

### The Core Promise

```
Private Canvas (safe to iterate) + Community Gallery (curated discovery)
+ Peer Comments (authentic feedback) + Give and Asks (peer exchange) = No Gatekeepers
```

Anyone building anything can join the community, showcase their work, and get real feedback from fellow builders without asking permission or needing a track record.

---

## Launch Scope

### ✅ Core Features (Shipping)

**1. Unified Project Editor** (December 2025 Update)

- Single editor at `/edit/[code]` for all project types
- Business Model Canvas with 9 blocks + educational tooltips
- Autosave every 3 seconds
- Offline-first (works without internet)
- Private by default (only you see it)
- Unique workspace code (BUF-XXXX)
- Canvas intro modal for first-time users
- Compressed hero sections with standardized spacing

**2. Evidence Management**

- Upload PDFs, images, documents
- Link evidence to specific canvas blocks
- Document grid with preview
- Delete/manage files easily
- Optional AI analysis (Gemini)

**3. Import Tools**

- GitHub repo analysis + README extraction
- URL scraper for websites/landing pages
- PDF/DOCX document parsing
- Bulk import for multiple projects
- AI-powered business model extraction

**4. Community Gallery** (auth-required)

- Browse all published projects within the authenticated community
- Filter by: category (startup, design, indie, research, etc.), stage (idea, validation, shipped), tags, or Give/Asks
- Creator profiles with all projects
- Search functionality
- Discovery by what you need (find builders offering specific help)
- Curated community space (not open to anonymous browsing)

**5. Community Feedback**

- Comments on public projects
- Creator notification of feedback
- Delete your own comments anytime
- No algorithm or recommendation engine (human discovery)

**6. Profile & Showcase**

- Personal profile (bio, skills, location)
- All your projects listed
- Public/private toggle per project
- GitHub integration
- Export profile data

**7. Project Publishing** (December 2025 Redesign)

- Two-column layout with live preview
- 6 collapsible sections: Basics, Visual Media, Links, Community Exchange, Team, Acknowledgments
- Image cropping with aspect ratio selection (16:9, 3:2, 4:3, 1:1, Free)
- Visibility explainer tooltips
- Full-page preview before publishing
- Unpublish anytime (goes back to private)
- Gallery shows: name, creator, stage, category, Give/Asks, key blocks from canvas

**8. Give and Asks** (Peer Exchange)

- Add "Gives" to projects (what help you can offer others)
- Add "Asks" to projects (what help you need)
- Filter gallery by Gives/Asks to find builders offering specific help
- Match system: "Your ask matches someone's give" discovery
- Educational explainer tooltips in publish flow
- Examples: "Marketing feedback", "Product design review", "Intro to VCs", "User testing participants"

**9. Onboarding System** (NEW - December 2025)

- Welcome modal on first dashboard visit
- Canvas introduction modal for first-time editors
- Toggleable BMC block hints/tooltips
- Persistent state via localStorage

**10. Community Governance**

- Feature request voting at `/roadmap`
- Transparent decision-making at `/governance`
- Community shapes the platform roadmap
- No black-box decisions

### 🔮 Deliberately Deferred (Post-Launch / '26)

These were considered for launch but **explicitly deferred** to keep focus and sustainability:

- **Formal mentor system** - Informal peer feedback works for MVP
- **Groups/collaboration** - Need stronger community foundation first
- **Advanced notifications** - Disabled to avoid Firestore index errors; basic implementation exists but deferred
- **Interview logging** - Customer validation tools (deferred)
- **Validation scoring** - AI analysis of project health (deferred)
- **Specialized dashboards** - Analytics, traction tracking (deferred)
- **Blockchain/decentralization tech** - Governance-first, not tech-first
- **Self-hosted option** - Possible future feature

**Why defer?** Focus on the core loop. Network effects (mentorship, collaboration) matter more after we have a thriving gallery.

---

## Launch Goals & Success Metrics

### Primary Metrics (First 3 Months)

| Metric                   | Target          | Reasoning                                    |
| ------------------------ | --------------- | -------------------------------------------- |
| Signups                  | 500+            | Enough to seed gallery with diverse projects |
| Published projects       | 100+            | Gallery is discoverable and alive            |
| Avg projects per creator | 2+              | People trying, iterating, building           |
| Comments per project     | 3+              | Feedback loop working                        |
| 7-day retention          | 40%+            | Creators return to iterate                   |
| Monthly active creators  | 40%+ of signups | Sustainable engagement                       |

### Secondary Metrics

- **Creator satisfaction** - "I got useful feedback" (in-app survey: target ≥70%)
- **Community health** - Zero moderation incidents (spam, harassment)
- **Data trust** - Zero privacy issues or data leaks
- **Feature adoption** - Imports used ≥30%, Gallery browsing ≥60%

### Not Measuring

- Viral growth (not a goal)
- Time-on-platform (deeper matters than longer)
- Uninstalls (we want quality over quantity)
- Revenue (this is not-for-profit)

---

## Seeding the Gallery

**The biggest risk:** Launch to an empty gallery → crickets → no one joins.

**Solution: Bootstrap the gallery BEFORE public launch**

### Phase 1: Founding Member Recruitment (Weeks 1-2 Pre-Launch)

- **Target:** 30-50 founding members (diverse builders: founders, designers, makers, researchers, etc.)
- **Recruitment:** Direct outreach + word-of-mouth through existing networks
- **Incentive:** Early access, direct input on features, recognition
- **Activity:** Each founding member publishes 1-2 projects

**Result:** Gallery launches with 40-80 "real" projects visible

### Phase 2: Public Launch (Week 3)

- Announce to Buffalo ecosystem (43North, StartFast, universities, Slack communities)
- Founding members evangelize to their networks
- Gallery has visible, impressive projects
- New signups see something worth exploring

### Phase 3: Growth (Months 1-3)

- Monitor signup patterns and dropoff
- Iterate based on feedback
- Highlight interesting projects (no algorithm, manual curation)
- Host community calls showcasing projects
- Celebrate creators publicly

---

## User Journey (First Launch)

```
Curious builder lands on homepage
         ↓
Sees value prop + featured project previews
         ↓
Thinks: "This looks like a community I want to join"
         ↓
Signs up / Creates account
         ↓
Dashboard loads (sees profile + projects)
         ↓
Browses community gallery (discover tab)
         ↓
Reads a few published projects + comments
         ↓
Thinks: "Oh, I want to share my work here"
         ↓
Creates new workspace (BUF-XXXX)
         ↓
Fills canvas (Business Model Canvas blocks)
         ↓
Uploads evidence (research, mockups, etc.)
         ↓
(Optional) Uses import tools to accelerate (GitHub/URL/PDF)
         ↓
Adds "Gives" and "Asks" (what they offer, what they need)
         ↓
Publishes to community gallery
         ↓
Gets first comment / feedback from peer
         ↓
Updates project based on feedback
         ↓
Finds a project with a matching "Give" to their "Ask"
         ↓
Connects with that builder, exchange value
         ↓
Tells a friend: "Check out Buffalo Projects"
         ↓
Engaged member of community
```

**Aha moments:**

- First published project (validation)
- First comment received (proof people care)
- Updated project based on feedback (loop working)
- Found a builder whose "Give" matches their "Ask" (peer exchange works)
- Helped another builder with their "Ask" (giving back feels good)

---

## Content & Messaging

### Homepage Copy

**Hero:**

```
"Show the world what you're building.
Get feedback from peers who get it.
No gatekeepers. Just builders."
```

**Subheader:**

```
"Document your project. Share your journey. Get honest feedback from a community that's building too.

Not just startups—any project you're building to stand out."
```

### Gallery Landing

```
"Discover what Buffalo is building

Browse projects from founders, designers, makers, and researchers.
See what's being validated, what's shipping, what's just starting.
"
```

### Workspace Creation

```
"🔒 Your workspace is private
Only you can see it until you publish.
Document, iterate, then share when ready.
```

### First Comment UX

```
"You got feedback! 🎉

[Name] commented on your project:
'[comment preview]'

Reply in the project or dismiss.
We'll email you if there are more comments.
```

---

## Onboarding Flow (Critical)

### Step 1: Landing (0 seconds)

- Value prop clear: "Community-owned peer validation platform for builders"
- Preview of featured projects (3-6 cards, not full gallery)
- CTA: "Join the Community" or "Sign Up"

### Step 2: Sign Up (2 minutes)

- Email + password (or social login)
- Minimal profile (name, email, optional bio)
- Straight to dashboard

### Step 3: Dashboard First Experience (10 seconds)

- See empty state: "Welcome to Buffalo Projects"
- Prominent CTA: "Create Your First Project" and "Browse Community Gallery"
- Quick tutorial tooltip: "Start by creating a project or discovering what others are building"

### Step 4: Gallery Browse (30-60 seconds)

- Click "Browse Community Gallery" (or Discover tab)
- See 10-15 published projects with filters
- Search, filter by stage/category/Give/Asks
- Read full projects, see comments
- **Aha moment:** "Oh, people are sharing real work here. I want to do this."

### Step 5: Workspace Creation (10 seconds)

- Click "Create New Project"
- Get unique code (BUF-XXXX)
- Choose project type (startup, design, indie, research, etc.)
- See canvas editor immediately

### Step 6: Canvas Onboarding (3-10 minutes)

- Interactive tutorial: "This is your private canvas"
- Guidance text on each block ("What goes here?")
- Optional: Import from GitHub/URL/PDF to accelerate
- Fill out 2-3 blocks minimum before publishing

### Step 7: Add Give and Asks (2-3 minutes)

- "What can you offer other builders?" → Gives (e.g., "Marketing feedback", "Product design review")
- "What help do you need?" → Asks (e.g., "User testing participants", "Intro to VCs")
- Examples shown for each

### Step 8: First Publish (2 minutes)

- Upload evidence (optional)
- Review Give/Asks
- Publish to community gallery
- See published project immediately
- Get share link

**Total onboarding:** 20-30 minutes from signup to published

### Dropoff Points (Watch Closely)

- **Landing → Sign Up:** If <15% convert, value prop isn't compelling
- **Sign Up → Dashboard:** If <90% proceed, signup is friction
- **Dashboard → Gallery Browse OR Create Project:** If <70% engage, empty state is weak
- **Gallery → Create Project:** If <30% convert after browsing, gallery isn't inspiring
- **Workspace → First Canvas Block:** If <60% complete a block, UI is confusing
- **Canvas → Publish:** If <40% publish, confidence issue or missing Give/Asks unclear

**Mitigation:** Weekly review of dropoff patterns; adjust copy/UX as needed.

---

## Community Founding (Critical for Retention)

**Problem:** Solo canvas editing gets boring. Solo creators churn.

**Solution:** Community-building during first 3 months

### Week 1: Welcome

- Founding members get "Founder" badge
- Intro email thanking them
- Private Slack channel for early feedback

### Week 2: Gallery Launch

- Celebrate founding members' projects
- Highlight 5 projects in weekly email
- Run commentary: "What we're watching"

### Week 3-4: First Community Call

- Zoom call: "What are you building?"
- 5-10 founding members share
- Recorded + highlights shared in newsletter
- Discussion: What features matter most?

### Month 2: Patterns Emerge

- Find clusters of similar projects (all SaaS, all design, etc.)
- Facilitate informal group chats
- Highlight cross-pollination ("Check out X's project, similar to Y")

### Month 3: Community Rituals

- Weekly "Fresh Projects" email
- Monthly call (open to all)
- Discord/Slack server for chat
- Gallery features (manually curated, no algorithm)

---

## Technical Readiness

### ✅ Infrastructure

- [x] Firebase production environment
- [x] Vercel deployment pipeline
- [x] Security headers, rate limiting, CSRF
- [x] SSL/TLS (HTTPS everywhere)
- [x] Firestore rules tested and audited
- [x] Offline-first sync working

### ✅ Testing

- [x] Unit tests (≥70% coverage)
- [x] E2E tests (auth, creation, publishing, comments, offline)
- [x] Accessibility (axe-playwright)
- [x] Performance (Lighthouse >90)
- [x] Mobile responsive

### ✅ Monitoring

- [x] Error tracking (Sentry configured)
- [x] Analytics (PostHog, consent-gated)
- [x] Uptime monitoring (Vercel + external)
- [x] Database metrics (Firestore monitoring)

### ✅ Security

- [x] Auth secure (session cookies + Firestore rules)
- [x] Data encrypted (HTTPS + Firebase encryption)
- [x] Input sanitized (DOMPurify)
- [x] Rate limits active
- [x] No secrets in code

### ✅ Privacy

- [x] Privacy Charter written and transparent
- [x] Data export working (JSON download)
- [x] Permanent deletion working (no recovery)
- [x] GDPR/CCPA compliant
- [x] No third-party tracking by default

---

## Launch Checklist

### Week Before Launch

- [ ] Founding members recruited (30-50 people)
- [ ] Gallery seeded with 40-80 projects
- [ ] Messaging finalized (copy in all key UX flows)
- [ ] Email templates tested (signup, welcome, feedback notification)
- [ ] Support email monitored (hello@buffaloproject.io)
- [ ] Security audit complete
- [ ] Performance tested under load
- [ ] Incident response plan documented

### Launch Day

- [ ] Flip DNS to production
- [ ] Verify all routes working
- [ ] Send founding member announcement
- [ ] Post in startup communities (HN, Twitter, Reddit)
- [ ] Notify universities + accelerators
- [ ] Team on standby for urgent issues

### Week 1 (Launch Week)

- [ ] Monitor signup rate (target: 20-30/day)
- [ ] Check for security issues (zero tolerance)
- [ ] Respond to all support requests within 24h
- [ ] Track onboarding dropoff points
- [ ] Fix any critical bugs same-day
- [ ] Daily team sync (morning, 15 min)

### Month 1

- [ ] Weekly metrics review
- [ ] Community call (week 3)
- [ ] Newsletter highlighting projects
- [ ] Feature request analysis
- [ ] Retention cohort tracking
- [ ] Monthly transparency report

---

## Post-Launch Iteration

### If retention is low (<30% after 7 days):

- **Problem:** Onboarding friction or unclear value
- **Action:** Session recordings + user interviews
- **Quick fix:** Simplify workspace setup, add better guidance

### If no one publishes:

- **Problem:** Confidence issue or perceived risk
- **Action:** Highlight privacy guarantees, share founder stories
- **Quick fix:** Make publish button more prominent, easier process

### If comments are sparse:

- **Problem:** Community not engaging or comments not visible
- **Action:** Show comment count prominently, email notifications
- **Quick fix:** Seed comments (team + founding members) to show it's normal

### If creators are making good projects but not using imports:

- **Problem:** Import UX is confusing
- **Action:** Simplify UI, add wizard, tutorial video
- **Quick fix:** Direct messaging: "Try importing a GitHub repo"

---

## Success Looks Like

**First Month:**

- 500+ signups
- 100+ published projects
- 40% 7-day retention
- 0 security or privacy issues
- Community engaged in comments

**Three Months:**

- 1,500+ signups
- 300+ published projects
- 50%+ monthly active rate
- Organic word-of-mouth (new signups via referral)
- Founding members are advocates
- Some collaboration happening (people commenting, suggesting ideas)

**Six Months:**

- 3,000+ creators
- 600+ projects in gallery
- Sustainable community rituals (weekly email, monthly call)
- Clear feature requests + roadmap shaped by community
- Public projects driving discovery and serendipity
- Early mentorship relationships forming organically

---

## Decision Log (Record of Changes)

**Gallery-first positioning** (Nov 2025)
Changed from "founder validation tool" to "peer feedback platform for anyone building differentiation"

**Community governance** (Nov 2025)
Added MISSION, GOVERNANCE, PRIVACY_CHARTER to be explicit about decentralization

**Deferred mentor system** (Nov 2025)
Peer comments sufficient for MVP; formal mentorship adds complexity

**Auth-gated gallery (dashboard-first positioning)** (Nov 2025)
Decision to keep gallery auth-required, not open to anonymous browsing. Reasoning: curated community space with quality over scale, dashboard-first onboarding where users join community first then discover projects. Homepage shows featured project previews to provide social proof before signup.

**Give and Asks feature added** (Nov 2025)
Added entrepreneurship-focused peer exchange mechanism. Builders can explicitly state what help they offer (Gives) and what help they need (Asks). Gallery filterable by Give/Asks to enable peer-to-peer value exchange. This differentiates Buffalo from passive portfolio sites—active community helping each other.

**Unified Project Editor** (Dec 2025)
Consolidated `/workspace/[code]` and `/showcase/[code]` routes into single `/edit/[code]` editor. All projects now have access to the same features—no distinction between "showcase" and "workspace" project types. Legacy routes redirect with 301.

**Publishing Page Redesign** (Dec 2025)
Replaced 20+ useState hooks with centralized useReducer state in PublishFormContext. Added two-column layout with live preview card and 6 collapsible sections. Integrated react-easy-crop for interactive image cropping with aspect ratio selection.

**Onboarding System** (Dec 2025)
Added onboardingStore for welcome modal, canvas intro modal, and BMC hints. Uses localStorage persistence. Reduces blank-canvas anxiety with educational tooltips on each BMC block.

**Unified Navigation** (Dec 2025)
Replaced separate LandingNav and PlatformNavNext components with single Navigation component. Dark theme with auth-aware items, TwentySix badge, mobile hamburger menu.

**Notifications Deferred** (Dec 2025)
Disabled notification subscription to prevent Firestore index errors. The feature requires a composite index that isn't configured. Rather than create the index for a feature not yet fully implemented, subscription returns empty array.

**Simplified Firebase Storage Rules** (Dec 2025)
Simplified evidence upload rules to use path-based authorization. Removed complex Firestore cross-reference lookups that were failing due to document ID vs code field mismatches.

---

Buffalo Projects: **Launch with community, not just to them.**
