import { marked } from "marked";

marked.setOptions({ breaks: true });

export function renderMarkdown(content: string | null | undefined): string {
  if (!content) return "";
  return marked.parse(content, { async: false }) as string;
}

export function formatDate(dateString: string, withTime = false): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
