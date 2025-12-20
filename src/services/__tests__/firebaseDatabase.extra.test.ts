import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  class MockTimestamp {
    constructor(private d: Date) {}
    toDate() {
      return this.d;
    }
  }
  const mockDb = {};
  const mockStorage = {};
  const auth = { currentUser: { uid: "u1" } };
  const doc = vi.fn((_db: unknown, path: string, id: string) => ({
    path: `${path}/${id}`,
    id,
  }));
  const updateDoc = vi.fn();
  const getDoc = vi.fn();
  const arrayUnion = vi.fn((x: unknown) => ({ union: x }));
  const serverTimestamp = vi.fn(
    () => new MockTimestamp(new Date("2024-01-01T00:00:00Z")),
  );
  const onSnapshot = vi.fn();
  const ref = vi.fn((_s: unknown, p: string) => ({ fullPath: p }));
  const deleteObject = vi.fn();
  return {
    MockTimestamp,
    mockDb,
    mockStorage,
    auth,
    doc,
    updateDoc,
    getDoc,
    arrayUnion,
    serverTimestamp,
    onSnapshot,
    ref,
    deleteObject,
  };
});

vi.mock("@/services/firebase", () => ({
  db: mocks.mockDb,
  storage: mocks.mockStorage,
  auth: mocks.auth,
}));
vi.mock("firebase/firestore", () => ({
  doc: mocks.doc,
  updateDoc: mocks.updateDoc,
  getDoc: mocks.getDoc,
  arrayUnion: mocks.arrayUnion,
  serverTimestamp: mocks.serverTimestamp,
  onSnapshot: mocks.onSnapshot,
  Timestamp: mocks.MockTimestamp,
}));
vi.mock("firebase/storage", () => ({
  ref: mocks.ref,
  deleteObject: mocks.deleteObject,
}));

import { firebaseDatabase } from "../firebaseDatabase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("firebaseDatabase.deleteDocument", () => {
  it("removes from storage and updates workspace documents", async () => {
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ documents: [{ id: "d1" }, { id: "d2" }] }),
    });
    await firebaseDatabase.deleteDocument("ws-1", {
      id: "d1",
      name: "x",
      type: "pdf",
      size: 1,
      uploadedAt: "",
      storageFullPath: "evidence/u1/ws-1/d1",
    } as any);
    expect(mocks.deleteObject).toHaveBeenCalled();
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({ documents: [{ id: "d2" }] }),
    );
  });
});

describe("firebaseDatabase.journal & context notes", () => {
  it("adds journal entry", async () => {
    await firebaseDatabase.addJournalEntry("ws-1", { content: "note" } as any);
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({
        journal: expect.objectContaining({ union: expect.any(Object) }),
      }),
    );
  });
  it("adds context note", async () => {
    await firebaseDatabase.addContextNote("ws-1", {
      content: "context",
    } as any);
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({
        contextNotes: expect.objectContaining({ union: expect.any(Object) }),
      }),
    );
  });
});

describe("firebaseDatabase.subscribeToWorkspace", () => {
  it("maps snapshot to workspace and handles no access", async () => {
    const unsub = vi.fn();
    mocks.onSnapshot.mockImplementation((_ref, next, _err) => {
      // First: exists + public -> mapped
      next({
        exists: () => true,
        data: () => ({
          code: "ws-1",
          ownerId: "u2",
          isPublic: true,
          createdAt: new mocks.MockTimestamp(new Date()),
          lastModified: new mocks.MockTimestamp(new Date()),
        }),
      });
      // Second: exists but no access -> null
      next({
        exists: () => true,
        data: () => ({
          code: "ws-1",
          ownerId: "u2",
          isPublic: false,
          createdAt: new mocks.MockTimestamp(new Date()),
          lastModified: new mocks.MockTimestamp(new Date()),
        }),
      });
      return unsub;
    });

    const events: any[] = [];
    const off = firebaseDatabase.subscribeToWorkspace("ws-1", (w) => {
      events.push(w);
    });
    expect(typeof off).toBe("function");
    expect(events[0]).toBeTruthy();
    expect(events[1]).toBeNull();
  });
});
