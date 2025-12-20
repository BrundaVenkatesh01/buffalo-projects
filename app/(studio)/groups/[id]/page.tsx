import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Badge } from "@/components/unified";

interface GroupPageProps {
  params: { id: string };
}

export function generateMetadata({ params }: GroupPageProps): Metadata {
  return {
    title: `Group • ${params.id} • Buffalo Projects`,
    description:
      "Group hub for Buffalo cohorts with project activity, collections, and shared digests.",
  };
}

export default function GroupPage({ params }: GroupPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            Group hub
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            {params.id.replace(/-/g, " ")}
          </h1>
        </div>
        <Badge variant="secondary" className="rounded-full px-3">
          Cohort
        </Badge>
      </header>
      <PagePlaceholder
        title="Group hub migrating"
        description="Projects attached to this cohort, checkpoint status, and curated collections will appear once the Firestore adapters are wired into the Next.js app."
      />
    </div>
  );
}
