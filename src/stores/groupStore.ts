import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { groupService } from "@/services/groupService";
import type { Group, GroupMember } from "@/types";
import { logger } from "@/utils/logger";

interface CreateGroupInput {
  name: string;
  description?: string;
  semester?: string;
  institution?: string;
}

interface GroupStore {
  groups: Group[];
  loading: boolean;
  error: string | null;
  pendingGroupCode: string | null;
  loadGroups: () => Promise<void>;
  createGroup: (input: CreateGroupInput) => Promise<Group>;
  joinGroup: (groupCode: string, member: GroupMember) => Promise<Group | null>;
  leaveGroup: (
    groupCode: string,
    workspaceCode: string,
  ) => Promise<Group | null>;
  setPendingGroupCode: (code: string | null) => void;
  clearError: () => void;
}

// Helper to create store with conditional persistence (only in browser)
const createGroupStore = () => {
  const baseStore: StateCreator<GroupStore> = (set, _get) => ({
    groups: [],
    loading: false,
    error: null,
    pendingGroupCode: null,

    loadGroups: async () => {
      set({ loading: true, error: null });
      try {
        const groups = await groupService.getGroups();
        set({ groups, loading: false });
      } catch (error) {
        logger.error("Failed to load groups", error);
        set({ loading: false, error: "Unable to load groups right now." });
      }
    },

    createGroup: async (input) => {
      set({ loading: true, error: null });
      try {
        const group = await groupService.createGroup(input);
        set((state) => ({
          groups: [group, ...state.groups.filter((g) => g.code !== group.code)],
          loading: false,
        }));
        return group;
      } catch (error) {
        logger.error("Failed to create group", error);
        set({ loading: false, error: "Unable to create group." });
        throw error;
      }
    },

    joinGroup: async (groupCode, member) => {
      set({ loading: true, error: null });
      try {
        const updatedGroup = await groupService.joinGroup(groupCode, member);
        if (updatedGroup) {
          set((state) => ({
            groups: state.groups
              .filter((group) => group.code !== updatedGroup.code)
              .concat(updatedGroup)
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              ),
            loading: false,
          }));
        } else {
          set({ loading: false });
        }
        return updatedGroup;
      } catch (error) {
        logger.error("Failed to join group", error);
        set({ loading: false, error: "Unable to join group." });
        return null;
      }
    },

    leaveGroup: async (groupCode, workspaceCode) => {
      set({ loading: true, error: null });
      try {
        const updatedGroup = await groupService.leaveGroup(
          groupCode,
          workspaceCode,
        );
        if (updatedGroup) {
          set((state) => ({
            groups: state.groups
              .map((group) =>
                group.code === updatedGroup.code ? updatedGroup : group,
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              ),
            loading: false,
          }));
        } else {
          set({ loading: false });
        }
        return updatedGroup;
      } catch (error) {
        logger.error("Failed to leave group", error);
        set({ loading: false, error: "Unable to update group membership." });
        return null;
      }
    },

    setPendingGroupCode: (code) => set({ pendingGroupCode: code }),
    clearError: () => set({ error: null }),
  });

  // Only use persistence in the browser (not during SSR/SSG)
  if (typeof window === "undefined") {
    return create<GroupStore>()(baseStore);
  }

  return create<GroupStore>()(
    persist(baseStore, {
      name: "buffalo-group-store",
      partialize: (state) => ({
        groups: state.groups,
        pendingGroupCode: state.pendingGroupCode,
      }),
    }),
  );
};

export const useGroupStore = createGroupStore();
export default useGroupStore;
