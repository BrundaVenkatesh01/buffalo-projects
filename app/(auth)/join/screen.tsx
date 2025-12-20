"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui-next";
import { Input } from "@/components/ui-next";
import { useAuthStore } from "@/stores/authStore";

type Experience = "student" | "first_time" | "serial" | "educator";

export function SignUpScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signUp, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    buffaloConnection: "",
    entrepreneurshipExperience: "" as Experience | "",
  });
  const [passwordError, setPasswordError] = useState("");
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
    setPasswordError("");
    setTimeoutError(null);

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords must match");
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    // Check for stronger password requirements
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setPasswordError(
        "Password must contain uppercase, lowercase, and numbers",
      );
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        ...(formData.firstName ? { firstName: formData.firstName } : {}),
        ...(formData.lastName ? { lastName: formData.lastName } : {}),
        ...(formData.buffaloConnection
          ? { buffaloConnection: formData.buffaloConnection }
          : {}),
        ...(formData.entrepreneurshipExperience
          ? { entrepreneurshipExperience: formData.entrepreneurshipExperience }
          : {}),
      });

      // Redirect new users to dashboard
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Create account
          </h1>
          <p className="text-lg text-muted-foreground">
            Join Buffalo&apos;s builder community.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-8"
        >
          {/* Error Alert */}
          {(error || passwordError || timeoutError) && (
            <Alert
              variant="destructive"
              className="border border-red-500/30 bg-red-500/10 text-red-200"
            >
              <AlertDescription className="text-sm">
                {error || passwordError || timeoutError}
              </AlertDescription>
            </Alert>
          )}

          {/* Name Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label
                htmlFor="firstName"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                First name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Jordan"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={loading}
                className="h-14 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="lastName"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Last name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Williams"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={loading}
                className="h-14 text-base"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-3">
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              autoComplete="email"
              disabled={loading}
              className="h-14 text-base"
            />
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-14 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-14 text-base"
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator
              password={formData.password}
              showRequirements={true}
            />
          </div>

          {/* Buffalo Connection */}
          <div className="space-y-3">
            <Label
              htmlFor="buffaloConnection"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Buffalo connection{" "}
              <span className="text-xs normal-case text-muted-foreground/60">
                (Optional)
              </span>
            </Label>
            <Input
              id="buffaloConnection"
              placeholder="UB student, 43North founder, etc."
              value={formData.buffaloConnection}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buffaloConnection: e.target.value,
                })
              }
              disabled={loading}
              className="h-14 text-base"
            />
          </div>

          {/* Experience Select */}
          <div className="space-y-3">
            <Label
              htmlFor="experience"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Builder experience{" "}
              <span className="text-xs normal-case text-muted-foreground/60">
                (Optional)
              </span>
            </Label>
            <Select
              value={formData.entrepreneurshipExperience}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  entrepreneurshipExperience: value as Experience,
                })
              }
              disabled={loading}
            >
              <SelectTrigger id="experience" className="h-14 text-base">
                <SelectValue placeholder="Choose your experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student builder</SelectItem>
                <SelectItem value="first_time">First-time founder</SelectItem>
                <SelectItem value="serial">Serial entrepreneur</SelectItem>
                <SelectItem value="educator">Educator / mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="h-14 w-full text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-base text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
