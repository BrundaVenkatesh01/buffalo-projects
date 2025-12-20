/**
 * ProjectCardSkeleton - Loading state for featured projects
 * Used with React Suspense for smooth lazy loading
 */

import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/unified";

export function ProjectCardSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </Card>
  );
}

export function FeaturedProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
