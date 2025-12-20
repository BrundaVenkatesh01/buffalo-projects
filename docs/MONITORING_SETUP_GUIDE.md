# 📊 Buffalo Projects - Monitoring & Observability Setup Guide

This guide walks through setting up comprehensive monitoring for Buffalo Projects in production, covering analytics, error tracking, uptime monitoring, and performance observability.

---

## Monitoring Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Buffalo Projects                          │
│                   (Production Site)                          │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
   ┌───▼────┐     ┌───▼────┐
   │Analytics│     │ Errors  │
   │         │     │         │
   │PostHog  │     │ Sentry  │
   │         │     │         │
   └───┬────┘     └───┬────┘
       │               │
   ┌───▼────┐     ┌───▼────┐
   │ Uptime │     │  Perf   │
   │Monitor │     │         │
   │        │     │ Vercel  │
   │UptimeRbt│     │Analytics│
   └────────┘     └─────────┘
```

---

## 1. Vercel Analytics (Built-in)

Vercel Analytics provides real-time performance monitoring and Web Vitals tracking.

### Enable Vercel Analytics

1. **Go to Vercel Dashboard** → Select your project
2. **Navigate to "Analytics" tab**
3. **Click "Enable Vercel Analytics"**
4. **Choose plan**: Free tier includes:
   - 100,000 data points/month
   - Core Web Vitals (LCP, FID, CLS)
   - Page view analytics
   - Real User Monitoring (RUM)

### What You Get

- ✅ Automatic Web Vitals tracking
- ✅ Real-time performance data
- ✅ Geographic distribution
- ✅ Device/browser breakdown
- ✅ Slowest pages identification
- ✅ No code changes required

### Monitoring Dashboard

Access at: `https://vercel.com/[team]/[project]/analytics`

**Key Metrics to Watch**:

- **Real Experience Score**: Should be > 80
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **TTFB (Time to First Byte)**: Target < 600ms

### Set Up Alerts

1. **Go to Settings → Notifications**
2. **Enable alerts for**:
   - Deployment failures
   - Performance regressions (RES < 60)
   - High error rates

---

## 2. PostHog (Product Analytics)

PostHog provides deep product analytics, feature flags, session recording, and user behavior tracking.

### Setup PostHog

#### Step 1: Create PostHog Account

1. **Go to** https://posthog.com
2. **Sign up** for free account (1M events/month free)
3. **Create new project**: "Buffalo Projects Production"
4. **Copy Project API Key**: Starts with `phc_...`

#### Step 2: Add to Vercel Environment Variables

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Note**: Already integrated in `src/lib/posthog.ts` - no additional code needed!

#### Step 3: Verify Integration

1. **Deploy with new env vars**
2. **Visit your production site**
3. **Check PostHog dashboard** → Live Events
4. **Should see**: Page views, user sessions appearing

### PostHog Dashboard Setup

#### Create Key Dashboards

**1. Overview Dashboard**

```
Metrics to track:
- Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
- Page views per day
- New sign ups
- User retention (Day 1, Day 7, Day 30)
```

**2. Product Engagement Dashboard**

```
Events to track:
- project_created
- project_published
- comment_posted
- mentor_mode_enabled
- notification_clicked
```

**3. Funnel Dashboard**

```
Conversion funnel:
1. Landing page visit
2. Sign up
3. Create project
4. Publish project
5. Receive feedback
```

### Custom Events (Already Implemented)

The codebase already tracks these events:

```typescript
// Sign up
posthog.capture("user_signed_up", { method: "email" });

// Project creation
posthog.capture("project_created", { stage: "idea" });

// Publishing
posthog.capture("project_published", { slug: "project-slug" });

// Comments
posthog.capture("comment_posted", { project_id: "xyz" });

// Mentor activity
posthog.capture("mentor_mode_enabled");
```

### Session Recording Setup

1. **In PostHog** → Settings → Recordings
2. **Enable session recording**
3. **Configure**:
   - Sample rate: 20% (to save quota)
   - Ignore sensitive inputs: ✅ Enabled
   - Mask text: ✅ For PII fields
4. **Watch user sessions** to understand behavior and find UX issues

### Set Up Alerts

1. **Go to Insights** → Create insight
2. **Create alerts for**:
   - Daily sign ups < 1 (indicates traffic issue)
   - Error rate > 5%
   - Funnel drop-off > 80% at any step

---

## 3. Sentry (Error Tracking)

Sentry captures JavaScript errors, performance issues, and stack traces.

### Setup Sentry

#### Step 1: Create Sentry Account

1. **Go to** https://sentry.io
2. **Sign up** for free account (5K events/month free)
3. **Create new project**:
   - Platform: **Next.js**
   - Name: **Buffalo Projects**
4. **Copy DSN**: Looks like `https://abc123@o123.ingest.sentry.io/456`

#### Step 2: Install Sentry SDK

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

The wizard will:

- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.mjs` with Sentry plugin

#### Step 3: Configure Sentry

**Add to Vercel environment variables**:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
VITE_SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
VITE_ENABLE_ERROR_TRACKING=true
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAY_SAMPLE_RATE=0.0
VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE=1.0
```

#### Step 4: Configure Sentry Client

Edit `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_SENTRY_ENVIRONMENT || "production",

  // Performance Monitoring
  tracesSampleRate: 0.1, // Capture 10% of transactions

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  replaysSessionSampleRate: 0.0, // Don't capture normal sessions

  // Integrations
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Don't send errors in dev
  enabled: process.env.NODE_ENV === "production",

  // Filter out known non-critical errors
  beforeSend(event, hint) {
    // Ignore network errors from browser extensions
    if (event.message?.includes("chrome-extension")) {
      return null;
    }
    return event;
  },
});
```

### Sentry Dashboard Setup

#### Configure Alerts

1. **Go to Alerts** → Create Alert
2. **Create alerts for**:
   - New error (never seen before)
   - Error spike (100+ errors in 1 hour)
   - High error rate (> 5% of all transactions)
   - Performance degradation (p95 > 5s)

#### Set Up Integrations

1. **Slack Integration**:
   - Go to Settings → Integrations → Slack
   - Connect Slack workspace
   - Configure #alerts channel for errors

2. **GitHub Integration**:
   - Auto-create GitHub issues for new errors
   - Link errors to commits that introduced them

### Verify Sentry Works

**Trigger test error**:

```typescript
// In any component, temporarily add:
useEffect(() => {
  throw new Error("Sentry test error - ignore!");
}, []);
```

**Check Sentry dashboard** → Should see error appear within seconds

**Remove test error** after verification

### Monitor These Metrics

- **Error rate**: < 1% of all requests
- **Unhandled errors**: 0 (all errors should be caught)
- **P95 response time**: < 2s
- **Crash-free sessions**: > 99%

---

## 4. Uptime Monitoring (UptimeRobot)

UptimeRobot monitors your site 24/7 and alerts you if it goes down.

### Setup UptimeRobot

#### Step 1: Create Account

1. **Go to** https://uptimerobot.com
2. **Sign up** for free account (50 monitors, 5-minute checks)
3. **Confirm email**

#### Step 2: Create Monitor

1. **Click "+ Add New Monitor"**
2. **Configure monitor**:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Buffalo Projects - Homepage
   URL: https://buffaloprojects.com
   Monitoring Interval: 5 minutes
   ```
3. **Click "Create Monitor"**

#### Step 3: Add More Monitors

Create monitors for key pages:

```
Monitor 1: Homepage
URL: https://buffaloprojects.com
Expected: 200 status

Monitor 2: Projects Gallery
URL: https://buffaloprojects.com/projects
Expected: 200 status

Monitor 3: API Health Check (if you add one)
URL: https://buffaloprojects.com/api/health
Expected: 200 status, response includes "ok"

Monitor 4: Signin Page
URL: https://buffaloprojects.com/signin
Expected: 200 status
```

#### Step 4: Configure Alerts

1. **Go to My Settings** → Alert Contacts
2. **Add email**: Your email for downtime alerts
3. **Configure notification settings**:
   - Alert when down: ✅ Enabled
   - Alert when back up: ✅ Enabled
   - Send stats: ✅ Weekly

#### Step 5: Optional - Add Status Page

1. **Go to Public Status Pages** → Add Public Status Page
2. **Configure**:
   - Custom URL: `status.buffaloprojects.com` (if desired)
   - Select monitors to include
   - Show uptime percentages
3. **Share status page** with users (optional)

### What to Monitor

| URL                                      | Expected Status | Alert If         |
| ---------------------------------------- | --------------- | ---------------- |
| `https://buffaloprojects.com`            | 200             | Down > 2 minutes |
| `https://buffaloprojects.com/projects`   | 200             | Down > 2 minutes |
| `https://buffaloprojects.com/signin`     | 200             | Down > 2 minutes |
| `https://buffaloprojects.com/api/health` | 200             | Down > 1 minute  |

**Uptime target**: 99.9% (< 43 minutes downtime per month)

---

## 5. Firebase Monitoring

Monitor Firestore, Storage, and Authentication usage.

### Firestore Monitoring

1. **Go to Firebase Console** → Your project → Firestore Database
2. **Navigate to "Usage" tab**
3. **Monitor**:
   - Reads per day (watch for sudden spikes)
   - Writes per day
   - Deletes per day
   - Storage size

### Set Budget Alerts

1. **Go to Firebase Console** → Billing
2. **Set budget**:
   - Free tier limits: 50K reads, 20K writes per day
   - Set alert at 80% of quota
3. **Add email** for budget alerts

### Performance Monitoring

1. **Go to Firebase Console** → Performance
2. **Enable Performance Monitoring**
3. **Monitor**:
   - Network requests (latency, success rate)
   - Screen rendering (slow frames)
   - Custom traces (if added)

### Authentication Monitoring

1. **Go to Firebase Console** → Authentication → Usage
2. **Monitor**:
   - Daily sign ups
   - Daily sign ins
   - Failed authentication attempts (watch for attacks)

---

## 6. Vercel Logs & Functions

Monitor Vercel serverless function execution.

### Access Logs

1. **Go to Vercel Dashboard** → Project → Logs
2. **Filter by**:
   - Deployments
   - Functions (API routes)
   - Static (page views)
   - Edge (middleware)

### Monitor Function Performance

1. **Go to Analytics** → Functions
2. **Check**:
   - Execution time (target: < 10s, ideally < 1s)
   - Error rate (target: < 1%)
   - Cold starts (minimize frequency)

### Set Up Log Drains (Optional)

For advanced logging:

1. **Go to Settings** → Log Drains
2. **Add drain** to export logs to:
   - Datadog
   - Logtail
   - Better Stack
   - Custom webhook

---

## 7. Upstash Redis Monitoring

Monitor rate limiting and caching performance.

### Upstash Dashboard

1. **Go to Upstash Console** → Your database
2. **Monitor**:
   - Total commands (requests per day)
   - Daily bandwidth
   - Storage used
   - Peak connections

### Set Alerts

1. **Configure alerts** for:
   - Storage > 80% of plan limit
   - Bandwidth > 80% of plan limit
   - Command count spike (unusual traffic)

### Check Rate Limiting Effectiveness

In Vercel logs, search for:

- `429` status codes (rate limit triggered)
- Rate limit bypasses (if any)

**Adjust thresholds** in env vars if needed:

```bash
RATE_LIMIT_MAX_REQUESTS=10  # Increase if too restrictive
RATE_LIMIT_WINDOW=1 m       # Increase window for more lenient limits
```

---

## 8. Consolidated Monitoring Dashboard

### Option A: Grafana (Free & Self-Hosted)

**Create unified dashboard** pulling data from:

- Vercel API (performance metrics)
- PostHog API (product analytics)
- Sentry API (error rates)
- UptimeRobot API (uptime percentage)
- Firebase API (database usage)

### Option B: Custom Dashboard in Notion/Airtable

Create simple spreadsheet tracking:

```
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Uptime | 99.9% | 99.98% | ✅ |
| Error Rate | < 1% | 0.3% | ✅ |
| MAU | 100+ | 87 | ⚠️ |
| Projects Created | 20+ | 23 | ✅ |
```

---

## Monitoring Checklist

### Daily Checks (Automated via email alerts)

- [ ] Check UptimeRobot: Site is up
- [ ] Check Sentry: No new critical errors
- [ ] Check Vercel: Deployments succeeded
- [ ] Check PostHog: Traffic is normal

### Weekly Checks (Manual review)

- [ ] Review Sentry error trends: Any patterns?
- [ ] Review PostHog analytics: Growth trends?
- [ ] Review Vercel Web Vitals: Performance regressions?
- [ ] Review Firebase usage: Within quota?
- [ ] Review Upstash: Rate limits appropriate?

### Monthly Checks (Strategy review)

- [ ] Lighthouse audits: All scores > 90?
- [ ] User feedback review: Common complaints?
- [ ] Cost review: Any unexpected charges?
- [ ] Security audit: Any suspicious activity?
- [ ] Performance optimization: Slow queries?

---

## Alert Severity Levels

### 🔴 P0 - Critical (Act Immediately)

- Site is completely down (UptimeRobot)
- Error rate > 10% (Sentry)
- Database completely unavailable (Firebase)
- SSL certificate expired (Vercel)

**Action**: Drop everything, fix immediately, post mortem required

### 🟠 P1 - High (Act Within 1 Hour)

- Error rate 5-10% (Sentry)
- Performance degraded (P95 > 5s)
- API route returning 500s
- Key feature broken (can't publish projects)

**Action**: Investigate and fix ASAP, notify team

### 🟡 P2 - Medium (Act Within 24 Hours)

- Error rate 1-5% (Sentry)
- Performance slightly degraded (P95 > 3s)
- Non-critical feature broken
- Firebase quota at 80%

**Action**: Create ticket, fix in next sprint

### 🟢 P3 - Low (Act Within 1 Week)

- Minor UI glitch
- Performance slightly suboptimal
- Analytics gaps
- Documentation outdated

**Action**: Add to backlog, fix when convenient

---

## Success Metrics Dashboard

Create a simple dashboard tracking:

### Technical Health

```
✅ Uptime: 99.9%
✅ Error Rate: < 1%
✅ Lighthouse Performance: > 90
✅ TTFB: < 600ms
✅ LCP: < 2.5s
```

### Product Metrics

```
📈 MAU: 150 (+25% MoM)
📈 Projects Created: 45 (+35% MoM)
📈 Comments: 120 (+50% MoM)
📈 Mentor Activity: 12 active mentors
```

### Business Metrics

```
💰 Hosting Cost: $20/month (Vercel + Firebase)
💰 Analytics Cost: $0/month (free tiers)
💰 Cost per User: $0.13
📊 Revenue: [if applicable]
```

---

## Incident Response Plan

### When an Alert Fires

1. **Acknowledge**: Respond to alert within 15 minutes
2. **Assess**: Determine severity (P0-P3)
3. **Communicate**: Post in #incidents Slack channel
4. **Investigate**: Check logs, metrics, recent deployments
5. **Fix**: Roll back or apply hotfix
6. **Verify**: Confirm issue resolved
7. **Document**: Write post-mortem (for P0/P1)

### Post-Mortem Template

```markdown
# Incident: [Brief Description]

**Date**: [Date]
**Duration**: [X minutes/hours]
**Severity**: [P0/P1/P2/P3]

## Impact

- [Users affected]
- [Features broken]
- [Data loss, if any]

## Root Cause

[What caused the issue]

## Timeline

- [Time]: Issue detected
- [Time]: Team notified
- [Time]: Fix deployed
- [Time]: Issue resolved

## Resolution

[What we did to fix it]

## Prevention

[What we'll do to prevent this in future]

## Action Items

- [ ] [Action 1]
- [ ] [Action 2]
```

---

## Monitoring ROI

**Time invested**: 4-6 hours setup
**Time saved**: 10+ hours per month (catching issues proactively)
**Downtime prevented**: Potentially thousands in lost user trust

**Key benefits**:

- ✅ Catch issues before users report them
- ✅ Understand user behavior and optimize UX
- ✅ Track product metrics and growth
- ✅ Debug production errors quickly
- ✅ Prevent costly downtime

---

**Your production site is now fully monitored!** 📊🎉

All alerts configured, dashboards set up, and ready to catch issues before they impact users.
