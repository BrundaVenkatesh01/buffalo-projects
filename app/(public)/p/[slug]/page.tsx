import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { PublicProjectDetailScreen } from "./PublicProjectDetailScreen";

import { ProjectErrorBoundary } from "@/components/projects/ProjectErrorBoundary";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import type { Workspace } from "@/types";
import { getSiteUrl } from "@/utils/env";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const fetchWorkspaceBySlug = cache(async (slug: string) => {
  return firebaseDatabase.getPublicWorkspaceBySlug(slug);
});

/**
 * Serialize workspace data for client component
 * Converts Firestore Timestamps to ISO strings to avoid Next.js serialization errors
 */
function serializeWorkspace(workspace: Workspace): Workspace {
  return JSON.parse(
    JSON.stringify(workspace, (_key, value: unknown) => {
      // Convert Firestore Timestamps to ISO strings
      if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (value as { toDate?: unknown }).toDate === "function"
      ) {
        const timestamp = value as { toDate: () => Date };
        return timestamp.toDate().toISOString();
      }
      return value;
    }),
  ) as Workspace;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getSiteUrl();
  const workspace = await fetchWorkspaceBySlug(slug);

  if (!workspace) {
    return {
      title: "Project not found • Buffalo Projects",
      description: "This public workspace could not be found.",
      alternates: {
        canonical: `${baseUrl}/p/${slug}`,
      },
    };
  }

  const projectTitle = workspace.projectName || "Project";
  const description =
    workspace.description ||
    workspace.projectDescription ||
    "Discover Buffalo's builders in public. Publish your build log and connect with mentors.";
  const projectSlug = workspace.slug ?? slug;
  const projectUrl = `${baseUrl}/p/${projectSlug}`;
  const ogImageUrl = `${baseUrl}/api/og/${projectSlug}`;

  return {
    title: `${projectTitle} • Buffalo Projects`,
    description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: `${projectTitle} • Buffalo Projects`,
      description,
      url: projectUrl,
      siteName: "Buffalo Projects",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${projectTitle} – Buffalo Projects`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${projectTitle} • Buffalo Projects`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const workspace = await fetchWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  // Serialize workspace to convert Firestore Timestamps to plain objects
  const serializedWorkspace = serializeWorkspace(workspace);

  return (
    <ProjectErrorBoundary
      fallbackTitle="Project temporarily unavailable"
      fallbackDescription="This project page is temporarily unavailable. Please try again in a moment or contact support if the issue persists."
    >
      <PublicProjectDetailScreen workspace={serializedWorkspace} />
    </ProjectErrorBoundary>
  );
}
