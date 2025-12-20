"use client";

import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/unified";
import { Github, Globe, Linkedin, Briefcase, Users } from "@/icons";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { headingStyles, bodyStyles } from "@/styles/typography";
import type { User, Workspace } from "@/types";
import { getPublicProjectUrl } from "@/utils/projectUrls";

interface CreatorWithProjects {
  creator: User;
  projects: Workspace[];
  totalProjects: number;
  gives: string[];
  asks: string[];
}

export function MembersScreen() {
  const [creatorsData, setCreatorsData] = useState<CreatorWithProjects[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreatorsWithProjects() {
      try {
        // Fetch public creators
        const publicCreators = await firebaseDatabase.getPublicCreators({
          limit: 50,
        });

        // Fetch all public workspaces
        const workspaces = await firebaseDatabase.getPublicWorkspaces({
          limit: 100,
        });

        // Group workspaces by creator and aggregate gives/asks
        const creatorMap = new Map<string, CreatorWithProjects>();

        for (const creator of publicCreators) {
          const creatorProjects = workspaces.filter(
            (w: Workspace) =>
              w.creator === creator.displayName || w.ownerId === creator.uid,
          );

          // Aggregate unique gives and asks
          const allGives = creatorProjects.flatMap((p: Workspace) =>
            Array.isArray(p.gives) ? p.gives : [],
          );
          const allAsks = creatorProjects.flatMap((p: Workspace) =>
            Array.isArray(p.asks) ? p.asks : [],
          );
          const uniqueGives = Array.from(
            new Set(allGives.filter((g): g is string => typeof g === "string")),
          );
          const uniqueAsks = Array.from(
            new Set(allAsks.filter((a): a is string => typeof a === "string")),
          );

          creatorMap.set(creator.uid, {
            creator,
            projects: creatorProjects.slice(0, 3), // Show up to 3 latest projects
            totalProjects: creatorProjects.length,
            gives: uniqueGives,
            asks: uniqueAsks,
          });
        }

        setCreatorsData(Array.from(creatorMap.values()));
      } catch (error) {
        console.error("Error loading creators:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadCreatorsWithProjects();
  }, []);

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("github")) {
      return Github;
    }
    if (platformLower.includes("linkedin")) {
      return Linkedin;
    }
    return Globe;
  };

  const getCreatorInitial = (name: string | null) => {
    if (!name) {
      return "?";
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-white/5 bg-gradient-to-b from-black via-black to-black/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
            Community Members
          </p>
          <h1 className={headingStyles({ level: "h1", weight: "bold" })}>
            Builders before logos
          </h1>
          <p className={bodyStyles({ variant: "lead" })}>
            Every member keeps a public footprint. Browse builders who have
            published projects, explore their work, and see what they offer and
            need.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full border-white/20">
              {loading
                ? "Loading..."
                : `${creatorsData.length}+ community ${creatorsData.length === 1 ? "member" : "members"}`}
            </Badge>
          </div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="mx-auto max-w-6xl text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-muted-foreground">
                Loading community members...
              </p>
            </div>
          </div>
        ) : creatorsData.length === 0 ? (
          <div className="mx-auto max-w-6xl text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No public creators yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Be the first to publish a project and join the community!
            </p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {creatorsData.map((data, index) => (
              <m.div
                key={data.creator.uid}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                {/* Creator Header */}
                <div className="border-b border-white/[0.06] p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                      {getCreatorInitial(data.creator.displayName)}
                    </div>

                    {/* Name & Connection */}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate text-xl font-bold text-foreground">
                        {data.creator.displayName || "Anonymous Builder"}
                      </h3>
                      {data.creator.buffaloConnection && (
                        <p className="text-sm text-muted-foreground">
                          {data.creator.buffaloConnection}
                        </p>
                      )}

                      {/* Project count */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        <span>
                          {data.totalProjects}{" "}
                          {data.totalProjects === 1 ? "project" : "projects"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {data.creator.bio && (
                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground/90">
                      {data.creator.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {data.creator.skills && data.creator.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {data.creator.skills.slice(0, 3).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-white/[0.1] bg-white/[0.05] text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {data.creator.skills.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-white/[0.1] bg-white/[0.05] text-xs"
                        >
                          +{data.creator.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Projects Preview */}
                {data.projects.length > 0 && (
                  <div className="border-b border-white/[0.06] p-6">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Recent Projects
                    </h4>
                    <div className="space-y-2">
                      {data.projects.map((project) => (
                        <Link
                          key={project.code}
                          href={getPublicProjectUrl(project)}
                          className="block rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.15] hover:bg-white/[0.05]"
                        >
                          <div className="flex items-start gap-3">
                            {/* Project thumbnail or initial */}
                            {project.assets?.coverImage ||
                            project.assets?.screenshots?.[0] ? (
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                                {(() => {
                                  const thumbSrc =
                                    project.assets?.coverImage ??
                                    project.assets?.screenshots?.[0];
                                  return (
                                    <Image
                                      src={thumbSrc as string}
                                      alt={project.projectName}
                                      fill
                                      className="object-cover"
                                    />
                                  );
                                })()}
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                                {project.projectName.charAt(0).toUpperCase()}
                              </div>
                            )}

                            {/* Project info */}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {project.projectName}
                              </p>
                              {project.oneLiner && (
                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                  {project.oneLiner}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gives & Asks */}
                {(data.gives.length > 0 || data.asks.length > 0) && (
                  <div className="p-6">
                    {/* Gives */}
                    {data.gives.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-400">
                          Offers
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {data.gives.slice(0, 4).map((give, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-green-500/20 bg-green-500/10 text-xs text-green-400"
                            >
                              {give}
                            </Badge>
                          ))}
                          {data.gives.length > 4 && (
                            <Badge
                              variant="outline"
                              className="border-green-500/20 bg-green-500/10 text-xs text-green-400"
                            >
                              +{data.gives.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Asks */}
                    {data.asks.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
                          Looking For
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {data.asks.slice(0, 4).map((ask, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-400"
                            >
                              {ask}
                            </Badge>
                          ))}
                          {data.asks.length > 4 && (
                            <Badge
                              variant="outline"
                              className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-400"
                            >
                              +{data.asks.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Links */}
                {data.creator.socialLinks &&
                  data.creator.socialLinks.length > 0 && (
                    <div className="border-t border-white/[0.06] p-6">
                      <div className="flex flex-wrap gap-2">
                        {data.creator.socialLinks.map((link, i) => {
                          const Icon = getSocialIcon(link.platform);
                          return (
                            <Link
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground transition hover:border-white/30 hover:text-white"
                            >
                              <Icon className="h-3 w-3" />
                              {link.platform}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </m.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
