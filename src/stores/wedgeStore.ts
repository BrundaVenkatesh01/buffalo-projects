/**
 * Wedge Store - State management for validation & intelligence features
 *
 * Manages:
 * - Prompt dismissal tracking (with expiration)
 * - Peer intelligence cache
 * - Evidence gap analysis cache
 * - Narrative drafts
 * - User preferences
 */

import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  DismissedPrompt,
  WedgePreferences,
  PeerInsight,
  EvidenceGapAnalysis,
  NarrativeSections,
} from "@/components/wedge/types";
import { DEFAULT_WEDGE_PREFERENCES } from "@/components/wedge/types";
import { logger } from "@/utils/logger";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORE INTERFACE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface WedgeStore {
  // Dismissal tracking
  dismissedPrompts: DismissedPrompt[];
  dismissPrompt: (
    id: string,
    options?: { workspaceCode?: string; expiresInDays?: number }
  ) => void;
  isDismissed: (id: string, workspaceCode?: string) => boolean;
  clearExpiredDismissals: () => void;
  resetDismissals: () => void;

  // Peer intelligence cache
  peerInsights: Record<string, PeerInsight[]>;
  setPeerInsights: (workspaceCode: string, insights: PeerInsight[]) => void;
  getPeerInsights: (workspaceCode: string) => PeerInsight[];
  clearPeerInsights: (workspaceCode?: string) => void;

  // Evidence gap cache
  evidenceAnalysis: Record<string, EvidenceGapAnalysis>;
  setEvidenceAnalysis: (
    workspaceCode: string,
    analysis: EvidenceGapAnalysis
  ) => void;
  getEvidenceAnalysis: (workspaceCode: string) => EvidenceGapAnalysis | null;
  clearEvidenceAnalysis: (workspaceCode?: string) => void;

  // Narrative drafts (auto-saved)
  narrativeDrafts: Record<string, Partial<NarrativeSections>>;
  setNarrativeDraft: (
    workspaceCode: string,
    sections: Partial<NarrativeSections>
  ) => void;
  getNarrativeDraft: (workspaceCode: string) => Partial<NarrativeSections> | null;
  clearNarrativeDraft: (workspaceCode: string) => void;

  // User preferences
  preferences: WedgePreferences;
  setPreferences: (prefs: Partial<WedgePreferences>) => void;
  resetPreferences: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORE IMPLEMENTATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const createWedgeStore = () => {
  const baseStore: StateCreator<WedgeStore> = (set, get) => ({
    // Initial state
    dismissedPrompts: [],
    peerInsights: {},
    evidenceAnalysis: {},
    narrativeDrafts: {},
    preferences: DEFAULT_WEDGE_PREFERENCES,

    // ─────────────────────────────────────────────────────────────────
    // DISMISSAL TRACKING
    // ─────────────────────────────────────────────────────────────────

    dismissPrompt: (id, options) => {
      const now = new Date().toISOString();
      const expiresAt = options?.expiresInDays
        ? new Date(
            Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined;

      const dismissal: DismissedPrompt = {
        id,
        dismissedAt: now,
        workspaceCode: options?.workspaceCode,
        expiresAt,
      };

      set((state) => ({
        dismissedPrompts: [
          // Remove any existing dismissal for this id/workspace combo
          ...state.dismissedPrompts.filter(
            (d) =>
              !(d.id === id && d.workspaceCode === options?.workspaceCode)
          ),
          dismissal,
        ],
      }));

      logger.info("Wedge prompt dismissed", {
        id,
        workspaceCode: options?.workspaceCode,
        expiresInDays: options?.expiresInDays,
      });
    },

    isDismissed: (id, workspaceCode) => {
      const { dismissedPrompts } = get();
      const now = new Date().toISOString();

      return dismissedPrompts.some((d) => {
        // Check if prompt matches
        const idMatches = d.id === id;
        const workspaceMatches =
          d.workspaceCode === undefined || d.workspaceCode === workspaceCode;

        // Check if not expired
        const notExpired = !d.expiresAt || d.expiresAt > now;

        return idMatches && workspaceMatches && notExpired;
      });
    },

    clearExpiredDismissals: () => {
      const now = new Date().toISOString();

      set((state) => ({
        dismissedPrompts: state.dismissedPrompts.filter(
          (d) => !d.expiresAt || d.expiresAt > now
        ),
      }));
    },

    resetDismissals: () => {
      set({ dismissedPrompts: [] });
      logger.info("All wedge dismissals reset");
    },

    // ─────────────────────────────────────────────────────────────────
    // PEER INTELLIGENCE CACHE
    // ─────────────────────────────────────────────────────────────────

    setPeerInsights: (workspaceCode, insights) => {
      set((state) => ({
        peerInsights: {
          ...state.peerInsights,
          [workspaceCode]: insights,
        },
      }));
    },

    getPeerInsights: (workspaceCode) => {
      return get().peerInsights[workspaceCode] || [];
    },

    clearPeerInsights: (workspaceCode) => {
      if (workspaceCode) {
        set((state) => {
          const { [workspaceCode]: _, ...rest } = state.peerInsights;
          return { peerInsights: rest };
        });
      } else {
        set({ peerInsights: {} });
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // EVIDENCE GAP CACHE
    // ─────────────────────────────────────────────────────────────────

    setEvidenceAnalysis: (workspaceCode, analysis) => {
      set((state) => ({
        evidenceAnalysis: {
          ...state.evidenceAnalysis,
          [workspaceCode]: analysis,
        },
      }));
    },

    getEvidenceAnalysis: (workspaceCode) => {
      return get().evidenceAnalysis[workspaceCode] || null;
    },

    clearEvidenceAnalysis: (workspaceCode) => {
      if (workspaceCode) {
        set((state) => {
          const { [workspaceCode]: _, ...rest } = state.evidenceAnalysis;
          return { evidenceAnalysis: rest };
        });
      } else {
        set({ evidenceAnalysis: {} });
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // NARRATIVE DRAFTS
    // ─────────────────────────────────────────────────────────────────

    setNarrativeDraft: (workspaceCode, sections) => {
      set((state) => ({
        narrativeDrafts: {
          ...state.narrativeDrafts,
          [workspaceCode]: {
            ...state.narrativeDrafts[workspaceCode],
            ...sections,
          },
        },
      }));
    },

    getNarrativeDraft: (workspaceCode) => {
      return get().narrativeDrafts[workspaceCode] || null;
    },

    clearNarrativeDraft: (workspaceCode) => {
      set((state) => {
        const { [workspaceCode]: _, ...rest } = state.narrativeDrafts;
        return { narrativeDrafts: rest };
      });
    },

    // ─────────────────────────────────────────────────────────────────
    // USER PREFERENCES
    // ─────────────────────────────────────────────────────────────────

    setPreferences: (prefs) => {
      set((state) => ({
        preferences: {
          ...state.preferences,
          ...prefs,
        },
      }));
    },

    resetPreferences: () => {
      set({ preferences: DEFAULT_WEDGE_PREFERENCES });
    },
  });

  // Only use persistence in the browser (not during SSR/SSG)
  if (typeof window === "undefined") {
    return create<WedgeStore>()(baseStore);
  }

  return create<WedgeStore>()(
    persist(baseStore, {
      name: "buffalo-wedge",
      version: 1,
      partialize: (state) => ({
        dismissedPrompts: state.dismissedPrompts,
        preferences: state.preferences,
        narrativeDrafts: state.narrativeDrafts,
        // Note: peerInsights and evidenceAnalysis are NOT persisted
        // They are computed/cached and should be refreshed on load
      }),
      onRehydrateStorage: () => {
        logger.info("Wedge store hydration started");
        return (state, error) => {
          if (error) {
            logger.error("Wedge store hydration failed:", error);
          } else if (state) {
            // Clear expired dismissals on hydration
            state.clearExpiredDismissals();
            logger.info("Wedge store hydrated successfully", {
              dismissalCount: state.dismissedPrompts.length,
              draftCount: Object.keys(state.narrativeDrafts).length,
            });
          }
        };
      },
    })
  );
};

export const useWedgeStore = createWedgeStore();
