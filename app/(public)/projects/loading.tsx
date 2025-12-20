import { Skeleton } from "@/components/ui/Skeleton";

const CARD_COUNT = 6;

export default function PublicProjectsLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-full bg-white/10" />
          <Skeleton className="h-10 w-full max-w-2xl rounded-full bg-white/10" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={`filter-${index}`}
                className="h-9 w-28 rounded-full bg-white/10"
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <div
              key={`card-${index}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <Skeleton className="mb-4 h-4 w-24 rounded-full bg-white/10" />
              <Skeleton className="mb-2 h-6 w-3/4 rounded-full bg-white/10" />
              <Skeleton className="mb-6 h-4 w-full rounded-full bg-white/10" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, badgeIndex) => (
                  <Skeleton
                    key={`badge-${index}-${badgeIndex}`}
                    className="h-8 w-20 rounded-full bg-white/10"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
