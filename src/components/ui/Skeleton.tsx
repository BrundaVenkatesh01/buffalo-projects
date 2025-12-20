import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) => {
  const baseStyles = "bg-zinc-800";

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style = {
    width: width || (variant === "circular" ? "40px" : "100%"),
    height:
      height ||
      (variant === "circular" ? "40px" : variant === "text" ? "16px" : "20px"),
  };

  return (
    <div
      className={cn(
        baseStyles,
        animationStyles[animation],
        variantStyles[variant],
        className,
      )}
      style={style}
    />
  );
};

// Skeleton group for loading states
export const SkeletonGroup = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-3">{children}</div>;
};

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    <SkeletonGroup>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </SkeletonGroup>
    <div className="flex gap-2 pt-2">
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 p-3 bg-zinc-900 rounded-lg">
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="25%" />
      <Skeleton variant="text" width="25%" />
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-3 bg-zinc-800/50 rounded-lg">
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="text" width="25%" />
      </div>
    ))}
  </div>
);

// Form skeleton
export const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton variant="text" width={100} height={14} />
      <Skeleton variant="rectangular" height={40} />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width={120} height={14} />
      <Skeleton variant="rectangular" height={80} />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width={80} height={14} />
      <Skeleton variant="rectangular" height={40} />
    </div>
    <div className="flex gap-4">
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

// Canvas block skeleton for Business Model Canvas
export const CanvasBlockSkeleton = () => (
  <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
    <Skeleton variant="text" width="60%" height={20} />
    <SkeletonGroup>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="75%" />
    </SkeletonGroup>
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>

    {/* Recent projects */}
    <div className="bg-zinc-900 rounded-lg p-6">
      <Skeleton variant="text" width={200} height={24} className="mb-4" />
      <TableSkeleton rows={3} />
    </div>

    {/* Activity feed */}
    <div className="bg-zinc-900 rounded-lg p-6">
      <Skeleton variant="text" width={150} height={24} className="mb-4" />
      <ListSkeleton items={4} />
    </div>
  </div>
);
