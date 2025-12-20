import { nanoid } from "nanoid";

import type {
  CanvasState,
  Version,
  JournalEntry,
  Pivot,
  ChatMessage,
  ProjectDocument,
  ContextNote,
} from "../../../types";
import { ProjectCode } from "../../shared/value-objects/ProjectCode";

interface WorkspaceProps {
  code: ProjectCode;
  projectName: string;
  description: string;
  classCode?: string;
  bmcData?: CanvasState;
  isPublic?: boolean;
  publicLink?: string;
}

export interface WorkspaceDTO {
  code: string;
  projectName: string;
  description: string;
  bmcData: CanvasState;
  isPublic: boolean;
  publicLink?: string;
  createdAt: string;
  lastModified: string;
  versions: Version[];
  pivots: Pivot[];
  journal: JournalEntry[];
  chatMessages: ChatMessage[];
  documents: ProjectDocument[];
  contextNotes: ContextNote[];
  classCode?: string;
}

/**
 * Workspace Entity
 * Aggregate root for the Workspace bounded context
 * Enforces business rules and maintains consistency
 */
export class Workspace {
  private constructor(
    private readonly _code: ProjectCode,
    private _projectName: string,
    private _description: string,
    private _bmcData: CanvasState,
    private _isPublic: boolean,
    private _publicLink: string | undefined,
    private readonly _createdAt: string,
    private _lastModified: string,
    private _versions: Version[] = [],
    private _pivots: Pivot[] = [],
    private _journal: JournalEntry[] = [],
    private _chatMessages: ChatMessage[] = [],
    private _documents: ProjectDocument[] = [],
    private _contextNotes: ContextNote[] = [],
    private _classCode?: string,
  ) {}

  // Factory method
  static create(props: WorkspaceProps): Workspace {
    // Business rule: Project name cannot be empty
    if (!props.projectName || props.projectName.trim().length === 0) {
      throw new Error("Project name cannot be empty");
    }

    const now = new Date().toISOString();
    const emptyCanvas: CanvasState = {
      keyPartners: "",
      keyActivities: "",
      valuePropositions: "",
      customerRelationships: "",
      customerSegments: "",
      keyResources: "",
      channels: "",
      costStructure: "",
      revenueStreams: "",
    };

    return new Workspace(
      props.code,
      props.projectName,
      props.description,
      props.bmcData || emptyCanvas,
      props.isPublic || false,
      props.publicLink,
      now,
      now,
      [],
      [],
      [],
      [],
      [],
      [],
      props.classCode,
    );
  }

  // Getters
  get code(): ProjectCode {
    return this._code;
  }

  get projectName(): string {
    return this._projectName;
  }

  get description(): string {
    return this._description;
  }

  get bmcData(): CanvasState {
    return { ...this._bmcData };
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get publicLink(): string | undefined {
    return this._publicLink;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get lastModified(): string {
    return this._lastModified;
  }

  get versions(): Version[] {
    return [...this._versions];
  }

  get pivots(): Pivot[] {
    return [...this._pivots];
  }

  get journal(): JournalEntry[] {
    return [...this._journal];
  }

  get chatMessages(): ChatMessage[] {
    return [...this._chatMessages];
  }

  get documents(): ProjectDocument[] {
    return [...this._documents];
  }

  get contextNotes(): ContextNote[] {
    return [...this._contextNotes];
  }

  get classCode(): string | undefined {
    return this._classCode;
  }

  // Business methods
  updateCanvas(
    updates: Partial<CanvasState>,
    createVersion: boolean = false,
  ): void {
    this._bmcData = { ...this._bmcData, ...updates };
    this._lastModified = new Date().toISOString();

    if (createVersion) {
      this.createVersion();
    }
  }

  updateProjectInfo(name: string, description: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Project name cannot be empty");
    }

    this._projectName = name;
    this._description = description;
    this._lastModified = new Date().toISOString();
  }

  createVersion(snapshot?: string): Version {
    const version: Version = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      bmcData: { ...this._bmcData },
      projectDescription: this._description,
      ...(snapshot ? { snapshot } : {}),
    };

    this._versions.push(version);
    this._lastModified = new Date().toISOString();

    return version;
  }

  addJournalEntry(content: string, linkedVersion?: string): JournalEntry {
    if (!content || content.trim().length === 0) {
      throw new Error("Journal entry cannot be empty");
    }

    const entry: JournalEntry = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      content,
      ...(linkedVersion ? { linkedVersion } : {}),
    };

    this._journal.push(entry);
    this._lastModified = new Date().toISOString();

    return entry;
  }

  makePublic(publicLink?: string): void {
    this._isPublic = true;
    this._publicLink = publicLink;
    this._lastModified = new Date().toISOString();
  }

  makePrivate(): void {
    this._isPublic = false;
    this._publicLink = undefined;
    this._lastModified = new Date().toISOString();
  }

  addChatMessage(message: ChatMessage): void {
    this._chatMessages.push(message);
    this._lastModified = new Date().toISOString();
  }

  addDocument(document: ProjectDocument): void {
    this._documents.push(document);
    this._lastModified = new Date().toISOString();
  }

  addContextNote(note: ContextNote): void {
    this._contextNotes.push(note);
    this._lastModified = new Date().toISOString();
  }

  // Convert to persistence model
  toDTO(): WorkspaceDTO {
    return {
      code: this._code.value,
      projectName: this._projectName,
      description: this._description,
      bmcData: this._bmcData,
      isPublic: this._isPublic,
      ...(this._publicLink ? { publicLink: this._publicLink } : {}),
      createdAt: this._createdAt,
      lastModified: this._lastModified,
      versions: this._versions,
      pivots: this._pivots,
      journal: this._journal,
      chatMessages: this._chatMessages,
      documents: this._documents,
      contextNotes: this._contextNotes,
      ...(this._classCode ? { classCode: this._classCode } : {}),
    };
  }

  // Reconstruct from persistence model
  static fromDTO(data: WorkspaceDTO): Workspace {
    return new Workspace(
      ProjectCode.fromString(data.code),
      data.projectName,
      data.description,
      data.bmcData,
      data.isPublic,
      data.publicLink,
      data.createdAt,
      data.lastModified,
      data.versions || [],
      data.pivots || [],
      data.journal || [],
      data.chatMessages || [],
      data.documents || [],
      data.contextNotes || [],
      data.classCode,
    );
  }
}
