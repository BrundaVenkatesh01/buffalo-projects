import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks for Firebase config and auth (force offline path)
vi.mock("@/services/firebase", () => ({
  isFirebaseConfigured: false,
}));

vi.mock("@/services/firebaseAuth", () => ({
  authService: {
    isAuthenticated: () => false,
  },
}));

// Ensure any unexpected online calls fail the test
const hoisted = vi.hoisted(() => ({
  fail: () => {
    throw new Error("Should not call Firebase in offline tests");
  },
}));
vi.mock("@/services/firebaseDatabase", () => ({
  firebaseDatabase: {
    getWorkspace: hoisted.fail,
    getUserWorkspaces: hoisted.fail,
    createWorkspace: hoisted.fail,
    saveWorkspace: hoisted.fail,
    publishWorkspace: hoisted.fail,
    unpublishWorkspace: hoisted.fail,
  },
}));

// Quiet logger in tests
vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Domain services: provide deterministic behavior
vi.mock("@/domain/services/VersionService", () => ({
  VersionService: class {
    createSnapshot(
      bmcData: unknown,
      projectDescription: string,
      note?: string,
    ) {
      return {
        id: `v-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
        bmcData,
        projectDescription,
        ...(note ? { note } : {}),
      };
    }
  },
}));

vi.mock("@/domain/services/PivotDetectionService", () => ({
  PivotDetectionService: class {
    // Always return a pivot when invoked
    detectPivot(
      _prev: unknown,
      _curr: unknown,
      fromVersion: string,
      toVersion: string,
    ) {
      return {
        id: `p-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
        fromVersion,
        toVersion,
        fields: ["valuePropositions"],
        magnitude: "major",
      };
    }
  },
}));

import { localWorkspaceService } from "@/services/localWorkspaceService";

// Import store after mocks are defined
import { useWorkspaceStore } from "../workspaceStore";

beforeEach(() => {
  // Start each test with a clean local storage
  localStorage.clear();
});

const getState = () => useWorkspaceStore.getState();

describe("workspaceStore - offline CRUD", () => {
  it("creates a workspace locally and updates state", async () => {
    const { createWorkspace } = getState();
    const ws = await createWorkspace({
      projectName: "Test Project",
      description: "Desc",
    });

    const state = getState();
    expect(state.currentWorkspace?.code).toBe(ws.code);
    expect(state.workspaces.find((w) => w.code === ws.code)).toBeTruthy();

    const persisted = localWorkspaceService.getWorkspace(ws.code);
    expect(persisted?.projectName).toBe("Test Project");
  });

  it("updates workspace fields and lastModified", async () => {
    await getState().createWorkspace({ projectName: "P", description: "D" });
    const before = getState().currentWorkspace?.lastModified as string;

    getState().updateWorkspace({ description: "New Desc" });

    const afterState = getState();
    expect(afterState.currentWorkspace?.description).toBe("New Desc");
    expect(
      new Date(afterState.currentWorkspace!.lastModified).getTime(),
    ).toBeGreaterThanOrEqual(new Date(before).getTime());
  });

  it("loads workspaces from local service when offline", async () => {
    const ws = await getState().createWorkspace({ projectName: "Local Only" });
    await getState().loadWorkspaces();

    const state = getState();
    expect(state.workspaces.some((w) => w.code === ws.code)).toBe(true);
  });
});

describe("workspaceStore - publish/unpublish offline", () => {
  it("publishes and unpublishes a workspace locally", async () => {
    const ws = await getState().createWorkspace({ projectName: "Pub Test" });

    const published = await getState().publishWorkspace(ws.code);
    expect(published.isPublic).toBe(true);
    expect(typeof published.slug).toBe("string");
    expect(published.slug && published.slug.length).toBeGreaterThan(0);
    expect(typeof published.publishedAt).toBe("number");

    const persistedPub = localWorkspaceService.getWorkspace(ws.code)!;
    expect(persistedPub.isPublic).toBe(true);

    const unpublished = await getState().unpublishWorkspace(ws.code);
    expect(unpublished.isPublic).toBe(false);
    expect(unpublished.publishedAt).toBeUndefined();

    const persistedUnpub = localWorkspaceService.getWorkspace(ws.code)!;
    expect(persistedUnpub.isPublic).toBe(false);
    expect(persistedUnpub.publishedAt).toBeUndefined();
  });
});

describe("workspaceStore - snapshots and pivots", () => {
  it("creates snapshots and records a pivot when versions exist", async () => {
    // Create workspace and first snapshot (no prior versions -> no pivot detection path)
    await getState().createWorkspace({ projectName: "Snapshot Test" });
    const firstPivot = await getState().saveAndCreateSnapshot("Initial");
    expect(firstPivot).toBe(false);
    expect(getState().currentWorkspace?.versions.length).toBe(1);

    // Modify data and create another snapshot -> pivot detected by mock
    getState().updateWorkspace({
      bmcData: {
        ...getState().currentWorkspace!.bmcData,
        valuePropositions: "New VP",
      },
    });

    const secondPivot = await getState().saveAndCreateSnapshot(
      "Pivot-worthy change",
    );
    expect(secondPivot).toBe(true);

    const ws = getState().currentWorkspace!;
    expect(ws.versions.length).toBe(2);
    expect(ws.pivots.length).toBe(1);
  });
});
