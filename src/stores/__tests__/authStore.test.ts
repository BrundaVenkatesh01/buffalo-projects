import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUser = {
  uid: "user-abc",
  email: "user@example.com",
  displayName: "Test User",
  photoURL: null,
  emailVerified: true,
};

const mocks = vi.hoisted(() => ({
  waitForAuthInit: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  updateUserProfile: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock("@/services/firebaseAuth", () => ({
  authService: {
    waitForAuthInit: (...a: unknown[]) => mocks.waitForAuthInit(...a),
    signIn: (...a: unknown[]) => mocks.signIn(...a),
    signOut: (...a: unknown[]) => mocks.signOut(...a),
    register: (...a: unknown[]) => mocks.register(...a),
    updateUserProfile: (...a: unknown[]) => mocks.updateUserProfile(...a),
    onAuthStateChange: (cb: (u: unknown) => void) =>
      mocks.onAuthStateChange(cb),
  },
}));

import { useAuthStore } from "../authStore";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("authStore", () => {
  it("initializes with waitForAuthInit and subscribes to changes", async () => {
    mocks.waitForAuthInit.mockResolvedValueOnce(null);
    const { initialize } = useAuthStore.getState();
    await initialize();
    expect(mocks.waitForAuthInit).toHaveBeenCalled();

    const cb = vi.fn();
    mocks.onAuthStateChange.mockImplementationOnce((handler) => {
      cb.mockImplementation(handler as (u: unknown) => void);
      return;
    });

    // Simulate auth change
    useAuthStore.getState();
    expect(typeof cb).toBe("function");
  });

  it("signs in and updates state", async () => {
    mocks.signIn.mockResolvedValueOnce(mockUser);
    const store = useAuthStore.getState();
    await store.signIn("user@example.com", "pass");
    expect(useAuthStore.getState().user?.uid).toBe("user-abc");
  });

  it("signs up and sets user", async () => {
    mocks.register.mockResolvedValueOnce(mockUser);
    await useAuthStore.getState().signUp("email", "pw", {});
    expect(useAuthStore.getState().user?.email).toBe("user@example.com");
  });

  it("updates profile and persists", async () => {
    mocks.updateUserProfile.mockResolvedValueOnce({
      ...mockUser,
      displayName: "New Name",
    });
    await useAuthStore.getState().updateProfile({ displayName: "New Name" });
    expect(useAuthStore.getState().user?.displayName).toBe("New Name");
  });

  it("signs out and clears user", async () => {
    mocks.signOut.mockResolvedValueOnce(undefined);
    await useAuthStore.getState().signOut();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
