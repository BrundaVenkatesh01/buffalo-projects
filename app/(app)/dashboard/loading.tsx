import { ProjectCardSkeletonGrid } from "@/components/unified";

/**
 * Dashboard Loading State
 * Automatic loading UI while dashboard content loads
 */
export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
        <div className="h-6 w-96 animate-pulse rounded-lg bg-white/5" />
      </div>

      {/* Stats skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg border border-white/10 bg-white/5"
          />
        ))}
      </div>

      {/* Projects grid skeleton */}
      <ProjectCardSkeletonGrid count={6} />
    </div>
  );
}
