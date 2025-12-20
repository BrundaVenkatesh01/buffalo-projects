"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/unified";

export function ResourcesScreen() {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative border-b border-white/5">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Buffalo Resources
          </span>
          <h1 className="font-display text-5xl leading-tight tracking-tight sm:text-6xl">
            Coming soon
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We&apos;re curating a directory of Buffalo accelerators, grants,
            co-working spaces, and mentors. Check back soon.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => {
                router.push("/signup");
              }}
              size="lg"
              className="rounded-full px-8"
            >
              Start building
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-8"
              onClick={() => {
                router.push("/projects");
              }}
            >
              View public projects
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-16 text-center">
          <h2 className="font-display text-4xl text-foreground">
            Know a resource we should include?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Help Buffalo founders by sharing programs, mentors, or funding
            opportunities.
          </p>
          <div className="mt-8">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-8"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "mailto:hello@buffaloprojects.com";
                }
              }}
            >
              Email us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
