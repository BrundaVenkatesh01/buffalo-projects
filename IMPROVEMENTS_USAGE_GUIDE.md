# Improvements Usage Guide

Quick reference for the new features added to Buffalo Projects.

---

## 🔥 Firebase Multi-Tab Persistence

**What changed:** Firebase now uses modern persistence API with multi-tab synchronization.

**How it works:**
- Browser tabs automatically sync Firestore data
- Changes in one tab appear instantly in other tabs
- Better offline support with persistent local cache

**No action needed** - This works automatically!

**Testing multi-tab sync:**
1. Open your app in two browser tabs
2. Edit a workspace in Tab 1
3. Tab 2 should automatically update

**Debugging:**
```typescript
// Check if Firebase initialized with persistence
import { isFirebaseConfigured } from '@/services/firebase';

if (isFirebaseConfigured) {
  console.log('Firebase persistence enabled');
}
```

---

## 📦 Zustand Store Versioning

**What changed:** Workspace store now handles schema migrations automatically.

**Current version:** 2

**When to increment version:**
When you change the shape of workspace data stored in localStorage:
```typescript
// Example: Adding a new required field to Workspace type
interface Workspace {
  // ... existing fields
  newField: string; // Adding this requires a version bump
}
```

**How to add a migration:**
```typescript
// In src/stores/workspaceStore.ts
migrate: (persistedState: any, version: number) => {
  // ... existing migrations

  if (version === 2) {
    // v2 -> v3: Add your migration
    const migratedState = { ...persistedState };
    if (migratedState.currentWorkspace) {
      migratedState.currentWorkspace.newField = 'default value';
    }
    return migratedState;
  }

  return persistedState;
}
```

**Then update the version number:**
```typescript
persist(baseStore, {
  name: "buffalo-workspace",
  version: 3, // Increment this!
  // ...
})
```

**Debugging storage issues:**
```typescript
// Check hydration status in browser console
import { useWorkspaceStore } from '@/stores/workspaceStore';

// Watch for hydration logs
// Look for: "Workspace store hydrated successfully"
```

**Clearing corrupted data (development only):**
```javascript
// In browser console
localStorage.removeItem('buffalo-workspace');
location.reload();
```

---

## 🧪 Vitest Coverage Thresholds

**What changed:** Tests now require minimum coverage percentages.

**Current thresholds:**
- **Lines:** 70%
- **Statements:** 70%
- **Functions:** 60%
- **Branches:** 60%

**Running tests:**
```bash
# Run tests with coverage
npm test

# Run tests in watch mode (no coverage)
npm run test:watch

# Check coverage without thresholds
npm run test:coverage
```

**If coverage falls below thresholds:**
```
ERROR: Coverage for lines (68%) does not meet global threshold (70%)
```

**How to fix:**
1. Add tests for uncovered code
2. Or exclude the file if it's not testable:
```typescript
// In vitest.config.ts
coverage: {
  exclude: [
    // ... existing excludes
    "src/components/SomeUntestableComponent.tsx",
  ],
}
```

**Viewing coverage report:**
```bash
npm test
open coverage/index.html
```

---

## 🛡️ Environment Variable Validation

**What changed:** Runtime validation for environment configs using Zod.

**Validating configs manually:**
```typescript
import {
  validateEnvironment,
  validateFirebaseConfig,
  validateEmailConfig
} from '@/utils/env';

// Validate all configs
const issues = validateEnvironment();
if (issues.length > 0) {
  console.error('Environment validation failed:', issues);
}

// Validate specific configs
const firebaseResult = validateFirebaseConfig();
if (!firebaseResult.success) {
  console.error('Firebase config invalid:', firebaseResult.error);
}
```

**Adding validation to new configs:**
```typescript
// 1. Define Zod schema
import { z } from 'zod';

const myConfigSchema = z.object({
  apiKey: z.string().min(1),
  endpoint: z.string().url(),
});

// 2. Create validation function
export function validateMyConfig() {
  const config = getMyConfig();
  return myConfigSchema.safeParse(config);
}

// 3. Add to validateEnvironment()
export function validateEnvironment() {
  const issues = [];

  // ... existing validations

  if (getEnvVar("MY_CONFIG_ENABLED")) {
    const result = validateMyConfig();
    if (!result.success) {
      issues.push({
        section: "MyConfig",
        errors: result.error.issues.map(e => `${e.path}: ${e.message}`),
      });
    }
  }

  return issues;
}
```

**Common validation errors:**

```typescript
// Missing required field
{
  section: "Firebase",
  errors: ["apiKey: Firebase API key is required"]
}

// Invalid format
{
  section: "Email",
  errors: ["fromEmail: Invalid email"]
}
```

**Environment validation in CI/CD:**
```bash
# Add to your build script
node -e "
const { validateEnvironment } = require('./src/utils/env');
const issues = validateEnvironment();
if (issues.length > 0) {
  console.error('Environment validation failed:', JSON.stringify(issues, null, 2));
  process.exit(1);
}
"
```

---

## 📊 Quick Reference Commands

```bash
# Type checking
npm run typecheck

# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Check specific test coverage
vitest run path/to/test.test.ts --coverage

# Build project
npm run build:skip-verify

# Validate environment (in Node.js)
node -e "console.log(require('./src/utils/env').validateEnvironment())"
```

---

## 🐛 Troubleshooting

### Firebase not syncing across tabs
```typescript
// Check if multi-tab manager is enabled
// Should see this in firebase.ts initialization:
localCache: persistentLocalCache({
  tabManager: persistentMultipleTabManager(),
})
```

### Zustand store not hydrating
```javascript
// Clear storage and reload
localStorage.removeItem('buffalo-workspace');
location.reload();

// Check browser console for hydration errors
// Look for: "Workspace store hydration failed"
```

### Coverage threshold failures
```bash
# See which files need coverage
npm test -- --reporter=verbose

# Or check the HTML report
npm test && open coverage/index.html
```

### Environment validation failing in production
```typescript
// Validation is conditional - only runs when:
// 1. In production AND config is set, OR
// 2. In development with explicit config

// Check logs for validation errors
const issues = validateEnvironment();
console.log('Validation issues:', issues);
```

---

## 📝 Best Practices

### When modifying workspace data structure:
1. ✅ Update TypeScript types first
2. ✅ Increment Zustand version number
3. ✅ Add migration in `migrate()` function
4. ✅ Test migration with old localStorage data
5. ✅ Document breaking changes

### When adding environment variables:
1. ✅ Add to `.env.example`
2. ✅ Create Zod schema in `env.ts`
3. ✅ Add validation function
4. ✅ Update `validateEnvironment()` if critical
5. ✅ Document in README

### When writing new code:
1. ✅ Write tests first (TDD)
2. ✅ Ensure coverage meets thresholds
3. ✅ Run `npm run typecheck` before commit
4. ✅ Use existing patterns from codebase

---

## 🆘 Getting Help

If you encounter issues with these improvements:

1. **Check logs:** Browser console and terminal output
2. **Review summary:** See `IMPROVEMENTS_SUMMARY.md`
3. **Test isolation:** Try in incognito mode
4. **Clear cache:** Remove localStorage and reload

**Common log messages:**
- ✅ `"Workspace store hydrated successfully"` - Store loaded correctly
- ⚠️ `"Failed to initialize persistent cache"` - Falling back to standard Firestore
- ❌ `"Workspace store hydration failed"` - localStorage corrupted

---

**Last Updated:** November 18, 2025
