import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  class MockTimestamp {
    constructor(private d: Date) {}
    toDate() {
      return this.d;
    }
  }
  const mockDb = {};
  const getDoc = vi.fn();
  const doc = vi.fn((_db: unknown, path: string, id: string) => ({
    path: `${path}/${id}`,
  }));
  return { MockTimestamp, mockDb, getDoc, doc };
});

vi.mock("@/services/firebase", () => ({
  db: mocks.mockDb,
  auth: { currentUser: { uid: "u1" } },
}));
vi.mock("firebase/firestore", () => ({
  getDoc: mocks.getDoc,
  doc: mocks.doc,
  Timestamp: mocks.MockTimestamp,
}));

import { firebaseDatabase } from "../firebaseDatabase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("firebaseDatabase.getWorkspace access control", () => {
  it("returns null when user has no access", async () => {
    // Workspace owned by someone else, not public, no collaborators
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u2",
        isPublic: false,
        collaborators: [],
        createdAt: new mocks.MockTimestamp(new Date()),
        lastModified: new mocks.MockTimestamp(new Date()),
      }),
    });
    const ws = await firebaseDatabase.getWorkspace("ws-deny");
    expect(ws).toBeNull();
  });

  it("returns workspace when public", async () => {
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u2",
        isPublic: true,
        collaborators: [],
        createdAt: new mocks.MockTimestamp(new Date()),
        lastModified: new mocks.MockTimestamp(new Date()),
      }),
    });
    const ws = await firebaseDatabase.getWorkspace("ws-public");
    expect(ws).not.toBeNull();
  });

  it("returns workspace when collaborator", async () => {
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u2",
        isPublic: false,
        collaborators: ["u1"],
        createdAt: new mocks.MockTimestamp(new Date()),
        lastModified: new mocks.MockTimestamp(new Date()),
      }),
    });
    const ws = await firebaseDatabase.getWorkspace("ws-collab");
    expect(ws).not.toBeNull();
  });
});
