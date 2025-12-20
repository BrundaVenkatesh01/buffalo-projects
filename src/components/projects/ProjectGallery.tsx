"use client";

import { m } from "framer-motion";
import Image from "next/image";

import { Badge } from "@/components/unified";
import { cn } from "@/lib/utils";
import {
  PROJECT_PAGE,
  PROJECT_ANIMATIONS,
} from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

/**
 * ProjectGallery Component
 *
 * Visual showcase of all project images.
 * Combines: cover image, screenshots, image documents
 *
 * Progressive enhancement: only shows if images exist
 *
 * Features:
 * - Responsive grid: 2 → 3 → 4 columns
 * - aspect-video for all images
 * - Hover effects: scale, shadow
 * - Lazy loading with Next.js Image
 * - Click to open in new tab
 * - "Cover" badge on cover image
 */

export interface ProjectGalleryProps {
  workspace: Workspace;
  className?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  isCover?: boolean;
  isScreenshot?: boolean;
  isDocument?: boolean;
}

export function ProjectGallery({ workspace, className }: ProjectGalleryProps) {
  const images: GalleryImage[] = [];

  // Add cover image
  if (workspace.assets?.coverImage) {
    images.push({
      id: "cover",
      url: workspace.assets.coverImage,
      name: workspace.projectName || "Cover Image",
      isCover: true,
    });
  }

  // Add screenshots
  if (workspace.assets?.screenshots) {
    workspace.assets.screenshots.forEach((screenshot, index) => {
      images.push({
        id: `screenshot-${index}`,
        url: screenshot,
        name: `Screenshot ${index + 1}`,
        isScreenshot: true,
      });
    });
  }

  // Add image documents
  if (workspace.documents) {
    const imageDocuments = workspace.documents.filter(
      (doc) => doc.type === "image" && (doc.storagePath || doc.previewUrl),
    );
    imageDocuments.forEach((doc) => {
      images.push({
        id: doc.id,
        url: doc.storagePath || doc.previewUrl || "",
        name: doc.name,
        isDocument: true,
      });
    });
  }

  // Don't render if no images
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2
          className={cn(
            PROJECT_PAGE.section.header.size,
            PROJECT_PAGE.section.header.tracking,
            PROJECT_PAGE.section.header.transform,
            PROJECT_PAGE.section.header.weight,
            PROJECT_PAGE.section.header.color,
          )}
        >
          Visual Gallery
        </h2>
        <Badge variant="secondary" className="text-xs font-medium">
          {images.length} {images.length === 1 ? "image" : "images"}
        </Badge>
      </div>

      {/* Images Grid */}
      <div
        className={cn(
          "grid gap-4",
          "grid-cols-2",
          "md:grid-cols-3",
          "lg:grid-cols-4",
        )}
      >
        {images.map((image, index) => (
          <m.a
            key={image.id}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative overflow-hidden",
              PROJECT_PAGE.gallery.aspectRatio,
              PROJECT_PAGE.gallery.image.rounded,
              PROJECT_PAGE.gallery.image.ring,
              "transition-all",
              PROJECT_PAGE.gallery.image.hover.duration,
              "hover:ring-primary/50",
              "hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            animate={PROJECT_ANIMATIONS.entrance.section.animate}
            transition={{
              ...PROJECT_ANIMATIONS.entrance.section.transition,
              delay: index * 0.05, // Faster stagger for gallery
            }}
            aria-label={`View ${image.name}`}
          >
            {/* Image */}
            <Image
              src={image.url}
              alt={image.name}
              fill
              className={cn(
                "object-cover",
                "transition-transform duration-300",
                "group-hover:scale-105",
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
                "opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100",
              )}
            >
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="truncate text-sm font-medium text-white">
                  {image.name}
                </p>
                {image.isCover && (
                  <Badge className="mt-2 bg-primary text-primary-foreground">
                    Cover
                  </Badge>
                )}
              </div>
            </div>
          </m.a>
        ))}
      </div>

      {/* Gallery Info */}
      {images.length > 8 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Showcasing {images.length} visuals from this project
        </p>
      )}
    </div>
  );
}
