import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
