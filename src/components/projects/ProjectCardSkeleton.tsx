import { Card, CardContent, CardHeader, Skeleton } from "@/components/unified";
import { cn } from "@/lib/utils";

/**
 * ProjectCardSkeleton Component
 *
 * Loading skeleton for ProjectCard with variant support.
 * Matches the structure and size of actual ProjectCard variants.
 */

export interface ProjectCardSkeletonProps {
  /** Display variant matching ProjectCard */
  variant?: "compact" | "medium" | "full";

  /** Optional className for customization */
  className?: string;

  /** Show cover image skeleton */
  showCoverImage?: boolean;
}

export function ProjectCardSkeleton({
  variant = "medium",
  className,
  showCoverImage = false,
}: ProjectCardSkeletonProps) {
  // Variant-specific styles
  const variantStyles = {
    compact: {
      container: "h-full",
      card: "p-4",
      header: "pb-2",
      titleHeight: "h-4",
      descriptionHeight: "h-3",
      badgeHeight: "h-4",
      badgeWidth: "w-12",
    },
    medium: {
      container: "h-full",
      card: "p-6",
      header: "pb-3",
      titleHeight: "h-5",
      descriptionHeight: "h-4",
      badgeHeight: "h-5",
      badgeWidth: "w-16",
    },
    full: {
      container: "h-full",
      card: "p-8",
      header: "pb-4",
      titleHeight: "h-6",
      descriptionHeight: "h-5",
      badgeHeight: "h-6",
      badgeWidth: "w-20",
    },
  }[variant];

  return (
    <div className={cn(variantStyles.container, className)}>
      <Card className={cn("h-full", variantStyles.card)}>
        {/* Cover Image Skeleton */}
        {showCoverImage && variant !== "compact" && (
          <Skeleton className="w-full h-48 -mt-8 -mx-8 mb-4 rounded-t-xl" />
        )}

        <CardHeader className={cn(variantStyles.header, "space-y-2")}>
          {/* Badges Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Skeleton
              className={cn(
                variantStyles.badgeHeight,
                variantStyles.badgeWidth,
              )}
            />
            <Skeleton
              className={cn(
                variantStyles.badgeHeight,
                variantStyles.badgeWidth,
              )}
            />
            {variant === "compact" && (
              <>
                <Skeleton
                  className={cn(
                    variantStyles.badgeHeight,
                    variantStyles.badgeWidth,
                  )}
                />
                <Skeleton
                  className={cn(
                    variantStyles.badgeHeight,
                    variantStyles.badgeWidth,
                  )}
                />
              </>
            )}
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className={cn("w-3/4", variantStyles.titleHeight)} />
            {variant !== "compact" && (
              <Skeleton className={cn("w-1/2", variantStyles.titleHeight)} />
            )}
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton
              className={cn("w-full", variantStyles.descriptionHeight)}
            />
            <Skeleton
              className={cn("w-5/6", variantStyles.descriptionHeight)}
            />
            {variant === "full" && (
              <>
                <Skeleton
                  className={cn("w-4/5", variantStyles.descriptionHeight)}
                />
                <Skeleton
                  className={cn("w-2/3", variantStyles.descriptionHeight)}
                />
              </>
            )}
          </div>
        </CardHeader>

        {/* Card Content */}
        {variant !== "compact" && (
          <CardContent className="space-y-3">
            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Stats Row Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

/**
 * ProjectCardSkeletonGrid Component
 *
 * Renders a grid of skeleton cards for loading states.
 * Useful for gallery/profile page loading.
 */

export interface ProjectCardSkeletonGridProps {
  /** Number of skeleton cards to show */
  count?: number;

  /** Display variant */
  variant?: "compact" | "medium" | "full";

  /** Grid column configuration */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };

  /** Show cover images on skeletons */
  showCoverImages?: boolean;
}

export function ProjectCardSkeletonGrid({
  count = 6,
  variant = "medium",
  columns = { sm: 1, md: 2, lg: 3 },
  showCoverImages = false,
}: ProjectCardSkeletonGridProps) {
  const gridClasses = cn(
    "grid gap-6",
    columns.sm === 1 && "grid-cols-1",
    columns.sm === 2 && "grid-cols-2",
    columns.md === 2 && "md:grid-cols-2",
    columns.md === 3 && "md:grid-cols-3",
    columns.lg === 3 && "lg:grid-cols-3",
    columns.lg === 4 && "lg:grid-cols-4",
  );

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton
          key={index}
          variant={variant}
          showCoverImage={showCoverImages}
        />
      ))}
    </div>
  );
}
