"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@/components/unified";
import {
  ArrowLeft,
  Users,
  Copy,
  ExternalLink,
  BarChart3,
  Clock,
  FileText,
  Layers3,
  Download,
  Zap,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "@/icons";
import { groupService } from "@/services/groupService";
import { useAuthStore } from "@/stores/authStore";
import type { Group, Workspace } from "@/types";

// Export projects to CSV
function exportToCSV(projects: Workspace[], groupName: string) {
  const headers = ["Project Name", "Code", "Stage", "Canvas %", "Documents", "Last Updated"];

  const rows = projects.map(project => {
    const completion = calculateCanvasCompletion(project);
    const lastUpdated = new Date(project.lastModified || project.createdAt).toLocaleDateString();
    return [
      project.projectName,
      project.code,
      project.stage || "idea",
      `${completion}%`,
      (project.documents?.length || 0).toString(),
      lastUpdated,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${groupName.replace(/\s+/g, "_")}_projects.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate AI summary for a project
async function generateAISummary(project: Workspace): Promise<string> {
  const bmcFields = project.bmcData || {};
  const filledFields = Object.entries(bmcFields)
    .filter(([, value]) => value && String(value).trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const prompt = `Analyze this project and provide a brief 2-3 sentence summary of their progress and where they are in their journey. Be encouraging but honest.

Project: ${project.projectName}
Stage: ${project.stage || "idea"}
Canvas Completion: ${calculateCanvasCompletion(project)}%
Documents: ${project.documents?.length || 0}
Last Updated: ${formatDistanceToNow(new Date(project.lastModified || project.createdAt), { addSuffix: true })}

Business Model Canvas:
${filledFields || "No canvas data yet"}`;

  try {
    const response = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = (await response.json()) as { summary?: string };
    return data.summary ?? "Unable to generate summary";
  } catch {
    return "Unable to generate AI summary at this time.";
  }
}

// Calculate canvas completion (moved before usage)
function calculateCanvasCompletion(workspace: Workspace): number {
  const bmcFields = [
    "keyPartners",
    "keyActivities",
    "keyResources",
    "valuePropositions",
    "customerRelationships",
    "channels",
    "customerSegments",
    "costStructure",
    "revenueStreams",
  ];

  if (!workspace.bmcData) {
    return 0;
  }

  const filledFields = bmcFields.filter(
    (field) =>
      workspace.bmcData?.[field as keyof typeof workspace.bmcData] &&
      String(
        workspace.bmcData[field as keyof typeof workspace.bmcData]
      ).trim().length > 0
  ).length;

  return Math.round((filledFields / bmcFields.length) * 100);
}

interface GroupDashboardPageProps {
  params: Promise<{ code: string }>;
}

// Mock data for demo mode
const MOCK_GROUP: Group = {
  id: "demo-group",
  code: "DEMO01",
  name: "Fall 2024 Entrepreneurship Cohort",
  description: "Introduction to Entrepreneurship - Section A",
  ownerId: "demo-user",
  createdAt: "2024-09-01T00:00:00Z",
  updatedAt: new Date().toISOString(),
  members: [],
};

// Helper to create mock workspace with required fields
const createMockWorkspace = (data: Partial<Workspace>): Workspace => ({
  id: "",
  code: "",
  projectName: "",
  projectDescription: "",
  description: "",
  ownerId: "",
  userId: "",
  createdAt: "",
  lastModified: "",
  isPublic: false,
  journal: [],
  versions: [],
  pivots: [],
  documents: [],
  evidenceLinks: {},
  ...data,
} as Workspace);

const MOCK_PROJECTS: Workspace[] = [
  createMockWorkspace({
    id: "proj-1",
    code: "BUF-1234",
    projectName: "EcoTrack",
    description: "Sustainability tracking for small businesses",
    ownerId: "user-1",
    userId: "user-1",
    stage: "building",
    createdAt: "2024-09-15T00:00:00Z",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    bmcData: {
      valuePropositions: "Track carbon footprint easily",
      customerSegments: "Small retail businesses",
      channels: "Direct sales, partnerships",
      revenueStreams: "SaaS subscription",
      keyActivities: "Software development",
      keyResources: "Engineering team",
      keyPartners: "Environmental consultants",
      customerRelationships: "Self-service dashboard",
      costStructure: "Cloud hosting, development",
    },
    documents: [{id: "1", name: "pitch.pdf", type: "pdf", uploadedAt: "", url: "", size: 1024}],
  }),
  createMockWorkspace({
    id: "proj-2",
    code: "BUF-5678",
    projectName: "MealPrep AI",
    description: "AI-powered meal planning assistant",
    ownerId: "user-2",
    userId: "user-2",
    stage: "idea",
    createdAt: "2024-09-20T00:00:00Z",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    bmcData: {
      valuePropositions: "Personalized meal plans in seconds",
      customerSegments: "Busy professionals",
      channels: "",
      revenueStreams: "",
      keyActivities: "",
      keyResources: "",
      keyPartners: "",
      customerRelationships: "",
      costStructure: "",
    },
    documents: [],
  }),
  createMockWorkspace({
    id: "proj-3",
    code: "BUF-9012",
    projectName: "StudyBuddy",
    description: "Peer tutoring marketplace for college students",
    ownerId: "user-3",
    userId: "user-3",
    stage: "research",
    createdAt: "2024-09-18T00:00:00Z",
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    bmcData: {
      valuePropositions: "Find tutors instantly",
      customerSegments: "College students",
      channels: "Campus partnerships",
      revenueStreams: "Transaction fees",
      costStructure: "Platform development",
      keyActivities: "",
      keyResources: "",
      keyPartners: "",
      customerRelationships: "",
    },
    documents: [{id: "1", name: "research.pdf", type: "pdf", uploadedAt: "", url: "", size: 2048}, {id: "2", name: "survey.pdf", type: "pdf", uploadedAt: "", url: "", size: 512}],
  }),
  createMockWorkspace({
    id: "proj-4",
    code: "BUF-3456",
    projectName: "LocalFarms",
    description: "Farm-to-table delivery platform",
    ownerId: "user-4",
    userId: "user-4",
    stage: "testing",
    createdAt: "2024-09-12T00:00:00Z",
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    bmcData: {
      valuePropositions: "Fresh produce delivered weekly",
      customerSegments: "Health-conscious families",
      channels: "App, website",
      revenueStreams: "Delivery fees, subscriptions",
      keyActivities: "Logistics, farmer relations",
      keyResources: "Delivery network",
      keyPartners: "Local farms",
      costStructure: "Delivery costs",
      customerRelationships: "Personal delivery",
    },
    documents: [{id: "1", name: "mockups.pdf", type: "pdf", uploadedAt: "", url: "", size: 4096}, {id: "2", name: "business-plan.pdf", type: "pdf", uploadedAt: "", url: "", size: 3072}, {id: "3", name: "financials.pdf", type: "pdf", uploadedAt: "", url: "", size: 1536}],
  }),
  createMockWorkspace({
    id: "proj-5",
    code: "BUF-7890",
    projectName: "PetConnect",
    description: "Social network for pet owners",
    ownerId: "user-5",
    userId: "user-5",
    stage: "launching",
    createdAt: "2024-09-08T00:00:00Z",
    lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    bmcData: {
      valuePropositions: "Connect with local pet owners",
      customerSegments: "Dog and cat owners",
      channels: "App stores, social media",
      revenueStreams: "Premium features, ads",
      keyActivities: "Community building",
      keyResources: "Mobile app",
      keyPartners: "Pet stores, vets",
      costStructure: "Development, marketing",
      customerRelationships: "Community forums",
    },
    documents: [{id: "1", name: "launch-plan.pdf", type: "pdf", uploadedAt: "", url: "", size: 2560}],
  }),
];

// Stage colors
const STAGE_COLORS: Record<string, string> = {
  idea: "bg-purple-500/20 text-purple-400",
  research: "bg-blue-500/20 text-blue-400",
  planning: "bg-cyan-500/20 text-cyan-400",
  building: "bg-amber-500/20 text-amber-400",
  testing: "bg-orange-500/20 text-orange-400",
  launching: "bg-green-500/20 text-green-400",
  scaling: "bg-emerald-500/20 text-emerald-400",
};

export default function GroupDashboardPage({ params }: GroupDashboardPageProps) {
  const { code } = use(params);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [group, setGroup] = useState<Group | null>(null);
  const [projects, setProjects] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpanded = (code: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleGenerateSummary = async (project: Workspace) => {
    setLoadingSummary(project.code);
    try {
      const summary = await generateAISummary(project);
      setSummaries(prev => ({ ...prev, [project.code]: summary }));
      toast.success("AI summary generated");
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setLoadingSummary(null);
    }
  };

  const handleExportCSV = () => {
    if (group && projects.length > 0) {
      exportToCSV(projects, group.name);
      toast.success("Exported to CSV");
    }
  };

  useEffect(() => {
    const loadGroupData = async () => {
      // Demo mode - show mock data
      if (code.toLowerCase() === "demo" || code === "DEMO01") {
        setGroup(MOCK_GROUP);
        setProjects(MOCK_PROJECTS);
        setLoading(false);
        return;
      }

      try {
        // Load group info
        const groupData = await groupService.getGroup(code);
        if (!groupData) {
          toast.error("Group not found");
          router.push("/dashboard/groups");
          return;
        }

        // Check if user is the owner
        if (groupData.ownerId !== user?.uid) {
          toast.error("You don't have access to this group");
          router.push("/dashboard/groups");
          return;
        }

        setGroup(groupData);

        // Load all projects in the group
        const groupProjects = await groupService.getGroupProjects(code);
        setProjects(groupProjects);
      } catch (error) {
        console.error("Failed to load group data:", error);
        toast.error("Failed to load group data");
      } finally {
        setLoading(false);
      }
    };

    if (user || code.toLowerCase() === "demo" || code === "DEMO01") {
      void loadGroupData();
    }
  }, [code, user, router]);

  const copyGroupCode = () => {
    void navigator.clipboard.writeText(code);
    toast.success("Group code copied to clipboard");
  };

  // Calculate analytics
  const analytics = {
    totalProjects: projects.length,
    avgCompletion:
      projects.length > 0
        ? Math.round(
            projects.reduce(
              (acc, p) => acc + calculateCanvasCompletion(p),
              0
            ) / projects.length
          )
        : 0,
    stageDistribution: projects.reduce(
      (acc, p) => {
        const stage = p.stage || "idea";
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    recentActivity: projects.filter((p) => {
      const lastMod = new Date(p.lastModified || p.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastMod >= weekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="container max-w-6xl py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/groups")}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground mt-1">{group.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
            <span className="text-sm text-muted-foreground">Code:</span>
            <span className="font-mono font-bold tracking-widest">{code}</span>
            <Button variant="ghost" size="icon" onClick={copyGroupCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Layers3 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.avgCompletion}%</p>
                <p className="text-xs text-muted-foreground">Avg Canvas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.recentActivity}</p>
                <p className="text-xs text-muted-foreground">Active This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Object.keys(analytics.stageDistribution).length}
                </p>
                <p className="text-xs text-muted-foreground">Stages Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Distribution */}
      {Object.keys(analytics.stageDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Distribution</CardTitle>
            <CardDescription>
              How projects are distributed across stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.stageDistribution).map(
                ([stage, count]) => (
                  <Badge
                    key={stage}
                    variant="secondary"
                    className={STAGE_COLORS[stage] || ""}
                  >
                    {stage}: {count}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Projects</CardTitle>
          <CardDescription>
            Click on a project to view its full canvas and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Share your group code <span className="font-mono font-bold">{code}</span> with
                members. They&apos;ll add it to their projects to appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Stage
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Canvas
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Docs
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Last Updated
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const completion = calculateCanvasCompletion(project);
                    const isLoadingSummary = loadingSummary === project.code;
                    const isExpanded = expandedRows.has(project.code);
                    const hasSummary = summaries[project.code];
                    return (
                      <>
                        <tr
                          key={project.code}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{project.projectName}</p>
                              <p className="text-xs text-muted-foreground">
                                {project.code}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="secondary"
                              className={
                                STAGE_COLORS[project.stage || "idea"] || ""
                              }
                            >
                              {project.stage || "idea"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${completion}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {completion}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {project.documents?.length || 0}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(project.lastModified || project.createdAt),
                              { addSuffix: true }
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (!hasSummary) {
                                    void handleGenerateSummary(project);
                                  }
                                  toggleRowExpanded(project.code);
                                }}
                                disabled={isLoadingSummary}
                                title={hasSummary ? "Toggle AI summary" : "Generate AI summary"}
                              >
                                {isLoadingSummary ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Zap className="h-3 w-3" />
                                    {hasSummary && (
                                      isExpanded ? (
                                        <ChevronUp className="h-3 w-3 ml-1" />
                                      ) : (
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                      )
                                    )}
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/edit/${project.code}`)
                                }
                              >
                                View
                                <ExternalLink className="ml-2 h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded row for AI summary */}
                        {isExpanded && hasSummary && (
                          <tr key={`${project.code}-expanded`} className="bg-white/[0.02]">
                            <td colSpan={6} className="px-4 py-3">
                              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                                <div className="flex items-start gap-3">
                                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-white/80 leading-relaxed">
                                      {summaries[project.code]}
                                    </p>
                                    {/* Comment section */}
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                      <div className="flex items-center gap-2">
                                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                        <input
                                          type="text"
                                          placeholder="Add a note..."
                                          className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground/50 focus:outline-none"
                                          value={comments[project.code] || ""}
                                          onChange={(e) =>
                                            setComments((prev) => ({
                                              ...prev,
                                              [project.code]: e.target.value,
                                            }))
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
