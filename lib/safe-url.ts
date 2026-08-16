/**
 * Allow only http(s), mailto, or same-origin relative paths.
 * Blocks javascript:, data:, vbscript:, protocol-relative //evil.
 */
export function isSafeContentUrl(value: string) {
  const url = value.trim();
  if (!url) return true;
  const lower = url.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("blob:")
  ) {
    return false;
  }

  if (url.startsWith("/")) {
    return !url.startsWith("//") && !url.includes("\\");
  }

  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:"
    );
  } catch {
    return false;
  }
}

export function isSafePreviewImageUrl(value: string) {
  const url = value.trim();
  if (!url) return true;
  if (!isSafeContentUrl(url)) return false;
  if (url.startsWith("/")) {
    return url.startsWith("/api/uploads/") || url.startsWith("/images/");
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const URL_KEYS = new Set([
  "url",
  "href",
  "src",
  "previewImage",
  "backgroundImage",
  "fileUrl",
  "downloadUrl",
]);

function sanitizeNode(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map(sanitizeNode);
  }
  if (!node || typeof node !== "object") {
    return node;
  }

  const record = node as Record<string, unknown>;
  const next: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && URL_KEYS.has(key)) {
      next[key] = isSafeContentUrl(value) ? value : "";
      continue;
    }
    if (key === "props" && value && typeof value === "object") {
      next[key] = sanitizeNode(value);
      continue;
    }
    next[key] = sanitizeNode(value);
  }

  return next;
}

/** Walk BlockNote-like JSON and neutralize unsafe URLs. */
export function sanitizeContentUrls(content: unknown) {
  return sanitizeNode(content);
}
