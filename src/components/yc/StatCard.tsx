import { type ComponentProps } from "react";

interface StatCardProps extends Omit<ComponentProps<"div">, "className"> {
  value: string | number;
  label: string;
}

/**
 * YC-style stat card
 * Monospaced value, simple label
 */
export function StatCard({ value, label, ...props }: StatCardProps) {
  return (
    <div {...props}>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

interface StatGridProps {
  stats: Array<{
    value: string | number;
    label: string;
  }>;
  columns?: 2 | 3 | 4;
}

/**
 * Grid of stat cards
 */
export function StatGrid({ stats, columns = 2 }: StatGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {stats.map((stat, idx) => (
        <StatCard key={idx} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
