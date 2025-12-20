import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/firebase", () => ({
  db: null,
  auth: null,
  storage: null,
}));

vi.mock("@/utils/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { firebaseDatabase } from "../firebaseDatabase";

describe("firebaseDatabase offline fallbacks", () => {
  it("queryWorkspaces returns empty set when Firestore is unavailable", async () => {
    const res = await firebaseDatabase.queryWorkspaces({ limit: 5 });
    expect(res).toEqual({ workspaces: [], hasMore: false });
  });

  it("getUserWorkspaces throws when user ID is missing offline", async () => {
    await expect(firebaseDatabase.getUserWorkspaces()).rejects.toThrow(
      /User ID required/i,
    );
  });
});
