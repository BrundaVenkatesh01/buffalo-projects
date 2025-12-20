import { Skeleton } from "@/components/ui/Skeleton";

export default function PublicProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-white/10 bg-gradient-to-b from-primary/10 via-transparent to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.05] px-6 py-10 backdrop-blur-xl sm:px-10">
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  key={`badge-${index}`}
                  className="h-7 w-28 rounded-full bg-white/10"
                />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-lg bg-white/10" />
              <Skeleton className="h-5 w-full rounded-lg bg-white/10" />
              <Skeleton className="h-5 w-2/3 rounded-lg bg-white/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`stat-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <Skeleton className="mb-3 h-4 w-24 rounded bg-white/10" />
                  <Skeleton className="h-6 w-12 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="space-y-6">
              <Skeleton className="h-8 w-56 rounded bg-white/10" />
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  key={`block-${index}`}
                  className="h-36 w-full rounded-3xl bg-white/5"
                />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded bg-white/10" />
              <Skeleton className="h-32 w-full rounded-3xl bg-white/5" />
              <Skeleton className="h-32 w-full rounded-3xl bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
