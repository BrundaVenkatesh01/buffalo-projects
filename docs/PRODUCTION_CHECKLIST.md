# 🚀 Buffalo Projects - Production Deployment Checklist

This checklist walks through every step of deploying Buffalo Projects to production on Vercel with custom domain and full monitoring.

---

## Pre-Deployment (Local Machine)

### Code Quality & Tests

- [ ] **Run TypeScript check**: `npm run typecheck` → 0 errors
- [ ] **Run linter**: `npm run lint` → 0 errors, 0 warnings
- [ ] **Run unit tests**: `npm test` → All passing
- [ ] **Run E2E tests**: `npm run test:e2e` → All critical flows passing
- [ ] **Production build**: `npm run build` → Build succeeds without errors
- [ ] **Bundle analysis**: `npm run analyze` → Initial bundle < 500KB

**Status**: [ ] All checks passing

---

## Firebase Configuration

### Firestore

- [ ] **Enable Firestore** in production mode
- [ ] **Deploy Firestore rules**: `firebase deploy --only firestore:rules`
- [ ] **Deploy Firestore indexes**: `firebase deploy --only firestore:indexes`
- [ ] **Verify collections exist** (or will be created on first write):
  - `workspaces`
  - `public_projects`
  - `comments`
  - `notifications`
  - `users`

### Storage

- [ ] **Enable Cloud Storage**
- [ ] **Deploy storage rules**: `firebase deploy --only storage`
- [ ] **Configure CORS** (if needed for cross-origin assets)
- [ ] **Test file upload** in development

### Authentication

- [ ] **Enable Email/Password** sign-in method
- [ ] **Configure authorized domains**: Add `buffaloprojects.com` and `www.buffaloprojects.com`
- [ ] **Test sign up/sign in** in development

**Status**: [ ] Firebase fully configured

---

## External Services Setup

### Upstash Redis (Rate Limiting)

- [ ] **Create Upstash database** (region: closest to target users - US East recommended)
- [ ] **Copy REST URL** from Upstash dashboard
- [ ] **Copy REST Token** from Upstash dashboard
- [ ] **Note down**: Will add to Vercel environment variables

### Resend (Email Notifications)

- [ ] **Create Resend account** at https://resend.com
- [ ] **Verify sending domain** (`buffaloprojects.com` or subdomain like `mail.buffaloprojects.com`)
- [ ] **Add DNS records** (SPF, DKIM) provided by Resend to domain registrar
- [ ] **Create API key** with Full Access permissions
- [ ] **Set FROM address**: `notifications@buffaloprojects.com`
- [ ] **Test email** using Resend dashboard

### PostHog (Analytics - Optional)

- [ ] **Create PostHog project** at https://posthog.com
- [ ] **Copy project API key** (starts with `phc_`)
- [ ] **Note host**: `https://app.posthog.com` (or self-hosted URL)

### Sentry (Error Tracking - Optional)

- [ ] **Create Sentry project**
- [ ] **Copy DSN** (starts with `https://`)
- [ ] **Set environment**: `production`
- [ ] **Configure sample rates**: Traces 0.1, Replay 0.0, Error Replay 1.0

**Status**: [ ] All external services configured

---

## Vercel Project Setup

### 1. Create Vercel Project

- [ ] **Push repository** to GitHub (ensure `main` branch is up to date)
- [ ] **Go to Vercel dashboard**: https://vercel.com/new
- [ ] **Click "Add New" → "Project"**
- [ ] **Import Git Repository**: Select your Buffalo Projects repo
- [ ] **Configure Project**:
  - Framework Preset: **Next.js**
  - Root Directory: `./` (default)
  - Build Command: `npm run build` (or leave default)
  - Output Directory: `.next` (or leave default)
  - Install Command: `npm install` (or leave default)
- [ ] **Click "Deploy"** (initial deployment will likely fail due to missing env vars - that's OK!)

### 2. Configure Environment Variables

Go to **Project Settings → Environment Variables** and add the following for **Production**, **Preview**, and **Development**:

#### Firebase (Required)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=buffalo-projects.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=buffalo-projects
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=buffalo-projects.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

- [ ] Firebase variables added

#### AI & Analytics

```
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

- [ ] AI & Analytics variables added

#### Email Notifications

```
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM_ADDRESS=notifications@buffaloprojects.com
EMAIL_FROM_NAME=Buffalo Projects
```

- [ ] Email variables added

#### Security & Rate Limiting

```
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AbCd...
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW=1 m
RATE_LIMIT_PREFIX=bp::rl
AUTH_MIDDLEWARE_ENABLED=true
CSRF_PROTECTION_ENABLED=true
```

- [ ] Security variables added

#### Site Configuration

```
NEXT_PUBLIC_SITE_URL=https://buffaloprojects.com
```

- [ ] Site URL configured

#### Optional: Error Tracking

```
VITE_ENABLE_ERROR_TRACKING=true
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

- [ ] Error tracking configured (if using Sentry)

### 3. Trigger Deployment

- [ ] **Go to Deployments tab**
- [ ] **Click "..." on latest deployment → "Redeploy"** (now with env vars)
- [ ] **Monitor build logs** for errors
- [ ] **Wait for deployment** to complete (usually 2-5 minutes)
- [ ] **Note deployment URL**: `https://buffalo-projects-xyz.vercel.app`

**Status**: [ ] Vercel project deployed successfully

---

## Custom Domain Configuration

### 1. Add Domain in Vercel

- [ ] **Go to Project Settings → Domains**
- [ ] **Click "Add Domain"**
- [ ] **Enter**: `buffaloprojects.com`
- [ ] **Click "Add"**
- [ ] **Also add**: `www.buffaloprojects.com` (if desired)
- [ ] **Configure redirect**: Set `www` to redirect to apex `buffaloprojects.com` (or vice versa)

### 2. Configure DNS Records

Go to your **domain registrar** (e.g., Namecheap, GoDaddy, Cloudflare, etc.) and add:

#### Option A: Using CNAME (Preferred for most setups)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### Option B: Using A Records (For apex domain)

If your DNS provider supports ALIAS/ANAME records:

```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

If not, use Vercel's A records (check Vercel dashboard for current IPs):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

- [ ] **DNS records added**
- [ ] **Wait for propagation** (can take 5 minutes to 48 hours, usually ~10 minutes)
- [ ] **Check DNS**: Use https://dnschecker.org to verify propagation
- [ ] **Verify in Vercel**: Domain should show "Valid Configuration" with SSL certificate

### 3. SSL Certificate

- [ ] **Automatic SSL**: Vercel auto-issues Let's Encrypt certificate
- [ ] **Verify HTTPS**: Visit `https://buffaloprojects.com` and check for padlock icon
- [ ] **Force HTTPS**: Enabled by default in Vercel

**Status**: [ ] Custom domain configured with SSL

---

## Monitoring & Observability Setup

### Vercel Analytics

- [ ] **Go to Project → Analytics tab**
- [ ] **Enable Vercel Analytics**
- [ ] **Enable Web Vitals** tracking
- [ ] **Set up alerts** (optional): Deploy failures, performance degradation

### PostHog Analytics

- [ ] **Verify PostHog key** in environment variables
- [ ] **Visit site**: https://buffaloprojects.com
- [ ] **Check PostHog dashboard**: Verify page view event captured
- [ ] **Set up dashboards**: Create dashboard for key metrics
  - Sign ups
  - Project creations
  - Comments posted
  - Mentor activity

### Sentry Error Tracking (if enabled)

- [ ] **Verify Sentry DSN** in environment variables
- [ ] **Trigger test error** (optional): Add `throw new Error('Test')` temporarily
- [ ] **Check Sentry dashboard**: Verify error captured
- [ ] **Set up alerts**: Configure email/Slack alerts for errors
- [ ] **Remove test error**

### Uptime Monitoring (UptimeRobot or similar)

- [ ] **Create UptimeRobot account** (or use Pingdom, StatusCake, etc.)
- [ ] **Add monitor**:
  - URL: `https://buffaloprojects.com`
  - Type: HTTP(S)
  - Interval: 5 minutes
  - Alert email: your email
- [ ] **Add health check** (if available):
  - URL: `https://buffaloprojects.com/api/health`
  - Expected: 200 status code

### Firebase Monitoring

- [ ] **Go to Firebase Console → Performance**
- [ ] **Enable Performance Monitoring**
- [ ] **Go to Firebase Console → Crashlytics** (optional)
- [ ] **Monitor Firestore usage**: Set up budget alerts

**Status**: [ ] All monitoring configured

---

## Post-Deployment Verification

### Smoke Tests

- [ ] **Visit homepage**: https://buffaloprojects.com
- [ ] **Sign up** with test account
- [ ] **Create a project**
- [ ] **Edit project** (canvas, journal)
- [ ] **Publish project**
- [ ] **View public project page**: `/p/[slug]`
- [ ] **Browse gallery**: `/projects`
- [ ] **Enable mentor mode** (in profile)
- [ ] **Browse mentor feed**: `/mentor`
- [ ] **Leave a comment** on a project
- [ ] **Check notification** appears
- [ ] **Check email notification** received

### Performance Tests

- [ ] **Run Lighthouse audit** on:
  - [ ] Homepage (`/`)
  - [ ] Projects gallery (`/projects`)
  - [ ] Public project (`/p/[slug]`)
  - [ ] Workspace editor (`/project/[id]`)
- [ ] **Target scores**: All >= 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] **Check Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Security Verification

- [ ] **Test rate limiting**:

  ```bash
  # Make 15+ rapid requests to an API endpoint
  for i in {1..15}; do curl https://buffaloprojects.com/api/test; done
  ```

  - [ ] Verify rate limit kicks in (429 status after 10 requests)

- [ ] **Test CSRF protection**:

  ```bash
  curl -X POST https://buffaloprojects.com/api/test \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}'
  ```

  - [ ] Verify CSRF error (403 without valid token)

- [ ] **Check security headers**:

  ```bash
  curl -I https://buffaloprojects.com
  ```

  - [ ] Verify headers: X-Frame-Options, X-Content-Type-Options, etc.

- [ ] **Review Firestore rules**: Test with Firestore emulator or manual checks
  - [ ] Unauthenticated users can't edit workspaces
  - [ ] Users can only edit their own workspaces
  - [ ] Comments can only be edited by authors

### Accessibility Check

- [ ] **Keyboard navigation**: Tab through all pages, verify focus indicators
- [ ] **Screen reader test**: Use VoiceOver (Mac) or NVDA (Windows)
- [ ] **ARIA labels**: All buttons/inputs have accessible names
- [ ] **Color contrast**: Text meets WCAG AA standards (4.5:1)
- [ ] **Lighthouse accessibility score**: >= 95

### Cross-Browser Testing

- [ ] **Chrome** (latest)
- [ ] **Safari** (latest)
- [ ] **Firefox** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### Mobile Testing

- [ ] **iPhone** (actual device if possible)
- [ ] **Android phone** (actual device if possible)
- [ ] **Touch targets**: All buttons >= 44x44px
- [ ] **Responsive layout**: No horizontal scrolling
- [ ] **Forms**: Keyboard opens correctly for inputs

**Status**: [ ] All verification tests passing

---

## Final Checklist

### Documentation

- [ ] **Update README.md**: Ensure deployment section references this checklist
- [ ] **Update DEPLOYMENT.md**: Add any lessons learned
- [ ] **Document environment variables**: Ensure `.env.example` is complete
- [ ] **Create runbook**: Document common issues and fixes

### Communication

- [ ] **Notify team**: Send deployment notification
- [ ] **Update status page**: Mark production as live
- [ ] **Announce launch**: Social media, email list, etc. (if public launch)

### Backup & Recovery

- [ ] **Export Firestore data**: Create initial backup
- [ ] **Document rollback process**: Test `vercel rollback` command
- [ ] **Note deployment ID**: Record successful deployment for reference
- [ ] **Create incident response plan**: Who to contact if things break

### Monitoring Dashboard

- [ ] **Set up monitoring dashboard**: Centralize metrics from:
  - Vercel Analytics
  - PostHog
  - Sentry
  - UptimeRobot
  - Firebase Console
- [ ] **Set alert thresholds**: Define what constitutes an incident
- [ ] **Test alerting**: Trigger test alert to verify notifications work

**Status**: [ ] Production launch complete! 🚀

---

## Post-Launch (First 24 Hours)

- [ ] **Monitor error rates** in Sentry (target: < 1% error rate)
- [ ] **Check server logs** in Vercel dashboard
- [ ] **Review analytics** in PostHog (traffic, user behavior)
- [ ] **Monitor Firestore usage** (ensure within quota)
- [ ] **Check email deliverability** (any bounces or complaints?)
- [ ] **Gather user feedback** (support emails, comments, social media)
- [ ] **Performance monitoring**: Watch for slow pages or high bounce rates
- [ ] **Security monitoring**: Check for unusual access patterns

---

## Post-Launch (First Week)

- [ ] **Run Lighthouse audits** again (verify no regressions)
- [ ] **Review error patterns** (fix high-frequency bugs)
- [ ] **Optimize slow queries** (if Firestore queries are slow)
- [ ] **Adjust rate limits** (if too restrictive or too permissive)
- [ ] **Gather metrics**:
  - Sign ups
  - Projects created
  - Projects published
  - Comments posted
  - Mentor activity
- [ ] **Plan iteration**: Based on user feedback and metrics

---

## Troubleshooting Common Issues

### Build Failures

- **Issue**: Build fails with TypeScript errors
  - **Fix**: Run `npm run typecheck` locally, fix errors, commit, push
- **Issue**: Build fails with missing environment variables
  - **Fix**: Check Vercel environment variables, ensure all required vars are set

### DNS Issues

- **Issue**: Domain not resolving
  - **Fix**: Wait longer (up to 48 hours), verify DNS records, use `dig buffaloprojects.com` to check
- **Issue**: SSL certificate not issuing
  - **Fix**: Ensure DNS is configured correctly, wait for Vercel to retry

### Runtime Errors

- **Issue**: Firebase errors in production
  - **Fix**: Check Firebase config in Vercel env vars, verify API keys
- **Issue**: Rate limiting too aggressive
  - **Fix**: Increase `RATE_LIMIT_MAX_REQUESTS` in Vercel env vars, redeploy

### Performance Issues

- **Issue**: Slow page loads
  - **Fix**: Check Vercel Analytics for slow functions, optimize Firestore queries, add caching
- **Issue**: High Firestore costs
  - **Fix**: Review query patterns, add indexes, implement pagination

---

## Success Metrics

### Technical Health

- ✅ Uptime: 99.9%+
- ✅ Error rate: < 1%
- ✅ Lighthouse scores: All >= 90
- ✅ P95 response time: < 2s
- ✅ Build time: < 5 minutes

### Product Metrics (First Month)

- 🎯 Sign ups: 50+
- 🎯 Projects created: 20+
- 🎯 Projects published: 10+
- 🎯 Active mentors: 5+
- 🎯 Comments: 50+

---

**Deployment completed by**: **\*\***\_\_\_\_**\*\***
**Deployment date**: **\*\***\_\_\_\_**\*\***
**Deployment URL**: https://buffaloprojects.com
**Vercel deployment ID**: **\*\***\_\_\_\_**\*\***

🎉 **Congratulations on launching Buffalo Projects!** 🦬🚀
