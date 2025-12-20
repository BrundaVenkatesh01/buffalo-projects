# Buffalo Projects Deployment Runbook

This guide walks through deploying Buffalo Projects to Vercel production with Firebase backing services, transactional email, and monitoring.

## 1. Prerequisites

- Vercel account with access to target organization.
- Firebase project (Firestore + Storage enabled).
- Upstash Redis database (for rate limiting) or equivalent REST Redis provider.
- Resend (or another supported email provider) for notification emails.
- Domain registrar access for `buffaloprojects.com` (or custom domain).

## 2. Create the Vercel Project

1. Push the repository to GitHub (or supported Git provider).
2. In Vercel:
   - Click **New Project** → **Import** the Git repository.
   - Choose **Production Branch** (`main`).
   - Framework preset: **Next.js**.
   - Build command: `npm run build`
   - Output: `.vercel/output` (default).
3. Enable automatic deployments for Preview/Production branches.

## 3. Configure Environment Variables

Add the following variables (Production, Preview, Development) in **Project Settings → Environment Variables**. Replace values with production secrets.

| Key                                        | Description                              |
| ------------------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase web API key                     |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | `project-id.firebaseapp.com`             |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID                      |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Storage bucket                           |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID                      |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase App ID                          |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      | Analytics measurement ID (optional)      |
| `NEXT_PUBLIC_GEMINI_API_KEY`               | Google Gemini API key                    |
| `UPSTASH_REDIS_REST_URL`                   | Upstash Redis REST URL                   |
| `UPSTASH_REDIS_REST_TOKEN`                 | Upstash Redis REST token                 |
| `RATE_LIMIT_MAX_REQUESTS`                  | e.g. `10`                                |
| `RATE_LIMIT_WINDOW`                        | e.g. `1 m`                               |
| `RATE_LIMIT_PREFIX`                        | Namespace for rate limit keys            |
| `AUTH_MIDDLEWARE_ENABLED`                  | `true`                                   |
| `CSRF_PROTECTION_ENABLED`                  | `true`                                   |
| `EMAIL_PROVIDER`                           | `resend`                                 |
| `EMAIL_API_KEY`                            | Resend API key                           |
| `EMAIL_FROM_ADDRESS`                       | e.g. `notifications@buffaloprojects.com` |
| `EMAIL_FROM_NAME`                          | e.g. `Buffalo Projects`                  |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`             | `true` (if analytics enabled)            |
| `NEXT_PUBLIC_ANALYTICS_ID`                 | GA Measurement ID                        |
| `NEXT_PUBLIC_POSTHOG_KEY`                  | PostHog API key                          |
| `NEXT_PUBLIC_POSTHOG_HOST`                 | PostHog host (`https://app.posthog.com`) |
| `NEXT_PUBLIC_SITE_URL`                     | `https://buffaloprojects.com`            |

> Tip: keep secrets in Vercel only; `.env.local` should remain git-ignored for local testing.

## 4. Firebase Configuration

1. **Firestore**
   - Enable Firestore in production mode.
   - Import rules from `firestore.rules` (`firebase deploy --only firestore:rules`).
   - Deploy indexes (`firebase deploy --only firestore:indexes`) or set up via console when prompted.
   - Collections used: `workspaces`, `public_projects`, `notifications`, `comments`, `users`.

2. **Storage**
   - Enable Cloud Storage.
   - Deploy storage rules (`firebase deploy --only storage` or console copy from `storage.rules`).
   - Create CORS configuration if serving assets cross-origin.

3. **Authentication**
   - Enable Email/Password sign-in.
   - Configure custom domain for auth redirects (`buffaloprojects.com`).

## 5. Email Provider (Resend)

1. Verify sending domain (e.g. `buffaloprojects.com`) inside Resend dashboard.
2. Create API key with **Full Access**.
3. Add DNS records (SPF, DKIM) at domain registrar.
4. Supply the API key + from address via environment variables above.

## 6. Upstash Redis

1. Create new database in Upstash (region closest to users).
2. Copy REST URL and token into environment variables.
3. Optional: adjust plan limits to cover expected traffic.

## 7. Deployment Steps

1. **Local verification**
   ```bash
   npm install
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```
2. Commit and push to `main` (or create a release branch).
3. Vercel will build automatically. Monitor logs for:
   - Successful Next.js build
   - Environment variable usage warnings
   - Edge runtime compatibility (rate limiting middleware)
4. After deployment, run Playwright smoke tests against Preview/Production:
   ```bash
   npm run test:e2e -- --project=chromium --reporter=list --config=playwright.config.ts
   ```

## 8. Custom Domain

1. In Vercel **Domains**, add `buffaloprojects.com`.
2. Update DNS provider:
   - `A` record to Vercel edge IPs, or
   - `CNAME` to `cname.vercel-dns.com` (preferred for apex via ANAME/ALIAS).
3. Wait for verification + automatic SSL issuance.
4. Configure `www` redirect to apex or vice versa as needed.

## 9. Monitoring & Observability

- Enable **Vercel Analytics** (Performance + Web Vitals).
- Connect **Sentry** by adding `VITE_SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (optional).
- Configure **PostHog** project and verify events in dashboard.
- Set up uptime monitoring (e.g. UptimeRobot) hitting `/api/health` if available or root `/`.
- Review Upstash metrics for rate-limit breaches and adjust thresholds.

## 10. Post-Deployment Checklist

| Step                                                                                   | Notes |
| -------------------------------------------------------------------------------------- | ----- |
| ✅ Run Lighthouse (Desktop + Mobile) on `/`, `/projects`, `/p/<slug>`, `/project/<id>` |
| ✅ Execute manual CSRF + rate-limit verification (see `docs/SECURITY_VERIFICATION.md`) |
| ✅ Confirm notification emails deliver to real inbox                                   |
| ✅ Verify Firestore security rules using emulator tests if possible                    |
| ✅ Check analytics events after first real traffic                                     |
| ✅ Capture final screenshots for launch docs                                           |

## 11. Rollback

- Use `vercel deploy --prebuilt` to redeploy a previous build (or `vercel rollback <deployment-id>`).
- Disable middleware quickly by toggling `AUTH_MIDDLEWARE_ENABLED` / `CSRF_PROTECTION_ENABLED` in Vercel env vars, then redeploy.
- If Upstash issues arise, temporarily set `RATE_LIMIT_MAX_REQUESTS` higher or bypass by setting `UPSTASH_REDIS_REST_URL=` (blank) and redeploy.

Maintain this runbook alongside `PRODUCTION_CHECKLIST.md` to ensure consistent launches.
