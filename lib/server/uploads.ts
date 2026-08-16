import path from "node:path";

export const EDITOR_UPLOAD_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["application/pdf", ".pdf"],
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["audio/mpeg", ".mp3"],
  ["audio/wav", ".wav"],
]);

export const MAX_EDITOR_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_ADMIN_UPLOADS_PER_DAY = 80;

export function getUploadDirectory() {
  const configuredDirectory = process.env.UPLOAD_DIR?.trim();
  return configuredDirectory
    ? path.resolve(configuredDirectory)
    : path.join(process.cwd(), "storage", "uploads");
}

export function isSafeUploadName(name: string) {
  return /^[0-9a-f-]+\.(?:jpg|png|webp|gif|pdf|mp4|webm|mp3|wav)$/.test(name);
}

/** Resolve a file path and ensure it stays inside the upload directory. */
export function resolveSafeUploadPath(name: string) {
  if (!isSafeUploadName(name)) return null;
  const root = getUploadDirectory();
  const resolved = path.resolve(root, name);
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    return null;
  }
  return resolved;
}

export function getTrustedSiteOrigins() {
  const origins = new Set<string>();

  const configured = process.env.SITE_URL?.trim();
  if (configured) {
    try {
      origins.add(new URL(configured).origin);
    } catch {
      // ignore invalid SITE_URL
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "");
    origins.add(`https://${host}`);
  }

  const vercelBranch = process.env.VERCEL_BRANCH_URL?.trim();
  if (vercelBranch) {
    const host = vercelBranch.replace(/^https?:\/\//, "");
    origins.add(`https://${host}`);
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) {
    const host = vercelProd.replace(/^https?:\/\//, "");
    origins.add(`https://${host}`);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return origins;
}

export function isTrustedUploadOrigin(origin: string | null) {
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    return getTrustedSiteOrigins().has(originUrl.origin);
  } catch {
    return false;
  }
}
