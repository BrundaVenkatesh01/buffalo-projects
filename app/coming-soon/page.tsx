import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoonYC } from "@/components/pages/ComingSoonYC";
import { allowDemoContent } from "@/utils/env";

export const metadata: Metadata = {
  title: "Buffalo Projects - Coming Soon",
  description:
    "A decentralized platform for Buffalo entrepreneurs to promote their projects, connect with the community, and access local resources. No gatekeepers. Just builders.",
};

export default function ComingSoonPage() {
  if (!allowDemoContent()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Subtle gradient for depth, not decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-black opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        <ComingSoonYC />
      </div>
    </div>
  );
}
