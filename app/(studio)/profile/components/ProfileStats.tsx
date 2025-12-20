"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { BUFFALO_BRAND } from "@/tokens/brand";

interface ProfileStatsProps {
  projects: number;
  pivots: number;
  publicProjects: number;
  versions: number;
  comments?: number; // Optional for backwards compatibility
}

interface StatCardProps {
  value: number;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  clickable?: boolean;
}

function StatCard({
  value,
  label,
  sublabel,
  onClick,
  clickable = false,
}: StatCardProps) {
  const isEmpty = value === 0;

  return (
    <button
      type="button"
      className={cn(
        "group relative rounded-lg border transition-all duration-200 text-left w-full",
        clickable &&
          !isEmpty && [
            "cursor-pointer",
            "hover:border-primary/30 hover:bg-primary/5",
            "active:scale-[0.98]",
          ],
        !clickable && "cursor-default",
        isEmpty && "opacity-50",
        "border-border/50 bg-card/50",
      )}
      onClick={!isEmpty && clickable ? onClick : undefined}
      disabled={isEmpty || !clickable}
      aria-label={`${label}: ${value}`}
    >
      <div className="p-4">
        {/* Value */}
        <div
          className="text-3xl font-bold tabular-nums leading-none tracking-tight mb-2"
          style={{
            color: !isEmpty ? BUFFALO_BRAND.blue.primary : undefined,
          }}
        >
          {value}
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-foreground">{label}</div>

        {/* Sublabel */}
        {sublabel && (
          <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>
        )}
      </div>
    </button>
  );
}

export function ProfileStats({
  projects,
  pivots,
  publicProjects,
  versions,
}: ProfileStatsProps) {
  const router = useRouter();

  const stats = [
    {
      value: projects,
      label: "Projects",
      sublabel: projects === 1 ? "Total project" : "Total projects",
      onClick: () => {
        document
          .getElementById("profile-projects")
          ?.scrollIntoView({ behavior: "smooth" });
      },
      clickable: true,
    },
    {
      value: publicProjects,
      label: "Published",
      sublabel: publicProjects === 1 ? "Public project" : "Public projects",
      onClick: () => router.push("/dashboard/discover"),
      clickable: false, // Temporarily disabled - Discover page under redesign
    },
  ];

  // Only show pivots if user has any
  if (pivots > 0) {
    stats.push({
      value: pivots,
      label: "Pivots",
      sublabel: pivots === 1 ? "Major pivot" : "Major pivots",
      onClick: () => {
        // Non-clickable stat
      },
      clickable: false,
    });
  }

  // Only show versions if user has multiple
  if (versions > 1) {
    stats.push({
      value: versions,
      label: "Versions",
      sublabel: "Saved snapshots",
      onClick: () => {
        // Non-clickable stat
      },
      clickable: false,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
