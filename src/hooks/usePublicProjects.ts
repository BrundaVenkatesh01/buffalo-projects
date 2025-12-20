import type { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { firebaseDatabase } from "@/services/firebaseDatabase";
import type { Workspace } from "@/types";

interface UsePublicProjectsOptions {
  limit?: number;
}

interface UsePublicProjectsResult {
  projects: Workspace[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function usePublicProjects(
  options: UsePublicProjectsOptions = {},
): UsePublicProjectsResult {
  const { limit = 20 } = options;
  const [projects, setProjects] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchPage = useCallback(
    async (
      optionsOverride: {
        startAfter?: DocumentSnapshot | null;
        append?: boolean;
      } = {},
    ) => {
      const { startAfter = null, append = false } = optionsOverride;
      const page = await firebaseDatabase.getPublicWorkspacesPage({
        limit,
        orderBy: "lastModified",
        orderDirection: "desc",
        ...(startAfter ? { startAfter } : {}),
      });

      setProjects((prev) => {
        if (append) {
          const map = new Map(prev.map((project) => [project.code, project]));
          page.workspaces.forEach((workspace) => {
            map.set(workspace.code, workspace);
          });
          return Array.from(map.values());
        }
        return page.workspaces;
      });

      setCursor(page.cursor ?? null);
      setHasMore(page.hasMore);
    },
    [limit],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchPage({ append: false });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      setError(reason);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) {
      return;
    }
    setLoadingMore(true);
    try {
      await fetchPage({ startAfter: cursor, append: true });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      setError(reason);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, fetchPage, hasMore, loadingMore]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    projects,
    loading,
    error,
    hasMore,
    loadingMore,
    refresh,
    loadMore,
  };
}
