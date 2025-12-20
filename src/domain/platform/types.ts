/**
 * Platform Domain Schema
 * ---------------------------------------------------------------------------
 * Type-safe representations of the Buffalo Projects platform entities.
 * These shapes align with the 10-day MVP blueprint and will replace the
 * legacy workspace-centric models as we migrate toward the new wedge
 * (builder canvas → mentor triage → qualified intros).
 */

export type EntityID = string;
export type ISODateString = string;

// ---------------------------------------------------------------------------
// User & Roles
// ---------------------------------------------------------------------------

export type PlatformRole = "user" | "mentor" | "admin";

export interface User {
  id: EntityID;
  name: string;
  email: string;
  handle?: string;
  avatarUrl?: string;
  isMentor?: boolean;
  createdAt: ISODateString;
  domains?: string[]; // Mentor expertise tags
  roles?: PlatformRole[]; // Explicit roles; mentor flag still supported
}

// ---------------------------------------------------------------------------
// RBAC Scopes
// ---------------------------------------------------------------------------

export type ProjectRole = "owner" | "editor" | "commenter" | "viewer";
export type GroupRole = "lead" | "admin" | "ta" | "member" | "guest";

export interface ProjectPermission {
  projectId: EntityID;
  userId: EntityID;
  role: ProjectRole;
}

export interface GroupPermission {
  groupId: EntityID;
  userId: EntityID;
  role: GroupRole;
}

// ---------------------------------------------------------------------------
// Core Entities
// ---------------------------------------------------------------------------

export type ProjectStage = "idea" | "wip" | "launched";
export type ProjectVisibility = "private" | "group" | "public";
export type ProjectLicense = "ARR" | "CC-BY-4.0" | "MIT" | "Apache-2.0";

export interface Project {
  id: EntityID;
  ownerId: EntityID;
  ownerType: "user" | "group";
  slug: string;
  title: string;
  oneLiner: string;
  stage: ProjectStage;
  asks: string[]; // Chips that drive mentor filters
  tags: string[];
  proof?: {
    users?: number;
    mrr?: number;
    pilot?: boolean;
    waitlist?: number;
  };
  featuredEvidenceId?: EntityID;
  evidence: Evidence[];
  updates: Update[];
  lastUpdatedAt: ISODateString;
  visibility: ProjectVisibility;
  license: ProjectLicense;
  allowBlueprint?: boolean;
  parentProjectId?: EntityID;
  createdAt: ISODateString;
}

export type EvidenceKind = "image" | "video" | "url" | "file";

export interface Evidence {
  id: EntityID;
  projectId: EntityID;
  kind: EvidenceKind;
  src: string;
  caption?: string;
  featured?: boolean;
  createdAt: ISODateString;
}

export type UpdateKind = "journal" | "milestone";
export type UpdateTag = "risk" | "next" | "bug" | "note";

export interface Update {
  id: EntityID;
  projectId: EntityID;
  kind: UpdateKind;
  body: string;
  tag?: UpdateTag;
  createdAt: ISODateString;
}

export type CommentPromptTag = "risk" | "next" | "resource" | "bug";
export type CommentVisibility = "public" | "project" | "group" | "private";

export interface Comment {
  id: EntityID;
  projectId: EntityID;
  authorId: EntityID;
  body: string;
  promptTag: CommentPromptTag;
  helpfulCount: number;
  pinned?: boolean;
  resolved?: boolean;
  createdAt: ISODateString;
  visibility: CommentVisibility;
}

export type GroupKind = "cohort" | "club" | "lab" | "org";
export type GroupJoinMode = "open" | "code" | "invite";

export interface Group {
  id: EntityID;
  name: string;
  kind: GroupKind;
  joinMode: GroupJoinMode;
  defaultVisibility: "group";
  leadIds: EntityID[];
  memberIds: EntityID[];
  createdAt: ISODateString;
}

export interface Checkpoint {
  cohortId: EntityID;
  key: string;
  label: string;
  criteria?: string;
}

export interface CheckpointStatus {
  projectId: EntityID;
  checkpointKey: string;
  status: "pass" | "needs";
  note?: string;
  updatedAt: ISODateString;
}

export type IntroOfferType = "customer" | "investor" | "operator";
export type IntroOfferStatus = "offered" | "accepted" | "declined";

export interface IntroOffer {
  id: EntityID;
  projectId: EntityID;
  mentorId: EntityID;
  type: IntroOfferType;
  note?: string;
  status: IntroOfferStatus;
  createdAt: ISODateString;
  acceptedAt?: ISODateString;
}

export type NudgeRuleType = "stale" | "noDemo" | "noAsk";

export interface NudgeRule {
  cohortId: EntityID;
  type: NudgeRuleType;
  days?: number;
  enabled: boolean;
}

export interface NudgeEvent {
  id: EntityID;
  projectId: EntityID;
  ruleType: NudgeRuleType;
  sentAt: ISODateString;
  payload?: Record<string, unknown>;
}

export interface Collection {
  id: EntityID;
  slug: string;
  title: string;
  description?: string;
  curatorId: EntityID;
  projectIds: EntityID[];
  createdAt: ISODateString;
}

export interface Digest {
  id: EntityID;
  groupId?: EntityID;
  weekOf: ISODateString;
  projectIds: EntityID[];
  notes?: string;
  html?: string;
  createdAt: ISODateString;
  publishedAt?: ISODateString;
  authorId?: EntityID;
}

// ---------------------------------------------------------------------------
// Ranking Signals
// ---------------------------------------------------------------------------

export interface RankingSignals {
  daysSinceUpdate: number;
  hasFeaturedDemo: boolean;
  proofSignal: number;
  mentorNotesCount: number;
  recentUpdateCount30d: number;
  stalenessPenalty: number;
}

// ---------------------------------------------------------------------------
// Publish Gate
// ---------------------------------------------------------------------------

export interface PublishGateStatus {
  hasOneLiner: boolean;
  hasFeaturedEvidence: boolean;
  hasAsk: boolean;
  canPublish: boolean;
  missing: Array<"oneLiner" | "featuredEvidence" | "ask">;
}

// ---------------------------------------------------------------------------
// Mentor Mode
// ---------------------------------------------------------------------------

export interface MentorFilter {
  industries?: string[];
  stages?: ProjectStage[];
  asks?: string[];
  proof?: ("demo" | "pilot" | "mrr")[];
  updatedWithinDays?: 7 | 14 | 30;
  affiliation?: "buffalo" | "external";
  tags?: string[];
}

export interface MentorCard {
  projectId: EntityID;
  oneLiner: string;
  topAsk?: string;
  featuredThumbnail?: string;
  lastUpdatedAt: ISODateString;
  stage: ProjectStage;
  proof?: Project["proof"];
  timeToSkimSeconds: number;
  shortlistStatus?: "shortlisted" | "none";
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

export const PublishGate = {
  evaluate(
    project: Pick<Project, "oneLiner" | "asks" | "featuredEvidenceId">,
    evidence: Evidence[],
  ): PublishGateStatus {
    const hasOneLiner = project.oneLiner.trim().length > 0;
    const hasAsk = project.asks.length > 0;
    const hasFeaturedEvidence =
      typeof project.featuredEvidenceId === "string" &&
      evidence.some((item) => item.id === project.featuredEvidenceId);

    const missing: PublishGateStatus["missing"] = [];
    if (!hasOneLiner) {
      missing.push("oneLiner");
    }
    if (!hasFeaturedEvidence) {
      missing.push("featuredEvidence");
    }
    if (!hasAsk) {
      missing.push("ask");
    }

    return {
      hasOneLiner,
      hasFeaturedEvidence,
      hasAsk,
      canPublish: missing.length === 0,
      missing,
    };
  },
} as const;

export const Ranking = {
  score(
    signals: RankingSignals,
    weights?: Partial<Record<keyof RankingSignals, number>>,
  ): number {
    const defaults: Record<keyof RankingSignals, number> = {
      daysSinceUpdate: -1,
      hasFeaturedDemo: 15,
      proofSignal: 20,
      mentorNotesCount: 5,
      recentUpdateCount30d: 10,
      stalenessPenalty: -25,
    };

    const w = { ...defaults, ...weights };
    return (
      w.daysSinceUpdate * signals.daysSinceUpdate +
      w.hasFeaturedDemo * (signals.hasFeaturedDemo ? 1 : 0) +
      w.proofSignal * signals.proofSignal +
      w.mentorNotesCount * signals.mentorNotesCount +
      w.recentUpdateCount30d * signals.recentUpdateCount30d +
      w.stalenessPenalty * signals.stalenessPenalty
    );
  },
} as const;
