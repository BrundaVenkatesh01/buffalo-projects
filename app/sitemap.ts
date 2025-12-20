import type { DocumentSnapshot } from "firebase/firestore";
import type { MetadataRoute } from "next";

import { firebaseDatabase } from "@/services/firebaseDatabase";
import { getSiteUrl } from "@/utils/env";

const STATIC_ROUTES = [
  "/",
  "/gallery",
  "/about",
  "/support",
  "/resources",
  "/coc",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  try {
    const seen = new Set<string>();
    let cursor: DocumentSnapshot | undefined;
    let hasMore = true;
    let safetyCounter = 0;

    while (hasMore && safetyCounter < 10) {
      const result = await firebaseDatabase.getPublicWorkspacesPage({
        limit: 100,
        orderBy: "lastModified",
        orderDirection: "desc",
        ...(cursor ? { startAfter: cursor } : {}),
      });

      const { workspaces, hasMore: nextHasMore, cursor: nextCursor } = result;

      workspaces.forEach((workspace) => {
        const slug = workspace.slug ?? workspace.code;
        if (seen.has(slug)) {
          return;
        }
        seen.add(slug);
        sitemapEntries.push({
          url: `${baseUrl}/p/${slug}`,
          lastModified: workspace.lastModified
            ? new Date(workspace.lastModified)
            : undefined,
        });
      });

      hasMore = nextHasMore;
      cursor = nextCursor;
      safetyCounter += 1;

      if (!nextCursor) {
        break;
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("Failed to build dynamic sitemap entries", reason);
  }

  return sitemapEntries;
}
