"use client";

import { Stack, Inline } from "@/components/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui-next";
import {
  FileArchive,
  Layers3,
  Share2,
  LayoutDashboard,
  BookOpen,
} from "@/icons";
import type { LucideIcon } from "@/icons";
import { cn } from "@/lib/utils";

// Unified tab system - 5 tabs
export type WorkspaceTabId =
  | "overview" // Project tab
  | "canvas" // Canvas tab
  | "journey" // Journey tab (learnings, interviews, decisions)
  | "documents" // Documents tab
  | "share"; // Publish tab

interface WorkspaceTabsProps {
  activeTab: WorkspaceTabId;
  onTabChange: (tab: WorkspaceTabId) => void;
}

// 5-tab configuration matching WorkspaceContextPanel
const TAB_CONFIG: Array<{
  id: WorkspaceTabId;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "overview",
    label: "Project",
    description: "Overview & details",
    icon: LayoutDashboard,
  },
  {
    id: "canvas",
    label: "Canvas",
    description: "Business model",
    icon: Layers3,
  },
  {
    id: "journey",
    label: "Journey",
    description: "Learnings & decisions",
    icon: BookOpen,
  },
  {
    id: "documents",
    label: "Documents",
    description: "Files & evidence",
    icon: FileArchive,
  },
  {
    id: "share",
    label: "Publish",
    description: "Share publicly",
    icon: Share2,
  },
];

export function WorkspaceTabs({ activeTab, onTabChange }: WorkspaceTabsProps) {
  return (
    <Stack gap="sm">
      {/* Mobile Select */}
      <div className="md:hidden">
        <Select
          value={activeTab}
          onValueChange={(value) => onTabChange(value as WorkspaceTabId)}
        >
          <SelectTrigger aria-label="Select workspace section">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {TAB_CONFIG.map((tab) => (
              <SelectItem key={tab.id} value={tab.id}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs - 5 unified tabs */}
      <nav className="hidden md:block" aria-label="Workspace tabs">
        <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 md:grid-cols-5">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-start justify-between gap-2 rounded-xl px-4 py-3 text-left transition-all",
                  "hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "border border-primary/40 bg-primary/15 text-foreground shadow-soft"
                    : "border border-transparent text-muted-foreground",
                )}
              >
                <Inline gap="xs" align="center">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </Inline>
                <span className="text-xs text-muted-foreground">
                  {tab.description}
                </span>
              </Button>
            );
          })}
        </div>
      </nav>
    </Stack>
  );
}

export default WorkspaceTabs;
