# AI Assistant Context Guide - Buffalo Projects

This document provides comprehensive context for AI assistants working on the Buffalo Projects codebase. Read this first before making any changes.

## 🎯 Project Mission

BuffaloProjects.com is Buffalo's complete entrepreneurial resource hub. We're building the platform that **never loses startup context** - helping students, entrepreneurs, and educators develop business ideas with persistent workspace tools.

### Core Philosophy

- **Context is everything**: Every decision, pivot, and insight is remembered
- **No login required**: Code-based access (BUF-XXXX) removes friction
- **Education first**: Built for classroom integration from day one
- **Buffalo proud**: Celebrating and supporting local entrepreneurship

## 🏗️ Architecture Overview

### Tech Stack Decision Rationale

```
React 19 + TypeScript + Vite
├── Why React 19: Latest features, better performance
├── Why TypeScript: Type safety prevents runtime errors
├── Why Vite: Fast builds, modern tooling
├── Why Zustand: Lightweight state (vs Redux overhead)
├── Why LocalStorage: MVP simplicity (will migrate to Supabase)
└── Why Tailwind: Rapid development with consistent design
```

### Project Structure Map

```
src/
├── pages/              # Route components (11 routes)
├── components/         # Reusable UI components
│   ├── tools/         # Business development tools (7 tools)
│   ├── workspace/     # Workspace management
│   ├── ui/           # Design system components
│   └── navigation/   # App navigation
├── services/          # Business logic layer
│   ├── projectService.ts    # Core workspace management (624 lines)
│   ├── geminiService.ts     # AI integration
│   └── documentService.ts   # File processing
├── hooks/             # Custom React hooks
├── stores/            # Zustand state management
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 💼 Business Context

### User Personas

1. **Sarah (Student)**
   - Computer Science major at UB
   - Working on startup idea for class project
   - Needs: Easy tool access, no signup friction, save work

2. **Prof. Johnson (Educator)**
   - Teaches entrepreneurship at Buffalo State
   - Manages 3 classes, 150 students
   - Needs: Track progress, see student work, grade easily

3. **Mike (Local Entrepreneur)**
   - First-time founder in Buffalo
   - Looking for resources and connections
   - Needs: Local mentors, funding info, workspace tools

### Current Traction

- **Users**: Targeting 1,000 students by Spring 2025
- **Universities**: UB, Buffalo State, Canisius interested
- **Partners**: 43North, Launch NY, Seneca One

## 🛠️ Development Guidelines

### Code Principles

```typescript
// ❌ DON'T: Create new components without checking existing
const MyNewButton = () => {...}

// ✅ DO: Reuse existing components
import { Button } from '@/components/ui/Button';
```

### State Management Pattern

```typescript
// We use Zustand for state management
// Store structure:
interface AppState {
  // Global application state
  workspace: WorkspaceData; // Current workspace
  user: UserData; // User session
  ui: UIState; // UI preferences

  // Actions (always prefix with 'set', 'update', 'reset')
  setWorkspace: (workspace: WorkspaceData) => void;
  updateCanvas: (updates: Partial<CanvasState>) => void;
  resetWorkspace: () => void;
}
```

### Service Layer Pattern

```typescript
// Services handle business logic and API calls
class ProjectService {
  // Singleton pattern
  private static instance: ProjectService;

  // Always return typed responses
  async loadWorkspace(code: string): Promise<Workspace | null> {
    // 1. Validate input
    // 2. Try localStorage first
    // 3. Handle errors gracefully
    // 4. Return typed data
  }
}
```

## 🔑 Key Features Deep Dive

### 1. Code-Based Access System

```typescript
// Code format: BUF-XXXX (4 alphanumeric characters)
// Generated using nanoid with custom alphabet
const generateCode = () => `BUF-${nanoid(4)}`;

// Codes are:
// - Unique (checked against existing)
// - Memorable (short format)
// - Buffalo-branded (BUF prefix)
// - Case-insensitive (normalized to uppercase)
```

### 2. Business Model Canvas

The crown jewel of our platform. Interactive, AI-powered, mobile-responsive.

```typescript
// Canvas has 9 blocks, each with:
interface CanvasBlock {
  id: string; // 'value-propositions'
  title: string; // 'Value Propositions'
  content: string; // User input
  placeholder: string; // Helper text
  aiSuggestions: string[]; // AI-generated ideas
  color: string; // Visual theming
}

// AI suggestions are context-aware:
// - Look at other filled blocks
// - Consider project type (student/startup)
// - Use Buffalo-specific examples
```

### 3. Pivot Detection System

Automatically tracks when users make significant changes.

```typescript
// Pivot detection algorithm:
// 1. Compare current state to last version
// 2. Calculate change percentage per field
// 3. Classify pivot magnitude:
//    - Minor: <30% change in 1-2 fields
//    - Major: >30% change in 3+ fields
//    - Complete: >50% change in 5+ fields
// 4. Generate AI analysis of pivot rationale
```

### 4. Document Processing

Extracts insights from uploaded files.

```typescript
// Supported formats and processing:
const processors = {
  "application/pdf": processPDF, // Uses pdfjs-dist
  "application/msword": processWord, // Uses mammoth
  "text/plain": processText, // Direct parsing
  "text/csv": processCSV, // Custom parser
};

// Extraction pipeline:
// 1. Parse document structure
// 2. Extract text content
// 3. Identify key sections
// 4. Generate summary with AI
// 5. Link insights to canvas blocks
```

## 🚀 Performance Optimization

### Current Optimizations

```javascript
// 1. Code splitting - Load tools on demand
const BusinessModelCanvas = lazy(() => import('./tools/BusinessModelCanvas'));

// 2. Bundle optimization - Manual chunks
manualChunks: {
  'vendor': ['react', 'react-dom'],
  'animation': ['framer-motion'],
  'utilities': ['zustand', 'nanoid']
}

// 3. Image optimization - WebP with fallbacks
<picture>
  <source srcSet="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>

// 4. LocalStorage caching - Reduce API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### Performance Metrics

- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: 124KB gzipped
- **Lighthouse Score**: 90+

## 🔒 Security Considerations

### Current Implementation

```typescript
// 1. Input sanitization
const sanitizeInput = (input: string) => {
  return input.replace(/<script>/gi, "");
};

// 2. API key management
// Never expose keys in client code
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 3. LocalStorage encryption (planned)
// Will encrypt sensitive workspace data

// 4. Rate limiting
const rateLimiter = new Map<string, number>();
```

### Security Checklist

- [x] No hardcoded secrets
- [x] Input validation on all forms
- [x] XSS prevention
- [x] Error messages don't leak sensitive info
- [ ] LocalStorage encryption (planned)
- [ ] HTTPS enforcement (deployment level)

## 🐛 Common Issues & Solutions

### Issue 1: Canvas Not Saving

```typescript
// Problem: Auto-save debounce too aggressive
// Solution: Reduced from 2000ms to 500ms
const AUTOSAVE_DELAY = 500;

// Check: localStorage quota
if (e.name === "QuotaExceededError") {
  // Clear old versions, keep last 10
}
```

### Issue 2: Mobile Layout Breaking

```typescript
// Problem: Fixed widths on mobile
// Solution: Use responsive utilities
// ❌ width: 600px
// ✅ w-full md:w-[600px]
```

### Issue 3: AI Suggestions Not Loading

```typescript
// Check API key configuration
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn("Gemini API key not configured");
  return fallbackSuggestions;
}
```

## 📈 Analytics & Tracking

### Current Implementation

```typescript
// PostHog for product analytics
posthog.capture("canvas_updated", {
  workspace_code: workspace.code,
  block_id: blockId,
  has_content: content.length > 0,
});

// Custom metrics we track:
const metrics = {
  workspace_created: "New workspace started",
  canvas_completed: "All blocks filled",
  pivot_detected: "Major change identified",
  ai_suggestion_used: "AI help accepted",
  document_uploaded: "File processed",
  project_published: "Made public",
};
```

## 🔄 State Management Details

### Store Architecture

```typescript
// Three main stores:
// 1. AppStore - Global application state
// 2. WorkspaceStore - Current workspace data
// 3. AuthStore - User session and permissions

// Store communication pattern:
// Stores can read from each other but updates flow one way
// UI → Action → Store → UI Update

// Example flow:
// 1. User updates canvas block
// 2. Component calls workspaceStore.updateCanvas()
// 3. Store updates state and triggers auto-save
// 4. Components re-render with new data
```

## 🎨 Design System

### Color Palette

```css
--primary: #0066cc; /* Buffalo Blue */
--secondary: #ff6b35; /* Energetic Orange */
--success: #00c851; /* Growth Green */
--warning: #ffb900; /* Caution Yellow */
--error: #ff3b30; /* Alert Red */
--background: #0a0f1c; /* Deep Navy */
--surface: #1a1f2e; /* Card Background */
--text: #ffffff; /* Primary Text */
--text-muted: #94a3b8; /* Secondary Text */
```

### Component Patterns

```tsx
// All components follow this structure:
interface ComponentProps {
  className?: string;      // Always allow custom classes
  children?: ReactNode;    // Support composition
  [key: string]: any;     // Allow prop spreading
}

// Accessibility is mandatory:
<button
  aria-label="Save workspace"
  aria-busy={isSaving}
  disabled={isSaving}
>
```

## 🚦 Testing Strategy

### Current Coverage

- **Unit Tests**: Services and utilities (planned)
- **Integration Tests**: User flows (planned)
- **E2E Tests**: Critical paths with Playwright (planned)

### Testing Principles

```typescript
// Test user behavior, not implementation
// ❌ expect(component.state.isOpen).toBe(true)
// ✅ expect(screen.getByRole('dialog')).toBeVisible()

// Test the unhappy path
// - Network failures
// - Invalid input
// - Race conditions
// - Storage quota exceeded
```

## 📝 Documentation Standards

### Code Comments

```typescript
/**
 * Processes uploaded documents and extracts business insights.
 *
 * @param file - The uploaded file to process
 * @param workspaceId - Current workspace context
 * @returns Extracted insights and document metadata
 *
 * @example
 * const insights = await processDocument(file, 'BUF-X7K9');
 *
 * @throws {DocumentProcessingError} If file format unsupported
 * @since 1.2.0
 */
```

### Commit Messages

```bash
# Format: type(scope): description

feat(canvas): Add AI suggestions for value propositions
fix(mobile): Resolve canvas overflow on small screens
refactor(services): Extract document processing logic
docs(readme): Update deployment instructions
test(auth): Add code validation unit tests
```

## 🔮 Future Roadmap

### Phase 1: Current MVP (Now - Feb 2025)

- [x] Core workspace tools
- [x] Code-based access
- [x] AI integration
- [ ] Teacher portal completion

### Phase 2: Scale (Mar - Jun 2025)

- [ ] Backend migration (Supabase)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3: Ecosystem (Jul - Dec 2025)

- [ ] Mentor marketplace
- [ ] Investor connections
- [ ] Grant application tools
- [ ] Buffalo startup directory

## 💡 AI Assistant Tips

### When Working on This Codebase

1. **Always check existing components first** - We likely have what you need
2. **Maintain TypeScript strict mode** - No `any` types without good reason
3. **Think mobile-first** - Every feature must work on phones
4. **Preserve user data** - Never lose workspace content
5. **Keep it Buffalo** - Local references and partnerships matter

### Common Tasks

```bash
# Start development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview production
npm run preview
```

### Key Files to Know

- `src/services/projectService.ts` - Core business logic
- `src/pages/WorkspaceOptimized.tsx` - Main workspace
- `src/components/tools/BusinessModelCanvasAdaptive.tsx` - Primary tool
- `src/types/index.ts` - All TypeScript types
- `src/stores/workspaceStore.ts` - State management

## 📞 Contact & Resources

- **GitHub**: [Buffalo-Projects/HIVE](https://github.com/Buffalo-Projects/HIVE)
- **Deployed**: [buffaloprojects.com](https://buffaloprojects.com)
- **Founder**: Jacob (Buffalo, NY)
- **Stack Overflow Tag**: #buffalo-projects

---

_This document is the source of truth for AI assistants. When in doubt, refer back to these principles and patterns._
