/**
 * Onboarding Store
 *
 * Manages onboarding state for new users including:
 * - Welcome modal visibility
 * - Canvas introduction modal
 * - BMC tooltip hints visibility
 *
 * Uses localStorage for immediate persistence + optional Firestore sync.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CanvasBlockId } from "@/types";

interface OnboardingState {
  /** Whether user has seen the welcome modal on dashboard */
  hasSeenWelcomeModal: boolean;

  /** Whether user has seen the canvas introduction modal */
  hasSeenCanvasIntro: boolean;

  /** Whether to show BMC block tooltips/hints */
  showBMCHints: boolean;

  /** Block to focus after canvas intro modal closes (not persisted) */
  pendingBlockFocus: CanvasBlockId | null;

  /** Mark welcome modal as seen */
  markWelcomeModalSeen: () => void;

  /** Mark canvas intro as seen */
  markCanvasIntroSeen: () => void;

  /** Toggle BMC hints visibility */
  toggleBMCHints: () => void;

  /** Set BMC hints visibility explicitly */
  setBMCHints: (show: boolean) => void;

  /** Set a block to focus when canvas loads */
  setPendingBlockFocus: (blockId: CanvasBlockId | null) => void;

  /** Reset all onboarding state (for testing) */
  resetOnboarding: () => void;
}

const initialState = {
  hasSeenWelcomeModal: false,
  hasSeenCanvasIntro: false,
  showBMCHints: true, // Hints enabled by default for new users
  pendingBlockFocus: null as CanvasBlockId | null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      markWelcomeModalSeen: () => {
        set({ hasSeenWelcomeModal: true });
      },

      markCanvasIntroSeen: () => {
        set({ hasSeenCanvasIntro: true });
      },

      toggleBMCHints: () => {
        set((state) => ({ showBMCHints: !state.showBMCHints }));
      },

      setBMCHints: (show: boolean) => {
        set({ showBMCHints: show });
      },

      setPendingBlockFocus: (blockId: CanvasBlockId | null) => {
        set({ pendingBlockFocus: blockId });
      },

      resetOnboarding: () => {
        set(initialState);
      },
    }),
    {
      name: "buffalo-onboarding",
      // Only persist specific fields, not actions
      partialize: (state) => ({
        hasSeenWelcomeModal: state.hasSeenWelcomeModal,
        hasSeenCanvasIntro: state.hasSeenCanvasIntro,
        showBMCHints: state.showBMCHints,
      }),
      // SSR-safe storage configuration - only use localStorage in browser
      storage:
        typeof window !== "undefined"
          ? {
              getItem: (name) => {
                const str = localStorage.getItem(name);
                return str ? (JSON.parse(str) as { state: OnboardingState }) : null;
              },
              setItem: (name, value) => {
                localStorage.setItem(name, JSON.stringify(value));
              },
              removeItem: (name) => {
                localStorage.removeItem(name);
              },
            }
          : undefined,
    },
  ),
);
