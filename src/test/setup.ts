import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Ensure localStorage is available in Node test environment
const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
};

const memoryStorage = createMemoryStorage();

vi.stubGlobal("localStorage", memoryStorage);

if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage,
    configurable: true,
  });
}

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(
  (): IntersectionObserver =>
    ({
      root: null,
      rootMargin: "",
      thresholds: [],
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: () => [],
    }) as unknown as IntersectionObserver,
);

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const resizeObserver = MockResizeObserver;

if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = resizeObserver as unknown as typeof ResizeObserver;
}

if (
  typeof window !== "undefined" &&
  typeof window.ResizeObserver === "undefined"
) {
  Object.defineProperty(window, "ResizeObserver", {
    value: resizeObserver,
    configurable: true,
  });
}
