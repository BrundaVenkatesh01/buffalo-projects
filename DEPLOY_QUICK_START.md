# 🚀 Buffalo Projects - Quick Deploy Reference

**Use this for a fast deployment overview. For comprehensive steps, see `docs/PRODUCTION_CHECKLIST.md`**

---

## Pre-Flight Check

```bash
# Verify code quality
npm run typecheck  # 0 errors
npm run lint       # 0 warnings
npm test           # All passing
npm run build      # Build succeeds
```

✅ **All checks passing** → Ready to deploy!

---

## Step 1: External Services Setup (30 minutes)

### Firebase

```
✅ Enable Firestore (production mode)
✅ Enable Cloud Storage
✅ Enable Email/Password auth
✅ Deploy rules: firebase deploy --only firestore:rules,storage
✅ Add domain: buffaloprojects.com to authorized domains
```

### Upstash Redis

```
✅ Create database (US East region)
✅ Copy REST_URL and REST_TOKEN
```

### Resend Email

```
✅ Create account, verify domain
✅ Add DNS records (SPF, DKIM)
✅ Create API key
```

### PostHog (Optional)

```
✅ Create project
✅ Copy API key (phc_...)
```

---

## Step 2: Vercel Deployment (15 minutes)

### Create Project

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Framework: **Next.js**
4. Click **Deploy** (will fail - that's OK!)

### Add Environment Variables

Go to **Project Settings → Environment Variables**, add for **Production, Preview, Development**:

```bash
# Firebase (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# AI & Analytics
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Email
EMAIL_PROVIDER=resend
EMAIL_API_KEY=
EMAIL_FROM_ADDRESS=notifications@buffaloprojects.com
EMAIL_FROM_NAME=Buffalo Projects

# Security & Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW=1 m
RATE_LIMIT_PREFIX=bp::rl
AUTH_MIDDLEWARE_ENABLED=true
CSRF_PROTECTION_ENABLED=true

# Site Config
NEXT_PUBLIC_SITE_URL=https://buffaloprojects.com
```

### Redeploy

1. Go to **Deployments** tab
2. Click **"..."** → **"Redeploy"**
3. Wait 2-5 minutes
4. ✅ Deployment succeeds!

---

## Step 3: Custom Domain (10 minutes)

### In Vercel

1. **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter: `buffaloprojects.com`
4. Also add: `www.buffaloprojects.com` (redirect to apex)

### In DNS Provider

Add these records (example for most providers):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**See `docs/DNS_SETUP_GUIDE.md` for your specific registrar!**

### Wait & Verify

- Wait 10-30 minutes for DNS propagation
- Check: https://buffaloprojects.com loads
- ✅ SSL certificate auto-issued (padlock icon visible)

---

## Step 4: Monitoring Setup (20 minutes)

### Vercel Analytics (2 min)

```
1. Go to Vercel → Analytics tab
2. Click "Enable Vercel Analytics"
✅ Done!
```

### PostHog (5 min)

```
1. PostHog dashboard → Live Events
2. Visit your site
3. Verify events appearing
✅ Done!
```

### UptimeRobot (5 min)

```
1. Go to uptimerobot.com
2. Add monitor: https://buffaloprojects.com
3. Interval: 5 minutes
4. Add email alert
✅ Done!
```

### Sentry (Optional - 10 min)

```
1. sentry.io → Create Next.js project
2. npx @sentry/wizard@latest -i nextjs
3. Add VITE_SENTRY_DSN to Vercel env vars
4. Redeploy
✅ Done!
```

---

## Step 5: Verification (10 minutes)

### Smoke Test

```
✅ Visit homepage: https://buffaloprojects.com
✅ Browse public gallery (/gallery)
✅ View a public project (/p/[slug])
✅ Sign up with test account
✅ Create private workspace
✅ Fill canvas blocks & upload evidence
✅ Publish to gallery
✅ View published project in gallery
✅ Leave peer comment on another project
✅ Verify comment notifications work
```

### Performance Test

```
✅ Run Lighthouse on homepage (target: 90+)
✅ Run Lighthouse on /projects (target: 90+)
✅ Check Vercel Analytics → Web Vitals
```

### Security Test

```bash
# Test rate limiting (should get 429 after 10 requests)
for i in {1..15}; do curl https://buffaloprojects.com/api/test; done

# Check security headers
curl -I https://buffaloprojects.com
# Should see: X-Frame-Options, X-Content-Type-Options, etc.
```

---

## Troubleshooting

### Build Fails

```
Issue: TypeScript errors
Fix: npm run typecheck locally, fix errors, push
```

### DNS Not Working

```
Issue: Domain not resolving
Fix: Wait longer (up to 48h), check DNS records with: dig buffaloprojects.com
```

### SSL Not Issuing

```
Issue: No padlock icon
Fix: Wait 15 min for Vercel auto-retry, ensure DNS is correct
```

### Firebase Errors

```
Issue: Auth/Firestore not working
Fix: Double-check Firebase env vars in Vercel, verify API keys
```

---

## Post-Launch Checklist

**First 24 Hours**:

- [ ] Monitor Sentry for errors (target: < 1% error rate)
- [ ] Check Vercel Analytics for traffic
- [ ] Verify email notifications are delivering
- [ ] Watch Firestore usage (ensure within quota)
- [ ] Test on mobile devices

**First Week**:

- [ ] Run Lighthouse audits again
- [ ] Review error patterns in Sentry
- [ ] Gather user feedback
- [ ] Adjust rate limits if needed
- [ ] Plan first iteration based on metrics

---

## Success Metrics

### Technical Health

```
Uptime: 99.9%+
Error rate: < 1%
Lighthouse: All >= 90
Response time (P95): < 2s
```

### Product Metrics (First Month)

```
Sign ups: 500+
Projects created: 100+
Projects published: 100+
Comments: 300+ (3+ per project)
7-day retention: 40%+
Monthly active creators: 40%+
```

---

## Quick Links

- **Production Site**: https://buffaloprojects.com
- **Vercel Dashboard**: https://vercel.com/[team]/buffalo-projects
- **Firebase Console**: https://console.firebase.google.com
- **PostHog**: https://app.posthog.com
- **UptimeRobot**: https://uptimerobot.com

---

## Need Detailed Instructions?

📖 **Full Guides**:

- `docs/PRODUCTION_CHECKLIST.md` - Comprehensive 50+ step checklist
- `docs/DEPLOYMENT.md` - Detailed deployment runbook
- `docs/DNS_SETUP_GUIDE.md` - DNS configuration by registrar
- `docs/MONITORING_SETUP_GUIDE.md` - Complete observability setup

---

**Total Time: ~90 minutes** ⏱️

**Deployment complete!** 🎉🦬🚀
