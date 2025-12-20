import { Link } from "react-router-dom";

import { ChevronRight } from "@/icons";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground",
          className,
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1"
            >
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="rounded-full px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="rounded-full px-3 py-1 text-[11px] text-muted-foreground/80"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="h-3 w-3 text-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
