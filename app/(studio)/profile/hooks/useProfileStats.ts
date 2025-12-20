import { useMemo } from "react";

import type { Workspace } from "@/types";

export function useProfileStats(workspaces: Workspace[], userId?: string) {
  return useMemo(() => {
    const userWorkspaces = workspaces.filter((w) => w.ownerId === userId);
    const publicProjects = userWorkspaces.filter((w) => w.isPublic).length;
    const totalPivots = userWorkspaces.reduce(
      (acc, w) => acc + (w.pivots?.length || 0),
      0,
    );
    const totalVersions = userWorkspaces.reduce(
      (acc, w) => acc + (w.versions?.length || 0),
      0,
    );

    return {
      projects: userWorkspaces.length,
      publicProjects,
      pivots: totalPivots,
      versions: totalVersions,
      comments: 0, // TODO: Integrate comment count when comment service is ready
    };
  }, [workspaces, userId]);
}
