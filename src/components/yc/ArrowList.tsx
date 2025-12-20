import type React from "react";
import { type ComponentProps } from "react";

import { cn } from "@/utils/cn";

interface ArrowListProps extends Omit<ComponentProps<"ul">, "className"> {
  items: Array<{
    title?: string;
    description: string | React.ReactNode;
  }>;
  arrowColor?: "blue" | "green" | "purple";
}

const arrowColors = {
  blue: "text-blue-400",
  green: "text-green-400",
  purple: "text-purple-400",
};

/**
 * YC-style arrow bullet list
 * Left-aligned, scannable, with monospaced arrows
 */
export function ArrowList({
  items,
  arrowColor = "blue",
  ...props
}: ArrowListProps) {
  return (
    <ul className="space-y-3" {...props}>
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3">
          <span className={cn("font-mono shrink-0", arrowColors[arrowColor])}>
            →
          </span>
          <span className="text-slate-300 leading-relaxed">
            {item.title && <strong className="text-white">{item.title}</strong>}
            {item.title && " "}
            {item.description}
          </span>
        </li>
      ))}
    </ul>
  );
}
