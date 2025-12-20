# Text Documents Support - Complete ✅

## Overview

Successfully extended the Documents section to support text-based context documents (TXT, MD, DOC), enabling users to provide rich project context beyond just visual evidence.

## What Was Added

### New Document Types

#### 1. **Plain Text (.txt)**

- **MIME Types**: `text/plain`
- **Max Size**: 2MB
- **Icon**: FileText (📄)
- **Gradient**: Blue (distinguishes from PDF)
- **Preview**: Full text content in monospace font
- **Use Cases**: Meeting notes, ideas, requirements, user feedback

#### 2. **Markdown (.md)**

- **MIME Types**: `text/markdown`, `text/x-markdown`
- **Max Size**: 2MB
- **Icon**: FileCode (📝)
- **Gradient**: Blue
- **Preview**: Raw markdown with syntax visible
- **Use Cases**: Project documentation, technical specs, README files, product requirements

#### 3. **Word Documents (.doc, .docx)**

- **MIME Types**: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Max Size**: 10MB
- **Icon**: Book (📖)
- **Gradient**: Blue
- **Preview**: Icon fallback (content extraction requires backend)
- **Use Cases**: Formal proposals, business plans, investor decks

## Implementation Details

### File Upload & Processing

**DocumentManager.tsx Changes**:

1. **Updated ACCEPTED_TYPES** to include text formats:

```typescript
const ACCEPTED_TYPES: Record<
  "image" | "video" | "pdf" | "txt" | "md" | "doc",
  { mime: string[]; maxBytes: number; label: string }
> = {
  // ... existing types ...
  txt: {
    mime: ["text/plain"],
    maxBytes: 2 * 1024 * 1024,
    label: "Text files (TXT) ≤ 2MB",
  },
  md: {
    mime: ["text/markdown", "text/x-markdown"],
    maxBytes: 2 * 1024 * 1024,
    label: "Markdown (MD) ≤ 2MB",
  },
  doc: {
    mime: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxBytes: 10 * 1024 * 1024,
    label: "Word docs (DOC, DOCX) ≤ 10MB",
  },
};
```

2. **Enhanced determineKind()** function:

```typescript
// Now checks MIME types and falls back to extensions
if (ACCEPTED_TYPES.txt.mime.includes(mime)) return "txt";
if (ACCEPTED_TYPES.md.mime.includes(mime)) return "md";
if (ACCEPTED_TYPES.doc.mime.includes(mime)) return "doc";

// Extension fallback
if (extension === "txt") return "txt";
if (["md", "markdown"].includes(extension)) return "md";
if (["doc", "docx"].includes(extension)) return "doc";
```

3. **Added readFileAsText()** helper:

```typescript
const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("File read error"));
    reader.readAsText(file);
  });
```

4. **Updated processFileUpload()** to read text files:

```typescript
const isTextFile = validation.kind === "txt" || validation.kind === "md";

if (isTextFile) {
  const textContent = await readFileAsText(file);
  extractedText = textContent; // Available for AI analysis
  content = textContent; // Stored for preview
} else {
  // Base64 for images/PDFs/videos
  const base64 = await readFileAsBase64(file);
  // ... existing logic
}
```

### Visual Components

#### DocumentCard.tsx

**Icon Selection**:

```typescript
const Icon =
  document.type === "video"
    ? Video
    : document.type === "pdf"
      ? FileText
      : document.type === "md"
        ? FileCode // NEW
        : document.type === "doc"
          ? Book // NEW
          : document.type === "txt"
            ? FileText // NEW
            : ImageIcon;
```

**Gradient Color**:

```typescript
const gradientClass =
  document.type === "txt" || document.type === "md" || document.type === "doc"
    ? "from-blue-500/10 to-blue-600/5" // Blue for text docs
    : "from-primary/10 to-primary/5"; // Primary for media
```

#### DocumentDetailDrawer.tsx

**Text Content Preview**:

```typescript
// Shows full content for TXT/MD files
if ((document.type === "txt" || document.type === "md") && document.content) {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5">
      <div className="max-h-[400px] overflow-y-auto p-6">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
          {document.content}
        </pre>
      </div>
    </div>
  );
}
```

#### EvidenceLinkingModal.tsx

**Content Preview in Modal**:

```typescript
// Shows first 500 characters of text content
if ((document.type === "txt" || document.type === "md") && document.content) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="h-full overflow-y-auto p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs text-foreground/80">
          {document.content.slice(0, 500)}
          {document.content.length > 500 && "..."}
        </pre>
      </div>
    </div>
  );
}
```

## User Experience

### Upload Flow

1. User drags/uploads a `.txt` or `.md` file
2. File is read as text (not base64)
3. Content is stored in both `content` and `extractedText` fields
4. Auto-linking algorithm analyzes filename
5. Document appears with blue gradient + appropriate icon
6. Badge shows link status (emerald/amber)

### Preview Flow

1. **Card View**: Hover → shows FileCode/FileText/Book icon with blue gradient
2. **Detail Drawer**: Click 👁️ → full scrollable text content in monospace
3. **Link Modal**: Click ⚡ → shows first 500 chars + block selector

### AI Integration

Text documents now feed directly into Canvas AI:

```typescript
// Canvas AI includes text content
const evidenceContext =
  linkedDocuments.length > 0
    ? `\n\nLinked Evidence (${linkedDocuments.length} documents):\n${linkedDocuments
        .map(
          (doc, idx) =>
            `${idx + 1}. ${doc.name}${doc.extractedText ? `\n   Content: ${doc.extractedText.slice(0, 500)}...` : ""}`,
        )
        .join("\n")}`
    : "";
```

## Use Cases

### 1. **Project Context Files**

- `README.md` - Project overview
- `CONTEXT.txt` - Background information
- `requirements.md` - Feature requirements
- `notes.txt` - Meeting notes

### 2. **Research & Feedback**

- `user-interviews.txt` - Interview transcripts
- `survey-results.md` - Survey findings
- `competitor-analysis.md` - Market research
- `feedback.txt` - User feedback compilation

### 3. **Technical Documentation**

- `architecture.md` - System architecture
- `api-spec.md` - API documentation
- `tech-stack.txt` - Technology decisions
- `deployment.md` - Deployment guide

### 4. **Business Documents**

- `pitch.docx` - Investor pitch deck
- `business-plan.doc` - Formal business plan
- `financials.txt` - Financial projections
- `strategy.md` - Go-to-market strategy

## Benefits

### For Users

1. **Richer Context**: Text documents provide narrative context beyond visual evidence
2. **Easy Upload**: Simple drag-and-drop for TXT/MD files
3. **Instant Preview**: See full content without downloading
4. **AI Analysis**: Text is available to Canvas AI for better suggestions
5. **Organized Evidence**: Link text docs to specific BMC blocks

### For Serial Entrepreneurs

1. **Documentation Culture**: Encourages writing down ideas and learnings
2. **Knowledge Base**: Build a library of project documentation
3. **Iteration History**: Track how thinking evolved over time
4. **Collaboration**: Share context with mentors and team
5. **Portfolio Building**: Demonstrate thoughtful planning

## Technical Insights

`★ Insight ─────────────────────────────────────`
**1. Binary vs Text Reading**: Using `readAsText()` for TXT/MD files preserves encoding and enables instant previews. Binary files (PDF, DOC) use `readAsDataURL()` for base64 encoding, which is required for proper rendering but creates larger payloads.

**2. Icon Semantic Mapping**: FileCode icon for Markdown signals "developer documentation," while Book icon for Word docs signals "formal business document." This visual hierarchy helps users quickly identify document types at a glance.

**3. Blue Gradient Distinction**: Using blue (vs primary) for text documents creates visual separation from media (images/videos). This cognitive grouping helps users understand that text docs provide _context_, while media provides _evidence_.
`─────────────────────────────────────────────────`

## Limitations & Future Work

### Current Limitations

1. **Word Documents**: Content extraction not yet implemented
   - Currently shows icon fallback only
   - Placeholder message: "Word document - content extraction requires backend processing"
   - Would need library like `mammoth.js` or backend API

2. **Markdown Rendering**: Shows raw markdown, not rendered HTML
   - Future: Could add rendered preview with markdown parser
   - Tradeoff: Raw markdown is simpler and more portable

3. **Text Encoding**: Assumes UTF-8 encoding
   - May have issues with other encodings
   - Future: Auto-detect encoding

### Future Enhancements

- [ ] Add `.rtf` (Rich Text Format) support
- [ ] Markdown rendering with syntax highlighting
- [ ] Word document content extraction (backend service)
- [ ] Full-text search across all documents
- [ ] Syntax highlighting for code snippets in MD
- [ ] Line numbers for text previews
- [ ] Copy-to-clipboard for text content
- [ ] Download as formatted HTML
- [ ] Version comparison for text documents

## Files Modified

1. ✅ `src/components/workspace/DocumentManager.tsx`
   - Added text MIME types and validation
   - Added `readFileAsText()` helper
   - Updated upload processing for text files

2. ✅ `src/components/workspace/DocumentCard.tsx`
   - Added FileCode and Book icons
   - Blue gradient for text documents

3. ✅ `src/components/workspace/DocumentDetailDrawer.tsx`
   - Text content preview with scrolling
   - Icon fallbacks for all text types

4. ✅ `src/components/workspace/EvidenceLinkingModal.tsx`
   - Text preview in modal (first 500 chars)
   - Icon updates for consistency

5. ✅ `src/types/index.ts` (already had the types)
   - `ProjectDocument` interface supports `content` and `extractedText`

## Testing Checklist

- [x] TypeScript compiles without errors
- [x] Upload validation accepts TXT/MD/DOC files
- [x] Text content is read and stored correctly
- [x] Icons display properly for each type
- [x] Blue gradient shows for text documents
- [x] Preview shows in detail drawer
- [x] Content preview in linking modal
- [x] Auto-linking works with text filenames
- [ ] E2E: Upload TXT → Link to block → Canvas AI uses content (pending user test)
- [ ] E2E: Upload MD with long content → Preview scrolls (pending user test)

## Validation Error Messages

Updated error message to include text document types:

```
"Unsupported file type. Upload images, videos, PDFs, or text documents (TXT, MD, DOC)."
```

## Summary

Text document support transforms the Evidence Library from a visual-only repository into a comprehensive knowledge base. Users can now upload:

- **Meeting notes** as TXT
- **Technical specs** as MD
- **Business plans** as DOC

This enables Buffalo Projects users to build richer context around their ventures, making the platform more valuable for serial entrepreneurs who need to document their journey comprehensively.

The implementation is clean, type-safe, and ready for production testing. 🎉

---

**Status**: ✅ Complete and ready for testing
**Impact**: High - Enables text-based project context and documentation
**Next Steps**: User testing, gather feedback on text preview UX
