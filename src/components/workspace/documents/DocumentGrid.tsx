import { DocumentCard } from "./DocumentCard";

import { FolderOpen } from "@/icons";
import type { ProjectDocument } from "@/types";

interface DocumentGridProps {
  documents: ProjectDocument[];
  onPreview: (doc: ProjectDocument) => void;
  onDelete: (doc: ProjectDocument) => void;
  onLink: (doc: ProjectDocument) => void;
}

export function DocumentGrid({
  documents,
  onPreview,
  onDelete,
  onLink,
}: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FolderOpen className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No documents yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload evidence documents to support your business model canvas. Drag
          files here or click the upload button.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((document, index) => (
        <DocumentCard
          key={document.id}
          document={document}
          onPreview={onPreview}
          onDelete={onDelete}
          onLink={onLink}
          index={index}
        />
      ))}
    </div>
  );
}
