import type { Metadata } from "next";

import { Button } from "@/components/unified";

export const metadata: Metadata = {
  title: "Support • Buffalo Projects",
  description:
    "Get help with publishing projects, mentor workflows, and cohort tooling on Buffalo Projects.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          Need a hand?
        </h1>
        <p className="text-sm leading-6 text-neutral-400">
          We answer within one business day. Share context, project links, or
          mentor feedback and we&apos;ll help unblock you.
        </p>
      </div>
      <a href="mailto:support@buffaloprojects.com" className="inline-flex">
        <Button
          className="rounded-full px-5 bg-white text-black hover:bg-neutral-200"
          type="button"
        >
          Email support
        </Button>
      </a>
    </div>
  );
}
