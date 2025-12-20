/**
 * Publish Form Context
 *
 * Centralized state management for the publish page using useReducer.
 * Replaces 20+ useState hooks with a single, type-safe state container.
 *
 * Features:
 * - Type-safe actions for all form updates
 * - Dirty state tracking (compares to initial workspace)
 * - Loading/saving states
 * - Crop modal state management
 */

"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace, ProjectCategory, ProjectStage } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface TeamMember {
  name: string;
  role: string;
  linkedin?: string;
}

export interface PublishFormState {
  // Basics Section
  projectName: string;
  oneLiner: string;
  description: string;
  category: ProjectCategory;
  stage: ProjectStage;
  tags: string[];

  // Visual Media Section
  coverImage: string | null;
  screenshots: string[];
  demoVideoUrl: string;

  // Links Section
  demoUrl: string;
  githubUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  linkedinUrl: string;

  // Community Section (Gives & Asks)
  asks: string[];
  gives: string[];

  // Team Section
  collaborators: TeamMember[];
  acknowledgments: string;

  // UI State
  isPublic: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isUploading: boolean;
  uploadProgress: number;

  // Crop Modal State
  cropModal: {
    isOpen: boolean;
    imageFile: File | null;
    imageType: "cover" | "screenshot";
  };

  // Section Expansion State (for collapsibles)
  expandedSections: {
    basics: boolean;
    media: boolean;
    links: boolean;
    community: boolean;
    team: boolean;
  };
}

// Action types for the reducer
type PublishFormAction =
  // Basic field updates
  | { type: "SET_PROJECT_NAME"; payload: string }
  | { type: "SET_ONE_LINER"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_CATEGORY"; payload: ProjectCategory }
  | { type: "SET_STAGE"; payload: ProjectStage }
  // Tags
  | { type: "ADD_TAG"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  // Media
  | { type: "SET_COVER_IMAGE"; payload: string | null }
  | { type: "ADD_SCREENSHOT"; payload: string }
  | { type: "REMOVE_SCREENSHOT"; payload: string }
  | { type: "SET_VIDEO_URL"; payload: string }
  // Links
  | { type: "SET_DEMO_URL"; payload: string }
  | { type: "SET_GITHUB_URL"; payload: string }
  | { type: "SET_WEBSITE_URL"; payload: string }
  | { type: "SET_TWITTER_URL"; payload: string }
  | { type: "SET_LINKEDIN_URL"; payload: string }
  // Community
  | { type: "ADD_ASK"; payload: string }
  | { type: "REMOVE_ASK"; payload: string }
  | { type: "ADD_GIVE"; payload: string }
  | { type: "REMOVE_GIVE"; payload: string }
  // Team
  | { type: "ADD_COLLABORATOR"; payload: TeamMember }
  | {
      type: "UPDATE_COLLABORATOR";
      payload: { index: number; member: TeamMember };
    }
  | { type: "REMOVE_COLLABORATOR"; payload: number }
  | { type: "SET_ACKNOWLEDGMENTS"; payload: string }
  // UI State
  | { type: "SET_IS_PUBLIC"; payload: boolean }
  | { type: "SET_IS_SAVING"; payload: boolean }
  | { type: "SET_IS_UPLOADING"; payload: boolean }
  | { type: "SET_UPLOAD_PROGRESS"; payload: number }
  | { type: "SET_IS_DIRTY"; payload: boolean }
  // Crop Modal
  | {
      type: "OPEN_CROP_MODAL";
      payload: { file: File; imageType: "cover" | "screenshot" };
    }
  | { type: "CLOSE_CROP_MODAL" }
  // Section Expansion
  | {
      type: "TOGGLE_SECTION";
      payload: keyof PublishFormState["expandedSections"];
    }
  // Bulk update (for reloading from workspace)
  | { type: "RESET_FROM_WORKSPACE"; payload: Workspace };

// ============================================================================
// Initial State Factory
// ============================================================================

export function createInitialState(workspace: Workspace): PublishFormState {
  return {
    // Basics
    projectName: workspace.projectName || "Untitled",
    oneLiner: workspace.oneLiner || "",
    description: workspace.projectDescription || "",
    category: workspace.category || "other",
    stage: workspace.stage || "idea",
    tags: workspace.tags || [],

    // Media
    coverImage: workspace.assets?.coverImage || null,
    screenshots: workspace.assets?.screenshots || [],
    demoVideoUrl: workspace.embeds?.youtube?.url || "",

    // Links
    demoUrl: workspace.embeds?.demo || "",
    githubUrl: workspace.embeds?.github?.repoUrl || "",
    websiteUrl: workspace.embeds?.website || "",
    twitterUrl: workspace.socialLinks?.twitter || "",
    linkedinUrl: workspace.socialLinks?.linkedin || "",

    // Community (support deprecated lookingFor)
    asks: workspace.asks || workspace.lookingFor || [],
    gives: workspace.gives || [],

    // Team
    collaborators: workspace.teamMembers || [],
    acknowledgments: workspace.acknowledgments || "",

    // UI State
    isPublic: workspace.isPublic || false,
    isDirty: false,
    isSaving: false,
    isUploading: false,
    uploadProgress: 0,

    // Crop Modal
    cropModal: {
      isOpen: false,
      imageFile: null,
      imageType: "cover",
    },

    // Sections - basics always expanded, others collapsed
    expandedSections: {
      basics: true,
      media: false,
      links: false,
      community: false,
      team: false,
    },
  };
}

// ============================================================================
// Reducer
// ============================================================================

function publishFormReducer(
  state: PublishFormState,
  action: PublishFormAction,
): PublishFormState {
  // Helper to mark dirty
  const markDirty = (
    newState: Partial<PublishFormState>,
  ): PublishFormState => ({
    ...state,
    ...newState,
    isDirty: true,
  });

  switch (action.type) {
    // Basics
    case "SET_PROJECT_NAME":
      return markDirty({ projectName: action.payload });
    case "SET_ONE_LINER":
      return markDirty({ oneLiner: action.payload });
    case "SET_DESCRIPTION":
      return markDirty({ description: action.payload });
    case "SET_CATEGORY":
      return markDirty({ category: action.payload });
    case "SET_STAGE":
      return markDirty({ stage: action.payload });

    // Tags
    case "ADD_TAG": {
      const trimmed = action.payload.trim();
      if (!trimmed || state.tags.includes(trimmed)) {
        return state;
      }
      return markDirty({ tags: [...state.tags, trimmed] });
    }
    case "REMOVE_TAG":
      return markDirty({
        tags: state.tags.filter((t) => t !== action.payload),
      });

    // Media
    case "SET_COVER_IMAGE":
      return markDirty({ coverImage: action.payload });
    case "ADD_SCREENSHOT":
      return markDirty({ screenshots: [...state.screenshots, action.payload] });
    case "REMOVE_SCREENSHOT":
      return markDirty({
        screenshots: state.screenshots.filter((s) => s !== action.payload),
      });
    case "SET_VIDEO_URL":
      return markDirty({ demoVideoUrl: action.payload });

    // Links
    case "SET_DEMO_URL":
      return markDirty({ demoUrl: action.payload });
    case "SET_GITHUB_URL":
      return markDirty({ githubUrl: action.payload });
    case "SET_WEBSITE_URL":
      return markDirty({ websiteUrl: action.payload });
    case "SET_TWITTER_URL":
      return markDirty({ twitterUrl: action.payload });
    case "SET_LINKEDIN_URL":
      return markDirty({ linkedinUrl: action.payload });

    // Community
    case "ADD_ASK": {
      const trimmed = action.payload.trim();
      if (!trimmed || state.asks.includes(trimmed)) {
        return state;
      }
      return markDirty({ asks: [...state.asks, trimmed] });
    }
    case "REMOVE_ASK":
      return markDirty({
        asks: state.asks.filter((a) => a !== action.payload),
      });
    case "ADD_GIVE": {
      const trimmed = action.payload.trim();
      if (!trimmed || state.gives.includes(trimmed)) {
        return state;
      }
      return markDirty({ gives: [...state.gives, trimmed] });
    }
    case "REMOVE_GIVE":
      return markDirty({
        gives: state.gives.filter((g) => g !== action.payload),
      });

    // Team
    case "ADD_COLLABORATOR":
      return markDirty({
        collaborators: [...state.collaborators, action.payload],
      });
    case "UPDATE_COLLABORATOR": {
      const newCollaborators = [...state.collaborators];
      newCollaborators[action.payload.index] = action.payload.member;
      return markDirty({ collaborators: newCollaborators });
    }
    case "REMOVE_COLLABORATOR":
      return markDirty({
        collaborators: state.collaborators.filter(
          (_, i) => i !== action.payload,
        ),
      });
    case "SET_ACKNOWLEDGMENTS":
      return markDirty({ acknowledgments: action.payload });

    // UI State (don't mark dirty)
    case "SET_IS_PUBLIC":
      return markDirty({ isPublic: action.payload });
    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_IS_UPLOADING":
      return { ...state, isUploading: action.payload };
    case "SET_UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "SET_IS_DIRTY":
      return { ...state, isDirty: action.payload };

    // Crop Modal
    case "OPEN_CROP_MODAL":
      return {
        ...state,
        cropModal: {
          isOpen: true,
          imageFile: action.payload.file,
          imageType: action.payload.imageType,
        },
      };
    case "CLOSE_CROP_MODAL":
      return {
        ...state,
        cropModal: {
          isOpen: false,
          imageFile: null,
          imageType: "cover",
        },
      };

    // Section Toggle
    case "TOGGLE_SECTION":
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.payload]: !state.expandedSections[action.payload],
        },
      };

    // Reset from workspace (after save or reload)
    case "RESET_FROM_WORKSPACE":
      return {
        ...createInitialState(action.payload),
        expandedSections: state.expandedSections, // Preserve UI state
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface PublishFormContextValue {
  state: PublishFormState;
  dispatch: React.Dispatch<PublishFormAction>;
  // Convenience methods
  save: (shouldPublish?: boolean) => Promise<void>;
  openCropModal: (file: File, imageType: "cover" | "screenshot") => void;
  closeCropModal: () => void;
  handleCropComplete: (croppedFile: File) => Promise<void>;
  workspace: Workspace;
}

const PublishFormContext = createContext<PublishFormContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface PublishFormProviderProps {
  workspace: Workspace;
  children: ReactNode;
}

export function PublishFormProvider({
  workspace,
  children,
}: PublishFormProviderProps) {
  const [state, dispatch] = useReducer(
    publishFormReducer,
    workspace,
    createInitialState,
  );

  const updateWorkspace = useWorkspaceStore((s) => s.updateWorkspace);
  const saveWorkspace = useWorkspaceStore((s) => s.saveWorkspace);
  const loadWorkspace = useWorkspaceStore((s) => s.loadWorkspace);

  // Save handler
  const save = useCallback(
    async (shouldPublish?: boolean) => {
      const publishState = shouldPublish ?? state.isPublic;
      dispatch({ type: "SET_IS_SAVING", payload: true });

      try {
        // Generate slug if publishing and none exists
        const slug =
          publishState && !workspace.slug
            ? state.projectName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || `project-${workspace.code}`
            : workspace.slug;

        // Build the update object
        updateWorkspace({
          projectName: state.projectName.trim(),
          oneLiner: state.oneLiner.trim(),
          projectDescription: state.description.trim(),
          category: state.category,
          stage: state.stage,
          tags: state.tags.filter((t) => t.trim()),
          isPublic: publishState,
          ...(slug ? { slug } : {}),

          // Media & Links
          embeds: {
            ...workspace.embeds,
            ...(state.demoVideoUrl
              ? { youtube: { url: state.demoVideoUrl } }
              : {}),
            ...(state.demoUrl ? { demo: state.demoUrl } : {}),
            ...(state.githubUrl
              ? { github: { repoUrl: state.githubUrl } }
              : {}),
            ...(state.websiteUrl ? { website: state.websiteUrl } : {}),
          },

          socialLinks: {
            ...(state.twitterUrl ? { twitter: state.twitterUrl } : {}),
            ...(state.linkedinUrl ? { linkedin: state.linkedinUrl } : {}),
          },

          // Community
          asks: state.asks.filter((a) => a.trim()),
          gives: state.gives.filter((g) => g.trim()),

          // Team
          teamMembers: state.collaborators.filter(
            (c) => c.name.trim() && c.role.trim(),
          ),
          acknowledgments: state.acknowledgments.trim(),
        });

        await saveWorkspace();

        toast.success(
          publishState ? "Project published successfully!" : "Changes saved",
          {
            description: publishState
              ? "Your project is now visible in the community gallery"
              : "Your changes have been saved",
          },
        );

        dispatch({ type: "SET_IS_DIRTY", payload: false });
      } catch (error) {
        console.error("Failed to save:", error);
        toast.error("Failed to save changes", {
          description: "Please try again",
        });
      } finally {
        dispatch({ type: "SET_IS_SAVING", payload: false });
      }
    },
    [state, workspace, updateWorkspace, saveWorkspace],
  );

  // Crop modal handlers
  const openCropModal = useCallback(
    (file: File, imageType: "cover" | "screenshot") => {
      dispatch({ type: "OPEN_CROP_MODAL", payload: { file, imageType } });
    },
    [],
  );

  const closeCropModal = useCallback(() => {
    dispatch({ type: "CLOSE_CROP_MODAL" });
  }, []);

  const handleCropComplete = useCallback(
    async (croppedFile: File) => {
      dispatch({ type: "SET_IS_UPLOADING", payload: true });
      dispatch({ type: "SET_UPLOAD_PROGRESS", payload: 0 });

      try {
        const { firebaseDatabase } = await import(
          "@/services/firebaseDatabase"
        );

        if (state.cropModal.imageType === "cover") {
          await firebaseDatabase.uploadCoverImage(workspace.code, croppedFile, {
            onProgress: (progress) =>
              dispatch({ type: "SET_UPLOAD_PROGRESS", payload: progress }),
          });
        } else {
          await firebaseDatabase.uploadProjectImage(
            workspace.code,
            croppedFile,
            {
              onProgress: (progress) =>
                dispatch({ type: "SET_UPLOAD_PROGRESS", payload: progress }),
            },
          );
        }

        // Reload workspace to get updated URLs
        await loadWorkspace(workspace.code);

        toast.success(
          state.cropModal.imageType === "cover"
            ? "Cover image uploaded!"
            : "Screenshot uploaded!",
        );
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        dispatch({ type: "SET_IS_UPLOADING", payload: false });
        dispatch({ type: "SET_UPLOAD_PROGRESS", payload: 0 });
        closeCropModal();
      }
    },
    [workspace.code, state.cropModal.imageType, loadWorkspace, closeCropModal],
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      save,
      openCropModal,
      closeCropModal,
      handleCropComplete,
      workspace,
    }),
    [
      state,
      dispatch,
      save,
      openCropModal,
      closeCropModal,
      handleCropComplete,
      workspace,
    ],
  );

  return (
    <PublishFormContext.Provider value={value}>
      {children}
    </PublishFormContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function usePublishForm() {
  const context = useContext(PublishFormContext);
  if (!context) {
    throw new Error("usePublishForm must be used within PublishFormProvider");
  }
  return context;
}

// ============================================================================
// Constants (exported for sections to use)
// ============================================================================

export const CATEGORY_OPTIONS: Array<{
  value: ProjectCategory;
  label: string;
}> = [
  { value: "startup", label: "Startup" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "indie", label: "Indie" },
  { value: "open-source", label: "Open Source" },
  { value: "creative", label: "Creative" },
  { value: "other", label: "Other" },
];

export const TAG_SUGGESTIONS = [
  "AI",
  "SaaS",
  "Climate",
  "EdTech",
  "HealthTech",
  "FinTech",
  "E-commerce",
  "Manufacturing",
  "Nonprofit",
  "Hardware",
  "Mobile",
  "Web3",
  "Analytics",
  "Infrastructure",
];
