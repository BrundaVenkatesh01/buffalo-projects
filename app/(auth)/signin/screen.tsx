"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui-next";
import { Input } from "@/components/ui-next";
import { useAuthStore } from "@/stores/authStore";

export function SignInScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signIn, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timeoutError, setTimeoutError] = useState<string | null>(null);

  // Prefetch likely next destinations for instant navigation
  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/dashboard/discover");
  }, [router]);

  // Redirect already-authenticated users
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get("redirect");
      const destination: Route =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? (redirect as Route)
          : "/profile";
      router.replace(destination);
    }
  }, [user, loading, searchParams, router]);

  // Add timeout for loading state (5 seconds)
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setTimeoutError(
          "Authentication is taking longer than expected. Please check your internet connection and try again.",
        );
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      setTimeoutError(null);
      return undefined;
    }
  }, [loading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    setTimeoutError(null);

    try {
      await signIn(email, password);
      const raw = searchParams.get("redirect") || "/dashboard";
      const fallbackRoute: Route = "/dashboard";
      const safeRoute =
        raw.startsWith("/") && !raw.startsWith("//")
          ? (raw as Route)
          : fallbackRoute;
      router.replace(safeRoute);
    } catch {
      // handled by store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg rounded-lg border border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-4xl font-bold tracking-tight text-foreground">
            Sign in
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Continue building your project.
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {(error || timeoutError) && (
              <Alert
                variant="destructive"
                className="rounded-lg border-red-600/30 bg-red-950/10 text-red-200"
              >
                <AlertDescription className="text-xs">
                  {error || timeoutError}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@buffaloprojects.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                className="h-14 rounded-lg border-border bg-background text-base placeholder:text-muted-foreground/40 focus-visible:border-primary/50 focus-visible:ring-0"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </Label>
                <Link
                  href="/support"
                  className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="h-14 rounded-lg border-border bg-background text-base placeholder:text-muted-foreground/40 focus-visible:border-primary/50 focus-visible:ring-0"
              />
            </div>
          </CardContent>

          {/* Footer Actions */}
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="h-12 w-full rounded-lg text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="flex w-full flex-col gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                New to Buffalo Projects?{" "}
                <Link
                  href="/join"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
