# Development Guide - Buffalo Projects

## Getting Started

### Prerequisites

- Node.js 18+ (recommend using nvm)
- npm or yarn
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Buffalo-Projects/HIVE.git
cd Buffalo-Projects

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Gemini API key to .env.local
# Get one free at: https://aistudio.google.com/app/apikey

# Start development server
npm run dev

# Open http://localhost:5173
```

## Development Workflow

### Daily Development Cycle

```bash
# Morning setup
git pull origin main
npm install  # In case dependencies changed
npm run dev

# Before committing
npm run type-check  # Check TypeScript
npm run lint        # Check code quality
npm run build       # Verify production build

# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/your-feature-name
```

### Code Style Guide

#### TypeScript Best Practices

```typescript
// ✅ DO: Use proper types
interface UserData {
  code: string;
  projectName: string;
  createdAt: Date;
}

// ❌ DON'T: Use any
const processData = (data: any) => {
  // Bad!
  return data.someField;
};

// ✅ DO: Handle errors gracefully
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error("Operation failed", error);
  return { success: false, error: "Operation failed" };
}

// ✅ DO: Use optional chaining
const value = workspace?.canvas?.valueProps ?? "Default";

// ✅ DO: Use const for immutable values
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;
```

#### React Best Practices

```tsx
// ✅ DO: Use functional components with hooks
const MyComponent: FC<Props> = ({ title, onAction }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  return <div>{title}</div>;
};

// ✅ DO: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props);
}, [props.relevantField]);

// ✅ DO: Use proper event handlers
const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  onAction(value);
}, [value, onAction]);

// ❌ DON'T: Use inline functions in render
<button onClick={() => doSomething()}> // Bad!
```

#### Tailwind CSS Patterns

```tsx
// ✅ DO: Use responsive utilities
<div className="w-full md:w-1/2 lg:w-1/3">

// ✅ DO: Use component variants with clsx
const buttonStyles = clsx(
  'px-4 py-2 rounded-lg font-medium transition-colors',
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled
  }
);

// ✅ DO: Extract repeated patterns
const cardStyles = 'rounded-lg bg-surface p-6 shadow-lg';
```

## Feature Development

### Adding a New Tool

1. **Create the component**

```typescript
// src/components/tools/YourNewTool.tsx
import { FC, useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface YourToolData {
  // Define your data structure
}

export const YourNewTool: FC = () => {
  const { workspace, updateWorkspace } = useWorkspaceStore();
  const [toolData, setToolData] = useState<YourToolData>();

  // Implementation
  return (
    <div className="tool-container">
      {/* Tool UI */}
    </div>
  );
};
```

2. **Add to workspace**

```typescript
// src/pages/WorkspaceOptimized.tsx
import { YourNewTool } from "@/components/tools/YourNewTool";

// Add to tool tabs
const tools = [
  {
    id: "canvas",
    name: "Business Model Canvas",
    component: BusinessModelCanvas,
  },
  { id: "your-tool", name: "Your Tool", component: YourNewTool }, // New!
];
```

3. **Update types**

```typescript
// src/types/index.ts
export interface Workspace {
  // Existing fields...
  yourToolData?: YourToolData; // Add your data type
}
```

4. **Add service methods**

```typescript
// src/services/projectService.ts
public async updateYourToolData(code: string, data: YourToolData): Promise<void> {
  const workspace = await this.loadWorkspace(code);
  if (!workspace) throw new Error('Workspace not found');

  workspace.yourToolData = data;
  workspace.lastModified = new Date().toISOString();

  await this.saveWorkspace(workspace);
}
```

### Adding a New Page

1. **Create page component**

```tsx
// src/pages/YourPage.tsx
import { FC } from "react";
import { Layout } from "@/components/layout/Layout";

export const YourPage: FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Page Title</h1>
        {/* Page content */}
      </div>
    </Layout>
  );
};
```

2. **Add route**

```tsx
// src/App.tsx
import { YourPage } from "@/pages/YourPage";

const router = createBrowserRouter([
  // Existing routes...
  {
    path: "/your-page",
    element: <YourPage />,
    errorElement: <ErrorBoundary />,
  },
]);
```

3. **Add navigation link**

```tsx
// src/components/navigation/Navigation.tsx
const navItems = [
  // Existing items...
  { path: "/your-page", label: "Your Page", icon: YourIcon },
];
```

## State Management

### Using Zustand Stores

#### Reading from stores

```typescript
// Get specific values
const workspace = useWorkspaceStore((state) => state.workspace);
const updateCanvas = useWorkspaceStore((state) => state.updateCanvas);

// Get multiple values
const { workspace, loading, error } = useWorkspaceStore((state) => ({
  workspace: state.workspace,
  loading: state.loading,
  error: state.error,
}));
```

#### Updating store state

```typescript
// In your store definition
const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspace: null,

  setWorkspace: (workspace) => set({ workspace }),

  updateCanvas: (updates) =>
    set((state) => ({
      workspace: {
        ...state.workspace,
        canvas: { ...state.workspace?.canvas, ...updates },
      },
    })),

  // Async actions
  loadWorkspace: async (code) => {
    set({ loading: true, error: null });
    try {
      const workspace = await projectService.loadWorkspace(code);
      set({ workspace, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
```

### Service Layer Integration

#### Creating a service

```typescript
// src/services/YourService.ts
class YourService {
  private static instance: YourService;

  private constructor() {
    // Initialize service
  }

  public static getInstance(): YourService {
    if (!YourService.instance) {
      YourService.instance = new YourService();
    }
    return YourService.instance;
  }

  public async fetchData(params: Params): Promise<Result> {
    try {
      // Validate params
      if (!params.isValid) {
        throw new Error("Invalid parameters");
      }

      // Make API call or process data
      const result = await this.processData(params);

      // Cache if needed
      this.cache.set(params.id, result);

      return result;
    } catch (error) {
      logger.error("Failed to fetch data", error);
      throw error;
    }
  }

  private async processData(params: Params): Promise<Result> {
    // Implementation
  }
}

export default YourService.getInstance();
```

## Testing

### Unit Testing Components

```typescript
// src/components/tools/YourTool.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { YourTool } from './YourTool';

describe('YourTool', () => {
  it('should render initial state', () => {
    render(<YourTool />);
    expect(screen.getByText('Tool Title')).toBeInTheDocument();
  });

  it('should handle user input', async () => {
    render(<YourTool />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'New Value' } });

    await waitFor(() => {
      expect(input.value).toBe('New Value');
    });
  });

  it('should save data on blur', async () => {
    const mockSave = jest.fn();
    render(<YourTool onSave={mockSave} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith('Test');
    });
  });
});
```

### Testing Services

```typescript
// src/services/YourService.test.ts
import YourService from "./YourService";

describe("YourService", () => {
  beforeEach(() => {
    // Clear any caches or mocks
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const result = await YourService.fetchData({ id: "123" });
    expect(result).toEqual(expectedData);
  });

  it("should handle errors gracefully", async () => {
    const invalidParams = { id: null };

    await expect(YourService.fetchData(invalidParams)).rejects.toThrow(
      "Invalid parameters",
    );
  });

  it("should cache results", async () => {
    const spy = jest.spyOn(YourService, "processData");

    // First call
    await YourService.fetchData({ id: "123" });
    expect(spy).toHaveBeenCalledTimes(1);

    // Second call should use cache
    await YourService.fetchData({ id: "123" });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

## Debugging

### Common Issues and Solutions

#### 1. Canvas not saving

```typescript
// Check LocalStorage quota
const checkQuota = () => {
  const usage = new Blob(Object.values(localStorage)).size;
  console.log(`Storage usage: ${(usage / 1024 / 1024).toFixed(2)}MB`);
};

// Clear old data if needed
const clearOldVersions = () => {
  const workspace = JSON.parse(localStorage.getItem("workspace") || "{}");
  workspace.versions = workspace.versions?.slice(-10); // Keep last 10
  localStorage.setItem("workspace", JSON.stringify(workspace));
};
```

#### 2. AI suggestions not loading

```typescript
// Check API key
console.log("API Key configured:", !!import.meta.env.VITE_GEMINI_API_KEY);

// Check rate limiting
const checkRateLimit = () => {
  const attempts = JSON.parse(localStorage.getItem("api_attempts") || "[]");
  const recentAttempts = attempts.filter(
    (time: number) => Date.now() - time < 60000,
  );
  console.log(`API calls in last minute: ${recentAttempts.length}`);
};
```

#### 3. Performance issues

```typescript
// Profile component renders
import { Profiler } from 'react';

<Profiler
  id="Canvas"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <BusinessModelCanvas />
</Profiler>

// Check for memory leaks
const checkMemoryUsage = () => {
  if (performance.memory) {
    console.log({
      used: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
      total: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
      limit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
    });
  }
};
```

### Debug Tools

#### Browser DevTools

```javascript
// Add to window for debugging
window.debug = {
  workspace: () => JSON.parse(localStorage.getItem("workspace_current")),
  clearCache: () => localStorage.clear(),
  showMetrics: () => performance.getEntriesByType("measure"),
  logState: () => console.log(useWorkspaceStore.getState()),
};
```

#### React DevTools

- Install React DevTools browser extension
- Use Components tab to inspect props/state
- Use Profiler tab to find performance issues

#### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const PDFViewer = lazy(() => import('./PDFViewer'));

// Use Suspense for loading states
<Suspense fallback={<Loading />}>
  <PDFViewer document={document} />
</Suspense>
```

### Memoization

```typescript
// Memoize expensive calculations
const analysis = useMemo(() => {
  return analyzeWorkspaceData(workspace);
}, [workspace.lastModified]);

// Memoize callbacks
const handleSave = useCallback((data: Data) => {
  saveWorkspace(data);
}, []);

// Memoize components
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexVisualization data={data} />;
});
```

### Bundle Optimization

```javascript
// vite.config.ts optimizations
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes("node_modules")) {
          if (id.includes("react")) return "react";
          if (id.includes("framer")) return "animation";
          return "vendor";
        }
      };
    }
  }
}
```

## Deployment

### Pre-deployment Checklist

```bash
# 1. Update version
npm version patch/minor/major

# 2. Run all checks
npm run type-check
npm run lint
npm run build

# 3. Test production build
npm run preview

# 4. Update changelog
# Document changes in CHANGELOG.md

# 5. Commit and tag
git add .
git commit -m "chore: release v1.2.3"
git tag v1.2.3

# 6. Push to main
git push origin main --tags
```

### Environment Variables

```bash
# Required for production
VITE_GEMINI_API_KEY=your_production_key
VITE_POSTHOG_KEY=your_analytics_key
VITE_SENTRY_DSN=your_error_tracking_dsn

# Optional
VITE_API_URL=https://api.buffaloprojects.com
VITE_FEATURE_FLAGS=feature1,feature2
```

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Error Messages

#### "API key not configured"

- Check .env.local has VITE_GEMINI_API_KEY
- Restart dev server after changing .env
- Verify key at https://aistudio.google.com/app/apikey

#### "Workspace not found"

- Check localStorage for corrupted data
- Verify code format (BUF-XXXX)
- Clear cache and retry

#### "QuotaExceededError"

- LocalStorage is full (10MB limit)
- Clear old workspaces
- Implement cleanup in settings

### Getting Help

1. Check existing issues: https://github.com/Buffalo-Projects/HIVE/issues
2. Search documentation: /docs folder
3. Ask in discussions: https://github.com/Buffalo-Projects/HIVE/discussions
4. Contact team: dev@buffaloprojects.com

---

_Happy coding! Build something amazing for Buffalo._ 🦬
