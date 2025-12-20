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
  const doc = vi.fn((_db: unknown, path: string, id?: string) => ({
    path: id ? `${path}/${id}` : path,
    id,
  }));
  const updateDoc = vi.fn();
  const serverTimestamp = vi.fn(
    () => new MockTimestamp(new Date("2024-01-01T00:00:00Z")),
  );
  const arrayUnion = vi.fn((x: unknown) => ({ union: x }));
  const ref = vi.fn((_storage: unknown, fullPath: string) => ({ fullPath }));
  const uploadBytesResumable = vi.fn();
  const getDownloadURL = vi.fn();
  return {
    MockTimestamp,
    mockDb,
    mockStorage,
    doc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  };
});

vi.mock("@/services/firebase", () => ({
  db: mocks.mockDb,
  storage: mocks.mockStorage,
  auth: { currentUser: { uid: "u1" } },
}));
vi.mock("firebase/firestore", () => ({
  doc: mocks.doc,
  updateDoc: mocks.updateDoc,
  serverTimestamp: mocks.serverTimestamp,
  arrayUnion: mocks.arrayUnion,
  Timestamp: mocks.MockTimestamp,
}));
vi.mock("firebase/storage", () => ({
  ref: mocks.ref,
  uploadBytesResumable: mocks.uploadBytesResumable,
  getDownloadURL: mocks.getDownloadURL,
}));

import { firebaseDatabase } from "../firebaseDatabase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("firebaseDatabase.uploadDocument", () => {
  it("uploads file and updates workspace documents list", async () => {
    // Mock getWorkspace to bypass ownership check
    const ws = {
      code: "ws-1",
      ownerId: "u1",
      userId: "u1",
      bmcData: {},
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isPublic: false,
    } as any;
    vi.spyOn(firebaseDatabase as any, "getWorkspace").mockResolvedValue(ws);

    // Mock upload task behavior
    const fakeSnapshot = {
      ref: { fullPath: "evidence/u1/ws-1/file.pdf" },
    } as any;
    mocks.uploadBytesResumable.mockImplementation((_r: any, _file: any) => ({
      snapshot: fakeSnapshot,
      on: (_: any, _progress: any, _err: any, complete: any) => {
        complete();
      },
    }));
    mocks.getDownloadURL.mockResolvedValueOnce(
      "https://storage.local/evidence/u1/ws-1/file.pdf",
    );

    const file = new File([new Uint8Array([1, 2, 3])], "file.pdf", {
      type: "application/pdf",
    });
    const docMeta = await firebaseDatabase.uploadDocument("ws-1", file, {
      title: "Spec",
    });

    expect(docMeta.name).toBe("Spec");
    expect(docMeta.type).toBe("pdf");
    expect(docMeta.storagePath).toMatch(/https:\/\//);
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({
        documents: expect.objectContaining({
          union: expect.objectContaining({ id: docMeta.id }),
        }),
      }),
    );
  });
});
