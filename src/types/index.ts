export type CanvasBlockId =
  | "keyPartners"
  | "keyActivities"
  | "valuePropositions"
  | "customerRelationships"
  | "customerSegments"
  | "keyResources"
  | "channels"
  | "costStructure"
  | "revenueStreams";

export interface CanvasBlockData {
  id: CanvasBlockId;
  title: string;
  description: string;
}

export type CanvasState = Record<CanvasBlockId, string>;

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export interface SavedVersion {
  id: string;
  timestamp: string;
  data: {
    projectDescription: string;
    canvasState: CanvasState;
  };
}

// Tool Data Types
export interface LeanCanvasData {
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProposition: string;
  unfairAdvantage: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

export interface InterviewSession {
  id: string;
  intervieweeName: string;
  date: string;
  duration: number;
  segment: string;
  responses: { [questionId: string]: string };
  insights: string[];
  actionItems: string[];
  rating: number; // 1-5 validation score
}

export interface MVPFeature {
  id: string;
  name: string;
  description: string;
  priority: "must-have" | "should-have" | "nice-to-have";
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  status: "idea" | "planned" | "in-progress" | "done";
  dependencies: string[];
  userStory: string;
  acceptanceCriteria: string[];
}

export interface MVPPlan {
  features: MVPFeature[];
  timeline: {
    phase: string;
    duration: number;
    features: string[];
  }[];
  resources: {
    team: string[];
    budget: number;
    timeline: number;
  };
  riskAssessment: {
    technical: string[];
    market: string[];
    resource: string[];
  };
}

// Enhanced Onboarding Context Types
export interface ProjectContext {
  // Buffalo Connection
  buffaloConnection: "resident" | "student" | "alumni" | "visitor" | "remote";
  buffaloDetails?: string; // UB, Canisius, local business, etc.

  // Venture Details
  industry:
    | "technology"
    | "retail"
    | "food-service"
    | "healthcare"
    | "education"
    | "consulting"
    | "manufacturing"
    | "arts"
    | "other";
  customIndustry?: string; // if other selected

  // Current Stage
  stage:
    | "idea"
    | "research"
    | "prototype"
    | "testing"
    | "launch-ready"
    | "launched";

  // Resources & Timeline
  timeCommitment: "part-time" | "full-time" | "evenings" | "weekends";
  timeline: "1-month" | "3-months" | "6-months" | "1-year" | "ongoing";
  teamSize: "solo" | "duo" | "small-team" | "large-team";
  budget: "bootstrap" | "small-budget" | "funded" | "well-funded";

  // Goals & Motivation
  primaryGoal:
    | "learning"
    | "side-income"
    | "full-business"
    | "portfolio"
    | "class-project";
  successMetrics?: string;
}

/**
 * Project Type - determines how the project is displayed and used
 * @type "showcase" - Portfolio-style public profile with external links and media
 * @type "workspace" - Full Business Model Canvas workspace with evidence management
 */
export type ProjectType = "showcase" | "workspace";

// New types for BuffaloProjects
export interface Workspace {
  /**
   * Firestore document ID - internal database identifier
   */
  id: string;

  /**
   * Human-readable project code (e.g., "BUF-X7K9")
   * Used in editor URLs: /workspace/[code]
   */
  code: string;

  /**
   * Project type determines feature set and display mode
   * - "showcase": Portfolio-style with external links
   * - "workspace": Full BMC editor with evidence management
   */
  projectType?: ProjectType;
  projectName: string;
  description: string;
  oneLiner?: string; // Short pitch line for cards
  createdAt: string;
  lastModified: string;
  isPublic: boolean;
  publishedAt?: number; // Timestamp when published
  isForTwentySix?: boolean; // Published for 26 under 26 program
  publicLink?: string | undefined;
  category?: ProjectCategory | undefined;
  ownerId?: string | undefined;
  userId?: string | undefined;

  // Enhanced Context
  context?: ProjectContext;

  // GitHub/External Stats
  githubStats?: {
    stars: number;
    forks: number;
    contributors: number;
    issues?: number;
    language?: string;
    topics?: string[];
    license?: string;
    lastCommit?: string;
    totalCommits?: number; // Shows sustained effort
  };

  // Class association
  classCode?: string; // Class this project belongs to

  // Tool states
  bmcData: CanvasState;
  leanCanvasData?: LeanCanvasData;
  interviews?: InterviewSession[];
  mvpPlan?: MVPPlan;
  projectDescription: string;
  journal: JournalEntry[];

  // Versioning
  versions: Version[];
  pivots: Pivot[];

  // AI Chat
  chatMessages: ChatMessage[];

  // Project Documents
  documents: ProjectDocument[];
  evidenceLinks?: Partial<Record<CanvasBlockId, string[]>> | undefined;

  // Context Notes
  contextNotes: ContextNote[];

  // Iframe Embeds (for mobile compatibility)
  iframeEmbeds?: IframeEmbed[];

  // Public Profile Fields
  creator?: string;

  /**
   * Problem statement - What problem is this project solving?
   * Used for public project page narrative (1-2 sentences)
   */
  problemStatement?: string;

  /**
   * @deprecated Use `asks` instead. This field will be removed in a future version.
   * What the project is looking for
   * Examples: "feedback", "collaborators", "funding", "mentors", "beta-users"
   */
  lookingFor?: string[];

  /**
   * Technologies and tools used in the project
   * Displayed as chips on public page
   */
  techStack?: string[];

  embeds?: {
    framer?: {
      url: string;
      embedCode?: string;
      title?: string;
      description?: string;
    };
    figma?: {
      url: string;
      title?: string;
    };
    codepen?: {
      url: string;
      penId?: string;
    };
    youtube?: {
      url: string;
      videoId?: string;
    };
    github?: {
      repoUrl: string;
      readmeUrl?: string;
    };
    website?: string;
    demo?: string;
    pitch?: string;
  };
  assets?: {
    logo?: string;
    screenshots?: string[];
    coverImage?: string;
  };
  tags?: string[] | undefined;

  /**
   * Current project stage in development lifecycle
   * Used for progress tracking and filtering
   */
  stage?: ProjectStage | undefined;

  /**
   * Project location/affiliation
   */
  location?: "buffalo" | "remote" | undefined;

  /**
   * Whether project is affiliated with Buffalo ecosystem
   */
  buffaloAffiliated?: boolean | undefined;

  /**
   * Whether workspace data is encrypted end-to-end
   */
  isEncrypted?: boolean;

  /**
   * Partial hash hint to verify encryption password
   */
  encryptionKeyHint?: string;

  /**
   * URL-friendly slug for public project pages
   * Used in public URLs: /p/[slug]
   * Auto-generated from projectName if not provided
   */
  slug?: string;

  /**
   * Number of times project has been viewed
   * Tracked for analytics and public display
   */
  views?: number;

  /**
   * Number of appreciations/likes received
   * User engagement metric
   */
  appreciations?: number;

  /**
   * Number of comments on project
   * Engagement metric for discussion activity
   */
  commentCount?: number;

  /**
   * Impact Metrics - Showcase success, not just activity
   * These are the numbers that impress employers, investors, and users
   */

  /**
   * Number of active users
   * The most important metric for product traction
   */
  users?: number;

  /**
   * Revenue generated (in dollars)
   * Proves business viability and market validation
   */
  revenue?: number;

  /**
   * Number of people on waitlist
   * Shows demand before launch
   */
  waitlistCount?: number;

  milestones?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  updates?: ProjectUpdate[];
  teamMembers?: Array<{
    name: string;
    role: string;
    linkedin?: string;
  }>;

  /**
   * What the creator can offer to the community
   * Examples: "product strategy", "frontend dev", "design feedback", "user research"
   * Displayed on public page for peer exchange/collaboration
   */
  gives?: string[];

  /**
   * What the creator is looking for from the community
   * Examples: "feedback", "co-founder", "design help", "user testers", "funding"
   * Used for peer-to-peer matching in discovery
   */
  asks?: string[];

  /**
   * Credits, thanks, and acknowledgments
   * Free-form text to thank supporters, advisors, inspirations
   */
  acknowledgments?: string;

  /**
   * Project-level social media links
   * Distinct from user profile social links
   */
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };

  /**
   * Publishing track chosen by user
   * - "quick": Minimal fields for fast sharing (name, description, category, stage)
   * - "full": Complete showcase with all 6 sections
   * - null/undefined: User hasn't chosen yet (show TrackSelector)
   */
  publishTrack?: "quick" | "full" | null;
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  userDisplayName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  mentions: string[];
}

export type NotificationType = "comment" | "mention" | "intro";

export interface Notification {
  id: string;
  userId: string;
  projectId: string;
  projectSlug?: string;
  projectName?: string;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  message: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
  link?: string;
}

export interface Version {
  id: string;
  timestamp: string;
  bmcData: CanvasState;
  projectDescription: string;
  snapshot?: string; // Brief description
  note?: string;
}

export interface Pivot {
  id: string;
  date: string;
  fromVersion: string;
  toVersion: string;
  fields: string[]; // Which BMC fields changed
  magnitude: "minor" | "major" | "complete";
  userNotes?: string;
  aiAnalysis?: string;
  impactScore?: number; // 0-100 score for mobile components
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  content: string;
  linkedVersion?: string;
}

export interface IframeEmbed {
  id: string; // Required for mobile components
  url: string;
  title: string;
  description?: string;
  type:
    | "framer"
    | "figma"
    | "codepen"
    | "youtube"
    | "vimeo"
    | "github_pages"
    | "vercel"
    | "netlify"
    | "custom";
  embedType?:
    | "framer"
    | "figma"
    | "codepen"
    | "youtube"
    | "vimeo"
    | "github_pages"
    | "vercel"
    | "netlify"
    | "custom"; // Legacy
  addedAt: string; // Required for mobile components
  dimensions?: {
    width?: number;
    height?: number;
    aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  };
  allowFeatures?: string[]; // ['autoplay', 'camera', 'microphone']
  isVerified?: boolean; // Security validation passed
}

export type ProjectDocumentKind =
  | "pdf"
  | "txt"
  | "md"
  | "doc"
  | "iframe_embed"
  | "image"
  | "video";

export interface ProjectDocument {
  id: string;
  name: string;
  type: ProjectDocumentKind;
  size: number; // For iframe embeds, this represents estimated data size
  uploadedAt: string;
  content?: string | undefined; // Extracted text content (for traditional docs)
  contentPreview?: string | undefined; // First 100 chars of content for quick display
  summary?: string | undefined; // AI-generated summary
  tags?: string[] | undefined; // Auto-generated tags
  storagePath?: string | undefined; // Firebase Storage path or download URL
  previewUrl?: string | undefined; // Thumbnail or data URL
  storageFullPath?: string | undefined;
  linkedFields?: CanvasBlockId[] | undefined;
  url?: string | undefined; // Public URL for document access
  extractedText?: string | undefined; // Full extracted text from document (for AI analysis)

  // iframe-specific fields
  iframeEmbed?: IframeEmbed | undefined;
}

export interface ContextNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
  category?:
    | "research"
    | "insight"
    | "competitor"
    | "customer"
    | "market"
    | "strategy"
    | "general"
    | "technical"
    | "feature"
    | "resource";
}

export type ProjectUpdateKind = "journal" | "milestone";
export type ProjectUpdateTag = "risk" | "next" | "bug" | "note";

export interface ProjectUpdate {
  id: string;
  kind: ProjectUpdateKind;
  body: string;
  createdAt: string;
  tag?: ProjectUpdateTag;
}

export interface PublicProject {
  code: string;
  name: string;
  description: string;
  link?: string;
  category: string;
  pivotCount: number;
  createdAt: string;
  lastModified: string;
  classInfo?: {
    name: string;
    instructor: string;
  };
}

// Public Profile with Embed Support
export interface PublicProfile {
  code: string;
  projectName: string;
  description: string;
  creator?: string;

  // Structured project data (safe to store)
  projectData: {
    bmcData?: CanvasState;
    leanCanvasData?: Record<string, unknown>;
    pivotHistory?: Pivot[];
    milestones?: Array<{
      date: string;
      title: string;
      description: string;
    }>;
    teamMembers?: Array<{
      name: string;
      role: string;
      linkedin?: string;
    }>;
  };

  // External embeds (just URLs, rendered in iframes)
  embeds: {
    framer?: {
      url: string;
      embedCode?: string;
      title?: string;
      description?: string;
    };
    figma?: {
      url: string;
      title?: string;
    };
    codepen?: {
      url: string;
      penId?: string;
    };
    youtube?: {
      url: string;
      videoId?: string;
    };
    github?: {
      repoUrl: string;
      readmeUrl?: string;
    };
    website?: string;
    demo?: string;
    pitch?: string; // Google Slides, etc.
  };

  // Controlled media assets
  assets: {
    logo?: string; // URL to stored image
    screenshots?: string[]; // Max 5 screenshots
    coverImage?: string; // Hero image for profile
  };

  // Metadata
  visibility: "public" | "private";
  tags: string[];
  category:
    | "startup"
    | "sideproject"
    | "opensource"
    | "student"
    | "research"
    | "tool";
  stage: ProjectStage;
  location?: "buffalo" | "remote";

  // Engagement
  views: number;
  appreciations: number;
  commentCount?: number;

  // Timestamps
  createdAt: string;
  lastModified: string;
  publishedAt?: string;
}

// Embed type detection
export type EmbedType =
  | "framer"
  | "figma"
  | "codepen"
  | "youtube"
  | "github"
  | "custom";

export interface EmbedConfig {
  type: EmbedType;
  url: string;
  sandbox?: string; // iframe sandbox attributes
  allowFullscreen?: boolean;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  height?: number;
  copyable?: boolean; // Shows copy embed code button
}

// Class Management Types
export interface ClassWorkspace {
  id: string;
  classCode: string; // "BUF-CLASS-SPRING24-ENT101"
  teacherCode: string; // "BUF-TEACH-XXXX" for teacher access
  name: string; // Display name (e.g., "Entrepreneurship 101")
  instructor: string;
  semester: string;
  year: number;
  isActive: boolean;

  // Settings
  allowPublicProjects: boolean;
  requireProjectSubmission: boolean;
  maxProjectsPerStudent?: number;

  // Dates
  startDate: string;
  endDate: string;
  createdAt: string;

  // Teacher permissions
  permissions: TeacherPermissions;

  // Student management
  studentWorkspaces: string[]; // Array of student BUF-XXXX codes
  assignments: Assignment[];

  // Analytics cache
  lastAnalyticsUpdate?: string;
  analytics?: ClassAnalytics;
}

export interface TeacherPermissions {
  canViewAllStudentWork: boolean;
  canEditStudentProjects: boolean;
  canCreateAssignments: boolean;
  canExportClassData: boolean;
  canManageStudentAccess: boolean;
  canViewPrivateNotes: boolean;
}

export interface ClassStudent {
  projectCode: string; // BUF-XXXX
  studentName?: string; // Optional, can be anonymous
  joinedAt: string;
  lastActive: string;
  projectCount: number;
  currentStage?: ProjectStage;
  completedAssignments: string[];
  isActive: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  requirements: AssignmentRequirement[];
  submissions: StudentSubmission[];
  isRequired: boolean;
  maxScore?: number;
}

export interface AssignmentRequirement {
  id: string;
  type:
    | "canvas_completion"
    | "journal_entry"
    | "version_count"
    | "pivot_analysis"
    | "custom";
  description: string;
  criteria: Record<string, unknown>; // Flexible criteria based on type
}

export interface StudentSubmission {
  studentCode: string;
  submittedAt: string;
  versionId?: string;
  notes?: string;
  status: "pending" | "completed" | "late" | "missing";
  grade?: number;
  feedback?: string;
}

export interface ClassAnalytics {
  totalStudents: number;
  activeStudents: number;
  totalProjects: number;
  activeProjects: number;
  averagePivots: number;
  averageVersions: number;
  engagementScore: number;
  completionRates: Record<string, number>;
  stageDistribution: Record<ProjectStage, number>;
  lastWeekActivity: number;
  commonChallenges: string[];
}

// Legacy interface for backward compatibility
export interface ClassInfo {
  id: string;
  code: string;
  name: string;
  instructor: string;
  institution?: string; // Added for institution tracking
  semester: string;
  year?: number;
  students?: ClassStudent[]; // Added for backward compatibility
  isActive?: boolean;
  allowPublicProjects?: boolean;
  requireProjectSubmission?: boolean;
  maxProjectsPerStudent?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  currentAssignment?: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    requirements: string[];
  };
}

// Group Management
export interface GroupMember {
  workspaceCode: string;
  projectName: string;
  participantName?: string;
  joinedAt: string;
  lastActivity: string;
  status: "active" | "invited" | "archived";
}

export interface Group {
  id: string;
  code: string;
  name: string;
  description?: string;
  ownerId?: string;
  semester?: string;
  institution?: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  memberIds?: string[]; // User UIDs for Firestore security rules
  assignments?: Assignment[];
  allowPublicProjects?: boolean;
  requireProjectSubmission?: boolean;
}

// Project Stages
export type ProjectStage =
  | "idea"
  | "research"
  | "planning"
  | "building"
  | "testing"
  | "launching"
  | "scaling";

// Project Categories
export type ProjectCategory =
  | "startup"
  | "design"
  | "research"
  | "indie"
  | "open-source"
  | "creative"
  | "other";

// User/Session Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  buffaloConnection?: string;
  areasOfInterest?: string[];
  skills?: string[]; // New: User skills and expertise
  socialLinks?: SocialLink[]; // New: Social media and professional links
  theme?: "dark" | "light";
  notificationsEnabled?: boolean;
  isMentor?: boolean;
  emailNotifications?: boolean;
  onboardingCompleted?: boolean;
  subscriptionTier?: "free" | "student" | "professional" | "institutional";
  subscriptionStatus?: "active" | "past_due" | "canceled" | "trialing";
  trialEndsAt?: string;
}

export interface SocialLink {
  platform: string; // e.g., "GitHub", "LinkedIn", "Twitter"
  url: string;
}

export interface UserSession {
  projectCode?: string;
  classCode?: string;
  lastAccessed: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "dark" | "light";
  autosave: boolean;
  notifications: boolean;
  emailNotifications?: boolean;
}

// TwentySix Program Types
export type {
  TwentySixResource,
  CreateTwentySixResourceInput,
  FirebaseTwentySixResource,
} from "./twentySix";
