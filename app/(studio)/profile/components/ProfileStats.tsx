"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  projects: number;
  pivots: number;
  publicProjects: number;
  versions: number;
  comments?: number;
}

interface StatCardProps {
  value: number;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  clickable?: boolean;
  gradient: string;
  iconColor: string;
}

function StatCard({
  value,
  label,
  sublabel,
  onClick,
  clickable = false,
  gradient,
  iconColor,
}: StatCardProps) {
  const isEmpty = value === 0;
  
  return (
    <button
      type="button"
      className={cn(
        "group relative rounded-xl border transition-all duration-200 text-left w-full overflow-hidden",
        clickable &&
          !isEmpty && [
            "cursor-pointer",
            "hover:scale-[1.02]",
            "active:scale-[0.98]",
          ],
        !clickable && "cursor-default",
        isEmpty && "opacity-60",
        "border-white/10 bg-gradient-to-br backdrop-blur-sm",
        gradient,
      )}
      onClick={!isEmpty && clickable ? onClick : undefined}
      disabled={isEmpty || !clickable}
      aria-label={`${label}: ${value}`}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10",
        gradient
      )} />
      
      <div className="p-4 relative">
        <div
          className={cn(
            "text-4xl font-bold tabular-nums leading-none tracking-tight mb-2",
            "bg-gradient-to-br bg-clip-text text-transparent",
            iconColor
          )}
        >
          {value}
        </div>
        
        <div className="text-sm font-semibold text-white">{label}</div>
        
        {sublabel && (
          <div className="text-xs text-neutral-300 mt-0.5">{sublabel}</div>
        )}
      </div>

      <div className={cn(
        "absolute top-0 right-0 w-20 h-20 opacity-20 blur-2xl rounded-full",
        gradient
      )} />
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
      gradient: "from-blue-500/20 via-blue-600/10 to-purple-500/20",
      iconColor: "from-blue-400 to-purple-400",
    },
    {
      value: publicProjects,
      label: "Published",
      sublabel: publicProjects === 1 ? "Public project" : "Public projects",
      onClick: () => router.push("/dashboard/discover"),
      clickable: false,
      gradient: "from-green-500/20 via-emerald-600/10 to-teal-500/20",
      iconColor: "from-green-400 to-teal-400",
    },
  ];

  if (pivots > 0) {
    stats.push({
      value: pivots,
      label: "Pivots",
      sublabel: pivots === 1 ? "Major pivot" : "Major pivots",
      onClick: () => {
        // Non-clickable stat
      },
      clickable: false,
      gradient: "from-orange-500/20 via-amber-600/10 to-yellow-500/20",
      iconColor: "from-orange-400 to-yellow-400",
    });
  }

  if (versions > 1) {
    stats.push({
      value: versions,
      label: "Versions",
      sublabel: "Saved snapshots",
      onClick: () => {
        // Non-clickable stat
      },
      clickable: false,
      gradient: "from-pink-500/20 via-rose-600/10 to-red-500/20",
      iconColor: "from-pink-400 to-rose-400",
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