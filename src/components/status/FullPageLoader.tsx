import { Loader2 } from "@/icons";

interface FullPageLoaderProps {
  message?: string;
  fullHeight?: boolean;
}

export function FullPageLoader({
  message = "Loading Buffalo Projects",
  fullHeight = true,
}: FullPageLoaderProps) {
  const containerClass = fullHeight ? "min-h-screen" : "min-h-[50vh]";

  return (
    <div
      className={`flex ${containerClass} flex-col items-center justify-center gap-3 bg-background px-4 text-muted-foreground`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      <span className="text-xs uppercase tracking-[0.24em]">{message}</span>
    </div>
  );
}
