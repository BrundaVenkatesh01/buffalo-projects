import { sanitizeHTMLContent, sanitizeURLInput } from "@/utils/sanitize";

const BOLD_PATTERN = /\*\*(.+?)\*\*/g;
const ITALIC_PATTERN = /(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g;
const UNDERSCORE_PATTERN = /_(.+?)_/g;
const STRIKETHROUGH_PATTERN = /~~(.+?)~~/g;
const CODE_PATTERN = /`([^`]+)`/g;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const applyInlineFormatting = (value: string): string => {
  let html = escapeHtml(value);

  html = html.replace(BOLD_PATTERN, "<strong>$1</strong>");
  html = html.replace(STRIKETHROUGH_PATTERN, "<del>$1</del>");
  html = html.replace(CODE_PATTERN, "<code>$1</code>");
  html = html.replace(ITALIC_PATTERN, "<em>$1</em>");
  html = html.replace(UNDERSCORE_PATTERN, "<em>$1</em>");

  html = html.replace(
    LINK_PATTERN,
    (_match: string, text: string, url: string) => {
      const safeUrl = sanitizeURLInput(url.trim());
      if (!safeUrl) {
        return escapeHtml(text);
      }

      const label = escapeHtml(text.trim());
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    },
  );

  return html;
};

export const markdownToHtml = (markdown: string): string => {
  if (!markdown.trim()) {
    return "";
  }

  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const fragments: string[] = [];

  let listBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }
    fragments.push(`<ul>${listBuffer.join("")}</ul>`);
    listBuffer = [];
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }
    const content = paragraphBuffer
      .map((line) => applyInlineFormatting(line))
      .join("<br />");
    fragments.push(`<p>${content}</p>`);
    paragraphBuffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trimEnd();

    if (!trimmed.trim()) {
      flushList();
      flushParagraph();
      return;
    }

    const listMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(`<li>${applyInlineFormatting(listMatch[1] ?? "")}</li>`);
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushList();
  flushParagraph();

  const html = fragments.join("");
  return sanitizeHTMLContent(html);
};
