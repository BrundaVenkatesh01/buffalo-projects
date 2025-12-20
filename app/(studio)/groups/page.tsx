import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Button } from "@/components/unified";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function GroupsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            Groups
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            Cohorts & clubs
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Join classes with codes, access lab hubs, or browse Buffalo clubs
            curated by mentors.
          </p>
        </div>
        <Button className="rounded-full px-4">Join with code</Button>
      </header>
      <PagePlaceholder
        title="Group directory on the way"
        description="We’re migrating cohort membership, class codes, and group digests. Soon you’ll see your active groups, checkpoints, and latest updates here."
      />
    </div>
  );
}
