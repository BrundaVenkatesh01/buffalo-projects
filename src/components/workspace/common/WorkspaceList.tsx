"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { WorkspaceCard } from "./WorkspaceCard";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/unified";
import { PlusCircle, Search } from "@/icons";
import type { ProjectStage, Workspace } from "@/types";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspace: Workspace) => void;
  onViewPublic?: (workspace: Workspace) => void;
  onToggleVisibility?: (workspace: Workspace) => void;
  emptyState?: ReactNode;
  showCreateButton?: boolean;
}

type SortOption = "recent" | "name" | "stage" | "public";
type FilterOption = "all" | "public" | "private" | "paused";

/**
 * WorkspaceList Component
 *
 * Displays a filterable, sortable grid of workspace cards.
 *
 * Features:
 * - Search by project name or description
 * - Filter by visibility (all, public, private, paused)
 * - Sort by recency, name, stage, or public status
 * - Responsive grid layout
 * - Empty state with create button
 * - Action callbacks for edit/delete/view
 *
 * Used in:
 * - Profile page
 * - Workspace dashboard/shelf
 */
export function WorkspaceList({
  workspaces,
  onEdit,
  onDelete,
  onViewPublic,
  onToggleVisibility,
  emptyState,
  showCreateButton = true,
}: WorkspaceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const filteredAndSortedWorkspaces = useMemo(() => {
    let result = [...workspaces];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.projectName?.toLowerCase().includes(query) ||
          w.description?.toLowerCase().includes(query) ||
          w.oneLiner?.toLowerCase().includes(query) ||
          w.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Visibility filter
    if (filterBy === "public") {
      result = result.filter((w) => w.isPublic);
    } else if (filterBy === "private") {
      result = result.filter((w) => !w.isPublic);
    } else if (filterBy === "paused") {
      result = result.filter((w) => {
        if (!w.lastModified) {
          return false;
        }
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        return new Date(w.lastModified).getTime() < sixMonthsAgo;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.lastModified || 0).getTime() -
            new Date(a.lastModified || 0).getTime()
          );
        case "name":
          return (a.projectName || "").localeCompare(b.projectName || "");
        case "stage": {
          const stageOrder: Record<ProjectStage, number> = {
            idea: 0,
            research: 1,
            planning: 2,
            building: 3,
            testing: 4,
            launching: 5,
            scaling: 6,
          };
          const aStage = a.stage || "idea";
          const bStage = b.stage || "idea";
          return stageOrder[bStage] - stageOrder[aStage];
        }
        case "public":
          return Number(b.isPublic) - Number(a.isPublic);
        default:
          return 0;
      }
    });

    return result;
  }, [workspaces, searchQuery, sortBy, filterBy]);

  const isEmpty = workspaces.length === 0;
  const noResults = !isEmpty && filteredAndSortedWorkspaces.length === 0;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      {!isEmpty && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex gap-2">
            <Select
              value={filterBy}
              onValueChange={(v) => setFilterBy(v as FilterOption)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Updated</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="stage">Stage</SelectItem>
                <SelectItem value="public">Public First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Workspace Grid */}
      {!isEmpty && !noResults && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.code}
              workspace={workspace}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewPublic={onViewPublic}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}

      {/* No Results State */}
      {noResults && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="rounded-full bg-white/5 p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl text-foreground">
              No projects found
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setFilterBy("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Empty State */}
      {isEmpty &&
        (emptyState || (
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="rounded-full bg-white/5 p-4">
              <PlusCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-foreground">
                No projects yet
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Start your first project and begin building something amazing
                with Buffalo&apos;s entrepreneurship community.
              </p>
            </div>
            {showCreateButton && (
              <Link href="/profile" className="inline-flex">
                <Button size="lg" leftIcon={<PlusCircle />}>
                  Create your first project
                </Button>
              </Link>
            )}
          </div>
        ))}
    </div>
  );
}
