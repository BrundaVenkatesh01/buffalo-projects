"use client";

import { useMemo } from "react";

import { Check, X } from "@/icons";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    label: "Contains uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    label: "Contains lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    label: "Contains number",
    test: (p) => /\d/.test(p),
  },
  {
    label: "Contains special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) {
      return 0;
    }

    const passed = requirements.filter((req) => req.test(password)).length;
    const percentage = (passed / requirements.length) * 100;

    if (percentage <= 20) {
      return 1;
    } // Very weak
    if (percentage <= 40) {
      return 2;
    } // Weak
    if (percentage <= 60) {
      return 3;
    } // Fair
    if (percentage <= 80) {
      return 4;
    } // Good
    return 5; // Strong
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) {
      return "";
    }
    if (strength === 1) {
      return "Very weak";
    }
    if (strength === 2) {
      return "Weak";
    }
    if (strength === 3) {
      return "Fair";
    }
    if (strength === 4) {
      return "Good";
    }
    return "Strong";
  }, [password, strength]);

  const strengthColor = useMemo(() => {
    if (strength === 1) {
      return "bg-red-500";
    }
    if (strength === 2) {
      return "bg-orange-500";
    }
    if (strength === 3) {
      return "bg-yellow-500";
    }
    if (strength === 4) {
      return "bg-lime-500";
    }
    return "bg-green-500";
  }, [strength]);

  const strengthTextColor = useMemo(() => {
    if (strength === 1) {
      return "text-red-400";
    }
    if (strength === 2) {
      return "text-orange-400";
    }
    if (strength === 3) {
      return "text-yellow-400";
    }
    if (strength === 4) {
      return "text-lime-400";
    }
    return "text-green-400";
  }, [strength]);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  level <= strength
                    ? strengthColor
                    : "bg-white/5 dark:bg-neutral-800",
                )}
              />
            ))}
          </div>
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-300",
              strengthTextColor,
            )}
          >
            {strengthLabel}
          </span>
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-2">
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-xs transition-all duration-200"
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200",
                    passed
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-neutral-600",
                  )}
                >
                  {passed ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </div>
                <span
                  className={cn(
                    "transition-colors duration-200",
                    passed ? "text-neutral-300" : "text-neutral-500",
                  )}
                >
                  {req.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
