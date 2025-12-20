"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Github, Loader2 } from "@/icons";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

/**
 * Instant Project Creation
 *
 * Creates a new workspace immediately and redirects to Getting Public mode (Basics section).
 * Supports quick GitHub import if URL is provided via sessionStorage.
 */
type GitHubImportResult = Partial<
  Pick<
    Workspace,
    | "projectName"
    | "description"
    | "oneLiner"
    | "stage"
    | "tags"
    | "githubStats"
    | "embeds"
    | "techStack"
  >
>;

export function UnifiedCreationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Creating your project...");

  // Check for quick import mode
  const isGitHubImport = searchParams.get("import") === "github";

  useEffect(() => {
    const createAndRedirect = async () => {
      try {
        // Check for quick import URL from sessionStorage
        const quickImportUrl =
          typeof window !== "undefined"
            ? sessionStorage.getItem("quick_import_url")
            : null;

        if (isGitHubImport && quickImportUrl) {
          // Clear the stored URL
          sessionStorage.removeItem("quick_import_url");

          setStatus("Importing from GitHub...");

          // Call GitHub import API
          const response = await fetch("/api/import/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: quickImportUrl }),
          });

          if (!response.ok) {
            throw new Error("Failed to import from GitHub");
          }

          const importResult = (await response.json()) as GitHubImportResult;

          setStatus("Creating project with imported data...");

          // Create workspace with basic fields
          const workspace = await createWorkspace({
            projectName: importResult.projectName || "Imported Project",
            description: importResult.description || "",
            oneLiner: importResult.oneLiner || "",
            stage: importResult.stage || "building",
            tags: importResult.tags || [],
            buffaloAffiliated: true,
          });

          // Update with additional GitHub data (githubStats, embeds, techStack)
          if (
            importResult.githubStats ||
            importResult.embeds ||
            importResult.techStack
          ) {
            await firebaseDatabase.saveWorkspace({
              ...workspace,
              githubStats: importResult.githubStats,
              embeds: importResult.embeds,
              techStack: importResult.techStack || [],
            });
          }

          // Redirect to editor with share tab open (ready to publish!)
          router.push(`/edit/${workspace.code}?tab=share`);
          return;
        }

        // Standard flow: Create blank project
        const defaultName = `Project ${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;

        const workspace = await createWorkspace({
          projectName: defaultName,
          stage: "idea",
          buffaloAffiliated: true,
        });

        router.push(`/edit/${workspace.code}`);
      } catch (err) {
        console.error("Failed to create workspace:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create project. Please try again.",
        );

        setTimeout(() => router.push("/dashboard"), 2000);
      }
    };

    void createAndRedirect();
  }, [createWorkspace, router, isGitHubImport]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <div className="text-destructive">
              <p className="text-lg font-medium">
                Couldn&apos;t create project
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting back to dashboard...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {isGitHubImport ? (
              <Github className="mx-auto h-12 w-12 animate-pulse text-primary" />
            ) : (
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            )}
            <div>
              <p className="text-lg font-medium">{status}</p>
              <p className="text-sm text-muted-foreground">
                {isGitHubImport
                  ? "Extracting project details from your repo"
                  : "You'll be editing in just a moment"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
