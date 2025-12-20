import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/PagePlaceholder";

interface GroupOverviewPageProps {
  params: { id: string };
}

export function generateMetadata({ params }: GroupOverviewPageProps): Metadata {
  return {
    title: `Overview • ${params.id} • Buffalo Projects`,
    description:
      "Lead/admin view for cohort triage, checkpoints, and nudges inside Buffalo Projects.",
  };
}

export default function GroupOverviewPage({ params }: GroupOverviewPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
          Lead Overview
        </p>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          {params.id.replace(/-/g, " ")}
        </h1>
      </header>
      <PagePlaceholder
        title="Lead dashboard coming online"
        description="Student • Project • Last Update • Ask • Checkpoints • Unresolved comments — the full triage table will render here soon, along with pass/needs controls and nudges."
      />
    </div>
  );
}
