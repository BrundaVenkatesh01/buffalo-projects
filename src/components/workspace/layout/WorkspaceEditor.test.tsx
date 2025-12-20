import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Fake timers for autosave
vi.useFakeTimers();

// Use a real Zustand store mock to trigger updates/effects
vi.mock("@/stores/workspaceStore", async () => {
  const { create } = await import("zustand");
  type S = any;
  const initial: S = {
    currentWorkspace: {
      code: "ws-1",
      projectName: "WS",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isPublic: false,
      bmcData: {
        keyPartners: "",
        keyActivities: "",
        keyResources: "",
        valuePropositions: "",
        customerRelationships: "",
        channels: "",
        customerSegments: "",
        costStructure: "",
        revenueStreams: "",
      },
      documents: [],
      journal: [],
      versions: [],
      pivots: [],
      evidenceLinks: {},
      contextNotes: [],
      chatMessages: [],
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
    },
    loading: false,
    error: null,
  };
  const useWorkspaceStore: any = create<S>((set, _get) => ({
    ...initial,
    loadWorkspace: vi.fn(),
    clearWorkspace: vi.fn(),
    clearError: vi.fn(),
    updateWorkspace: vi.fn((updates: any) =>
      set((s: S) => ({
        currentWorkspace: { ...s.currentWorkspace, ...updates },
      })),
    ),
    saveWorkspace: vi.fn(),
    saveAndCreateSnapshot: vi.fn().mockResolvedValue(false),
  }));
  return { useWorkspaceStore };
});

import { WorkspaceEditor } from "./WorkspaceEditor";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WorkspaceEditor autosave", () => {
  it.skip("schedules autosave after content change", async () => {
    render(<WorkspaceEditor workspaceId="ws-1" />);
    // Simulate user changing a field: update lastModified triggers autosave timer
    const { useWorkspaceStore } = await import("@/stores/workspaceStore");
    await act(async () => {
      useWorkspaceStore.getState().updateWorkspace({
        lastModified: new Date(Date.now() + 1000).toISOString(),
      });
    });
    // Advance timers for AUTOSAVE_INTERVAL (10s) and flush any pending tasks
    vi.advanceTimersByTime(10_000);
    await vi.runAllTimersAsync();
    expect(useWorkspaceStore.getState().saveWorkspace).toHaveBeenCalled();
    // Save status can be checked by text, but not necessary; the side effect is enough here
  });
});
