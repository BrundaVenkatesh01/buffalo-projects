import { Badge } from "@/components/ui-next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-next";
import type { Workspace } from "@/types";

interface WorkspaceProgressProps {
  workspace: Workspace;
}

const recommendations = [
  {
    check: (workspace: Workspace) =>
      Object.values(workspace.bmcData).filter(
        (value) => value?.trim().length > 0,
      ).length < 3,
    label:
      "Fill in your value proposition and key customer segments to unlock tailored AI prompts.",
  },
  {
    check: (workspace: Workspace) => (workspace.journal?.length ?? 0) === 0,
    label:
      "Log your first journal entry to capture insights and auto-link pivot snapshots.",
  },
  {
    check: (workspace: Workspace) => (workspace.versions?.length ?? 0) < 1,
    label: "Trigger a snapshot by saving to compare pivots week over week.",
  },
  {
    check: () => true,
    label:
      "Upload interview notes or decks so AI suggestions stay grounded in real data.",
  },
];

export function WorkspaceProgress({ workspace }: WorkspaceProgressProps) {
  const filledSections = Object.values(workspace.bmcData).filter(
    (value) => (value?.trim().length ?? 0) > 0,
  ).length;
  const totalSections = 9;
  const progress = Math.round((filledSections / totalSections) * 100);
  const journalCount = workspace.journal?.length ?? 0;
  const pivotCount = workspace.pivots?.length ?? 0;
  const documentCount = workspace.documents?.length ?? 0;

  const nextStep = recommendations.find((recommendation) =>
    recommendation.check(workspace),
  );

  return (
    <Card variant="light" className="border-white/10 bg-white/5">
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-lg text-foreground">
            Workspace momentum
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Keep filling your canvas and journal to surface pivot insights
            faster.
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-white/20 text-xs text-muted-foreground"
        >
          {progress}% complete
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em]">Canvas blocks</p>
            <p className="mt-1 text-sm text-foreground">
              {filledSections} of {totalSections} filled
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em]">
              Journal entries
            </p>
            <p className="mt-1 text-sm text-foreground">{journalCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em]">Pivots & docs</p>
            <p className="mt-1 text-sm text-foreground">
              {pivotCount} pivots · {documentCount} documents
            </p>
          </div>
        </div>
        {nextStep && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-foreground">
            Next step: {nextStep.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkspaceProgress;
