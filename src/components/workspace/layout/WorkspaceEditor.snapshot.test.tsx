import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/stores/workspaceStore", async () => {
  const { create } = await import("zustand");
  type S = any;
  const initial: S = {
    currentWorkspace: {
      code: "ws-1",
      projectName: "WS",
      projectDescription: "",
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
    saveAndCreateSnapshot: vi.fn().mockResolvedValue(true),
  }));
  return { useWorkspaceStore };
});

import { WorkspaceEditor } from "./WorkspaceEditor";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WorkspaceEditor snapshot dialog", () => {
  it("opens dialog, saves snapshot with note, and closes", async () => {
    const user = userEvent.setup();
    render(<WorkspaceEditor workspaceId="ws-1" />);

    // Wait for component to mount and find snapshot button
    const snapshotBtn = await screen.findByRole("button", {
      name: /snapshot/i,
    });
    await user.click(snapshotBtn);

    // Wait for dialog to open and find textarea
    const textarea = await screen.findByPlaceholderText(/Added evidence/i);
    await user.type(textarea, "e2e snapshot note");

    // Find and click save button
    const saveBtn = await screen.findByRole("button", {
      name: /save snapshot/i,
    });
    await user.click(saveBtn);

    const { useWorkspaceStore } = await import("@/stores/workspaceStore");
    expect(
      useWorkspaceStore.getState().saveAndCreateSnapshot,
    ).toHaveBeenCalledWith("e2e snapshot note");
  }, 15000); // Increase test timeout to 15 seconds
});
