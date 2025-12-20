import { createSlug } from "@/utils/slugGenerator";

export interface MentionCandidate {
  id: string;
  displayName: string;
  handle?: string;
  avatarUrl?: string;
}

interface CandidateIndex {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl?: string;
}

const HANDLE_PATTERN = /[^a-z0-9_]/gi;

export function toMentionHandle(value: string): string {
  const slug = createSlug(value);
  return slug.replace(HANDLE_PATTERN, "").toLowerCase();
}

export function indexMentionCandidates(
  candidates: MentionCandidate[],
): Map<string, CandidateIndex> {
  const map = new Map<string, CandidateIndex>();

  candidates.forEach((candidate) => {
    const handle =
      candidate.handle?.replace(HANDLE_PATTERN, "").toLowerCase() ??
      toMentionHandle(candidate.displayName);

    if (!handle) {
      return;
    }

    const entry: CandidateIndex = {
      id: candidate.id,
      displayName: candidate.displayName,
      handle,
      ...(candidate.avatarUrl ? { avatarUrl: candidate.avatarUrl } : {}),
    };

    map.set(handle, entry);
  });

  return map;
}

export function detectActiveTrigger(
  text: string,
  cursor: number,
): string | null {
  const slice = text.slice(0, cursor);
  const match = slice.match(/@([a-zA-Z0-9_]{0,32})$/);
  return match ? (match[1] ?? "") : null;
}

export function findMentionedUserIds(
  content: string,
  indexedCandidates: Map<string, CandidateIndex>,
): string[] {
  const mentions = new Set<string>();
  const regex = /@([a-z0-9_]{2,32})/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const handle = match[1]?.toLowerCase();
    if (!handle) {
      continue;
    }
    const candidate = indexedCandidates.get(handle);
    if (candidate) {
      mentions.add(candidate.id);
    }
  }

  return Array.from(mentions);
}

export function linkifyMentions(
  content: string,
  indexedCandidates: Map<string, CandidateIndex>,
  options: { basePath?: string } = {},
): string {
  const basePath = options.basePath ?? "/profiles";

  return content.replace(
    /@([a-z0-9_]{2,32})/gi,
    (original: string, handle: string) => {
      const normalized = handle.toLowerCase();
      const candidate = indexedCandidates.get(normalized);

      if (!candidate) {
        return original;
      }

      return `[${original}](${basePath}/${candidate.handle})`;
    },
  );
}

export interface MentionSuggestion {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl?: string;
}

export function buildMentionSuggestions(
  term: string,
  indexedCandidates: Map<string, CandidateIndex>,
): MentionSuggestion[] {
  const search = term.toLowerCase();

  return Array.from(indexedCandidates.values())
    .filter((candidate) => {
      if (!search) {
        return true;
      }

      return (
        candidate.handle.startsWith(search) ||
        candidate.displayName.toLowerCase().includes(search)
      );
    })
    .slice(0, 8);
}
