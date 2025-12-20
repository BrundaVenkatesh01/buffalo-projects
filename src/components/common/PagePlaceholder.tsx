"use client";

import type { ReactNode } from "react";

import { Rocket } from "@/icons";

interface PagePlaceholderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PagePlaceholder({
  title,
  description,
  actions,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-3">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Rocket className="size-6" />
        </div>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions}
    </div>
  );
}
