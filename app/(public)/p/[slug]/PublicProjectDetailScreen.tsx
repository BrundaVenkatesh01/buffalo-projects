"use client";

import { useEffect, useMemo } from "react";

import { ProjectDetailPageV2 } from "@/components/projects/v2/ProjectDetailPage";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { useAuthStore } from "@/stores/authStore";
import type { Workspace } from "@/types";
import { getSiteUrl } from "@/utils/env";

interface PublicProjectDetailScreenProps {
  workspace: Workspace;
}

/**
 * PublicProjectDetailScreen
 *
 * Controller component for public project pages.
 * Handles business logic (analytics, SEO) and delegates UI to ProjectDetailPage.
 *
 * Responsibilities:
 * - View count tracking
 * - SEO structured data (schema.org)
 * - Auth state management
 * - UI delegation to ProjectDetailPage
 */
export function PublicProjectDetailScreen({
  workspace,
}: PublicProjectDetailScreenProps) {
  const baseUrl = getSiteUrl();
  const projectSlug = workspace.slug ?? workspace.code;
  const projectUrl = `${baseUrl}/p/${projectSlug}`;
  const ogImageUrl = `${baseUrl}/api/og/${projectSlug}`;
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.uid;

  // Track view count on mount
  useEffect(() => {
    void firebaseDatabase.incrementViewCount(workspace.code).catch(() => {
      // Silently fail - analytics should not block user experience
      return;
    });
  }, [workspace.code]);

  // Generate SEO structured data
  const structuredData = useMemo(() => {
    const heroDescription =
      workspace.description ||
      workspace.projectDescription ||
      "This Buffalo builder is working in public. Follow along to offer feedback, share resources, and celebrate their progress.";

    const isBuffaloAffiliated = Boolean(
      workspace.buffaloAffiliated || workspace.location === "buffalo",
    );

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: workspace.projectName || "Buffalo Project",
      description: heroDescription,
      url: projectUrl,
      image: ogImageUrl,
      inLanguage: "en-US",
      dateCreated: workspace.createdAt,
      dateModified: workspace.lastModified,
      isAccessibleForFree: true,
      publisher: {
        "@type": "Organization",
        name: "Buffalo Projects",
        url: baseUrl,
        logo: `${baseUrl}/android-chrome-512x512.png`,
      },
    };

    if (workspace.tags?.length) {
      schema["keywords"] = workspace.tags.join(", ");
    }

    if (isBuffaloAffiliated) {
      schema["audience"] = {
        "@type": "Audience",
        audienceType: "Buffalo affiliated builders",
      };
    }

    if (workspace.stage) {
      schema["creativeWorkStatus"] = workspace.stage;
    }

    if (workspace.description || workspace.projectDescription) {
      schema["about"] =
        workspace.description || workspace.projectDescription || "";
    }

    const evidenceCount = workspace.documents?.length ?? 0;
    if (evidenceCount > 0) {
      schema["associatedMedia"] = (workspace.documents ?? [])
        .slice(0, 5)
        .map((document) => ({
          "@type": "MediaObject",
          name: document.name,
          encodingFormat: document.type,
          contentUrl: document.storagePath ?? document.previewUrl,
        }));
    }

    return JSON.stringify(schema);
  }, [
    baseUrl,
    ogImageUrl,
    projectUrl,
    workspace.buffaloAffiliated,
    workspace.createdAt,
    workspace.description,
    workspace.documents,
    workspace.lastModified,
    workspace.location,
    workspace.projectDescription,
    workspace.projectName,
    workspace.stage,
    workspace.tags,
  ]);

  return (
    <>
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      {/* Delegate all UI to the new v2 LinkedIn-inspired ProjectDetailPage */}
      <ProjectDetailPageV2
        workspace={workspace}
        currentUserId={currentUserId}
        showMinimal={false}
      />
    </>
  );
}
