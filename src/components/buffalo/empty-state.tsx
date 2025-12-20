import type React from "react";

import { Button } from "@/components/ui-next";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "primary" | "secondary" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      {icon && (
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground [&_svg]:h-8 [&_svg]:w-8">
          {icon}
        </div>
      )}
      <h3 className="mb-3 text-2xl font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button
              size="lg"
              variant={action.variant || "primary"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
