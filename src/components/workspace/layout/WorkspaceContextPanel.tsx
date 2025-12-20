"use client";

import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { WorkspaceTabId } from "./WorkspaceTabs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, Button, LAYOUT, TYPOGRAPHY } from "@/components/unified";
import {
  LayoutDashboard,
  Layers3,
  MapIcon,
  FileArchive,
  Share2,
  ChevronLeft,
  ChevronRight,
  History,
  Download,
  BookOpen,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

interface WorkspaceContextPanelProps {
  workspace: Workspace;
  activeTab: WorkspaceTabId;
  onTabChange: (tab: WorkspaceTabId) => void;
  onSnapshotClick: () => void;
  onSaveClick: () => void;
  isSaving?: boolean;
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

// Unified navigation - 4 tabs (Publish hidden for now)
const UNIFIED_TABS = [
  {
    id: "overview" as WorkspaceTabId,
    label: "Project",
    icon: LayoutDashboard,
    description: "Overview & details",
  },
  {
    id: "canvas" as WorkspaceTabId,
    label: "Canvas",
    icon: Layers3,
    description: "Map your idea",
  },
  {
    id: "journey" as WorkspaceTabId,
    label: "Journey",
    icon: BookOpen,
    description: "Learnings & decisions",
  },
  {
    id: "documents" as WorkspaceTabId,
    label: "Documents",
    icon: FileArchive,
    description: "Files & evidence",
  },
  // Publish tab hidden for now - projects won't be public initially
  // {
  //   id: "share" as WorkspaceTabId,
  //   label: "Publish",
  //   icon: Share2,
  //   description: "Share publicly",
  // },
];

/**
 * Context Panel - Left sidebar showing project info and navigation
 *
 * Replaces the old WorkspaceSidebar with improved design system integration
 */
export function WorkspaceContextPanel({
  workspace,
  activeTab,
  onTabChange,
  onSnapshotClick,
  onSaveClick,
  isSaving = false,
  className,
  onCollapseChange,
}: WorkspaceContextPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const stats = {
    journalEntries: workspace.journal?.length || 0,
    pivots: workspace.pivots?.length || 0,
    documents: workspace.documents?.length || 0,
    versions: workspace.versions?.length || 0,
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-white/10 bg-[#0a0a0a] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : LAYOUT.sidebar.expanded,
        className,
      )}
    >
      {/* UNIFIED HEADER - Project Info + Mode Toggle */}
      <div
        className={cn(
          "flex flex-col border-b border-white/10",
          isCollapsed ? "p-2" : "p-3 gap-2",
        )}
      >
        {/* Top Row: Logo + Project Name + Published Badge + Collapse */}
        <div
          className={cn("flex items-center gap-3", isCollapsed && "flex-col")}
        >
          {/* Workspace Icon or Custom Logo */}
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 overflow-hidden",
              isCollapsed ? "h-10 w-10" : "h-10 w-10",
            )}
          >
            {workspace.assets?.logo ? (
              <Image
                src={workspace.assets.logo}
                alt={`${workspace.projectName} logo`}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Layers3 className="h-5 w-5 text-primary" />
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h2
                    className={cn(
                      TYPOGRAPHY.heading.sm,
                      "truncate leading-tight",
                    )}
                  >
                    {workspace.projectName}
                  </h2>
                  {workspace.isPublic && (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1.5 py-0"
                    >
                      <Share2 className="mr-1 h-2.5 w-2.5" />
                      Published
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 transition-transform hover:scale-110 active:scale-95"
                onClick={handleCollapseToggle}
                aria-label="Collapse sidebar"
              >
                <m.div
                  initial={false}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </m.div>
              </Button>
            </>
          )}

          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 transition-transform hover:scale-110 active:scale-95"
              onClick={handleCollapseToggle}
              aria-label="Expand sidebar"
            >
              <m.div
                initial={false}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronRight className="h-4 w-4" />
              </m.div>
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={cn(isCollapsed ? "p-1" : "px-2 py-3")}>
          {/* Navigation Items - Unified 4-tab system */}
          <div className="space-y-0.5">
            {UNIFIED_TABS.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <m.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <m.div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground",
                    )}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-4 w-4" />
                  </m.div>

                  {!isCollapsed && (
                    <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
                      <div
                        className={cn(
                          "truncate font-medium leading-tight",
                          isActive && "font-semibold",
                        )}
                      >
                        {item.label}
                      </div>
                      <div className="truncate text-xs leading-tight text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  )}

                  {!isCollapsed && isActive && (
                    <m.div
                      className="flex h-2 w-2 shrink-0 items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                    </m.div>
                  )}
                </m.button>
              );
            })}
          </div>

          {/* Subtle Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Quick Actions */}
          <div className="space-y-0.5">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSnapshotClick}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground"
              title={isCollapsed ? "Create snapshot" : undefined}
            >
              <m.div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
                whileHover={{ rotate: -15 }}
                transition={{ duration: 0.2 }}
              >
                <History className="h-4 w-4" />
              </m.div>
              {!isCollapsed && <span>Create Snapshot</span>}
            </m.button>

            <m.button
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSaveClick}
              disabled={isSaving}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              title={isCollapsed ? "Save now" : undefined}
            >
              <m.div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
                animate={isSaving ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Download
                  className={cn("h-4 w-4", isSaving && "animate-pulse")}
                />
              </m.div>
              {!isCollapsed && (
                <span>{isSaving ? "Saving..." : "Save Now"}</span>
              )}
            </m.button>

            {workspace.isPublic && workspace.slug && (
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`/p/${workspace.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground"
                  title={isCollapsed ? "View public page" : undefined}
                >
                  <m.div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </m.div>
                  {!isCollapsed && <span>View Public Page</span>}
                </Link>
              </m.div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer - Compact stats, tags, and workspace code */}
      {!isCollapsed && (
        <div className="border-t border-white/10 px-3 py-2.5 space-y-2">
          {/* Tags - Compact chips */}
          {workspace.tags && workspace.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workspace.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 cursor-default"
                >
                  #{tag}
                </Badge>
              ))}
              {workspace.tags.length > 4 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +{workspace.tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Stats - Inline */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-[10px] text-muted-foreground/70"
          >
            <span className="flex items-center gap-1">
              <MapIcon className="h-3 w-3" />
              {stats.journalEntries + stats.pivots}J
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1">
              <FileArchive className="h-3 w-3" />
              {stats.documents}D
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1">
              <History className="h-3 w-3" />
              {stats.versions}V
            </span>
          </m.div>

        </div>
      )}
    </aside>
  );
}
