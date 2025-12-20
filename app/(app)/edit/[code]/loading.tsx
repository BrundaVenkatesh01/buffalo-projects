/**
 * Project Editor Loading State
 * Automatic loading UI while editor initializes
 */
export default function EditProjectLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="border-b border-white/10 bg-black/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="flex gap-3">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
          </div>
        </div>
      </div>

      {/* Canvas skeleton */}
      <div className="flex-1 p-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-white/10 bg-white/5"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
