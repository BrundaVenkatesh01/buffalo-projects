"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectShowcaseProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * ProjectShowcase - Simple image grid
 * No demo cards (CTAs in header), just screenshots
 */
export function ProjectShowcase({
  workspace,
  className,
}: ProjectShowcaseProps) {
  const { assets, documents } = workspace;

  // Collect all images
  const images: Array<{ url: string; name: string }> = [];

  if (assets?.screenshots) {
    assets.screenshots.forEach((url, index) => {
      images.push({
        url,
        name: `Screenshot ${index + 1}`,
      });
    });
  }

  if (documents) {
    documents
      .filter((doc) => doc.type === "image" && doc.url)
      .forEach((doc) => {
        images.push({
          url: doc.url!,
          name: doc.name,
        });
      });
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className={cn("border-t border-white/10 py-6 md:py-8", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-3 text-sm font-medium text-neutral-400">
          Screenshots
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5"
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
