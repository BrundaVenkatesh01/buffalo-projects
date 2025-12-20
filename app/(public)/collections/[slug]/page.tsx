import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/unified";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/unified";
import { isFirebaseConfigured } from "@/services/firebase";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import type { Workspace } from "@/types";

interface CollectionPageProps {
  params: { slug: string };
}

const COLLECTION_META: Record<
  string,
  { title: string; description: string; tags: string[] }
> = {
  "cohort-highlights": {
    title: "Cohort Highlights",
    description:
      "Hand-picked student projects showcasing traction and crisp asks.",
    tags: ["highlight", "cohort"],
  },
  "customer-discovery-wins": {
    title: "Customer Discovery Wins",
    description:
      "Evidence-backed projects demonstrating validated problem-solution fit.",
    tags: ["discovery", "customer", "interview"],
  },
  "mentor-picks": {
    title: "Mentor Picks",
    description: "Curated by mentors across Buffalo’s startup ecosystem.",
    tags: ["mentor", "mentor-pick"],
  },
};

export function generateMetadata({ params }: CollectionPageProps): Metadata {
  const meta = COLLECTION_META[params.slug] ?? {
    title: params.slug.replace(/-/g, " "),
    description: "Curated set of Buffalo Projects.",
    tags: [],
  };
  return {
    title: `Collection • ${meta.title} • Buffalo Projects`,
    description: meta.description,
  } satisfies Metadata;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const meta = COLLECTION_META[params.slug] ?? {
    title: params.slug.replace(/-/g, " "),
    description: "Curated set of Buffalo Projects.",
    tags: [],
  };

  let projects: Workspace[] = [];
  let error: string | null = null;

  if (isFirebaseConfigured) {
    try {
      const { workspaces } = await firebaseDatabase.getPublicWorkspacesPage({
        limit: 24,
        orderBy: "lastModified",
        orderDirection: "desc",
        tags: meta.tags,
      });
      projects = workspaces;
    } catch {
      error = "Unable to load collection from server.";
    }
  } else {
    // Offline mode: show empty state; we don't have server data here
    projects = [];
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <Badge
          variant="secondary"
          className="rounded-full text-xs uppercase tracking-[0.24em]"
        >
          Collection
        </Badge>
        <h1 className="font-display text-4xl text-foreground">{meta.title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {meta.description}
        </p>
      </header>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects found for this collection yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the full directory on the{" "}
            <Link className="text-primary underline" href="/gallery">
              Projects
            </Link>{" "}
            page.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((w) => {
            const slug = w.slug ?? w.code;
            return (
              <Card key={w.code} className="border-white/10 bg-white/[0.05]">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    <Link className="hover:underline" href={`/p/${slug}`}>
                      {w.projectName || "Project"}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {w.description ||
                      w.projectDescription ||
                      "A Buffalo builder project."}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
