import { ProjectCardSkeletonGrid } from "@/components/unified";

/**
 * Discover Loading State
 * Automatic loading UI while gallery loads
 */
export default function DiscoverLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
        <div className="h-6 w-96 animate-pulse rounded-lg bg-white/5" />
      </div>

      {/* Filters skeleton */}
      <div className="mb-6 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 animate-pulse rounded-lg bg-white/5"
          />
        ))}
      </div>

      {/* Gallery grid skeleton */}
      <ProjectCardSkeletonGrid count={9} />
    </div>
  );
}
