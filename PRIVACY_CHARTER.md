# Buffalo Projects Privacy Charter

## The Problem We're Solving

Builders are hesitant to upload their ideas to platforms because:

- "If this gets breached, my competitive advantage is exposed"
- "If I quit or they get acquired, my work is stuck somewhere I don't control"
- "Who can actually see my work? How is it stored?"
- "What if the company sells my data to a competitor?"

This charter addresses those fears directly. **If any of these guarantees are broken, we've failed.**

---

## Your Data Ownership

### You Own Everything You Create

- Your canvas, evidence documents, project metadata—100% yours
- We don't license your work or ideas
- We don't use your projects to train models or create features without consent
- We don't sell anonymized or aggregated data about your project

### You Can Export Everything

**At any time, on demand:**

- Download your entire workspace as JSON (canvas + metadata)
- Download all documents and evidence you uploaded
- No limits, no paywalls, no delays
- Format is open (not proprietary), so you can use it elsewhere

**How to export:**

1. Go to workspace settings
2. Click "Download Workspace Data"
3. You get a ZIP with everything

### You Can Delete Everything Permanently

**One-click permanent deletion:**

- Delete a single document, evidence link, or entire workspace
- No 30-day recovery period; deletion is immediate
- Data is removed from our servers within 24 hours
- Backups are purged within 30 days
- We don't keep any copy for "analytics" or "improvement"

**To delete:**

1. Workspace settings → "Delete Workspace"
2. Confirm twice (we're serious)
3. Gone forever

---

## Access Control & Privacy

### Private Workspaces Are Truly Private

**What "private" means:**

- Only you can access your workspace
- The unique code (BUF-XXXX) is like a password—don't share it
- We cannot access it (our code enforces this via Firestore rules)
- Even Buffalo admins can't view your workspace without your explicit permission

**How we enforce this:**

- Firestore rules check your auth token on _every_ read/write
- Database rules are open-source (auditable)
- No backend "admin override" to peek at workspaces

### Public Projects Are Intentionally Public

**When you publish to the gallery:**

- Your project becomes visible to anyone with the link
- Your name and profile are visible
- Comments and feedback are public
- You control what goes public (canvas contents, linked documents)

**You decide what's published:**

- Private by default
- Manual "publish to gallery" button
- Can unpublish anytime (project goes back to private)

### Shared Access (Optional, Later)

_(Deferred to '26: coming when collaboration features launch)_

- You'll be able to invite specific people to edit your workspace
- Or create view-only links for feedback
- Always your choice; no default sharing

---

## Data Storage & Security

### Where Your Data Lives

- **Firestore** (Firebase): Google's managed database (US region)
- **Cloud Storage** (Firebase): Your documents stored securely, encrypted at rest
- No data is stored on third-party analytics or tracking platforms

### Encryption

- **In Transit:** All data encrypted via HTTPS
- **At Rest:** Firebase encrypts data automatically
- **Access:** Only your account can decrypt and read your data
- Future: Client-side encryption option (we're evaluating)

### Backups & Retention

- Automatic daily backups for disaster recovery only
- Backups deleted when workspace is deleted
- No long-term archiving for "just in case"

### No Data Selling

- We will never sell your data to third parties
- We will never license your data to competitors
- We will never use your projects to train AI models without explicit permission
- We will never use your data for marketing without your consent

---

## What We Collect (And Why)

### What We _Do_ Track

**To make the platform work:**

- Account info (email, name, profile picture)
- Workspace contents (because you need them to access your project)
- Usage timestamps (to know if a workspace is active)
- Error logs (to fix bugs affecting you)

**For analytics (optional, consent-gated):**

- Page views and feature usage
- Crashes and performance issues
- A/B tests (e.g., UI changes)

You can opt out of analytics via the consent banner. The platform still works perfectly.

### What We Don't Collect

❌ IP address (unless needed for abuse prevention)  
❌ Device fingerprinting  
❌ Keystroke logs  
❌ Mouse tracking  
❌ Cookie IDs for cross-site tracking  
❌ Third-party cookies  
❌ Your location (unless you explicitly share it in your profile)

### Third-Party Services

- **Firebase**: Handles auth, database, storage
- **Vercel**: Hosts the website
- **Email provider**: Sends transactional emails
- **Gemini AI** (optional): Analyzes documents you upload, only if you enable import

Each service has its own privacy policy. We've configured them to minimize data collection.

---

## Community & Feedback

### Your Comments Are (Mostly) Public

When you comment on a public gallery project:

- Your comment is visible to anyone viewing that project
- Your name and profile appear alongside your comment
- You can delete your own comments anytime

### Data We Collect About Your Interactions

- Who published which projects
- Who commented on what
- Activity patterns (to detect abuse)
- Aggregate stats (how many projects, comments, etc.)

This helps us understand if the platform is healthy. We don't use it to profile you or target you.

---

## AI & Automation

### Gemini Integration (Optional)

When you import a document:

- The content is sent to Google Gemini to extract insights
- We don't retain the analysis; you see it once
- Gemini may log the request per Google's terms
- You can disable AI features entirely

We don't use AI to read your private workspace; only documents you explicitly import.

### No Automated Profiling

- We don't use algorithms to predict "high-potential" projects
- We don't score or rank your idea
- We don't suggest who should see your work
- The gallery is human-discoverable, not algorithm-driven

---

## Transparency & Accountability

### Privacy Policy Updates

- Any change to this charter requires 30 days notice
- Material changes (e.g., new data collection) require explicit opt-in
- You can leave if you disagree; export happens before changes take effect

### Security Audits

- We conduct regular security reviews
- Firestore rules are auditable (code is public)
- Third-party pentests happen annually
- Results shared transparently (vulnerabilities disclosed responsibly)

### Data Breaches

If your data is compromised:

- We notify you within 24 hours
- We explain what was accessed and your next steps
- We don't hide behind legal disclaimers
- We take full responsibility

### Your Rights

**Right to Access:** Download everything about you anytime  
**Right to Correct:** Edit your profile and workspace data  
**Right to Delete:** Permanent deletion on demand  
**Right to Portability:** Export in open format  
**Right to Object:** Opt out of analytics or features  
**Right to Know:** See what we collect and why

---

## Legal & Compliance

### GDPR (European Residents)

- Your data is your property
- We don't process it unless you use the platform
- Deletion is honored immediately
- We don't transfer data to countries without equivalent privacy protection

### CCPA (California Residents)

- You have the right to know, delete, and export
- We don't "sell" your data in the CCPA sense
- You can opt out of any processing

### HIPAA / Healthcare

- Buffalo is **not** HIPAA-compliant
- Don't upload health records or sensitive medical data
- If you need HIPAA-compliant options, let us know

---

## Sustainable Community Governance

### Who Enforces This?

- **You:** Download your data quarterly to verify privacy
- **The Community:** Report privacy concerns (privacy@buffaloproject.io)
- **Independent Audits:** Third-party reviews of our practices
- **Open Code:** Anyone can audit Firestore rules

### Changes to This Charter

1. Community proposes change
2. We discuss openly (why the change is needed)
3. 30-day notice period
4. Transparent vote (if it's contentious)
5. Implementation + audit

---

## Questions?

**"Can you access my workspace as an admin?"**  
No. Firestore rules prevent it. If we need to (e.g., abuse investigation), we ask permission first.

**"What if you get acquired?"**  
The acquiring company inherits these commitments. If they can't honor them, you have 90 days to export and leave penalty-free. This is in our governance docs.

**"Can I run my own Buffalo instance to keep data local?"**  
Yes. Post-launch, we'll provide a self-hosted guide. Your data never touches our servers.

**"What about backups? How long do you keep them?"**  
Automatic daily backups for disaster recovery. Deleted after 30 days. No indefinite archiving.

**"Can I sue if you violate this?"**  
Yes. This isn't a disclaimer; it's a binding commitment. Violations are addressed through community process first, then legal if needed.

---

## TL;DR

- **Your work is yours.** 100%.
- **Encryption + auth** keeps it private until you publish.
- **Export / delete anytime,** no strings.
- **No tracking, no profiling, no selling.**
- **Community governance** keeps us honest.
- **Break this charter, and we've failed.**

Buffalo Projects: **Privacy first, community always.**
