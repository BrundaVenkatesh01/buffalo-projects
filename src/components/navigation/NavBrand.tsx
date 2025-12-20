"use client";

import { useRouter } from "next/navigation";

import { AnimatedLogo } from "@/components/common/AnimatedLogo";
import { useAuthStore } from "@/stores/authStore";

/**
 * Navigation brand/logo with smart routing
 * Logged in → dashboard, logged out → home
 */
export function NavBrand() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <button
      type="button"
      className="group flex items-center rounded-md border border-transparent bg-transparent px-1.5 py-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={() => {
        router.push(user ? "/dashboard" : "/");
      }}
      aria-label={user ? "Go to dashboard" : "Buffalo Projects home"}
    >
      <AnimatedLogo size="md" />
    </button>
  );
}

export default NavBrand;
