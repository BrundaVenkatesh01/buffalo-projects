"use client";
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment */

import { m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { BatchURLImport } from "./components/BatchURLImport";
import { ProfileEditDialog } from "./components/ProfileEditDialog";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSkills } from "./components/ProfileSkills";
import { ProfileStats } from "./components/ProfileStats";
import { ProjectCreationModal } from "./components/ProjectCreationModal";
import {
  ProjectFilterBar,
  type ProjectFilterOption,
  type ProjectSortOption,
  type ViewMode,
} from "./components/ProjectFilterBar";
import {
  TwentySixPublishDialog,
  type PublishOptions,
} from "./components/TwentySixPublishDialog";
import { URLImportDialog } from "./components/URLImportDialog";
import { useProfileStats } from "./hooks/useProfileStats";

import { ImportDialogV2 } from "@/components/import";
import { WelcomeModal } from "@/components/onboarding";
import { Button, Card, CardContent, ProjectCard } from "@/components/unified";
import { WorkspaceDeleteDialog } from "@/components/workspace/publishing/WorkspaceDeleteDialog";
import { Plus, FileText, Github, Download, Upload, Users } from "@/icons";
import { cn } from "@/lib/utils";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import {
  githubOAuthService,
  type GitHubConnection,
} from "@/services/githubOAuthService";
import type { ImportResult } from "@/services/importService";
import type { UnifiedImportResult } from "@/services/urlAnalyzerService";
import { useAuthStore } from "@/stores/authStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace, SocialLink } from "@/types";

export function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const { workspaces, createWorkspace, publishWorkspace, unpublishWorkspace } =
    useWorkspaceStore();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Creation modal state
  const [showCreationModal, setShowCreationModal] = useState(false);

  // Import dialog state
  const [showURLImport, setShowURLImport] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showFileImport, setShowFileImport] = useState(false);

  // Publish dialog state
  const [twentySixDialogOpen, setTwentySixDialogOpen] = useState(false);
  const [selectedWorkspaceForPublish] = useState<Workspace | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
    null,
  );

  // Filter/sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProjectSortOption>("newest");
  const [filter, setFilter] = useState<ProjectFilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // GitHub connection state
  const [githubConnection, setGithubConnection] =
    useState<GitHubConnection | null>(null);

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }
    if (user.displayName) {
      return user.displayName;
    }
    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(Boolean).join(" ");
    }
    if (user.email) {
      return user.email.split("@")[0] || "";
    }
    return "Anonymous User";
  }, [user]);

  const initials = useMemo(() => {
    if (!user) {
      return "?";
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      return parts.length > 1
        ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
        : parts[0]!.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email[0]!.toUpperCase();
    }
    return "?";
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) {
      return "Recently";
    }
    try {
      const createdAt = user.createdAt as unknown;
      const date =
        createdAt instanceof Date
          ? createdAt
          : new Date(createdAt as string | number);
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  }, [user?.createdAt]);

  // Use custom hook for statistics
  const stats = useProfileStats(workspaces, user?.uid);

  // Load GitHub connection on mount
  useEffect(() => {
    if (user?.uid) {
      githubOAuthService
        .getConnection(user.uid)
        .then(setGithubConnection)
        .catch(console.error);
    }
  }, [user?.uid]);

  // Check for GitHub OAuth callback success/error
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("github_connected") === "true") {
      toast.success(
        "GitHub connected successfully! You can now import private repositories.",
      );
      // Remove query param
      window.history.replaceState({}, "", window.location.pathname);
      // Reload connection
      if (user?.uid) {
        githubOAuthService
          .getConnection(user.uid)
          .then(setGithubConnection)
          .catch(console.error);
      }
    } else if (params.get("github_error")) {
      const error = params.get("github_error");
      toast.error(`GitHub connection failed: ${error}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [user?.uid]);

  // Filter workspaces for current user
  const userWorkspaces = useMemo(
    () =>
      workspaces.filter(
        (w) => w.ownerId === user?.uid || w.userId === user?.uid,
      ),
    [workspaces, user?.uid],
  );

  // Apply filters and sorting
  const filteredWorkspaces = useMemo(() => {
    return userWorkspaces
      .filter((w) => {
        // Search filter
        if (
          searchQuery &&
          !w.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Visibility filter
        if (filter === "public" && !w.isPublic) {
          return false;
        }
        if (filter === "private" && w.isPublic) {
          return false;
        }
        if (filter === "twentysix" && !w.isForTwentySix) {
          return false;
        }

        // Stage filter
        if (
          filter !== "all" &&
          filter !== "public" &&
          filter !== "private" &&
          filter !== "twentysix"
        ) {
          if (w.stage !== filter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.lastModified).getTime() -
              new Date(a.lastModified).getTime()
            );
          case "oldest":
            return (
              new Date(a.lastModified).getTime() -
              new Date(b.lastModified).getTime()
            );
          case "name-asc":
            return a.projectName.localeCompare(b.projectName);
          case "name-desc":
            return b.projectName.localeCompare(a.projectName);
          case "most-active":
            return (b.versions?.length || 0) - (a.versions?.length || 0);
          case "stage":
            return (a.stage || "").localeCompare(b.stage || "");
          default:
            return 0;
        }
      });
  }, [userWorkspaces, searchQuery, filter, sortBy]);

  const handleSaveProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    buffaloConnection?: string;
    displayName?: string;
    socialLinks?: SocialLink[];
    skills?: string[];
    areasOfInterest?: string[];
  }) => {
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      await updateProfile(updates);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Import handlers
  const handleFileImport = async (result: ImportResult) => {
    const stageMap: Record<string, UnifiedImportResult["stage"]> = {
      idea: "idea",
      building: "building",
      testing: "testing",
      launched: "launching",
    };

    const unifiedResult: UnifiedImportResult = {
      projectName: result.projectName,
      oneLiner: result.oneLiner,
      description: result.description || result.projectName,
      stage: result.stage ? stageMap[result.stage] || "idea" : "idea",
      tags: result.tags,
      bmcData: result.bmcData,
      confidence: result.confidence,
      warnings: result.warnings,
      sourceURL: result.originalFile
        ? `file://${result.originalFile.name}`
        : `import-${Date.now()}`,
      sourceType: "file",
    };

    await handleSingleImport(unifiedResult);
  };

  const handleSingleImport = async (result: UnifiedImportResult) => {
    try {
      const workspace = await createWorkspace({
        projectName: result.projectName,
        description: result.description || result.oneLiner,
        stage: result.stage,
        tags: result.tags,
        oneLiner: result.oneLiner,
        publicLink: result.sourceURL,
      });

      const updates: Partial<Workspace> = {
        embeds: result.embeds,
        githubStats: result.githubStats,
      };

      if (result.bmcData && Object.keys(result.bmcData).length > 0) {
        updates.bmcData = { ...workspace.bmcData, ...result.bmcData };
      }

      if (result.screenshot) {
        updates.assets = { coverImage: result.screenshot };
      }

      await firebaseDatabase.updateWorkspace(workspace.code, updates);
      toast.success(`Imported: ${result.projectName}`);
      router.push(`/edit/${workspace.code}`);
    } catch (error: unknown) {
      console.error("Import error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create workspace from import";
      toast.error(message);
    }
  };

  const handleBatchImport = async (results: UnifiedImportResult[]) => {
    try {
      let successCount = 0;

      for (const result of results) {
        try {
          const workspace = await createWorkspace({
            projectName: result.projectName,
            description: result.description || result.oneLiner,
            stage: result.stage,
            tags: result.tags,
            oneLiner: result.oneLiner,
            publicLink: result.sourceURL,
          });

          const updates: Partial<Workspace> = {
            embeds: result.embeds,
            githubStats: result.githubStats,
          };

          if (result.bmcData && Object.keys(result.bmcData).length > 0) {
            updates.bmcData = { ...workspace.bmcData, ...result.bmcData };
          }

          if (result.screenshot) {
            updates.assets = { coverImage: result.screenshot };
          }

          await firebaseDatabase.updateWorkspace(workspace.code, updates);
          successCount++;
        } catch (error) {
          console.error(`Failed to import ${result.projectName}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully imported ${successCount} of ${results.length} project${results.length !== 1 ? "s" : ""}!`,
        );
        router.push("/dashboard");
      } else {
        toast.error("Failed to import any projects");
      }
    } catch (error: unknown) {
      console.error("Batch import error:", error);
      toast.error("Failed to create workspaces from import");
    }
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setWorkspaceToDelete(null);
  };

  const handleViewPublicWorkspace = (workspace: Workspace) => {
    if (workspace.slug) {
      window.open(`/p/${workspace.slug}`, "_blank", "noopener,noreferrer");
    } else {
      toast.error("This project doesn't have a public URL yet");
    }
  };

  const handleToggleVisibility = async (workspace: Workspace) => {
    try {
      if (workspace.isPublic) {
        await unpublishWorkspace(workspace.code);
        toast.success(`${workspace.projectName} is now private`);
      } else {
        await publishWorkspace(workspace.code);
        toast.success(`${workspace.projectName} is now published!`, {
          description: "Your project is visible in the community gallery",
        });
      }
    } catch (error) {
      console.error("Toggle visibility error:", error);
      toast.error("Failed to update project visibility");
    }
  };

  const handlePublishForTwentySix = async (
    workspaceId: string,
    options: PublishOptions,
  ) => {
    try {
      await publishWorkspace(workspaceId);

      if (options.isForTwentySix) {
        await firebaseDatabase.updateWorkspace(workspaceId, {
          isForTwentySix: true,
        });
      }

      toast.success("Published for 26 under 26! ✨");
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish project");
    }
  };

  const handleUpdateSkills = async (skills: string[]) => {
    await updateProfile({ skills });
  };

  const handleUpdateInterests = async (interests: string[]) => {
    await updateProfile({ areasOfInterest: interests });
  };

  // Auth guard
  if (!user && !loading) {
    return (
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-white">
          Sign in to view your profile
        </h1>
        <p className="max-w-md text-sm text-neutral-400">
          Your profile shows your Buffalo Projects activity, preferences, and
          connections. Sign in to get started.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => router.push("/signin?redirect=/dashboard")}>
            Sign in
          </Button>
          <Button variant="secondary" onClick={() => router.push("/join")}>
            Create account
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-10 w-64 rounded-lg bg-white/10 animate-pulse" />
                  <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-32 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-6 w-28 rounded-full bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-36 rounded-lg bg-white/10 animate-pulse" />
              <div className="h-10 w-24 rounded-lg bg-white/10 animate-pulse" />
            </div>
            <div className="h-12 rounded-lg bg-white/10 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-lg bg-gradient-to-br from-white/10 to-white/5 animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-80 rounded-2xl bg-white/10 animate-pulse" />
            <div className="h-48 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-32 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-64 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <WelcomeModal />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileHeader
                displayName={displayName}
                initials={initials}
                email={user.email}
                photoURL={user.photoURL}
                buffaloConnection={user.buffaloConnection}
                memberSince={memberSince}
                bio={user.bio}
                isEditing={isEditing}
                onEditClick={() => setIsEditing(true)}
              />
            </m.div>

            {/* IMPROVED: Better welcome message for small business owners */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white mb-1">
                        {(() => {
                          const hour = new Date().getHours();
                          if (hour < 12) {return "Good morning"};
                          if (hour < 18) {return "Good afternoon"};
                          return "Good evening";
                        })()}
                        , {displayName.split(" ")[0] || displayName}! 👋
                      </h2>
                      {userWorkspaces.length === 0 ? (
                        /* IMPROVED: More welcoming for small business owners */
                        <p className="text-sm text-neutral-300">
                          Ready to showcase your business? Create a professional
                          page in minutes—no technical skills needed.
                        </p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
                          <span>
                            <strong className="text-white">
                              {stats.projects}
                            </strong>{" "}
                            {stats.projects === 1 ? "page" : "pages"}
                          </span>
                          {stats.publicProjects > 0 && (
                            <>
                              <span className="text-white/20">•</span>
                              <span>
                                <strong className="text-white">
                                  {stats.publicProjects}
                                </strong>{" "}
                                published
                              </span>
                            </>
                          )}
                          {stats.pivots > 0 && (
                            <>
                              <span className="text-white/20">•</span>
                              <span>
                                <strong className="text-white">
                                  {stats.pivots}
                                </strong>{" "}
                                {stats.pivots === 1 ? "pivot" : "pivots"}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {userWorkspaces.length === 0 && (
                      <Button
                        onClick={() => setShowCreationModal(true)}
                        leftIcon={<Plus className="h-4 w-4" />}
                        size="sm"
                      >
                        Create Page
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </m.div>

            {/* Quick Actions - Only show if user has projects */}
            {userWorkspaces.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowCreationModal(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  size="sm"
                >
                  Create Page
                </Button>
                <Button
                  onClick={() => setShowURLImport(true)}
                  variant="outline"
                  leftIcon={<Download className="h-4 w-4" />}
                  size="sm"
                >
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/groups")}
                  leftIcon={<Users className="h-4 w-4" />}
                >
                  Groups
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </Button>
              </div>
            )}

            {/* IMPROVED: Better section title */}
            <div className="space-y-3" id="profile-projects">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {userWorkspaces.length === 0
                    ? "Get Started"
                    : "Your Business Pages"}
                </h2>
                <p className="mt-1 text-xs text-neutral-300">
                  {userWorkspaces.length === 0
                    ? "Create your first professional page"
                    : "All your business pages in one place"}
                </p>
              </div>

              {/* IMPROVED: Only show filter bar if user has projects */}
              {userWorkspaces.length > 0 && (
                <ProjectFilterBar
                  totalCount={userWorkspaces.length}
                  filteredCount={filteredWorkspaces.length}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  filter={filter}
                  onFilterChange={setFilter}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              )}

              {/* IMPROVED: Better empty state for small business owners */}
              {userWorkspaces.length === 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 to-transparent py-20 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
                  </div>

                  <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg relative z-10">
                      <Plus className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
                  </m.div>

                  <m.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 space-y-4 max-w-lg"
                  >
                    {/* IMPROVED: More welcoming headline */}
                    <h3 className="text-2xl font-bold text-foreground">
                      Create Your Business Page
                    </h3>
                    {/* IMPROVED: Clearer, less technical description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get a professional, shareable page for your business in
                      minutes. Add your details, upload photos, and get a link
                      you can share anywhere— no technical skills or coding
                      required.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 text-left pt-2">
                      <div className="space-y-1">
                        <div className="text-primary text-lg font-bold">1</div>
                        <div className="text-xs font-medium text-foreground">
                          Tell Us About You
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Business name, what you do
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-primary text-lg font-bold">2</div>
                        <div className="text-xs font-medium text-foreground">
                          Add Your Info
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Photos, contact details, links
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-primary text-lg font-bold">3</div>
                        <div className="text-xs font-medium text-foreground">
                          Share Your Link
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Anyone can view, no login needed
                        </div>
                      </div>
                    </div>
                  </m.div>

                  <m.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 space-y-4"
                  >
                    {/* IMPROVED: Better primary button text */}
                    <Button
                      onClick={() => setShowCreationModal(true)}
                      size="lg"
                      leftIcon={<Plus className="h-5 w-5" />}
                      className="shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Create My Business Page
                    </Button>
                    {/* IMPROVED: Less prominent GitHub option */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        onClick={() => setShowFileImport(true)}
                        variant="outline"
                        size="sm"
                        leftIcon={<Upload className="h-4 w-4" />}
                      >
                        Import from File
                      </Button>
                      <Button
                        onClick={() => setShowURLImport(true)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Github className="h-4 w-4" />}
                        className="text-xs"
                      >
                        Advanced: GitHub Import
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Most business pages are ready to share in under 5 minutes
                    </p>
                  </m.div>
                </m.div>
              )}

              {/* Projects Grid */}
              {filteredWorkspaces.length > 0 && (
                <div
                  className={cn(
                    "grid gap-3",
                    viewMode === "grid" && "grid-cols-1 md:grid-cols-2",
                    viewMode === "list" && "grid-cols-1",
                    viewMode === "compact" &&
                      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {filteredWorkspaces.map((workspace) => (
                    <ProjectCard
                      key={workspace.id || workspace.code}
                      workspace={workspace}
                      variant="compact"
                      context="editor"
                      onDelete={handleDeleteWorkspace}
                      onViewPublic={handleViewPublicWorkspace}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              )}

              {/* No Results State */}
              {filteredWorkspaces.length === 0 && userWorkspaces.length > 0 && (
                <m.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 py-16 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      No matching pages
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      No pages match your current filters. Try adjusting your
                      search or filters.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                      setSortBy("newest");
                    }}
                    className="mt-2"
                  >
                    Clear All Filters
                  </Button>
                </m.div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <aside className="space-y-4">
            <Card
              variant="default"
              className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <h2 className="text-sm font-bold mb-4 text-white">Overview</h2>
                <ProfileStats
                  projects={stats.projects}
                  pivots={stats.pivots}
                  publicProjects={stats.publicProjects}
                  versions={stats.versions}
                  comments={stats.comments}
                />
              </CardContent>
            </Card>

            {((user.skills && user.skills.length > 0) ||
              (user.areasOfInterest && user.areasOfInterest.length > 0)) && (
              <ProfileSkills
                user={user}
                onUpdateSkills={handleUpdateSkills}
                onUpdateInterests={handleUpdateInterests}
                editable
              />
            )}
          </aside>
        </div>
      </div>

      {/* Dialogs */}
      <ProjectCreationModal
        isOpen={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        onOpenURLImport={() => {
          setShowCreationModal(false);
          setShowURLImport(true);
        }}
        onOpenBatchImport={() => {
          setShowCreationModal(false);
          setShowBatchImport(true);
        }}
        onOpenFileImport={() => {
          setShowCreationModal(false);
          setShowFileImport(true);
        }}
      />

      <TwentySixPublishDialog
        open={twentySixDialogOpen}
        onOpenChange={setTwentySixDialogOpen}
        workspace={selectedWorkspaceForPublish}
        onConfirm={handlePublishForTwentySix}
      />

      <URLImportDialog
        isOpen={showURLImport}
        onClose={() => setShowURLImport(false)}
        onImport={(result) => void handleSingleImport(result)}
      />

      <BatchURLImport
        isOpen={showBatchImport}
        onClose={() => setShowBatchImport(false)}
        onImport={(results) => void handleBatchImport(results)}
        githubConnection={githubConnection}
      />

      <ImportDialogV2
        open={showFileImport}
        onOpenChange={setShowFileImport}
        onImportComplete={(result) => void handleFileImport(result)}
      />

      <ProfileEditDialog
        user={user}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
        saving={saving}
      />

      {workspaceToDelete && (
        <WorkspaceDeleteDialog
          workspace={workspaceToDelete}
          isOpen={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
        />
      )}
    </>
  );
}
