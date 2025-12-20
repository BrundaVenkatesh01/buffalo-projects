/**
 * FeaturedProjects - Async component for homepage featured projects
 * Separated for lazy loading and Suspense optimization
 */

import Link from "next/link";

import { StaggerContainer, StaggerItem } from "@/components/motion";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/unified";
import { cn } from "@/lib/utils";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import type { Workspace } from "@/types";

interface ProjectCardProps {
  project: Workspace;
}

function ProjectCard({ project }: ProjectCardProps) {
  const stageColors = {
    idea: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    building: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    testing: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    launching: "bg-green-500/20 text-green-300 border-green-500/30",
  };

  const stage = project.stage || "idea";

  // Only render if project has a slug (all published projects should)
  if (!project.slug) {
    return null;
  }

  return (
    <Link href={`/p/${project.slug}`}>
      <Card className="group h-full p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-3">
          <Badge
            className={cn(
              "text-xs px-2 py-1",
              stageColors[stage as keyof typeof stageColors],
            )}
          >
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </Badge>
          {project.buffaloAffiliated && (
            <Badge className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Buffalo
            </Badge>
          )}
        </div>

        <CardTitle className="mb-2 group-hover:text-blue-400 transition-colors">
          {project.projectName || "Untitled Project"}
        </CardTitle>

        <CardDescription className="line-clamp-3 mb-4">
          {project.oneLiner ||
            project.description ||
            "Building something new..."}
        </CardDescription>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

interface FeaturedProjectsProps {
  viewAllHref?: string;
}

export async function FeaturedProjects({
  viewAllHref = "/projects",
}: FeaturedProjectsProps) {
  const { projects } = await firebaseDatabase.getPublicProjects({
    limit: 6,
    orderBy: "publishedAt",
    direction: "desc",
  });

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 mb-6">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Be the first Buffalo builder
        </h3>
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
          Start your project today. Document your journey. Show other
          entrepreneurs that building in public works.
        </p>
        <Button variant="primary" size="lg">
          <Link href="/signup">Share your project →</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <StaggerItem key={project.code}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      <div className="text-center">
        <Link href={viewAllHref}>
          <Button variant="secondary" size="lg">
            View all projects →
          </Button>
        </Link>
      </div>
    </>
  );
}
