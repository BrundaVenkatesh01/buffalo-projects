import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  getPublicWorkspacesPage: vi.fn(),
}));
vi.mock("@/services/firebaseDatabase", () => ({
  firebaseDatabase: {
    getPublicWorkspacesPage: (...a: unknown[]) =>
      mocks.getPublicWorkspacesPage(...a),
  },
}));

import { usePublicProjects } from "./usePublicProjects";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePublicProjects", () => {
  it("loads first page and sets hasMore/cursor", async () => {
    const page1 = {
      workspaces: [{ code: "ws-1", projectName: "A" }],
      hasMore: true,
      cursor: { id: "cursor-1" } as any,
    };
    mocks.getPublicWorkspacesPage.mockResolvedValueOnce(page1);

    const { result } = renderHook(() => usePublicProjects({ limit: 1 }));
    expect(result.current.loading).toBe(true);

    // Wait microtask for effect
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.projects.length).toBeGreaterThan(0);
    expect(result.current.projects[0]!.code).toBe("ws-1");
    expect(result.current.hasMore).toBe(true);
  });

  it("appends unique on loadMore", async () => {
    mocks.getPublicWorkspacesPage
      .mockResolvedValueOnce({
        workspaces: [{ code: "ws-1", projectName: "A" }],
        hasMore: true,
        cursor: { id: "c1" } as any,
      })
      .mockResolvedValueOnce({
        workspaces: [
          { code: "ws-1", projectName: "A2" },
          { code: "ws-2", projectName: "B" },
        ],
        hasMore: false,
        cursor: null,
      });

    const { result } = renderHook(() => usePublicProjects({ limit: 1 }));
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.projects.map((p) => p.code)).toEqual([
      "ws-1",
      "ws-2",
    ]);
    expect(result.current.hasMore).toBe(false);
  });
});
