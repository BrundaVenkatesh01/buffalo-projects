import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isFirebaseConfigured } from "../services/firebase";
import { authService, type User } from "../services/firebaseAuth";
import { logger } from "../utils/logger";

const DEV_MOCK_USER: User = {
  uid: "dev-user-1",
  email: "brunda@buffalo.edu",
  firstName: "Brunda",
  lastName: "Venkatesh",
  // add other fields only if your User type requires them
};

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profile: {
      firstName?: string;
      lastName?: string;
      buffaloConnection?: string;
      entrepreneurshipExperience?:
        | "student"
        | "first_time"
        | "serial"
        | "educator";
    },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Helper to create store with conditional persistence (only in browser)
const createAuthStore = () => {
  const baseStore: StateCreator<AuthState> = (set) => ({
    user: null,
    loading: false,
    error: null,

    initialize: async () => {
      try {
        set({ loading: true });

        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          logger.warn("Firebase is not configured, running in local-only mode");
          set({
            user: DEV_MOCK_USER,
            loading: false,
            error: "Authentication is not configured. Running in local mode.",
          });
          return;
        }

        // Wait for Firebase auth to initialize
        const user = await authService.waitForAuthInit();
        set({ user, loading: false });

        // Subscribe to auth state changes
        authService.onAuthStateChange((user) => {
          set({ user, loading: false });
        });
      } catch (error) {
        logger.error("Auth initialization error:", error);
        set({ loading: false, error: "Failed to initialize authentication" });
      }
    },

    signIn: async (email: string, password: string) => {
      try {
        set({ loading: true, error: null });

        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          const errorMessage =
            "Authentication requires Firebase configuration. Running in local mode without auth.";
          logger.warn(errorMessage);
          set({ loading: false, error: errorMessage });
          throw new Error(errorMessage);
        }

        const user = await authService.signIn(email, password);
        set({ user, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Sign in failed";
        set({ loading: false, error: message });
        throw error;
      }
    },

    signUp: async (
      email: string,
      password: string,
      profile: {
        firstName?: string;
        lastName?: string;
        buffaloConnection?: string;
        entrepreneurshipExperience?:
          | "student"
          | "first_time"
          | "serial"
          | "educator";
      },
    ) => {
      try {
        set({ loading: true, error: null });

        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          const errorMessage =
            "Authentication requires Firebase configuration. Running in local mode without auth.";
          logger.warn(errorMessage);
          set({ loading: false, error: errorMessage });
          throw new Error(errorMessage);
        }

        const user = await authService.register(email, password, profile);
        set({ user, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Sign up failed";
        set({ loading: false, error: message });
        throw error;
      }
    },

    signOut: async () => {
      try {
        set({ loading: true, error: null });

        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          logger.warn("Signing out in local mode (no Firebase)");
          set({ user: null, loading: false });
          return;
        }

        await authService.signOut();
        set({ user: null, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Sign out failed";
        set({ loading: false, error: message });
        throw error;
      }
    },

    updateProfile: async (updates: Partial<User>) => {
      try {
        set({ loading: true, error: null });

        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          const errorMessage =
            "Profile updates require Firebase configuration. Running in local mode.";
          logger.warn(errorMessage);
          set({ loading: false, error: errorMessage });
          throw new Error(errorMessage);
        }

        const user = await authService.updateUserProfile(updates);
        set({ user, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Profile update failed";
        set({ loading: false, error: message });
        throw error;
      }
    },

    clearError: () => set({ error: null }),
  });

  // Only use persistence in the browser (not during SSR/SSG)
  if (typeof window === "undefined") {
    return create<AuthState>()(baseStore);
  }

  return create<AuthState>()(
    persist(baseStore, {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Only persist user data
      }),
    }),
  );
};

export const useAuthStore = createAuthStore();
