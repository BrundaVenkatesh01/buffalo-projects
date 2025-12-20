import type { Workspace } from "@/types";

// Returns a sanitized object containing only fields allowed in the public directory
// Note: Firestore-specific Timestamp conversion is handled at the call site.
export function toPublicProjectFields(
  workspace: Workspace,
): Record<string, unknown> {
  const safe: Record<string, unknown> = {};

  safe["code"] = workspace.code;
  safe["projectName"] = workspace.projectName;
  safe["description"] =
    workspace.description || workspace.projectDescription || "";
  safe["projectDescription"] =
    workspace.projectDescription || workspace.description || "";
  safe["createdAt"] = workspace.createdAt;
  safe["lastModified"] = workspace.lastModified;
  safe["isPublic"] = true;
  safe["views"] = workspace.views ?? 0;
  safe["appreciations"] = workspace.appreciations ?? 0;
  safe["commentCount"] = workspace.commentCount ?? 0;
  safe["workspaceCode"] = workspace.code;

  if (workspace.slug) {
    safe["slug"] = workspace.slug;
  }
  if (workspace.publishedAt) {
    safe["publishedAt"] = workspace.publishedAt;
  }

  if (workspace["publicLink"]) {
    safe["publicLink"] = workspace["publicLink"];
  }
  if (workspace["category"]) {
    safe["category"] = workspace["category"];
  }
  if (workspace["stage"]) {
    safe["stage"] = workspace["stage"];
  }
  if (workspace["location"]) {
    safe["location"] = workspace["location"];
  }
  if (typeof workspace["buffaloAffiliated"] === "boolean") {
    safe["buffaloAffiliated"] = workspace["buffaloAffiliated"];
  }
  if (workspace["tags"]) {
    safe["tags"] = workspace["tags"];
  }
  if (workspace["teamMembers"]) {
    safe["teamMembers"] = workspace["teamMembers"];
  }
  if (workspace["milestones"]) {
    safe["milestones"] = workspace["milestones"];
  }
  if (workspace["assets"]) {
    safe["assets"] = workspace["assets"];
  }
  if (workspace["embeds"]) {
    safe["embeds"] = workspace["embeds"];
  }
  if (workspace["creator"]) {
    safe["creator"] = workspace["creator"];
  }

  return safe;
}
