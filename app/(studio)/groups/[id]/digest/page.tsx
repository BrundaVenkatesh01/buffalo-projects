import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Button } from "@/components/unified";

interface GroupDigestPageProps {
  params: { id: string };
}

export function generateMetadata({ params }: GroupDigestPageProps): Metadata {
  return {
    title: `Digest Composer • ${params.id} • Buffalo Projects`,
    description:
      "Drag-to-compose cohort digest for weekly highlights and mentor-ready updates.",
  };
}

export default function GroupDigestPage({ params }: GroupDigestPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            Digest Composer
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            {params.id.replace(/-/g, " ")}
          </h1>
        </div>
        <Button className="rounded-full px-4">Publish digest</Button>
      </header>
      <PagePlaceholder
        title="Digest builder nearly ready"
        description="Drag 3–5 projects into a digest, add commentary, and publish to cohort + optional public page. This experience is being migrated from the legacy workspace."
      />
    </div>
  );
}
