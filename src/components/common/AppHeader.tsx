import type { ReactNode } from "react";
import { TwentySixLockBadge } from "@/components/common/TwentySixLockBadge";

interface AppHeaderProps {
  title?: string;
  titleContent?: ReactNode;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function AppHeader({
  title,
  titleContent,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: AppHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#0b0d0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {breadcrumbs}
          </div>
        )}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            {(title || titleContent) && (
              <div className="flex items-center gap-3">
            {titleContent ? (
              titleContent
            ) : (
              <>
                {title && (
                  <h1 className="font-display text-3xl font-semibold text-foreground">
                    {title}
                  </h1>
                )}
                <TwentySixLockBadge size="sm" />
                
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </>
            )}
            {titleContent && subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            </div>
            )}
            {children}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2 text-right">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
