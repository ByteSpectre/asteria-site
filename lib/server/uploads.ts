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

export function getUploadDirectory() {
  const configuredDirectory = process.env.UPLOAD_DIR?.trim();
  return configuredDirectory ? path.resolve(configuredDirectory) : path.join(process.cwd(), "storage", "uploads");
}

export function isSafeUploadName(name: string) {
  return /^[0-9a-f-]+\.(?:jpg|png|webp|gif|pdf|mp4|webm|mp3|wav)$/.test(name);
}
