/**
 * Updates Store
 *
 * Manages state for platform updates widget:
 * - Which updates have been seen
 * - Which updates have been dismissed
 * - Read/unread counts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UpdatesState {
  /** Set of update IDs that have been seen by the user */
  seenUpdates: Set<string>;

  /** Set of update IDs that have been dismissed by the user */
  dismissedUpdates: Set<string>;

  /** Whether the updates panel is currently open */
  isPanelOpen: boolean;

  // Actions
  markAsSeen: (updateId: string) => void;
  markAllAsSeen: (updateIds: string[]) => void;
  dismissUpdate: (updateId: string) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

export const useUpdatesStore = create<UpdatesState>()(
  persist(
    (set) => ({
      seenUpdates: new Set<string>(),
      dismissedUpdates: new Set<string>(),
      isPanelOpen: false,

      markAsSeen: (updateId: string) =>
        set((state) => ({
          seenUpdates: new Set([...state.seenUpdates, updateId]),
        })),

      markAllAsSeen: (updateIds: string[]) =>
        set((state) => ({
          seenUpdates: new Set([...state.seenUpdates, ...updateIds]),
        })),

      dismissUpdate: (updateId: string) =>
        set((state) => ({
          dismissedUpdates: new Set([...state.dismissedUpdates, updateId]),
          seenUpdates: new Set([...state.seenUpdates, updateId]),
        })),

      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

      openPanel: () => set({ isPanelOpen: true }),

      closePanel: () => set({ isPanelOpen: false }),
    }),
    {
      name: "buffalo-updates-store",
      // Only in browser
      storage:
        typeof window !== "undefined"
          ? {
              getItem: (name) => {
                const str = localStorage.getItem(name);
                if (!str) {
                  return null;
                }
                const data = JSON.parse(str) as {
                  state: {
                    seenUpdates?: string[];
                    dismissedUpdates?: string[];
                  };
                };
                return {
                  state: {
                    ...data.state,
                    seenUpdates: new Set(data.state.seenUpdates || []),
                    dismissedUpdates: new Set(
                      data.state.dismissedUpdates || [],
                    ),
                  },
                };
              },
              setItem: (name, value) => {
                const str = JSON.stringify({
                  state: {
                    ...value.state,
                    seenUpdates: Array.from(value.state.seenUpdates),
                    dismissedUpdates: Array.from(value.state.dismissedUpdates),
                  },
                });
                localStorage.setItem(name, str);
              },
              removeItem: (name) => localStorage.removeItem(name),
            }
          : undefined,
    },
  ),
);

/**
 * Helper hook to get unread count
 */
export function useUnreadUpdatesCount(allUpdateIds: string[]): number {
  const { seenUpdates, dismissedUpdates } = useUpdatesStore();

  return allUpdateIds.filter(
    (id) => !seenUpdates.has(id) && !dismissedUpdates.has(id),
  ).length;
}

/**
 * Helper hook to check if an update is new/unread
 */
export function useIsUpdateUnread(updateId: string): boolean {
  const { seenUpdates, dismissedUpdates } = useUpdatesStore();
  return !seenUpdates.has(updateId) && !dismissedUpdates.has(updateId);
}
