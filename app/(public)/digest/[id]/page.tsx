import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/PagePlaceholder";

interface DigestPageProps {
  params: { id: string };
}

export function generateMetadata({ params }: DigestPageProps): Metadata {
  return {
    title: `Digest ${params.id} • Buffalo Projects`,
    description:
      "Weekly highlights from Buffalo cohorts, labs, and public project launches.",
  };
}

export default function DigestPage({ params }: DigestPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
          Weekly Digest
        </p>
        <h1 className="font-display text-4xl text-foreground">
          Digest #{params.id}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Cohort leads drag 3–5 standout projects into this digest, share notes,
          and optionally publish a public view with builder consent.
        </p>
      </header>
      <PagePlaceholder
        title="Digest publishing in progress"
        description="Drag-to-compose digest tooling lives in the cohort workspace. Public digest pages will render featured projects, asks, and proof chips once the publishing pipeline is wired."
      />
    </div>
  );
}
