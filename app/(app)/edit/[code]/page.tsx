import type { Metadata } from "next";

import { UnifiedProjectEditor } from "./UnifiedProjectEditor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Edit Project • ${code} • Buffalo Projects`,
    description:
      "Edit your project - manage content, canvas, evidence, and showcase profile.",
  };
}

// This page requires authentication and uses client-side state
export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ code: string }>;
}

/**
 * Unified Project Editor Page
 *
 * Single canonical URL for editing all project types.
 * Replaces the old /workspace/[code] and /showcase/[code] routes.
 *
 * The UnifiedProjectEditor component handles routing to the appropriate
 * editor based on the project's projectType field.
 */
export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { code } = await params;
  return <UnifiedProjectEditor workspaceCode={code} />;
}
