/**
 * Gallery Store - State management for project discovery and filtering
 */
import { create } from "zustand";

import type { ProjectCategory, ProjectStage, Workspace } from "../types";

export interface GalleryFilters {
  searchQuery: string;
  category: ProjectCategory | "all";
  stages: ProjectStage[];
  location: "all" | "buffalo" | "remote";
  gives: string[];
  asks: string[];
}

export type SortOption = "recent" | "trending" | "popular" | "comments";

export interface MatchedProject {
  workspace: Workspace;
  matchScore: number;
  matchedGives: string[];
}

interface GalleryStore {
  // Filter state
  filters: GalleryFilters;
  sortBy: SortOption;

  // Pagination state
  currentPage: number;
  hasMore: boolean;
  cursor: string | null;

  // Matches state
  showMatches: boolean;
  userAsks: string[];
  userGives: string[];
  matchedProjects: MatchedProject[];

  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: ProjectCategory | "all") => void;
  setStages: (stages: ProjectStage[]) => void;
  setLocation: (location: "all" | "buffalo" | "remote") => void;
  setGives: (gives: string[]) => void;
  setAsks: (asks: string[]) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearFilters: () => void;

  // Pagination
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setCursor: (cursor: string | null) => void;
  resetPagination: () => void;

  // Matches
  setShowMatches: (show: boolean) => void;
  setUserAsks: (asks: string[]) => void;
  setUserGives: (gives: string[]) => void;
  setMatchedProjects: (matches: MatchedProject[]) => void;
  calculateMatches: (allProjects: Workspace[]) => void;
}

const initialFilters: GalleryFilters = {
  searchQuery: "",
  category: "all",
  stages: [],
  location: "all",
  gives: [],
  asks: [],
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  // Initial state
  filters: initialFilters,
  sortBy: "recent",
  currentPage: 1,
  hasMore: true,
  cursor: null,
  showMatches: false,
  userAsks: [],
  userGives: [],
  matchedProjects: [],

  // Filter actions
  setSearchQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    }));
    get().resetPagination();
  },

  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
    get().resetPagination();
  },

  setStages: (stages) => {
    set((state) => ({
      filters: { ...state.filters, stages },
    }));
    get().resetPagination();
  },

  setLocation: (location) => {
    set((state) => ({
      filters: { ...state.filters, location },
    }));
    get().resetPagination();
  },

  setGives: (gives) => {
    set((state) => ({
      filters: { ...state.filters, gives },
    }));
    get().resetPagination();
  },

  setAsks: (asks) => {
    set((state) => ({
      filters: { ...state.filters, asks },
    }));
    get().resetPagination();
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().resetPagination();
  },

  clearFilters: () => {
    set({
      filters: initialFilters,
      sortBy: "recent",
    });
    get().resetPagination();
  },

  // Pagination actions
  setPage: (page) => set({ currentPage: page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCursor: (cursor) => set({ cursor }),

  resetPagination: () =>
    set({
      currentPage: 1,
      hasMore: true,
      cursor: null,
    }),

  // Matches actions
  setShowMatches: (show) => set({ showMatches: show }),
  setUserAsks: (asks) => set({ userAsks: asks }),
  setUserGives: (gives) => set({ userGives: gives }),
  setMatchedProjects: (matches) => set({ matchedProjects: matches }),

  calculateMatches: (allProjects) => {
    const { userAsks } = get();

    if (!userAsks || userAsks.length === 0) {
      set({ matchedProjects: [] });
      return;
    }

    const matches = allProjects
      .map((workspace) => {
        const matchedGives = (workspace.gives || []).filter((give) =>
          userAsks.some(
            (ask) => ask.toLowerCase().trim() === give.toLowerCase().trim(),
          ),
        );

        return {
          workspace,
          matchScore: matchedGives.length,
          matchedGives,
        };
      })
      .filter((match) => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    set({ matchedProjects: matches });
  },
}));
