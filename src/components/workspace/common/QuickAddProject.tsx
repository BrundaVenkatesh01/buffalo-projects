"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui-next";
import { Input } from "@/components/ui-next";
import { Textarea } from "@/components/ui-next";
import { ExternalLink, Loader2, Plus } from "@/icons";
import {
  urlAnalyzerService,
  type UnifiedImportResult,
} from "@/services/urlAnalyzerService";
import type { ProjectStage } from "@/types";

interface QuickAddProjectProps {
  onProjectCreated?: (code: string) => void;
  autoPublish?: boolean;
}

/**
 * QuickAddProject Component
 *
 * Ultra-simplified project creation flow for users who just want
 * to add their project to Buffalo's directory without using workspace tools.
 *
 * Only collects:
 * - Project name
 * - Description
 * - Stage (optional)
 * - External link (optional)
 *
 * Optionally auto-publishes the project immediately.
 *
 * Usage:
 * - Standalone page for fast onboarding
 * - Modal/sheet for quick adds from profile
 * - Alternative to full workspace creation flow
 */
export function QuickAddProject({
  onProjectCreated,
  autoPublish = false,
}: QuickAddProjectProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<ProjectStage>("building");
  const [externalLink, setExternalLink] = useState("");

  // AI extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] =
    useState<UnifiedImportResult | null>(null);
  const [urlDebounceTimeout, setUrlDebounceTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const canSubmit =
    projectName.trim().length >= 3 && description.trim().length >= 20;

  // Auto-extract from URL when pasted
  useEffect(() => {
    // Clear existing timeout
    if (urlDebounceTimeout) {
      clearTimeout(urlDebounceTimeout);
    }

    // Don't extract if form is already filled or URL is empty
    if (!externalLink || projectName || description) {
      return;
    }

    // Validate URL
    if (!urlAnalyzerService.isValidURL(externalLink)) {
      return;
    }

    // Debounce extraction (wait 800ms after user stops typing)
    const timeout = setTimeout(() => {
      void handleAutoExtract();
    }, 800);

    setUrlDebounceTimeout(timeout);

    // Cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalLink]);

  const handleAutoExtract = async () => {
    if (!externalLink || isExtracting) {
      return;
    }

    setIsExtracting(true);

    try {
      const result = await urlAnalyzerService.importFromURL(externalLink);

      // Auto-fill form fields
      setProjectName(result.projectName);
      setDescription(result.description);
      if (result.stage) {
        setStage(result.stage);
      }
      setExtractedData(result);

      toast.success("Project details extracted! Review and create.", {
        description: `Extracted from ${urlAnalyzerService.getURLTypeLabel(result.sourceType)}`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to extract from URL. You can still create manually.";
      toast.error(message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Please fill in the required fields");
      return;
    }

    setCreating(true);

    try {
      // Import workspace store dynamically to avoid SSR issues
      const { useWorkspaceStore } = await import("@/stores/workspaceStore");
      const createWorkspace = useWorkspaceStore.getState().createWorkspace;
      const publishWorkspace = useWorkspaceStore.getState().publishWorkspace;

      // Create workspace with minimal data
      const workspace = await createWorkspace({
        projectName: projectName.trim(),
        description: description.trim(),
        stage,
        tags: extractedData?.tags || [],
        location: "remote", // Default to remote for quick adds
      });

      // Merge AI-extracted data if available
      if (extractedData || externalLink.trim()) {
        const updateWorkspace = useWorkspaceStore.getState().updateWorkspace;
        const saveWorkspace = useWorkspaceStore.getState().saveWorkspace;

        const updates: Record<string, unknown> = {};

        // Add external link
        if (externalLink.trim()) {
          updates["publicLink"] = externalLink.trim();
        }

        // Add AI-extracted data
        if (extractedData) {
          if (extractedData.oneLiner) {
            updates["oneLiner"] = extractedData.oneLiner;
          }
          if (extractedData.bmcData) {
            updates["bmcData"] = {
              ...workspace.bmcData,
              ...extractedData.bmcData,
            };
          }
          if (extractedData.embeds) {
            updates["embeds"] = extractedData.embeds;
          }
          if (extractedData.githubStats) {
            updates["githubStats"] = extractedData.githubStats;
          }
          if (extractedData.screenshot) {
            updates["assets"] = { coverImage: extractedData.screenshot };
          }
        }

        updateWorkspace(updates);
        await saveWorkspace();
      }

      // Auto-publish if requested
      if (autoPublish) {
        await publishWorkspace(workspace.code);
        toast.success(
          "🎉 Project published! It's now live in Buffalo's directory.",
        );
        onProjectCreated?.(workspace.code);
        router.push("/projects");
      } else {
        toast.success("Project created! You can publish it from your profile.");
        onProjectCreated?.(workspace.code);
        router.push(`/edit/${workspace.code}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create project";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-6"
    >
      {/* Start with URL - AI will auto-extract! */}
      {/* External Link (Optional) - Now with AI Auto-Extract */}
      <div className="space-y-2">
        <Label
          htmlFor="external-link"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          Website or Demo{" "}
          <span className="text-muted-foreground">(optional)</span>
          {isExtracting && (
            <span className="inline-flex items-center gap-1.5 text-xs font-normal text-primary">
              <Loader2 className="h-3 w-3 animate-spin" />
              Extracting...
            </span>
          )}
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="external-link"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://example.com or https://github.com/user/repo"
              className="text-base pr-10"
              disabled={isExtracting}
              autoFocus
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
          {urlAnalyzerService.isValidURL(externalLink) &&
            !isExtracting &&
            !extractedData && (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => {
                  void handleAutoExtract();
                }}
                className="shrink-0 gap-2"
              >
                Extract
              </Button>
            )}
        </div>
        <p className="text-xs text-muted-foreground">
          {!externalLink ? (
            <>Paste a GitHub or website URL to auto-fill project details</>
          ) : urlAnalyzerService.isValidURL(externalLink) ? (
            <>
              Will extract from{" "}
              {urlAnalyzerService.getURLTypeLabel(
                urlAnalyzerService.detectURLType(externalLink),
              )}
            </>
          ) : (
            <>Enter a valid URL (must start with https://)</>
          )}
        </p>
        {extractedData && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
            <p className="font-medium text-foreground">
              Project details extracted
            </p>
            <p className="text-muted-foreground mt-1">
              Review the auto-filled fields below and make any adjustments
              before creating.
            </p>
          </div>
        )}
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label
          htmlFor="project-name"
          className="text-sm font-medium text-foreground"
        >
          Project Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="project-name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="My Awesome Project"
          className="text-base"
          required
          minLength={3}
        />
        <p className="text-xs text-muted-foreground">At least 3 characters</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell people what your project is about..."
          rows={4}
          className="resize-none text-base"
          required
          minLength={20}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/20 characters minimum
        </p>
      </div>

      {/* Stage (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="stage" className="text-sm font-medium text-foreground">
          Current Stage{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Select
          value={stage}
          onValueChange={(v) => setStage(v as ProjectStage)}
        >
          <SelectTrigger id="stage">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea - Just getting started</SelectItem>
            <SelectItem value="research">
              Research - Validating assumptions
            </SelectItem>
            <SelectItem value="planning">Planning - Defining scope</SelectItem>
            <SelectItem value="building">
              Building - Active development
            </SelectItem>
            <SelectItem value="testing">
              Testing - Getting user feedback
            </SelectItem>
            <SelectItem value="launching">Launching - Going live</SelectItem>
            <SelectItem value="scaling">
              Scaling - Growing the business
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={!canSubmit || creating}
          className="flex flex-1 items-center gap-2 rounded-full"
          size="lg"
        >
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span className="whitespace-nowrap">Creating...</span>
            </>
          ) : autoPublish ? (
            <>
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Publish to Directory</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Create Project</span>
            </>
          )}
        </Button>

        {externalLink && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open(externalLink, "_blank", "noopener,noreferrer")
            }
            size="lg"
            className="flex items-center gap-2 rounded-full"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Preview</span>
          </Button>
        )}
      </div>

      {/* Helper Text */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {autoPublish ? (
            <>
              Your project will be immediately visible in Buffalo&apos;s project
              directory. You can add more details later from your profile.
            </>
          ) : (
            <>
              You can publish your project later from your profile. It will stay
              private until you&apos;re ready to share it.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
