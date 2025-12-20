# Security Improvements - Buffalo Projects

## Executive Summary

Security audit completed on 2025-11-09. **2 Critical** and **3 High Priority** issues identified that should be addressed before production deployment.

**Overall Security Grade: B+** (Solid foundation, needs production hardening)

---

## Critical Issues (Fix Before Production)

### 1. Middleware Cookie Validation (CRITICAL)

**Issue**: Middleware only checks for cookie existence, not validity. No JWT signature verification or session validation.

**Current Code** (`middleware.ts:56-63`):

```typescript
const hasAuthCookie = (request: NextRequest): boolean => {
  for (const name of AUTH_COOKIE_CANDIDATES) {
    if (request.cookies.get(name)?.value) {
      return true; // ❌ Only checks existence!
    }
  }
  return false;
};
```

**Impact**: Attacker can set any cookie value to bypass authentication at edge layer.

**Recommended Fix**:

```typescript
import { jwtVerify } from "jose";

const hasValidAuthCookie = async (request: NextRequest): Promise<boolean> => {
  for (const name of AUTH_COOKIE_CANDIDATES) {
    const token = request.cookies.get(name)?.value;
    if (!token) continue;

    try {
      // Verify Firebase ID token
      const secret = new TextEncoder().encode(process.env.FIREBASE_JWT_SECRET);
      await jwtVerify(token, secret, {
        issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
        audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return true;
    } catch {
      continue;
    }
  }
  return false;
};
```

**Alternative**: Use Firebase Admin SDK in middleware (requires Node.js runtime, not Edge).

**Priority**: 🔴 CRITICAL - Fix before any production deployment

---

### 2. No CSRF Protection (CRITICAL)

**Issue**: CSRF_PROTECTION_ENABLED environment variable exists but no implementation found. All POST/PUT/DELETE operations vulnerable.

**Impact**: Attacker can trick authenticated users into performing unwanted actions (create projects, delete data, etc.).

**Recommended Fix**: Implement CSRF tokens using `edge-csrf` package:

```bash
npm install @edge-csrf/nextjs
```

```typescript
// middleware.ts
import { createCsrfMiddleware } from "@edge-csrf/nextjs";

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    name: "_csrf",
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  },
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  token: {
    responseHeader: "X-CSRF-Token",
    value: undefined, // Auto-generate
  },
});

// In middleware function
if (process.env.CSRF_PROTECTION_ENABLED === "true") {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) {
    return new NextResponse("Invalid CSRF token", { status: 403 });
  }
}
```

Then in client components:

```typescript
// Get token from header
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

// Include in fetch requests
fetch('/api/...', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
  body: ...
});
```

**Priority**: 🔴 CRITICAL - Required for production

---

## High Priority Issues (Fix Soon)

### 3. Standardize Auth Cookie (HIGH)

**Issue**: Checking 4 different cookie names increases attack surface.

**Current**: `__session`, `buffalo-auth`, `buffalo-auth-token`, custom `AUTH_COOKIE_NAME`

**Recommended**: Use single cookie `__session` (Firebase convention)

**Fix**: Remove legacy cookie checks after migration period:

```typescript
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "__session";

const hasAuthCookie = (request: NextRequest): boolean => {
  return Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
};
```

**Priority**: 🟠 HIGH - Reduces attack surface

---

### 4. Rate Limiter Fail Mode (HIGH)

**Issue**: If Redis connection fails, requests are allowed through (`middleware/rateLimit.ts:45`):

```typescript
if (error || !result.success) {
  console.error("Rate limiting error:", error);
  return; // ❌ Fails open!
}
```

**Impact**: Under DDoS or Redis outage, rate limiting is completely bypassed.

**Recommended Fix**:

```typescript
const RATE_LIMIT_FAIL_OPEN = process.env.RATE_LIMIT_FAIL_OPEN === "true";

if (error || !result.success) {
  console.error("Rate limiting error:", error);

  if (!RATE_LIMIT_FAIL_OPEN && process.env.NODE_ENV === "production") {
    return new Response("Service temporarily unavailable", { status: 503 });
  }

  return; // Only fail open in dev or when explicitly configured
}
```

**Priority**: 🟠 HIGH - Critical for production stability

---

### 5. Character Limit Alignment (HIGH)

**Issue**: Client enforces 2000 chars, Firestore rules allow 5000 chars for comments.

**Files**:

- `src/components/comments/CommentInput.tsx`: `maxLength={2000}`
- `firestore.rules`: `request.resource.data.content.size() < 5000`

**Recommended Fix**: Align to 2000 characters:

```javascript
// firestore.rules
allow create: if request.auth != null
  && request.resource.data.keys().hasAll(['content', 'authorId', 'workspaceId', 'createdAt'])
  && request.resource.data.content is string
  && request.resource.data.content.size() > 0
  && request.resource.data.content.size() <= 2000  // ✅ Match client
```

**Priority**: 🟠 HIGH - Data integrity issue

---

## Medium Priority Issues

### 6. Local Project Cookie Tampering (MEDIUM)

**Issue**: `bp_local_projects` cookie has no signature, can be modified to access any project.

**Recommended Fix**: Add HMAC signature using crypto:

```typescript
import { createHmac } from "crypto";

function signLocalProjects(codes: string[]): string {
  const payload = codes.join("|");
  const secret = process.env.LOCAL_PROJECT_SECRET || "change-me";
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function verifyLocalProjects(signed: string): string[] {
  const [payload, signature] = signed.split(".");
  const expected = createHmac(
    "sha256",
    process.env.LOCAL_PROJECT_SECRET || "change-me",
  )
    .update(payload)
    .digest("hex");

  if (signature !== expected) return [];
  return payload.split("|");
}
```

---

### 7. IP-Based Rate Limiting Spoofing (MEDIUM)

**Issue**: Relies on `x-forwarded-for` which can be spoofed.

**Fix**: Use Vercel-specific headers:

```typescript
function getClientIp(request: Request): string {
  // Vercel provides x-real-ip (most reliable)
  const vercelIp = request.headers.get("x-real-ip");
  if (vercelIp) return vercelIp;

  // Fallback to x-forwarded-for (first IP)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}
```

---

### 8. CSP unsafe-inline and unsafe-eval (MEDIUM)

**Issue**: Content Security Policy allows unsafe-inline and unsafe-eval, weakening XSS protection.

**Recommended**: Implement CSP nonces (Next.js 13+ supports this):

```typescript
// middleware.ts
const nonce = crypto.randomUUID();

const csp = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com;
  style-src 'self' 'nonce-${nonce}';
  ...
`;

// Add to response headers
response.headers.set("Content-Security-Policy", csp);
response.headers.set("x-nonce", nonce);
```

---

## Low Priority Issues

9. **Move COMING_SOON_MODE to Environment Variable** - Currently hard-coded boolean
10. **Storage URLs Should Expire** - Use signed URLs with TTL for sensitive documents
11. **Improve Slug Generation** - Increase retry attempts from 10 to 100
12. **Health Check Information Disclosure** - Remove config details from `/api/ai/suggest` GET
13. **Update Vercel CLI** - Dev dependency vulnerability (not production impact)

---

## Implemented Security Features ✅

- ✅ Comprehensive Firestore security rules with ownership validation
- ✅ Firebase Storage rules with path-based access control
- ✅ DOMPurify HTML sanitization throughout
- ✅ URL validation blocking javascript:/data:/vbscript: protocols
- ✅ Rate limiting with Upstash Redis (10/min for AI, 5/min for image analysis)
- ✅ Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP)
- ✅ File upload size/type validation
- ✅ Input validation utilities (email, password strength, project codes)
- ✅ No production npm audit vulnerabilities
- ✅ Server-only secrets properly unprefixed
- ✅ Markdown rendering with sanitization pipeline

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Before Production Launch)

1. ✅ Audit completed
2. ⏳ Implement JWT verification in middleware
3. ⏳ Implement CSRF protection
4. ⏳ Test authentication flows end-to-end
5. ⏳ Penetration testing of auth system

### Phase 2: High Priority (First Week Post-Launch)

1. Standardize to single auth cookie
2. Configure rate limiter fail-closed for production
3. Align character limits across client/server
4. Add monitoring/alerting for security events

### Phase 3: Hardening (Ongoing)

1. Implement local project cookie signatures
2. Improve IP detection for rate limiting
3. CSP nonce implementation
4. Field-level encryption for sensitive data
5. Set up Dependabot for automated updates

---

## Testing Checklist

- [ ] Auth bypass attempts (invalid cookies, no cookies, expired tokens)
- [ ] CSRF attack simulation (forged POST requests)
- [ ] Rate limiting bypass attempts (IP spoofing, Redis failure)
- [ ] XSS injection in all user inputs (comments, workspace names, canvas fields)
- [ ] SQL injection equivalents (Firestore queries with user input)
- [ ] File upload attacks (oversized files, malicious MIME types, path traversal)
- [ ] Session fixation/hijacking attempts
- [ ] Privilege escalation (accessing other users' workspaces)
- [ ] Local project cookie manipulation
- [ ] API endpoint enumeration and abuse

---

## Security Contacts

- Security issues: security@buffaloprojects.com (to be set up)
- Responsible disclosure: 90-day disclosure policy
- Bug bounty: Consider HackerOne program post-launch

---

**Last Updated**: 2025-11-09
**Next Review**: Before production deployment
