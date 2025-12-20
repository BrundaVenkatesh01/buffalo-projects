# Security Implementation Verification Guide

## Overview

This guide walks through verifying the Upstash rate limiting and CSRF protection implementation.

## Prerequisites

- Node.js and npm installed
- Access to deployment environment (Vercel)
- Upstash account with Redis database

## Step 1: Install Dependencies

```bash
npm install
```

**Expected outcome**: `package-lock.json` should be updated with:

- `@upstash/ratelimit`
- `@upstash/redis`

## Step 2: Set Environment Variables

### Development (.env.local)

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW=1 m

# Security Toggles
AUTH_MIDDLEWARE_ENABLED=true
CSRF_PROTECTION_ENABLED=true
AUTH_COOKIE_NAME=__session

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET=your-secret-here
```

### Production (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Redeploy to apply changes

## Step 3: Run Verification Suite

### Type Checking

```bash
npm run typecheck
```

**Expected**: No TypeScript errors

### Linting

```bash
npm run lint
```

**Expected**: No ESLint errors (or only warnings that were pre-existing)

### Tests

```bash
npm test
```

**Expected**: All tests pass

### Build

```bash
npm run build
```

**Expected**: Clean build with no errors

## Step 4: Manual Testing

### Test Rate Limiting

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Test the rate limit endpoint:

   ```bash
   # Should succeed
   curl http://localhost:3000/api/test-rate-limit

   # Run 11 times quickly - the 11th should be rate limited
   for i in {1..11}; do
     curl http://localhost:3000/api/test-rate-limit
     echo ""
   done
   ```

**Expected response on rate limit**:

```json
{
  "error": "Too many requests",
  "retryAfter": 60
}
```

### Test CSRF Protection

1. Try to access a protected route without CSRF token:
   ```bash
   curl -X POST http://localhost:3000/api/workspace/[id]/share \
     -H "Content-Type: application/json" \
     -d '{"isPublic": true}'
   ```

**Expected**: 403 Forbidden

2. Get CSRF token and use it:

   ```bash
   # Get token
   TOKEN=$(curl http://localhost:3000/api/csrf-token | jq -r '.token')

   # Use token
   curl -X POST http://localhost:3000/api/workspace/[id]/share \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: $TOKEN" \
     -d '{"isPublic": true}'
   ```

**Expected**: Success (or appropriate error if workspace doesn't exist)

## Step 5: Monitor in Production

### Vercel Logs

Monitor for rate limit events:

```
Rate limit exceeded for IP: xxx.xxx.xxx.xxx
```

### Upstash Dashboard

1. Check request metrics
2. Monitor memory usage
3. Verify rate limit triggers

## Common Issues

### Issue: TypeScript errors in middleware

**Solution**: Ensure `edge-csrf` types are properly installed:

```bash
npm install --save-dev @types/node
```

### Issue: Rate limiting not working locally

**Solution**: Verify Upstash environment variables are set in `.env.local`

### Issue: CSRF blocking legitimate requests

**Solution**:

1. Check CSRF token is being sent in headers
2. Verify safe methods (GET, HEAD, OPTIONS) are not being blocked
3. Check `X-CSRF-Token` header name matches implementation

### Issue: Build errors with Upstash

**Solution**: Upstash libraries are compatible with Edge Runtime. Verify:

```javascript
export const runtime = "edge"; // Should be in API routes
```

## Security Checklist

- [ ] Dependencies installed and locked
- [ ] Environment variables set in development
- [ ] Environment variables set in production
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Rate limiting works locally
- [ ] CSRF protection works locally
- [ ] Deployed to staging/preview
- [ ] Manual testing in staging
- [ ] Monitoring configured
- [ ] Ready for production

## Rollback Plan

If issues are found in production:

1. **Disable features via environment variables**:

   ```
   AUTH_MIDDLEWARE_ENABLED=false
   CSRF_PROTECTION_ENABLED=false
   ```

2. **Redeploy previous version**:

   ```bash
   vercel rollback
   ```

3. **Investigate and fix**

4. **Re-enable features** when ready

## Next Steps

After verification:

1. Monitor production metrics for 24-48 hours
2. Adjust rate limits based on actual usage patterns
3. Consider adding rate limit bypass for authenticated admin users
4. Implement rate limit response headers (X-RateLimit-Remaining, etc.)
5. Add rate limiting to additional sensitive endpoints

## Resources

- [Upstash Rate Limit Docs](https://github.com/upstash/ratelimit)
- [Edge CSRF Docs](https://github.com/amorey/edge-csrf)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
