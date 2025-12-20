/**
 * Workspace Store - Minimal state management for workspaces
 */
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PivotDetectionService } from "../domain/services/PivotDetectionService";
import { VersionService } from "../domain/services/VersionService";
import {
  encryptWorkspace,
  decryptWorkspace,
  isEncryptedWorkspace,
  generateKeyHint,
  type EncryptedWorkspace,
} from "../services/encryptionService";
import { isFirebaseConfigured } from "../services/firebase";
import { authService } from "../services/firebaseAuth";
import { firebaseDatabase } from "../services/firebaseDatabase";
import { groupService } from "../services/groupService";
import { localWorkspaceService } from "../services/localWorkspaceService";
import type { Workspace, CanvasBlockId, ProjectCategory } from "../types";
import { logger } from "../utils/logger";
import { createSlug, withRandomSuffix } from "../utils/slugGenerator";

type EvidenceLinkMap = Record<CanvasBlockId, string[]>;

interface WorkspaceStore {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;

  // Encryption state (held in memory only, never persisted)
  encryptionKey: string | null;
  encryptionEnabled: boolean;
  encryptionKeyHint: string | null;

  // Actions
  loadWorkspace: (code: string) => Promise<void>;
  loadWorkspaces: () => Promise<void>;
  createWorkspace: (data: {
    projectName: string;
    description?: string;
    category?: ProjectCategory;
    classCode?: string;
    stage?: Workspace["stage"];
    tags?: string[];
    location?: Workspace["location"];
    buffaloAffiliated?: boolean;
    /**
     * @deprecated projectType is no longer used. All projects are unified.
     * This parameter is kept for backwards compatibility and will be ignored.
     */
    projectType?: "showcase" | "workspace";
    oneLiner?: string;
    publicLink?: string;
  }) => Promise<Workspace>;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  saveWorkspace: () => Promise<void>;
  saveAndCreateSnapshot: (note?: string) => Promise<boolean>;
  deleteWorkspace: (workspaceCode: string) => Promise<void>;
  publishWorkspace: (workspaceCode: string) => Promise<Workspace>;
  unpublishWorkspace: (workspaceCode: string) => Promise<Workspace>;
  setWorkspace: (workspace: Workspace | null) => void;
  clearWorkspace: () => void;
  clearError: () => void;
  assignClassCode: (workspaceCode: string, classCode?: string | null) => void;
  joinGroupCode: (groupCode: string) => Promise<void>;
  leaveGroupCode: () => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  linkEvidence: (documentId: string, blockId: CanvasBlockId) => void;
  unlinkEvidence: (documentId: string, blockId: CanvasBlockId) => void;

  // Encryption actions
  setEncryptionKey: (key: string | null) => void;
  enableEncryption: (password: string) => Promise<void>;
  disableEncryption: () => Promise<void>;
  decryptCurrentWorkspace: (password: string) => Promise<boolean>;
}

// Initialize domain services
const versionService = new VersionService();
const pivotService = new PivotDetectionService();

// Helper to create store with conditional persistence (only in browser)
const createWorkspaceStore = () => {
  const baseStore: StateCreator<WorkspaceStore> = (set, get) => {
    const generateLocalSlug = (workspace: Workspace): string => {
      const otherSlugs = new Set(
        get()
          .workspaces.filter(
            (entry) => entry.code !== workspace.code && entry.slug,
          )
          .map((entry) => entry.slug as string),
      );

      if (workspace.slug && !otherSlugs.has(workspace.slug)) {
        return workspace.slug;
      }

      const base = createSlug(workspace.projectName) || "project";
      if (!otherSlugs.has(base)) {
        return base;
      }

      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = withRandomSuffix(base);
        if (!otherSlugs.has(candidate)) {
          return candidate;
        }
      }

      return `${base}-${Date.now().toString(36)}`.slice(0, 48);
    };

    return {
      currentWorkspace: null,
      workspaces: [],
      loading: false,
      error: null,

      // Encryption state (never persisted)
      encryptionKey: null,
      encryptionEnabled: false,
      encryptionKeyHint: null,

      loadWorkspace: async (code: string) => {
        set({ loading: true, error: null });
        try {
          let workspace: Workspace | null = null;

          // Special handling for "new" workspace - don't fetch from Firestore
          if (code === "new") {
            // Return null to trigger "workspace not found" and let the editor
            // handle showing creation UI
            set({ currentWorkspace: null, loading: false, error: null });
            return;
          }

          if (isFirebaseConfigured) {
            workspace = await firebaseDatabase.getWorkspace(code);
            if (workspace) {
              localWorkspaceService.saveWorkspace(workspace, {
                markForSync: false,
              });
            }
          }

          if (!workspace) {
            workspace = localWorkspaceService.getWorkspace(code);
          }

          if (workspace) {
            set({ currentWorkspace: workspace, loading: false });
            return;
          }

          set({ error: "Workspace not found", loading: false });
        } catch (error) {
          logger.error("Failed to load workspace", error);
          const fallback = localWorkspaceService.getWorkspace(code);
          if (fallback) {
            set({ currentWorkspace: fallback, loading: false });
          } else {
            set({ error: "Failed to load workspace", loading: false });
          }
        }
      },

      loadWorkspaces: async () => {
        set({ loading: true, error: null });
        try {
          let workspaces: Workspace[] = [];
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            workspaces = await firebaseDatabase.getUserWorkspaces();
            workspaces.forEach((workspace) => {
              localWorkspaceService.saveWorkspace(workspace, {
                markForSync: false,
              });
            });
          } else {
            workspaces = localWorkspaceService.getWorkspaces();
          }

          set({ workspaces, loading: false });
        } catch (error) {
          logger.error("Failed to load workspaces", error);
          const fallback = localWorkspaceService.getWorkspaces();
          if (fallback.length > 0) {
            set({ workspaces: fallback, loading: false });
          } else {
            set({ error: "Failed to load workspaces", loading: false });
          }
        }
      },

      createWorkspace: async (data) => {
        set({ loading: true, error: null });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          let workspace: Workspace;

          if (canUseFirebase) {
            workspace = await firebaseDatabase.createWorkspace(data);
            localWorkspaceService.saveWorkspace(workspace, {
              markForSync: false,
            });
          } else {
            workspace = localWorkspaceService.createWorkspace(data);
          }

          set({
            currentWorkspace: workspace,
            workspaces: [workspace, ...get().workspaces],
            loading: false,
          });
          return workspace;
        } catch (error) {
          logger.error("Failed to create workspace", error);
          try {
            const workspace = localWorkspaceService.createWorkspace(data);
            set({
              currentWorkspace: workspace,
              workspaces: [workspace, ...get().workspaces],
              loading: false,
              error: "Network issue detected. Workspace saved locally.",
            });
            return workspace;
          } catch (fallbackError) {
            set({ error: "Failed to create workspace", loading: false });
            throw fallbackError;
          }
        }
      },

      updateWorkspace: (updates) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return;
        }

        const updated = {
          ...currentWorkspace,
          ...updates,
          lastModified: new Date().toISOString(),
        };
        set((state) => ({
          currentWorkspace: updated,
          workspaces: state.workspaces.map((workspace) =>
            workspace.code === updated.code
              ? { ...workspace, ...updates, lastModified: updated.lastModified }
              : workspace,
          ),
        }));
      },

      saveWorkspace: async () => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return;
        }

        set({ loading: true });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(currentWorkspace);
            localWorkspaceService.saveWorkspace(currentWorkspace, {
              markForSync: false,
            });
          } else {
            localWorkspaceService.saveWorkspace(currentWorkspace);
          }
          set({ loading: false });
        } catch (error) {
          logger.error("Failed to save workspace", error);
          localWorkspaceService.saveWorkspace(currentWorkspace);
          set({
            error: "Network issue. Workspace saved locally.",
            loading: false,
          });
        }
      },

      saveAndCreateSnapshot: async (note) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return false;
        }

        set({ loading: true });
        let updatedWorkspace: Workspace | null = null;
        try {
          const snapshotNote = note?.trim();
          const newVersion = versionService.createSnapshot(
            currentWorkspace.bmcData,
            currentWorkspace.description ||
              currentWorkspace.projectDescription ||
              "",
            snapshotNote && snapshotNote.length > 0 ? snapshotNote : undefined,
          );

          const versions = currentWorkspace.versions || [];
          const pivots = currentWorkspace.pivots || [];
          let pivotDetected = false;

          if (versions.length > 0) {
            const previousVersion = versions[versions.length - 1]!;
            const pivot = pivotService.detectPivot(
              previousVersion.bmcData,
              currentWorkspace.bmcData,
              previousVersion.id,
              newVersion.id,
            );

            if (pivot) {
              pivots.push(pivot);
              pivotDetected = true;
            }
          }

          const updatedVersions = [...versions, newVersion];
          const trimmedVersions = updatedVersions.slice(-50);

          // Create journal entry automatically when snapshot is saved
          const journal = currentWorkspace.journal || [];
          const journalEntry = {
            id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: new Date().toISOString(),
            content: snapshotNote || `Snapshot ${newVersion.snapshot} saved`,
            linkedVersion: newVersion.id,
          };

          updatedWorkspace = {
            ...currentWorkspace,
            versions: trimmedVersions,
            pivots,
            journal: [...journal, journalEntry],
            lastModified: new Date().toISOString(),
          } as Workspace;

          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(updatedWorkspace);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }
          set({ currentWorkspace: updatedWorkspace, loading: false });
          return pivotDetected;
        } catch (error) {
          logger.error("Failed to save snapshot", error);
          const workspaceToPersist = updatedWorkspace ?? currentWorkspace;
          if (workspaceToPersist) {
            localWorkspaceService.saveWorkspace(workspaceToPersist);
          }
          set({
            currentWorkspace: workspaceToPersist,
            error: "Network issue. Snapshot saved locally.",
            loading: false,
          });
          return false;
        }
      },

      deleteWorkspace: async (workspaceCode) => {
        set({ loading: true, error: null });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            await firebaseDatabase.deleteWorkspace(workspaceCode);
          }

          // Always remove from local storage
          localWorkspaceService.deleteWorkspace(workspaceCode);

          // Remove from state
          set((state) => ({
            currentWorkspace:
              state.currentWorkspace?.code === workspaceCode
                ? null
                : state.currentWorkspace,
            workspaces: state.workspaces.filter(
              (workspace) => workspace.code !== workspaceCode,
            ),
            loading: false,
          }));
        } catch (error) {
          logger.error("Failed to delete workspace", error);
          set({ loading: false, error: "Failed to delete workspace" });
          throw error;
        }
      },

      publishWorkspace: async (workspaceCode) => {
        set({ loading: true, error: null });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          let updatedWorkspace: Workspace;

          if (canUseFirebase) {
            updatedWorkspace =
              await firebaseDatabase.publishWorkspace(workspaceCode);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            const { currentWorkspace, workspaces } = get();
            const target =
              currentWorkspace?.code === workspaceCode
                ? currentWorkspace
                : workspaces.find(
                    (workspace) => workspace.code === workspaceCode,
                  );

            if (!target) {
              throw new Error("Workspace not found");
            }

            const now = new Date().toISOString();
            const slug = generateLocalSlug(target);
            updatedWorkspace = {
              ...target,
              slug,
              isPublic: true,
              publishedAt: Date.now(),
              lastModified: now,
            };
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }

          set((state) => ({
            currentWorkspace:
              state.currentWorkspace?.code === workspaceCode
                ? updatedWorkspace
                : state.currentWorkspace,
            workspaces: state.workspaces.map((workspace) =>
              workspace.code === workspaceCode ? updatedWorkspace : workspace,
            ),
            loading: false,
          }));

          return updatedWorkspace;
        } catch (error) {
          logger.error("Failed to publish workspace", error);
          set({ loading: false, error: "Failed to publish workspace" });
          throw error;
        }
      },

      unpublishWorkspace: async (workspaceCode) => {
        set({ loading: true, error: null });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          let updatedWorkspace: Workspace;

          if (canUseFirebase) {
            updatedWorkspace =
              await firebaseDatabase.unpublishWorkspace(workspaceCode);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            const { currentWorkspace, workspaces } = get();
            const target =
              currentWorkspace?.code === workspaceCode
                ? currentWorkspace
                : workspaces.find(
                    (workspace) => workspace.code === workspaceCode,
                  );

            if (!target) {
              throw new Error("Workspace not found");
            }

            const now = new Date().toISOString();
            updatedWorkspace = {
              ...target,
              isPublic: false,
              publishedAt: undefined,
              lastModified: now,
            };
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }

          set((state) => ({
            currentWorkspace:
              state.currentWorkspace?.code === workspaceCode
                ? updatedWorkspace
                : state.currentWorkspace,
            workspaces: state.workspaces.map((workspace) =>
              workspace.code === workspaceCode ? updatedWorkspace : workspace,
            ),
            loading: false,
          }));

          return updatedWorkspace;
        } catch (error) {
          logger.error("Failed to unpublish workspace", error);
          set({ loading: false, error: "Failed to unpublish workspace" });
          throw error;
        }
      },

      restoreVersion: async (versionId) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return;
        }

        const version = currentWorkspace.versions.find(
          (entry) => entry.id === versionId,
        );
        if (!version) {
          logger.warn("Requested version not found", versionId);
          return;
        }

        const updatedWorkspace: Workspace = {
          ...currentWorkspace,
          bmcData: { ...version.bmcData },
          projectDescription: version.projectDescription,
          lastModified: new Date().toISOString(),
        };

        set({ loading: true });
        try {
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();
          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(updatedWorkspace);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }

          set({ currentWorkspace: updatedWorkspace, loading: false });
        } catch (error) {
          logger.error("Failed to restore workspace version", error);
          localWorkspaceService.saveWorkspace(updatedWorkspace);
          set({
            currentWorkspace: updatedWorkspace,
            loading: false,
            error: "Network issue. Restored version saved locally.",
          });
        }
      },

      linkEvidence: (documentId, blockId) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return;
        }

        const existingLinks = currentWorkspace.evidenceLinks ?? {};
        const currentDocIds = new Set(existingLinks[blockId] ?? []);
        currentDocIds.add(documentId);

        const documents = currentWorkspace.documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                linkedFields: Array.from(
                  new Set([...(doc.linkedFields ?? []), blockId]),
                ),
              }
            : doc,
        );

        const nextLinks: EvidenceLinkMap = {
          ...(existingLinks as EvidenceLinkMap),
          [blockId]: Array.from(currentDocIds),
        };

        get().updateWorkspace({
          documents,
          evidenceLinks: nextLinks,
        });
      },

      unlinkEvidence: (documentId, blockId) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return;
        }

        const existingLinks = currentWorkspace.evidenceLinks ?? {};
        const docIds = new Set(existingLinks[blockId] ?? []);
        if (!docIds.has(documentId)) {
          return;
        }
        docIds.delete(documentId);

        const nextLinks: EvidenceLinkMap = {
          ...(existingLinks as EvidenceLinkMap),
        };
        if (docIds.size > 0) {
          nextLinks[blockId] = Array.from(docIds);
        } else {
          delete nextLinks[blockId];
        }

        const documents = currentWorkspace.documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                linkedFields: (doc.linkedFields ?? []).filter(
                  (field) => field !== blockId,
                ),
              }
            : doc,
        );

        get().updateWorkspace({ documents, evidenceLinks: nextLinks });
      },

      // Encryption actions
      setEncryptionKey: (key) => {
        if (key) {
          set({
            encryptionKey: key,
            encryptionEnabled: true,
            encryptionKeyHint: generateKeyHint(key),
          });
        } else {
          set({
            encryptionKey: null,
            encryptionEnabled: false,
            encryptionKeyHint: null,
          });
        }
      },

      enableEncryption: async (password) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          throw new Error("No workspace to encrypt");
        }

        set({ loading: true, error: null });
        try {
          // Set encryption key
          get().setEncryptionKey(password);

          // Mark workspace as encrypted and save
          const encryptedWorkspace = {
            ...currentWorkspace,
            isEncrypted: true,
            encryptionKeyHint: generateKeyHint(password),
            lastModified: new Date().toISOString(),
          };

          // Encrypt and save to Firebase
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            const encrypted = encryptWorkspace(
              encryptedWorkspace,
              password,
            ) as unknown as Workspace;
            await firebaseDatabase.saveWorkspace(encrypted);
          }

          // Save unencrypted to local for offline access
          localWorkspaceService.saveWorkspace(encryptedWorkspace);

          set({
            currentWorkspace: encryptedWorkspace,
            loading: false,
          });

          logger.info("Workspace encryption enabled", {
            code: currentWorkspace.code,
          });
        } catch (error) {
          logger.error("Failed to enable encryption", error);
          get().setEncryptionKey(null);
          set({
            error: "Failed to enable encryption",
            loading: false,
          });
          throw error;
        }
      },

      disableEncryption: async () => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          throw new Error("No workspace to decrypt");
        }

        set({ loading: true, error: null });
        try {
          // Remove encryption markers
          const decryptedWorkspace = {
            ...currentWorkspace,
            isEncrypted: false,
            encryptionKeyHint: undefined,
            lastModified: new Date().toISOString(),
          };

          // Save unencrypted to Firebase
          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(decryptedWorkspace);
          }

          localWorkspaceService.saveWorkspace(decryptedWorkspace);

          // Clear encryption key
          get().setEncryptionKey(null);

          set({
            currentWorkspace: decryptedWorkspace,
            loading: false,
          });

          logger.info("Workspace encryption disabled", {
            code: currentWorkspace.code,
          });
        } catch (error) {
          logger.error("Failed to disable encryption", error);
          set({
            error: "Failed to disable encryption",
            loading: false,
          });
          throw error;
        }
      },

      decryptCurrentWorkspace: async (password) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          return Promise.resolve(false);
        }

        // Check if workspace needs decryption
        if (isEncryptedWorkspace(currentWorkspace)) {
          try {
            const decrypted = decryptWorkspace(
              currentWorkspace as unknown as EncryptedWorkspace,
              password,
            );
            get().setEncryptionKey(password);
            set({ currentWorkspace: decrypted });
            return true;
          } catch (error) {
            logger.error("Failed to decrypt workspace", error);
            return false;
          }
        }

        // Not encrypted, just set the key for future saves
        get().setEncryptionKey(password);
        return true;
      },

      setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      clearWorkspace: () => set({ currentWorkspace: null, error: null }),
      clearError: () => set({ error: null }),
      assignClassCode: (workspaceCode, classCode) => {
        const { currentWorkspace, workspaces } = get();
        const timestamp = new Date().toISOString();

        const updatedWorkspaces = workspaces.map((workspace) => {
          if (workspace.code !== workspaceCode) {
            return workspace;
          }
          return {
            ...workspace,
            ...(classCode ? { classCode } : {}),
            lastModified: timestamp,
          };
        });

        let updatedCurrentWorkspace = currentWorkspace;

        if (currentWorkspace?.code === workspaceCode) {
          updatedCurrentWorkspace = {
            ...currentWorkspace,
            ...(classCode ? { classCode } : {}),
            lastModified: timestamp,
          };
        }

        if (updatedCurrentWorkspace) {
          localWorkspaceService.saveWorkspace(updatedCurrentWorkspace);
        } else {
          const workspaceToPersist = updatedWorkspaces.find(
            (workspace) => workspace.code === workspaceCode,
          );
          if (workspaceToPersist) {
            localWorkspaceService.saveWorkspace(workspaceToPersist);
          }
        }

        set({
          currentWorkspace: updatedCurrentWorkspace ?? currentWorkspace,
          workspaces: updatedWorkspaces,
        });
      },

      joinGroupCode: async (groupCode: string) => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          throw new Error("No workspace to join group");
        }

        set({ loading: true, error: null });
        try {
          const timestamp = new Date().toISOString();

          // When joining a group, disable encryption so leader can view
          // Keep project private - only visible to owner and group leader
          const updatedWorkspace: Workspace = {
            ...currentWorkspace,
            classCode: groupCode,
            isPublic: false, // Group projects stay private
            isEncrypted: false,
            encryptionKeyHint: undefined,
            lastModified: timestamp,
          };

          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(updatedWorkspace);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }

          // Clear encryption key since we disabled encryption
          get().setEncryptionKey(null);

          // Add user to group's memberIds for Firestore rules
          const currentUser = authService.getCurrentUser();
          if (currentUser?.uid) {
            await groupService.joinGroup(groupCode, {
              workspaceCode: currentWorkspace.code,
              projectName: currentWorkspace.projectName,
              joinedAt: timestamp,
              lastActivity: timestamp,
              status: "active",
            });
          }

          set((state) => ({
            currentWorkspace: updatedWorkspace,
            workspaces: state.workspaces.map((ws) =>
              ws.code === currentWorkspace.code ? updatedWorkspace : ws
            ),
            loading: false,
          }));

          logger.info("Workspace joined group", {
            workspaceCode: currentWorkspace.code,
            groupCode,
          });
        } catch (error) {
          logger.error("Failed to join group", error);
          set({ error: "Failed to join group", loading: false });
          throw error;
        }
      },

      leaveGroupCode: async () => {
        const { currentWorkspace } = get();
        if (!currentWorkspace) {
          throw new Error("No workspace to leave group");
        }

        const groupCode = currentWorkspace.classCode;
        if (!groupCode) {
          return; // Not in a group
        }

        set({ loading: true, error: null });
        try {
          const timestamp = new Date().toISOString();

          const updatedWorkspace: Workspace = {
            ...currentWorkspace,
            classCode: undefined,
            lastModified: timestamp,
          };

          const canUseFirebase =
            isFirebaseConfigured && authService.isAuthenticated();

          if (canUseFirebase) {
            await firebaseDatabase.saveWorkspace(updatedWorkspace);
            localWorkspaceService.saveWorkspace(updatedWorkspace, {
              markForSync: false,
            });
          } else {
            localWorkspaceService.saveWorkspace(updatedWorkspace);
          }

          // Remove from group's members
          await groupService.leaveGroup(groupCode, currentWorkspace.code);

          set((state) => ({
            currentWorkspace: updatedWorkspace,
            workspaces: state.workspaces.map((ws) =>
              ws.code === currentWorkspace.code ? updatedWorkspace : ws
            ),
            loading: false,
          }));

          logger.info("Workspace left group", {
            workspaceCode: currentWorkspace.code,
          });
        } catch (error) {
          logger.error("Failed to leave group", error);
          set({ error: "Failed to leave group", loading: false });
          throw error;
        }
      },
    };
  };

  // Only use persistence in the browser (not during SSR/SSG)
  if (typeof window === "undefined") {
    return create<WorkspaceStore>()(baseStore);
  }

  return create<WorkspaceStore>()(
    persist(baseStore, {
      name: "buffalo-workspace",
      version: 3, // Increment when schema changes
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        workspaces: state.workspaces,
        // Note: encryptionKey, encryptionEnabled, encryptionKeyHint are
        // intentionally NOT persisted for security reasons
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Handle schema migrations for backward compatibility
        const state = persistedState as Record<string, unknown>;
        if (version === 0) {
          // v0 -> v1: Add evidenceLinks if missing
          const migratedState = { ...state };
          const currentWorkspace = migratedState["currentWorkspace"] as Record<
            string,
            unknown
          > | null;
          if (currentWorkspace && !currentWorkspace["evidenceLinks"]) {
            currentWorkspace["evidenceLinks"] = {};
          }
          const workspaces = migratedState["workspaces"] as
            | Array<Record<string, unknown>>
            | undefined;
          if (workspaces) {
            migratedState["workspaces"] = workspaces.map((ws) => ({
              ...ws,
              evidenceLinks: ws["evidenceLinks"] || {},
            }));
          }
          return migratedState as unknown as WorkspaceStore;
        }
        if (version === 1) {
          // v1 -> v2: Remove deprecated projectType field
          const migratedState = { ...state };
          const currentWorkspace = migratedState["currentWorkspace"] as Record<
            string,
            unknown
          > | null;
          if (currentWorkspace) {
            const { projectType: _projectType, ...rest } = currentWorkspace;
            migratedState["currentWorkspace"] = rest;
          }
          const workspaces = migratedState["workspaces"] as
            | Array<Record<string, unknown>>
            | undefined;
          if (workspaces) {
            migratedState["workspaces"] = workspaces.map((ws) => {
              const { projectType: _projectType, ...rest } = ws;
              return rest;
            });
          }
          return migratedState as unknown as WorkspaceStore;
        }
        if (version === 2) {
          // v2 -> v3: Migrate lookingFor to asks
          const migratedState = { ...state };
          const currentWorkspace = migratedState["currentWorkspace"] as Record<
            string,
            unknown
          > | null;
          if (currentWorkspace && currentWorkspace["lookingFor"] && !currentWorkspace["asks"]) {
            currentWorkspace["asks"] = currentWorkspace["lookingFor"];
          }
          const workspaces = migratedState["workspaces"] as
            | Array<Record<string, unknown>>
            | undefined;
          if (workspaces) {
            migratedState["workspaces"] = workspaces.map((ws) => {
              if (ws["lookingFor"] && !ws["asks"]) {
                return { ...ws, asks: ws["lookingFor"] };
              }
              return ws;
            });
          }
          return migratedState as unknown as WorkspaceStore;
        }
        return state as unknown as WorkspaceStore;
      },
      onRehydrateStorage: () => {
        logger.info("Workspace store hydration started");
        return (state, error) => {
          if (error) {
            logger.error("Workspace store hydration failed:", error);
            // Don't clear storage automatically - let user recover data
            logger.warn(
              "Corrupted workspace data detected. Please contact support if issues persist.",
            );
          } else if (state) {
            logger.info("Workspace store hydrated successfully", {
              workspaceCount: state.workspaces?.length || 0,
              hasCurrentWorkspace: !!state.currentWorkspace,
            });
          }
        };
      },
    }),
  );
};

export const useWorkspaceStore = createWorkspaceStore();
